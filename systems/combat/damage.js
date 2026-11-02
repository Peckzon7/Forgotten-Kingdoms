/** Cálculo de dano centralizado. */
export class DamageCalculator {
  static calculate({ attack=1, defense=0, multiplier=1, critical=false, armorPenetration=0 }={}) { const effectiveDefense=Math.max(0,defense-armorPenetration); const raw=Math.max(1,attack*multiplier-effectiveDefense*.55); return Math.max(1,Math.round(raw*(critical?1.75:1))); }
  static apply(target, amount) { if (!target || typeof target.health!=='number') return 0; const before=target.health; target.health=Math.max(0,Math.min(target.maxHealth ?? Infinity,before-Math.max(0,amount))); return before-target.health; }
}
