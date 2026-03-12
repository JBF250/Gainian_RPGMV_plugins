//=============================================================================
// Gainian_Gamepad.js
// Version: 1.21
//=============================================================================

var Imported = Imported || {};
Imported.GainianGamepad = true;

var Enhanced = Enhanced || {};
Enhanced.Gamepad = Enhanced.Gamepad || {};

//=============================================================================
 /*:
 * @plugindesc v1.21 为游戏提供高级的手柄操作，包括震动与摇杆控制鼠标
 * @author JBF250
 *
 * @param 设置名字
 * @desc 这是在主菜单中显示的选项名称。
 * @default 手柄设置
 *
 * @param 按钮名称
 * @desc 这是在配置菜单中显示的按钮名称。
 * @default 按钮 %1
 *
 * @param 确认按钮
 * @desc 这是确认按钮的命令名称。
 * @default 确定 / 对话
 *
 * @param 取消按钮
 * @desc 这是取消按钮的命令名称。
 * @default 取消
 *
 * @param 冲刺按钮
 * @desc 这是冲刺按钮的命令名称。
 * @default 冲刺
 *
 * @param 菜单按钮
 * @desc 这是菜单按钮的命令名称。
 * @default 菜单
 * 
 * @param 重置默认
 * @desc 这是重置按钮的命令名称。
 * @default 重置为默认
 *
 * @param 完成配置
 * @desc 这是完成按钮的命令名称。
 * @default 完成配置
 *
 * @param Xbox模式显示的图片
 * @desc 这是Xbox模式下显示的手柄图片路径。
 * @default img/gamepad/gamepad1.png
 * 
 * @param PlayStation模式显示的图片
 * @desc 这是PlayStation模式下显示的手柄图片路径。
 * @default img/gamepad/gamepad2.png
 * 
 * @param Switch模式显示的图片
 * @desc 这是Nintendo Switch模式下显示的手柄图片路径。
 * @default img/gamepad/gamepad3.png
 * 
 * @param 模拟鼠标左键
 * @desc 这是鼠标左键的命令名称。
 * @default 鼠标左键
 * 
 * @param 鼠标左键帮助
 * @desc 这是鼠标左键的帮助描述。
 * @default 模拟鼠标左键点击。
 * 
 * @param 手柄模式
 * @desc 设置手柄模式 (Xbox, PlayStation, or Nintendo Switch).
 * @type select
 * @option Xbox
 * @value xbox
 * @option PlayStation
 * @value playstation
 * @option Nintendo Switch
 * @value switch
 * @default xbox
 * 
 * @param 手柄震动强度
 * @desc 设置手柄震动强度 (25-100%).
 * @type number
 * @min 25
 * @max 100
 * @default 100
 * 
 * @param 启用手柄连接检测开关
 * @desc 检测到手柄后会打开指定的游戏开关。
 * @type number
 * @min 1
 * @max 999
 * @default 0
 *
 * @help
 * 如果检测到手柄，会在选项菜单中添加"手柄设置"选项。
 * 玩家可以通过可视化界面调整手柄按钮配置，并且每次游戏时会自动加载配置。
 * 
 * 此插件还支持兼容控制器的手柄震动功能。
 *
 * 请注意，如果在选项菜单或手柄配置菜单中未检测到手柄，游戏会自动将玩家弹出，
 * 以防止玩家被锁定在菜单中。
 * 
 * 要使用自定义手柄图像，请将图像文件放在指定路径，并相应更新"Gamepad Image"参数。
 * 
 * 手动触发震动的插件指令：
 * 
 * - GamepadVibration short
 *   短震动（500毫秒，0.7强度）
 * 
 * - GamepadVibration pulse
 *   脉冲震动（5次脉冲）
 * 
 * - GamepadVibration ramp
 *   渐强震动（1秒渐强）
 * 
 * - GamepadVibration bump
 *   碰撞震动（150毫秒，1.0强度）
 * 
 * - GamepadVibration stop
 *   停止所有震动
 * 
 * - GamepadVibration custom [持续时间] [强度]
 *   自定义震动
 *   示例：GamepadVibration custom 300 0.8
 *   表示：震动300毫秒，强度0.8
 * 
 * 手柄副摇杆控制鼠标指针功能：
 * - 左右摇杆可以控制鼠标指针移动
 * - 可以在手柄设置中配置鼠标左键模拟按键
 * - 默认使用手柄的扳机键作为鼠标左键
 * 
 * 手柄连接检测开关：
 * - 当检测到手柄连接时，会自动打开指定的游戏开关
 * - 可以在插件参数中设置开关ID（0表示禁用）
 * - 可用于根据是否连接手柄为不同玩家创建不同的游戏事件
 * 
 * 三种手柄模式对应的按键显示：
 * - Xbox模式：A/B/X/Y
 * - PlayStation模式：×/○/□/△
 * - Nintendo Switch模式：B/A/Y/X
 * 
 * 震动强度选项：
 * - 100%
 * - 75%
 * - 50%
 * - 25%
 * 
 * 本插件随意魔改，可免费用于商业或者非商业游戏，
 * 只需在游戏结束的致谢名单上加上本插件的作者JBF250即可。
 * 有的人会问，插件前缀不是Gainian吗，其实我有两个名字，
 * JBF250严格来讲是我的签名名，而Gainian是我的网名
 * 
 * 更新日志
 * V1.21可以与YEP的战斗序列中添加指令，使得攻击/技能也能有震动效果
 * V1.20提供副摇杆控制鼠标位置，以及手柄按键模拟鼠标点击的功能。
 * V1.15手柄震动模式增加，修复若干问题
 * V1.14屏幕左侧可显示手柄对应图片
 * V1.13添加了三种手柄模式，自由切换
 * V1.12在设置中添加了震动强度设置
 * V1.11修复了与QTE插件的冲突问题
 * V1.10支持手柄震动
 * V1.0完成插件
 */

//=============================================================================
// Gainian_Gamepad Parameters
//=============================================================================

Enhanced.Parameters = PluginManager.parameters('Gainian_Gamepad');
Enhanced.Param = Enhanced.Param || {};

