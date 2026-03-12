//=============================================================================
// Gainian_Shadow.js
//=============================================================================
/*:
 * @plugindesc 角色阴影显示[v1.00]
 * @author Gainian
 *
 * @param X-Axis
 * @text X轴偏移
 * @desc X轴的调整值
 * @default 0
 *
 * @param Y-Axis
 * @text Y轴偏移
 * @desc Y轴的调整值
 * @default 0
 *
 * @param Shadow Opacity
 * @text 阴影透明度
 * @desc 阴影的透明度值 (0-255)
 * @default 128
 * @type number
 * @min 0
 * @max 255
 *
 * @param Auto Shadow (Events)
 * @text 自动显示阴影（事件）
 * @desc 为所有事件自动显示阴影
 * @default true
 * @type boolean
 * @on 显示阴影
 * @off 隐藏阴影
 *
 * @param Auto Shadow (Followers)
 * @text 自动显示阴影（跟随者）
 * @desc 为所有跟随者自动显示阴影
 * @default true
 * @type boolean
 * @on 显示阴影
 * @off 隐藏阴影
 *
 * @help  
 * =============================================================================
 * ♦♦♦ Gainian Character Shadow ♦♦♦
 * Author   -   Gainian
 * Version  -   1.00
 * Updated  -   2026/02/21
 * =============================================================================
 * 在角色下方显示基于角色行走图的实时阴影
 *
 * =============================================================================
 * 事件注释
 * =============================================================================
 * 要为事件启用阴影，请添加以下注释：
 * 
 *shadow
 * 
 * 要为事件禁用阴影，请添加以下注释：
 *
disable_shadow
 *
 * =============================================================================
 * 插件命令（事件中使用）
 * =============================================================================
 * 要在游戏中激活或禁用阴影，请使用以下命令：
 * 
 *shadow_event_id : ID : true
 *shadow_player_id : ID : true
 *shadow_follower_id : ID : true
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
    var Imported = Imported || {};
    Imported.Gainian_Shadow = true;
    var Gainian = Gainian || {}; 

    Gainian.parameters = PluginManager.parameters('Gainian_Shadow');  
    Gainian.shadow_X = Number(Gainian.parameters['X-Axis'] || 0);
    Gainian.shadow_Y = Number(Gainian.parameters['Y-Axis'] || -2);
    Gainian.shadow_Opacity = Number(Gainian.parameters['Shadow Opacity'] || 128);
    Gainian.shadow_autoShadowEvents = String(Gainian.parameters['Auto Shadow (Events)'] || 'true') === 'true';
    Gainian.shadow_autoShadowFollowers = String(Gainian.parameters['Auto Shadow (Followers)'] || 'true') === 'true';
    
//=============================================================================
// ** Game_Interpreter
//=============================================================================

//==============================
// * PluginCommand
//==============================
var _gainian_shadow_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _gainian_shadow_pluginCommand.call(this, command, args);
    this.checkShadowCommand(command, args);
    return true;
};

//==============================
// * checkShadowCommand
//==============================
Game_Interpreter.prototype.checkShadowCommand = function(command, args) {
    if (command === "shadow_event_id") {
        var id = Number(args[1]);
        var visible = String(args[3]) === "true";
        $gameMap.shadowEvent(id, visible);
    } else if (command === "shadow_player_id") {
        var id = Number(args[1]);
        var visible = String(args[3]) === "true";
        $gameMap.shadowPlayer(id, visible);
    } else if (command === "shadow_follower_id") {
        var id = Number(args[1]);
        var visible = String(args[3]) === "true";
        $gameMap.shadowFollower(id, visible);
    }
};
    
//=============================================================================
// ** Game Map
//=============================================================================

//==============================
// * shadow Player
//==============================
Game_Map.prototype.shadowPlayer = function(char_id, visible) {
    var char = this.getPlayerChar(char_id);
    if (char) { char._charShadow.visible = visible; }
};
    
//==============================
// * shadow Follower
//==============================
Game_Map.prototype.shadowFollower = function(char_id, visible) {
    var char = this.getFollowerChar(char_id);
    if (char) { char._charShadow.visible = visible; }
};
    
//==============================
// * get Player Char
//==============================
Game_Map.prototype.getPlayerChar = function(id) {
    var char = null;
    var actor = $gameParty.members()[id];
    if (actor) {
        if (id === 0) {
            char = $gamePlayer;
        } else {
            char = $gamePlayer.followers().follower(id - 1);
        }
    }
    return char;
};
    
//==============================
// * get Follower Char
//==============================
Game_Map.prototype.getFollowerChar = function(id) {
    var char = null;
    if ($gamePlayer.followers()._data[id]) {
        char = $gamePlayer.followers()._data[id];
    }
    return char;
};
    
//==============================
// * shadow Event
//==============================
Game_Map.prototype.shadowEvent = function(char_id, visible) {
    var char = this.getEventChar(char_id);
    if (char) { char._charShadow.visible = visible; }
};
    
//==============================
// * get Event Char
//==============================
Game_Map.prototype.getEventChar = function(event_id) {
    var ev = null;
    $gameMap.events().forEach(function(event) {
        if (event.eventId() === event_id) { ev = event; }
    }, this);
    return ev;
};
    
//=============================================================================
// ** Game Character Base
//=============================================================================

//==============================
// * InitMembers
//==============================
var _gainian_shadow_gcharbase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _gainian_shadow_gcharbase_initMembers.call(this);
    this._charShadow = {};
    this._charShadow.visible = false;
    this._charShadow.x = Number(Gainian.shadow_X);
    this._charShadow.y = Number(Gainian.shadow_Y);
    this._charShadow.autoShadow = false;
    this._charShadow.opacity = Number(Gainian.shadow_Opacity);
};

//=============================================================================
// ** Game Player
//=============================================================================

//==============================
// * Refresh
//==============================
var _gainian_shadow_gplayer_refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
    _gainian_shadow_gplayer_refresh.call(this);
    this._charShadow.visible = true;
};

//=============================================================================
// ** Game Follower
//=============================================================================

//==============================
// * Refresh
//==============================
var _gainian_shadow_gfollower_refresh = Game_Follower.prototype.refresh;
Game_Follower.prototype.refresh = function() {
    _gainian_shadow_gfollower_refresh.call(this);
    this._charShadow.visible = Gainian.shadow_autoShadowFollowers;
};

//=============================================================================
// ** Game Event
//=============================================================================

//==============================
// * Setup Page
//==============================
var _gainian_shadow_gevent_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    _gainian_shadow_gevent_setupPage.call(this);
    this.checkShadow();
};

//==============================
// * checkShadow
//==============================
Game_Event.prototype.checkShadow = function() {
    if (Gainian.shadow_autoShadowEvents) {
        this._charShadow.visible = true;
    }
    if (!this._erased && this.page()) {
        this.list().forEach(function(l) {
            if (l.code === 108) {
                var comment = l.parameters[0];
                if (comment.toLowerCase() === "shadow") {
                    this._charShadow.visible = true;
                } else if (comment.toLowerCase() === "disable_shadow") {
                    this._charShadow.visible = false;
                }
            }
        }, this);
    }
};

//=============================================================================
// ** Spriteset Map
//=============================================================================

//==============================
// * create Characters
//==============================
var _gainian_shadow_sprmap_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    _gainian_shadow_sprmap_createCharacters.call(this);
    this.createShadowSprites();
};

//==============================
// * create Shadow Sprites
//==============================
Spriteset_Map.prototype.createShadowSprites = function() {
    this._shadowSprites = [];
    
    // 为玩家创建阴影
    this._shadowSprites.push(new Gainian_ShadowSprite($gamePlayer));
    
    // 为跟随者创建阴影
    $gamePlayer.followers().forEach(function(follower) {
        this._shadowSprites.push(new Gainian_ShadowSprite(follower));
    }, this);
    
    // 为事件创建阴影
    $gameMap.events().forEach(function(event) {
        this._shadowSprites.push(new Gainian_ShadowSprite(event));
    }, this);
    
    // 添加阴影精灵到地图图层
    for (var i = 0; i < this._shadowSprites.length; i++) {
        this._tilemap.addChild(this._shadowSprites[i]);
    }
};

//=============================================================================
// ** Gainian_ShadowSprite
//=============================================================================
function Gainian_ShadowSprite() {
    this.initialize.apply(this, arguments);
}

//==============================
// * 确保阴影精灵继承自Sprite_Character
//==============================
var _gainian_shadow_scene_initialize = SceneManager.initialize;
SceneManager.initialize = function() {
    _gainian_shadow_scene_initialize.call(this);
    
    // 定义阴影精灵，继承自Sprite_Character
    Gainian_ShadowSprite.prototype = Object.create(Sprite_Character.prototype);
    Gainian_ShadowSprite.prototype.constructor = Gainian_ShadowSprite;
    
    //==============================
    // * 阴影精灵 - 初始化
    //==============================
    Gainian_ShadowSprite.prototype.initialize = function(character) {
        Sprite_Character.prototype.initialize.call(this, character);
        this._shadowEnabled = true;
    };
    
    //==============================
    // * 阴影精灵 - 帧刷新
    //==============================
    Gainian_ShadowSprite.prototype.update = function() {
        Sprite_Character.prototype.update.call(this);
        
        // 应用阴影效果
        this.applyShadowEffect();
        
        // 更新阴影位置
        this.updateShadowPosition();
        
        // 检查可见性
        this.updateShadowVisibility();
    };
    
    //==============================
    // * 应用阴影效果
    //==============================
    Gainian_ShadowSprite.prototype.applyShadowEffect = function() {
        var char = this._character;
        if (!char) return;
        
        // 确保阴影精灵可见
        this.visible = true;
        
        // 垂直翻转创建倒影效果
        if (this.scale.y > 0) {
            this.scale.y = -1;
        }
        
        // 设置阴影透明度
        this.opacity = char._charShadow.opacity;
        
        // 简化阴影效果：直接使用黑色色调
        this.tint = [0, 0, 0, 255]; // 黑色色调
    };
    
    //==============================
    // * 更新阴影位置
    //==============================
    Gainian_ShadowSprite.prototype.updateShadowPosition = function() {
        var char = this._character;
        if (!char) return;
        
        // 计算阴影位置，使角色脚部对着倒置后阴影图的脚部
        var charY = char.screenY();
        var charHeight = this.height || 48;
        var shadowOffset = char._charShadow.y;
        
        // 阴影位置应该在角色底部下方
        this.y = charY + (charHeight / 2) + shadowOffset - 24 + char.jumpHeight();
        this.x = char.screenX() + char._charShadow.x;
        
        // 确保阴影在角色下方，添加空值检查
        var charSprite = char.sprite ? char.sprite() : null;
        if (charSprite && typeof charSprite.z === 'number') {
            this.z = charSprite.z - 1;
        } else {
            // 使用默认z值，确保阴影在角色下方
            this.z = 1; // 默认值，确保在大多数图层下方
        }
    };
    
    //==============================
    // * 更新阴影可见性
    //==============================
    Gainian_ShadowSprite.prototype.updateShadowVisibility = function() {
        var char = this._character;
        if (!char) {
            this.visible = false;
            return;
        }
        
        // 简化可见性检查，确保阴影能够显示
        this.visible = char._charShadow.visible &&
                      char._characterName !== '' &&
                      this._shadowEnabled;
    };
};

//==============================
// * 为Game_Character添加sprite方法，用于获取对应的精灵
//==============================
Game_Character.prototype.sprite = function() {
    // 这里需要在Spriteset_Map中实现精灵查找逻辑
    // 暂时返回null，实际使用时会通过其他方式获取
    return null;
};