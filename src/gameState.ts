import { Barrel } from "./enemy/barrel";
import { BigSkullEnemy } from "./enemy/bigSkullEnemy";
import { ChargeEnemy, ChargeEnemyState } from "./enemy/chargeEnemy";
import { Chest } from "./enemy/chest";
import { CoalResource } from "./enemy/coalResource";
import { Crate } from "./enemy/crate";
import { EmeraldResource } from "./enemy/emeraldResource";
import { Enemy, EnemyDirection } from "./enemy/enemy";
import { GoldResource } from "./enemy/goldResource";
import { KnightEnemy } from "./enemy/knightEnemy";
import { PottedPlant } from "./enemy/pottedPlant";
import { SkullEnemy } from "./enemy/skullEnemy";
import { SlimeEnemy } from "./enemy/slimeEnemy";
import { Spawner } from "./enemy/spawner";
import { VendingMachine } from "./enemy/vendingMachine";
import { WizardEnemy, WizardState } from "./enemy/wizardEnemy";
import { ZombieEnemy } from "./enemy/zombieEnemy";
import { Game } from "./game";
import { HitWarning } from "./hitWarning";
import { Inventory } from "./inventory";
import { Armor } from "./item/armor";
import { BlueGem } from "./item/bluegem";
import { Candle } from "./item/candle";
import { Coal } from "./item/coal";
import { Coin } from "./item/coin";
import { Equippable } from "./item/equippable";
import { Gold } from "./item/gold";
import { GoldenKey } from "./item/goldenKey";
import { GreenGem } from "./item/greengem";
import { Heart } from "./item/heart";
import { Item } from "./item/item";
import { Key } from "./item/key";
import { Lantern } from "./item/lantern";
import { RedGem } from "./item/redgem";
import { Torch } from "./item/torch";
import { Level } from "./level";
import { LevelGenerator } from "./levelGenerator";
import { Player, PlayerDirection } from "./player";
import { EnemySpawnAnimation } from "./projectile/enemySpawnAnimation";
import { Projectile } from "./projectile/projectile";
import { WizardFireball } from "./projectile/wizardFireball";
import { Random } from "./random";
import { Dagger } from "./weapon/dagger";
import { DualDagger } from "./weapon/dualdagger";
import { Shotgun } from "./weapon/shotgun";
import { Spear } from "./weapon/spear";
import { Weapon } from "./weapon/weapon";

export class HitWarningState {
  x: number;
  y: number;
  dead: boolean;

  constructor(hw: HitWarning) {
    this.x = hw.x;
    this.y = hw.y;
    this.dead = hw.dead;
  }
}

let loadHitWarning = (hws: HitWarningState, game: Game): HitWarning => {
  let hw = new HitWarning(game, hws.x, hws.y);
  hw.dead = hws.dead;
  return hw;
}

export enum ProjectileType {
  SPAWN,
  WIZARD
}

export class ProjectileState {
  type: ProjectileType;
  x: number;
  y: number;
  dead: boolean;
  levelID: number;
  enemySpawn: EnemyState;
  wizardState: number;
  wizardParentID: number;

  constructor(projectile: Projectile, game: Game) {
    this.x = projectile.x;
    this.y = projectile.y;
    this.dead = projectile.dead;
    if (projectile instanceof EnemySpawnAnimation) {
      this.type = ProjectileType.SPAWN;
      this.levelID = game.levels.indexOf(projectile.level);
      this.enemySpawn = new EnemyState(projectile.enemy, game);
    }
    if (projectile instanceof WizardFireball) {
      this.type = ProjectileType.WIZARD;
      this.wizardState = projectile.state;
      this.levelID = game.levels.indexOf(projectile.parent.level);
      this.wizardParentID = projectile.parent.level.enemies.indexOf(projectile.parent);
    }
  }
}

let loadProjectile = (ps: ProjectileState, game: Game): Projectile => {
  if (ps.type === ProjectileType.SPAWN) {
    let level = game.levels[ps.levelID];
    let enemy = loadEnemy(ps.enemySpawn, game);
    let p = new EnemySpawnAnimation(level, enemy, ps.x, ps.y);
    p.dead = ps.dead;
    return p;
  }
  if (ps.type === ProjectileType.WIZARD) {
    let wizard = (game.levels[ps.levelID].enemies[ps.wizardParentID] as WizardEnemy);
    let p = new WizardFireball(wizard, ps.x, ps.y);
    p.state = ps.wizardState;
  }
}