Enhanced.Param.GamepadConfigName = String(Enhanced.Parameters['设置名字'] || '手柄设置');
Enhanced.Param.GamepadConfigButton = String(Enhanced.Parameters['按钮名称'] || '按钮 %1');
Enhanced.Param.GamepadConfigOkTx = String(Enhanced.Parameters['确认按钮'] || '确定 / 对话');
Enhanced.Param.GamepadConfigOkHelp = String(Enhanced.Parameters['确认帮助'] || '用于接受菜单操作和与人物对话。');
Enhanced.Param.GamepadConfigCancelTx = String(Enhanced.Parameters['取消按钮'] || '取消');
Enhanced.Param.GamepadConfigCancelHelp = String(Enhanced.Parameters['取消帮助'] || '用于取消菜单操作。');
Enhanced.Param.GamepadConfigShiftTx = String(Enhanced.Parameters['冲刺按钮'] || '冲刺');
Enhanced.Param.GamepadConfigShiftHelp = String(Enhanced.Parameters['冲刺帮助'] || '按住此按钮在场景中冲刺。');
Enhanced.Param.GamepadConfigMenuTx = String(Enhanced.Parameters['菜单按钮'] || '菜单');
Enhanced.Param.GamepadConfigMenuHelp = String(Enhanced.Parameters['菜单帮助'] || '从场景中访问主菜单。');
Enhanced.Param.GamepadConfigResetTx = String(Enhanced.Parameters['重置默认'] || '重置为默认');
Enhanced.Param.GamepadConfigResetHelp = String(Enhanced.Parameters['重置帮助'] || '将控制器恢复为默认设置。');
Enhanced.Param.GamepadConfigFinishTx = String(Enhanced.Parameters['完成配置'] || '完成配置');
Enhanced.Param.GamepadConfigFinishHelp = String(Enhanced.Parameters['完成帮助'] || '您是否完成了手柄配置？');
// 加载三种手柄模式的图片路径
Enhanced.Param.GamepadImages = {
    xbox: String(Enhanced.Parameters['Xbox模式显示的图片'] || 'img/gamepad/gamepad1.png'),
    playstation: String(Enhanced.Parameters['PlayStation模式显示的图片'] || 'img/gamepad/gamepad2.png'),
    switch: String(Enhanced.Parameters['Switch模式显示的图片'] || 'img/gamepad/gamepad3.png')
};
Enhanced.Param.GamepadConfigMouseLeftTx = String(Enhanced.Parameters['模拟鼠标左键'] || '鼠标左键');
Enhanced.Param.GamepadConfigMouseLeftHelp = String(Enhanced.Parameters['鼠标左键帮助'] || '模拟鼠标左键点击。');
// 游戏启动时暂时使用插件参数的默认值，后续会被ConfigManager覆盖
Enhanced.Param.GamepadMode = String(Enhanced.Parameters['手柄模式'] || 'xbox');
Enhanced.Param.VibrationIntensity = parseInt(Enhanced.Parameters['手柄震动强度'] || '100') / 100;
// 添加手柄连接检测开关参数
Enhanced.Param.GamepadSwitchId = parseInt(Enhanced.Parameters['启用手柄连接检测开关'] || '0');
// 确保GamepadTimer存在
Enhanced.Param.GamepadTimer = 0;

// 为三个手柄模式定义按键显示文本
Enhanced.Param.ButtonNames = {
    xbox: {
        0: 'A',
        1: 'B',
        2: 'X',
        3: 'Y',
        4: 'LB',
        5: 'RB',
        6: 'LT',
        7: 'RT',
        8: 'BACK',
        9: 'START',
        10: 'LS',
        11: 'RS',
        12: '↑',
        13: '↓',
        14: '←',
        15: '→'
    },
    playstation: {
        0: '×',
        1: '○',
        2: '□',
        3: '△',
        4: 'L1',
        5: 'R1',
        6: 'L2',
        7: 'R2',
        8: 'SHARE',
        9: 'OPTIONS',
        10: 'L3',
        11: 'R3',
        12: '↑',
        13: '↓',
        14: '←',
        15: '→'
    },
    switch: {
        0: 'B',
        1: 'A',
        2: 'Y',
        3: 'X',
        4: 'L',
        5: 'R',
        6: 'ZL',
        7: 'ZR',
        8: 'MINUS',
        9: 'PLUS',
        10: 'L3',
        11: 'R3',
        12: '↑',
        13: '↓',
        14: '←',
        15: '→'
    }
};

//=============================================================================
// Input
//=============================================================================

Input.getPressedGamepadButton = function() {
	if (Enhanced.Param.GamepadTimer > 0) {
		Enhanced.Param.GamepadTimer -= 1;
		return -1;
	}
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) {
					return this.gamepadButtonId(gamepad);
				}
			}
		}
  }
	return -1;
};

Input.gamepadButtonId = function(gamepad) {
  var buttons = gamepad.buttons;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].pressed) return i;
  }
	return -1;
};

Input.getGamepadButton = function(type) {
	// 检查Input.gamepadMapper是否存在
	if (!Input.gamepadMapper) {
		// 如果不存在，返回默认值
		var defaults = {
			'ok': 0,
			'cancel': 1,
			'shift': 2,
			'menu': 3,
			'pageup': 4,
			'pagedown': 5,
			'mouseLeft': 6
		};
		return defaults[type] || null;
	}
	
	// 遍历所有可能的按键ID
	for (var i = 0; i < 16; ++i) {
		if (Input.gamepadMapper[i] === type) return i;
	}
	return null;
};

// 添加全局鼠标位置变量
if (!window.GamepadMousePos) {
    window.GamepadMousePos = {
        x: 640, // 1280/2
        y: 360  // 720/2
    };
}

