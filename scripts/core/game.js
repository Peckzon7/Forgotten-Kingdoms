import { GAME_CONFIG } from "./config.js";
import { createInitialState } from "./state.js";
import { GameLoop } from "./loop.js";
import { Renderer } from "../rendering/renderer.js";
import { Camera } from "../rendering/camera.js";
import { EffectsManager } from "../rendering/effects.js";
import { InputManager } from "../controls/input.js";
import { KeyboardController } from "../controls/keyboard.js";
import { VirtualJoystick } from "../controls/virtual-joystick.js";
import { Attributes } from "../../systems/attributes/attributes.js";
import { CombatSystem } from "../../systems/combat/combat.js";
import { InventorySystem } from "../../systems/inventory/inventory.js";
import { EquipmentSystem } from "../../systems/equipment/equipment.js";
import { MagicSystem } from "../../systems/magic/magic.js";
import { QuestManager } from "../../systems/quests/quest-manager.js";
import { SaveManager } from "../../systems/save/save-manager.js";
import { CreatureManager } from "../../world/creatures/creature-manager.js";
import { BiomeManager } from "../../world/biomes/biome-manager.js";
import { WorldMap } from "../../world/maps/world-map.js";

/** Orquestra os sistemas principais do jogo. */
export class Game {
  constructor(canvas) {
    if (!canvas?.getContext) throw new Error("Canvas do jogo não encontrado.");
    this.canvas = canvas;
    this.state = createInitialState();
    this.renderer = new Renderer(canvas);
    this.camera = new Camera({ width: canvas.clientWidth || GAME_CONFIG.screen.width, height: canvas.clientHeight || GAME_CONFIG.screen.height, worldWidth: GAME_CONFIG.world.width, worldHeight: GAME_CONFIG.world.height, ...GAME_CONFIG.camera });
    this.effects = new EffectsManager();
    this.input = new InputManager();
    this.keyboard = new KeyboardController(this.input);
    this.joystick = null;
    const joystickElement = document.getElementById("virtual-joystick");
    if (joystickElement) this.joystick = new VirtualJoystick(joystickElement, { handle: joystickElement.querySelector(".joystick-knob") });

    this.attributes = new Attributes();
    this.inventory = new InventorySystem(40);
    this.equipment = new EquipmentSystem();
    this.magic = new MagicSystem({ mana: this.state.player.maxMana });
    this.quests = new QuestManager(this.createQuestCatalog());
    this.creatures = new CreatureManager();
    this.biomes = new BiomeManager([{ id: "greenlands", name: "Campos de Eryndor", bounds: { x: 0, y: 0, width: 5000, height: 5000 }, danger: 1 }]);
    this.worldMap = new WorldMap({ width: GAME_CONFIG.world.width, height: GAME_CONFIG.world.height });
    this.combat = new CombatSystem({ range: 68, cooldown: 500, onHit: result => this.showMessage(`-${result.damage} de dano`), onDefeat: enemy => this.handleDefeat(enemy) });
    this.saves = new SaveManager({ onLoad: (_slot, data) => this.applySave(data) });

    this.lastAttack = 0;
    this.message = "Explore Eryndor";
    this.messageTimer = 3000;
    this.seedWorld();
    this.loop = new GameLoop(dt => this.update(dt), () => this.render());
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
    this.bindInterface();
    this.resize();
  }

  createQuestCatalog() {
    const mainNames = ["O Despertar", "Rumores na Vila", "Estrada em Perigo", "A Mina Abandonada", "Ecos Antigos", "A Floresta Velada", "O Primeiro Selo", "Cinzas do Passado", "A Travessia", "O Reino Dividido", "A Torre Silenciosa", "A Magia Proibida", "O Dragão Adormecido", "A Coroa Partida", "O Destino de Eryndor"];
    const sideNames = ["Ervas para Alden", "Lobos na Estrada", "Ferramentas Perdidas", "Entrega do Ferreiro", "Água para a Vila", "Caçadores Desaparecidos", "Mercadorias Roubadas", "O Poço Antigo", "Uma Canção Distante", "O Mapa Rasgado"];
    const bonusNames = ["Prova do Guerreiro", "Caçada Noturna", "Relíquias Esquecidas", "Desafio Arcano", "Lenda dos Dragões"];
    const make = (names, type) => names.map((title, index) => ({ id: `${type}_${String(index + 1).padStart(2, "0")}`, type, title, description: `${title}: avance na jornada por Eryndor.`, objectives: [{ id: `${type}_${index + 1}_objective`, description: "Conclua o objetivo desta missão", required: 1 }], status: index === 0 && type === "main" ? "available" : "locked" }));
    return [...make(mainNames, "main"), ...make(sideNames, "side"), ...make(bonusNames, "bonus")];
  }

