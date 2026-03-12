//=============================================================================
// Disable Right Click Menu
// Gainian_DisableClickMenu.js
//=============================================================================

var Imported = Imported || {};
Imported.Gainian_DisableClickMenu = true;

//=============================================================================
/*:
 * @plugindesc V1.0 禁用鼠标右键打开主菜单的功能
 * @author JBF250
 *
 * @help 此插件会禁用鼠标右键打开主菜单的功能，玩家只能通过菜单按钮或键盘快捷键打开主菜单。
 * 
 * 此插件随意魔改，可免费用于商业或者非商业游戏
 * 只需要在游戏结束时的致谢名单中加上作者的名字JB250即可
 * 
 */
//=============================================================================

(function() {
    'use strict';

    // 修改Scene_Map.prototype.isMenuCalled方法，移除对TouchInput.isCancelled()的检查
    var _Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function() {
        return Input.isTriggered('menu');
    };

})();