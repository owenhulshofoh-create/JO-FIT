# JO FIT 4.2 — echte AI-chat configureren (optioneel)

## Wat werkt zonder externe AI?

De **adaptieve coach** onder het bestaande tabblad **Coach** werkt volledig lokaal. Je kunt per profiel een doel, tijdsbudget, beschikbare apparatuur, spierprioriteit en uitgesloten oefeningen invullen. De coach vraagt een herstelcheck en doet na voltooide trainingen conservatieve voorstellen. Hij past het schema **nooit** automatisch aan. Hij is een regelgebaseerd beslismodel, dus geen generatief taalmodel.

## Wat wordt toegevoegd zodra je de server activeert?

Een AI-chat in datzelfde tabblad. Je kunt bijvoorbeeld vragen: 'ik wil meer borst trainen maar ik heb maar 35 minuten'. Het AI-model gebruikt de actuele doelen, je laatste **maximaal 24 sets**, je eigen herstelcheck en eerder door de regels geverifieerde adviesvoorstellen. Het model stuurt geen video door en kan niet zelfstandig schema's aanpassen.

**Benodigd:** Supabase-account met een gebruiker, je eigen OpenAI API-account met facturering en een persoonlijke API-sleutel voor de **server**. API-verbruik kan kosten opleveren. Een ChatGPT-abonnement geeft niet automatisch API-tegoed.

## Stappen

1. Volg `CLOUD-INSTALLEREN.md` om een Supabase-project en accounts op te zetten. Vul de publieke URL en **publishable/anon key** in `upgrade/config.js` in. Gebruik hier nooit een geheime sleutel.
2. Open in Supabase **SQL Editor**. Voer de inhoud uit `supabase/migrations/20261101_jofit_ai_rate_limit.sql` uit. De limiet is 12 AI-vragen per gebruiker per uur.
3. Maak onder **Edge Functions** de functie `jofit-ai-coach` aan met exact de inhoud van `supabase/functions/jofit-ai-coach/index.ts`, of deploy met Supabase CLI: `supabase functions deploy jofit-ai-coach`.
4. Stel **Secrets** in voor de Edge Function: `OPENAI_API_KEY` = jouw geheime OpenAI API-sleutel; `ALLOWED_ORIGINS` = exacte oorsprong van de website, bijvoorbeeld `https://voorbeeld.github.io` (dus geen pad achter de host). Eventueel `OPENAI_MODEL` = `gpt-5-mini` of een model waartoe je API-account toegang heeft.
5. Verifieer dat het Supabase-project een `SUPABASE_URL` en `SUPABASE_ANON_KEY` of `SUPABASE_PUBLISHABLE_KEYS` beschikbaar stelt aan Edge Functions. Supabase levert die normaal automatisch.
6. Publiceer je GitHub Pages-site, ga naar **Back-up → Cloud**, log in en open daarna **Coach → Vraag het aan je echte AI-coach**. Accepteer expliciet de toestemming en stel een vraag.

**Veiligheid**
- Zet `OPENAI_API_KEY` **nooit** in GitHub, `index.html`, `upgrade/config.js` of andere publieke bestanden.
- Stuur alleen data met expliciete toestemming op de verzendknop. Bewaarde chatgeschiedenis staat lokaal per profiel en wordt opgenomen in je JO FIT-back-up.
- De AI reageert met uitleg en tekst. Alle wijzigingen aan trainingsschema's blijven gebruikerskeuzes.
- De rate-limit is een basale kostenrem, geen volledige DDoS-bescherming. Configureer een passend API-budget en monitoring bij je API-aanbieder.
- `ALLOWED_ORIGINS` kan meerdere URL-origins bevatten, gescheiden door komma's. Gebruik geen wildcard.
- Test met één account voordat je anderen toegang geeft. Test ook: niet-ingelogde verzoeken, verkeerde origins, lege vragen, en 12 verzoeken per uur.

**Let op:** deze AI-chat is gebouwd als integratie, niet als reeds geactiveerde live dienst. Zonder jouw eigen sleutel en Supabase-project is de AI-chat niet actief.
