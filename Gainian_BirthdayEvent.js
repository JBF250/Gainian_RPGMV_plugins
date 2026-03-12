//=============================================================================
// Gainian_BirthdayEvent.js
// Version: 1.10
//=============================================================================

var Imported = Imported || {};
Imported.BirthdayEvent = true;

var BirthEvent = BirthEvent || {};
BirthEvent.version = '1.00';

//=============================================================================
/*:
 * @plugindesc v1.00 实现生日当天登录游戏有特殊事件的功能。
 * @author JBF250
 *
 * @param ---Settings---
 * @default
 *
 * @param Variable ID
 * @parent ---Settings---
 * @type number
 * @min 1
 * @desc 存储生日信息的变量ID（格式：MMDD，如1225表示12月25日）
 * @default 1
 *
 * @param Common Event ID
 * @parent ---Settings---
 * @type number
 * @min 1
 * @desc 生日当天触发的公共事件ID（0表示不使用公共事件）
 * @default 0
 *
 * @param Switch ID
 * @parent ---Settings---
 * @type number
 * @min 1
 * @desc 生日当天设置的开关ID（0表示不使用开关）
 * @default 1
 *
 * @param ---Input UI Settings---
 * @default
 *
 * @param UI Width
 * @parent ---Input UI Settings---
 * @type number
 * @min 100
 * @desc 生日输入界面的宽度
 * @default 640
 *
 * @param UI Height
 * @parent ---Input UI Settings---
 * @type number
 * @min 100
 * @desc 生日输入界面的高度
 * @default 360
 *
 * @param UI X
 * @parent ---Input UI Settings---
 * @type number
 * @desc 生日输入界面的X坐标（-1表示居中）
 * @default -1
 *
 * @param UI Y
 * @parent ---Input UI Settings---
 * @type number
 * @desc 生日输入界面的Y坐标（-1表示居中）
 * @default -1
 *
 * @param UI Title Text
 * @parent ---Input UI Settings---
 * @desc 生日输入界面的标题文本
 * @default 输入您的生日
 *
 * @param Month Label Text
 * @parent ---Input UI Settings---
 * @desc 月份标签文本
 * @default 月份：
 *
 * @param Day Label Text
 * @parent ---Input UI Settings---
 * @desc 日期标签文本
 * @default 日期：
 *
 * @param Complete Text
 * @parent ---Input UI Settings---
 * @desc 完成配置选项的文本
 * @default 完成配置
 *
 * @help
 * ============================================================================
 * 插件指令
 * ============================================================================
 *
 *   BirthdayEvent openInput
 *   - 打开生日输入界面，让玩家输入月份和日期
 *
 *   BirthdayEvent setDate MM DD
 *   - 直接设置生日（MM为月份，DD为日期）
 *   - 例如：BirthdayEvent setDate 12 25 设置生日为12月25日
 *
 * ============================================================================
 * 使用方法
 * ============================================================================
 * 1. 在插件参数中设置存储生日的变量ID和触发的公共事件ID
 * 2. 使用插件指令"BirthdayEvent openInput"打开输入界面，让玩家输入生日
 * 3. 每次游戏启动时，插件会自动检查当天是否为生日
 * 4. 如果是生日，会触发设置的公共事件
 *
 * ============================================================================
 * 注意事项
 * ============================================================================
 * - 生日信息以MMDD格式存储在变量中（如12月25日存储为1225）
 * - 请确保设置的变量ID和公共事件ID在游戏中存在
 * - 系统日期读取基于玩家本地电脑的日期设置
 * 
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 * 
 * 更新历史
 * 
 * V1.10修复若干bug
 * V1.00 完成插件
 */


