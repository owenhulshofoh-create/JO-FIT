# Optionele Supabase-cloud voor JO FIT

1. Maak een Supabase-project aan op https://supabase.com.
2. Gebruik het **bestaande** bestand `supabase-schema.sql` uit je huidige JO FIT GitHub-repository om tabel `forma_user_data` en row-level security aan te maken.
3. Vul in `upgrade/config.js` je **Project URL** en openbare **publishable/anon key** in. Gebruik **nooit** een service-role of andere geheime key.
4. Publiceer, open `Back-up`, log in of maak een account, en kies `Bewaar naar cloud`.
5. Op een tweede apparaat: log in met hetzelfde account, maak voor de zekerheid lokaal een back-up, en kies `Herstel van cloud`.

Dit is handmatige synchronisatie om conflicten tussen apparaten te voorkomen. Er worden geen updates in de achtergrond geüpload en bestaande lokale gegevens worden nooit zonder bevestiging overschreven. Voor een echte automatische tweerichtingssynchronisatie is aanvullende backend-architectuur en conflictbehandeling nodig.
