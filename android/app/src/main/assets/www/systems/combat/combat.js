import { DamageCalculator } from './damage.js';
import { TargetingSystem } from './targeting.js';
/** Combate em tempo real: ataques, recarga e invulnerabilidade. */
export class CombatSystem {
  constructor(options={}) { this.targeting=new TargetingSystem(options.range||150); this.cooldown=options.cooldown||450; this.elapsed=this.cooldown; this.onHit=options.onHit||null; this.onDefeat=options.onDefeat||null; }
  update(dt){this.elapsed=Math.min(this.cooldown,this.elapsed+dt);}
  attack(attacker,target,options={}) { if(!attacker||!target||target.health<=0||this.elapsed<this.cooldown||!this.targeting.isInRange(attacker,target,options.range||this.targeting.range)) return {hit:false,reason:'unavailable'}; this.elapsed=0; const critical=Math.random()<(options.criticalChance||0); const damage=DamageCalculator.calculate({attack:attacker.attack||attacker.damage||10,defense:target.defense||0,multiplier:options.multiplier||1,critical,armorPenetration:options.armorPenetration||0}); const dealt=DamageCalculator.apply(target,damage); const result={hit:true,damage:dealt,critical,defeated:target.health<=0,target}; this.onHit?.(result); if(result.defeated)this.onDefeat?.(target); return result; }
  canAttack(){return this.elapsed>=this.cooldown;}
}
