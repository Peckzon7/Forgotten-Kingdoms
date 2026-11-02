import { MathUtils } from '../../scripts/utilities/math.js';
/** Seleção de alvos próximos e válidos. */
export class TargetingSystem {
  constructor(range=160) { this.range=range; this.current=null; }
  findNearest(origin, targets, options={}) { const valid=(targets||[]).filter(t=>t && t!==origin && t.health>0 && (!options.filter || options.filter(t))); let best=null, distance=this.range; for(const target of valid){ const d=MathUtils.distance(origin.x,origin.y,target.x,target.y); if(d<distance){distance=d;best=target;} } this.current=best; return best; }
  isInRange(a,b,range=this.range) { return Boolean(a&&b&&MathUtils.distance(a.x,a.y,b.x,b.y)<=range); }
  clear(){this.current=null;}
}
