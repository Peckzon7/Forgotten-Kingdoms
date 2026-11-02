/** Cidades, serviços e pontos de interesse. */
export class CityManager {
 constructor(cities=[]){this.cities=new Map(cities.map(c=>[c.id,{...c,services:c.services||[],discovered:!!c.discovered}]));}
 register(city){if(!city?.id)return false;this.cities.set(city.id,{services:[],discovered:false,...city});return true;}
 discover(id){const c=this.cities.get(id);if(!c)return false;c.discovered=true;return true;}
 get(id){return this.cities.get(id)||null;}
 findNearest(x,y){return [...this.cities.values()].filter(c=>c.x!=null&&c.y!=null).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]||null;}
 list({discoveredOnly=false}={}){return [...this.cities.values()].filter(c=>!discoveredOnly||c.discovered);}
}
