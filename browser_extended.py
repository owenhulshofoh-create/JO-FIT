from pathlib import Path
source=(Path(__file__).parent/'browser_smoke.py').read_text().split('with sync_playwright()')[0]
exec(source)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':375,'height':850},accept_downloads=True)
 errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
 page.on('dialog',lambda dialog: dialog.accept('Jonathan') if dialog.type=='prompt' else dialog.accept())
 page.evaluate("""(() => {const data={};const store={getItem:k=>Object.prototype.hasOwnProperty.call(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]},clear:()=>{for(const k of Object.keys(data))delete data[k]},get length(){return Object.keys(data).length}};Object.defineProperty(window,'localStorage',{configurable:true,value:store});Object.defineProperty(window,'sessionStorage',{configurable:true,value:store});})();""")
 page.set_content(HTML,wait_until='load')
 assert page.locator('#joIntakeForm').count()==1
 page.locator('#joNext').click();page.locator('#joNext').click()
 assert 'materiaal' in page.locator('h3').first.text_content().lower() or 'waar' in page.locator('h3').first.text_content().lower()
 page.evaluate("switchTab('today')");page.evaluate("switchTab('intake')")
 assert 'Waar en waarmee' in page.locator('.jo-wizard h3').text_content();print('intake_resumes: PASS')
 for _ in range(2):page.locator('#joNext').click()
 assert page.locator('.jo-day-preview').count()==3
 page.locator('#joNext').click()
 assert page.locator('#routineSelect option').count()==2
 print('plan_added_without_overwriting: PASS')
 page.evaluate("addNewProfile()")
 p2=page.evaluate('activeProfile');assert p2!='p_eigen';print('new_profile',p2)
 page.evaluate("switchTab('intake')")
 assert page.locator('.jo-wizard h3').text_content().startswith('1. ')
 page.evaluate("switchProfile('p_eigen')")
 page.evaluate("switchTab('duo')")
 assert page.locator('#joDuoGuest').count()==1
 page.locator('#joDuoConsent').check()
 page.locator('#joDuoStart').click()
 print('duo_after',page.locator('#view').text_content()[:900], 'state', page.evaluate('JODUO.currentSession()'), 'errors',errors);assert page.locator('#joDuoRecord').count()==1
 page.locator('#joDuoKg').fill('15');page.locator('#joDuoReps').fill('10');page.locator('#joDuoRecord').click()
 print('after_first',page.locator('.jo-turn strong').text_content(),page.evaluate('JODUO.currentSession()'),errors);assert 'Jonathan' in page.locator('.jo-turn strong').text_content()
 page.locator('#joDuoKg').fill('12');page.locator('#joDuoReps').fill('8');page.locator('#joDuoRecord').click()
 result=page.evaluate("() => {const x=JSON.parse(localStorage.getItem('forma_v2_profiles'));return Object.entries(x.profiles).map(([id,p])=>({id,n:p.name,sessions:p.sessions.length,duo:p.sessions.filter(s=>s.duo).map(s=>s.exercises[0].kg)}))}")
 print('duo_personal_logs',result)
 assert len(result)==2 and all(p['sessions']==1 for p in result) and sorted(p['duo'][0] for p in result)==[12,15]
 print('duo_profile_separation: PASS')
 page.evaluate("switchTab('library')")
 assert page.locator('[data-lib="bw-squat"]').count()==1
 page.locator('[data-lib="bw-squat"]').click(position={'x':140,'y':80})
 assert page.locator('.modal.jo-no-animation').count()==1
 assert page.locator('.jo-missing-demo').count()==1
 page.evaluate('closeExercise()')
 print('no_false_animation: PASS')
 with page.expect_download(timeout=12000) as dl:
  page.evaluate('exportProfile()')
 download=dl.value
 path='/mnt/data/JO-FIT-5-werk/tests/export-test.json';download.save_as(path)
 content=__import__('json').load(open(path));assert content['format']=='jofit-5-personal-backup' and 'intake' in content and 'vision' in content
 print('backup_has_intake_vision: PASS')
 print('errors',errors)
 assert not errors
 browser.close()
