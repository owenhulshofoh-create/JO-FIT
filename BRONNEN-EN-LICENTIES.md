# JO FIT — broninformatie, voedingslicenties en media

Gecontroleerde informatie, stand **1 november 2026**. Dit document is geen juridisch advies. Gebruik deze informatie opnieuw bij elke uitbreiding of commerciële lancering.

## RIVM NEVO-online

- Officiële informatie: https://www.rivm.nl/nederlands-voedingsstoffenbestand/gebruik-nevo-online/download-bestand
- Voorwaarden: https://www.rivm.nl/sites/default/files/2026-09/Voorwaarden-voor-gebruik-NEVO-online-2025-databestand.pdf
- Versie **2025/9.0**. Gratis download na accepteren van de voorwaarden; auteursrechten blijven bij RIVM/de Staat. Volgens de voorwaarden is gebruik van de broninformatie alleen toegestaan in **ongewijzigde vorm** met bron en versienummer, bijvoorbeeld: "Gebaseerd op gegevens van NEVO-online versie 2025/9.0, RIVM, Bilthoven". Het in rekening brengen aan eindgebruikers voor deze NEVO-gegevens is niet toegestaan.
- Geen NEVO-bestand is nu ingebouwd of herverdeeld in deze ZIP. Voor een eigen productdatabase moet de gegevensinvoer, de exacte attributie en de combinatie met andere bronnen eerst worden ontworpen en beoordeeld.

## RIVM Portie-online

- Officieel: https://www.rivm.nl/Voedingseenheden-en-maten/copyright-en-disclaimer
- Database: https://portie-online.rivm.nl/
- Versie **2026/2.0**, 19 januari 2026. Gebruik in ongewijzigde vorm met bronvermelding `Portie-online versie 2026/2.0, RIVM, Bilthoven`; het catalogusrecord vermeldt **CC BY-ND 4.0** en de rechten liggen bij RIVM/Staat.
- Openbare zichtbaarheid betekent niet dat je een aangepaste, herverpakte portiedatabase zonder meer mag verspreiden. In deze versie worden portiegewichten door de gebruiker zelf ingevoerd; geen Portie-online tabel is overgenomen.

## Open Food Facts

- Licentievoorwaarden: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/
- API-gebruik: https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/
- De **database** valt onder de Open Database License (**ODbL**), afzonderlijke inhoud onder Database Contents License (**DbCL**). Productfoto's vallen doorgaans onder **CC BY-SA** en kunnen aanvullende rechten hebben. De app gebruikt bewust geen externe productfoto's.
- Toeschrijving en eventuele **share-alike**/doorpublicatieverplichtingen moeten worden nageleefd als een herbruikbare, gecombineerde voedingsdatabase wordt gepubliceerd. Een eenvoudige zoekresultaatweergave, plaatselijk opslaan van individuele producten en herpublicatie van een complete dataset zijn niet automatisch hetzelfde gebruik. Laat dit juridisch beoordelen bij commerciële groei.
- De API vraagt een **identificeerbare User-Agent** met contactmail en het invullen van het API-registratieformulier. Er gelden onder meer limieten van 10 zoekverzoeken per minuut per IP. Gebruik geen live type-ahead dat deze limiet snel raakt.
- `supabase/functions/food-search` is voorbereid, maar uitgeschakeld tot serverconfiguratie en echte testen. Vanwege de huidige API-stand gebruikt het prototype de **legacy v1 full-text search**; v2 biedt op dit moment alleen gestructureerde filters en v3 heeft nog geen server-side search endpoint. Een toekomstige overstap op Search-a-licious is waarschijnlijk beter.
- Bij ontbrekende gegevens tonen we "onbekend" en raden we etiketcontrole aan; gebruikersgegevens van Open Food Facts zijn niet gegarandeerd foutloos.

## Voedingscentrum

- Algemene rechten: https://www.voedingscentrum.nl/nl/service/over-ons/privacy/over-de-site.aspx
- Site-teksten, recepten en afbeeldingen hebben auteursrechten. Voor herpublicatie, bewerking of ander dan persoonlijk niet-commercieel gebruik kan voorafgaande schriftelijke toestemming vereist zijn. Er bestaan mogelijk specifieke voorwaarden voor voorlichting over de Schijf van Vijf; ga er niet vanuit dat die alle content dekken.
- In deze versie worden **geen beschermde Voedingscentrum-teksten, recepten of foto's gekopieerd**. Gebruik bij voorkeur eigen tekst en een bronlink totdat rechten expliciet bevestigd zijn.

## Bestaande JO FIT-afbeeldingen en animaties

- Uitgangspunt is het door de gebruiker aangeleverde JO FIT 4.0-pakket. De 6 bestanden in `assets/exercises/*.webp` en de dashboardbeelden zijn afbeeldingen uit de eerdere JO FIT-ontwikkeling; geen nieuwe externe stockbeelden zijn in deze fase toegevoegd.
- `assets/anatomy-medical.webp` is een eerder aangeleverde anatomische illustratie. Niet onafhankelijk medisch gevalideerd; niet behandelen als exacte anatomische atlas.
- De bestaande, in JS opgebouwde SVG-bewegingen zijn geen technisch gevalideerde 3D-animaties.
- De 15 toegevoegde oefeningen hebben nu een tekstuele uitleg, geen vals geclaimde gegenereerde video.
- Voor een latere complete AI-beeldset: originele beelden met gedocumenteerde herkomst, per ID begin- en eindpositie en technische review door vakbekwame trainer; géén derde-partijlogo's, modellen of trainingsmateriaal zonder toestemming. Productie/licentie van externe 3D-animaties is nog niet onderzocht tot een bestelbaar pakket, en er is niets gekocht.

## Hosting en AI-kosten

- GitHub Pages kan voor een publieke repository gratis worden gebruikt (zie actuele GitHub-voorwaarden).
- Supabase Free: circa 500 MB database, 1 GB bestandsopslag, 50.000 maandactieve gebruikers en 500.000 Edge Function-aanroepen volgens het officiële tarievenoverzicht, met een beperking/pauzering bij inactiviteit. Extra verkeer, grotere opslag of betaalde functies kunnen kosten veroorzaken. Zie https://supabase.com/pricing . Een Pro-project begint volgens de officiële pagina rond **$25 per maand**, exclusief mogelijke extra kosten.
- Een OpenAI API-chat kost **tokens per daadwerkelijk gebruikte modelversie**; geen toegang via een bestaand ChatGPT-abonnement zonder aparte API-inrichting. Zie https://platform.openai.com/pricing . Serverlimiet in deze broncode: maximaal tien AI-chatvragen per gebruiker per dag, maar de beheerder is verantwoordelijk voor bestedingslimieten, logging en uiteindelijke kosten.
- Opslag van gebruikersvideo's in een toekomstige echte Vision-cloudfunctie kan omvangrijke en terugkerende opslag-, netwerk- en AI-kosten veroorzaken; die functie is nog niet gebouwd.
