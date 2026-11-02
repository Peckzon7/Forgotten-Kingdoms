/** NPCs, interação e estado de diálogo. */
export class NPCManager {
 constructor(npcs=[]){this.npcs=new Map(npcs.map(n=>[n.id,{...n,available:n.available!==false}]));this.nearby=null;}
 register(npc){if(!npc?.id)return false;this.npcs.set(npc.id,{available:true,...npc});return true;}
 get(id){return this.npcs.get(id)||null;}
 findNearby(x,y,range=75){let best=null,dist=range;for(const n of this.npcs.values()){if(!n.available)continue;const d=Math.hypot(n.x-x,n.y-y);if(d<dist){dist=d;best=n;}}this.nearby=best;return best;}
 interact(id){const n=this.get(id);if(!n||!n.available)return null;n.onInteract?.(n);return n.dialogue||null;}
 setAvailable(id,value){const n=this.get(id);if(!n)return false;n.available=!!value;return true;}
 list(){return [...this.npcs.values()];}
}
