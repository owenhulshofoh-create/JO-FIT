# Functiestatus en vervolgplan

Stand: **1 november 2026**. De status is bewust conservatief.

## 1. Gebouwd en gecontroleerd in geautomatiseerde tests

- Vijf navigatiehoofdonderdelen, eerste intake met hervatten, lokale schemavoorstellen, behoud van oude routines.
- 59 catalogus-ID's en materiaalfilters van de schema-engine; de nieuwe 15 hebben **geen gevalideerde animatie**.
- Duo op één browser/apparaat: alterneren en eigen sets in twee afzonderlijke lokale profielen.
- Handmatig voedingsdagboek met per100g- en per100ml-berekening, stuks met gramgewicht, afwijzen van onzekere ml-naar-gram-conversie.
- Onderliggende logboekstatistiek en wijzigingen na verwijderen; export van intake/Vision-notities in back-up.
- Mobiele headless Chromium-weergave op 320/375/768/1280 pixels zonder geconstateerde JavaScript-fouten (geen echte apparaat- of HTTPS-test).

## 2. Gebouwd, maar nog te configureren en live te testen

- Supabase e-mail/wachtwoordaccount, e-mailverificatie en wachtwoordherstel; `jofit_user_state` RLS en gecontroleerde versie-updates; cloud-export.
- Serverfunctie voor accountverwijdering; servergeheimen en JWT-verificatie.
- AI-chat via beveiligde Edge Function (limiet 10 verzoeken per gebruiker/dag), geen automatische schemawijzigingen.
- Open Food Facts-zoekfunctie via beveiligde Edge Function en serverquota.
- Live-accountisolatie, twee-apparaten sync, offline conflicten en het wissen van gevoelige browsercache **moeten nog end-to-end worden gevalideerd**. Zonder deze tests is publieke accountintroductie niet verstandig.

## 3. Experimenteel / niet deskundig gevalideerd

- Oorspronkelijke 2D-oefenbewegingen en anatomische markeringen, inclusief de eerdere medische atlas-afbeelding.
- Vision voor video-opname/upload, lokaal afspelen en zelf noteren. Geen bewezen herhalingtelling of techniekinterpretatie.
- De zes bestaande AI-oefenfoto's: visueel aanwezig, maar niet medisch/technisch deskundig gevalideerd.
- Trainingsregels en schemaomvang: technische tests, maar nog geen sportfysiologische beoordeling van alle 59 oefeningen en diverse beperkingen.
- Kosten-, privacy- en licentieonderzoek: overzicht gemaakt; eventuele daadwerkelijke commerciële exploitatie vraagt een aanvullende juridische beoordeling.

## 4. Nog niet gebouwd

- Duo met live uitnodigingen en synchronisatie tussen twee afzonderlijke accounts/apparaten.
- Volledige fotoset van alle 59 oefeningen met geteste begin/eindposities.
- Eén juiste, herhalende 3D-videoanimatie per oefening (MP4/WebM). **Eerst één gevalideerd voorbeeld maken**, daarna pas schalen.
- Automatische pose-/repdetectie en gevalideerde cameratechniekbeoordeling.
- Grote algemene voedingsmiddelendatabase met NEVO/Portie-online, geautoriseerde herdistributie of scanners.
- Mealtime automatische imports, geautomatiseerde algemene coachachtergrondtaken, veilige gedeelde-device accountprivacy met versleutelde persoonlijke browsercache.
- Fijnmazige database-versiegeschiedenis en conflictmerge tussen apparaten; momenteel worden gelijktijdige bewerkingen tegengehouden en moeten gebruikers ze handmatig oplossen.
- Productievolwassen toegankelijkheids-, privacy-, incidentrespons- en beveiligingsaudit.

## Aanbevolen volgende fases

**Fase 2 – Live accounts en veilige privacy.** Supabase-inrichting, SQL-test met twee echte testaccounts, e-mail/wachtwoordherstel, HTTPS op echte devices, accountverwijdering, data-import, uitloggen en bewaarbeleid. Daarna tweerichtingssynchronisatie en betrouwbare migratie van lokale data.

**Fase 3 – Duo online, coach en statistiek.** Geautoriseerde trainingsuitnodigingen, realtime of periodieke sync, audit van alle PR-berekeningen, RPE/RIR-routines, AI-chat met kostenmonitoring, uitvoerbare schemawijzigingen na bevestiging.

**Fase 4 – Voeding.** Toestemming/licentie voor NEVO & Portie-online, aparte bronvermelding/versies, koppeling met Open Food Facts en rate limits, barcodescanner met testdataset, favorieten en maaltijdherhaling.

**Fase 5 – Media en Vision.** Technisch geverifieerde beeldketen met vaste personages, per oefening juiste hoek/materiaal, één gevalideerde 3D-testanimatie, vervolgens schaalbare productie; Vision met aparte validatieset en professionele controle.