// 处理摇杆输入控制鼠标
Input.updateGamepadMouseControl = function() {
    try {
        // 检查是否在菜单场景中，如果是则禁用摇杆控制鼠标
        if (SceneManager._scene instanceof Scene_Menu || 
            SceneManager._scene instanceof Scene_Options || 
            SceneManager._scene instanceof Scene_GamepadConfig) {
            return;
        }
        
        if (navigator.getGamepads) {
            var gamepads = navigator.getGamepads();
            if (gamepads && gamepads.length > 0) {
                var gamepad = gamepads[0];
                if (gamepad && gamepad.connected) {
                    
                    // 尝试使用右摇杆（轴2和3）
                    if (gamepad.axes.length >= 4) {
                        var rightStickX = gamepad.axes[2];
                        var rightStickY = gamepad.axes[3];
                        
                        // 检查值是否有效
                        if (!isNaN(rightStickX) && !isNaN(rightStickY)) {
                            
                            // 应用死区处理
                            var deadZone = 0.2;
                            var processedX = Math.abs(rightStickX) > deadZone ? rightStickX : 0;
                            var processedY = Math.abs(rightStickY) > deadZone ? rightStickY : 0;
                            
                            // 设定速度系数
                            var sensitivity = 10;
                            var moveX = processedX * sensitivity;
                            var moveY = processedY * sensitivity;
                            
                            // 使用游戏实际分辨率1280*720
                            var gameWidth = 1280;
                            var gameHeight = 720;
                            
                            // 计算新的坐标 - 使用全局变量跟踪
                            var newX = window.GamepadMousePos.x + moveX;
                            var newY = window.GamepadMousePos.y + moveY;
                            
                            // 边界限制 - 使用实际游戏分辨率
                            newX = Math.max(0, Math.min(gameWidth, newX));
                            newY = Math.max(0, Math.min(gameHeight, newY));
                            
                            // 确保坐标值有效
                            if (!isNaN(newX) && !isNaN(newY) && isFinite(newX) && isFinite(newY)) {
                                // 更新全局鼠标位置
                                window.GamepadMousePos.x = newX;
                                window.GamepadMousePos.y = newY;
                                
                                // 同时更新TouchInput位置
                                TouchInput.x = newX;
                                TouchInput.y = newY;
                                
                                // 触发鼠标移动事件
                                if (Graphics._canvas) {
                                    // 获取canvas在屏幕上的位置
                                    var rect = Graphics._canvas.getBoundingClientRect();
                                    
                                    // 计算屏幕坐标
                                    var screenX = rect.left + (newX * (rect.width / gameWidth));
                                    var screenY = rect.top + (newY * (rect.height / gameHeight));
                                    
                                    // 确保屏幕坐标有效
                                    if (!isNaN(screenX) && !isNaN(screenY) && isFinite(screenX) && isFinite(screenY)) {
                                        // 创建并触发鼠标移动事件
                                        var event = new MouseEvent('mousemove', {
                                            clientX: screenX,
                                            clientY: screenY,
                                            bubbles: true,
                                            cancelable: true,
                                            view: window
                                        });
                                        Graphics._canvas.dispatchEvent(event);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error in gamepad mouse control:', e);
    }
};

Input.isControllerConnected = function() {
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) return true;
			}
		}
	}
	return false;
};

// 重写Input.update函数，添加游戏手柄鼠标控制
Enhanced.Gamepad.Input_update = Input.update;
Input.update = function() {
	Enhanced.Gamepad.Input_update.call(this);
	// 调用游戏手柄鼠标控制更新
	this.updateGamepadMouseControl();
	// 处理鼠标左键模拟
	this.updateGamepadMouseClick();
	// 处理手柄连接检测并打开对应开关
	this.updateGamepadSwitch();
};

// 处理手柄连接检测并打开对应开关
Input.updateGamepadSwitch = function() {
	// 检查是否启用了手柄开关功能，并且$gameSwitches已初始化
	if (Enhanced.Param.GamepadSwitchId > 0 && typeof $gameSwitches !== 'undefined' && $gameSwitches) {
		// 检查手柄是否连接
		var isConnected = this.isControllerConnected();
		// 设置对应开关的状态
		$gameSwitches.setValue(Enhanced.Param.GamepadSwitchId, isConnected);
	}
};

// 添加状态跟踪变量
if (!Input._gamepadMouseClickState) {
	Input._gamepadMouseClickState = {
		lastMouseLeftState: false,
		lastTriggerState: false,
		clickCooldown: 0
	};
}

// 处理手柄按键模拟鼠标左键点击
Input.updateGamepadMouseClick = function() {
	try {
		// 检查冷却时间
		if (Input._gamepadMouseClickState.clickCooldown > 0) {
			Input._gamepadMouseClickState.clickCooldown--;
			return;
		}
		
		// 检查mouseLeft按键是否被触发（按钮方式）
		var mouseLeftPressed = this.isPressed('mouseLeft');
		
		// 直接检查游戏手柄按钮状态，找到映射到mouseLeft的按钮
		var directMouseLeftPressed = false;
		if (navigator.getGamepads) {
			var gamepads = navigator.getGamepads();
			if (gamepads && gamepads.length > 0) {
				var gamepad = gamepads[0];
				if (gamepad && gamepad.connected) {
					// 查找映射到mouseLeft的按钮
					for (var j = 0; j < gamepad.buttons.length; j++) {
						if (Input.gamepadMapper[j] === 'mouseLeft' && gamepad.buttons[j].pressed) {
							directMouseLeftPressed = true;
							break;
						}
					}
				}
			}
		}
		
		// 同时检查扳机键（包括按钮和轴）
		var triggerPressed = false;
		if (navigator.getGamepads) {
			var gamepads = navigator.getGamepads();
			if (gamepads && gamepads.length > 0) {
				var gamepad = gamepads[0];
				if (gamepad && gamepad.connected) {
					// 检查扳机键按钮（通常是按钮6和7）
					for (var j = 6; j < Math.min(8, gamepad.buttons.length); j++) {
						if (gamepad.buttons[j].pressed) {
							triggerPressed = true;
							break;
						}
					}
					
					// 如果按钮没有触发，检查扳机键轴（通常是轴4和轴5）
					if (!triggerPressed && gamepad.axes.length >= 6) {
						for (var i = 4; i < 6; i++) {
							var axisValue = gamepad.axes[i];
							// 扳机键轴值通常在0到1之间
							if (axisValue > 0.3) { // 降低阈值，更容易触发
								triggerPressed = true;
								break;
							}
						}
					}
				}
			}
		}
		
		// 状态跟踪：检测按下状态的变化
		var isMouseLeftJustPressed = (mouseLeftPressed || directMouseLeftPressed) && !Input._gamepadMouseClickState.lastMouseLeftState;
		var isTriggerJustPressed = triggerPressed && !Input._gamepadMouseClickState.lastTriggerState;
		
		// 更新状态
		Input._gamepadMouseClickState.lastMouseLeftState = mouseLeftPressed || directMouseLeftPressed;
		Input._gamepadMouseClickState.lastTriggerState = triggerPressed;
		
		// 只有当按键刚刚被按下时才触发点击
		if (isMouseLeftJustPressed || isTriggerJustPressed) {
			// 保存按键按下时的鼠标位置
			var clickX = TouchInput.x || Graphics.width / 2;
			var clickY = TouchInput.y || Graphics.height / 2;
			
			// 立即模拟鼠标按下事件，使用按键按下时的位置
			TouchInput.x = clickX;
			TouchInput.y = clickY;
			TouchInput._pressed = true;
			TouchInput._triggered = true;
			TouchInput._moved = false;
			
			// 触发TouchInput事件 - 使用正确的方法
			// 模拟鼠标按下
			if (typeof TouchInput._onMouseDown === 'function') {
				// 创建一个模拟的鼠标事件对象
				var mockEvent = {
					clientX: clickX,
					clientY: clickY,
					button: 0
				};
				TouchInput._onMouseDown(mockEvent);
			}
			
			// 坐标转换：逻辑坐标 -> 屏幕物理坐标
			if (Graphics._canvas) {
				var rect = Graphics._canvas.getBoundingClientRect();
				var scaleX = rect.width / Graphics.width;
				var scaleY = rect.height / Graphics.height;
				
				// 计算屏幕物理坐标
				var screenX = rect.left + (clickX * scaleX);
				var screenY = rect.top + (clickY * scaleY);
				
				// 获取正确的canvas元素
				var canvas = document.querySelector('canvas') || Graphics._canvas;
				
				// 发送完整的事件序列
				// 1. 鼠标按下事件
				var mousedownEvent = new MouseEvent('mousedown', {
					clientX: screenX,
					clientY: screenY,
					button: 0, // 左键
					buttons: 1, // 左键按下状态
					bubbles: true,
					cancelable: true,
					view: window
				});
				canvas.dispatchEvent(mousedownEvent);
				
				// 2. 延迟发送鼠标释放和点击事件，模拟真实点击
				setTimeout(function() {
					// 鼠标释放事件（使用相同的位置）
					var mouseupEvent = new MouseEvent('mouseup', {
						clientX: screenX,
						clientY: screenY,
						button: 0,
						buttons: 0,
						bubbles: true,
						cancelable: true,
						view: window
					});
					canvas.dispatchEvent(mouseupEvent);
					
					// 鼠标点击事件（使用相同的位置）
					var clickEvent = new MouseEvent('click', {
						clientX: screenX,
						clientY: screenY,
						button: 0,
						bubbles: true,
						cancelable: true,
						view: window
					});
					canvas.dispatchEvent(clickEvent);
				}, 30); // 30ms延迟，模拟真实点击间隔
			}
			
			// 特殊处理地图场景，确保角色移动
			if (SceneManager._scene instanceof Scene_Map) {
				// 确保$gameMap和$gamePlayer存在
				if (typeof $gameMap !== 'undefined' && typeof $gamePlayer !== 'undefined') {
					// 转换屏幕坐标到地图坐标（使用按键按下时的位置）
					var mapX = Math.floor(clickX / $gameMap.tileWidth());
					var mapY = Math.floor(clickY / $gameMap.tileHeight());
					
					// 检查坐标是否有效
					if (mapX >= 0 && mapX < $gameMap.width() && mapY >= 0 && mapY < $gameMap.height()) {
						// 确保$gamePlayer有setDestination方法
						if (typeof $gamePlayer.setDestination === 'function') {
							// 让玩家角色移动到目标位置
							$gamePlayer.setDestination(mapX, mapY);
						}
					}
				}
			}
			
			// 延迟模拟鼠标释放，确保使用相同的位置
			setTimeout(function() {
				// 模拟鼠标释放，使用按键按下时的位置
				if (typeof TouchInput._onMouseUp === 'function') {
					// 创建一个模拟的鼠标事件对象
					var mockEvent = {
						clientX: clickX,
						clientY: clickY,
						button: 0
					};
					TouchInput._onMouseUp(mockEvent);
				}
				
				// 重置TouchInput状态
				TouchInput._pressed = false;
				TouchInput._triggered = false;
			}, 50);
			
			// 设置冷却时间，防止连续触发
			Input._gamepadMouseClickState.clickCooldown = 10;
		}
	} catch (e) {
		console.error('Error in gamepad mouse click:', e);
	}
};

//=============================================================================
// ConfigManager
//=============================================================================

ConfigManager.gamepadInput = {
	0: 'ok',
	1: 'cancel',
	2: 'shift',
	3: 'menu',
	5: 'mouseLeft', // 鼠标左键（绑定到R键）
	12: 'up',
	13: 'down',
	14: 'left',
	15: 'right',
};

ConfigManager.gamepadMode = 'xbox';
ConfigManager.vibrationIntensity = 1.0;

Enhanced.Gamepad.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
  var config = Enhanced.Gamepad.ConfigManager_makeData.call(this);
	config.gamepadInput = this.gamepadInput;
	config.gamepadMode = this.gamepadMode;
	config.vibrationIntensity = this.vibrationIntensity;
	return config;
};

Enhanced.Gamepad.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
  Enhanced.Gamepad.ConfigManager_applyData.call(this, config);
	this.gamepadInput = this.readGamepadConfig(config, 'gamepadInput');
	this.gamepadMode = this.readGamepadMode(config, 'gamepadMode');
	this.vibrationIntensity = this.readVibrationIntensity(config, 'vibrationIntensity');
	
	// 更新Enhanced.Param中的值，确保游戏启动时保持之前的设置
	Enhanced.Param.GamepadMode = this.gamepadMode;
	Enhanced.Param.VibrationIntensity = this.vibrationIntensity;
	
	// 更新QTE插件的手柄模式
	if (typeof XdRsData !== 'undefined' && XdRsData.qte && XdRsData.qte.setGamepadMode) {
		XdRsData.qte.setGamepadMode(this.gamepadMode);
	}
	
	this.applyGamepadConfig();
};

ConfigManager.applyGamepadConfig = function() {
	// 确保gamepadInput存在
	if (!this.gamepadInput) {
		this.gamepadInput = {
			0: 'ok',
			1: 'cancel',
			2: 'shift',
			3: 'menu',
			5: 'mouseLeft', // 默认绑定到R1键（通常是按钮5）
			12: 'up',
			13: 'down',
			14: 'left',
			15: 'right'
		};
	}
	
	// 确保ok键存在
	var hasOkButton = false;
	for (var key in this.gamepadInput) {
		if (this.gamepadInput[key] === 'ok') {
			hasOkButton = true;
			break;
		}
	}
	
	// 如果没有找到ok键绑定，设置默认值
	if (!hasOkButton) {
		this.gamepadInput[0] = 'ok';
	}
	
	// 确保mouseLeft键存在
	var hasMouseLeftButton = false;
	for (var key in this.gamepadInput) {
		if (this.gamepadInput[key] === 'mouseLeft') {
			hasMouseLeftButton = true;
			break;
		}
	}
	
	// 如果没有找到mouseLeft键绑定，设置默认值为R1键（通常是按钮5）
	if (!hasMouseLeftButton) {
		this.gamepadInput[5] = 'mouseLeft';
	}
	
	Input.gamepadMapper = this.gamepadInput;
	Input.update();
	Input.clear();
};

ConfigManager.readGamepadConfig = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return {
		0: 'ok',
		1: 'cancel',
		2: 'shift',
		3: 'menu',
		5: 'mouseLeft', // 鼠标左键（绑定到R键）
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right',
	};
    }
};

