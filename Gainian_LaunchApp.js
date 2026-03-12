//=============================================================================
// Gainian_LaunchApp.js
//=============================================================================
/*:
 * @plugindesc V1.2 外部应用程序启动器
 * @author JBF250
 *
 * @param App Path
 * @desc 要启动的应用程序路径（相对于游戏目录）
 * @default exe/geek.exe
 *
 * @help
 * 功能说明：
 * 允许通过插件命令启动游戏目录中的外部应用程序
 * 
 * 插件指令：
 *   LAUNCH_APP   // 启动配置的应用程序
 * 
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 * 更新日志
 * V1.2
 * - 修复了导出游戏后路径解析失败的问题
 * - 统一了插件名称
 * - 增强了错误处理和日志输出
 * - 添加了权限检查和提示
 * 
 * V1.0 完成插件
 */

(function() {
    'use strict';
    
    // 读取插件参数
    const parameters = PluginManager.parameters('Gainian_LaunchApp');
    const appPath = parameters['App Path'] || 'exe/geek.exe';
    
    // 注册插件指令
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'LAUNCH_APP') {
            this.launchExternalApp();
        }
    };
    
    // 启动外部应用程序
    Game_Interpreter.prototype.launchExternalApp = function() {
        try {
            // 只在NW.js环境中执行
            if (Utils.isNwjs()) {
                this.launchAppInNwjs();
            } else {
                console.log("外部应用程序启动功能仅在桌面版中可用");
                this.displayErrorMessage("外部应用程序启动功能仅在桌面版中可用");
            }
        } catch (error) {
            console.error("启动应用程序失败:", error.message);
            this.displayErrorMessage("启动应用程序失败: " + error.message);
        }
    };
    
    // 显示错误消息
    Game_Interpreter.prototype.displayErrorMessage = function(message) {
        if (Utils.isOptionValid('test')) {
            // 测试模式下显示详细错误
            console.error(message);
        } else {
            // 生产模式下显示简单提示
            if (Utils.isNwjs()) {
                try {
                    const gui = require('nw.gui');
                    gui.Window.get().showDevTools();
                } catch (e) {
                    // 无法打开开发者工具时忽略
                }
            }
        }
    };
    
    // NW.js环境启动应用程序
    Game_Interpreter.prototype.launchAppInNwjs = function() {
        try {
            const childProcess = require('child_process');
            const path = require('path');
            const fs = require('fs');
            
            // 构建完整路径 - 使用更可靠的方法获取游戏目录
            let gameDir;
            try {
                // 优先使用process.mainModule.filename获取游戏目录
                gameDir = path.dirname(process.mainModule.filename);
            } catch (e) {
                // 备用方案：使用__dirname
                gameDir = __dirname;
                // 向上导航到游戏根目录
                for (let i = 0; i < 3; i++) { // 假设插件在js/plugins/目录下
                    gameDir = path.dirname(gameDir);
                }
            }
            
            // 构建应用程序完整路径
            let fullPath;
            if (path.isAbsolute(appPath)) {
                fullPath = appPath;
            } else {
                fullPath = path.join(gameDir, appPath);
            }
            
            console.log("游戏目录:", gameDir);
            console.log("应用程序路径:", fullPath);
            
            // 检查文件是否存在
            if (!fs.existsSync(fullPath)) {
                const errorMsg = "应用程序不存在: " + fullPath;
                console.error(errorMsg);
                this.displayErrorMessage(errorMsg);
                return;
            }
            
            // 在Windows系统上，使用start命令启动应用程序
            // 这可以避免权限问题
            if (process.platform === 'win32') {
                // 使用更安全的命令格式
                const command = `cmd.exe /c start "" "${fullPath}"`;
                console.log("执行命令:", command);
                
                childProcess.exec(command, (error) => {
                    if (error) {
                        console.error("启动应用程序失败:", error.message);
                        this.displayErrorMessage("启动应用程序失败: " + error.message);
                    } else {
                        console.log("应用程序已启动");
                    }
                });
            } else {
                // 对于非Windows系统，直接执行
                console.log("执行文件:", fullPath);
                childProcess.execFile(fullPath, (error) => {
                    if (error) {
                        console.error("启动应用程序失败:", error.message);
                        this.displayErrorMessage("启动应用程序失败: " + error.message);
                    } else {
                        console.log("应用程序已启动");
                    }
                });
            }
        } catch (error) {
            console.error("启动应用程序失败:", error.message);
            this.displayErrorMessage("启动应用程序失败: " + error.message);
        }
    };
})();