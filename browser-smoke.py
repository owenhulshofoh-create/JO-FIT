"""JO FIT integration test in an isolated browser. No network requests or real footage."""
import asyncio
import http.server
import threading
from pathlib import Path
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking'])
        page = await browser.new_page(viewport={'width': 1100, 'height': 850})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        markup=(HERE/'test-fixture.html').read_text()
        modules=['config.js','data.js','coach-engine.js','ui.js','backup-cloud.js','motion-core.js','vision-ai.js','coach-ui.js']
        scripts=''.join('<script>'+ (HERE.parent/'upgrade'/name).read_text().replace('</script>', r'<\/script>')+'</script>' for name in modules)
        scripts += """<script>window.JOFIT_UI.setup();window.JOFIT_COACH.init();window.JOFIT_BACKUP.init();window.JOFIT_UPGRADE_READY=true;new MutationObserver(()=>{if(window.JOFIT_DATA.tab()==='vision')window.JOFIT_VISION.render()}).observe(document.getElementById('view'),{childList:true});</script>"""
        markup=markup.replace('<script defer src="../upgrade/boot.js"></script>',scripts)
        storage = """<script>(function(){const map=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{get length(){return map.size},key:i=>Array.from(map.keys())[i]||null,getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(String(k),String(v)),removeItem:k=>map.delete(k),clear:()=>map.clear()}})})();</script>"""
        markup=markup.replace('<head>','<head>'+storage,1)
        markup=markup.replace('</head>','<style>'+ (HERE.parent/'upgrade/upgrade.css').read_text()+'</style></head>')
        await page.set_content(markup,wait_until='domcontentloaded',timeout=15000)
        await page.wait_for_function('window.JOFIT_UPGRADE_READY === true', timeout=15000)
        assert await page.locator('#jofu-schema').count() == 1, 'set registratie ontbreekt'
        await page.locator('[data-tab="coach"]').click()
        await page.wait_for_selector('#jofu-adaptive', timeout=8000)
        assert await page.locator('#jofu-coach').count() == 1, 'vorige coach ontbreekt'
        assert await page.locator('#jofu-adaptive').count() == 1, 'nieuwe coach ontbreekt'
        await page.locator('#jofu-wishes [name="goal"]').select_option('strength')
        await page.locator('#jofu-wishes button[type="submit"]').click()
        await page.wait_for_selector('#jofu-wishes [name="goal"]')
        assert await page.locator('#jofu-wishes [name="goal"]').input_value() == 'strength'
        await page.locator('#jofu-checkin [name="energy"]').select_option('2')
        await page.locator('#jofu-checkin button[type="submit"]').click()
        assert await page.locator('#jofu-adaptive').count() == 1
        await page.wait_for_function("document.getElementById('jofu-adaptive')?.innerText.includes('lagere belastbaarheid')", timeout=5000)
        await page.screenshot(path=str(HERE / 'coach-browser-preview.png'), full_page=True)
        await page.locator('[data-tab="vision"]').click()
        await page.wait_for_selector('#jofu-vision',timeout=8000)
        assert await page.locator('#jofu-vision a[href="./tools/VIDEO-TESTLAB.html"]').count()==1
        await page.locator('[data-tab="schema"]').click()
        await page.wait_for_selector('#jofu-schema')
        await page.locator('#jofu-set-reps').fill('10')
        await page.locator('#jofu-set-kg').fill('44')
        await page.locator('#jofu-set-rir').select_option('2')
        await page.locator('#jofu-set-save').click()
        assert (await page.evaluate('window.JOFIT_DATA.get().sets.length')) >= 1, 'set niet opgeslagen'
        assert not errors, 'Browser JavaScript errors: ' + '; '.join(errors)
        await browser.close()

        print('OK: browser smoke — schema + coach + opslag + herstelcheck + Vision link')

asyncio.run(main())
