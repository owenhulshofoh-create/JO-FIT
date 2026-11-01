/* Adaptive Coach lives under the existing Coach tab. No new app navigation. */
(function (w) {
  'use strict';
  const DATA = () => w.JOFIT_DATA, ENGINE = () => w.JOFIT_COACH_ENGINE;
  const key = id => 'jofit_coach_v1_' + id;
  const esc = x => DATA().esc(x);
  const today = () => DATA().date();
  function load(id = DATA().active()) {
    try {
      const x = JSON.parse(localStorage.getItem(key(id)) || 'null');
      if (x?.version === 1) return { version: 1, wishes: x.wishes || {}, checkins: x.checkins || [], chat: x.chat || [], actions: x.actions || [] };
    } catch (e) { console.warn('Coachdata beschadigd:', e); }
    return { version: 1, wishes: { ...ENGINE().DEFAULTS }, checkins: [], chat: [], actions: [] };
  }
  function store(obj, id = DATA().active()) {
    const data = {
      version: 1, wishes: ENGINE().normalize(obj.wishes),
      checkins: (obj.checkins || []).slice(0, 40),
      chat: (obj.chat || []).slice(0, 8),
      actions: (obj.actions || []).slice(0, 80)
    };
    try { localStorage.setItem(key(id), JSON.stringify(data)); return data; }
    catch (e) { alert('Kan de coachgegevens niet opslaan. Exporteer een back-up.'); throw e; }
  }
  const exercisePlan = () => {
    const j = DATA();
    const result = [], seen = new Set();
    for (const d of j.days()) for (const item of j.plan(j.active(), d)) {
      if (!seen.has(item.id)) { result.push(item); seen.add(item.id); }
    }
    return result;
  };
  function compute() {
    const j = DATA(), s = load(), checkin = s.checkins.find(x => x.date === today());
    return ENGINE().analyze({ prefs: s.wishes, checkin, sets: j.combined(), plan: exercisePlan(), schedule: j.days().map(day => ({day, exercises:j.plan(j.active(),day)})), exercises: j.catalog(), today: today() });
  }
  const option = (value, label, selected) => `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`;
  function field(label, html) { return `<label>${label}${html}</label>`; }
  function resetView() {
    document.getElementById('jofu-adaptive')?.remove();
    render();
  }
  function render() {
    const j = DATA();
    if (!document.getElementById('view') || j.tab() !== 'coach' || document.getElementById('jofu-adaptive')) return;
    const s = load(), p = ENGINE().normalize(s.wishes), result = compute(), c = s.checkins.find(x => x.date === today());
    const profileName = j.name(j.active());
    const panel = document.createElement('section');
    panel.id = 'jofu-adaptive'; panel.className = 'jofu-panel';
    panel.innerHTML = `
      <div class="jofu-head"><div><small>COACH · JOUW PERSOONLIJKE PLAN</small><h3>JO FIT Adaptieve Coach</h3>
      <p>Past aanbevelingen aan op jouw doelen, prestaties en herstel. Geen wijzigingen zonder jouw akkoord.</p></div>
      <span class="jofu-badge">${esc(result.status.toUpperCase())}</span></div>
      <div class="jofu-coach-intro"><img src="./assets/jofit-coach.svg" alt="Illustratie van de JO FIT Coach" loading="lazy"/><div><strong>${esc(profileName)}: ${esc(result.summary)}</strong><p>De coach rekent automatisch opnieuw na elke geregistreerde set. Hij werkt ook zonder cloud of abonnement.</p></div></div>
      <details class="jofu-details" ${result.observedWorkouts ? '' : 'open'}><summary>Mijn doelen, wensen en trainingsmogelijkheden</summary>
        <form id="jofu-wishes"><div class="jofu-fields">
          ${field('Mijn hoofddoel', `<select name="goal">${Object.entries(ENGINE().goals).map(([a,b])=>option(a,b,p.goal)).join('')}</select>`)}
          ${field('Trainingsniveau', `<select name="experience">${[['beginner','Beginner'],['intermediate','Gemiddeld'],['advanced','Gevorderd']].map(([a,b])=>option(a,b,p.experience)).join('')}</select>`)}
          ${field('Dagen per week', `<input name="days" type="number" min="1" max="7" value="${p.days}">`)}
          ${field('Minuten per training', `<input name="minutes" type="number" min="20" max="150" step="5" value="${p.minutes}">`)}
          ${field('Waar train je?', `<select name="equipment">${[['home','Thuis'],['gym','Sportschool'],['mixed','Beide']].map(([a,b])=>option(a,b,p.equipment)).join('')}</select>`)}
          ${field('Extra aandacht voor', `<select name="focus">${[['all','Hele lichaam'],['chest','Borst'],['back','Rug'],['arms','Armen'],['legs','Benen'],['shoulders','Schouders'],['core','Core']].map(([a,b])=>option(a,b,p.focus)).join('')}</select>`)}
        </div>
        ${field('Oefeningen die ik niet wil (gescheiden door komma)', `<textarea name="exclude" rows="2" maxlength="400" placeholder="Bijvoorbeeld: skullcrusher, chest press machine">${esc(p.exclude)}</textarea>`)}
        ${field('Overige persoonlijke wensen', `<textarea name="preferences" rows="3" maxlength="600" placeholder="Bijvoorbeeld: trainen met een partner, liever supersets, alleen losse gewichten">${esc(p.preferences)}</textarea>`)}
        <div class="jofu-actions"><button class="jofu-primary" type="submit">Bewaar mijn wensen</button></div>
      </form></details>
      <div class="jofu-two"><div class="jofu-inner"><h4>Dagelijkse herstelcheck</h4><p>Vul dit in wanneer je gaat trainen. Alleen jij ziet deze gegevens, tenzij je expliciet de AI-chat gebruikt.</p>
      <form id="jofu-checkin"><div class="jofu-fields">
      ${field('Energie 1-5', `<select name="energy">${[1,2,3,4,5].map(n=>option(String(n),String(n),String(c?.energy||3))).join('')}</select>`)}
      ${field('Spierpijn 0-3', `<select name="soreness">${[0,1,2,3].map(n=>option(String(n),String(n),String(c?.soreness??0))).join('')}</select>`)}
      ${field('Slaapuren', `<input name="sleep" type="number" min="0" max="14" step="0.5" value="${esc(c?.sleep??'')}" placeholder="Optioneel">`)}
      ${field('Pijn/klachten tijdens bewegen?', `<select name="pain">${option('no','Nee',c?.pain?'yes':'no')}${option('yes','Ja',c?.pain?'yes':'no')}</select>`)}
      </div><button type="submit" class="jofu-secondary">Bewaar herstelcheck</button></form>
      </div><div class="jofu-inner"><h4>Wat adviseert JO FIT nu?</h4>
      ${result.notes.length ? result.notes.map(n=>`<p class="jofu-adaptive-note">${esc(n)}</p>`).join('') : `<p>Je logboek bevat ${result.observedWorkouts} trainingsdag(en). Blijf registreren; de coach bepaalt wanneer een kleine aanpassing passend is.</p>`}
      <p class="jofu-hint">Dit is trainingsbegeleiding en geen medische beoordeling.</p></div></div>
      <div class="jofu-inner"><h4>Concrete bijsturing voor je volgende training</h4>
      ${result.actions.length ? result.actions.map((a,i)=>`<div class="jofu-coach-action"><div><strong>${esc(a.exercise)}: ${esc(a.from)} → ${esc(a.to)} ${a.type==='sets'?'sets':'kg'}</strong><p>${esc(a.title)} · ${esc(a.reason)}</p></div><button class="jofu-secondary" data-coach-apply="${i}">${a.type==='sets'?'Pas sets toe':'Pas gewicht toe'}</button></div>`).join('') : '<p>Nog geen gewichtsaanpassing nodig. Bij voldoende betrouwbare logs én herstelgegevens toont de coach hier voorstellen.</p>'}
      <p class="jofu-hint">De app verandert je schema nooit stilletjes. Bevestig elke aanpassing zelf.</p></div>
      <details class="jofu-details" id="jofu-ai-section"><summary>Vraag het aan je echte AI-coach (optioneel)</summary>
        <p>Stel vragen over jouw schema of voorkeuren. Voor deze functie moet je Supabase en een AI-serverfunctie activeren. Zonder die verbinding blijven alle automatische trainingsadviezen hierboven werken.</p>
        <div class="jofu-chat-messages" id="jofu-chat-messages" aria-live="polite">${s.chat.length ? s.chat.map(c=>`<div class="jofu-chat-bubble ${c.role==='user'?'is-user':'is-coach'}">${esc(c.text)}</div>`).join('') : '<p>Nog geen gesprekken. De AI-chat is optioneel.</p>'}</div>
        <form id="jofu-ai-form">${field('Vraag aan JO FIT AI', '<textarea name="question" rows="3" maxlength="500" placeholder="Bijvoorbeeld: ik wil meer borst trainen maar heb maar 35 minuten"></textarea>')}
        <label class="jofu-consent"><input type="checkbox" name="consent" required> Ik geef toestemming om mijn doelen, recente trainingssamenvatting en eventuele herstelcheck naar de ingestelde AI-dienst te sturen.</label>
        <div class="jofu-actions"><button class="jofu-primary" type="submit" id="jofu-ai-send">Vraag mijn AI-coach</button></div></form>
        <p id="jofu-ai-status" role="status" class="jofu-hint">De AI kan voorstellen toelichten, maar past je schema nooit zelf aan.</p>
      </details>`;
    const originalCoach = document.querySelector('#jofu-coach');
    if (originalCoach?.parentElement === document.getElementById('view')) originalCoach.before(panel);
    else document.getElementById('view').append(panel);
    panel.querySelector('#jofu-wishes').onsubmit = e => {
      e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget));
      const x = load(); x.wishes = ENGINE().normalize(data); store(x); resetView();
    };
    panel.querySelector('#jofu-checkin').onsubmit = e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
      const x = load(); const entry = ENGINE().latestCheckin({ date: today(), energy:f.energy, soreness:f.soreness, sleep:f.sleep, pain:f.pain==='yes' });
      x.checkins = [entry, ...x.checkins.filter(q=>q.date !== today())]; store(x); resetView();
    };
    panel.querySelectorAll('[data-coach-apply]').forEach(button => button.onclick = () => {
      const action = result.actions[Number(button.dataset.coachApply)];
      if (!action || compute().recovering) { alert('Advies vervallen door gewijzigde herstelgegevens.'); resetView(); return; }
      const current = action.type==='sets' ? j.plan(j.active(),action.day).find(x=>x.id===action.exerciseId) : exercisePlan().find(x=>x.id===action.exerciseId);
      const existing = Number(action.type==='sets'? current?.sets : current?.kg);
      if (!current || existing !== action.from) {
        alert('Je schema is gewijzigd. Vernieuw het advies voordat je verder gaat.'); resetView(); return;
      }
      const unit=action.type==='sets'?'sets':'kg';
      if (!confirm(`Je schema voor ${action.exercise} aanpassen van ${action.from} naar ${action.to} ${unit}?`)) return;
      const changed = action.type==='sets' ? j.updateSetCount(action.day,action.exerciseId,action.to) : j.updateWeight(action.exerciseId,action.to);
      if (changed) { const x=load(); x.actions.unshift({ date:new Date().toISOString(),...action }); store(x); alert('Schema bijgewerkt.'); resetView(); }
      else alert('Oefening niet gevonden in het huidige schema.');
    });
    panel.querySelector('#jofu-ai-form').onsubmit = async e => {
      e.preventDefault(); const form=e.currentTarget, btn=form.querySelector('#jofu-ai-send');
      const question=String(new FormData(form).get('question')||'').trim();
      if (!question || question.length>500) return;
      btn.disabled=true; const status=panel.querySelector('#jofu-ai-status'); status.textContent='Vraag wordt veilig verzonden...';
      try {
        const answer=await askAI(question, compute());
        const x=load(); x.chat.push({role:'user',text:question.slice(0,500)},{role:'coach',text:answer.answer.slice(0,3000)});
        store(x); status.textContent='Antwoord ontvangen. De AI heeft niets in je schema veranderd.'; resetView();
        document.querySelector('#jofu-ai-section')?.setAttribute('open','');
      } catch (error) {status.textContent=error.message; btn.disabled=false;}
    };
  }
  async function askAI(question, result) {
    const config=w.JOFIT_CONFIG || {}, origin=String(config.url || '').replace(/\/$/,'');
    if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(origin) || !config.anonKey) throw Error('AI-chat is nog niet geconfigureerd. Zie AI-COACH-INSTALLEREN.md.');
    const sdk=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const client=sdk.createClient(origin,config.anonKey,{auth:{persistSession:true}});
    const {data:{session},error:authError}=await client.auth.getSession();
    if (authError || !session?.access_token) throw Error('Log eerst in via Back-up > Cloudaccount.');
    const j=DATA(), past=j.combined().filter(s=>s.exact).slice(-24);
    const history=past.map(s=>({date:s.date,exercise:j.exname(s.exerciseId),kg:s.kg,reps:s.reps,rir:s.rir}));
    const state=load(), checkin=state.checkins.find(x=>x.date===today())||null;
    const payload={question,profile:{...result.prefs},training:history,checkin,planSuggestions:result.actions.map(({exercise,from,to,reason})=>({exercise,from,to,reason})),recentMessages:state.chat.slice(-4)};
    const response=await fetch(origin+'/functions/v1/jofit-ai-coach',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':config.anonKey},body:JSON.stringify(payload)});
    const json=await response.json().catch(()=>({}));
    if(!response.ok) throw Error(json.error||`AI-chat is tijdelijk niet beschikbaar (${response.status}).`);
    if(typeof json.answer!=='string')throw Error('AI gaf geen geldig antwoord.');
    return json;
  }
  function init() {
    if (!document.getElementById('view')) return;
    let pending=false;
    const schedule = () => {
      if(pending) return; pending=true;
      requestAnimationFrame(() => { pending=false; render(); });
    };
    new MutationObserver(schedule).observe(document.getElementById('view'),{childList:true});
    w.addEventListener('jofit-updated',schedule);
    document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',schedule));
    document.getElementById('profileSelect')?.addEventListener('change',schedule);
    schedule();
  }
  w.JOFIT_COACH={load,store,compute,render,init,askAI};
})(window);
