# JO FIT Vision — testplan echte sportvideo's

De meegeleverde Vision-functie herkent tijdelijk **alleen squats, lunges en biceps curls**. De bestaande JO FIT-video-opslag en oefeninstructies blijven behouden. MediaPipe schat 2D-gewrichtspunten; het telt onder voorwaarden een bewegingscyclus, maar kan **niet** wetenschappelijk onderbouwen of een techniek veilig is.

## Opnemen

1. Kies een oefening met een volledig zichtbare sporter in zijaanzicht en een stabiele camera op ongeveer heuphoogte. Zorg voor voldoende afstand en een niet-drukke achtergrond.
2. Film 6 tot 10 herhalingen in 10 tot 25 seconden. Laat aan het begin en eind ook een korte rustpositie zien. Film steeds maar één sporter.
3. Neem minstens drie varianten op: duidelijk gefilmd, lastige hoek, en gedeeltelijk uit beeld. Gebruik in de eerste test geen bewuste onveilige bewegingen.
4. Tel zelf de correcte volledige herhalingen. Vul die telling in het **Videotestlab** in; vergelijk de uitkomst.

## Test uitvoeren

- Open `tools/VIDEO-TESTLAB.html` vanuit GitHub Pages of via de link op de bestaande Vision-pagina.
- Kies de oefening, laad een video van je apparaat en vul het handmatig getelde aantal in.
- Klik **Analyseer video**. De browser haalt de MediaPipe-software op; videobeelden worden niet verstuurd.
- Controleer de geschatte telling, dekking van zichtbare gewrichten, het gemeten 2D-hoekbereik en de status. Download desgewenst alleen de samenvatting als JSON.

## Praktische acceptatiecriteria voor een eerste test

Dit zijn voorgestelde *interne testdrempels*, geen bewezen klinische of sportwetenschappelijke normen:

| Controle | Eerste doel |
|---|---|
| Goed belichte videos zonder occlusie | In ten minste 80% van frames bruikbare hoekpunten |
| Rep-telling voor goed gefilmde oefening | Binnen 1 herhaling van menselijke telling |
| Afgedekte gewrichten | Geen overtuigend resultaat presenteren bij lage zichtbaarheid |
| Niet-ondersteunde oefeningen | Geen telling/techniekbeoordeling claimen |
| Android, iPhone, desktop | Bestandsselectie, video afspelen, toestemming en stopknop werken |
| Data en privacy | Geen video upload; alleen optionele, lokale meetrapportage |

Test bij voorkeur minstens **5 echte clips per oefening**, plus 2 probleemclips, en laat de tellingen onafhankelijk controleren. Stop de uitrol van automatische techniekclaims wanneer resultaten onbetrouwbaar zijn. Vergelijk daadwerkelijke techniekbeoordelingen met een gekwalificeerde trainer als je later inhoudelijke techniekfeedback bouwt.

## Automatische tests (geen video nodig)

In de hoofdmap van de ZIP:

```
node tests/test-motion.cjs
node tests/test-coach.cjs
```

Het optionele `tests/browser-smoke.py` heeft Python Playwright met Chromium nodig en test de interface zonder externe API. Dit simuleert geen echte camerabeelden. De serverfunctie is statisch typegecontroleerd; een echte OpenAI/Supabase-aanroep is hier niet uitgevoerd.

## Logboek van de praktijktest

Leg bij iedere clip vast: oefening, camerahoek, telefoon/browser, duur, handmatige telling, automatische telling, zichtbaarheidspercentage, foutstatus, en of de sporter instemt met het testen. Deel nooit persoonsbeelden zonder toestemming.
