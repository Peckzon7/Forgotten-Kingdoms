/** Magias comuns e amaldiçoadas, custo e recarga. */
export class MagicSystem {
 constructor({mana=100,known=[]}={}){this.mana=mana;this.maxMana=mana;this.known=new Map(known.map(s=>[s.id,s]));this.cooldowns=new Map();}
 learn(spell){if(!spell?.id)return false;this.known.set(spell.id,{...spell});return true;}
 cast(id,caster,target=null){const spell=this.known.get(id);if(!spell)return {success:false,reason:'unknown'};if((this.cooldowns.get(id)||0)>0)return {success:false,reason:'cooldown'};if(this.mana<(spell.manaCost||0))return {success:false,reason:'mana'};this.mana-=spell.manaCost||0;this.cooldowns.set(id,spell.cooldown||0);const result=spell.effect?spell.effect({caster,target,spell}):{damage:spell.damage||0,heal:spell.heal||0};if(target&&result.damage)target.health=Math.max(0,target.health-result.damage);if(caster&&result.heal)caster.health=Math.min(caster.maxHealth||Infinity,caster.health+result.heal);return {success:true,result,spell};}
 update(dt){for(const [id,time] of this.cooldowns){const next=Math.max(0,time-dt);if(next)this.cooldowns.set(id,next);else this.cooldowns.delete(id);}}
 restore(amount){this.mana=Math.min(this.maxMana,this.mana+Math.max(0,amount));}
}
