import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const worker = readFileSync('public/sw.js','utf8').replace('/* BUILD_CONFIG */ null',JSON.stringify({cacheName:'new',prefix:'loopr-',shell:[],base:'/loopr/'}));
function setup(windows) {
  const handlers={}; const replies=[]; let skipped=0;
  vm.runInNewContext(worker, {self:{registration:{scope:'https://example.com/loopr/'},clients:{matchAll:async()=>windows},addEventListener:(name,fn)=>{handlers[name]=fn;},skipWaiting:async()=>{skipped++;}}});
  return {replies,skipped:()=>skipped,send:async(type,id='caller')=>{let work;handlers.message({data:{type},source:{id},ports:[{postMessage:value=>replies.push(value)}],waitUntil:promise=>{work=promise;}});await work;}};
}
const client=(id,url='https://example.com/loopr/')=>({id,url});
test('only sole requesting client may activate; checks alone never activate',async()=>{
  const s=setup([client('caller')]);await s.send('LOOPR_UPDATE_CHECK');assert.equal(s.replies[0].allowed,true);assert.equal(s.skipped(),0);
  await s.send('LOOPR_UPDATE_ACTIVATE');assert.equal(s.skipped(),1);
});
test('other windows, including older clients, block forced activation',async()=>{
  const s=setup([client('caller'),client('old','https://example.com/loopr/doing')]);await s.send('LOOPR_UPDATE_ACTIVATE');assert.equal(s.replies[0].allowed,false);assert.equal(s.skipped(),0);
});
test('missing or mismatched caller fails closed',async()=>{
  for(const windows of [[],[client('someone-else')]]){const s=setup(windows);await s.send('LOOPR_UPDATE_ACTIVATE');assert.equal(s.replies[0].allowed,false);assert.equal(s.skipped(),0);}
});
test('unrelated apps do not block an update',async()=>{
  const s=setup([client('caller'),client('unrelated','https://example.com/other/')]);await s.send('LOOPR_UPDATE_ACTIVATE');assert.equal(s.skipped(),1);
});
