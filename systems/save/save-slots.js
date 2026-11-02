import { Storage } from '../../scripts/utilities/storage.js';
/** Gerenciamento de três slots locais. */
export class SaveSlots {
 constructor(count=3){this.count=count;this.prefix='slot_';}
 save(index,data){if(!this.valid(index))return false;return Storage.save(this.prefix+index,{version:1,savedAt:Date.now(),data});}
 load(index){if(!this.valid(index))return null;return Storage.load(this.prefix+index,null);}
 delete(index){if(!this.valid(index))return false;Storage.remove(this.prefix+index);return true;}
 list(){return Array.from({length:this.count},(_,i)=>{const s=this.load(i);return {index:i,occupied:Boolean(s),savedAt:s?.savedAt||null};});}
 valid(index){return Number.isInteger(index)&&index>=0&&index<this.count;}
 export(index){const save=this.load(index);return save?JSON.stringify(save):null;}
 import(index,json){try{const parsed=JSON.parse(json);if(!parsed||!parsed.data||!this.valid(index))return false;return this.save(index,parsed.data);}catch{return false;}}
}
