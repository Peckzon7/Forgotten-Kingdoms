/** Gerencia chefes, fases e vitórias. */
export class BossManager {
  constructor({ onDefeat = null, onPhase = null } = {}) { this.bosses=new Map(); this.active=null; this.onDefeat=onDefeat; this.onPhase=onPhase; }
  register(id, data) { if (!id || !data) throw new Error('Chefe inválido'); this.bosses.set(id,{ id, name:data.name||id, maxHealth:data.maxHealth||500, health:data.maxHealth||500, phases:data.phases||[], phase:0, defeated:false, ...data }); return this.bosses.get(id); }
  start(id) { const boss=this.bosses.get(id); if (!boss || boss.defeated) return false; boss.health=boss.maxHealth; boss.phase=0; this.active=boss; return boss; }
  damage(amount) { if (!this.active) return null; const b=this.active; b.health=Math.max(0,b.health-Math.max(0,Number(amount)||0)); const ratio=b.health/b.maxHealth; const next=b.phases.filter(p=>ratio <= p.healthPercent).length; if (next>b.phase) { b.phase=next; this.onPhase?.(b,b.phase); } if (!b.health) { b.defeated=true; this.onDefeat?.(b); this.active=null; } return { health:b.health, maxHealth:b.maxHealth, defeated:b.defeated, phase:b.phase }; }
  getActive() { return this.active; }
  isDefeated(id) { return Boolean(this.bosses.get(id)?.defeated); }
  toJSON() { return [...this.bosses.values()].map(({id,health,phase,defeated})=>({id,health,phase,defeated})); }
  load(data=[]) { for (const saved of data) { const b=this.bosses.get(saved.id); if(b) Object.assign(b,saved); } }
}
