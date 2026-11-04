"""Verify current packaged JO FIT 5.2 zip; invocation: python tests/verify_package.py [path-to-zip]."""
from pathlib import Path
import sys,zipfile
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
zip_path=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'JO-FIT-5.2-Powersets-en-Leefstijl-GitHub.zip'
with zipfile.ZipFile(zip_path) as z:
 assert z.testzip() is None
 names=set(z.namelist());assert {'index.html','START-HIER.md','jofit-tech.js','jofit-health.js','jofit-workout-core.js','sw.js'}<=names
 soup=BeautifulSoup(z.read('index.html'),'html.parser')
 required=[sc['src'].removeprefix('./') for sc in soup.find_all('script',src=True)]
 required += [li['href'].removeprefix('./') for li in soup.find_all('link',href=True) if li['href'].endswith('.css')]
 assert all(x in names for x in required),[x for x in required if x not in names]
 assert len(soup.select('.navrow button[data-main]'))==4
 assert 'vision.js' not in names
 assert '<title>JO FIT' in z.read('index.html').decode()
 assert 'jofit-health.js' in z.read('sw.js').decode()
 print(f'ZIP OK, files={len(names)}, all JavaScript and CSS imports present, four navigation items, Vision not shipped')
