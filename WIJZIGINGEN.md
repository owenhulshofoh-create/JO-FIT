# Wijzigingen ten opzichte van de aangeleverde JO FIT 4.0

## Ontwerp
- Vijf hoofdonderdelen: Vandaag, Trainen, Voeding, Voortgang, Meer. Subfuncties via tweede navigatierij in plaats van eigen hoofdtab.
- Donkere JO FIT-huisstijl met rood-roze accent behouden; nieuw dashboard met volgende training, weekoverzicht en korte acties.
- Mobiel menu onderaan vast; desktop- en tabletlayout aangepast. Voormalige dubbele promotiebanners uitgeschakeld.
- In de standaardteksten: JO FIT, "Jouw fitness app", "Naar een idee van Owen en Jonathan"; de ongewenste Forma-slogan is verwijderd.

## Training en intake
- Intake opnieuw gebouwd in vijf onderbreekbare stappen (doel, ervaring, dagen, ruimte, exacte materialen, opties en samenvatting).
- Schema-engine in `jofit-rules.js` met expliciete materiaalvereisten per oefening, 1-6 trainingsdagen, tijdlimiet, vermeden oefeningen, spierfocus en **geen verzonnen startgewicht**.
- Trainingsplan wordt een nieuwe routine naast bestaande routines: oude versies blijven in de routinekiezer.
- Oefencatalogus uitgebreid van 44 naar **59** stabiele oefening-ID's. De 15 nieuwe oefeningen hebben geschreven stappen en worden **niet** als gevalideerde animaties gepresenteerd.
- Coach heeft een nieuwe korte gebruiksinterface: vooraf bekijken, goedkeuren, alternatief bewaren. Oude gedetailleerde krachtanalyses blijven via de knop op de coachpagina bereikbaar.

## Duo, logboek en back-up
- Lokale Duo-sessie: expliciete toestemming, shared volgorde, beurtwisseling, afzonderlijke setregistratie met eigen kg/reps/RPE. Geen synchronisatie tussen twee apparaten.
- Voortgangspagina uitgebreid met selecteerbare 4/8/12 weken, uit werksets herberekende PR-indicatoren en een verwijderactie voor onjuiste registraties.
- Nieuwe back-up bevat één persoonlijk profiel plus intake en Vision-notities; importeert als een apart lokaal profiel in plaats van andere gegevens te overschrijven.
- Bewerkbare foto-overrides en de oorspronkelijke anatomische atlas blijven beschikbaar. Oude beelden zijn niet medisch gevalideerd.

## Voeding
- Nieuw dagboek met werkelijk gekozen gram/stuk/ml, eigen etiketwaarden per 100 g of 100 ml, rauw/bereid-vermelding, favorieten, recente producten en handmatige stappen.
- Ontbrekende waarden blijven `null`/onbekend; milliliters worden niet zonder bekende dichtheid naar gram omgerekend; stuks vereisen een echt stuksgewicht.
- Voorbereide beveiligde serverzoekfunctie voor Open Food Facts. **Niet actief zonder configuratie.** Geen volledige NEVO-, Portie-online- of Voedingscentrum-database overgenomen.

## Accounts en AI (nog te configureren)
- Nieuwe optionele Supabase Auth-client, RLS-migratie `jofit_user_state`, eenvoudige conflictcontrole met versienummers en Edge Functions voor AI, OFF-zoeken en accountverwijdering.
- Cloud en echte AI kunnen **niet op basis van deze GitHub ZIP alleen werken**: Supabase-project, sleutelconfiguratie, Edge Functions en echte tests zijn noodzakelijk.
- De eerdere experimentele cloudfuncties in de Vrienden-module zijn visueel verborgen om verwarring met de nieuwe accountpagina te voorkomen; onderliggende code is voorlopig niet verwijderd.

## Niet gewijzigd of gevalideerd
- Bestaande SVG/2D-animaties en medische atlas zijn niet vervangen door nieuwe 3D-video's. De videokwaliteit en het anatomisch detail zijn nog niet onafhankelijk gecontroleerd.
- Vision is nog zelf video terugkijken en notities maken. Echte geautomatiseerde camerabeoordeling ontbreekt.
- Zes eerdere AI-oefenfoto's blijven; er zijn niet plotseling 59 gevalideerde oefenfoto's.
