from playwright.sync_api import sync_playwright
import json,sys,base64
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
bs=BeautifulSoup((ROOT/"index.html").read_text(),"html.parser")
for script in bs.find_all("script"):
 src=script.get("src")
 if src:
  script.string=(ROOT/src.removeprefix("./")).read_text(); del script["src"]
for link in bs.find_all("link",href=True):
 if link["href"].endswith(".css"):
  st=bs.new_tag("style");st.string=(ROOT/link["href"].removeprefix("./")).read_text();link.replace_with(st)
for img in bs.find_all("img",src=True):
 path=ROOT/img["src"].removeprefix("./")
 if path.is_file() and path.suffix in (".webp",".png"):
  typ="image/webp" if path.suffix==".webp" else "image/png";img["src"]="data:"+typ+";base64,"+base64.b64encode(path.read_bytes()).decode()
HTML=str(bs)
URL='about:blank'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (320,375,768,1280):
  page=browser.new_page(viewport={'width':width,'height':850},accept_downloads=True)
  errors=[];page.on('pageerror',lambda err: errors.append(str(err)))
  page.on('dialog',lambda dialog:dialog.accept())
  page.evaluate("""(() => {const data={};const store={getItem:k=>Object.prototype.hasOwnProperty.call(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]},clear:()=>{for(const k of Object.keys(data))delete data[k]},key:i=>Object.keys(data)[i]||null,get length(){return Object.keys(data).length}};Object.defineProperty(window,'localStorage',{configurable:true,value:store});Object.defineProperty(window,'sessionStorage',{configurable:true,value:store});})();""")
  page.set_content(HTML,wait_until='load',timeout=35000)
  page.wait_for_timeout(350)
  print('width',width,'errors',errors[:3],'title',page.title(),'nav',page.locator('.navrow button').count(),'view',page.locator('#view h2').first.text_content() if page.locator('#view h2').count() else None,'scroll',page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth'))
  assert page.locator('.navrow button').count()==5
  if errors:sys.exit(2)
  if width==375:
   page.screenshot(path='/mnt/data/JO-FIT-5-Intake-mobiel.png',full_page=True)
   print('step0',page.locator('#joIntakeForm').count())
   for step in range(4):
    page.locator('#joNext').click();page.wait_for_timeout(120)
    print('at',step+1, page.locator('.jo-wizard h3').first.text_content())
   print('Review',page.locator('.jo-day-preview').count(), 'warnings',page.locator('.jo-caution').count())
   page.locator('#joNext').click();page.wait_for_timeout(350)
   print('post-intake',page.locator('#view h2').first.text_content(),'routine',page.locator('#routineSelect option').count())
   page.locator('[data-main="today"]').click();page.wait_for_timeout(200)
   page.screenshot(path='/mnt/data/JO-FIT-5-Vandaag-mobiel.png',full_page=True)
   print('today',page.locator('.jo-dashboard-head h2').first.text_content(),'hero',page.locator('#formaHeroEyebrow').text_content())
   page.locator('[data-main="nutrition"]').click();page.wait_for_timeout(200)
   print('nutrition',page.locator('#view h2').first.text_content())
   page.locator('summary:text("Eigen product")').click();page.locator('#joFoodNew [name=name]').fill('Mijn havermout');page.locator('#joFoodNew [name=kcal]').fill('380');page.locator('#joFoodNew [name=protein]').fill('14');page.locator('#joFoodNew [name=carbs]').fill('60');page.locator('#joFoodNew [name=fat]').fill('7');page.locator('#joFoodNew button[type=submit]').click();page.wait_for_timeout(100)
   page.locator('#joFoodChoice').select_option(label='Mijn havermout');page.locator('#joFoodAmount').fill('50');page.locator('#joFoodLog button[type=submit]').click();page.wait_for_timeout(250)
   print('nutrition logged',page.locator('.jo-food-result').all_text_contents()[:3]);assert '190' in page.locator('.jo-macro-grid').all_text_contents()[0]
   page.locator('[data-main="progress"]').click();page.wait_for_timeout(200);print('progress',page.locator('#view h2').first.text_content(),'stats',page.locator('.jo-progress-more').count())
   page.locator('[data-main="more"]').click();page.wait_for_timeout(100);page.locator('[data-more="account"]').click();print('account',page.locator('#view').text_content()[:250]);
   page.screenshot(path='/mnt/data/JO-FIT-5-Account-mobiel.png',full_page=True)
  page.close()
 browser.close()
