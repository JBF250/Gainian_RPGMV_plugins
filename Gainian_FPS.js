/*:
 * @plugindesc MV 高帧率解锁 + 60/120/144硬锁帧（无报错稳定版）
 * @author JBF250
 * @target MV
 *
 * @param DefaultVSync
 * @text 默认开启垂直同步
 * @type boolean
 * @default false
 *
 * @param MaxFpsNoVSync
 * @text 关闭VSync时锁定帧率
 * @type number
 * @default 160
 * @min 30
 *
 * @param UnfocusedFpsLimit
 * @text 窗口失焦帧率
 * @type number
 * @default 30
 * @min 1
 *
 * @param VSyncSettingText
 * @text 设置界面显示文字
 * @type string
 * @default 垂直同步
 */

(function() {
    'use strict';

    // 参数读取
    const params = PluginManager.parameters('Gainian_FPS');
    const DEFAULT_VSYNC = params['DefaultVSync'] === 'true';
    const MAX_FPS_NO_VSYNC = Math.max(30, Math.floor(Number(params['MaxFpsNoVSync'] || 160)));
    const UNFOCUSED_LIMIT = Math.max(1, Math.floor(Number(params['UnfocusedFpsLimit'] || 30)));
    const VSYNC_TEXT = params['VSyncSettingText'] || '垂直同步';

    // 全局状态
    let vsyncEnabled = DEFAULT_VSYNC;
    let focused = true;
    let pluginReady = false;
    let frameTimer = null; // 锁帧定时器

    // 刷新率挡位配置
    let detectedRefreshRate = 60;
    let normalizedRefreshRate = 60; // 58/62→60，126→120，142→144

    // ==============================
    // 核心：刷新率检测+挡位归一
    // ==============================
    function normalizeRefreshRate(hz) {
        // 宽范围归一，避免检测误差
        if (hz >= 50 && hz <= 65) return 60;   // 58/62都归为60
        if (hz >= 110 && hz <= 130) return 120;// 126归为120
        if (hz >= 135 && hz <= 150) return 144;// 142归为144
        return 60; // 兜底60
    }

    function detectRefreshRate() {
        let startTime = performance.now();
        let frameCount = 0;

        // 采样30帧，减少误差
        function sampleFrame() {
            frameCount++;
            if (frameCount >= 30) {
                const endTime = performance.now();
                detectedRefreshRate = Math.round(1000 * frameCount / (endTime - startTime));
                normalizedRefreshRate = normalizeRefreshRate(detectedRefreshRate);
                console.log(`[FPS] 原始检测: ${detectedRefreshRate}Hz → 归一锁定: ${normalizedRefreshRate}Hz`);
                // 检测完成后立即应用锁帧
                applyFrameLock();
                return;
            }
            requestAnimationFrame(sampleFrame);
        }
        requestAnimationFrame(sampleFrame);
    }

    // ==============================
    // 核心：硬锁帧逻辑（定时器+原生渲染分离）
    // ==============================
    function applyFrameLock() {
        // 清除旧定时器，避免叠加
        if (frameTimer) {
            clearInterval(frameTimer);
            frameTimer = null;
        }

        if (!pluginReady || !SceneManager._scene) return;

        let targetFps, interval;
        // 确定目标帧率和定时器间隔
        if (vsyncEnabled) {
            targetFps = normalizedRefreshRate; // 开启VSync→锁归一后的刷新率
        } else {
            targetFps = focused ? MAX_FPS_NO_VSYNC : UNFOCUSED_LIMIT; // 关闭→锁160
        }
        interval = 1000 / targetFps; // 计算帧间隔（ms）

        // 定时器硬锁更新逻辑（不会掉帧）
        frameTimer = setInterval(() => {
            if (SceneManager._scene) {
                SceneManager.update(); // 只更新游戏逻辑，不渲染
            }
        }, interval);

        console.log(`[FPS] 锁帧生效 → ${targetFps}帧（间隔：${interval.toFixed(3)}ms）`);
    }

    // ==============================
    // 独立渲染循环（避免渲染和更新耦合导致掉帧）
    // ==============================
    function startRenderLoop() {
        function render() {
            // 修复报错：先判断_renderer是否存在，且用MV原生的Graphics._renderer
            if (Graphics._renderer && SceneManager._scene) {
                Graphics._renderer.render(SceneManager._scene);
            }
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    // ==============================
    // 插件初始化（等游戏完全加载）
    // ==============================
    const initChecker = setInterval(() => {
        // 确保Graphics、GameSystem、场景都初始化完成
        if (Graphics && Graphics._renderer && $gameSystem && SceneManager._scene) {
            clearInterval(initChecker);
            pluginReady = true;

            // 初始化存档状态
            if (!$gameSystem._fpsLockInit) {
                $gameSystem._fpsLockInit = true;
                $gameSystem._vsyncEnabled = DEFAULT_VSYNC;
                vsyncEnabled = DEFAULT_VSYNC;
            } else {
                vsyncEnabled = $gameSystem._vsyncEnabled;
            }

            // 启动渲染循环（独立于更新逻辑）
            startRenderLoop();

            // 检测刷新率并应用锁帧
            detectRefreshRate();

            // 覆盖原生requestUpdate，避免冲突
            SceneManager.requestUpdate = function() {};
        }
    }, 50);

    // ==============================
    // GameSystem接口（供设置界面调用）
    // ==============================
    Game_System.prototype.enableVSync = function() {
        if (!pluginReady) return;
        this._vsyncEnabled = true;
        vsyncEnabled = true;
        applyFrameLock();
    };

    Game_System.prototype.disableVSync = function() {
        if (!pluginReady) return;
        this._vsyncEnabled = false;
        vsyncEnabled = false;
        applyFrameLock();
    };

    Game_System.prototype.toggleVSync = function() {
        this._vsyncEnabled ? this.disableVSync() : this.enableVSync();
    };

    Game_System.prototype.isVSyncEnabled = function() {
        return this._vsyncEnabled ?? DEFAULT_VSYNC;
    };

    // ==============================
    // 窗口焦点监听（失焦降帧）
    // ==============================
    window.addEventListener('focus', () => {
        focused = true;
        if (pluginReady) applyFrameLock();
    });
    window.addEventListener('blur', () => {
        focused = false;
        if (pluginReady) applyFrameLock();
    });

    // ==============================
    // 游戏设置界面添加开关
    // ==============================
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(VSYNC_TEXT, 'vsync');
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === 'vsync') {
            return $gameSystem.isVSyncEnabled() ? '开启' : '关闭';
        }
        return _Window_Options_statusText.call(this, index);
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'vsync' && $gameSystem) {
            $gameSystem.toggleVSync();
            this.redrawItem(this.index());
            SoundManager.playOk();
            return;
        }
        _Window_Options_processOk.call(this);
    };

    // 方向键切换开关
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'vsync' && $gameSystem) {
            if (!$gameSystem.isVSyncEnabled()) {
                $gameSystem.enableVSync();
                this.redrawItem(this.index());
                SoundManager.playCursor();
            }
            return;
        }
        _Window_Options_cursorRight.call(this, wrap);
    };

    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'vsync' && $gameSystem) {
            if ($gameSystem.isVSyncEnabled()) {
                $gameSystem.disableVSync();
                this.redrawItem(this.index());
                SoundManager.playCursor();
            }
            return;
        }
        _Window_Options_cursorLeft.call(this, wrap);
    };

})();