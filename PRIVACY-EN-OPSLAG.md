# JO FIT — gegevens, toegangscontrole en privacy

## Wat de applicatie momenteel opslaat

| Gegevens | Zonder account | Met geconfigureerde cloud (na tests) |
|---|---|---|
| Schema's, sets, RPE, trainingen, herstel, voeding, lichaamsmetingen | `localStorage` op dit toestel, onder de bestaande sleutel `forma_v2_profiles` | Per account één eigen `jofit_user_state` JSON-record in Supabase met RLS en versienummer; daarnaast een lokale cache |
| Intake en materiaalkeuzes | `localStorage` onder `jofit_intake_v2_<profiel-id>` | Binnen hetzelfde persoonlijke cloudrecord |
| Vision-notities | `localStorage` onder `jofit_vision_<profiel-id>` | Binnen persoonlijk cloudrecord |
| Eigen oefenfoto-overrides | `localStorage` onder `forma-custom-exercise-photos-v1` | Nog NIET gesynchroniseerd (kan groot worden) |
| Lichaamsvoortgangsfoto's | In het lokale profiel (gecomprimeerde dataverwijzing) | Vooralsnog bewust NIET geüpload via nieuwe cloudmodule |
| Vision-video's | Tijdelijke browser-object-URL, dus niet permanent door Vision bewaard | NIET geüpload |
| Inlogtokens | Niet van toepassing | `localStorage` onder `jofit_auth_session_v1`, leesbaar door scripts op dezelfde origin; beveiligingsrisico bij XSS |

De gegevens van elk lokaal profiel worden aan een eigen profiel-ID gekoppeld, maar **een lokaal profiel op een gedeeld apparaat is geen beveiligd account**. De browseropslag is technisch toegankelijk voor iemand met toegang tot die browser of het apparaat. Behandel lokaal meerdere profielen daarom uitsluitend als gemaksfunctie, niet als sterke privacygrens.

## Online toegang

- De nieuwe tabel `public.jofit_user_state` heeft **Row Level Security**. SELECT, INSERT, UPDATE en DELETE zijn alleen toegestaan waar `auth.uid() = user_id`.
- De opslagfunctie `jofit_save_state` gebruikt de caller-toegangsrechten (`SECURITY INVOKER`) en een versienummer om verloren updates bij gelijktijdig bewerken te voorkomen.
- De app synchroniseert na een aanpassing alleen wanneer er een geldig ingelogd persoonlijk account is. Een versieconflict krijgt een foutmelding in plaats van automatisch andermans wijzigingen te overschrijven.
- De extra tabellen voor serverquota zijn niet rechtstreeks aan ingelogde browsers blootgesteld. Serverfuncties controleren het identiteitstoken en limieten.
- Een gedeelde Duo-set wordt onder het profiel opgeslagen dat werkelijk de set heeft uitgevoerd. In de lokale duo-interface is alleen de gezamenlijke trainingsvolgorde zichtbaar.
- **De SQL- en authinstellingen moeten nog op een echt Supabase-project worden getest.** De aanwezigheid van beleid in SQL bewijst op zichzelf niet dat de complete productieconfiguratie waterdicht is.

## Verwijderen en exporteren

- Persoonlijke JSON-back-ups via **Meer → Download back-up**. De import maakt een nieuw lokaal profiel zodat bestaande gegevens niet worden overschreven.
- Via **Mijn account → Account definitief verwijderen** kan na Edge Function-configuratie het persoonlijke Supabase Auth-account worden verwijderd, met `ON DELETE CASCADE` op nieuwe cloudtabellen.
- **Een account verwijderen betekent niet dat alle oude exportbestanden, lokale browserdata, systeemlogs of eerdere gegevens bij externe leveranciers automatisch verdwenen zijn.** Daarvoor is aanvullend opschoning-/retentiebeleid nodig.
- Controleer met testaccounts herstelmails, export, verwijdering, opnieuw inloggen, dubbele apparaten en rechten van Duo-partners voordat publieke registratie aanstaat.

## Belangrijk voor een publieke lancering

JO FIT kan gegevens verwerken die gevoelig zijn, zoals lichaamsmetingen, herstelgevoel en vermelde beperkingen. Vul bij voorkeur geen diagnose of medische details in en vraag gebruikers alleen wat noodzakelijk is. Controleer vóór publieke lancering:

1. Privacyverklaring en wettelijke grondslag voor elke gegevenscategorie; extra aandacht voor gezondheidsgegevens onder de AVG, wanneer van toepassing expliciete toestemming en een passende verwerkingsovereenkomst met de cloudprovider.
2. Bewaartermijnen, gegevensminimalisatie, wie de verantwoordelijke is, ouderlijke toestemming/leeftijdsbeleid waar relevant, rechten van betrokkenen, datalekprocedure, mogelijk DPIA, internationale gegevensdoorgiften en eventuele AI-verwerking.
3. Bescherming tegen XSS en onveilige opslag van tokens. Overweeg een bekrachtigde CSP, geautomatiseerde dependency-/security-tests en aanvullende maatregelen voor gedeelde toestellen.
4. Applicatiebeveiliging van serverfuncties inclusief autorisatie, SQL/RLS-testen, bruteforce- en verzoeklimieten, e-mailverificatie en misbruikpreventie.
5. Geheimen blijven in Supabase (server); de publieke `jofit-config.js` bevat uitsluitend URL en **publishable** key. Een publishable/anon-key is geen geheime toegangsbeveiliging: RLS blijft noodzakelijk.

Er is **geen afgeronde externe juridische of beveiligingsaudit** uitgevoerd.
