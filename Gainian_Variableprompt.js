//=============================================================================
// Gainian Variable Prompt Plugin
// Gainian_Variableprompt.js
// Version: 1.10
//=============================================================================

var Imported = Imported || {};
Imported.Gainian_VariablePrompt = true;

var Gainian = Gainian || {};
Gainian.VariablePrompt = Gainian.VariablePrompt || {};
Gainian.VariablePrompt.version = 1.10;

//=============================================================================
 /*:
 * @plugindesc v1.10 变量更改提示插件，当绑定的变量值发生变化时，在屏幕上显示流畅的动画提示
 * @author JBF250
 *
 * @param ---Variables---
 * @text ---变量设置---
 * @default
 *
 * @param Variable List
 * @text 变量列表
 * @parent ---Variables---
 * @type struct<VariableInfo>[]
 * @desc 绑定的变量信息，包括变量ID和显示名称
 * @default []
 *
 * @param ---Position---
 * @text ---位置设置---
 * @default
 *
 * @param Window X
 * @text 窗口X坐标
 * @parent ---Position---
 * @type number
 * @desc 提示窗口的X坐标
 * @default -200
 *
 * @param Window Y
 * @text 窗口Y坐标
 * @parent ---Position---
 * @type number
 * @desc 提示窗口的Y坐标
 * @default 100
 *
 * @param ---Animation---
 * @text ---动画设置---
 * @default
 *
 * @param Animation Type
 * @text 动画类型
 * @parent ---Animation---
 * @type select
 * @option fade
 * @option slide
 * @option zoom
 * @desc 窗口显示和消失时的动画效果：fade(渐入)、slide(滑动)、zoom(缩放)
 * @default fade
 *
 * @param Animation Duration
 * @text 动画持续时间
 * @parent ---Animation---
 * @type number
 * @desc 动画持续的帧数（60帧=1秒）
 * @default 30
 *
 * @param Display Duration
 * @text 显示持续时间
 * @parent ---Animation---
 * @type number
 * @desc 窗口完全显示后持续的帧数
 * @default 60
 *
 * @help
 * ============================================================================
 * 插件说明
 * ============================================================================
 *
 * 这个插件可以在绑定的变量值发生变化时，在屏幕上显示流畅的动画提示。
 * 适用于显示好感度、经验值等数值变化，让玩家可以直观地看到数值的变化。
 *
 * 【使用方法】
 * 1. 在插件参数中添加需要监控的变量，设置变量ID和显示名称
 * 2. 调整窗口的位置、动画效果和显示时间
 * 3. 当绑定的变量值发生变化时，插件会自动显示提示窗口
 *
 * 【插件指令】
 * 可以在事件中使用以下插件指令来切换动画类型：
 *
 *   GainianVariablePrompt SetAnimation fade
 *   GainianVariablePrompt SetAnimation slide
 *   GainianVariablePrompt SetAnimation zoom
 *
 * 【示例】
 * 例如，绑定变量ID为1的变量，显示名称为"好感度"：
 * 当变量1的值从20变为30时，屏幕左边会滑动出一个窗口，
 * 显示"好感度: 20"然后平滑过渡到"好感度: 30"，
 * 然后再滑动消失。
 */

//=============================================================================
// 插件参数
//=============================================================================

