//=============================================================================
// Gainian_SavePath.js
//=============================================================================
/*:
 * @plugindesc V1.0 将RPG Maker MV的存档路径更改为C盘的AppData文件夹
 * @author JBF250
 *
 * @param SaveFolderName
 * @desc 存档文件夹名称
 * @default RPGMVGame
 * 
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 * 更新日志
 * V1.0 完成插件
 */

(function() {
    'use strict';
    
    var parameters = PluginManager.parameters('Gainian_SavePath');
    var saveFolderName = parameters['SaveFolderName'] || 'RPGMVGame';
    
    // 辅助函数：递归创建目录
    function createDirectoryRecursive(dirPath) {
        var path = require('path');
        var fs = require('fs');
        
        // 分割路径
        var parts = dirPath.split(path.sep);
        var currentPath = parts[0];
        
        // 递归创建每个目录
        for (var i = 1; i < parts.length; i++) {
            currentPath = path.join(currentPath, parts[i]);
            if (!fs.existsSync(currentPath)) {
                try {
                    fs.mkdirSync(currentPath);
                } catch (e) {
                    console.error('创建目录失败:', e.message);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 保存原始方法
    var _StorageManager_localFileDirectoryPath = StorageManager.localFileDirectoryPath;
    
    // 重写localFileDirectoryPath方法
    StorageManager.localFileDirectoryPath = function() {
        // 仅在桌面环境中生效
        if (typeof process !== 'undefined' && process.platform === 'win32' && process.env.LOCALAPPDATA) {
            var path = require('path');
            var fs = require('fs');
            
            // 构建AppData\Local路径
            var appDataPath = process.env.LOCALAPPDATA;
            var saveDir = path.join(appDataPath, saveFolderName, 'saves');
            
            // 确保目录存在
            if (!fs.existsSync(saveDir)) {
                createDirectoryRecursive(saveDir);
            }
            
            return saveDir + path.sep;
        }
        
        // 回退到原始方法
        return _StorageManager_localFileDirectoryPath.call(this);
    };
    
    // 确保在插件加载时就初始化路径
    if (typeof process !== 'undefined' && process.platform === 'win32' && process.env.LOCALAPPDATA) {
        var path = require('path');
        var fs = require('fs');
        var appDataPath = process.env.LOCALAPPDATA;
        var saveDir = path.join(appDataPath, saveFolderName, 'saves');
        
        if (!fs.existsSync(saveDir)) {
            createDirectoryRecursive(saveDir);
        }
    }
    
    // 确保与YEP_SaveCore.js兼容
    if (typeof Yanfly !== 'undefined' && Yanfly.Save) {
        // 重新应用YEP_SaveCore的修改
        var _StorageManager_localFilePath = StorageManager.localFilePath;
        StorageManager.localFilePath = function(savefileId) {
            var name;
            if (savefileId < 0) {
                name = Yanfly.Param.SaveTechLocalConfig;
            } else if (savefileId === 0) {
                // 自动存档使用专门的文件名
                name = 'auto.rpgsave';
            } else {
                // 原有的存档文件使用savefileId作为文件名
                name = Yanfly.Param.SaveTechLocalSave.format(savefileId);
            }
            return this.localFileDirectoryPath() + name;
        };
    }
})();