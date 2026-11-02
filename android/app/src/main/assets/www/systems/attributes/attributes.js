/** Atributos, progressão e pontos de personagem. */
export class Attributes {
  constructor(base = {}) {
    this.base = { strength: 10, vitality: 10, agility: 10, intelligence: 10, defense: 0, ...base };
    this.level = 1; this.experience = 0; this.unspentPoints = 0;
  }
  get(name) { return Number(this.base[name] || 0); }
  set(name, value) { if (!(name in this.base)) throw new Error(`Atributo desconhecido: ${name}`); this.base[name] = Math.max(0, Number(value) || 0); }
  addPoint(name) { if (this.unspentPoints < 1 || !(name in this.base)) return false; this.base[name]++; this.unspentPoints--; return true; }
  addExperience(amount) { this.experience += Math.max(0, Number(amount) || 0); let gained=0; while (this.experience >= this.experienceToNext()) { this.experience -= this.experienceToNext(); this.level++; this.unspentPoints += 3; gained++; } return gained; }
  experienceToNext() { return Math.floor(100 * Math.pow(this.level, 1.35)); }
  getDerived() { return { maxHealth: 80 + this.get('vitality')*12, maxMana: 40 + this.get('intelligence')*10, attack: 5 + this.get('strength')*2, defense: this.get('defense') + Math.floor(this.get('vitality')/3), moveSpeed: 150 + this.get('agility')*2, criticalChance: Math.min(.5, this.get('agility')*.005) }; }
  toJSON() { return { base:{...this.base}, level:this.level, experience:this.experience, unspentPoints:this.unspentPoints }; }
  static fromJSON(data={}) { const a=new Attributes(data.base); a.level=data.level||1; a.experience=data.experience||0; a.unspentPoints=data.unspentPoints||0; return a; }
}
