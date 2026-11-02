/** Dados e descoberta do mapa-múndi. */
export class WorldMap {
 constructor({width=5000,height=5000,regions=[]}={}){this.width=width;this.height=height;this.regions=new Map(regions.map(r=>[r.id,{...r,discovered:!!r.discovered}]));this.markers=[];}
 addRegion(region){if(!region?.id)return false;this.regions.set(region.id,{discovered:false,...region});return true;}
 discover(id){const r=this.regions.get(id);if(!r)return false;r.discovered=true;return true;}
 isDiscovered(id){return !!this.regions.get(id)?.discovered;}
 addMarker(marker){if(!marker?.id)return false;this.markers=this.markers.filter(m=>m.id!==marker.id);this.markers.push({...marker});return true;}
 removeMarker(id){this.markers=this.markers.filter(m=>m.id!==id);}
 getVisibleMarkers(){return this.markers.filter(m=>!m.regionId||this.isDiscovered(m.regionId));}
 getRegions(){return [...this.regions.values()];}
 toJSON(){return {regions:[...this.regions.values()],markers:this.markers};}
 load(data={}){for(const r of data.regions||[])if(this.regions.has(r.id))this.regions.set(r.id,r);this.markers=data.markers||[];}
}
