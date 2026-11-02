/** Caixa de diálogo com fila, escolhas e callbacks. */
export class DialogueSystem {
  constructor({onLine=null,onEnd=null}={}){this.queue=[];this.current=null;this.active=false;this.onLine=onLine;this.onEnd=onEnd;}
  start(lines=[]){this.queue=[...lines];this.active=true;this.next();return this.current;}
  next(){if(!this.active)return null;this.current=this.queue.shift()||null;if(!this.current){this.active=false;this.onEnd?.();return null;}this.onLine?.(this.current);return this.current;}
  choose(index){const choices=this.current?.choices||[];const choice=choices[index];if(!choice)return false;choice.action?.();if(choice.nextLines)this.queue.unshift(...choice.nextLines);this.next();return true;}
  close(){this.queue=[];this.current=null;this.active=false;this.onEnd?.();}
  isActive(){return this.active;}
}
