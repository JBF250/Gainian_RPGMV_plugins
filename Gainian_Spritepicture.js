//=============================================================================
// Gainian_Spritepicture.js
//=============================================================================
/*:
 * @plugindesc 精灵图图片系统 v1.00
 * @author JBF250
 *
 * @help
 * 插件指令：
 *   spritepicture show 图片编号,图片名称,原点,x,y,缩放率X,缩放率Y,透明度,混合模式
 *   spritepicture move 图片编号,原点,x,y,缩放率X,缩放率Y,透明度,混合模式,持续时间
 *   spritepicture erase 图片编号
 *
 * 参数说明：
 *   图片编号：1-100的整数，用于标识图片
 *   图片名称：图片文件的路径和名称（不包含扩展名）
 *   原点：0（左上角）或 1（中心点），默认值：0
 *   x, y：图片的显示位置，默认值：0
 *   缩放率X, Y：图片的缩放比例（100为原始大小），默认值：100
 *   透明度：0-255的整数，0为完全透明，255为完全不透明，默认值：255
 *   混合模式：0（正常）、1（加法）、2（减法），默认值：0
 *   持续时间：移动动画的持续时间（单位：帧），默认值：0
 *
 * 使用例子：
 *   // 显示图片1，图片名为tip2，原点在左上角，位置(0, 255)，缩放率100%，透明度200，正常混合模式
 *   spritepicture show 1,tip2,0,0,255,100,100,200,0
 *   // 移动图片1到位置(100, 100)，持续60帧
 *   spritepicture move 1,0,100,100,100,100,200,0,60
 *   // 消除图片1
 *   spritepicture erase 1
 */

var Imported = Imported || {};
Imported.Gainian_Spritepicture = true;

var Gainian = Gainian || {};
Gainian.Spritepicture = Gainian.Spritepicture || {};
Gainian.Spritepicture.version = 1.00;
Gainian.Spritepicture.debug = false;

// 插件初始化

//=============================================================================
// Game_SpritePicture
//=============================================================================

function Game_SpritePicture() {
    this.initialize.apply(this, arguments);
}

Game_SpritePicture.prototype.initialize = function() {
    this._name = '';
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;
    this._duration = 0;
    this._targetX = 0;
    this._targetY = 0;
    this._targetScaleX = 100;
    this._targetScaleY = 100;
    this._targetOpacity = 255;
    this._targetBlendMode = 0;
};

Game_SpritePicture.prototype.show = function(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
    this._name = name;
    this._origin = origin;
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._opacity = opacity;
    this._blendMode = blendMode;
    this._duration = 0;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._targetBlendMode = blendMode;
};

Game_SpritePicture.prototype.move = function(origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
    this._origin = origin;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._targetBlendMode = blendMode;
    this._duration = duration;
    if (duration === 0) {
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._opacity = opacity;
        this._blendMode = blendMode;
    }
};

Game_SpritePicture.prototype.update = function() {
    if (this._duration > 0) {
        var d = this._duration;
        this._x = (this._x * (d - 1) + this._targetX) / d;
        this._y = (this._y * (d - 1) + this._targetY) / d;
        this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
        this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        this._blendMode = this._targetBlendMode;
        this._duration--;
    }
};

//=============================================================================
// Game_SpritePictureSystem
//=============================================================================

function Game_SpritePictureSystem() {
    this.initialize.apply(this, arguments);
}

Game_SpritePictureSystem.prototype.initialize = function() {
    this._spritePictures = [];
};

Game_SpritePictureSystem.prototype.realPictureId = function(pictureId) {
    return pictureId - 1;
};

Game_SpritePictureSystem.prototype.showPicture = function(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
    var realPictureId = this.realPictureId(pictureId);
    var picture = new Game_SpritePicture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._spritePictures[realPictureId] = picture;
};

Game_SpritePictureSystem.prototype.movePicture = function(pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
    var realPictureId = this.realPictureId(pictureId);
    var picture = this._spritePictures[realPictureId];
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};

Game_SpritePictureSystem.prototype.erasePicture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    this._spritePictures[realPictureId] = null;
};

Game_SpritePictureSystem.prototype.picture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    return this._spritePictures[realPictureId];
};

Game_SpritePictureSystem.prototype.allPictures = function() {
    return this._spritePictures.filter(function(picture) {
        return picture;
    });
};

Game_SpritePictureSystem.prototype.update = function() {
    this._spritePictures.forEach(function(picture) {
        if (picture) {
            picture.update();
        }
    });
};

//=============================================================================
// Game_System
//=============================================================================

var _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this._spritePictureSystem = new Game_SpritePictureSystem();
};

