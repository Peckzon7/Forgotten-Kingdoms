/** Renderização de minimapa em canvas 2D. */
export class Minimap {
 constructor(canvas,{width=180,height=130,worldWidth=5000,worldHeight=5000}={}){this.canvas=canvas;this.ctx=canvas?.getContext('2d');this.worldWidth=worldWidth;this.worldHeight=worldHeight;if(canvas){canvas.width=width;canvas.height=height;}}
 render({player,entities=[],locations=[]}={}){if(!this.ctx)return;const c=this.ctx,w=this.canvas.width,h=this.canvas.height;c.clearRect(0,0,w,h);c.fillStyle='#18251e';c.fillRect(0,0,w,h);const px=x=>x/this.worldWidth*w,py=y=>y/this.worldHeight*h;for(const e of entities){c.fillStyle=e.hostile?'#c65b4b':'#d4bd78';c.fillRect(px(e.x),py(e.y),3,3);}for(const l of locations){c.fillStyle='#e5d7a4';c.fillRect(px(l.x)-2,py(l.y)-2,4,4);}if(player){c.fillStyle='#75d8ff';c.beginPath();c.arc(px(player.x),py(player.y),4,0,Math.PI*2);c.fill();}}
 destroy(){this.canvas=null;this.ctx=null;}
}
