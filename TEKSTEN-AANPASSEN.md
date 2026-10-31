# Forma 3.0 – teksten aanpassen

## In de app (zonder code)
1. Open Forma en klik op **✎ Teksten** bovenin.
2. Pas de koppen, introducties, pagina-bannerteksten en eventueel oefeningsteksten aan.
3. Klik **Bewaar teksten**. Deze wijzigingen worden in deze browser bewaard. Dit verandert je trainingsgegevens niet.
4. Wil je die aanpassingen voor iedereen zichtbaar maken? Open de editor en klik **Download teksten.js**.
5. Upload het gedownloade `teksten.js` naar de **hoofdmap** van je GitHub Pages-repository, waarbij je het eerdere bestand vervangt. Publicatie gaat na de GitHub Pages-build live.

## Direct een bestand bewerken (handig voor GitHub)
Open `teksten.js` in een teksteditor of in GitHub via het potloodicoon.
- `hero`: teksten op het startscherm
- `sections`: teksten en afbeelding per pagina; zet `enabled` op `false` om een banner te verbergen
- `exercises`: aangepaste oefeningsteksten (via de ingebouwde editor aan te maken)

**Let op:** `window.FORMA_TEXTEN` en de dubbele aanhalingstekens moeten blijven staan. In de app kun je fouten in JavaScript vermijden door de ingebouwde editor te gebruiken.

## Publiceren op GitHub Pages
1. Pak de ZIP uit.
2. Upload de **inhoud** van de ZIP naar de hoofdmap van je repository. `index.html`, `teksten.js`, `sw.js` en de map `assets` moeten daar samen staan.
3. Activeer **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Na het publiceren kun je dezelfde website op beide telefoons openen.

Ieder gebruikt zijn eigen lokaal opgeslagen schema en logboek. Je kunt bestaande lokale gegevens het veiligst bewaren via **Back-up** vóór je een andere browserversie gebruikt. Echte cloudaccounts zijn niet automatisch geactiveerd; daarvoor moet je Supabase apart instellen.

De meegeleverde fitnessillustraties zijn met generatieve AI gemaakt, zonder gebruik van een ingekochte stockafbeeldingsbibliotheek. Illustratieve cijfers of dashboards in deze afbeeldingen zijn decoratief en niet afkomstig uit je persoonlijk logboek. Licentie- en gebruiksregels kunnen per platform en rechtsgebied verschillen.
