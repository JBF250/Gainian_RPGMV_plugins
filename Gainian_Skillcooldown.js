//=============================================================================
// Gainian Engine Plugins - Skill Cooldown
// Gainian_Skillcooldown.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
Imported.Gainian_Skillcooldown = true;

var Gainian = Gainian || {};
Gainian.Skillcooldown = Gainian.Skillcooldown || {};
Gainian.Skillcooldown.version = 1.00;

//=============================================================================
/*:
 * @plugindesc v1.00 技能冷却系统，可以兼容YEP的战斗核心和技能核心插件，也可以独立使用。
 * @author JBF250
 *
 * @param ---General---
 * @default
 *
 * @param Cooldown Format
 * @text 冷却格式
 * @desc 技能冷却时间的显示格式。%1 - 冷却时间
 * @default %1CD
 *
 * @param Cooldown Font Size
 * @text 冷却字体大小
 * @desc 技能冷却时间的字体大小。
 * @default 20
 *
 * @param Cooldown Text Color
 * @text 冷却文字颜色
 * @desc 技能冷却时间的文字颜色。
 * @default 23
 *
 * @param Cooldown Icon
 * @text 冷却图标
 * @desc 技能冷却时间的图标ID。使用0表示不显示图标。
 * @default 75
 *
 * @param Warmup Format
 * @text 热身格式
 * @desc 技能热身时间的显示格式。%1 - 热身时间
 * @default %1WU
 *
 * @param Warmup Font Size
 * @text 热身字体大小
 * @desc 技能热身时间的字体大小。
 * @default 20
 *
 * @param Warmup Text Color
 * @text 热身文字颜色
 * @desc 技能热身时间的文字颜色。
 * @default 18
 *
 * @param Warmup Icon
 * @text 热身图标
 * @desc 技能热身时间的图标ID。使用0表示不显示图标。
 * @default 75
 *
 * @help
 * ============================================================================
 * 介绍
 * ============================================================================
 *
 * 这个插件为RPG Maker MV添加了技能冷却和热身系统。它可以与YEP的战斗核心和
 * 技能核心插件兼容，也可以独立使用。
 *
 * 技能冷却系统允许技能在使用后进入冷却状态，在冷却期间无法再次使用。
 * 技能热身系统允许技能在使用前需要一定的准备时间，在热身期间无法执行其他动作。
 *
 * ============================================================================
 * 标签
 * ============================================================================
 *
 * 技能标签：
 *   <Cooldown: x>
 *   设置技能的冷却时间为x回合。
 *
 *   <Warmup: x>
 *   设置技能的热身时间为x回合。
 *
 *   <Cooldown: x%>
 *   设置技能的冷却时间为x%的最大MP值。
 *
 *   <Warmup: x%>
 *   设置技能的热身时间为x%的最大MP值。
 *
 *   <Cooldown Formula: x>
 *   使用公式x计算技能的冷却时间。
 *   公式变量：
 *   - a: 使用者
 *   - user: 使用者
 *   - subject: 使用者
 *   - s: 游戏开关
 *   - v: 游戏变量
 *
 *   <Warmup Formula: x>
 *   使用公式x计算技能的热身时间。
 *   公式变量：
 *   - a: 使用者
 *   - user: 使用者
 *   - subject: 使用者
 *   - s: 游戏开关
 *   - v: 游戏变量
 *
 * ============================================================================
 * 插件命令
 * ============================================================================
 *
 * 插件命令：
 *   ClearSkillCooldowns
 *   清除所有技能的冷却时间。
 *
 *   ClearSkillCooldown skillId
 *   清除指定技能ID的冷却时间。
 *
 *   SetSkillCooldown skillId turns
 *   设置指定技能ID的冷却时间为turns回合。
 *
 * ============================================================================
 * 兼容性
 * ============================================================================
 *
 * 这个插件与以下插件兼容：
 * - YEP_BattleEngineCore.js
 * - YEP_SkillCore.js
 *
 * 如果使用了YEP_SkillCore.js，技能冷却时间会显示在技能消耗旁边。
 * 如果使用了YEP_BattleEngineCore.js，技能冷却系统会根据战斗系统类型（回合制或时间制）进行调整。
 *
 * ============================================================================
 * 版本历史
 * ============================================================================
 *
 * Version 1.00:
 * - 完成插件！
 */
//=============================================================================

//=============================================================================
// 参数变量
//=============================================================================

Gainian.Parameters = PluginManager.parameters('Gainian_Skillcooldown');
Gainian.Param = Gainian.Param || {};
Gainian.Icon = Gainian.Icon || {};

