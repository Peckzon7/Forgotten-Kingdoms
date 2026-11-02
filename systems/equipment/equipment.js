/** Equipamentos e bônus de atributos. */
export class EquipmentSystem {
  constructor(slots=['weapon','shield','helmet','armor','boots','accessory']){this.slots=slots;this.equipped=Object.fromEntries(slots.map(s=>[s,s==='accessory'?[]:null]));}
  equip(item){if(!item||!this.slots.includes(item.slot))return {success:false,reason:'slot'};if(item.slot==='accessory'){const list=this.equipped.accessory;if(list.length>=2)return {success:false,reason:'full'};list.push(item);}else this.equipped[item.slot]=item;return {success:true};}
  unequip(slot,index=0){if(!this.slots.includes(slot))return null;if(slot==='accessory')return this.equipped.accessory.splice(index,1)[0]||null;const old=this.equipped[slot];this.equipped[slot]=null;return old;}
  getBonuses(){const result={attack:0,defense:0,maxHealth:0,maxMana:0,agility:0};for(const slot of this.slots){const items=slot==='accessory'?this.equipped[slot]:[this.equipped[slot]];for(const item of items){if(item?.bonuses)for(const [k,v] of Object.entries(item.bonuses))result[k]=(result[k]||0)+v;}}return result;}
  getAll(){return structuredClone(this.equipped);}
  load(data={}){for(const slot of this.slots)if(data[slot]!==undefined)this.equipped[slot]=data[slot];}
}
