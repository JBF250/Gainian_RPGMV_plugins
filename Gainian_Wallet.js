//=============================================================================
// Gainian_Wallet.js
//=============================================================================
/*:
 * @plugindesc V1.0 金钱查询系统    
 * @author JBF250
 *
 * @help
 * 功能说明：
 * 添加插件指令：将当前金钱存入指定变量
 * 
 * 插件指令：
 *   QUERY_GOLD variableId   // 将当前金钱存入指定变量
 *
 * 使用方法：
 * 在事件指令中使用插件指令：QUERY_GOLD [变量ID]
 * 然后可以使用文本指令显示变量值：\V[变量ID]
 *
 * 示例：
 *   QUERY_GOLD 10
 *   文本：当前金钱：\V[10] G
 * 
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 * 更新日志
 * V1.0 完成插件
 */

(function() {
    'use strict';
    
    // 注册插件指令
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command.toLowerCase() === 'query_gold') {
            this.queryGold(args);
        }
    };
    
    // 处理金钱查询指令
    Game_Interpreter.prototype.queryGold = function(args) {
        if (args.length < 1) return;
        
        const variableId = parseInt(args[0]);
        if (variableId > 0) {
            $gameVariables.setValue(variableId, $gameParty.gold());
        }
    };
})();