ConfigManager.readGamepadMode = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return 'xbox';
    }
};

ConfigManager.readVibrationIntensity = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return 1.0;
    }
};

//=============================================================================
// GamepadVibration
//=============================================================================

window.GamepadVibration = {};

// 基础震动函数
GamepadVibration.vibrate = function(duration, weakMagnitude, strongMagnitude) {
    var gamepad = navigator.getGamepads()[0];
    if (gamepad && gamepad.vibrationActuator) {
        try {
            // 应用震动强度设置
            var intensity = Enhanced.Param.VibrationIntensity;
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: duration,
                weakMagnitude: weakMagnitude * intensity,
                strongMagnitude: strongMagnitude * intensity
            });
            return true;
        } catch (e) {
            console.error("震动功能出错:", e);
            return false;
        }
    } else {
        console.log("手柄不支持震动功能或未连接");
        return false;
    }
};

// 短震动 (500ms, 0.7强度)
GamepadVibration.short = function() {
    return this.vibrate(500, 0.7, 0.7);
};

// 脉冲震动 (5次脉冲)
GamepadVibration.pulse = function() {
    var gamepad = navigator.getGamepads()[0];
    if (!gamepad || !gamepad.vibrationActuator) {
        console.log("手柄不支持震动功能或未连接");
        return false;
    }
    
    var count = 0;
    var maxPulses = 5;
    
    function doPulse() {
        if (count < maxPulses) {
            GamepadVibration.vibrate(100, 0.8, 0.8);
            count++;
            setTimeout(doPulse, 200);
        }
    }
    
    doPulse();
    return true;
};