  seedWorld() {
    const size = GAME_CONFIG.world.tileSize;
    for (let y = 0; y < GAME_CONFIG.world.height; y += size) {
      for (let x = 0; x < GAME_CONFIG.world.width; x += size) {
        const edge = x < 96 || y < 96 || x > GAME_CONFIG.world.width - 128 || y > GAME_CONFIG.world.height - 128;
        this.state.world.tiles.push({ x, y, width: size, height: size, color: edge ? "#355b3b" : ((Math.floor(x / size) + Math.floor(y / size)) % 3 ? "#527b43" : "#587f47") });
      }
    }
    const cx = this.state.player.x;
    const cy = this.state.player.y;
    this.creatures.spawn("slime", cx + 180, cy + 40, { name: "Lodo Errante", health: 38, maxHealth: 38, attack: 7, healthBar: true, color: "#83b85c", hostile: true });
    this.creatures.spawn("wolf", cx - 210, cy + 120, { name: "Lobo Cinzento", health: 55, maxHealth: 55, attack: 10, healthBar: true, color: "#858b91", hostile: true });
    this.creatures.spawn("deer", cx + 260, cy - 170, { name: "Cervo", health: 24, maxHealth: 24, color: "#b58b58", hostile: false });
    this.camera.follow(this.state.player);
  }

  bindInterface() {
    const byId = id => document.getElementById(id);
    byId("attack-button")?.addEventListener("click", () => this.attack());
    byId("interact-button")?.addEventListener("click", () => this.interact());
    byId("save-button")?.addEventListener("click", () => this.save(0));
    byId("load-button")?.addEventListener("click", () => this.load(0));
    byId("pause-button")?.addEventListener("click", () => this.state.flags.paused = !this.state.flags.paused);
  }

  start() { this.state.running = true; this.loop.start(); }
  pause() { this.state.flags.paused = true; }
  resume() { this.state.flags.paused = false; }
  stop() { this.state.running = false; this.loop.stop(); }

  update(dt) {
    if (this.state.flags.paused) return;
    const p = this.state.player;
    const movement = this.input.getMovement();
    const stick = this.joystick?.getDirection() || { x: 0, y: 0 };
    let dx = movement.x + stick.x;
    let dy = movement.y + stick.y;
    const length = Math.hypot(dx, dy);
    p.moving = length > 0.12;
    if (p.moving) {
      dx /= Math.max(1, length); dy /= Math.max(1, length);
      const speed = this.attributes.getDerived().moveSpeed;
      const distance = speed * dt / 1000;
      p.x += dx * distance; p.y += dy * distance;
      p.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    }
    p.x = Math.max(0, Math.min(GAME_CONFIG.world.width - p.width, p.x));
    p.y = Math.max(0, Math.min(GAME_CONFIG.world.height - p.height, p.y));
    this.creatures.update(dt, p);
    for (const enemy of this.creatures.getNearby(p.x, p.y, 34)) {
      if (!enemy.hostile || enemy.health <= 0) continue;
      enemy.contactCooldown = Math.max(0, (enemy.contactCooldown || 0) - dt);
      if (enemy.contactCooldown === 0) {
        const armor = this.attributes.getDerived().defense + this.equipment.getBonuses().defense;
        p.health = Math.max(0, p.health - Math.max(1, (enemy.attack || 5) - armor));
        enemy.contactCooldown = 1100;
        this.showMessage(`${enemy.name || "Inimigo"}: você recebeu dano!`);
        if (p.health <= 0) { p.health = 1; this.showMessage("Você está exausto. Afaste-se para se recuperar."); }
      }
    }
    this.combat.update(dt);
    this.magic.update(dt);
    this.camera.update(dt);
    this.effects.update(dt);
    if (this.input.isPressed("attack")) this.attack();
    if (this.input.isPressed("interact")) this.interact();
    this.messageTimer = Math.max(0, this.messageTimer - dt);
    this.updateHud();
  }

