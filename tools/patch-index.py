#!/usr/bin/env python3
"""Use: python tools/patch-index.py old-index.html new-index.html"""
from pathlib import Path
import sys
TAG='<script defer src="./upgrade/boot.js"></script>'

def patch(html):
    if './upgrade/boot.js' in html:return html
    if '</body>' not in html:raise ValueError('Geen afsluitende </body> gevonden.')
    return html.replace('</body>',TAG+'</body>',1)

if __name__=='__main__':
    if len(sys.argv)!=3:sys.exit('Gebruik: python tools/patch-index.py oud-index.html nieuw-index.html')
    source=Path(sys.argv[1]);out=Path(sys.argv[2]);html=source.read_text(encoding='utf-8-sig')
    if 'id="app"' not in html and 'id="view"' not in html:sys.exit('Dit lijkt niet de huidige JO FIT-app.')
    if source.resolve()==out.resolve():sys.exit('Kies een ander uitvoerbestand om het origineel te bewaren.')
    out.write_text(patch(html),encoding='utf-8');print('Nieuw indexbestand aangemaakt:',out)