// 渐强震动 (1秒渐强)
GamepadVibration.ramp = function() {
    var gamepad = navigator.getGamepads()[0];
    if (!gamepad || !gamepad.vibrationActuator) {
        console.log("手柄不支持震动功能或未连接");
        return false;
    }
    
    var intensity = 0.1;
    var duration = 1000;
    var steps = 10;
    var stepDuration = duration / steps;
    
    function doRamp(step) {
        if (step < steps) {
            GamepadVibration.vibrate(stepDuration, intensity, intensity);
            intensity += 0.09;
            setTimeout(function() { doRamp(step + 1); }, stepDuration);
        }
    }
    
    doRamp(0);
    return true;
};

// 碰撞震动 (150ms, 1.0强度)
GamepadVibration.bump = function() {
    return this.vibrate(150, 1.0, 1.0);
};

// 停止所有震动
GamepadVibration.stop = function() {
    var gamepad = navigator.getGamepads()[0];
    if (gamepad && gamepad.vibrationActuator) {
        try {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 0,
                weakMagnitude: 0,
                strongMagnitude: 0
            });
            return true;
        } catch (e) {
            console.error("停止震动出错:", e);
            return false;
        }
    }
    return false;
};

//=============================================================================
// Window_MenuCommand
//=============================================================================

Enhanced.Gamepad.Window_Options_addGeneralOptions =
	Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
  Enhanced.Gamepad.Window_Options_addGeneralOptions.call(this);
	this.addGameConfigCommand();
};

Window_Options.prototype.addGameConfigCommand = function() {
	if (Input.isControllerConnected()) {
		this.addCommand(Enhanced.Param.GamepadConfigName, 'gamepadConfig', true);
		this._addedController = true;
	}
};

Enhanced.Gamepad.Window_Options_update =
	Window_Options.prototype.update;
Window_Options.prototype.update = function() {
	Enhanced.Gamepad.Window_Options_update.call(this);
	if (this._addedController && !Input.isControllerConnected()) {
		this.refresh();
		this.height = this.windowHeight();
		this.updatePlacement();
	}
};

Enhanced.Gamepad.Window_Options_drawItem =
	Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function(index) {
    if (this.commandSymbol(index) === 'gamepadConfig') {
		var rect = this.itemRectForText(index);
		var text = this.commandName(index);
	    this.resetTextColor();
	    this.changePaintOpacity(this.isCommandEnabled(index));
	    this.drawText(text, rect.x, rect.y, rect.width, 'left');
	} else {
		Enhanced.Gamepad.Window_Options_drawItem.call(this, index);
	}
};

Enhanced.Gamepad.Window_Options_processOk =
	Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
  if (this.commandSymbol(this.index()) === 'gamepadConfig') {
		Window_Command.prototype.processOk.call(this);
	} else {
		Enhanced.Gamepad.Window_Options_processOk.call(this);
	}
};

