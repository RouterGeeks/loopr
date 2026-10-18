import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const compile = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`;
const loops = compile(await readFile(new URL('../src/lib/loops.ts',import.meta.url),'utf8'));
const source=(await readFile(new URL('../src/lib/editorDraft.ts',import.meta.url),'utf8')).replace("'./loops'",JSON.stringify(loops));
const {EditorDraft,parseEditorDraft}=await import(compile(source));
const thought={id:1,text:'Original',status:'do',note:'Saved note',createdAt:'2026-10-18T12:00:00Z',labels:['Home']};
function setup(locks=true) {
 class Storage {
  values=new Map();failSet='';failRemove='';
  getItem(k){return this.values.get(k)??null;}
  setItem(k,v){if(k===this.failSet)throw Error('quota');this.values.set(k,v);}
  removeItem(k){if(k===this.failRemove)throw Error('quota');this.values.delete(k);}
 }
 globalThis.localStorage=new Storage();globalThis.sessionStorage=new Storage();globalThis.window=new EventTarget();
 window.localStorage=localStorage;localStorage.setItem('loopr.loops',JSON.stringify([thought]));
 const held=new Set();
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{locks:locks?{async request(key,options,callback){if(held.has(key))return callback(null);held.add(key);try{return await callback({name:key});}finally{held.delete(key);}}}:undefined}});
 return held;
}
test('same field has one owner; nonowner Cancel cannot clear a draft',async()=>{
 setup();const owner=new EditorDraft(thought,'note');await owner.start();owner.change('Unfinished');
 const other=new EditorDraft(thought,'note');await other.start();assert.equal(other.snapshot.ready,false);assert(other.snapshot.error.includes('another tab'));
 other.cancel();assert.equal(parseEditorDraft(localStorage.getItem('loopr.editorDraft.note.1')).text,'Unfinished');owner.cancel();
});
test('empty notes persist as drafts; Cancel discards recovery without changing saved data',async()=>{
 setup();const entry=new EditorDraft(thought,'note');await entry.start();entry.change('');
 assert.equal(parseEditorDraft(localStorage.getItem('loopr.editorDraft.note.1')).text,'');
 assert(entry.cancel());assert.equal(localStorage.getItem('loopr.editorDraft.note.1'),null);assert.equal(JSON.parse(localStorage.getItem('loopr.loops'))[0].note,'Saved note');
});
test('newer saved data requires review; a second change during review cannot be acknowledged blindly',async()=>{
 setup();const entry=new EditorDraft(thought,'text');await entry.start();entry.change('Mine');
 const replace=text=>localStorage.setItem('loopr.loops',JSON.stringify([{...thought,text}]));
 replace('Theirs');let writes=0;assert.equal(await entry.save(async()=>{writes++;return true;}),false);assert.equal(writes,0);
 replace('Theirs again');entry.review();assert(entry.snapshot.conflict);assert.equal(entry.snapshot.latest.text,'Theirs again');entry.review();assert.equal(entry.snapshot.conflict,false);
 localStorage.setItem('loopr.loops','[]');assert.equal(await entry.save(async()=>{writes++;return true;}),false);assert.equal(writes,0);assert.equal(entry.snapshot.text,'Mine');entry.cancel();
});
test('draft storage failure prevents Save; failed thought writes and busy Cancel retain text',async()=>{
 setup();const entry=new EditorDraft(thought,'text');await entry.start();localStorage.failSet='loopr.editorDraft.text.1';entry.change('Mine');
 let writes=0;assert.equal(await entry.save(async()=>{writes++;return true;}),false);assert.equal(writes,0);assert(entry.snapshot.error);
 localStorage.failSet='';let resolve;const waiting=new Promise(r=>resolve=r);const save=entry.save(()=>waiting);assert.equal(entry.cancel(),false);entry.change('Cannot edit while saving');assert.equal(entry.snapshot.text,'Mine');resolve(false);assert.equal(await save,false);
 assert.equal(parseEditorDraft(localStorage.getItem('loopr.editorDraft.text.1')).text,'Mine');entry.cancel();
});
test('committed save with failed cleanup retries without writing the thought twice',async()=>{
 setup();const entry=new EditorDraft(thought,'note');await entry.start();entry.change('New note');localStorage.failRemove='loopr.editorDraft.note.1';let writes=0;
 const write=async value=>{writes++;localStorage.setItem('loopr.loops',JSON.stringify([{...thought,note:value}]));return true;};
 assert.equal(await entry.save(write),false);assert.equal(writes,1);localStorage.failRemove='';assert.equal(await entry.save(write),true);assert.equal(writes,1);assert.equal(localStorage.getItem('loopr.editorDraft.note.1'),null);
});
test('session fallback does not write shared drafts; malformed draft bytes remain untouched',async()=>{
 setup(false);let entry=new EditorDraft(thought,'text');await entry.start();entry.change('Session');assert(entry.snapshot.limited);assert.equal(localStorage.getItem('loopr.editorDraft.text.1'),null);assert.equal(parseEditorDraft(sessionStorage.getItem('loopr.editorSession.text.1')).text,'Session');entry.cancel();
 setup();localStorage.setItem('loopr.editorDraft.note.1','bad');entry=new EditorDraft(thought,'note');await entry.start();assert.equal(entry.snapshot.ready,false);entry.change('Cannot overwrite');entry.cancel();assert.equal(localStorage.getItem('loopr.editorDraft.note.1'),'bad');
 for(const bad of [{version:2},{version:1,id:1,kind:'labels',text:'',base:thought},{version:1,id:1,kind:'note',text:'',base:{...thought,id:2}}])assert.throws(()=>parseEditorDraft(JSON.stringify(bad)));
});

test('failed Cancel retains owned text; denied ownership access does not touch shared storage',async()=>{
 setup();let entry=new EditorDraft(thought,'note');await entry.start();entry.change('Keep');localStorage.failRemove='loopr.editorDraft.note.1';assert.equal(entry.cancel(),false);assert.equal(entry.snapshot.text,'Keep');assert.equal(parseEditorDraft(localStorage.getItem('loopr.editorDraft.note.1')).text,'Keep');localStorage.failRemove='';entry.cancel();
 setup();navigator.locks.request=async()=>{throw Error('denied');};entry=new EditorDraft(thought,'text');await entry.start();assert.equal(entry.snapshot.ready,false);entry.change('Do not write');assert.equal(localStorage.getItem('loopr.editorDraft.text.1'),null);assert.equal(sessionStorage.getItem('loopr.editorSession.text.1'),null);entry.cancel();
});

test('Cancel during ownership acquisition releases the late lock without reopening a draft',async()=>{
 const held=setup();const entry=new EditorDraft(thought,'text');const starting=entry.start();assert(entry.cancel());await starting;await Promise.resolve();assert.equal(held.size,0);assert.equal(entry.snapshot.ready,false);assert.equal(localStorage.getItem('loopr.editorDraft.text.1'),null);
});
