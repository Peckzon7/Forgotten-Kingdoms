/** Biomas e propriedades ambientais. */
export class BiomeManager {
 constructor(biomes=[]){this.biomes=new Map(biomes.map(b=>[b.id,{...b}]));this.current=null;}
 register(biome){if(!biome?.id)return false;this.biomes.set(biome.id,{...biome});return true;}
 get(id){return this.biomes.get(id)||null;}
 at(x,y){for(const b of this.biomes.values()){const r=b.bounds;if(r&&x>=r.x&&y>=r.y&&x<r.x+r.width&&y<r.y+r.height)return b;}return null;}
 enter(id){const b=this.get(id);if(!b)return false;this.current=b;return b;}
 getEnvironment(){return this.current?{name:this.current.name,weather:this.current.weather||'clear',danger:this.current.danger||0,movementMultiplier:this.current.movementMultiplier||1}:null;}
 list(){return [...this.biomes.values()];}
}
