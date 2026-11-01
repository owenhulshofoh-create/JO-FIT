/* JO FIT adaptive training engine: deterministic suggestions, no secret keys, no silent plan changes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.JOFIT_COACH_ENGINE = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const DEFAULTS = Object.freeze({
    goal: 'muscle', experience: 'beginner', days: 4, minutes: 45, equipment: 'home',
    focus: 'all', exclude: '', preferences: ''
  });
  const goals = { muscle: 'Spieropbouw', strength: 'Sterker worden', fatloss: 'Vetverlies met spierbehoud', fitness: 'Algemene fitheid' };
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const clean = v => typeof v === 'string' ? v.trim() : '';
  const round = (v, step) => Math.round(v / step) * step;
  function normalize(input) {
    const p = input || {};
    return {
      goal: goals[p.goal] ? p.goal : DEFAULTS.goal,
      experience: ['beginner', 'intermediate', 'advanced'].includes(p.experience) ? p.experience : 'beginner',
      days: Math.max(1, Math.min(7, Number(p.days) || 4)),
      minutes: Math.max(20, Math.min(150, Number(p.minutes) || 45)),
      equipment: ['home', 'gym', 'mixed'].includes(p.equipment) ? p.equipment : 'home',
      focus: ['all','chest','back','arms','legs','shoulders','core'].includes(p.focus) ? p.focus : 'all',
      exclude: clean(p.exclude).slice(0, 400), preferences: clean(p.preferences).slice(0, 600)
    };
  }
  function latestCheckin(input) {
    const c = input || {};
    return {
      date: clean(c.date).slice(0, 10), energy: Math.max(1, Math.min(5, Number(c.energy) || 3)),
      soreness: Math.max(0, Math.min(3, Number(c.soreness) || 0)),
      sleep: Number.isFinite(Number(c.sleep)) && c.sleep !== '' ? Math.max(0, Math.min(14, Number(c.sleep))) : null,
      pain: Boolean(c.pain)
    };
  }
  function restMode(checkin) {
    if (!checkin) return null;
    if (checkin.pain) return { type: 'pain', text: 'Je hebt pijn gemeld. Geen verhogingen voorstellen. Vermijd pijnprovocerende oefeningen en vraag professioneel advies bij aanhoudende klachten.' };
    if (checkin.energy <= 2 || checkin.soreness >= 3 || (checkin.sleep !== null && checkin.sleep < 6)) {
      return { type: 'recovery', text: 'Je herstelcheck wijst op lagere belastbaarheid. Houd het licht, vermijd gewichtsverhogingen en overweeg minder werksets.' };
    }
    return null;
  }
  function excluded(prefs, exercise) {
    const words = prefs.exclude.split(/[,;\n]/).map(s => s.trim().toLowerCase()).filter(x => x.length >= 3);
    const label = `${exercise?.id || ''} ${exercise?.name || ''}`.toLowerCase();
    return words.some(x => label.includes(x));
  }
  function repBounds(raw) {
    const matches = String(raw ?? '').match(/\d+/g);
    if (!matches?.length) return { min: 8, max: 12 };
    return { min: Math.max(1, +matches[0]), max: Math.max(+matches[0], +matches.at(-1)) };
  }
  function increment(e) {
    const name = `${e.name || ''} ${e.equipment || ''}`.toLowerCase();
    return /dumbbell|halter.*hand|kettlebell/i.test(name) ? 1 : 2.5;
  }
  function analyze({ prefs: inp, checkin: rawCheckin = null, sets = [], plan = [], schedule = [], exercises = {}, today = '' } = {}) {
    const prefs = normalize(inp), checkin = rawCheckin ? latestCheckin(rawCheckin) : null;
    const recovering = restMode(checkin);
    const actions = [], notes = [], seen = new Set();
    const eligible = (Array.isArray(sets) ? sets : []).filter(s => s?.exact && s.date && finite(s.kg) && s.kg > 0 && Number.isInteger(s.reps) && s.reps > 0 && finite(s.rir));
    for (const item of plan || []) {
      const ex = exercises[item.id] || { id: item.id, name: item.id };
      if (!item.id || seen.has(item.id)) continue;
      seen.add(item.id);
      if (excluded(prefs, ex)) { notes.push(`${ex.name}: staat bij je uitgesloten oefeningen. Pas je schema handmatig aan als je deze wilt vermijden.`); continue; }
      const logs = eligible.filter(s => s.exerciseId === item.id);
      const dates = [...new Set(logs.map(s => s.date))].sort().slice(-2);
      if (dates.length < 2) continue;
      const groups = dates.map(d => logs.filter(s => s.date === d));
      if (groups.some(g => g.length < 2)) continue;
      if (today && Number.isFinite(Date.parse(today)) && (Date.parse(today) - Date.parse(dates.at(-1))) > 21 * 86400000) continue; // skip stale training history
      const latest = groups.at(-1), previous = groups[0], target = repBounds(item.reps || ex.reps);
      const kg = latest[0].kg, step = increment(ex);
      if (![...latest, ...previous].every(x => x.kg === kg)) continue;
      const all = [...latest, ...previous];
      if (!recovering && all.every(x => x.reps >= target.max && x.rir >= 1 && x.rir <= 4)) {
        const to = round(kg + step, .5);
        if ((to - kg) / kg <= .1 && to <= 500) actions.push({ type: 'weight', exerciseId: item.id, exercise: ex.name, from: kg, to, title: 'Voorzichtig verhogen', reason: `Twee trainingen achter elkaar ${target.max}+ herhalingen binnen 1-4 RIR.` });
      } else if (!recovering && all.filter(x => x.reps < target.min && x.rir <= 1).length >= Math.ceil(all.length * .6)) {
        const to = Math.max(.5, round(kg * .95, .5));
        if (to < kg) actions.push({ type: 'weight', exerciseId: item.id, exercise: ex.name, from: kg, to, title: 'Iets lichter trainen', reason: `Je zat bij minstens 60% van de sets onder ${target.min} herhalingen met weinig herhalingen over.` });
      }
    }
    if (recovering) notes.unshift(recovering.text);
    if (!eligible.length) notes.push('Begin met het loggen van minstens twee trainingen per oefening, inclusief herhalingen en RIR. Tot die tijd verandert JO FIT je gewicht niet.');
    if (prefs.goal === 'fatloss') notes.push('Voor vetverlies blijft krachttraining belangrijk voor spierbehoud. De coach bepaalt geen calorietekort uit je sets.');
    if (prefs.focus !== 'all') notes.push('Je prioriteit is '+({chest:'borst',back:'rug',arms:'armen',legs:'benen',shoulders:'schouders',core:'core'}[prefs.focus])+'. JO FIT neemt dit mee in de adviezen; extra sets zijn niet automatisch nodig.');
    if (prefs.days >= 6 && recovering) notes.push('Bij veel trainingsdagen en beperkt herstel kan een extra rustdag zinvol zijn.');
    const scheduledDays = [...new Set(schedule.filter(x => x.exercises?.length > 0).map(x => x.day))].length;
    if (scheduledDays && scheduledDays !== prefs.days) notes.push(`Je schema bevat ${scheduledDays} trainingsdagen; je doel is ${prefs.days}. Pas de weekindeling samen met je coach aan in Mijn schema.`);
    const busiest = schedule.reduce((a,b)=> (b.exercises?.length||0)>(a.exercises?.length||0)?b:a,{exercises:[]});
    if (busiest.exercises?.length) {
      const roughMinutes = 5 + busiest.exercises.reduce((t,x)=>t+Math.max(1,Math.min(6,Number(x.sets)||3))*2.5,0);
      if (roughMinutes > prefs.minutes * 1.15) {
        notes.push(`Je drukste trainingsdag kost naar schatting ${Math.ceil(roughMinutes)} min; je hebt ${prefs.minutes} min aangegeven. Maak prioriteiten of wissel efficiënter met een powerset. Dit is slechts een schatting.`);
        const reducible = [...busiest.exercises].reverse().find(x=>Number(x.sets)>=2 && !excluded(prefs,exercises[x.id]));
        if (reducible) actions.push({type:'sets',exerciseId:reducible.id,day:busiest.day,exercise:exercises[reducible.id]?.name||reducible.id,
          from:Number(reducible.sets),to:Number(reducible.sets)-1,title:'Maak deze training korter',reason:`Op deze trainingsdag is de geschatte duur langer dan je beschikbare ${prefs.minutes} minuten. Eén set minder is een optie, geen verplichting.`});
      }
    }
    if (prefs.equipment === 'home' && plan.some(item=>/chest press machine|smith machine|leg press|hack squat/i.test(exercises[item.id]?.name || ''))) notes.push('Je hebt thuis trainen gekozen, maar je schema bevat mogelijk een apparaat dat niet beschikbaar is. Kies een passende variant in de Oefenbibliotheek.');
    if (prefs.experience === 'beginner') notes.push('Bij het opbouwen van techniek is consistente uitvoering belangrijker dan snel gewicht toevoegen.');
    const valid = (Array.isArray(sets) ? sets : []).filter(s => s.date && s.exact);
    const workoutDays = new Set(valid.map(s => s.date)).size;
    return {
      prefs, recovering, actions: actions.slice(0, 12), notes: notes.slice(0, 8),
      summary: `${goals[prefs.goal]} · ${prefs.days} trainingsdagen per week · ${prefs.minutes} min per training`,
      observedWorkouts: workoutDays,
      status: recovering ? 'herstel' : actions.length ? 'bijsturen' : (workoutDays ? 'op koers' : 'beginnen')
    };
  }
  return { DEFAULTS, goals, normalize, latestCheckin, restMode, excluded, repBounds, analyze };
});
