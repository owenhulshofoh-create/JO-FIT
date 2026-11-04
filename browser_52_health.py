"""Real Chromium smoke: local app, not live GitHub/Supabase or mobile-device tests."""
import base64
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((ROOT/'index.html').read_text(),'html.parser')
for script in soup.find_all('script',src=True):
 src=script['src'].removeprefix('./');script.string=(ROOT/src).read_text();del script['src']
for link in soup.find_all('link',href=True):
 if link['href'].endswith('.css'):
  style=soup.new_tag('style');style.string=(ROOT/link['href'].removeprefix('./')).read_text();link.replace_with(style)
for img in soup.find_all('img',src=True):
 path=ROOT/img['src'].removeprefix('./')
 if path.is_file() and path.suffix in ('.webp','.png'):
  mime='image/webp' if path.suffix=='.webp' else 'image/png'
  img['src']='data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
HTML=str(soup)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (320,375,768,1280):
  context=browser.new_context(viewport={'width':width,'height':900},service_workers='block',accept_downloads=True)
  page=context.new_page();errors=[];page.on('pageerror',lambda error: errors.append(str(error)+'\n'+str(error.stack)))
  page.on('dialog',lambda d:d.accept())
  page.evaluate("""(() => {const data={};const store={getItem:k=>Object.hasOwn(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]},clear:()=>{for(const k of Object.keys(data))delete data[k]},get length(){return Object.keys(data).length}};Object.defineProperty(window,'localStorage',{configurable:true,value:store});Object.defineProperty(window,'sessionStorage',{configurable:true,value:store});})();""")
  page.set_content(HTML,wait_until='load',timeout=35000);page.wait_for_timeout(450)
  print('width',width,'nav',page.locator('.navrow button[data-main]').count(),'errors',errors[:2]);assert not errors,errors
  assert page.locator('.navrow button[data-main]').count()==4
  page.evaluate("switchTab('schema')")
  assert page.locator('#routineSelect option').count()>=1
  old=page.evaluate("({day:current,items:schedule[current].map(e=>e.id),sessions:sessions.length,profile:activeProfile,mode:JOWORKOUT.setting(routines[activeRoutine],current)})")
  assert len(old['items'])>=2,old
  # Seed past log in the existing profile and keep it intact across remove/undo.
  page.evaluate("sessions.push({id:'test-old-log',date:'2026-10-10',day:current,sets:3,routine:'Mijn oude schema',exercises:[{id:schedule[current][0].id,sets:3,reps:'10',kg:20}]});persist()")
  first_name=page.locator('.jo-schedule-entry .exercise-title').first.text_content()
  page.locator('[data-remove-exercise]').first.click()
  removed=page.evaluate('({items:schedule[current].map(x=>x.id),logs:sessions.length})')
  assert len(removed['items'])==len(old['items'])-1
  assert removed['logs']==old['sessions']+1
  assert page.locator('#joUndoRemove').count()==1
  page.locator('#joUndoRemove').click()
  assert page.evaluate('schedule[current].map(x=>x.id)')==old['items']
  print('  remove+undo+keep-log PASS')
  # test powerset rest after both sets, no rest after A alone
  page.locator('#joTrainingMode').select_option('power')
  page.evaluate('stopRest()')
  page.locator('[data-inline-set]').first.click()
  assert page.evaluate('restEnds')==0, 'timer should not start after A'
  page.locator('[data-inline-set]').nth(1).click()
  assert page.evaluate('restEnds')>0,'timer should start after B'
  print('  A+B rest PASS')
  page.evaluate('stopRest()')
  # technique panel / no default stick figures
  page.locator('.exercise-main[data-open]').first.click()
  assert page.locator('.jo-tech-card').count()==1
  assert page.locator('.jo-tech-step').count()==5
  assert page.locator('.jo-atlas-collapse').count()==1
  assert page.locator('.jo-tech-upgraded .demo-stage').is_hidden()
  page.evaluate('closeExercise()')
  page.evaluate("switchTab('library')")
  assert page.locator('.libthumb svg').count()==0
  assert 'Bekijk animatie' not in page.locator('#view').text_content()
  print('  technique+library PASS')
  # health knowledge page (no form or private personal substance log)
  page.evaluate("switchTab('more')")
  assert page.locator('[data-more="health"]').count()==1
  page.locator('[data-more="health"]').click()
  assert 'Alcohol, drugs en jouw fitnessdoelen' in page.locator('#view h2').text_content()
  assert page.locator('.jo-health-topic').count()==5
  assert 'spiereiwitten' in page.locator('#view').text_content()
  assert page.locator('#view input').count()==0
  print('  health knowledge page PASS')
  page.evaluate("switchTab('progress')")
  assert page.locator('.jo-log-row').count()>=1
  assert not page.locator('.jo-log-row details').first.evaluate('(x)=>x.open')
  page.locator('.jo-log-row summary').first.click()
  assert page.locator('.jo-log-row details').first.evaluate('(x)=>x.open')
  print('  compact history PASS')
  diff=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
  print('  overflow px:',diff,'errors:',errors)
  assert diff<=3,(width,diff)
  assert not errors,errors
  if width==375:
   page.evaluate("switchTab('more')");page.locator('[data-more="health"]').click()
   page.screenshot(path='/mnt/data/JO-FIT-5.2-Gezondheid-mobiel.png',full_page=True)
   page.evaluate("switchTab('schema')");page.screenshot(path='/mnt/data/JO-FIT-5.2-Schema-mobiel.png',full_page=True)
  context.close()
 browser.close()
print('ALL BROWSER 5.2 TESTS PASSED')
