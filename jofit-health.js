/* JO FIT · begrijpelijke leefstijlvoorlichting. Geen diagnose, geen persoonlijke gebruiksregistratie. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.JOHEALTH=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const content=[
 {id:'alcohol',title:'Alcohol',summary:'Minder goed herstel, extra calorieën en vaak slechter slapen.',body:[
  ['Spieropbouw','Na krachttraining herstelt je lichaam de getrainde spieren. Grote hoeveelheden alcohol kunnen de aanmaak van nieuwe spiereiwitten afremmen. Ook als je voldoende eiwit eet. Het sterkste onderzoek gaat over flink drinken; één drankje betekent niet dat alle spiergroei verdwijnt.'],
  ['Vetverlies','Alcohol bevat ongeveer 7 kilocalorieën per gram alcohol. Bier, wijn en mixdrankjes kunnen daardoor ongemerkt extra energie toevoegen. Het lichaam verwerkt alcohol met voorrang; dat betekent niet dat vetverlies voor altijd stopt. Op de lange termijn telt vooral hoeveel energie je gemiddeld binnenkrijgt en verbruikt.'],
  ['Slaap, training en herstel','Alcohol kan je slaperig maken, maar je slaapkwaliteit verslechteren. Daardoor kun je de volgende dag minder fit zijn. Veel drinken kan ook je coördinatie, vochtbalans en besluitvorming beïnvloeden.'],
  ['Wat is handig om te onthouden?','Minder drinken helpt je herstel en maakt het vaak makkelijker om je voedingsdoel te halen. Plan geen zware training wanneer je onder invloed of duidelijk niet hersteld bent.']
 ]},
 {id:'cannabis',title:'Cannabis (wiet en hasj)',summary:'Kan aandacht, coördinatie en eetlust veranderen; effect op spiergroei is minder zeker.',body:[
  ['Tijdens het sporten','THC kan je reactievermogen, evenwicht en concentratie verminderen. Met zware gewichten is dat een risico, zeker bij oefeningen waarbij je moet balanceren of snel reageren.'],
  ['Voeding en vetverlies','Sommige mensen krijgen meer trek en eten meer; anderen merken dat nauwelijks. Het gevolg voor je gewicht hangt af van je totale eetpatroon, niet van een simpel direct effect van cannabis op vetverbranding.'],
  ['Spiergroei','Er is onvoldoende goed onderzoek om te zeggen dat cannabis op zichzelf de spiergroei bij sporters in een vast percentage remt. Slechter trainen, slapen of eten kan de vooruitgang wel beïnvloeden.']
 ]},
 {id:'stimulants',title:'XTC, speed en cocaïne',summary:'Extra belasting voor hart en lichaam; het gevoel van energie kan misleidend zijn.',body:[
  ['Meer energie betekent niet beter trainen','Stimulerende middelen kunnen je wakker of energiek laten voelen, terwijl je hartslag, bloeddruk en lichaamstemperatuur oplopen. Je merkt vermoeidheid soms minder goed. Dat maakt zwaar trainen of intensieve inspanning riskant.'],
  ['Herstel en spieropbouw','Slecht slapen, weinig eten en dagenlange vermoeidheid kunnen herstel en consistente training in de weg zitten. Er zijn geen betrouwbare cijfers die precies voorspellen hoeveel spiergroei je hierdoor mist.'],
  ['Risico bij combineren','Combinaties met alcohol of andere drugs kunnen extra gevaarlijk en onvoorspelbaar zijn. Bij pijn op de borst, bewustzijnsverlies, ernstige verwardheid of extreme oververhitting: bel 112.']
 ]},
 {id:'downers',title:'Verdovende middelen en pijnstillers',summary:'Versuffing en minder coördinatie vergroten het risico bij trainen.',body:[
  ['Veilig bewegen','Opioïden, GHB en andere verdovende middelen kunnen je suf maken en je evenwicht of ademhaling beïnvloeden. Train niet met zware gewichten wanneer je onder invloed bent.'],
  ['Combinatie met alcohol','Alcohol combineren met verdovende middelen kan de ademhaling gevaarlijk onderdrukken. Dit is geen manier om te ontspannen na een training.'],
  ['Medicijnen','Gebruik je voorgeschreven medicatie? Verander die niet vanwege fitnessadvies. Vraag je arts of apotheker naar sporten en mogelijke bijwerkingen.']
 ]},
 {id:'steroids',title:'Anabole steroïden',summary:'Kunnen spiergroei versnellen, maar brengen ernstige gezondheidsrisico’s mee.',body:[
  ['Wat doen ze?','Anabole steroïden kunnen de spiermassa en kracht sneller laten stijgen. Het is dus niet juist om te zeggen dat ze niet werken.'],
  ['Wat zijn de risico’s?','Gebruik zonder medische indicatie kan de eigen hormoonproductie verstoren en vruchtbaarheid, cholesterol, bloeddruk, hart, lever en stemming schaden. Sommige gevolgen kunnen lang aanhouden of blijvend zijn.'],
  ['Sneller is niet hetzelfde als gezonder','Snelle zichtbare vooruitgang zegt niets over gezondheid op lange termijn. JO FIT biedt geen advies over middelen, doseringen of kuren.']
 ]}
];
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function render(){const host=document.querySelector('#view');if(!host)return;host.innerHTML=`<section class="jo-health-head"><span class="jo-kicker">LEEFSTIJL · KENNISBANK</span><h2>Alcohol, drugs en jouw fitnessdoelen</h2><p>Wat doen middelen met spieropbouw, vetverlies en herstel? Een duidelijke uitleg zonder moeilijke woorden of bangmakerij.</p></section><div class="jo-health-summary"><div><strong>Spieropbouw</strong><p>Goed trainen, genoeg eten en herstellen zijn de basis. Veel drinken en sommige drugs kunnen dat verstoren.</p></div><div><strong>Vetverlies</strong><p>Je totale energiebalans bepaalt de richting van je gewicht. Alcohol kan calorieën toevoegen; andere middelen beïnvloeden soms eetlust en gedrag.</p></div><div><strong>Veilig trainen</strong><p>Train niet onder invloed. Minder coördinatie, een hoge hartslag of versuffing maken oefeningen met gewichten gevaarlijker.</p></div></div><section class="jo-health-list" aria-label="Onderwerpen over middelen">${content.map((item,i)=>`<details class="jo-health-topic" ${i===0?'open':''}><summary><span class="jo-health-topic-title">${escape(item.title)}</span><span class="jo-health-topic-sub">${escape(item.summary)}</span><span class="jo-health-chevron" aria-hidden="true">⌄</span></summary><div class="jo-health-topic-content">${item.body.map(([h,p])=>`<section><h3>${escape(h)}</h3><p>${escape(p)}</p></section>`).join('')}</div></details>`).join('')}</section><section class="jo-health-end"><h3>Wat helpt je vooruitgang het meest?</h3><p>Probeer regelmatig te trainen, voldoende te slapen, genoeg eiwitten en energie te eten en herstel serieus te nemen. Geen enkel supplement of ‘quick fix’ vervangt deze basis.</p><p>De effecten van middelen verschillen per persoon, dosis en situatie. Dit is algemene informatie, geen medisch advies. Heb je vragen of zorgen over je gebruik? Bespreek die met je huisarts of een betrouwbare verslavingszorgprofessional. Bij een acute noodsituatie bel je 112.</p></section>`;}
return {render,content};
});