Gainian.Param.CooldownFormat = String(Gainian.Parameters['Cooldown Format'] || '%1CD');
Gainian.Param.CooldownFontSize = Number(Gainian.Parameters['Cooldown Font Size'] || 20);
Gainian.Param.CooldownTextColor = Number(Gainian.Parameters['Cooldown Text Color'] || 23);
Gainian.Icon.Cooldown = Number(Gainian.Parameters['Cooldown Icon'] || 75);

Gainian.Param.WarmupFormat = String(Gainian.Parameters['Warmup Format'] || '%1WU');
Gainian.Param.WarmupFontSize = Number(Gainian.Parameters['Warmup Font Size'] || 20);
Gainian.Param.WarmupTextColor = Number(Gainian.Parameters['Warmup Text Color'] || 18);
Gainian.Icon.Warmup = Number(Gainian.Parameters['Warmup Icon'] || 75);

//=============================================================================
// DataManager
//=============================================================================

Gainian.Skillcooldown.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Gainian.Skillcooldown.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Gainian._loaded_Gainian_Skillcooldown) {
    this.processSkillcooldownNotetags($dataSkills);
    Gainian._loaded_Gainian_Skillcooldown = true;
  }
  return true;
};

DataManager.processSkillcooldownNotetags = function(group) {
  var note1 = /<(?:COOLDOWN|cooldown):[ ](\d+)>/i;
  var note2 = /<(?:COOLDOWN|cooldown):[ ](\d+)([%％])>/i;
  var note3 = /<(?:WARMUP|warmup):[ ](\d+)>/i;
  var note4 = /<(?:WARMUP|warmup):[ ](\d+)([%％])>/i;
  var note5 = /<(?:COOLDOWN FORMULA|cooldown formula):[ ](.*)>/i;
  var note6 = /<(?:WARMUP FORMULA|warmup formula):[ ](.*)>/i;
  
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);
    
    obj.cooldown = 0;
    obj.cooldownPer = 0.0;
    obj.warmup = 0;
    obj.warmupPer = 0.0;
    obj.cooldownFormula = '';
    obj.warmupFormula = '';
    
    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(note1)) {
        obj.cooldown = parseInt(RegExp.$1);
      } else if (line.match(note2)) {
        obj.cooldownPer = parseFloat(RegExp.$1 * 0.01);
      } else if (line.match(note3)) {
        obj.warmup = parseInt(RegExp.$1);
      } else if (line.match(note4)) {
        obj.warmupPer = parseFloat(RegExp.$1 * 0.01);
      } else if (line.match(note5)) {
        obj.cooldownFormula = String(RegExp.$1);
      } else if (line.match(note6)) {
        obj.warmupFormula = String(RegExp.$1);
      }
    }
  }
};

//=============================================================================
// Game_BattlerBase
//=============================================================================

Game_BattlerBase.prototype.initSkillcooldown = function() {
  this.clearCooldowns();
  this.clearWarmups();
};

Game_BattlerBase.prototype.clearCooldowns = function() {
  this._cooldownTurns = {};
};

Game_BattlerBase.prototype.clearWarmups = function() {
  this._warmupTurns = {};
};

Game_BattlerBase.prototype.cooldown = function(skillId) {
  if (this._cooldownTurns === undefined) this.clearCooldowns();
  return this._cooldownTurns[skillId] || 0;
};

Game_BattlerBase.prototype.warmup = function(skillId) {
  if (this._warmupTurns === undefined) this.clearWarmups();
  return this._warmupTurns[skillId] || 0;
};

Game_BattlerBase.prototype.setCooldown = function(skillId, turns) {
  if (this._cooldownTurns === undefined) this.clearCooldowns();
  this._cooldownTurns[skillId] = Math.max(0, turns);
};

Game_BattlerBase.prototype.setWarmup = function(skillId, turns) {
  if (this._warmupTurns === undefined) this.clearWarmups();
  this._warmupTurns[skillId] = Math.max(0, turns);
};

Game_BattlerBase.prototype.clearCooldown = function(skillId) {
  if (this._cooldownTurns === undefined) this.clearCooldowns();
  delete this._cooldownTurns[skillId];
};

Game_BattlerBase.prototype.clearWarmup = function(skillId) {
  if (this._warmupTurns === undefined) this.clearWarmups();
  delete this._warmupTurns[skillId];
};