export enum EnemyType {
  BARREL,
  BIGSKULL,
  CHARGE,
  CHEST,
  COAL,
  CRATE,
  EMERALD,
  GOLD,
  KNIGHT,
  PLANT,
  SKULL,
  SLIME,
  SPAWNER,
  VENDINGMACHINE,
  WIZARD,
  ZOMBIE
}

export class EnemyState {
  type: EnemyType;
  levelID: number;
  x: number;
  y: number;
  health: number;
  direction: EnemyDirection;
  dead: boolean;
  skipNextTurns: number;
  hasDrop: boolean;
  drop: ItemState;
  alertTicks: number;
  ticks: number;
  seenPlayer: boolean;
  targetPlayerID: string;
  // skeleton
  ticksSinceFirstHit: number;
  // big skeleton
  drops: Array<ItemState>;
  // charge enemy
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  visualTargetX: number;
  visualTargetY: number;
  chargeEnemyState: ChargeEnemyState;
  // spawner
  enemySpawnType: number;
  // vending machine
  isPlayerOpened: boolean;
  playerOpenedID: string;
  open: boolean;
  costItems: Array<ItemState>;
  item: ItemState;
  isInf: boolean;
  quantity: number;
  // wizard
  wizardState: WizardState;

  constructor(enemy: Enemy, game: Game) {
    this.levelID = game.levels.indexOf(enemy.level);
    this.x = enemy.x;
    this.y = enemy.y;
    this.health = enemy.health;
    this.direction = enemy.direction;
    this.dead = enemy.dead;
    this.skipNextTurns = enemy.skipNextTurns;
    this.hasDrop = false;
    if (enemy.drop) {
      this.hasDrop = true;
      this.drop = new ItemState(enemy.drop, game);
    }
    this.alertTicks = enemy.alertTicks;
    if (enemy instanceof Barrel) this.type = EnemyType.BARREL;
    if (enemy instanceof BigSkullEnemy) {
      this.type = EnemyType.BIGSKULL;
      this.ticks = enemy.ticks;
      this.ticksSinceFirstHit = enemy.ticksSinceFirstHit;
      this.seenPlayer = enemy.seenPlayer;
      if (enemy.seenPlayer) {
        this.targetPlayerID = Object.keys(game.players).find(key => game.players[key] === enemy.targetPlayer);
        if (!this.targetPlayerID) this.targetPlayerID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.targetPlayer);
      }
      this.drops = [];
      for (const d of enemy.drops) this.drops.push(new ItemState(d, game));
    }
    if (enemy instanceof ChargeEnemy) {
      this.type = EnemyType.CHARGE;
      this.ticks = enemy.ticks;
      this.chargeEnemyState = enemy.state;
      this.startX = enemy.startX;
      this.startY = enemy.startY;
      this.targetX = enemy.targetX;
      this.targetY = enemy.targetY;
      this.visualTargetX = enemy.visualTargetX;
      this.visualTargetY = enemy.visualTargetY;
    }
    if (enemy instanceof Chest) this.type = EnemyType.CHEST;
    if (enemy instanceof CoalResource) this.type = EnemyType.COAL;
    if (enemy instanceof Crate) this.type = EnemyType.CRATE;
    if (enemy instanceof EmeraldResource) this.type = EnemyType.EMERALD;
    if (enemy instanceof GoldResource) this.type = EnemyType.GOLD;
    if (enemy instanceof KnightEnemy) {
      this.type = EnemyType.KNIGHT;
      this.ticks = enemy.ticks;
      this.seenPlayer = enemy.seenPlayer;
      if (enemy.seenPlayer) {
        this.targetPlayerID = Object.keys(game.players).find(key => game.players[key] === enemy.targetPlayer);
        if (!this.targetPlayerID) this.targetPlayerID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.targetPlayer);
      }
    }
    if (enemy instanceof PottedPlant) this.type = EnemyType.PLANT;
    if (enemy instanceof SkullEnemy) {
      this.type = EnemyType.SKULL;
      this.ticks = enemy.ticks;
      this.ticksSinceFirstHit = enemy.ticksSinceFirstHit;
      this.seenPlayer = enemy.seenPlayer;
      if (enemy.seenPlayer) {
        this.targetPlayerID = Object.keys(game.players).find(key => game.players[key] === enemy.targetPlayer);
        if (!this.targetPlayerID) this.targetPlayerID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.targetPlayer);
      }
    }
    if (enemy instanceof SlimeEnemy) {
      this.type = EnemyType.SLIME;
      this.ticks = enemy.ticks;
      this.seenPlayer = enemy.seenPlayer;
      if (enemy.seenPlayer) {
        this.targetPlayerID = Object.keys(game.players).find(key => game.players[key] === enemy.targetPlayer);
        if (!this.targetPlayerID) this.targetPlayerID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.targetPlayer);
      }
    }
    if (enemy instanceof Spawner) {
      this.type = EnemyType.SPAWNER;
      this.ticks = enemy.ticks;
      this.seenPlayer = enemy.seenPlayer;
      this.enemySpawnType = enemy.enemySpawnType;
    }
    if (enemy instanceof VendingMachine) {
      this.type = EnemyType.VENDINGMACHINE;
      this.isPlayerOpened = false;
      if (enemy.playerOpened) {
        this.isPlayerOpened = true;
        this.playerOpenedID = Object.keys(game.players).find(key => game.players[key] === enemy.playerOpened);
        if (!this.playerOpenedID) this.playerOpenedID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.playerOpened);
      }
      this.open = enemy.open;
      this.costItems = [];
      for (const item of enemy.costItems) this.costItems.push(new ItemState(item, game));
      this.item = new ItemState(enemy.item, game);
      this.isInf = enemy.isInf;
      this.quantity = enemy.quantity;
    }
    if (enemy instanceof WizardEnemy) {
      this.type = EnemyType.WIZARD;
      this.ticks = enemy.ticks;
      this.wizardState = enemy.state;
      this.seenPlayer = enemy.seenPlayer;
    }
    if (enemy instanceof ZombieEnemy) {
      this.type = EnemyType.ZOMBIE;
      this.ticks = enemy.ticks;
      this.seenPlayer = enemy.seenPlayer;
      if (enemy.seenPlayer) {
        this.targetPlayerID = Object.keys(game.players).find(key => game.players[key] === enemy.targetPlayer);
        if (!this.targetPlayerID) this.targetPlayerID = Object.keys(game.offlinePlayers).find(key => game.offlinePlayers[key] === enemy.targetPlayer);
      }
    }
  }
}

