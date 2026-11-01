/* JO FIT Vision 4.2: opt-in, local MediaPipe frames with measurable quality, no uploaded videos. */
(function (w) {
  'use strict';
  const modelPath='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const cdn='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22';
  const core=()=>w.JOFIT_MOTION;
  let landmarker=null, busy=false, cancel={requested:false};
  const supported = id => core().type(id) !== null;
  async function loadModel() {
    if (landmarker) return landmarker;
    const m=await import(cdn+'/+esm');
    const wasm=await m.FilesetResolver.forVisionTasks(cdn+'/wasm');
    landmarker=await m.PoseLandmarker.createFromOptions(wasm,{
      baseOptions:{modelAssetPath:modelPath,delegate:'CPU'},
      runningMode:'VIDEO', numPoses:1,
      minPoseDetectionConfidence:.55, minPosePresenceConfidence:.55, minTrackingConfidence:.55
    });
    return landmarker;
  }
  const tick=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  async function seek(video,t) {
    if(Math.abs(video.currentTime-t)<.025 && video.readyState>=2) return;
    await new Promise((resolve,reject)=>{
      let finished=false;
      const done=(error)=>{if(finished)return;finished=true;clearTimeout(timeout);video.removeEventListener('seeked',onSeek);if(error)reject(error);else resolve();};
      const onSeek=()=>done();
      const timeout=setTimeout(()=>done(Error('De video kon niet op tijd worden gelezen.')),8000);
      video.addEventListener('seeked',onSeek);
      try {video.currentTime=t;}catch(error){done(error);}
    });
  }
  async function analyze({ video, exerciseId, exerciseName, onProgress=()=>{}, cancellation=null, maxSeconds=30 }={}) {
    if(!video || !video.videoWidth || !video.videoHeight || !Number.isFinite(video.duration)||video.duration<3) throw Error('Selecteer een geladen video van minstens 3 seconden.');
    const name=exerciseName||exerciseId||'';
    if(!supported(name))throw Error('Deze oefening wordt nog niet betrouwbaar geanalyseerd. Test eerst een squat, lunge of biceps curl.');
    const pose=await loadModel(), token=cancellation||{requested:false};
    const seconds=Math.min(maxSeconds,video.duration), samples=[];
    const initial=video.currentTime; video.pause();
    try {
      // Timestamp must follow video time, not wall-clock time. Sampling ~7 fps for <=30s.
      const count=Math.min(220,Math.ceil(seconds/.15));
      for(let i=0;i<count;i++) {
        if(token.requested)throw Error('Analyse gestopt.');
        const t=Math.min(i*.15, Math.max(.001,video.duration-.035));
        await seek(video,t);
        const result=pose.detectForVideo(video,Math.round(t*1000));
        const a=core().joint(result.landmarks?.[0],name,video.videoWidth,video.videoHeight);
        samples.push({t,a});
        if(i%8===0) {onProgress(Math.round((i+1)/count*100));await tick();}
      }
      const summary=core().analyze(samples);
      onProgress(100);
      return { ...summary, exercise:name, measuredAt:new Date().toISOString(), secondsAnalyzed:seconds };
    } finally {
      try {await seek(video,Math.min(initial,Math.max(0,video.duration-.035)));}catch(e){}
    }
  }
  function render() {
    const view=document.querySelector('#view');
    if(!view || view.querySelector('#jofu-vision')) return;
    const section=document.createElement('section');section.id='jofu-vision';section.className='jofu-panel';
    section.innerHTML=`<div class="jofu-head"><div><small>VISION · CONTROLEERBARE VIDEOANALYSE</small>
      <h3>Beweging meten, niet gokken</h3><p>Tel herhalingen van squats, lunges en biceps curls. Alleen bij voldoende meetkwaliteit wordt een schatting weergegeven.</p></div>
      <span class="jofu-badge">BETA</span></div>
      <img src="./assets/jofit-vision.svg" alt="Illustratie videoanalyse" class="jofu-vision-img" loading="lazy">
      <p>Gebruik een stabiele zijaanzichtcamera, film je volledige lichaam en laat gewrichten zichtbaar. Je video blijft op je apparaat. Na een klik haalt de browser alleen modelsoftware van MediaPipe op.</p>
      <div class="jofu-actions"><button class="jofu-primary" id="jofu-analyse" type="button">Analyseer mijn video</button><button class="jofu-secondary" id="jofu-stop" type="button" disabled>Stop</button>
      <a class="jofu-secondary jofu-link" href="./tools/VIDEO-TESTLAB.html" target="_blank" rel="noopener">Open videotestlab</a></div>
      <div class="jofu-inner" id="jofu-analysis-result" role="status">Kies eerst een oefening en video in JO FIT Vision.</div>
      <label>Zelf getelde herhalingen (optioneel voor testen)<input id="jofu-manual-reps" type="number" min="0" max="100" placeholder="Bijv. 8"></label>
      <p class="jofu-hint">Gewrichtshoeken worden in 2D geschat. Geen automatische medische, biomechanische of veiligheidsdiagnose. Stop bij pijn.</p>`;
    view.append(section);
    const button=section.querySelector('#jofu-analyse'), stopButton=section.querySelector('#jofu-stop'), output=section.querySelector('#jofu-analysis-result');
    stopButton.onclick=()=>{cancel.requested=true;};
    button.onclick=async()=>{
      if(busy)return;
      const video=document.getElementById('joVisionPlayer'),file=document.getElementById('joVisionFile')?.files?.[0],id=document.getElementById('joVisionEx')?.value;
      const name=w.JOFIT_DATA?.exname(id)||id;
      if(!video||!file||!id) { output.textContent='Kies eerst een video en oefening in Vision.'; return; }
      if(!supported(name)){output.textContent='Momenteel alleen squats, lunges en biceps curls. Voor deze oefening geven we liever geen onbetrouwbare telling.';return;}
      cancel={requested:false};busy=true;button.disabled=true;stopButton.disabled=false;
      try {
        output.textContent='Bewegingsmodel laden... De video blijft lokaal.';
        const report=await analyze({video,exerciseId:id,exerciseName:name,cancellation:cancel,onProgress:percent=>{output.textContent='Video analyseren: '+percent+'%';}});
        const ratio=Math.round(report.coverage*100);
        const el=document.createElement('div');
        el.innerHTML=`<h4>${report.status==='ok'?'Voorzichtige meetuitslag':'Geen betrouwbare telling'}</h4><div class="jofu-stats">
          <div><span>Herhalingen</span><b>${report.reps??'—'}</b></div><div><span>Beeldkwaliteit</span><b>${ratio}%</b></div>
          <div><span>Beweging (2D)</span><b>${report.range??'—'}°</b></div><div><span>Herkenbare frames</span><b>${report.validFrames}/${report.totalFrames}</b></div></div><p>${w.JOFIT_DATA.esc(report.reason)}</p>`;
        const manual=section.querySelector('#jofu-manual-reps').value;
        if(manual!==''){
          const comparison=core().compare(report,Number(manual));
          const c=document.createElement('p');
          c.textContent=comparison?.difference===null?'Geen vergelijking mogelijk: meting onvoldoende betrouwbaar.':
            `Handmatig: ${comparison.manualReps} · JO FIT: ${comparison.estimatedReps} · Verschil: ${comparison.difference}. ${comparison.withinOne?'Binnen testtolerantie (max. 1 herhaling).':'Opnieuw testen met betere camerahoek.'}`;
          el.append(c);
        }
        output.replaceChildren(el);
        if(w.JOFIT_DATA && report.status==='ok'){
          try{
            const k='jofit_vision_ai_'+w.JOFIT_DATA.active();
            const previous=JSON.parse(localStorage.getItem(k)||'[]');
            previous.unshift({date:w.JOFIT_DATA.date(),exerciseId:id,reps:report.reps,range:report.range,coverage:report.coverage});
            localStorage.setItem(k,JSON.stringify(previous.slice(0,20)));
          }catch(e){console.warn('Resultaat niet opgeslagen:',e);}
        }
      }catch(error){output.textContent='Analyse niet voltooid: '+error.message;}
      finally{busy=false;button.disabled=false;stopButton.disabled=true;}
    };
  }
  w.JOFIT_VISION={render,analyze,loadModel,stop:()=>{cancel.requested=true;},supported};
})(window);
