/** Reinos, relações políticas e controle territorial. */
export class KingdomManager {
 constructor(kingdoms=[]){this.kingdoms=new Map(kingdoms.map(k=>[k.id,{...k,relations:k.relations||{}}]));}
 register(k){if(!k?.id)return false;this.kingdoms.set(k.id,{relations:{},...k});return true;}
 get(id){return this.kingdoms.get(id)||null;}
 setRelation(a,b,value){const first=this.get(a);if(!first||!this.get(b))return false;first.relations[b]=Math.max(-100,Math.min(100,Number(value)||0));return true;}
 getRelation(a,b){return this.get(a)?.relations?.[b]??0;}
 list(){return [...this.kingdoms.values()];}
}
