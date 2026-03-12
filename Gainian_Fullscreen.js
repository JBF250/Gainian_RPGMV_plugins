//=============================================================================
// Gainian_Fullscreen.js
//=============================================================================
/*:
 * @plugindesc  V2.2 在设置菜单中添加显示模式切换选项
 * @author JBF250
 *
 * @param Display Mode Text
 * @text 显示模式文本
 * @desc 设置菜单中显示模式选项的显示文本
 * @type string
 * @default 显示模式
 *
 * @param Windowed Text
 * @text 窗口化文本
 * @desc 窗口化模式的显示文本
 * @type string
 * @default 窗口化
 *
 * @param Fullscreen Text
 * @text 全屏文本
 * @desc 全屏模式的显示文本
 * @type string
 * @default 全屏
 *
 * @help 此插件在游戏设置菜单中添加显示模式选项，
 * 玩家可以在窗口化和全屏两种模式之间循环切换。
 * 
 * 可以通过插件参数自定义选项文本。
 *
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 *
 * 更新日志
 * V1.0 完成插件
 * V2.0 增加显示模式循环切换功能，禁用F4，保存设置
 * V2.1 修复窗口模式实现，确保无边框模式正确移除边框，设置默认全屏
 * V2.2 移除无边框窗口模式，只保留窗口化和全屏两种模式
 */

(function() {
    'use strict';
    
    // 获取插件参数
    var parameters = PluginManager.parameters('Gainian_Fullscreen');
    var displayModeText = String(parameters['Display Mode Text'] || '显示模式');
    var windowedText = String(parameters['Windowed Text'] || '窗口化');
    var fullscreenText = String(parameters['Fullscreen Text'] || '全屏');
    
    // 添加显示模式命令文本
    TextManager.displayMode = displayModeText;
    TextManager.windowedMode = windowedText;
    TextManager.fullscreenMode = fullscreenText;
    
    // 显示模式常量
    var DISPLAY_MODE_WINDOWED = 0;
    var DISPLAY_MODE_FULLSCREEN = 1;
    
    // 保存原函数引用
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    var _Window_Options_drawItem = Window_Options.prototype.drawItem;
    var _ConfigManager_makeData = ConfigManager.makeData;
    var _ConfigManager_applyData = ConfigManager.applyData;
    var _Graphics__switchFullScreen = Graphics._switchFullScreen;
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    
    // 扩展配置管理器
    ConfigManager.displayMode = DISPLAY_MODE_FULLSCREEN; // 默认全屏
    
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.displayMode = this.displayMode;
        return config;
    };
    
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.displayMode = config.displayMode !== undefined ? config.displayMode : DISPLAY_MODE_FULLSCREEN;
        this.applyDisplayMode();
    };
    
    ConfigManager.applyDisplayMode = function() {
        switch (this.displayMode) {
            case DISPLAY_MODE_WINDOWED:
                Graphics.setWindowed();
                break;
            case DISPLAY_MODE_FULLSCREEN:
                Graphics.setFullScreen();
                break;
        }
    };
    
    // 扩展Graphics对象
    if (!Graphics.setWindowed) {
        Graphics.setWindowed = function() {
            if (Utils.isNwjs()) {
                var gui = require('nw.gui');
                var win = gui.Window.get();
                win.leaveFullscreen();
                console.log('切换到窗口模式');
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        };
    }
    
    if (!Graphics.setFullScreen) {
        Graphics.setFullScreen = function() {
            if (Utils.isNwjs()) {
                var gui = require('nw.gui');
                var win = gui.Window.get();
                win.enterFullscreen();
                console.log('切换到全屏模式');
            } else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        };
    }
    
    // 禁用F4按键
    Graphics._switchFullScreen = function() {
        // 空实现，禁用F4切换全屏
    };
    
    // 扩展命令列表
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(TextManager.displayMode, 'displayMode');
    };
    
    // 修改绘制方法，显示当前显示模式
    Window_Options.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        var statusWidth = this.statusWidth();
        var titleWidth = rect.width - statusWidth;
        
        var symbol = this.commandSymbol(index);
        if (symbol === 'displayMode') {
            // 绘制标题和当前显示模式
            this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, align);
            this.drawText(this.getDisplayModeText(), rect.x + titleWidth, rect.y, statusWidth, align);
        } else {
            _Window_Options_drawItem.call(this, index);
        }
    };
    
    // 获取显示模式文本
    Window_Options.prototype.getDisplayModeText = function() {
        switch (ConfigManager.displayMode) {
            case DISPLAY_MODE_WINDOWED:
                return TextManager.windowedMode;
            case DISPLAY_MODE_FULLSCREEN:
                return TextManager.fullscreenMode;
            default:
                return TextManager.windowedMode;
        }
    };
    
    // 处理选项选择
    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (this.currentSymbol() === 'displayMode') {
            this.toggleDisplayMode();
        } else {
            _Window_Options_processOk.call(this);
        }
    };
    
    // 切换显示模式
    Window_Options.prototype.toggleDisplayMode = function() {
        // 循环切换显示模式（只在窗口化和全屏之间切换）
        ConfigManager.displayMode = (ConfigManager.displayMode + 1) % 2;
        // 应用显示模式
        ConfigManager.applyDisplayMode();
        // 保存设置
        ConfigManager.save();
        // 刷新选项窗口
        this.refresh();
        // 播放选择音效
        SoundManager.playOk();
    };
    
    // 确保游戏启动时应用显示模式
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        // 延迟应用显示模式，确保游戏完全启动
        setTimeout(function() {
            ConfigManager.applyDisplayMode();
        }, 1000);
    };
})();