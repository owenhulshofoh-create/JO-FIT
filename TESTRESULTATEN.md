# JO FIT 5 — uitgevoerde tests

Uitgevoerd in de beschikbaar gestelde container op **1 november 2026**. De tests zijn reproduceerbaar via `node --test tests/rules-and-nutrition.test.cjs` en, met Python + Chromium Playwright, `python tests/browser_smoke.py` / `python tests/browser_extended.py`.

## Tests die echt zijn uitgevoerd

| Onderdeel | Methode | Resultaat |
|---|---|---|
| 59 catalogus-ID's en materiaalvereisten | 10 Node.js-unitcases, waaronder geen bankdrukken zonder rack en geen cable-pulldown zonder juiste onderdelen | Geslaagd |
| Bodyweight-only training en afwezigheid van onmogelijk materiaal | Node.js-regeltest | Geslaagd |
| Voorkeursdagen, vermijden van oefeningen, geen startgewichten verzinnen | Node.js-regeltest | Geslaagd |
| Calorieën per gram, stuk en milliliter (ook ontbrekende dichtheid of macro's) | Node.js-unitcases | Geslaagd |
| PR-berekening met exacte versus onzekere herhalingswaarden en verwijderen | Node.js-unitcase | Geslaagd |
| Intakestappen, hervatten en nieuw schema naast oud schema | Headless Chromium / Playwright met gesimuleerde browseropslag | Geslaagd |
| Duo: 2 gebruikers, beurtwisseling, individuele gewichten en eigen logboeken | Headless Chromium / Playwright met 2 lokale testprofielen | Geslaagd na reparatie beurtwisselfout |
| Nieuwe niet-gevalideerde oefening toont geen misleidende animatie | Headless Chromium / Playwright | Geslaagd |
| Back-upexport van profiel + intake + Vision-notities | Headless Chromium / Playwright met download | Geslaagd |
| Startscherm, voeding, logboek en accountstatus op 320/375/768/1280 pixels | Headless Chromium / Playwright | Geslaagd, 0 JavaScript-pageerrors en geen horizontale overloop in geteste scenario's |
| Volledig ZIP-pakket en syntax van JS-bestanden | `zipfile.testzip()`, `node --check` en bestandscontrole | Te verifiëren bij eindpakket (zie console-uitvoer testscript) |

## Hoe browsertests zijn uitgevoerd

Chromium is gestart zonder echte toegang tot de externe URL. De HTML en lokale JS/CSS zijn in een headless browser geladen, met een **gesimuleerde `localStorage`-interface**. De screenshots komen uit deze browser; afbeeldingen kunnen in de test als data-URL zijn opgenomen. Dit is nuttig voor UI- en logische regressies, maar is **geen echte GitHub Pages-/HTTPS-/serviceworker-/Supabase-integratietest**.

## Nog NIET getest

- Accountaanmelding, RLS-afscherming met echte Supabase-gebruikers, verificatiemails, herstel, verwijdering en conflictgedrag op twee echte telefoons. SQL en Edge Functions zijn voorbereide code, geen gevalideerde cloudproductie.
- Een AI-oproep met echte externe API-sleutel, budgetlimieten bij serverstoringen of een echte Open Food Facts-productzoekopdracht.
- De huidige Vision-opname met echte video's, correcte telling, posepunten of techniekinterpretatie; die geautomatiseerde analyse is niet aanwezig.
- Echte Android-/iOS-apparaten, Safari op iPhone, Firefox, PWA-offline na installatie en serviceworker-update via live HTTPS.
- Sporttechnische review van alle 59 oefeningen; rechtenonderzoek bij externe media-aanbieders.
- Pentest, AVG/GDPR-audit, grootschalig gelijktijdig gebruik en herstel na apparaatverlies.

De app mag niet als volledig getest of productieklaar worden gepresenteerd voordat deze punten zijn behandeld.