let loadEnemy = (es: EnemyState, game: Game): Enemy => {
  let enemy;
  let level = game.levels[es.levelID];
  if (es.type === EnemyType.BARREL) enemy = new Barrel(level, game, es.x, es.y);
  if (es.type === EnemyType.BIGSKULL) {
    enemy = new BigSkullEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.ticksSinceFirstHit = es.ticksSinceFirstHit;
    enemy.seenPlayer = es.seenPlayer;
    if (es.seenPlayer) {
      enemy.targetPlayer = game.players[es.targetPlayerID];
      if (!enemy.targetPlayer) enemy.targetPlayer = game.offlinePlayers[es.targetPlayerID];
    }
    enemy.drops = [];
    for (const d of es.drops) enemy.drops.push(loadItem(d, game));
  }
  if (es.type === EnemyType.CHARGE) {
    enemy = new ChargeEnemy(level, game, es.x, es.y);
    enemy.ticks = es.ticks;
    enemy.state = es.chargeEnemyState;
    enemy.startX = es.startX;
    enemy.startY = es.startY;
    enemy.targetX = es.targetX;
    enemy.targetY = es.targetY;
    enemy.visualTargetX = es.visualTargetX;
    enemy.visualTargetY = es.visualTargetY;
  }
  if (es.type === EnemyType.CHEST) enemy = new Chest(level, game, es.x, es.y, Random.rand);
  if (es.type === EnemyType.COAL) enemy = new CoalResource(level, game, es.x, es.y);
  if (es.type === EnemyType.CRATE) enemy = new Crate(level, game, es.x, es.y);
  if (es.type === EnemyType.EMERALD) enemy = new EmeraldResource(level, game, es.x, es.y);
  if (es.type === EnemyType.GOLD) enemy = new GoldResource(level, game, es.x, es.y);
  if (es.type === EnemyType.KNIGHT) {
    enemy = new KnightEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.seenPlayer = es.seenPlayer;
    if (es.seenPlayer) {
      enemy.targetPlayer = game.players[es.targetPlayerID];
      if (!enemy.targetPlayer) enemy.targetPlayer = game.offlinePlayers[es.targetPlayerID];
    }
  }
  if (es.type === EnemyType.PLANT) enemy = new PottedPlant(level, game, es.x, es.y);
  if (es.type === EnemyType.SKULL) {
    enemy = new SkullEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.ticksSinceFirstHit = es.ticksSinceFirstHit;
    enemy.seenPlayer = es.seenPlayer;
    if (es.seenPlayer) {
      enemy.targetPlayer = game.players[es.targetPlayerID];
      if (!enemy.targetPlayer) enemy.targetPlayer = game.offlinePlayers[es.targetPlayerID];
    }
  }
  if (es.type === EnemyType.SLIME) {
    enemy = new SlimeEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.seenPlayer = es.seenPlayer;
    if (es.seenPlayer) {
      enemy.targetPlayer = game.players[es.targetPlayerID];
      if (!enemy.targetPlayer) enemy.targetPlayer = game.offlinePlayers[es.targetPlayerID];
    }
  }
  if (es.type === EnemyType.SPAWNER) {
    enemy = new Spawner(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.seenPlayer = es.seenPlayer;
    enemy.enemySpawnType = es.enemySpawnType;
  }
  if (es.type === EnemyType.VENDINGMACHINE) {
    let item = loadItem(es.item, game);
    enemy = new VendingMachine(level, game, es.x, es.y, item, Random.rand);
    if (es.isPlayerOpened) {
      enemy.playerOpened = game.players[es.playerOpenedID];
      if (!enemy.playerOpened) enemy.playerOpened = game.offlinePlayers[es.playerOpenedID];
    }
    enemy.open = es.open;
    enemy.costItems = [];
    for (const item of es.costItems) enemy.costItems.push(loadItem(item, game));
    enemy.isInf = es.isInf;
    enemy.quantity = es.quantity;
  }
  if (es.type === EnemyType.WIZARD) {
    enemy = new WizardEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.state = es.wizardState;
    enemy.seenPlayer = es.seenPlayer;
  }
  if (es.type === EnemyType.ZOMBIE) {
    enemy = new ZombieEnemy(level, game, es.x, es.y, Random.rand);
    enemy.ticks = es.ticks;
    enemy.seenPlayer = es.seenPlayer;
    if (es.seenPlayer) {
      enemy.targetPlayer = game.players[es.targetPlayerID];
      if (!enemy.targetPlayer) enemy.targetPlayer = game.offlinePlayers[es.targetPlayerID];
    }
  }

  enemy.x = es.x;
  enemy.y = es.y;
  enemy.health = es.health;
  enemy.direction = es.direction;
  enemy.dead = es.dead;
  enemy.skipNextTurns = es.skipNextTurns;
  if (es.hasDrop) enemy.drop = loadItem(es.drop, game);
  enemy.alertTicks = es.alertTicks;

  return enemy;
}

export class LevelState {
  levelID: number;
  entered: boolean;
  enemies: Array<EnemyState>;
  items: Array<ItemState>;
  projectiles: Array<ProjectileState>;
  hitwarnings: Array<HitWarningState>;

  constructor(level: Level, game: Game) {
    this.levelID = game.levels.indexOf(level);
    this.entered = level.entered;
    this.enemies = [];
    this.items = [];
    this.projectiles = [];
    this.hitwarnings = [];
    for (const enemy of level.enemies) this.enemies.push(new EnemyState(enemy, game));
    for (const item of level.items) this.items.push(new ItemState(item, game));
    for (const projectile of level.projectiles) this.projectiles.push(new ProjectileState(projectile, game));
    for (const hw of level.hitwarnings) this.hitwarnings.push(new HitWarningState(hw));
  }
}

let loadLevel = (level: Level, levelState: LevelState, game: Game) => {
  level.entered = levelState.entered;
  level.enemies = [];
  level.items = [];
  level.projectiles = [];
  level.hitwarnings = [];
  for (const enemy of levelState.enemies) level.enemies.push(loadEnemy(enemy, game));
  for (const item of levelState.items) level.items.push(loadItem(item, game));
  for (const projectile of levelState.projectiles) level.projectiles.push(loadProjectile(projectile, game));
  for (const hw of levelState.hitwarnings) level.hitwarnings.push(loadHitWarning(hw, game));
}

export enum ItemType {
  ARMOR,
  BLUEGEM,
  CANDLE,
  COAL,
  COIN,
  GOLD,
  GOLDENKEY,
  GREENGEM,
  HEART,
  KEY,
  LANTERN,
  REDGEM,
  TORCH,
  DAGGER,
  DUALDAGGER,
  SHOTGUN,
  SPEAR
}

export class ItemState {
  type: ItemType;
  x: number;
  y: number;
  levelID: number;
  stackCount: number;
  pickedUp: boolean;
  equipped: boolean;

  constructor(item: Item, game: Game) {
    if (item instanceof Armor) this.type = ItemType.ARMOR;
    if (item instanceof BlueGem) this.type = ItemType.BLUEGEM;
    if (item instanceof Candle) this.type = ItemType.CANDLE;
    if (item instanceof Coal) this.type = ItemType.COAL;
    if (item instanceof Coin) this.type = ItemType.COIN;
    if (item instanceof Gold) this.type = ItemType.GOLD;
    if (item instanceof GoldenKey) this.type = ItemType.GOLDENKEY;
    if (item instanceof GreenGem) this.type = ItemType.GREENGEM;
    if (item instanceof Heart) this.type = ItemType.HEART;
    if (item instanceof Key) this.type = ItemType.KEY;
    if (item instanceof Lantern) this.type = ItemType.LANTERN;
    if (item instanceof RedGem) this.type = ItemType.REDGEM;
    if (item instanceof Torch) this.type = ItemType.TORCH;
    if (item instanceof Dagger) this.type = ItemType.DAGGER;
    if (item instanceof DualDagger) this.type = ItemType.DUALDAGGER;
    if (item instanceof Shotgun) this.type = ItemType.SHOTGUN;
    if (item instanceof Spear) this.type = ItemType.SPEAR;
    this.equipped = item instanceof Equippable && item.equipped;
    this.x = item.x;
    this.y = item.y;
    this.levelID = game.levels.indexOf(item.level);
    if (this.levelID === -1) this.levelID = 0;
    this.stackCount = item.stackCount;
    this.pickedUp = item.pickedUp;
  }
}

let loadItem = (i: ItemState, game: Game, player?: Player): Item => {
  let level = game.levels[i.levelID];
  let item;
  if (i.type === ItemType.ARMOR) item = new Armor(level, i.x, i.y);
  if (i.type === ItemType.BLUEGEM) item = new BlueGem(level, i.x, i.y);
  if (i.type === ItemType.CANDLE) item = new Candle(level, i.x, i.y);
  if (i.type === ItemType.COAL) item = new Coal(level, i.x, i.y);
  if (i.type === ItemType.COIN) item = new Coin(level, i.x, i.y);
  if (i.type === ItemType.GOLD) item = new Gold(level, i.x, i.y);
  if (i.type === ItemType.GOLDENKEY) item = new GoldenKey(level, i.x, i.y);
  if (i.type === ItemType.GREENGEM) item = new GreenGem(level, i.x, i.y);
  if (i.type === ItemType.HEART) item = new Heart(level, i.x, i.y);
  if (i.type === ItemType.KEY) item = new Key(level, i.x, i.y);
  if (i.type === ItemType.LANTERN) item = new Lantern(level, i.x, i.y);
  if (i.type === ItemType.REDGEM) item = new RedGem(level, i.x, i.y);
  if (i.type === ItemType.TORCH) item = new Torch(level, i.x, i.y);
  if (i.type === ItemType.DAGGER) { item = new Dagger(level, i.x, i.y); }
  if (i.type === ItemType.DUALDAGGER) { item = new DualDagger(level, i.x, i.y); }
  if (i.type === ItemType.SHOTGUN) { item = new Shotgun(level, i.x, i.y); }
  if (i.type === ItemType.SPEAR) { item = new Spear(level, i.x, i.y); }
  if (i.equipped) item.equipped = true;
  if (item instanceof Equippable) item.setWielder(player);
  item.stackCount = i.stackCount;
  item.pickedUp = i.pickedUp;
  return item;
}

export class InventoryState {
  isOpen: boolean;
  cols: number;
  rows: number;
  selX: number;
  selY: number;
  equipAnimAmount: Array<number>;
  isWeaponEquipped: boolean;
  weaponI: number;
  coins: number;
  items: Array<ItemState>;

  constructor(inventory: Inventory, game: Game) {
    this.isOpen = inventory.isOpen;
    this.cols = inventory.cols;
    this.rows = inventory.rows;
    this.equipAnimAmount = inventory.equipAnimAmount.map(x => x);
    this.isWeaponEquipped = false;
    if (inventory.weapon) {
      this.isWeaponEquipped = true;
      this.weaponI = inventory.items.indexOf(inventory.weapon);
    }
    this.coins = inventory.coins;
    this.selX = inventory.selX;
    this.selY = inventory.selY;
    this.items = Array<ItemState>();
    for (const item of inventory.items) {
      this.items.push(new ItemState(item, game));
    }
  }
}

let loadInventory = (inventory: Inventory, i: InventoryState, game: Game) => {
  inventory.clear();
  inventory.isOpen = i.isOpen;
  inventory.cols = i.cols;
  inventory.rows = i.rows;
  inventory.selX = i.selX;
  inventory.selY = i.selY;
  inventory.equipAnimAmount = i.equipAnimAmount.map(x => x);
  inventory.coins = i.coins;
  for (const item of i.items) inventory.items.push(loadItem(item, game, inventory.player));

  if (i.isWeaponEquipped) inventory.weapon = (inventory.items[i.weaponI] as Weapon);
}

export class PlayerState {
  x: number;
  y: number;
  dead: boolean;
  levelID: number;
  direction: PlayerDirection;
  health: number;
  maxHealth: number;
  lastTickHealth: number;
  inventory: InventoryState;
  hasOpenVendingMachine: boolean;
  openVendingMachineLevelID: number;
  openVendingMachineID: number;
  sightRadius: number;

  constructor(player: Player, game: Game) {
    this.x = player.x;
    this.y = player.y;
    this.dead = player.dead;
    this.levelID = player.levelID;
    this.direction = player.direction;
    this.health = player.health;
    this.maxHealth = player.maxHealth;
    this.lastTickHealth = player.lastTickHealth;
    this.inventory = new InventoryState(player.inventory, game);
    this.hasOpenVendingMachine = false;
    if (player.openVendingMachine) {
      this.hasOpenVendingMachine = true;
      this.openVendingMachineLevelID = game.levels.indexOf(player.openVendingMachine.level);
      this.openVendingMachineID = player.openVendingMachine.level.enemies.indexOf(player.openVendingMachine);
    }
    this.sightRadius = player.sightRadius
  }
}

let loadPlayer = (id: string, p: PlayerState, game: Game): Player => {
  let player = new Player(game, p.x, p.y, id === game.localPlayerID);
  player.dead = p.dead;

  player.levelID = p.levelID;
  if (player.levelID < game.levelgen.currentFloorFirstLevelID) { // catch up to the current level
    player.levelID = game.levelgen.currentFloorFirstLevelID;
    player.x = game.levels[player.levelID].roomX + Math.floor(game.levels[player.levelID].width / 2);
    player.y = game.levels[player.levelID].roomY + Math.floor(game.levels[player.levelID].height / 2);
  }
  player.direction = p.direction;
  player.health = p.health;
  player.maxHealth = p.maxHealth;
  player.lastTickHealth = p.lastTickHealth;
  loadInventory(player.inventory, p.inventory, game);
  if (p.hasOpenVendingMachine) {
    player.openVendingMachine = (game.levels[p.openVendingMachineLevelID].enemies[p.openVendingMachineID] as VendingMachine);
  }
  player.sightRadius = p.sightRadius;

  return player;
}

export class GameState {
  seed: number;
  randomState: number;
  depth: number;
  players: Record<string, PlayerState>;
  offlinePlayers: Record<string, PlayerState>;
  levels: Array<LevelState>;

  constructor() {
    this.seed = 0;
    this.randomState = 0;
    this.depth = 0;
    this.players = {};
    this.offlinePlayers = {};
    this.levels = [];
  }
}

export const createGameState = (game: Game): GameState => {
  let gs = new GameState();
  gs.seed = game.levelgen.seed; // random state for generating levels
  gs.randomState = Random.state; // current random state
  gs.depth = game.levelgen.depthReached;
  for (const i in game.players)
    gs.players[i] = new PlayerState(game.players[i], game);
  for (const i in game.offlinePlayers) {
    gs.offlinePlayers[i] = new PlayerState(game.offlinePlayers[i], game);
  }
  for (let level of game.levels) {
    level.catchUp();
    gs.levels.push(new LevelState(level, game));
  }
  return gs;
}

export const loadGameState = (game: Game, activeUsernames: Array<string>, gameState: GameState) => {
  game.levels = Array<Level>();
  game.levelgen = new LevelGenerator();
  game.levelgen.setSeed(gameState.seed);
  if ((gameState as any).init_state) gameState.depth = 0;
  game.levelgen.generateFirstNFloors(game, gameState.depth);

  if (!(gameState as any).init_state) {
    if (gameState.players) {
      for (const i in gameState.players) {
        if (activeUsernames.includes(i)) game.players[i] = loadPlayer(i, gameState.players[i], game);
        else game.offlinePlayers[i] = loadPlayer(i, gameState.players[i], game);
      }
    }
    if (gameState.offlinePlayers) {
      for (const i in gameState.offlinePlayers) {
        if (i === game.localPlayerID)
          game.players[i] = loadPlayer(i, gameState.offlinePlayers[i], game);
        else if (activeUsernames.includes(i))
          game.players[i] = loadPlayer(i, gameState.offlinePlayers[i], game);
        else
          game.offlinePlayers[i] = loadPlayer(i, gameState.offlinePlayers[i], game);
      }
    }
    for (let levelState of gameState.levels) {
      for (let i = 0; i < game.levels.length; i++) {
        if (i === levelState.levelID) {
          loadLevel(game.levels[i], levelState, game);
        }
      }
    }
    if (!(game.localPlayerID in gameState.players) && !(game.localPlayerID in gameState.offlinePlayers)) { // we're not in the gamestate, create a new player
      game.players[game.localPlayerID] = new Player(game, 0, 0, true);
      game.players[game.localPlayerID].levelID = game.levelgen.currentFloorFirstLevelID;
      game.players[game.localPlayerID].x = game.levels[game.levelgen.currentFloorFirstLevelID].roomX + Math.floor(game.levels[game.levelgen.currentFloorFirstLevelID].width / 2);
      game.players[game.localPlayerID].y = game.levels[game.levelgen.currentFloorFirstLevelID].roomY + Math.floor(game.levels[game.levelgen.currentFloorFirstLevelID].height / 2);
      game.level = game.levels[game.levelgen.currentFloorFirstLevelID];
      game.level.enterLevel(game.players[game.localPlayerID]);
    }
    else {
      game.level = game.levels[game.players[game.localPlayerID].levelID];
    }
  }
  else { // stub game state, start a new world
    game.players[game.localPlayerID] = new Player(game, 0, 0, true);
    game.level = game.levels[game.players[game.localPlayerID].levelID];
    game.level.enterLevel(game.players[game.localPlayerID]);
  }
  Random.setState(gameState.randomState);
  game.level.updateLighting();

  game.chat = [];
}