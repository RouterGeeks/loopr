const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://localhost:4173/');
  const texts=['A quieter morning','Put my phone away','Walk before coffee','Prepare breakfast','Make room to breathe'];
  for (const count of [0,1,2,3,4]) {
   await page.evaluate(({texts,count})=>localStorage.setItem('loopr.loops',JSON.stringify(texts.map((text,i)=>({id:i+1,text,status:'do',...(i===0 && count?{connections:Array.from({length:count},(_,j)=>j+2)}:{})})))),{texts,count});
   await page.goto('http://localhost:4173/thoughts/1/connections'); await page.reload();
   await page.waitForFunction(count=>document.querySelectorAll('.constellation-lines line').length===count,count);
   for (const width of [320,375,390]) for(const font of ['16px','32px']) {
    await page.setViewportSize({width,height:844}); await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
    await page.waitForFunction(()=>{
     const graph=document.querySelector('.thought-graph').getBoundingClientRect();
     const dots=[...document.querySelectorAll('.dot-circle')].map(el=>el.getBoundingClientRect());
     return [...document.querySelectorAll('.constellation-lines line')].every((line,i)=>Math.abs(+line.getAttribute('x1')-(dots[0].x+dots[0].width/2-graph.x))<1 && Math.abs(+line.getAttribute('y1')-(dots[0].y+dots[0].height/2-graph.y))<1 && Math.abs(+line.getAttribute('x2')-(dots[i+1].x+dots[i+1].width/2-graph.x))<1 && Math.abs(+line.getAttribute('y2')-(dots[i+1].y+dots[i+1].height/2-graph.y))<1);
    });
    const boxes=await page.locator('.thought-dot').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
    boxes.forEach(a=>{assert(a.w>=44 && a.h>=44);assert(a.x>=0 && a.x+a.w<=width);});
    boxes.forEach((a,i)=>boxes.slice(i+1).forEach(b=>assert(a.x+a.w<=b.x || b.x+b.w<=a.x || a.y+a.h<=b.y || b.y+b.h<=a.y,'overlapping tap targets')));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='');
  await page.screenshot({path:'/private/tmp/dash-dot-dot-constellation.png',fullPage:true});
  await page.getByRole('link',{name:'Open thought: Walk before coffee',exact:true}).focus(); await page.keyboard.press('Enter');
  await page.getByRole('group',{name:'Walk before coffee',exact:true}).waitFor();
  await page.getByRole('link',{name:'← Back to connections',exact:true}).click();
  await page.getByRole('button',{name:'List',exact:true}).click();await page.getByRole('link',{name:'Walk before coffee →',exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS constellation 0–4 neighbors, direct dot endpoints, nonoverlapping 44px targets, 320/375/390px at 100/200% text, keyboard navigation and List');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
