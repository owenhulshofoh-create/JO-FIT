# JO FIT 5.0 — START HIER

**JO FIT — jouw fitness app · Naar een idee van Owen en Jonathan**

Deze ZIP is een **compleet bijgewerkt project**, geen los script dat je in `</body>` hoeft te plakken. De mappen en bestanden staan al op de juiste plek. **JO FIT is NIET door ons naar jullie live GitHub-repository gepubliceerd.**

## Wat kun je direct gebruiken?

Na het uploaden werken zonder cloud: de vijf hoofdschermen, de nieuwe intake, materiaalgestuurde schemavoorstellen, je bestaande trainingsregistratie, Duo op één apparaat, voedingsdagboek met zelf ingevulde productwaarden, voortgang en back-ups. De optionele cloudaccount- en AI-functies zijn **niet automatisch actief**.

## Veilig bijwerken — één publicatiemethode (GitHub Desktop, computer)

Omdat de GitHub-webupload op een tablet bestanden en mappen niet altijd goed vervangt, raden we deze methode aan. Doe hem op een Windows-pc of Mac.

1. **Maak eerst twee back-ups.** Open je bestaande JO FIT-app en gebruik **Meer → Download back-up** voor elk persoonlijk profiel. Ga naar je [JO-FIT-repository](https://github.com/owenhulshofoh-create/JO-FIT), klik **Code → Download ZIP** en bewaar deze originele code apart.
2. Installeer [GitHub Desktop](https://desktop.github.com/) en log in met je GitHub-account.
3. Kies in GitHub Desktop **File → Clone repository**. Selecteer `owenhulshofoh-create/JO-FIT` en kloon die op je computer. Dit is dus de **bestaande** repository, geen nieuwe.
4. Pak `JO-FIT-5.0-Fase1-GitHub.zip` uit in een afzonderlijke tijdelijke map.
5. Open in GitHub Desktop via **Repository → Show in Explorer / Finder** de lokale `JO-FIT`-map.
6. Kopieer **de inhoud** van de uitgepakte JO FIT 5.0-map naar deze lokale repositorymap. Kies **bestaande bestanden vervangen**. Let op: kopieer niet alleen de bovenste map; `index.html` moet direct in de repository-hoofdmap staan. Laat de verborgen `.git`-map van de gekloonde repository ongemoeid.
7. Controleer in GitHub Desktop dat onder andere `index.html`, `intake.js`, `jofit-rules.js`, `jofit-shell.js`, `jofit-duo.js`, `jofit-nutrition.js` en `sw.js` als toegevoegd of gewijzigd zichtbaar zijn.
8. Vul links onder bij **Summary** `JO FIT 5.0 – fase 1` in. Klik **Commit to main**, daarna **Push origin**.
9. Je bestaande GitHub Pages-instelling **main / (root)** blijft gelijk. Bezoek na enkele minuten: https://owenhulshofoh-create.github.io/JO-FIT/ .
10. Als je nog een oude versie ziet: sluit de PWA volledig, open de website opnieuw en herlaad. De nieuwe serviceworker gebruikt een andere cacheversie.

**Niet verwijderen:** `.github` (bestaande workflows), `assets`, `icons`, `teksten.js`, `manifest.webmanifest`, de overige `.js`-bestanden. Upload nooit een `.env` of geheime sleutel in de openbare repository.

## Eerste controle op de website

1. Open op je telefoon de website. Er moeten precies **vijf hoofdonderdelen** zijn: Vandaag, Trainen, Voeding, Voortgang en Meer.
2. Een gebruiker zonder intake kan de vijf vragenstappen invullen. Controleer op stap 5 het voorstel. Pas na **Accepteer & bewaar nieuw schema** ontstaat een nieuwe schemaversie.
3. Maak onder Meer een tweede lokaal profiel en test in Trainen → Duo een set met verschillende kilo's. De twee sets moeten in afzonderlijke logboeken terugkomen.
4. Voer bij Voeding een eigen product per 100 gram in en voeg 50 gram toe. Controleer de berekening.
5. Maak in Meer een back-up voordat je persoonlijke gegevens van de oude versie importeert of een ander apparaat gaat gebruiken.

## Wat moet je extra doen voor gratis online accounts?

De website gebruikt standaard **alleen lokale opslag**. De accountmodule is voorbereid met Supabase Auth + serverafscherming, maar kan niet zelfstandig online gaan: er is een Supabase-project nodig dat jullie beheren.

1. Maak in [Supabase](https://supabase.com/dashboard) een project in een gewenste regio. Free is mogelijk zolang je binnen de voorwaarden en quota blijft.
2. Open **SQL Editor** en voer `supabase/migrations/202611010001_jofit_accounts.sql` uit. Dit **laat de oudere `forma_user_data`-tabel ongemoeid** en maakt een nieuwe tabel met RLS en versiecontrole.
3. Ga naar **Authentication → URL Configuration**: voeg de echte GitHub Pages-URL als Site URL en redirect-URL toe. Stel e-mailbevestiging en herstelmail in.
4. Kopieer de **Project URL** en **Publishable / anon key** naar de openbare instellingen in `jofit-config.js`. De waarde `supabasePublishableKey` mag openbaar zijn; **de service-role key mag nooit in GitHub**. Publiceer de gewijzigde `jofit-config.js` via dezelfde GitHub Desktop-methode.
5. Test eerst met twee **aparte testaccounts** en twee browsers. Maak een set in account A, log uit, log in op account B en controleer of account B de privégegevens van A niet kan ophalen. Test bovendien foutafhandeling en conflicten als twee apparaten tegelijkertijd schrijven. **Dit live deel is nog niet door ons getest.**
6. Voor definitieve accountverwijdering deploy je `supabase/functions/delete-account` als Supabase Edge Function en configureer je de servergeheimen in Supabase (niet in GitHub). De app weigert de verwijderactie als deze serverfunctie ontbreekt.

**Automatische cloudsync is nog een configuratie- en proefwerkonderdeel.** Een bestaande lokale browser is geen geschikt veilig meergebruikersapparaat: uitgelogde accountgegevens kunnen technisch nog in de browseropslag aanwezig zijn. Zet vóór openbare introductie een bewaarbeleid en beveiligingsonderzoek op (zie `PRIVACY-EN-OPSLAG.md`).

## Optionele echte AI-chat (betaalde API)

- Deploy `supabase/functions/coach-chat` met ingeschakelde JWT-verificatie.
- Configureer de servergeheimen `OPENAI_API_KEY` en `OPENAI_MODEL` via **Supabase Secrets**. Zet geen enkele geheime sleutel in `jofit-config.js`.
- Stel voor elke functie `ALLOWED_ORIGIN=https://owenhulshofoh-create.github.io` in. Kies een model na toetsing van actuele beschikbaarheid en prijs.
- Zet pas ná geslaagde server- en accounttests `aiEnabled: true` in `jofit-config.js`.
- SQL bevat een maximum van tien AI-verzoeken per ingelogde gebruiker per dag. Aanvragen verbruiken betaalde modeltokens.

De **regelgebaseerde** trainingscoach werkt zonder deze dienst. Alle wijzigingen aan schema's vereisen bevestiging.

## Optioneel Open Food Facts-productzoeken

- Deploy `supabase/functions/food-search` met JWT-verificatie en SQL-quota.
- Stel via Supabase Secrets de omgeving `OFF_USER_AGENT=JO-FIT/5.0 (contact@jouwdomein.nl)` in, maar gebruik een **werkelijk bereikbaar beheer-e-mailadres** en meld de app bij Open Food Facts aan. Gebruik niet letterlijk de voorbeeldwaarde.
- De zoekfunctie gebruikt tijdelijk de **legacy v1-fulltext-API**, omdat v2/v3 geen gewone volledige-tekstzoekopdrachten bieden. De snelheid is serverbreed beperkt tot 8 verzoeken per minuut en 40 per gebruiker per dag. De API is niet live gevalideerd.
- Zet pas na testen `foodSearchEnabled: true` in `jofit-config.js`.

## Voor wijzigingen later

Maak wijzigingen in de bestaande GitHub Desktop-kloon, klik **Commit to main → Push origin**. De GitHub Pages-link verandert niet. De **✎ Teksten**-knop bewaart persoonlijke voorkeuren op dat apparaat; algemene standaardteksten staan in `teksten.js` en worden via de repository bijgewerkt. Persoonlijke tekstaanpassingen hebben voorrang op de gepubliceerde standaardtekst.

## Meer informatie

- `WIJZIGINGEN.md` – wat is toegevoegd/veranderd
- `STATUS-EN-VERVOLG.md` – wat werkt, wat nog configuratie of validatie nodig heeft
- `TESTRESULTATEN.md` – wat echt is getest en wat niet
- `PRIVACY-EN-OPSLAG.md` – locatie, toegang en aandachtspunten van gegevens
- `BRONNEN-EN-LICENTIES.md` – voeding, media en auteursrechten

**Het nieuwe pakket is een geteste eerste ontwikkelfase, niet de afgeronde publieke productieapp.**
