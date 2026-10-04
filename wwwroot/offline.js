'use strict';

// Serves the same shapes as the /api/* endpoints, but from the built-in content bank (js/content/*.js).
// FIRST option of each bank item is correct; options are shuffled here.
const Offline = (() => {
  const shuffle = a => {
    a = [...a];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2'];

  function mc(item, extra = {}) {
    const options = shuffle(item.o);
    return { question: item.q, options, answerIndex: options.indexOf(item.o[0]), explanation_ar: item.e || '', ...extra };
  }

  // Nearest levels first, so we still return something if a level has no content.
  const byDistance = level => [...LEVEL_ORDER].sort((a, b) =>
    Math.abs(LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(level)) - Math.abs(LEVEL_ORDER.indexOf(b) - LEVEL_ORDER.indexOf(level)));

  const base = lvl => lvl.replace('+', '');

  function placement({ lang, level, asked = [] }) {
    const bank = BANK[lang].placement;
    const order = byDistance(base(level)).filter(l => bank[l]);
    for (const l of order) {
      const fresh = bank[l].filter(x => !asked.includes(x.q));
      if (fresh.length) return mc(pickOne(fresh));
    }
    return mc(pickOne(bank[order[0]]));
  }

  function story({ lang, level, seen = [] }) {
    const bank = BANK[lang].stories;
    const l = byDistance(base(level)).find(x => bank[x]);
    const unseen = bank[l].filter(s => !seen.includes(s.id));
    const s = pickOne(unseen.length ? unseen : bank[l]);
    return {
      id: s.id, title: s.t, text: s.x, translation_ar: s.ar,
      vocab: s.v.map(([word, meaning_ar]) => ({ word, meaning_ar })),
      questions: s.qs.map(q => mc(q)),
    };
  }

  function civics({ count = 5, topic = 'mixed' }) {
    const pool = BANK.civics.filter(q => topic === 'mixed' || q.t === topic);
    const items = shuffle(pool.length ? pool : BANK.civics).slice(0, Math.min(count, 8));
    return { questions: items.map(q => mc(q, { topic: TOPIC_AR[q.t] || '' })) };
  }
  const TOPIC_AR = { history: 'تاريخ', geography: 'جغرافيا', government: 'الدولة والمؤسسات', culture: 'ثقافة', traditions: 'أعياد وتقاليد' };

  function writing({ lang, level }) {
    const bank = BANK[lang].writing;
    const l = byDistance(base(level)).find(x => bank[x]);
    const w = pickOne(bank[l]);
    return { prompt_ar: w.p, model: w.m };
  }

  // Dictionary built from the story vocab, with accent-insensitive and stem-tolerant lookup.
  const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/ς/g, 'σ');
  const dicts = {};
  function dict(lang) {
    if (dicts[lang]) return dicts[lang];
    const m = new Map();
    for (const lvl of Object.values(BANK[lang].stories))
      for (const s of lvl) for (const [w, a] of s.v) m.set(norm(w), { w, a });
    return (dicts[lang] = m);
  }
  const related = (a, b) => {
    const n = Math.min(a.length, b.length);
    if (n < 4) return false;
    let i = 0;
    while (i < n && a[i] === b[i]) i++;
    return i >= 4 && i >= n - 2;
  };

  function explain({ lang, word }) {
    const d = dict(lang), n = norm(word);
    let hit = d.get(n), exact = !!hit;
    if (!hit) for (const [k, v] of d) if (related(k, n)) { hit = v; break; }
    const link = `https://translate.google.com/?sl=${lang}&tl=ar&text=${encodeURIComponent(word)}&op=translate`;
    if (!hit) return { unknown: true, lemma: word, pos: '', meaning_ar: 'ما عندي شرح جاهز لهذه الكلمة. جرّب الترجمة بالضغط على الرابط.', note_ar: '', example: '', example_ar: '', link };
    return { lemma: hit.w, pos: '', meaning_ar: hit.a, note_ar: exact ? '' : 'قد تكون صيغة أخرى من الكلمة (تصريف).', example: '', example_ar: '', link };
  }

  return { placement, story, civics, writing, explain };
})();
