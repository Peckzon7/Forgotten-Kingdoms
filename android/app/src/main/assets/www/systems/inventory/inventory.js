/** Inventário com pilhas, capacidade e movimentação de itens. */
export class InventorySystem {
  constructor(capacity=30){this.capacity=capacity;this.items=[];}
  add(item,quantity=1){if(!item?.id||quantity<1)return false;const stackable=item.stackable!==false;const existing=stackable?this.items.find(i=>i.id===item.id):null;if(existing)existing.quantity+=quantity;else{if(this.items.length>=this.capacity)return false;this.items.push({...item,quantity});}return true;}
  remove(id,quantity=1){const i=this.items.findIndex(x=>x.id===id);if(i<0||quantity<1)return false;this.items[i].quantity-=quantity;if(this.items[i].quantity<=0)this.items.splice(i,1);return true;}
  has(id,quantity=1){return (this.items.find(x=>x.id===id)?.quantity||0)>=quantity;}
  count(id){return this.items.find(x=>x.id===id)?.quantity||0;}
  get(id){return this.items.find(x=>x.id===id)||null;}
  use(id,context={}){const item=this.get(id);if(!item||typeof item.use!=='function')return false;const result=item.use(context);if(result!==false&&item.consumable!==false)this.remove(id,1);return result!==false;}
  list(){return this.items.map(i=>({...i}));}
  load(items=[]){this.items=items.slice(0,this.capacity).map(i=>({...i}));}
}