Game_BattlerBase.prototype.decreaseCooldowns = function() {
  if (this._cooldownTurns === undefined) this.clearCooldowns();
  for (var skillId in this._cooldownTurns) {
    this._cooldownTurns[skillId]--;
    if (this._cooldownTurns[skillId] <= 0) {
      delete this._cooldownTurns[skillId];
    }
  }
};

Game_BattlerBase.prototype.decreaseWarmups = function() {
  if (this._warmupTurns === undefined) this.clearWarmups();
  for (var skillId in this._warmupTurns) {
    this._warmupTurns[skillId]--;
    if (this._warmupTurns[skillId] <= 0) {
      delete this._warmupTurns[skillId];
    }
  }
};

Game_BattlerBase.prototype.skillCooldown = function(skill) {
  var cooldown = skill.cooldown;
  cooldown += this.mmp * skill.cooldownPer;
  if (skill.cooldownFormula) {
    var a = this;
    var user = this;
    var subject = this;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    try {
      cooldown += eval(skill.cooldownFormula);
    } catch (e) {
      console.error('Skill Cooldown Formula Error:', e);
    }
  }
  return Math.max(0, Math.floor(cooldown));
};

Game_BattlerBase.prototype.skillWarmup = function(skill) {
  var warmup = skill.warmup;
  warmup += this.mmp * skill.warmupPer;
  if (skill.warmupFormula) {
    var a = this;
    var user = this;
    var subject = this;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    try {
      warmup += eval(skill.warmupFormula);
    } catch (e) {
      console.error('Skill Warmup Formula Error:', e);
    }
  }
  return Math.max(0, Math.floor(warmup));
};

Game_BattlerBase.prototype.isSkillOnCooldown = function(skill) {
  if (!skill) return false;
  return this.cooldown(skill.id) > 0;
};

Game_BattlerBase.prototype.isSkillWarmingUp = function(skill) {
  if (!skill) return false;
  return this.warmup(skill.id) > 0;
};

// 覆盖方法以检查技能冷却
Gainian.Skillcooldown.Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
  if (!Gainian.Skillcooldown.Game_BattlerBase_meetsSkillConditions.call(this, skill)) return false;
  if (this.isSkillOnCooldown(skill)) return false;
  return true;
};

// 覆盖方法以设置技能冷却
Gainian.Skillcooldown.Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function(skill) {
  Gainian.Skillcooldown.Game_BattlerBase_paySkillCost.call(this, skill);
  var cooldown = this.skillCooldown(skill);
  if (cooldown > 0) {
    this.setCooldown(skill.id, cooldown);
  }
  var warmup = this.skillWarmup(skill);
  if (warmup > 0) {
    this.setWarmup(skill.id, warmup);
  }
};

//=============================================================================
// Game_Actor
//=============================================================================

Gainian.Skillcooldown.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
  Gainian.Skillcooldown.Game_Actor_initMembers.call(this);
  this.initSkillcooldown();
};

//=============================================================================
// Game_Enemy
//=============================================================================

Gainian.Skillcooldown.Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function() {
  Gainian.Skillcooldown.Game_Enemy_initMembers.call(this);
  this.initSkillcooldown();
};

//=============================================================================
// Game_BattleManager
//=============================================================================

BattleManager.updateSkillcooldowns = function() {
  var members = this.allBattleMembers();
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    member.decreaseCooldowns();
    member.decreaseWarmups();
  }
};

//=============================================================================
// Game_Troop
//=============================================================================

Gainian.Skillcooldown.Game_Troop_increaseTurn = Game_Troop.prototype.increaseTurn;
Game_Troop.prototype.increaseTurn = function() {
  Gainian.Skillcooldown.Game_Troop_increaseTurn.call(this);
  this.updateSkillcooldowns();
};

Game_Troop.prototype.updateSkillcooldowns = function() {
  var members = this.members();
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    member.decreaseCooldowns();
    member.decreaseWarmups();
  }
};

//=============================================================================
// Game_Party
//=============================================================================

Game_Party.prototype.updateSkillcooldowns = function() {
  var members = this.members();
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    member.decreaseCooldowns();
    member.decreaseWarmups();
  }
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Gainian.Skillcooldown.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Gainian.Skillcooldown.Game_Interpreter_pluginCommand.call(this, command, args);
  if (command === 'ClearSkillCooldowns') {
    var members = $gameParty.battleMembers().concat($gameTroop.members());
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      member.clearCooldowns();
    }
  } else if (command === 'ClearSkillCooldown') {
    var skillId = parseInt(args[0]);
    var members = $gameParty.battleMembers().concat($gameTroop.members());
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      member.clearCooldown(skillId);
    }
  } else if (command === 'SetSkillCooldown') {
    var skillId = parseInt(args[0]);
    var turns = parseInt(args[1]);
    var members = $gameParty.battleMembers().concat($gameTroop.members());
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      member.setCooldown(skillId, turns);
    }
  }
};