Game_System.prototype.spritePictureSystem = function() {
    return this._spritePictureSystem;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

// 存储原始的pluginCommand方法到全局变量
Gainian.Spritepicture.originalPluginCommand = Game_Interpreter.prototype.pluginCommand;

// 重写pluginCommand方法，避免与其他插件冲突
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    try {
        // 首先检查是否有原始方法，如果有则调用
        if (typeof Gainian.Spritepicture.originalPluginCommand === 'function') {
            Gainian.Spritepicture.originalPluginCommand.call(this, command, args);
        }
        
        // 然后处理我们的命令
        if (command && command.toLowerCase() === 'spritepicture') {
            // 直接处理参数，避免join操作可能导致的问题
            var subCommand = args[0];
            var params = args.slice(1).join(' ').split(',');
            
            if (subCommand === 'show') {
                var pictureId = parseInt(params[0]);
                var name = params[1];
                var origin = parseInt(params[2]) || 0;
                var x = parseInt(params[3]) || 0;
                var y = parseInt(params[4]) || 0;
                var scaleX = parseInt(params[5]) || 100;
                var scaleY = parseInt(params[6]) || 100;
                var opacity = parseInt(params[7]) || 255;
                var blendMode = parseInt(params[8]) || 0;
                
                $gameSystem.spritePictureSystem().showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
            } else if (subCommand === 'move') {
                var pictureId = parseInt(params[0]);
                var origin = parseInt(params[1]) || 0;
                var x = parseInt(params[2]) || 0;
                var y = parseInt(params[3]) || 0;
                var scaleX = parseInt(params[4]) || 100;
                var scaleY = parseInt(params[5]) || 100;
                var opacity = parseInt(params[6]) || 255;
                var blendMode = parseInt(params[7]) || 0;
                var duration = parseInt(params[8]) || 0;
                
                $gameSystem.spritePictureSystem().movePicture(pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
            } else if (subCommand === 'erase') {
                var pictureId = parseInt(params[0]);
                
                $gameSystem.spritePictureSystem().erasePicture(pictureId);
            }
        }
    } catch (e) {
        // 发生错误时，尝试调用原始方法（如果存在）
        if (typeof Gainian.Spritepicture.originalPluginCommand === 'function') {
            try {
                Gainian.Spritepicture.originalPluginCommand.call(this, command, args);
            } catch (e2) {
                // 忽略原始方法的错误
            }
        }
    }
};

// commandSpritePicture方法已集成到pluginCommand中，不再需要

//=============================================================================
// Sprite_SpritePicture
//=============================================================================

function Sprite_SpritePicture() {
    this.initialize.apply(this, arguments);
}

Sprite_SpritePicture.prototype = Object.create(Sprite.prototype);
Sprite_SpritePicture.prototype.constructor = Sprite_SpritePicture;

Sprite_SpritePicture.prototype.initialize = function(pictureId) {
    Sprite.prototype.initialize.call(this);
    this._pictureId = pictureId;
    this._name = '';
    this.visible = true;
    this.z = 1000 + pictureId; // 确保精灵图显示在合适的层级
    this.update();
};

Sprite_SpritePicture.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateOrigin();
    this.updatePosition();
    this.updateScale();
    this.updateOpacity();
    this.updateBlendMode();
    // 确保精灵图可见
    this.visible = true;
    // 确保精灵图不受边界限制
    this._isWindow = false;
    this.ignoreCamera = true;
};

Sprite_SpritePicture.prototype.updateBitmap = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture) {
        var name = picture._name;
        if (this._name !== name) {
            this._name = name;
            var bitmap = ImageManager.loadPicture(name);
            this.bitmap = bitmap;
        }
    } else {
        if (this._name) {
            this._name = '';
        }
        this.bitmap = null;
    }
};

Sprite_SpritePicture.prototype.updateOrigin = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture && this.bitmap) {
        if (picture._origin === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }
};

Sprite_SpritePicture.prototype.updatePosition = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture) {
        // 直接使用屏幕坐标，不受地图视口限制
        this.x = picture._x;
        this.y = picture._y;
        // 确保精灵图不受相机影响
        this.fixedToCamera = true;
    }
};

Sprite_SpritePicture.prototype.updateScale = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture) {
        this.scale.x = picture._scaleX / 100;
        this.scale.y = picture._scaleY / 100;
    }
};

Sprite_SpritePicture.prototype.updateOpacity = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture) {
        this.opacity = picture._opacity;
    }
};

Sprite_SpritePicture.prototype.updateBlendMode = function() {
    var picture = $gameSystem.spritePictureSystem().picture(this._pictureId);
    if (picture) {
        this.blendMode = picture._blendMode;
    }
};

//=============================================================================
// Scene_Map
//=============================================================================

var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    this.createSpritePictures();
};

Scene_Map.prototype.createSpritePictures = function() {
    this._spritePictures = [];
    for (var i = 1; i <= 100; i++) {
        var sprite = new Sprite_SpritePicture(i);
        // 确保精灵图添加到场景中，并且层级在合适的位置
        this.addChild(sprite);
        // 确保精灵图不受视口限制
        sprite._isWindow = false;
        sprite.ignoreCamera = true;
        // 确保精灵图显示在所有其他元素之上
        sprite.z = 10000 + i;
        this._spritePictures.push(sprite);
    }
};

var _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    $gameSystem.spritePictureSystem().update();
    _Scene_Map_update.call(this);
};

//=============================================================================
// Scene_Battle
//=============================================================================

var _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    _Scene_Battle_createDisplayObjects.call(this);
    this.createSpritePictures();
};

Scene_Battle.prototype.createSpritePictures = function() {
    this._spritePictures = [];
    for (var i = 1; i <= 100; i++) {
        var sprite = new Sprite_SpritePicture(i);
        this.addChild(sprite);
        this._spritePictures.push(sprite);
    }
};

var _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    $gameSystem.spritePictureSystem().update();
    _Scene_Battle_update.call(this);
};