(function() {
    var parameters = PluginManager.parameters('Gainian_Variableprompt');
    
    Gainian.VariablePrompt.variableList = [];
    try {
        Gainian.VariablePrompt.variableList = JSON.parse(parameters['Variable List'] || '[]').map(function(item) {
            return JSON.parse(item);
        });
    } catch (e) {
        console.log('Gainian Variable Prompt: Error parsing variable list, using empty list');
    }
    
    Gainian.VariablePrompt.windowX = parseInt(parameters['Window X'] || -200);
    Gainian.VariablePrompt.windowY = parseInt(parameters['Window Y'] || 100);
    Gainian.VariablePrompt.animationType = parameters['Animation Type'] || 'fade';
    Gainian.VariablePrompt.animationDuration = parseInt(parameters['Animation Duration'] || 30);
    Gainian.VariablePrompt.displayDuration = parseInt(parameters['Display Duration'] || 60);
    
    // 存储变量的旧值
    Gainian.VariablePrompt.oldValues = {};
    
    // 延迟初始化变量旧值，确保$gameVariables已存在
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if ($gameVariables) {
            Gainian.VariablePrompt.variableList.forEach(function(variable) {
                var varId = parseInt(variable.variableId);
                Gainian.VariablePrompt.oldValues[varId] = $gameVariables.value(varId);
            });
        }
    };
    
    // 提示窗口
    Gainian.VariablePrompt.Windows = [];
    
    //=============================================================================
    // 变量监控
    //=============================================================================
    
    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        var oldValue = this.value(variableId);
        _Game_Variables_setValue.call(this, variableId, value);
        
        // 检查是否是绑定的变量，并且值发生了变化
        var isBoundVariable = Gainian.VariablePrompt.variableList.some(function(variable) {
            return parseInt(variable.variableId) === variableId;
        });
        
        if (isBoundVariable && oldValue !== value) {
            Gainian.VariablePrompt.showPrompt(variableId, oldValue, value);
        }
        
        // 更新旧值
        Gainian.VariablePrompt.oldValues[variableId] = value;
    };
    
    //=============================================================================
    // 提示窗口类
    //=============================================================================
    
    function Window_VariablePrompt() {
        this.initialize.apply(this, arguments);
    }
    
    Window_VariablePrompt.prototype = Object.create(Window_Base.prototype);
    Window_VariablePrompt.prototype.constructor = Window_VariablePrompt;
    
    Window_VariablePrompt.prototype.initialize = function(x, y, variableId, oldValue, newValue) {
        var variableInfo = Gainian.VariablePrompt.variableList.find(function(variable) {
            return parseInt(variable.variableId) === variableId;
        });
        
        this.variableName = variableInfo ? variableInfo.variableName : '变量' + variableId;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.animationCount = 0;
        this.state = 'show'; // show, display, hide
        this.displayState = 0; // 0: 仅显示名称, 1: 显示旧值, 2: 显示箭头, 3: 显示新值
        this.animationType = Gainian.VariablePrompt.animationType; // 使用创建时的动画类型
        
        // 先创建窗口，确保contents被初始化
        var width = 250; // 初始宽度
        var height = this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        
        // 计算窗口宽度，确保足够容纳所有内容
        var nameWidth = this.textWidth(this.variableName + ': ');
        var oldValueWidth = this.textWidth(this.oldValue.toString());
        var arrowWidth = this.textWidth('→');
        var newValueWidth = this.textWidth(this.newValue.toString());
        var totalWidth = nameWidth + oldValueWidth + arrowWidth + newValueWidth + this.padding * 2 + 40; // 额外40像素的边距，确保有足够空间
        var newWidth = Math.max(totalWidth, 300); // 最小宽度300像素，确保四个字的变量名称能完整显示
        
        // 如果需要，调整窗口宽度
        if (newWidth !== width) {
            this.width = newWidth;
            this.createContents(); // 重新创建内容
        }
        
        this.opacity = 0;
        this.contentsOpacity = 0;
        this.refresh();
    };
    
    Window_VariablePrompt.prototype.refresh = function() {
        this.contents.clear();
        var x = this.padding;
        var y = 0;
        
        // 显示变量名称
        this.drawText(this.variableName + ': ', x, y, this.width - this.padding * 2, 'left');
        var nameWidth = this.textWidth(this.variableName + ': ');
        x += nameWidth;
        
        // 根据显示状态逐个显示元素
        if (this.displayState >= 1) {
            this.drawText(this.oldValue.toString(), x, y, 40, 'left');
            x += 40;
        }
        
        if (this.displayState >= 2) {
            this.drawText('→', x, y, 30, 'left');
            x += 30;
        }
        
        if (this.displayState >= 3) {
            this.drawText(this.newValue.toString(), x, y, 40, 'left');
        }
    };
    
    Window_VariablePrompt.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        switch (this.state) {
            case 'show':
                this.updateShowAnimation();
                break;
            case 'display':
                this.updateDisplay();
                break;
            case 'hide':
                this.updateHideAnimation();
                break;
        }
    };
    
    Window_VariablePrompt.prototype.updateShowAnimation = function() {
        this.animationCount++;
        var rate = this.animationCount / Gainian.VariablePrompt.animationDuration;
        
        // 动画效果
        switch (this.animationType) {
            case 'slide':
                var startX = -200; // 固定从屏幕左侧外滑入
                this.x = startX + (0 - startX) * rate;
                this.opacity = 255;
                this.contentsOpacity = 255;
                break;
            case 'fade':
                this.opacity = 255 * rate;
                this.contentsOpacity = 255 * rate;
                // 固定位置，不滑动
                this.x = 0;
                break;
            case 'zoom':
                this.scale.x = rate;
                this.scale.y = rate;
                this.opacity = 255 * rate;
                this.contentsOpacity = 255 * rate;
                // 固定位置，不滑动
                this.x = 0;
                break;
        }
        
        // 逐个递进显示元素
        if (rate >= 0.25 && this.displayState < 1) {
            this.displayState = 1;
            this.refresh();
        }
        if (rate >= 0.5 && this.displayState < 2) {
            this.displayState = 2;
            this.refresh();
        }
        if (rate >= 0.75 && this.displayState < 3) {
            this.displayState = 3;
            this.refresh();
        }
        
        if (this.animationCount >= Gainian.VariablePrompt.animationDuration) {
            this.state = 'display';
            this.animationCount = 0;
            this.displayState = 3;
            this.refresh();
        }
    };
    
    Window_VariablePrompt.prototype.updateDisplay = function() {
        this.animationCount++;
        if (this.animationCount >= Gainian.VariablePrompt.displayDuration) {
            this.state = 'hide';
            this.animationCount = 0;
        }
    };
    
    Window_VariablePrompt.prototype.updateHideAnimation = function() {
        this.animationCount++;
        var rate = this.animationCount / Gainian.VariablePrompt.animationDuration;
        
        // 动画效果
        switch (this.animationType) {
            case 'slide':
                var endX = -200; // 固定滑出到屏幕左侧外
                this.x = 0 + (endX - 0) * rate;
                this.opacity = 255;
                this.contentsOpacity = 255;
                break;
            case 'fade':
                this.opacity = 255 * (1 - rate);
                this.contentsOpacity = 255 * (1 - rate);
                // 固定位置，不滑动
                this.x = 0;
                break;
            case 'zoom':
                this.scale.x = 1 - rate;
                this.scale.y = 1 - rate;
                this.opacity = 255 * (1 - rate);
                this.contentsOpacity = 255 * (1 - rate);
                // 固定位置，不滑动
                this.x = 0;
                break;
        }
        
        if (this.animationCount >= Gainian.VariablePrompt.animationDuration) {
            this.isClosing = true;
        }
    };
    
    //=============================================================================
    // 场景管理
    //=============================================================================
    
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        Gainian.VariablePrompt.updateWindows();
    };
    
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        Gainian.VariablePrompt.updateWindows();
    };
    
    //=============================================================================
    // 显示提示
    //=============================================================================
    
    Gainian.VariablePrompt.showPrompt = function(variableId, oldValue, newValue) {
        var window = new Window_VariablePrompt(
            Gainian.VariablePrompt.windowX,
            Gainian.VariablePrompt.windowY,
            variableId,
            oldValue,
            newValue
        );
        
        Gainian.VariablePrompt.Windows.push(window);
        
        // 根据当前场景添加窗口
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.addWindow(window);
        } else if (SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene.addWindow(window);
        }
    };
    
    Gainian.VariablePrompt.updateWindows = function() {
        // 清理已关闭的窗口
        Gainian.VariablePrompt.Windows = Gainian.VariablePrompt.Windows.filter(function(window) {
            return !window.isClosing;
        });
    };
    
    //=============================================================================
    // 插件指令
    //=============================================================================
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'GainianVariablePrompt') {
            switch (args[0]) {
                case 'SetAnimation':
                    var animationType = args[1];
                    if (['fade', 'slide', 'zoom'].includes(animationType)) {
                        Gainian.VariablePrompt.animationType = animationType;
                    }
                    break;
            }
        }
    };
    
})();

//=============================================================================
// 变量信息结构
//=============================================================================

/*~struct~VariableInfo:
 * @param variableId
 * @text 变量ID
 * @type variable
 * @desc 要监控的变量ID
 * 
 * @param variableName
 * @text 显示名称
 * @desc 显示在提示窗口中的变量名称（建议小于等于四个字）
 * @default 变量
 */