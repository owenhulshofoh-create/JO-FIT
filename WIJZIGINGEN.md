# Wijzigingen in JO FIT 5.2

## Schema en opslag
- `index.html`: nieuwe direct zichtbare knoppen voor **Verwijderen**, **Omhoog** en **Omlaag** bij elke oefening in `Mijn schema`, plus bevestiging en **Laatste verwijdering ongedaan maken**.
- Verwijderen verandert uitsluitend `routines[actieveRoutine].schedule[dag]`; **`sessions` wordt niet verwijderd of bijgewerkt**.
- Bestaande profielen, schema-IDs, sessie-IDs, lokale sleutel `forma_v2_profiles`, en de gescheiden logs blijven in gebruik.
- Herstelfout bij standaardroutine hersteld; initieel schema kan incomplete dagen bevatten en wordt daar veilig op gecontroleerd.
- Gewone sets en powersets blijven per trainingsdag instelbaar. Bij powersets volgt rust ná A en B. Gewichtsstappen +2,5/+5 kg; lichaamsgewicht zonder voorgestelde kilo-verhoging.
- `Voortgang` toont compacte, uitklapbare trainingsgeschiedenis.

## Uitleg en leefstijl
- `jofit-tech.js`: nieuwe gedetailleerde techniekcues voor veelgebruikte oefeningen (bankhoek, houding, elleboogrichting, controle); overige oefeningen blijven gebruikmaken van de bestaande tekst met expliciete beperkingen.
- Illustratieve oefenfoto's blijven los van instructies; onjuiste generieke animaties worden niet getoond. De bestaande anatomische atlas blijft onder een uitklapbaar deel.
- `jofit-health.js`: informatiepagina onder **Meer > Alcohol, drugs & sport**. Geen gebruiksregistratie of nieuwe persoonsgegevens.
- `vision.js` verwijderd uit distributie, schermen en service-worker-cachelijst. Optionele oude Vision-notities zijn niet verwijderd uit eerdere lokale data of back-ups.
- `sw.js`: nieuwe cacheversie met de nieuwe modules.

## Niet uitgevoerd
- Geen geverifieerde nieuwe MP4/WebM-animaties, geen volledige 59-foto-bibliotheek.
- Geen nieuwe cloud- of AI-serverimplementatie; bestaande optionele modules zijn ongewijzigd.
- Geen live GitHub-publicatie, aankopen of tests op echte iPhones/Android-toestellen.

## JO FIT 5.3 - Oefenfotos
- 24 verschillende gebruikersfotos gekoppeld: 23 oefening-ID's inclusief twee squatposities.
- 5 echte oefeningvarianten apart opgenomen in de bibliotheek, met stappen en materiaalchecks.
- Bestaande lokale foto-overschrijvingen en profielen blijven voorrang houden.
- Foutieve variantequivalentie vermeden; bronfoto's blijven illustratief en zijn niet klinisch gevalideerd.
- Nieuwe JS/JSON fotokoppeling: jofit-exercise-images.js / jofit-exercise-images.json.
