// Optional authoring tool: render the editable SVG to existing PWA PNG sizes.
// Requires local Playwright + Chromium; not part of build or CI.
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch();try{
 const svg=fs.readFileSync('public/brand-icon.svg','utf8');
 for(const [name,size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180],['apple-touch-icon-lavender-v1.png',180],['favicon.png',32]]){
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  await page.setContent(`<style>html,body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
  await page.screenshot({path:`public/${name}`});await page.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