  attack() {
    const p = this.state.player;
    const target = this.creatures.getNearby(p.x + p.width / 2, p.y + p.height / 2, 75).filter(c => c.hostile && c.health > 0).sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
    if (!target) { this.showMessage("Nenhum inimigo ao alcance"); return; }
    p.attack = this.attributes.getDerived().attack + this.equipment.getBonuses().attack;
    this.combat.attack(p, target, { criticalChance: this.attributes.getDerived().criticalChance });
  }

  handleDefeat(enemy) {
    enemy.alive = false; this.creatures.remove(enemy.id);
    const xp = enemy.type === "wolf" ? 35 : 20;
    const levels = this.attributes.addExperience(xp);
    this.showMessage(`Inimigo derrotado! +${xp} XP${levels ? ` | Nível ${this.attributes.level}!` : ""}`);
  }

  interact() {
    const p = this.state.player;
    const near = this.creatures.getNearby(p.x, p.y, 90).find(c => !c.hostile);
    this.showMessage(near ? `${near.name}: observa a região com cautela.` : "Não há nada para interagir por perto.");
  }

  showMessage(text) { this.message = text; this.messageTimer = 2400; }

  updateHud() {
    const p = this.state.player;
    const hp = document.getElementById("health-value");
    const mp = document.getElementById("mana-value");
    const lvl = document.getElementById("level-value");
    const msg = document.getElementById("game-message");
    if (hp) hp.textContent = `${Math.ceil(p.health)}/${p.maxHealth}`;
    if (mp) mp.textContent = `${Math.ceil(this.magic.mana)}/${this.magic.maxMana}`;
    if (lvl) lvl.textContent = String(this.attributes.level);
    if (msg) msg.textContent = this.messageTimer > 0 ? this.message : "";
  }

  render() {
    this.renderer.render({ camera: this.camera.getPosition(), tiles: this.state.world.tiles, entities: [this.state.player, ...this.creatures.toJSON()], effects: this.effects.getEffects() });
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.renderer.resize(rect.width || GAME_CONFIG.screen.width, rect.height || GAME_CONFIG.screen.height);
    this.camera.resize(this.renderer.width, this.renderer.height);
  }

  createSaveData() {
    return { version: 1, savedAt: new Date().toISOString(), player: { ...this.state.player }, attributes: this.attributes.toJSON(), inventory: this.inventory.list(), equipment: this.equipment.getAll(), magic: { mana: this.magic.mana, known: [...this.magic.known.values()] }, quests: this.quests.toJSON(), creatures: this.creatures.toJSON(), worldMap: this.worldMap.toJSON() };
  }
  save(slot = 0) { const ok = this.saves.save(slot, this.createSaveData()); this.showMessage(ok ? `Jogo salvo no espaço ${slot + 1}` : "Não foi possível salvar"); return ok; }
  load(slot = 0) { const data = this.saves.load(slot); if (!data) { this.showMessage("Nenhum save encontrado nesse espaço"); return false; } this.applySave(data); this.showMessage("Jogo carregado"); return true; }
  applySave(data) {
    if (!data?.player) return;
    Object.assign(this.state.player, data.player);
    if (data.attributes) this.attributes = Attributes.fromJSON(data.attributes);
    this.inventory.load(data.inventory || []);
    this.equipment.load(data.equipment || {});
    if (data.magic) { this.magic.mana = data.magic.mana; this.magic.known = new Map((data.magic.known || []).map(s => [s.id, s])); }
    if (data.quests) this.quests.load(data.quests);
    if (data.creatures) this.creatures.load(data.creatures);
    if (data.worldMap) this.worldMap.load(data.worldMap);
  }
  destroy() {
    this.stop(); window.removeEventListener("resize", this.resize);
    this.joystick?.destroy(); this.input.destroy(); this.renderer.destroy();
  }
}
