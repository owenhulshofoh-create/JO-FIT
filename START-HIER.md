# JO FIT 4.2 — Github upgradepakket (adaptieve AI-coach + videotestlab)

Deze ZIP is een **uitbreiding van jouw bestaande JO FIT 4.0-app**: https://github.com/owenhulshofoh-create/JO-FIT. De bestaande app, schema's, animaties, intake en persoonlijke profielen blijven behouden. De indeling blijft logisch: **geen nieuwe hoofdtabs**.

## Installatie vanuit GitHub

1. Download het huidige `index.html` uit jouw GitHub-repository. Als de app al echte gegevens bevat, maak eerst een back-up. Heb je nog geen trainingsgegevens, dan kun je deze stap voor de data overslaan.
2. Pak de ZIP uit. Upload de hele map **`upgrade/`** naar de hoofdmap van jouw JO-FIT-repository. Upload de bestanden uit **`assets/`** naar de bestaande map `assets/`. Laat alle andere oorspronkelijke bestanden staan.
3. Upload de vernieuwde **`teksten.js`** en **`sw.js`** naar de hoofdmap (vervang de oude versies).
4. Open **`tools/INSTALLER.html`** op je telefoon/computer. Kies de **oude `index.html`** die je uit GitHub hebt gedownload. De installer maakt een nieuwe `index.html` waarin één regel is toegevoegd. Upload die nieuwe `index.html` weer naar de hoofdmap van GitHub.
5. Klik op **Commit changes**. Open jouw GitHub Pages-site, vernieuw één keer, en controleer ‘Mijn schema’ en ‘Logboek’.

**Belangrijk:** Upload niet alleen het ZIP-bestand in GitHub; pak het uit en behoud de mapstructuur. Je hoeft de broncode van de bestaande `index.html` niet te verwijderen. Op mobiel kan het uploaden van hele mappen lastig zijn; gebruik dan bij voorkeur de desktopwebsite of een computer.

### Handmatige installatie (één regel)

Je kunt de installer overslaan. Voeg direct vóór `</body>` in je huidige `index.html` deze regel toe:

```html
<script defer src="./upgrade/boot.js"></script>
```

De Python-variant vind je in `tools/patch-index.py`.

## Verbeteringen logisch onder bestaande koppen

| Bestaand menu | Toegevoegd | Broncode |
|---|---|---|
| **Mijn schema** | Set voor set registreren, herhalingen, gewicht, RIR, rusttimer | `upgrade/ui.js` |
| **Logboek** | Gewichtsrecords, herhalingsrecords, geschat 1RM, exact dagvolume, 4/8/12-wekengrafieken | `upgrade/data.js`, `upgrade/ui.js` |
| **Coach** | Persoonlijke doelen, herstelcheck, voorzichtige aanpassingsvoorstellen en een spiergroepoverzicht | `upgrade/data.js`, `upgrade/ui.js` |
| **Vrienden** | JO FIT Duo: powersets A+B, automatisch wisselen, aparte sets en timers per persoon | `upgrade/ui.js` |
| **Oefenbibliotheek** | Favorieten en alternatieven uit de bestaande oefeningendatabase | `upgrade/ui.js` |
| **Vision** | Lokale, experimentele videohoek- en herhalingsschatting met meetkwaliteitscheck en testlab | `upgrade/vision-ai.js` |
| **Back-up** | Volledige export/import met dubbele bevestiging en optionele cloud | `upgrade/backup-cloud.js` |
| **Opmaak/teksten** | Nieuw uiterlijk, banners en teksten zonder de originele navigatie te vervangen | `teksten.js`, `upgrade/upgrade.css`, `assets/` |

## Tekstwijzigingen die je hebt gevraagd

- Startscherm: **‘Jouw fitness app’** (waarbij ‘app’ de accentkleur krijgt).
- Daaronder: **‘Naar een idee van Owen en Jonathan’**.
- De oude slogan **‘Train doelgericht. Zie wat je bereikt.’** is vervangen.
- Nieuwe compacte koppen en beschrijvingen passen bij de uitbreidingen.
- De oude naam ‘Forma’ wordt waar mogelijk in zichtbare interface-teksten vervangen door ‘JO FIT’.
- Persoonlijke teksten die je eerder via de teksteditor hebt opgeslagen **blijven bewust behouden** en gaan voor op de nieuwe publieke standaardteksten. Kies eventueel **Teksten → Herstel tekst** om de nieuwe standaard zichtbaar te maken.

## Afbeeldingen en design

De grote hero bevat een originele, voor JO FIT gemaakte gymillustratie (`assets/jofit-hero.webp`). Daarnaast zijn nieuwe SVG-illustraties toegevoegd aan **Logboek, Coach, Vrienden en Vision**. De kleuren sluiten aan op het bestaande donkere thema met warme roze/rode accenten. De originele 44 oefeningen, oefenfoto's en 3D-animaties worden niet vervangen.

