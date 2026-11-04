"""Browser smoke test for packaged exercise photos; no live accounts or phone."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import base64,json
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'index.html').read_text(encoding='utf-8'),'html.parser')
for sc in soup.find_all('script',src=True):
 name=sc['src'].removeprefix('./');content=(root/name).read_text(encoding='utf-8')
 if name=='jofit-exercise-images.js':
  mapping=json.loads((root/'jofit-exercise-images.json').read_text(encoding='utf-8'))
  for d in mapping.values():
   keys=['src']
   for k in keys:
    f=root/d[k].removeprefix('./');d[k]='data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
   if 'alternates' in d:
    d['alternates']=['data:image/webp;base64,'+base64.b64encode((root/v.removeprefix('./')).read_bytes()).decode('ascii') for v in d['alternates']]
  content='window.JO_EXERCISE_IMAGES='+json.dumps(mapping)+';'
 sc.string=content;del sc['src']
for link in soup.find_all('link',href=True):
 if link['href'].endswith('.css'):
  style=soup.new_tag('style');style.string=(root/link['href'].removeprefix('./')).read_text();link.replace_with(style)
for img in soup.find_all('img',src=True):
 f=root/img['src'].removeprefix('./')
 if f.is_file() and f.suffix in ('.webp','.png'):
  img['src']='data:image/'+('webp' if f.suffix=='.webp' else 'png')+';base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
HTML=str(soup)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for width in (375,768,1280):
   page=browser.new_page(viewport={'width':width,'height':850})
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.evaluate("""(() => {const data={};const store={getItem:k=>Object.prototype.hasOwnProperty.call(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]},clear:()=>{for(const k of Object.keys(data))delete data[k]},key:i=>Object.keys(data)[i]||null,get length(){return Object.keys(data).length}};Object.defineProperty(window,'localStorage',{configurable:true,value:store});Object.defineProperty(window,'sessionStorage',{configurable:true,value:store});})();""")
   page.set_content(HTML,wait_until='load',timeout=40000)
   page.evaluate("switchTab('library')")
   page.wait_for_selector('[data-lib="bench-press"] img',timeout=15000)
   cases=['bench-press','face-pull','standing-curl','machine-shoulder-press','chest-supported-reverse-fly','lying-leg-raise']
   for ex_id in cases:
    image=page.locator(f'[data-lib="{ex_id}"] img')
    assert image.count()==1,(width,ex_id)
    # On-demand loading: scroll to image, wait for actual decoded pixels.
    image.scroll_into_view_if_needed()
    image.evaluate('(i)=>i.decode()')
    assert image.evaluate('(i)=>i.naturalWidth')>0,(width,ex_id)
   assert page.evaluate('Object.keys(EX).length')==64
   assert not errors,errors
   page.locator('[data-lib="lying-leg-raise"]').click()
   page.locator('.jo-photo-caution').wait_for()
   assert 'losse dumbbell' in page.locator('.jo-photo-caution').text_content()
   page.locator('.jo-tech-image img').evaluate('(i)=>i.decode()')
   page.locator('.modal-close').click()
   page.locator('[data-lib="squat"]').click()
   assert page.locator('.jo-photo-alt img').count()==1
   page.locator('.jo-photo-alt summary').click()
   page.locator('.jo-photo-alt img').evaluate('(i)=>i.decode()')
   page.locator('.modal-close').click()
   page.locator('#formaPhotoManage').click()
   page.locator('#formaPhotoExercise').select_option('machine-shoulder-press')
   assert 'Standaard oefenfoto inbegrepen' in page.locator('#formaPhotoSource').text_content()
   page.locator('#formaPhotoClose').click()
   assert not errors,errors
   if width==375:
    page.locator('[data-lib="incline-press"]').scroll_into_view_if_needed()
    page.screenshot(path='/mnt/data/JO-FIT-5.3-Oefenfotos-voorbeeld.png')
   print('browser PASS',width,'exercise cards, detail, alternate, warning, photo editor')
   page.close()
  browser.close()
finally:
 pass