//=============================================================================
// Window_GamepadVisualConfig
//=============================================================================

function Window_GamepadVisualConfig() {
    this.initialize.apply(this, arguments);
}

Window_GamepadVisualConfig.prototype = Object.create(Window_Command.prototype);
Window_GamepadVisualConfig.prototype.constructor = Window_GamepadVisualConfig;

Window_GamepadVisualConfig.prototype.initialize = function(helpWindow) {
	var wy = helpWindow ? helpWindow.height : 0;
	this._helpWindow = helpWindow;
	Window_Command.prototype.initialize.call(this, 0, wy);
	this.refresh();
	this.activate();
	this.select(0);
	// 初始化时更新帮助文本
	this.updateHelp();
};

// 重写select函数，确保更新帮助文本
Window_GamepadVisualConfig.prototype.select = function(index) {
	Window_Command.prototype.select.call(this, index);
	this.updateHelp();
};

Window_GamepadVisualConfig.prototype.windowWidth = function() {
    return Graphics.boxWidth / 2;
};

Window_GamepadVisualConfig.prototype.windowHeight = function() {
    return Graphics.boxHeight - (this._helpWindow ? this._helpWindow.height : 0);
};

Window_GamepadVisualConfig.prototype.makeCommandList = function(index) {
	for (var i = 0; i < 4; ++i) {
		var text = this.getButtonTypeText(i);
		if (text) {
			this.addCommand(text, 'button', true);
		}
	}
	// 添加鼠标左键配置
	var mouseLeftText = Enhanced.Param.GamepadConfigMouseLeftTx || '鼠标左键';
	this.addCommand(mouseLeftText, 'button', true);
	this.addCommand('', 'filler', true);
	// 添加手柄模式设置
	var modeText = this.getGamepadModeText() || 'Xbox';
	this.addCommand('手柄模式: ' + modeText, 'gamepadMode', true);
	// 添加震动强度设置
	var intensityText = Math.round((Enhanced.Param.VibrationIntensity || 1) * 100) + '%';
	this.addCommand('震动强度: ' + intensityText, 'vibrationIntensity', true);
	this.addCommand('', 'filler', true);
	// 添加重置和完成按钮
	var resetText = Enhanced.Param.GamepadConfigResetTx || '重置为默认';
	var finishText = Enhanced.Param.GamepadConfigFinishTx || '完成配置';
	this.addCommand(resetText, 'reset', true);
	this.addCommand(finishText, 'finish', true);
};

Window_GamepadVisualConfig.prototype.drawItem = function(index) {
	if (index > 4) {
		Window_Command.prototype.drawItem.call(this, index);
	} else {
		var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
		var ww = rect.width / 2;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, ww, align);
		var text = this.getButtonConfig(index);
		this.drawText(text, rect.x + ww, rect.y, ww, align);
	}
};

Window_GamepadVisualConfig.prototype.getButtonTypeText = function(index) {
	if (index === 0) return Enhanced.Param.GamepadConfigOkTx || '确定 / 对话';
	if (index === 1) return Enhanced.Param.GamepadConfigCancelTx || '取消';
	if (index === 2) return Enhanced.Param.GamepadConfigShiftTx || '冲刺';
	if (index === 3) return Enhanced.Param.GamepadConfigMenuTx || '菜单';
	if (index === 4) return Enhanced.Param.GamepadConfigMouseLeftTx || '鼠标左键';
	if (index === 5) return Enhanced.Param.GamepadConfigResetTx || '重置为默认';
	if (index === 6) return Enhanced.Param.GamepadConfigFinishTx || '完成配置';
	return '';
};

Window_GamepadVisualConfig.prototype.getButtonConfig = function(index) {
	if (index > 4) return '';
	var key = this.getButtonKey(index);
	if (!key) return '';
	var button = Input.getGamepadButton(key);
	var buttonName = this.getButtonDisplayName(button);
    return Enhanced.Param.GamepadConfigButton.format(buttonName);
};

Window_GamepadVisualConfig.prototype.getButtonDisplayName = function(buttonId) {
	// 获取当前手柄模式
	var currentMode = Enhanced.Param.GamepadMode || 'xbox';
	// 获取对应模式的按键名称
	var buttonNames = Enhanced.Param.ButtonNames[currentMode] || Enhanced.Param.ButtonNames.xbox;
	return buttonNames[buttonId] || buttonId;
};

Window_GamepadVisualConfig.prototype.getButtonKey = function(index) {
	if (index === 0) return 'ok';
	if (index === 1) return 'cancel';
	if (index === 2) return 'shift';
	if (index === 3) return 'menu';
	if (index === 4) return 'mouseLeft'; // 鼠标左键
};

Window_GamepadVisualConfig.prototype.getGamepadModeText = function() {
	switch (Enhanced.Param.GamepadMode) {
		case 'xbox':
			return 'Xbox';
		case 'playstation':
			return 'PlayStation';
		case 'switch':
			return 'Switch';
		default:
			return 'Xbox';
	}
};

Window_GamepadVisualConfig.prototype.itemTextAlign = function() {
    return 'center';
};

Window_GamepadVisualConfig.prototype.clearButtonConfig = function(index) {
    var rect = this.itemRectForText(index);
	rect.x += rect.width / 2;
	rect.width /= 2;
	this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_GamepadVisualConfig.prototype.updateHelp = function() {
    if (!this._helpWindow) return;
	switch (this.index()) {
	case 0:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigOkHelp);
		break;
	case 1:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigCancelHelp);
		break;
	case 2:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigShiftHelp);
		break;
	case 3:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigMenuHelp);
		break;
	case 4:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigMouseLeftHelp);
		break;
	case 6:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigResetHelp);
		break;
	case 7:
		this._helpWindow.setText(Enhanced.Param.GamepadConfigFinishHelp);
		break;
	default:
		this._helpWindow.clear();
		break;
	}
};

//=============================================================================
// Window_GamepadVisual
//=============================================================================

function Window_GamepadVisual() {
    this.initialize.apply(this, arguments);
}

Window_GamepadVisual.prototype = Object.create(Window_Base.prototype);
Window_GamepadVisual.prototype.constructor = Window_GamepadVisual;

