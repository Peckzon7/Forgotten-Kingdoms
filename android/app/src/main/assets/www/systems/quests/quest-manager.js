/** Missões principais, secundárias e bônus. */
export class QuestManager {
 constructor(quests=[]){this.quests=new Map(quests.map(q=>[q.id,{status:'locked',objectives:[],...q,objectives:(q.objectives||[]).map(o=>({...o,current:o.current||0,completed:false}))}]));this.activeId=null;this.completed=[];}
 unlock(id){const q=this.quests.get(id);if(!q||q.status==='completed')return false;q.status='available';return true;}
 start(id){const q=this.quests.get(id);if(!q||!['available','active'].includes(q.status))return false;q.status='active';this.activeId=id;return true;}
 progress(id,amount=1){const q=this.quests.get(id);if(!q||q.status!=='active')return false;const obj=q.objectives.find(o=>o.id===id||o.type===id||o.description===id);if(!obj)return false;obj.current=Math.min(obj.required||1,obj.current+amount);obj.completed=obj.current>=(obj.required||1);return true;}
 completeObjective(questId,objectiveId,amount=1){const q=this.quests.get(questId);const o=q?.objectives.find(x=>x.id===objectiveId);if(!o||q.status!=='active')return false;o.current=Math.min(o.required||1,o.current+amount);o.completed=o.current>=(o.required||1);return true;}
 isReady(id){const q=this.quests.get(id);return Boolean(q&&q.status==='active'&&q.objectives.every(o=>o.completed));}
 complete(id){const q=this.quests.get(id);if(!this.isReady(id))return false;q.status='completed';this.completed.push(id);if(this.activeId===id)this.activeId=null;return true;}
 get(id){return this.quests.get(id)||null;}
 list(type=null){return [...this.quests.values()].filter(q=>!type||q.type===type);}
 toJSON(){return {quests:[...this.quests.values()],activeId:this.activeId,completed:this.completed};}
 load(data={}){for(const q of data.quests||[]){if(this.quests.has(q.id))this.quests.set(q.id,q);}this.activeId=data.activeId||null;this.completed=data.completed||[];}
}
