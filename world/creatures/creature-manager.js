/** Spawn e atualização simples de criaturas do mundo. */
export class CreatureManager {
 constructor({maxCreatures=80}={}){this.maxCreatures=maxCreatures;this.creatures=new Map();this.nextId=1;}
 spawn(type,x,y,options={}){if(this.creatures.size>=this.maxCreatures)return null;const id=options.id||`creature_${this.nextId++}`;const c={id,type,x,y,width:options.width||28,height:options.height||30,health:options.health||40,maxHealth:options.maxHealth||options.health||40,speed:options.speed||35,hostile:options.hostile??true,alive:true,...options};this.creatures.set(id,c);return c;}
 remove(id){return this.creatures.delete(id);}
 get(id){return this.creatures.get(id)||null;}
 update(dt,player){for(const c of this.creatures.values()){if(!c.alive||!c.hostile||!player)continue;const dx=player.x-c.x,dy=player.y-c.y,d=Math.hypot(dx,dy);if(d>0&&d<(c.aggroRange||180)){const step=c.speed*dt/1000;c.x+=dx/d*step;c.y+=dy/d*step;}}}
 getNearby(x,y,radius=250){return [...this.creatures.values()].filter(c=>c.alive&&Math.hypot(c.x-x,c.y-y)<=radius);}
 toJSON(){return [...this.creatures.values()];}
 load(data=[]){this.creatures=new Map(data.map(c=>[c.id,{...c}]));}
}
