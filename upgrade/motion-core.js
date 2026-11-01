/* JO FIT Vision motion math. Pure functions allow repeatable tests without video uploads. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.JOFIT_MOTION = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  function angle(a, b, c, width, height) {
    const pts = [a, b, c];
    if (pts.some(p => !p || !finite(p.x) || !finite(p.y) || (p.visibility ?? 1) < .55 || (p.presence ?? 1) < .5)) return null;
    const u = [(a.x - b.x) * width, (a.y - b.y) * height];
    const v = [(c.x - b.x) * width, (c.y - b.y) * height];
    const size = Math.hypot(...u) * Math.hypot(...v);
    return size < .001 ? null : Math.acos(clamp((u[0] * v[0] + u[1] * v[1]) / size, -1, 1)) * 180 / Math.PI;
  }
  function type(exerciseName) {
    if (/squat|kniebuig|kniebuig|kniebuigingen|lunge|uitval/i.test(exerciseName || '')) return 'knee';
    if (/curl|bicep|biceps/i.test(exerciseName || '')) return 'elbow';
    return null; // No false claims for presses, pull-ups, flyes or other unvalidated movements.
  }
  function joint(landmarks, ex, width, height) {
    if (!landmarks || !Array.isArray(landmarks) || !width || !height) return null;
    const which = type(ex);
    if (!which) return null;
    const sides = which === 'knee' ? [[23, 25, 27], [24, 26, 28]] : [[11, 13, 15], [12, 14, 16]];
    const candidates = sides.map(points => {
      const pts = points.map(i => landmarks[i]);
      const a = angle(pts[0], pts[1], pts[2], width, height);
      const score = pts.reduce((sum, p) => sum + (p?.visibility ?? 0), 0) / 3;
      return { a, score };
    }).filter(x => x.a !== null);
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0]?.a ?? null;
  }
  function quantile(sorted, q) {
    if (!sorted.length) return null;
    const n = (sorted.length - 1) * q, low = Math.floor(n), f = n - low;
    return sorted[low] * (1 - f) + sorted[Math.ceil(n)] * f;
  }
  function analyze(samples) {
    const input = Array.isArray(samples) ? samples : [];
    const sorted = input.filter(x => finite(x?.t) && x.t >= 0).sort((a, b) => a.t - b.t);
    const total = sorted.length;
    const valid = sorted.filter(x => finite(x.a) && x.a >= 0 && x.a <= 180);
    const coverage = total ? valid.length / total : 0;
    const values = valid.map(x => x.a).sort((a, b) => a - b);
    const lower = quantile(values, .1), upper = quantile(values, .9);
    const range = lower === null ? null : Math.round(upper - lower);
    const duration = total > 1 ? sorted.at(-1).t - sorted[0].t : 0;
    if (total < 12 || valid.length < 10 || duration < 2.5) {
      return { status: 'insufficient', reason: 'Te weinig bruikbare videobeelden.', reps: null, range, coverage, validFrames: valid.length, totalFrames: total, duration };
    }
    if (coverage < .7) {
      return { status: 'insufficient', reason: 'Te veel gewrichten zijn niet zichtbaar. Film het hele lichaam vanaf de zijkant.', reps: null, range, coverage, validFrames: valid.length, totalFrames: total, duration };
    }
    if (range === null || range < 30) {
      return { status: 'insufficient', reason: 'Te weinig duidelijke gewrichtsbeweging gemeten. Verander de camerahoek.', reps: null, range, coverage, validFrames: valid.length, totalFrames: total, duration };
    }
    // Median filter suppresses isolated landmark jitter while preserving rep peaks.
    const filtered = valid.map((x, i) => {
      const neighborhood = valid.slice(Math.max(0, i - 1), Math.min(valid.length, i + 2))
        .filter(y => Math.abs(y.t - x.t) <= .5).map(y => y.a).sort((a, b) => a - b);
      return { t: x.t, a: quantile(neighborhood, .5) };
    });
    const flex = lower + .37 * (upper - lower);
    const extend = lower + .70 * (upper - lower);
    let phase = 'unknown', reps = 0, last = -Infinity;
    for (const s of filtered) {
      if (phase === 'unknown' && s.a >= extend) phase = 'extended';
      else if (phase === 'extended' && s.a <= flex) phase = 'flexed';
      else if (phase === 'flexed' && s.a >= extend && s.t - last >= .55) {
        phase = 'extended'; reps += 1; last = s.t;
      }
    }
    const ok = reps >= 1 && coverage >= .8;
    return {
      status: ok ? 'ok' : 'uncertain',
      reason: ok ? 'Schatting, geen gevalideerde techniekbeoordeling.' : (reps === 0 ? 'Geen volledige herhaling betrouwbaar herkend.' : 'Onvoldoende zicht op gewrichten voor een betrouwbare telling.'),
      reps: ok ? reps : null, range, coverage, validFrames: valid.length, totalFrames: total, duration
    };
  }
  function compare(report, manual) {
    if (!Number.isInteger(manual) || manual < 0 || manual > 100) return null;
    const delta = report.reps === null ? null : Math.abs(report.reps - manual);
    return { manualReps: manual, estimatedReps: report.reps, difference: delta, withinOne: delta !== null && delta <= 1, acceptableCoverage: report.coverage >= .8 };
  }
  return { angle, type, joint, analyze, compare };
});
