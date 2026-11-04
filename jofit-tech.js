/* JO FIT 5.2 · oefenaanwijzingen. Geen automatisch gevalideerde bewegingsvideo. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.JOTECH=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
// De vijf kernpunten zijn bedoeld als praktische startpunten, niet als verplicht exacte gewrichtshoeken.
const detail={
 'incline-press':[
  'Rugleuning ongeveer 15–30° omhoog. Zet je voeten plat en stevig op de grond, je billen op de bank en je schouderbladen rustig naar achteren en beneden.',
  'Start met de dumbbells boven je bovenborst, polsen recht boven je ellebogen. Houd je bovenarmen ongeveer 30–60° van je romp, vaak rond 45°.',
  'Laat de dumbbells langzaam naast je bovenborst zakken tot een comfortabele diepte. Houd je onderarmen grotendeels verticaal.',
  'Duw omhoog en iets naar binnen zonder de gewichten tegen elkaar te slaan; houd de schouders stabiel.',
  'Vermijd ellebogen helemaal opzij, overstrekken van je onderrug en een bank die zo steil staat dat vooral je schouders werken.'
 ],
 'bench-press':[
  'Lig met je ogen ongeveer onder de stang. Voeten stevig op de vloer, billen op de bank en bovenrug stabiel; gebruik veiligheidssteunen of een spotter.',
  'Pak de stang zo breed dat je onderarmen onderaan ongeveer verticaal zijn. Polsen zo veel mogelijk recht boven de onderarmen.',
  'Laat de stang rustig richting midden- of onderkant van de borst bewegen; ellebogen niet kaarsrecht opzij.',
  'Duw de stang omhoog richting de lijn boven je schouders, zonder je billen los te laten komen.',
  'Vermijd stuiteren op je borst, extreem brede ellebogen en controle verliezen bij het uitnemen.'
 ],
 'lat-wide':[
  'Stel de beenrollen passend in, zit stevig en pak de stang iets breder dan schouderbreedte. Zet je borst rustig omhoog.',
  'Laat je schouders aan het begin omhoog bewegen zonder je nek te spannen; polsen blijven in lijn met je onderarmen.',
  'Trek je ellebogen omlaag richting je zij en iets naar voren, niet ver achter je rug. Trek de stang richting je bovenborst.',
  'Laat je armen gecontroleerd uitstrekken, zonder je bovenlichaam heen en weer te slingeren.',
  'Vermijd de stang achter je nek trekken, overdreven achterover leunen of het gewicht met je heupen lanceren.'
 ],
 'lat-narrow':[
  'Zit recht onder de kabel met de beenrollen vast. Pak de smalle greep neutraal of volgens het handvat.',
  'Houd de borst licht geheven en de schouders laag zodra je begint te trekken.',
  'Beweeg de ellebogen omlaag en richting je heupen. Laat de greep naar je bovenborst komen zonder te gaan liggen.',
  'Strek rustig terug totdat je een comfortabele rek in de rug voelt.',
  'Vermijd polsen knikken, rug zwaaien en achterover hangen om het gewicht omlaag te krijgen.'
 ],
 'seated-cable-row':[
  'Zet je voeten op de steunen, knieën licht gebogen, rug lang en borst ontspannen omhoog.',
  'Start met je armen uitgestrekt zonder je onderrug rond te trekken; grijp het handvat stevig maar niet verkrampt.',
  'Trek je ellebogen langs je romp naar achteren en het handvat richting onderribben of navel, afhankelijk van de greep.',
  'Laat eerst de armen gecontroleerd langer worden terwijl je romp grotendeels op zijn plek blijft.',
  'Vermijd ver achterover schommelen en schouders optrekken naar je oren.'
 ],
 'bentover-row':[
  'Sta op heupbreedte. Duw je heupen naar achteren en kantel tot je romp voorover staat, knieën iets gebogen.',
  'Houd de stang dicht bij je benen, span je buik aan en houd je nek in lijn met je romp.',
  'Trek de stang richting onderbuik of onderribben met je ellebogen schuin naar achteren.',
  'Laat de stang rustig zakken zonder telkens rechtop te komen.',
  'Vermijd een ronde onderrug, heupstoten en de stang ver van je lichaam laten zweven.'
 ],
 'incline-curl':[
  'Zet de bank schuin en laat je bovenarmen naast of iets achter je romp hangen. Rug en hoofd blijven tegen de leuning.',
  'Houd je polsen neutraal en je ellebogen ongeveer op hun plek.',
  'Buig je ellebogen en draai zo nodig je handpalmen naar boven, zonder je schouders naar voren te brengen.',
  'Laat de gewichten langzaam terugzakken tot een comfortabele vrijwel gestrekte positie.',
  'Vermijd je schouders naar voren zwaaien of met je rug van de leuning komen.'
 ],
 'standing-curl':[
  'Sta met voeten ongeveer op heupbreedte, knieën niet op slot en buik licht aangespannen.',
  'Houd de bovenarmen dicht bij je zij en je polsen recht.',
  'Krul de gewichten omhoog door je ellebogen te buigen; je romp blijft rustig.',
  'Laat gecontroleerd zakken zonder je ellebogen te laten schieten.',
  'Vermijd met je heupen zwaaien of je schouders optrekken.'
 ],
 'hammer-curl':[
  'Sta stevig en laat je armen langs je zij hangen, handpalmen naar binnen.',
  'Houd polsen recht en schouders laag.',
  'Breng de dumbbells omhoog met je duimen naar boven; bovenarmen blijven grotendeels stil.',
  'Zak langzaam terug tot de armen bijna gestrekt zijn.',
  'Vermijd momentum vanuit rug of heupen.'
 ],
 'preacher-curl':[
  'Stel de zitting zo af dat je oksel/achterkant bovenarm comfortabel tegen de schuine steun rust.',
  'Houd de bovenarm ondersteund en je pols neutraal.',
  'Krul gecontroleerd omhoog terwijl de elleboog op dezelfde plek blijft.',
  'Zak rustig, maar laat je elleboog onderaan niet hard overstrekken.',
  'Vermijd veren uit de onderste positie of je schouder losmaken van de steun.'
 ],
 'shoulder-press':[
  'Zet de bank vrijwel rechtop, maar niet geforceerd verticaal; voeten plat, billen en rug tegen de leuning.',
  'Begin met de dumbbells ongeveer naast je oren, ellebogen licht vóór de schouderlijn en onderarmen grotendeels verticaal.',
  'Druk omhoog in een natuurlijke boog tot boven je schouders, zonder je nek te forceren.',
  'Laat de gewichten beheerst terugzakken tot ongeveer oor-/kinhoogte, afhankelijk van comfortabele bewegingsuitslag.',
  'Vermijd je onderrug extreem hol trekken en je ellebogen ver naar achteren zetten.'
 ],
 'lateral-raise':[
  'Sta rechtop met licht gebogen knieën. Houd de dumbbells voor of naast je bovenbenen.',
  'Houd de ellebogen zacht gebogen, schouders laag en polsen in lijn.',
  'Breng de armen zijwaarts en iets vóór je lichaam omhoog, tot ongeveer schouderhoogte.',
  'Laat 2–3 seconden rustig terugzakken.',
  'Vermijd schouders ophalen, hard zwaaien en je armen geforceerd boven schouderhoogte tillen.'
 ],
 'reverse-fly':[
  'Kantel vanuit de heupen naar voren met een neutrale rug; steun je borst desgewenst op een bank.',
  'Laat je armen onder je schouders hangen, ellebogen licht gebogen.',
  'Breng de bovenarmen breed naar buiten, alsof je de vloer van je afduwt.',
  'Zak beheerst terug; je romp blijft stil.',
  'Vermijd met je rug opveren en je schouders omhoog trekken.'
 ],
 'face-pull':[
  'Zet de katrol rond gezichts- of iets hogere hoogte. Pak beide uiteinden van het touw vast.',
  'Sta met knieën licht gebogen, romp stevig en armen naar voren.',
  'Trek richting je gezicht en beweeg je handen naar weerszijden van je oren, ellebogen op een prettige hoogte.',
  'Laat het touw langzaam naar voren gaan zonder je schouders op te trekken.',
  'Vermijd je hoofd naar het touw duwen of met je rug achterover gooien.'
 ],
 'triceps-pushdown':[
  'Sta een kleine stap van de kabel af met voeten stabiel. Zet de katrol hoog.',
  'Houd je bovenarmen naast je romp en polsen in een rechte lijn met de greep.',
  'Strek je ellebogen omlaag zonder je schouders of heupen mee te laten bewegen.',
  'Laat terugkomen totdat je ellebogen weer comfortabel gebogen zijn.',
  'Vermijd je hele lichaamsgewicht op het touw te drukken en ellebogen te ver naar voren te laten schieten.'
 ],
 'overhead-triceps':[
  'Zet de kabel laag, stap naar voren met je rug naar het toestel en houd het touw achter/boven je hoofd.',
  'Span je buik aan en houd de bovenarmen ongeveer naast je oren in een comfortabele stand.',
  'Strek je ellebogen naar voren/boven zonder je rug hol te trekken.',
  'Buig rustig terug en voel een gecontroleerde rek in de triceps.',
  'Vermijd je heupen naar voren duwen of schouders forceren.'
 ],
 'crossbody-triceps':[
  'Zet de katrol op een hoogte die de kabel schuin over je lichaam laat lopen. Neem een stabiele stand, zijwaarts bij de kabel.',
  'Houd de werkende bovenarm dicht bij je romp en schouder stil.',
  'Strek je elleboog schuin langs of over je lichaam volgens de kabelrichting.',
  'Keer terug zonder het gewicht terug te laten slaan.',
  'Vermijd je arm met je schouder weg te zwaaien of je romp mee te draaien.'
 ],
 'triceps-dips':[
  'Plaats je handen op het diprek, schouders stabiel, borst open en voeten vrij van de grond.',
  'Houd de ellebogen meer naar achteren dan volledig opzij en de romp relatief rechtop.',
  'Buig de ellebogen tot een comfortabele diepte; een diepe schouderrek is niet verplicht.',
  'Duw jezelf rustig omhoog met de triceps en controleer je schouders.',
  'Vermijd diep zakken bij schouderpijn, een schokkende bodempositie en je nek tussen je schouders laten vallen.'
 ],
 'pec-deck':[
  'Stel stoel en handgrepen zo af dat je bovenarmen ongeveer op borsthoogte bewegen.',
  'Houd de rug tegen de leuning, de schouders stabiel en een lichte buiging in de ellebogen.',
  'Breng je armen in een omhelzende beweging naar elkaar toe.',
  'Open rustig totdat je een comfortabele rek over de borst voelt.',
  'Vermijd je schouders naar voren te trekken of met gewicht tegen de eindstop te klappen.'
 ],
 'squat':[
  'Zet de stang veilig in het rack en gebruik veiligheidssteunen. Sta op een comfortabele breedte, vaak rond schouderbreedte.',
  'Span je romp rondom aan en laat knieën in dezelfde algemene richting bewegen als je tenen.',
  'Buig heupen en knieën tegelijk en zak zo diep als je stabiel kunt blijven.',
  'Duw de vloer weg en sta op zonder je gewicht alleen op je tenen te verplaatsen.',
  'Vermijd knieën naar binnen laten vallen en je onderrug geforceerd rond trekken.'
 ],
 'hamstring-curl':[
  'Stel de machine af zodat het draaipunt ongeveer bij de knie zit en het kussen op de juiste plek rust.',
  'Houd je heupen tegen de bank of zitting en je romp stabiel.',
  'Buig je knieën zonder je bekken van de steun te trekken.',
  'Laat de weerstand langzaam terug tot een comfortabele strekking.',
  'Vermijd het gewicht te laten vallen of je onderrug steeds te hollen.'
 ],
 'leg-extension':[
  'Stel de zitting af zodat je knie bij de draaias van de machine zit en je rug tegen de steun blijft.',
  'Plaats het onderbeenkussen net boven de enkel; houd handgrepen vast.',
  'Strek de knieën soepel zonder in het eindpunt te schokken.',
  'Laat langzaam terugzakken zodat het gewicht niet neerklapt.',
  'Vermijd geforceerd hard doorstrekken of je heupen optillen.'
 ],
 'calf-raise':[
  'Sta met je voeten recht en stabiel op een vlakke ondergrond of veilige opstap; houd je eventueel vast.',
  'Houd knieën grotendeels gestrekt maar niet hard op slot.',
  'Duw rustig op de bal van je voet en kom op je tenen.',
  'Laat de hak langzaam terugzakken tot een comfortabele rek.',
  'Vermijd veren en train bij peesklachten binnen je afgesproken opbouw.'
 ],
 'cable-crunch':[
  'Kniel stabiel voor de kabel, pak het touw naast je hoofd en houd je heupen grotendeels op dezelfde plek.',
  'Span de buik aan en beweeg je ribben richting je bekken.',
  'Buig de romp langzaam vanuit de buik, niet door het touw met je armen omlaag te trekken.',
  'Kom rustig terug zonder je onderrug ver door te strekken.',
  'Vermijd vooral vanuit de heupen te schommelen.'
 ],
 'weighted-leg-raise':[
  'Hang of steun aan een stevig rek, schouders actief en romp stabiel.',
  'Begin met benen stil; gebruik een gewicht alleen als je de beweging al beheerst.',
  'Breng je knieën/benen omhoog en kantel het bekken licht achterover.',
  'Laat gecontroleerd zakken zonder te zwaaien.',
  'Vermijd momentum of pijn in heupen en onderrug.'
 ],
 'pullup':[
  'Pak de stang iets breder dan schouderbreedte en begin vanuit een gecontroleerde hang.',
  'Span buik en billen licht aan en laat schouders actief bewegen.',
  'Trek de ellebogen richting je ribben en breng je kin boven de stang als dat lukt zonder nek te forceren.',
  'Zak rustig terug naar een comfortabele hang.',
  'Vermijd wild kippen of schommelen als je strikt wilt trainen.'
 ]
};
Object.assign(detail,{"singlearm-curl": ["Sta rechtop met een dumbbell in een hand; voeten op heupbreedte en schouders ontspannen.", "Bovenarm bij de romp, pols recht en romp licht aangespannen.", "Buig alleen de elleboog en beweeg de dumbbell richting je schouder.", "Laat rustig terug zakken en train vervolgens je andere arm.", "Niet zwaaien met heupen of schouders om zwaarder te kunnen."], "machine-shoulder-press": ["Stel de zitplek zo af dat de grepen rond schouderhoogte beginnen. Plaats je voeten plat.", "Houd billen en bovenrug tegen de leuning, polsen recht en ellebogen onder of iets voor je handen.", "Duw langs de machinebaan omhoog zonder je nek naar voren te steken.", "Zak gecontroleerd naar een prettige diepte.", "Vermijd je onderrug hol trekken of door pijn heen drukken."], "chest-supported-reverse-fly": ["Kantel een bank licht omhoog; leg je borst erop en zet je voeten stevig.", "Laat de armen onder je schouders hangen met zachte ellebogen.", "Hef je bovenarmen breed naar beide kanten terwijl de borst tegen de bank blijft.", "Laat de dumbbells langzaam terug zakken zonder te schokken.", "Niet opveren met de romp of schouders optrekken."], "standing-leg-curl": ["Stel het draaipunt van de machine bij je knie en de rol op het onderbeen.", "Steun stabiel met handen en houd beide heupen in dezelfde richting.", "Buig een knie en beweeg de hak rustig omhoog, zonder de rug hol te trekken.", "Laat terug zakken en train daarna je andere been.", "Geen momentum gebruiken of met de heupen draaien."], "lying-leg-raise": ["Ga op een mat liggen, armen naast je lichaam, hoofd ontspannen.", "Span de buik aan en houd de onderrug comfortabel stabiel.", "Til de benen gecontroleerd op en kantel het bekken licht achterover.", "Zak tot het punt waarop de onderrug stabiel blijft.", "Houd nooit zomaar een losse dumbbell tussen je voeten zoals op de voorbeeldfoto; begin zonder gewicht."]});
const labels=['Startpositie','Armen en houding','Uitvoering','Beheerst terug','Vermijd deze fout'];
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function guide(e){const custom=detail[e.id];if(custom)return {verified:false,specific:true,lines:custom};return {verified:false,specific:false,lines:[e.steps?.[0]||'Stel het materiaal en je positie comfortabel af.','Houd je romp stabiel en je polsen zoveel mogelijk neutraal.',e.steps?.[1]||'Beweeg rustig en gecontroleerd.',e.steps?.[2]||'Keer met controle naar je startpositie terug.',e.avoid||'Voorkom ongecontroleerde of pijnlijke bewegingen.']};}
function panel(ex,src,escapeFn){const g=guide(ex),s=escapeFn||esc;const hasPhoto=!!src;return `<section class="jo-tech-card" aria-label="Uitvoering van ${s(ex.name)}"><div class="jo-tech-image">${hasPhoto?`<img src="${s(src)}" alt="Illustratieve oefenfoto: ${s(ex.name)}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentElement.classList.add('jo-img-missing')"><span class="jo-tech-image-badge">Oefening herkennen · illustratie</span>`:`<div class="jo-tech-image-fallback"><span class="jo-tech-icon">◎</span><b>Geen gecontroleerde oefenfoto beschikbaar</b><p>Gebruik hieronder de duidelijke houdings- en bewegingsinstructies. Een onjuiste animatie tonen we niet.</p></div>`}</div><div class="jo-tech-steps">${g.lines.map((t,i)=>`<div class="jo-tech-step"><span>${i+1}</span><div><strong>${labels[i]}</strong><p>${s(t)}</p></div></div>`).join('')}</div><p class="jo-tech-caption">${g.specific?'Praktische techniekcues: persoonlijke lichaamsbouw en bewegingsvrijheid kunnen een andere comfortabele uitvoering vragen.':'Algemene uitvoering uit de oefenbibliotheek: gedetailleerde houding en afbeeldingen moeten nog extra worden gecontroleerd.'} Een stilstaande foto is geen bewegingsanalyse.</p></section>`;}
return {guide,panel,detail};
});
