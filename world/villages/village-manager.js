/** Aldeias e estado de descoberta. */
export class VillageManager {
 constructor(villages=[]){this.villages=new Map(villages.map(v=>[v.id,{...v,discovered:!!v.discovered}]));}
 register(v){if(!v?.id)return false;this.villages.set(v.id,{discovered:false,...v});return true;}
 discover(id){const v=this.villages.get(id);if(!v)return false;v.discovered=true;return true;}
 get(id){return this.villages.get(id)||null;}
 nearest(x,y){return [...this.villages.values()].sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]||null;}
 list({discoveredOnly=false}={}){return [...this.villages.values()].filter(v=>!discoveredOnly||v.discovered);}
}