Window_GamepadVisual.prototype.initialize = function(x, y, width, height) {
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this._gamepadImage = null;
	this._imageLoaded = false;
	this.loadGamepadImage();
	this.refresh();
};

Window_GamepadVisual.prototype.loadGamepadImage = function() {
	var currentMode = Enhanced.Param.GamepadMode || 'xbox';
	var imagePath = Enhanced.Param.GamepadImages[currentMode] || Enhanced.Param.GamepadImages.xbox;
	// 移除文件扩展名，因为ImageManager会自动添加
	var pathWithoutExt = imagePath.replace(/\.png$/, '');
	this._gamepadImage = ImageManager.loadBitmap('', pathWithoutExt, 0, true);
	this._gamepadImage.addLoadListener(function() {
		this._imageLoaded = true;
		this.refresh();
	}.bind(this));
};

Window_GamepadVisual.prototype.refresh = function() {
	this.contents.clear();
	if (this._imageLoaded && this._gamepadImage) {
		this.drawGamepadImage();
	} else {
		this.drawLoadingMessage();
	}
};

Window_GamepadVisual.prototype.drawGamepadImage = function() {
	var centerX = this.contents.width / 2;
	var centerY = this.contents.height / 2;
	var imageWidth = this._gamepadImage.width;
	var imageHeight = this._gamepadImage.height;
	var scale = Math.min(
		(this.contents.width * 0.9) / imageWidth,
		(this.contents.height * 0.9) / imageHeight
	);
	var scaledWidth = imageWidth * scale;
	var scaledHeight = imageHeight * scale;
	var x = centerX - scaledWidth / 2;
	var y = centerY - scaledHeight / 2;
	
	this.contents.blt(this._gamepadImage, 0, 0, imageWidth, imageHeight, x, y, scaledWidth, scaledHeight);
};

Window_GamepadVisual.prototype.drawLoadingMessage = function() {
	var centerX = this.contents.width / 2;
	var centerY = this.contents.height / 2;
	this.changeTextColor(this.textColor(0));
	this.drawText('加载手柄图像中...', 0, centerY - 12, this.contents.width, 'center');
};

//=============================================================================
// Scene_Options
//=============================================================================

Enhanced.Gamepad.Scene_Options_createOptionsWindow =
	Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
  Enhanced.Gamepad.Scene_Options_createOptionsWindow.call(this);
	this._optionsWindow.setHandler('gamepadConfig',
		this.commandGamepadConfig.bind(this));
};

Scene_Options.prototype.commandGamepadConfig = function() {
	SceneManager.push(Scene_GamepadConfig);
};

//=============================================================================
// Scene_GamepadConfig
//=============================================================================

function Scene_GamepadConfig() {
  this.initialize.apply(this, arguments);
}

Scene_GamepadConfig.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GamepadConfig.prototype.constructor = Scene_GamepadConfig;

Scene_GamepadConfig.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GamepadConfig.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
	this.createGamepadVisualWindow();
	this.createGamepadConfigWindow();
};

Scene_GamepadConfig.prototype.terminate = function() {
  Scene_MenuBase.prototype.terminate.call(this);
  ConfigManager.save();
};

Scene_GamepadConfig.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
	this.updateAttachedController();
	this.updateButtonConfig();
	this.updateAfterConfig();
};

Scene_GamepadConfig.prototype.updateAttachedController = function() {
	if (Input.isControllerConnected()) return;
	this.popScene();
};

Scene_GamepadConfig.prototype.createGamepadVisualWindow = function() {
	var width = Graphics.boxWidth / 2;
	var height = Graphics.boxHeight - this._helpWindow.height;
	var x = 0;
	var y = this._helpWindow.height;
	this._visualWindow = new Window_GamepadVisual(x, y, width, height);
	this.addWindow(this._visualWindow);
};

Scene_GamepadConfig.prototype.createGamepadConfigWindow = function() {
	var x = Graphics.boxWidth / 2;
	var y = this._helpWindow.height;
	this._configWindow = new Window_GamepadVisualConfig(this._helpWindow);
	this._configWindow.x = x;
	this._configWindow.y = y;
	this._configWindow.setHandler('button', this.commandButton.bind(this));
	this._configWindow.setHandler('gamepadMode', this.commandGamepadMode.bind(this));
	this._configWindow.setHandler('vibrationIntensity', this.commandVibrationIntensity.bind(this));
	this._configWindow.setHandler('reset', this.commandReset.bind(this));
	this._configWindow.setHandler('finish', this.popScene.bind(this));
	this._configWindow.setHandler('cancel', this.popScene.bind(this)); // 添加取消按钮处理
	this.addWindow(this._configWindow);
};

Scene_GamepadConfig.prototype.commandButton = function() {
	var index = this._configWindow.index();
	this._configWindow.clearButtonConfig(index);
	this._configEnabled = true;
	Enhanced.Param.GamepadTimer = 12;
	
	// 触发震动反馈
	GamepadVibration.short();
};

Scene_GamepadConfig.prototype.commandReset = function() {
	ConfigManager.gamepadInput = {
		0: 'ok',
		1: 'cancel',
		2: 'shift',
		3: 'menu',
		5: 'mouseLeft', // 默认绑定到R1键（通常是按钮5）
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right',
	};
	// 重置手柄模式为Xbox模式
	ConfigManager.gamepadMode = 'xbox';
	Enhanced.Param.GamepadMode = 'xbox';
	// 重置震动强度为100%
	ConfigManager.vibrationIntensity = 1.0;
	Enhanced.Param.VibrationIntensity = 1.0;
	ConfigManager.applyGamepadConfig();
	// 重新加载手柄图片以匹配当前模式
	if (this._visualWindow) {
		this._visualWindow.loadGamepadImage();
	}
	this.refreshWindows();
	
	// 触发震动反馈
	GamepadVibration.pulse();
};

Scene_GamepadConfig.prototype.refreshWindows = function() {
	this._configWindow.refresh();
	this._configWindow.activate();
	ConfigManager.save();
};

Scene_GamepadConfig.prototype.updateButtonConfig = function() {
	if (!this._configEnabled) return;
	var buttonId = Input.getPressedGamepadButton();
	if (buttonId > 11) return;
	if (buttonId >= 0) this.applyButtonConfig(buttonId);
};