//=============================================================================
(function() {
    'use strict';
    
    //-------------------------------------------------------------------------
    // 插件参数
    //-------------------------------------------------------------------------
    var parameters = PluginManager.parameters('Gainian_BirthdayEvent');
    BirthEvent.params = {
        variableId: Number(parameters['Variable ID'] || 1),
        commonEventId: Number(parameters['Common Event ID'] || 0),
        switchId: Number(parameters['Switch ID'] || 1),
        uiWidth: Number(parameters['UI Width'] || 640),
        uiHeight: Number(parameters['UI Height'] || 360),
        uiX: Number(parameters['UI X'] || -1),
        uiY: Number(parameters['UI Y'] || -1),
        uiTitleText: String(parameters['UI Title Text'] || '输入您的生日'),
        monthLabelText: String(parameters['Month Label Text'] || '月份：'),
        dayLabelText: String(parameters['Day Label Text'] || '日期：'),
        completeText: String(parameters['Complete Text'] || '完成配置')
    };
    
    //-------------------------------------------------------------------------
    // Game_Interpreter
    //-------------------------------------------------------------------------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'BirthdayEvent') {
            this.processBirthdayEventCommand(args);
        }
    };
    
    Game_Interpreter.prototype.processBirthdayEventCommand = function(args) {
        var subCommand = args[0];
        switch (subCommand) {
            case 'openInput':
                this.openBirthdayInput();
                break;
            case 'setDate':
                var month = Number(args[1]);
                var day = Number(args[2]);
                this.setBirthday(month, day);
                break;
            case 'debug':
                BirthEvent.debugInfo();
                // 显示调试信息
                if (typeof $gameMessage !== 'undefined' && $gameMessage !== null) {
                    var birthday = $gameVariables.value(BirthEvent.params.variableId);
                    var today = new Date();
                    var currentMonth = today.getMonth() + 1;
                    var currentDay = today.getDate();
                    var currentDate = currentMonth * 100 + currentDay;
                    
                    $gameMessage.add('生日设置: ' + birthday);
                    $gameMessage.add('当前日期: ' + currentDate);
                    $gameMessage.add('公共事件ID: ' + BirthEvent.params.commonEventId);
                    $gameMessage.add('开关ID: ' + BirthEvent.params.switchId);
                    $gameMessage.add('变量ID: ' + BirthEvent.params.variableId);
                }
                break;
        }
    };
    
    Game_Interpreter.prototype.openBirthdayInput = function() {
        var _this = this;
        Scene_BirthdayInput._callback = function(month, day) {
            _this.setBirthday(month, day);
        };
        SceneManager.push(Scene_BirthdayInput);
    };
    
    Game_Interpreter.prototype.setBirthday = function(month, day) {
        // 确保格式为MMDD（例如：2月20日存储为0220）
        var birthdayStr = ('0' + month).slice(-2) + ('0' + day).slice(-2);
        var birthday = parseInt(birthdayStr, 10);
        $gameVariables.setValue(BirthEvent.params.variableId, birthday);
    };
    
    BirthEvent.triggerBirthdayEvent = function() {
        // 确保游戏状态就绪
        if (typeof $gameSwitches !== 'undefined' && $gameSwitches !== null) {
            // 设置开关
            if (BirthEvent.params.switchId > 0) {
                $gameSwitches.setValue(BirthEvent.params.switchId, true);
            }
            
            // 触发公共事件（如果设置了）
            if (typeof $gameTemp !== 'undefined' && $gameTemp !== null) {
                if (BirthEvent.params.commonEventId > 0) {
                    if (typeof $dataCommonEvents !== 'undefined' && $dataCommonEvents !== null) {
                        if ($dataCommonEvents[BirthEvent.params.commonEventId]) {
                            $gameTemp.reserveCommonEvent(BirthEvent.params.commonEventId);
                        }
                    }
                }
            }
        }
    };
    
    //-------------------------------------------------------------------------
    // 生日检查函数
    //-------------------------------------------------------------------------
    BirthEvent.checkBirthday = function() {
        // 检查游戏状态是否就绪
        if (typeof $gameVariables === 'undefined' || $gameVariables === null) {
            return false;
        }
        
        var birthday = $gameVariables.value(BirthEvent.params.variableId);
        
        if (birthday > 0) {
            var today = new Date();
            var currentMonth = today.getMonth() + 1;
            var currentDay = today.getDate();
            
            // 计算当前日期（MMDD格式）
            var currentDate = currentMonth * 100 + currentDay;
            
            // 直接比较
            if (birthday === currentDate) {
                return true;
            }
        }
        return false;
    };
    
    // 调试方法：显示当前生日和系统日期
    BirthEvent.debugInfo = function() {
        // 调试信息已移除
    };
    

    
    //-------------------------------------------------------------------------
    // Scene_Map
    //-------------------------------------------------------------------------
    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        // 在地图场景启动时检查，此时游戏应该完全就绪
        if (BirthEvent.checkBirthday()) {
            BirthEvent.triggerBirthdayEvent();
        }
    };
    
    //-------------------------------------------------------------------------
    // Scene_BirthdayInput
    //-------------------------------------------------------------------------
    function Scene_BirthdayInput() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_BirthdayInput.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BirthdayInput.prototype.constructor = Scene_BirthdayInput;
    
    Scene_BirthdayInput.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._month = 1;
        this._day = 1;
    };
    
    Scene_BirthdayInput.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createInputWindow();
        this._inputWindow.activate();
    };
    
    Scene_BirthdayInput.prototype.createInputWindow = function() {
        var width = BirthEvent.params.uiWidth;
        var height = BirthEvent.params.uiHeight;
        var x = BirthEvent.params.uiX === -1 ? (Graphics.boxWidth - width) / 2 : BirthEvent.params.uiX;
        var y = BirthEvent.params.uiY === -1 ? (Graphics.boxHeight - height) / 2 : BirthEvent.params.uiY;
        
        this._inputWindow = new Window_BirthdayInput(x, y, width, height);
        this._inputWindow.setHandler('complete', this.onComplete.bind(this));
        this.addWindow(this._inputWindow);
    };
    
    Scene_BirthdayInput.prototype.onComplete = function() {
        // 播放确定音效
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playOk();
        }
        var month = this._inputWindow.month();
        var day = this._inputWindow.day();
        
        // 执行回调（通过回调设置生日，确保格式正确）
        if (Scene_BirthdayInput._callback) {
            Scene_BirthdayInput._callback(month, day);
            Scene_BirthdayInput._callback = null;
        } else {
            // 如果没有回调，直接设置生日
            if (typeof $gameVariables !== 'undefined' && $gameVariables !== null) {
                var birthdayStr = ('0' + month).slice(-2) + ('0' + day).slice(-2);
                var birthday = parseInt(birthdayStr, 10);
                $gameVariables.setValue(BirthEvent.params.variableId, birthday);
            }
        }
        
        SceneManager.pop();
    };
    
    //-------------------------------------------------------------------------
    // Window_BirthdayInput
    //-------------------------------------------------------------------------
    function Window_BirthdayInput() {
        this.initialize.apply(this, arguments);
    }
    
    Window_BirthdayInput.prototype = Object.create(Window_Base.prototype);
    Window_BirthdayInput.prototype.constructor = Window_BirthdayInput;
    
    Window_BirthdayInput.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._month = 1;
        this._day = 1;
        this._selectedIndex = 0; // 0 = month, 1 = day, 2 = complete
        this.refresh();
    };
    
    Window_BirthdayInput.prototype.refresh = function() {
        this.contents.clear();
        var lineHeight = this.lineHeight();
        var y = lineHeight;
        
        // 标题
        this.drawText(BirthEvent.params.uiTitleText, 20, y, this.width, 'left');
        y += lineHeight * 2;
        
        // 横向排列月份和日期
        var halfWidth = this.width / 2;
        var maxDay = this.getMaxDay(this._month);
        this.drawText(BirthEvent.params.monthLabelText + this._month, 20, y, halfWidth, 'left');
        this.drawText(BirthEvent.params.dayLabelText + this._day + ' (1-' + maxDay + ')', halfWidth, y, halfWidth, 'left');
        y += lineHeight * 2;
        
        // 完成配置选项
        this.drawText(BirthEvent.params.completeText, 20, y, this.width, 'left');
        
        // 绘制光标
        this.drawCursor();
    };
    
    Window_BirthdayInput.prototype.drawCursor = function() {
        var lineHeight = this.lineHeight();
        var y = lineHeight * 3;
        var halfWidth = this.width / 2;
        
        if (this._selectedIndex === 0) {
            this.setCursorRect(10, y, halfWidth - 15, lineHeight);
        } else if (this._selectedIndex === 1) {
            this.setCursorRect(halfWidth + 5, y, halfWidth - 15, lineHeight);
        } else {
            this.setCursorRect(10, y + lineHeight * 2, this.width - 20, lineHeight);
        }
    };
    
    Window_BirthdayInput.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this.active) {
            this.updateInput();
        }
    };
    
    Window_BirthdayInput.prototype.updateInput = function() {
        if (Input.isTriggered('left') || Input.isTriggered('right')) {
            if (this._selectedIndex < 2) {
                this._selectedIndex = (this._selectedIndex + 1) % 2;
                this.refresh();
                this.playCursorSound();
            }
        } else if (Input.isTriggered('up')) {
            if (this._selectedIndex < 2) {
                this.increaseValue();
                this.playCursorSound();
            }
        } else if (Input.isTriggered('down')) {
            if (this._selectedIndex < 2) {
                this.decreaseValue();
                this.playCursorSound();
            }
        } else if (Input.isTriggered('ok')) {
            if (this._selectedIndex === 2) {
                this.callHandler('complete');
            } else {
                // 按ENTER切换到完成配置选项
                this._selectedIndex = 2;
                this.refresh();
                this.playCursorSound();
            }
        } else if (Input.isTriggered('cancel')) {
            if (this._selectedIndex === 2) {
                // 按ESC从完成配置返回上一行
                this._selectedIndex = 0;
                this.refresh();
                this.playCursorSound();
            }
        }
    };
    
    Window_BirthdayInput.prototype.increaseValue = function() {
        if (this._selectedIndex === 0) {
            // 调整月份
            this._month = this._month % 12 + 1;
            // 重置日期为1
            this._day = 1;
        } else if (this._selectedIndex === 1) {
            // 调整日期
            var maxDay = this.getMaxDay(this._month);
            this._day = this._day % maxDay + 1;
        }
        this.refresh();
    };
    
    Window_BirthdayInput.prototype.decreaseValue = function() {
        if (this._selectedIndex === 0) {
            // 调整月份
            this._month = this._month - 1 < 1 ? 12 : this._month - 1;
            // 重置日期为1
            this._day = 1;
        } else if (this._selectedIndex === 1) {
            // 调整日期
            var maxDay = this.getMaxDay(this._month);
            this._day = this._day - 1 < 1 ? maxDay : this._day - 1;
        }
        this.refresh();
    };
    
    Window_BirthdayInput.prototype.playCursorSound = function() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCursor();
        }
    };
    
    Window_BirthdayInput.prototype.setHandler = function(symbol, method) {
        this._handlers = this._handlers || {};
        this._handlers[symbol] = method;
    };
    
    Window_BirthdayInput.prototype.callHandler = function(symbol) {
        if (this._handlers && this._handlers[symbol]) {
            this._handlers[symbol]();
        }
    };
    
    Window_BirthdayInput.prototype.getMaxDay = function(month) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[month - 1];
    };
    
    Window_BirthdayInput.prototype.month = function() {
        return this._month;
    };
    
    Window_BirthdayInput.prototype.day = function() {
        return this._day;
    };
    
})();