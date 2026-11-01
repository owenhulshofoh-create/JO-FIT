from pathlib import Path
import zipfile,re,json,subprocess
from bs4 import BeautifulSoup
zip_path=Path(__file__).resolve().parents[2]/'JO-FIT-5.0-Fase1-GitHub.zip'
root=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(zip_path) as z:
 assert z.testzip() is None
 names=set(z.namelist());assert 'index.html' in names and 'START-HIER.md' in names
 soup=BeautifulSoup(z.read('index.html'),'html.parser')
 required=[script.get('src').removeprefix('./') for script in soup.find_all('script') if script.get('src')]
 required += [link.get('href').removeprefix('./') for link in soup.find_all('link') if link.get('href') and link.get('href').endswith('.css')]
 assert all(p in names for p in required),[p for p in required if p not in names]
 assert len(soup.select('.navrow button[data-main]'))==5
 assert '<title>JO FIT' in z.read('index.html').decode()
 assert z.read('jofit-config.js').decode().count('supabaseUrl: \'\'')==1
 assert '.github/workflows/jofit-tests.yml' in names
 print('ZIP:',zip_path,'files',len(names),'all imports available: YES','zip integrity: OK')
 print('Submenu',[(b['data-main'],b.text.strip())for b in soup.select('.navrow button[data-main]')]);print('File list:\n'+'\n'.join(sorted(names)))