## Wat direct werkt en wat een eigen configuratie nodig heeft

**Direct na installatie:** persoonlijke, adaptieve Coach met doelen en herstelcheck; videogewrichtsmetingen met kwaliteitscontrole; setregistratie, records, grafieken, spiergroepanalyse, Smart Coach-adviezen, Duo, favorieten, volledige back-ups, tekst- en designaanpassingen.

**Cloud:** is optioneel. Je hebt een eigen Supabase-project en de instellingen in `upgrade/config.js` nodig. De app gebruikt de bestaande beveiligde tabel `forma_user_data`. Cloud synchroniseert bewust **handmatig** om conflicten niet onopgemerkt te overschrijven. Zie `CLOUD-INSTALLEREN.md`.

**Vision AI:** vereist een klik van de gebruiker, een gekozen video en internet om de externe poseherkenningssoftware te laden. De videobeelden blijven op jouw apparaat. De schattingen zijn experimenteel: **geen gevalideerde techniek- of veiligheidsbeoordeling** en niet voor alle oefeningen beschikbaar.

**Oefeningendatabase:** krijgt favorieten en alternatieven, maar niet zomaar 100+ nieuwe automatisch ingetekende animaties. Voor extra kwalitatief goede oefeningen moeten techniek, afbeeldingen en varianten eerst afzonderlijk worden gecontroleerd.

## Technisch en privacy

- Oude profieldata: `forma_v2_profiles` blijft het bestaande opslagformaat.
- Nieuwe exacte setdata worden per persoon bewaard onder `jofit_upgrade_v1_<profiel-id>`.
- Nieuwe statistieken proberen dubbeltellingen met het oorspronkelijke samengevatte logboek te voorkomen.
- Volledige back-ups nemen de eigen profielen, intake, teksten en Vision-notities mee; niet videobestanden of cloudwachtwoorden.
- Alle normale gegevens blijven in de browser totdat je zelf de cloud activeert.
- De app heeft geen npm-build nodig. Een interne syntaxcheck voor de JavaScriptbestanden is uitgevoerd. Cloud en echte Vision-videometingen moet je met je eigen instellingen testen.

## Problemen oplossen

**Nieuwe functies ontbreken:** controleer of `index.html` de scriptregel bevat en `upgrade/boot.js` op exact die locatie staat. Vernieuw je site; de nieuwe `sw.js` gebruikt een nieuwe cacheversie.

**Oude slogan nog zichtbaar:** je hebt waarschijnlijk eigen eerder opgeslagen browsertekst. Gebruik `Teksten → Herstel tekst` om de nieuwe standaard te zien.

**Cloudmelding:** cloud is niet verplicht. De rest blijft lokaal bruikbaar.

**Geen Vision-analyse:** alleen geselecteerde oefeningen en video's worden voorlopig ondersteund; probeer opnieuw met internet. De bestaande handmatige techniekcheck blijft beschikbaar.


## Nieuw in 4.2: Coach en Vision-testlab

- Onder de **bestaande kop Coach** staat nu **JO FIT Adaptieve Coach**: doelstellingen, tijd, trainingsdagen, materiaal, niet-gewenste oefeningen, dagelijkse herstelcheck en bijsturing bij aantoonbare vooruitgang. Werkt lokaal vanaf de eerste training. Alle wijzigingen vereisen jouw bevestiging.
- Onder **Vision** staat een link naar `tools/VIDEO-TESTLAB.html`: kies een echte korte video van squat/lunge/curl en tel zelf de herhalingen. Er worden alleen statistieken van het resultaat opgeslagen; geen videobestanden of ruwe frames. Bij lage betrouwbaarheid wordt geen rep-getal getoond.
- **Optionele echte AI-chat:** zie `AI-COACH-INSTALLEREN.md`. Hiervoor zijn een Supabase-project, een ingelogde gebruiker en een OpenAI API-sleutel als **serversecret** nodig. Zonder dit is de adaptieve coach beschikbaar, maar niet de generatieve chat.
- In `tests/` staan automatische unit tests voor de coach en de rep-estimator. Dit vervangt geen praktijktesten met echte video's.
- Als je een oudere 4.1 ZIP al hebt geupload, vervang `upgrade/`, `sw.js` en `assets/`; zet de nieuw toegevoegde `tools/VIDEO-TESTLAB.html` erbij. De bestaande bootregel in `index.html` blijft hetzelfde.

## Praktische controle

De unit tests en de browser-simulatie (zonder echte video) zijn geslaagd. Echte videoherkenning en de AI-cloudkoppeling vereisen een eigen praktijktest. Zie `VIDEO-TESTPLAN.md` en `AI-COACH-INSTALLEREN.md`. De nieuwe coach past niets zelfstandig toe zonder bevestiging.