Scene_GamepadConfig.prototype.applyButtonConfig = function(buttonId) {
	this._configEnabled = false;
	var index = this._configWindow.index();
	var newConfig = this._configWindow.getButtonKey(index);
	var formerConfig = Input.gamepadMapper[buttonId];
	var formerButton = Input.getGamepadButton(newConfig);
	ConfigManager.gamepadInput[buttonId] = newConfig;
	ConfigManager.gamepadInput[formerButton] = formerConfig;
	ConfigManager.applyGamepadConfig();
	this._configTimer = 12;
	
	// 触发震动反馈
	GamepadVibration.bump();
};

Scene_GamepadConfig.prototype.updateAfterConfig = function() {
	if (!this._configTimer) return;
	if (--this._configTimer > 0) return;
	SoundManager.playEquip();
	this.refreshWindows();
};

Scene_GamepadConfig.prototype.commandGamepadMode = function() {
	// 循环切换手柄模式
	switch (ConfigManager.gamepadMode) {
		case 'xbox':
			ConfigManager.gamepadMode = 'playstation';
			break;
		case 'playstation':
			ConfigManager.gamepadMode = 'switch';
			break;
		case 'switch':
			ConfigManager.gamepadMode = 'xbox';
			break;
		default:
			ConfigManager.gamepadMode = 'xbox';
			break;
	}
	
	// 更新Enhanced.Param中的值
	Enhanced.Param.GamepadMode = ConfigManager.gamepadMode;
	
	// 更新QTE插件的手柄模式
	if (typeof XdRsData !== 'undefined' && XdRsData.qte && XdRsData.qte.setGamepadMode) {
		XdRsData.qte.setGamepadMode(ConfigManager.gamepadMode);
	}
	
	// 触发震动反馈
	GamepadVibration.short();
	
	// 保存配置
	ConfigManager.save();
	
	// 重新加载手柄图片以匹配当前模式
	if (this._visualWindow) {
		this._visualWindow.loadGamepadImage();
	}
	
	// 刷新窗口
	this.refreshWindows();
};

Scene_GamepadConfig.prototype.commandVibrationIntensity = function() {
	// 循环调整震动强度（100% → 75% → 50% → 25%）
	var currentIntensity = Math.round((ConfigManager.vibrationIntensity || 1) * 100);
	var newIntensity;
	
	// 按指定顺序循环
	switch (currentIntensity) {
		case 100:
			newIntensity = 75;
			break;
		case 75:
			newIntensity = 50;
			break;
		case 50:
			newIntensity = 25;
			break;
		case 25:
			newIntensity = 100;
			break;
		default:
			newIntensity = 100;
			break;
	}
	
	// 强制转换为正确的数值类型
	newIntensity = parseInt(newIntensity);
	
	// 更新ConfigManager和Enhanced.Param中的值
	ConfigManager.vibrationIntensity = newIntensity / 100;
	Enhanced.Param.VibrationIntensity = ConfigManager.vibrationIntensity;
	
	// 触发震动反馈，展示当前强度
	GamepadVibration.short();
	
	// 保存配置
	ConfigManager.save();
	
	// 刷新窗口
	this.refreshWindows();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Enhanced.Gamepad.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Enhanced.Gamepad.Game_Interpreter_pluginCommand.call(this, command, args);
    
    if (command === 'GamepadVibration') {
        this.processGamepadVibration(args);
    }
};

Game_Interpreter.prototype.processGamepadVibration = function(args) {
    if (args.length === 0) return;
    
    var type = args[0];
    
    switch (type) {
        case 'short':
            GamepadVibration.short();
            break;
        case 'pulse':
            GamepadVibration.pulse();
            break;
        case 'ramp':
            GamepadVibration.ramp();
            break;
        case 'bump':
            GamepadVibration.bump();
            break;
        case 'stop':
            GamepadVibration.stop();
            break;
        case 'custom':
            if (args.length >= 3) {
                var duration = parseInt(args[1]);
                var intensity = parseFloat(args[2]);
                if (!isNaN(duration) && !isNaN(intensity)) {
                    GamepadVibration.vibrate(duration, intensity, intensity);
                }
            }
            break;
    }
};

//=============================================================================
// BattleManager
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

Enhanced.Gamepad.BattleManager_processActionSequence = BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
  // GAMEPAD VIBRATE
  if (actionName === 'GAMEPAD VIBRATE') {
    if (actionArgs.length === 3) {
      var duration = parseInt(actionArgs[0]) || 0;
      var weakMagnitude = parseFloat(actionArgs[1]) || 0;
      var strongMagnitude = parseFloat(actionArgs[2]) || 0;
      this.actionGamepadVibrate(duration, weakMagnitude, strongMagnitude);
    } else if (actionArgs.length === 1) {
      var type = actionArgs[0].toUpperCase();
      this.actionGamepadVibrateType(type);
    }
    return true;
  }
  return Enhanced.Gamepad.BattleManager_processActionSequence.call(this, actionName, actionArgs);
};

BattleManager.actionGamepadVibrate = function(duration, weakMagnitude, strongMagnitude) {
  GamepadVibration.vibrate(duration, weakMagnitude, strongMagnitude);
};

BattleManager.actionGamepadVibrateType = function(type) {
  switch (type) {
    case 'SHORT':
      GamepadVibration.short();
      break;
    case 'PULSE':
      GamepadVibration.pulse();
      break;
    case 'RAMP':
      GamepadVibration.ramp();
      break;
    case 'BUMP':
      GamepadVibration.bump();
      break;
    case 'STOP':
      GamepadVibration.stop();
      break;
  }
};

} else {
  var text = '\n\nGainian_Gamepad.js 需要 YEP_BattleEngineCore.js 才能使用战斗序列震动功能。\n请确保先安装 YEP_BattleEngineCore.js 插件。';
  console.error(text);
  if (Utils.isNwjs()) {
    try {
      const gui = require('nw.gui');
      gui.Window.get().showDevTools();
    } catch (e) {
      // 无法打开开发者工具时忽略
    }
  }
}

//=============================================================================
// End of File
//=============================================================================