//=============================================================================
// Window_SkillList
//=============================================================================

// 如果使用了YEP_SkillCore.js，添加技能冷却时间显示
if (Imported.YEP_SkillCore) {
  Window_SkillList.prototype.drawOtherCost = function(skill, wx, wy, dw) {
    dw = this.drawSkillCooldown(skill, wx, wy, dw);
    dw = this.drawSkillWarmup(skill, wx, wy, dw);
    return dw;
  };
} else {
  // 如果没有使用YEP_SkillCore.js，重写drawSkillCost方法
  Gainian.Skillcooldown.Window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function(skill, wx, wy, width) {
    var dw = width;
    dw = this.drawSkillCooldown(skill, wx, wy, dw);
    dw = this.drawSkillWarmup(skill, wx, wy, dw);
    return Gainian.Skillcooldown.Window_SkillList_drawSkillCost.call(this, skill, wx, wy, dw);
  };
}

Window_SkillList.prototype.drawSkillCooldown = function(skill, wx, wy, dw) {
  var cooldown = this._actor.cooldown(skill.id);
  if (cooldown <= 0) return dw;
  
  if (Gainian.Icon.Cooldown > 0) {
    var iw = wx + dw - Window_Base._iconWidth;
    this.drawIcon(Gainian.Icon.Cooldown, iw, wy + 2);
    dw -= Window_Base._iconWidth + 2;
  }
  
  this.changeTextColor(this.textColor(Gainian.Param.CooldownTextColor));
  var fmt = Gainian.Param.CooldownFormat;
  var text = fmt.format(cooldown);
  this.contents.fontSize = Gainian.Param.CooldownFontSize;
  this.drawText(text, wx, wy, dw, 'right');
  var returnWidth = dw - this.textWidth(text) - (Imported.YEP_SkillCore ? Yanfly.Param.SCCCostPadding : 4);
  this.resetFontSettings();
  return returnWidth;
};

Window_SkillList.prototype.drawSkillWarmup = function(skill, wx, wy, dw) {
  var warmup = this._actor.warmup(skill.id);
  if (warmup <= 0) return dw;
  
  if (Gainian.Icon.Warmup > 0) {
    var iw = wx + dw - Window_Base._iconWidth;
    this.drawIcon(Gainian.Icon.Warmup, iw, wy + 2);
    dw -= Window_Base._iconWidth + 2;
  }
  
  this.changeTextColor(this.textColor(Gainian.Param.WarmupTextColor));
  var fmt = Gainian.Param.WarmupFormat;
  var text = fmt.format(warmup);
  this.contents.fontSize = Gainian.Param.WarmupFontSize;
  this.drawText(text, wx, wy, dw, 'right');
  var returnWidth = dw - this.textWidth(text) - (Imported.YEP_SkillCore ? Yanfly.Param.SCCCostPadding : 4);
  this.resetFontSettings();
  return returnWidth;
};

//=============================================================================
// YEP_BattleEngineCore.js 兼容性
//=============================================================================

if (Imported.YEP_BattleEngineCore) {
  // 回合制战斗系统
  if (typeof BattleManager.isTurnBased === 'function' && !Gainian.Skillcooldown._patchedTurnBased) {
    Gainian.Skillcooldown._patchedTurnBased = true;
    var originalStartTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
      originalStartTurn.call(this);
      this.updateSkillcooldowns();
    };
  }
  
  // 时间制战斗系统
  if (typeof BattleManager.isTickBased === 'function' && !Gainian.Skillcooldown._patchedTickBased) {
    Gainian.Skillcooldown._patchedTickBased = true;
    var originalUpdate = BattleManager.update;
    BattleManager.update = function() {
      originalUpdate.call(this);
      if (this.isTickBased()) {
        this.updateSkillcooldownTicks();
      }
    };
    
    BattleManager.updateSkillcooldownTicks = function() {
      var members = this.allBattleMembers();
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        // 每100 tick减少一次冷却时间
        if (this._tickCount % Yanfly.Param.BECTurnTime === 0) {
          member.decreaseCooldowns();
          member.decreaseWarmups();
        }
      }
    };
  }
}

//=============================================================================
// 结束文件
//=============================================================================
