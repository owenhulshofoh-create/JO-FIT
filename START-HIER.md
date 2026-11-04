# JO FIT 5.2 - START HIER

**JO FIT - Jouw fitness app. Naar een idee van Owen en Jonathan.**

Dit is een **compleet project**, dus niet een los script dat je zelf aan een HTML-bestand moet koppelen. De wijzigingen staan al in `index.html` en de meegeleverde bestanden. De live website is **niet** door ChatGPT gewijzigd.

## Eerst: back-up van je persoonlijke gegevens

De website bewaart je persoonlijke schema, trainingsgeschiedenis en eigen instellingen in je browser. **Een GitHub-repository bevat jouw lokaal ingevoerde trainingsgegevens niet.** Open daarom op je gebruikelijke apparaat de bestaande JO FIT-website, kies **Meer > Back-up downloaden** en bewaar de export op een veilige plek. Doe dit voor ieder profiel afzonderlijk. Bewaar ook een kopie van je huidige GitHub-repository via **Code > Download ZIP**.

Bij een normale update op hetzelfde websiteadres blijven de bestaande gegevens in principe bestaan. Nieuwe apparaten, wissen van browserdata, incognitomodus, verkeerd ingestelde cloudsync of een gewijzigd domein kunnen dat veranderen. Test daarom voorzichtig; verwijder de oude app of browserdata niet.

## Publiceren: gebruik GitHub Desktop op Windows of Mac

1. Open https://desktop.github.com/ en log in op je GitHub-account.
2. Kies **File > Clone repository** en selecteer je bestaande repository `owenhulshofoh-create/JO-FIT`. Maak **geen** nieuwe repository aan.
3. Pak het ZIP-bestand **JO-FIT-5.3-Oefenfotos-GitHub.zip** uit op je computer.
4. Kies in GitHub Desktop **Repository > Show in Explorer / Finder**. Open die repositorymap.
5. Kopieer **de inhoud** van de uitgepakte ZIP naar deze repositorymap. Bij bestanden met dezelfde naam kies je vervangen. Zorg dat `index.html`, `jofit-health.js`, `jofit-tech.js`, `jofit-workout-core.js` en `sw.js` direct in de hoofdmap staan en dat `assets` en `icons` hun mapstructuur behouden. Verwijder de verborgen `.git`-map **niet**.
6. GitHub Desktop toont de wijzigingen. Controleer ze en maak een commit, bijvoorbeeld **JO FIT 5.2 – schema en leefstijl**.
7. Klik op **Push origin**. GitHub Pages publiceert daarna automatisch op hetzelfde adres: https://owenhulshofoh-create.github.io/JO-FIT/ . Je hoeft Pages niet opnieuw te activeren.
8. Sluit de geïnstalleerde JO FIT-app of browser volledig en open de site opnieuw. Bij cacheproblemen herlaad de website. De PWA-cacheversie is aangepast.

**Let op:** het oude bestand `vision.js` is uit dit pakket verwijderd omdat Vision niet meer in de interface zit. Laat het desnoods in je repository staan als je de eerste keer alleen bestanden overschrijft; het wordt dan niet meer gebruikt. Voor een echte opruiming kun je het later via GitHub Desktop verwijderen, na het bewaren van je back-up. De overige bronbestanden mag je niet zomaar verwijderen.

## Wat is veranderd?

- `Mijn schema`: een verwijderknop direct onder elke oefening, een bevestigingsvraag, tijdelijk **Ongedaan maken** en omhoog/omlaag verplaatsen; historische trainingen worden niet gewijzigd.
- Powersets per trainingsdag: oefening A, oefening B, daarna instelbare rust (standaard 120 seconden). De basisroutine kan worden voorzien van A/B-indeling zonder je oefeningvolgorde te wijzigen. Je kunt ook gewone sets kiezen.
- Adviezen bij gewichtsverhoging: +2,5 kg voor vrije gewichten en +5 kg voor apparaten/kabels. Het zijn suggesties, geen verplichte afronding van eerder vastgelegde kilo's; lichaamsgewicht heeft geen automatische extra-kilo's.
- `Voortgang`: compacte historie. Open een training om de bijbehorende oefeningen te bekijken.
- `Oefeningen`: waar aanwezig een illustratieve AI-foto, bij andere oefeningen duidelijke houdingsinstructies in plaats van onjuiste poppetjes. Begin-/bewegings-/eindpositie en foutpreventie voor een reeks veelgebruikte oefeningen; de anatomische atlas blijft bewaard.
- `Meer > Alcohol, drugs & sport`: begrijpelijke informatie over alcohol, cannabis, stimulerende en verdovende middelen en anabole steroïden, met een nuchtere uitleg over spieropbouw, vetverlies en risico's.
- Vision is uit de zichtbare app en het pakket gehaald; er wordt geen automatische videoanalyse geclaimd.

## Controleren na uploaden

1. Controleer of je bestaande trainingsdagen, oefeningen, gewichten en oude opgeslagen trainingen nog aanwezig zijn.
2. Open **Trainen > Mijn schema**. Controleer de A/B-paren en de rusttijd. Verwijder één oefening, druk op **Ongedaan maken** en controleer dat je trainingshistorie gelijk blijft.
3. Vink set A af: de rusttimer mag niet beginnen. Vink daarna set B af: de rusttimer begint.
4. Ga naar **Voortgang** en open een opgeslagen training om de details te bekijken.
5. Ga naar **Meer > Alcohol, drugs & sport**.
6. Open een oefening, controleer vijf duidelijke techniekstappen en open desgewenst de spieratlas.
7. Download een nieuwe back-up.

## Grenzen en opslag

Deze versie bevat **geen echte AI-gestuurde camerabeoordeling** en **geen nieuwe AI-animaties**. De door de gebruiker aangeleverde oefenfoto's worden getoond bij 23 passende oefening-ID's; overige oefeningen behouden hun bestaande beeld of tekstuitleg. Het zijn illustraties, geen deskundig gevalideerde demonstraties. De gegeven techniekposities zijn algemene startpunten en kunnen per lichaam en apparaat verschillen. De kennisbank is algemene voorlichting, geen medisch advies.

Een online account/cloudsynchronisatie en een echte AI-chat werken pas na aparte veilige Supabase/serverconfiguratie en live tests; die configuratie wordt niet door dit pakket geactiveerd. Er zijn geen geheime API-sleutels toegevoegd. Er is niets gekocht of zelfstandig gepubliceerd.

Zie ook `TESTRESULTATEN.md`, `WIJZIGINGEN.md`, `PRIVACY-EN-OPSLAG.md` en `STATUS-EN-VERVOLG.md`.

## Extra foto-update (JO FIT 5.3)

In deze versie zijn de door jou aangeleverde oefenfotos direct gekoppeld aan de juiste oefening-ID. Kopieer het volledige pakket met dezelfde GitHub Desktop-methode als hierboven. Neem `jofit-exercise-images.js` en de volledige map `assets/exercises` mee. Geen bestaand schema, gewicht of logboek is aangepast. Zie `OEFENFOTOS-OVERZICHT.md` voor de controlelijst.
