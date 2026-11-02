import { SaveSlots } from './save-slots.js';
/** Salvar, carregar, exportar e importar progresso. */
export class SaveManager {
 constructor({slots=3,onSave=null,onLoad=null}={}){this.slots=new SaveSlots(slots);this.onSave=onSave;this.onLoad=onLoad;}
 save(index,state){const snapshot=JSON.parse(JSON.stringify(state));const ok=this.slots.save(index,snapshot);if(ok)this.onSave?.(index,snapshot);return ok;}
 load(index){const save=this.slots.load(index);if(!save)return null;this.onLoad?.(index,save.data);return save.data;}
 delete(index){return this.slots.delete(index);}
 list(){return this.slots.list();}
 export(index){return this.slots.export(index);}
 import(index,json){return this.slots.import(index,json);}
 download(index,filename='forgotten-kingdoms-save.json'){const data=this.export(index);if(!data)return false;const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);return true;}
}
