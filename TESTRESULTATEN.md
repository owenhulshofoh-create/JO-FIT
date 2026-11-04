# JO FIT 5.3 - Tests en grenzen

## Gedaan
- JavaScript-syntax van inline appcode en nieuwe losse modules: `node --check`.
- 15 automatische Node-tests voor trainingsplanregels, voeding, historie, gewichtsstappen, powerset-rust, techniekcues en de structuur van de informatiepagina: geslaagd.
- Gesimuleerde gebruikersinteracties in headless Chromium op 320, 375, 768 en 1280 pixels: geen JavaScript-pageerrors of horizontale overflow.
- Browser: originele schemalijst onthouden, een oefening verwijderen, oude sessie behouden, verwijdering ongedaan maken en dezelfde schemalijst terugkrijgen: geslaagd.
- Browser: na oefening A geen rust, na oefening B wél rust: geslaagd.
- Browser: uitklapbaar logboek, techniekkaart met vijf stappen, anatomische atlas en leefstijlpagina geopend: geslaagd.
- Browser gebruikt een afgeschermde lokale kopie van de website; dit is géén echte live-netwerk- of cloudtest.

## Niet getest / nog beperkt
- Geen echte mobiele hardware, camera of iOS Safari-test; screenshots zijn browserweergaven.
- Geen live GitHub Pages-, Supabase- of AI-provider-integratietests.
- Geen deskundige biomechanische beeldvalidatie van elk van de 64 oefeningen. De bestaande AI-foto's zijn illustratief, geen 3D-demonstratie.
- Niet alle eerdere plannings-, account- of cloudfuncties zijn in deze fase integraal opnieuw gevalideerd.
- Lokale browsertests simuleren bestandsbehoud en opslaggedrag, maar bieden geen garantie bij een verkeerd ingestelde cloudaccount of het wissen van browsergegevens.

## Zelf uitvoeren na publicatie
Volg de controles in `START-HIER.md`. Maak eerst een persoonlijke back-up. Controleer op je eigen telefoon het openen van de schema's, het bewaren van logs en de knop voor het verwijderen van oefeningen.

## Foto-update 5.3
- 18 Node-tests geslaagd, inclusief kaartbestanden, materiaalrestricties en de koppeling van unieke oefening-ID's.
- `node --check` geslaagd voor alle gewijzigde JavaScript-bronnen en inline appscript.
- In headless Chromium op 375, 768 en 1280 pixels gecontroleerd: zes representatieve afbeeldingskaarten laden, extra variant-ID's, de detailfoto, waarschuwing bij liggende leg raise, de tweede squatfoto en de foto-editor.
- Beeldvalidatie blijft visueel/handmatig; de bewegingskwaliteit is niet door een trainer of fysiotherapeut beoordeeld. Foto's zijn statisch en geen gecontroleerde animaties.
- Lokale netwerkpoort was in deze testomgeving geblokkeerd. Daarom is de site voor de browsertest lokaal ingebed met dezelfde bronbestanden en ingesloten beelddata; er is geen live GitHub Pages-test gedaan.
