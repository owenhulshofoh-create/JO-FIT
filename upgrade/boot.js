/* One-line integration. Original JO FIT application keeps all existing handlers. */
(function(){'use strict';const files=['config.js','data.js','coach-engine.js','ui.js','backup-cloud.js','motion-core.js','vision-ai.js','coach-ui.js'];const link=document.createElement('link');link.rel='stylesheet';link.href='./upgrade/upgrade.css';document.head.append(link);
const load=x=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src='./upgrade/'+x;s.onload=ok;s.onerror=()=>fail(Error('Bestand ontbreekt: '+x));document.body.append(s)});
files.reduce((p,x)=>p.then(()=>load(x)),Promise.resolve()).then(()=>{
 document.title='JO FIT · Jouw fitness app';const logo=document.querySelector('.brandtag');if(logo)logo.textContent='JOUW FITNESS APP';const hero=document.querySelector('.forma-hero-art>img');if(hero){hero.src='./assets/jofit-hero.webp';hero.alt='Twee sporters in een donkere gym';}
 const texts={'formaHeroTitle':'Jouw fitness','formaHeroAccent':'app','formaHeroDescription':'Naar een idee van Owen en Jonathan'};
 for(const [id,v] of Object.entries(texts)){const el=document.getElementById(id);if(el&&(!el.textContent.trim()||/Jouw kracht|Jouw vooruitgang|Train doelgericht|Zie wat je bereikt/i.test(el.textContent)))el.textContent=v}
 function correct(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())if(node.parentElement&&!/^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(node.parentElement.tagName)&&/\bForma\b/.test(node.nodeValue))node.nodeValue=node.nodeValue.replace(/\bForma\b/g,'JO FIT')}
 correct(document.body);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&/forma-(?:welcome|share)/.test(n.className||''))correct(n)}))).observe(document.body,{childList:true});
 window.JOFIT_UI.setup();window.JOFIT_COACH.init();window.JOFIT_BACKUP.init();const root=document.querySelector('#view');if(root)new MutationObserver(()=>{if(window.JOFIT_DATA.tab()==='vision')window.JOFIT_VISION.render()}).observe(root,{childList:true});
 if(window.JOFIT_DATA.tab()==='vision')window.JOFIT_VISION.render();window.JOFIT_UPGRADE_READY=true;
 }).catch(e=>{console.error(e);const div=document.createElement('div');div.textContent='JO FIT-uitbreiding niet geladen: '+e.message;div.style.cssText='position:fixed;bottom:8px;left:8px;right:8px;background:#652f40;padding:12px;color:white;z-index:9999';document.body.append(div)})
})();
