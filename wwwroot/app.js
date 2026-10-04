'use strict';

// ---------- constants ----------
const LEVELS = { el: ['A1', 'A2', 'B1'], en: ['A1', 'A2', 'B1', 'B2'] };
const LANGS = {
  el: { name: 'اليونانية', tts: 'el-GR', flag: '🇬🇷', start: 0 },
  en: { name: 'الإنجليزية', tts: 'en-US', flag: '🇬🇧', start: 1 },
};
const TOPICS = ['daily life', 'family', 'food and shopping', 'health and the doctor', 'work', 'travel and transport',
  'the weather', 'housing', 'public services and offices', 'holidays and traditions', 'friends and hobbies'];
const BOX_DAYS = [0, 1, 3, 7, 14, 30]; // Leitner intervals by box (1..5)
const LS_KEY = 'lang-app-v1';

const $app = document.getElementById('app');

// ---------- state ----------
const defaults = () => ({
  examDate: '', passcode: '',
  level: { el: LANGS.el.start, en: LANGS.en.start },
  placed: { el: false, en: false },
  recent: { el: [], en: [] },
  streak: { count: 0, last: '' },
  cards: [], civics: [], sessions: 0,
  seen: { el: [], en: [] },
  seenListen: { el: [], en: [] }, listen: { el: [], en: [] },
  exams: { el: [], en: [] },
  seenLong: { el: [], en: [] }, reads: { el: [], en: [] },
});
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (s && typeof s === 'object') {
      const st = { ...defaults(), ...s };
      for (const l of Object.keys(LANGS)) st.level[l] = Math.max(0, Math.min(LEVELS[l].length - 1, st.level[l] | 0));
      return st;
    }
  } catch { /* storage unavailable or corrupt */ }
  return defaults();
}
let S = load();
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch { /* ignore */ } }

// ---------- helpers ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => new Date().toLocaleDateString('en-CA');
const parseDay = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const dayDiff = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 864e5);
const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d + n).toLocaleDateString('en-CA'); };
const pick = a => a[Math.floor(Math.random() * a.length)];
const maxLevel = lang => LEVELS[lang].length - 1;
const levelName = lang => LEVELS[lang][S.level[lang]];
const lvlHtml = l => `<bdi dir="ltr">${l}</bdi>`; // keeps "A2+" from flipping inside RTL text
const spinner = msg => `<div class="spinner">⏳ ${esc(msg)}</div>`;

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Render html into #app; handlers map data-act -> fn(element, event).
function view(html, handlers = {}) {
  $app.innerHTML = html;
  $app.onclick = e => {
    const el = e.target.closest('[data-act]');
    if (el && handlers[el.dataset.act]) handlers[el.dataset.act](el, e);
  };
  window.scrollTo(0, 0);
}
// Run a render function that resolves a promise when the user moves on.
const step = render => new Promise(resolve => render(resolve));

function speakLines(texts, lang, rate = 0.85) {
  if (!('speechSynthesis' in window)) return toast('المتصفح لا يدعم النطق');
  const voices = speechSynthesis.getVoices();
  const code = LANGS[lang].tts.slice(0, 2);
  if (voices.length && !voices.some(v => v.lang.toLowerCase().startsWith(code))) toast(`ما في صوت للغة ${LANGS[lang].name} على جهازك`);
  speechSynthesis.cancel();
  for (const t of texts) {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = LANGS[lang].tts; u.rate = rate;
    speechSynthesis.speak(u);
  }
}
const speak = (text, lang, rate) => speakLines([text], lang, rate);
// Voices load asynchronously: an empty list means "unknown", which we treat as available.
const hasVoice = lang => 'speechSynthesis' in window && (!speechSynthesis.getVoices().length ||
  speechSynthesis.getVoices().some(v => v.lang.toLowerCase().startsWith(LANGS[lang].tts.slice(0, 2))));

function touchStreak() {
  const t = today(), s = S.streak;
  if (s.last === t) return;
  s.count = s.last && dayDiff(s.last, t) <= 2 ? s.count + 1 : 1; // one rest day is allowed
  s.last = t;
}
const streakNow = () => (S.streak.last && dayDiff(S.streak.last, today()) <= 2 ? S.streak.count : 0);

// ---------- API ----------
// 'offline' = built-in content bank (no server needed); 'ai' = server has a Claude key.
let MODE = 'offline';
const ERRORS = {
  ai_unavailable: 'خدمة الذكاء الاصطناعي غير متاحة الآن، جرّب بعد قليل.',
  ai_bad_format: 'الذكاء الاصطناعي رجّع رد غير مفهوم، جرّب مرة ثانية.',
  ai_timeout: 'الرد تأخر كثير، جرّب مرة ثانية.',
};
async function api(task, body) {
  if (MODE === 'offline') return Offline[task](body);
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(`/api/${task}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-passcode': S.passcode },
        body: JSON.stringify(body),
      });
    } catch { throw new Error('ما في اتصال بالسيرفر.'); }
    if (res.status === 401 && attempt === 0) {
      const p = prompt('أدخل رمز الدخول');
      if (p === null) throw new Error('تم الإلغاء.');
      S.passcode = p; save();
      continue;
    }
    if (res.status === 429) throw new Error('طلبات كثيرة، استنى دقيقة وجرّب.');
    if (!res.ok) {
      let code = '';
      try { code = (await res.json()).error; } catch { /* no body */ }
      throw new Error(ERRORS[code] || (res.status === 401 ? 'رمز الدخول غير صحيح.' : `صار خطأ (${res.status}).`));
    }
    return res.json();
  }
}

// Shows an error with a retry button; resolves when the user retries.
const failScreen = (e, retry) => view(
  `<div class="card"><p>😕 ${esc(e.message)}</p><div class="row"><button class="primary" data-act="retry">إعادة المحاولة</button><a class="btn" href="#/">الرئيسية</a></div></div>`,
  { retry });

// ---------- quiz building block ----------
// Shows one multiple-choice question; resolves with true/false after the user taps "next".
function quizCard({ q, idx, total, label, above = '' }) {
  return step(done => {
    let correct = false;
    view(`
      <div class="progress"><i style="width:${(idx / total) * 100}%"></i></div>
      ${above}
      <div class="card">
        <div class="muted">${esc(label)} ${idx + 1}/${total}</div>
        <h2 class="ltr">${esc(q.question)}</h2>
        <div class="opts">${q.options.map((o, i) => `<button data-act="pick" data-i="${i}">${esc(o)}</button>`).join('')}</div>
        <div id="fb"></div>
      </div>`, {
      pick(btn) {
        const i = +btn.dataset.i, ok = i === q.answerIndex;
        correct = ok;
        const btns = $app.querySelectorAll('.opts button');
        btns.forEach((b, j) => { b.disabled = true; if (j === q.answerIndex) b.classList.add('ok'); });
        if (!ok) btn.classList.add('bad');
        document.getElementById('fb').innerHTML =
          `<div class="feedback ${ok ? 'ok' : 'bad'}">${ok ? '✅ صح!' : '❌ مو صح'}${q.explanation_ar ? ' — ' + esc(q.explanation_ar) : ''}</div>
           <button class="primary" data-act="next">التالي ←</button>`;
      },
      next: () => done(correct),
    });
  });
}

// ---------- spaced repetition ----------
const dueCards = lang => S.cards.filter(c => (!lang || c.lang === lang) && c.due <= today());
function addCard(lang, word, meaning) {
  word = word.trim();
  if (!word || S.cards.some(c => c.lang === lang && c.word.toLowerCase() === word.toLowerCase())) return false;
  S.cards.push({ id: Date.now() + Math.random(), lang, word, meaning, box: 1, due: addDays(today(), 1) });
  save();
  return true;
}
async function reviewCards(cards, title) {
  let known = 0;
  for (const [i, c] of cards.entries()) {
    const ok = await step(done => {
      view(`
        <div class="progress"><i style="width:${(i / cards.length) * 100}%"></i></div>
        <div class="card">
          <div class="muted">${esc(title)} ${i + 1}/${cards.length} · ${LANGS[c.lang].flag}</div>
          <div class="flash" style="font-size:${c.word.length > 28 ? 22 : 30}px">${esc(c.word)}</div>
          <div class="row" style="justify-content:center"><button data-act="say">🔊 انطق</button></div>
          <div id="ans" style="text-align:center;margin-top:16px"><button class="primary" data-act="show">اكشف المعنى</button></div>
        </div>`, {
        say: () => speak(c.word, c.lang),
        show() {
          document.getElementById('ans').innerHTML =
            `<p style="font-size:22px">${esc(c.meaning)}</p>
             <div class="row" style="justify-content:center"><button data-act="no">❌ ما عرفتها</button><button class="primary" data-act="yes">✅ عرفتها</button></div>`;
        },
        yes: () => done(true), no: () => done(false),
      });
    });
    c.box = ok ? Math.min(5, c.box + 1) : 1;
    c.due = addDays(today(), BOX_DAYS[c.box]);
    if (ok) known++;
    save();
  }
  return known;
}

// ---------- views ----------
function home() {
  const days = S.examDate ? dayDiff(today(), S.examDate) : null;
  const civ = S.civics.slice(-5);
  const civAvg = civ.length ? Math.round(civ.reduce((a, b) => a + b.pct, 0) / civ.length) : null;
  const langCard = lang => `
    <div class="card">
      <div class="row between"><h2>${LANGS[lang].flag} ${LANGS[lang].name}</h2><span class="pill">المستوى ${lvlHtml(levelName(lang))}</span></div>
      ${S.placed[lang] ? '' : `<p class="muted">ما حدّدنا مستواك بعد. 10 أسئلة وبنعرف من وين نبدأ.</p>`}
      <div class="row">
        <a class="btn ${S.placed[lang] ? 'primary' : ''}" href="#/session/${lang}">▶ جلسة اليوم</a>
        <a class="btn ${S.placed[lang] ? '' : 'primary'}" href="#/placement/${lang}">${S.placed[lang] ? 'أعد تحديد المستوى' : 'حدّد مستواي'}</a>
        ${LONG_LEVELS[lang].map(l => `<a class="btn" href="#/read/${lang}/${l.toLowerCase()}">📖 قراءة طويلة · ${l}</a>`).join('')}
      </div>
    </div>`;
  view(`
    <h1>أهلًا 👋</h1>
    <div class="stats">
      <div class="stat"><b>🔥 ${streakNow()}</b><span>أيام متواصلة</span></div>
      <div class="stat"><b>${days === null ? '—' : days < 0 ? '0' : days}</b><span>${days === null ? '<a href="#/settings">حدّد موعد الاختبار</a>' : 'يوم للاختبار'}</span></div>
      <div class="stat"><b>${dueCards().length}</b><span><a href="#/words">كلمات للمراجعة</a></span></div>
    </div>
    ${langCard('el')}
    ${langCard('en')}
    <div class="card">
      <h2>📝 امتحان تجريبي كامل</h2>
      <p class="muted">قراءة، قواعد، استماع، كتابة${S.exams.el.length ? ` · آخر نتيجة يونانية: ${S.exams.el[S.exams.el.length - 1].pct}%` : ''}.</p>
      <a class="btn primary" href="#/exam">افتح</a>
    </div>
    <div class="card">
      <h2>🎧 تمرين استماع</h2>
      <p class="muted">اسمع الجملة أو القصة بدون نص، واختر المعنى أو اكتب اللي سمعته.</p>
      <a class="btn primary" href="#/listen">ابدأ</a>
    </div>
    <div class="card">
      <h2>🎭 حوارات عملية</h2>
      <p class="muted">مقابلة عمل، شقة، راتب، دكتور، دائرة حكومية، طوارئ. اقرأ، واستمع، ثم تدرّب على دورك.</p>
      <a class="btn primary" href="#/dialogues">افتح</a>
    </div>
    <div class="card">
      <h2>🆘 جمل البقاء باليونانية</h2>
      <p class="muted">العقد، الراتب، البيت، الدكتور، الدوائر، الطوارئ: الجمل اللي بتحتاجها فعلًا.</p>
      <a class="btn primary" href="#/survive">افتح</a>
    </div>
    <div class="card">
      <h2>🏛️ اختبار الجنسية (تاريخ وثقافة)</h2>
      <p class="muted">${civAvg === null ? 'ما جرّبت بعد.' : `معدّل آخر ${civ.length} محاولات: ${civAvg}%`}</p>
      <a class="btn" href="#/civics">تدرّب على الأسئلة</a>
    </div>`);
}

async function placement(lang, live) {
  const total = 10, steps = [], asked = [];
  let stepIdx = LANGS[lang].start;
  for (let n = 0; n < total; n++) {
    let q;
    for (;;) {
      view(spinner('جاري تجهيز السؤال...'));
      try { q = await api('placement', { lang, level: LEVELS[lang][stepIdx], asked }); break; }
      catch (e) { await step(r => failScreen(e, r)); }
    }
    if (!live()) return;
    asked.push(q.question); steps.push(stepIdx);
    const ok = await quizCard({ q, idx: n, total, label: 'سؤال' });
    if (!live()) return;
    stepIdx = Math.max(0, Math.min(maxLevel(lang), stepIdx + (ok ? 1 : -1)));
  }
  const tail = [...steps.slice(2), stepIdx];
  S.level[lang] = Math.round(tail.reduce((a, b) => a + b, 0) / tail.length);
  S.placed[lang] = true; S.recent[lang] = [];
  save();
  view(`
    <div class="card" style="text-align:center">
      <h1>${LANGS[lang].flag} مستواك التقريبي: ${lvlHtml(levelName(lang))}</h1>
      <p class="muted">هذا تقدير بسيط، والتطبيق بيعدّل الصعوبة تلقائيًا مع تقدّمك.</p>
      <a class="btn primary" href="#/session/${lang}">ابدأ أول جلسة</a>
    </div>`);
}

function adapt(lang, pct) {
  const r = S.recent[lang];
  r.push(pct); if (r.length > 3) r.shift();
  const avg = r.reduce((a, b) => a + b, 0) / r.length;
  if (r.length >= 2 && avg >= 85 && S.level[lang] < maxLevel(lang)) { S.level[lang]++; r.length = 0; return 'up'; }
  if (r.length >= 2 && avg < 55 && S.level[lang] > 0) { S.level[lang]--; r.length = 0; return 'down'; }
  return '';
}

const wordRx = /[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu;
function clickableText(text) {
  let out = '', last = 0;
  for (const m of text.matchAll(wordRx)) {
    out += esc(text.slice(last, m.index)) + `<span class="w" data-act="word" data-w="${esc(m[0])}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

function storyScreen(lang, story) {
  let added = 0, popToken = 0, translation = false;
  const vocabHtml = story.vocab.map((v, i) => `
    <div><span class="ltr"><b>${esc(v.word)}</b> — ${esc(v.meaning_ar)}</span>
    <button data-act="addv" data-i="${i}">＋ مراجعة</button></div>`).join('');
  return step(done => view(`
    <div class="card">
      <div class="row between"><h2 class="ltr">${esc(story.title)}</h2><span class="pill">${lvlHtml(levelName(lang))}</span></div>
      <div class="row"><button data-act="say">🔊 استمع</button><button data-act="tr">ترجمة</button></div>
      <p class="story ltr">${clickableText(story.text)}</p>
      <p class="muted">💡 اضغط على أي كلمة لشرحها.</p>
      <div id="tr" class="feedback" hidden>${esc(story.translation_ar || '')}</div>
    </div>
    <div class="card"><h2>كلمات القصة</h2><div class="vocab">${vocabHtml}</div></div>
    <div id="pop"></div>
    <button class="primary big" data-act="go">ابدأ الأسئلة ←</button>`, {
    say: () => speak(story.text, lang),
    tr() { translation = !translation; document.getElementById('tr').hidden = !translation; },
    addv(btn) {
      const v = story.vocab[+btn.dataset.i];
      if (addCard(lang, v.word, v.meaning_ar)) added++;
      btn.textContent = '✓'; btn.disabled = true;
    },
    async word(el) {
      const word = el.dataset.w, token = ++popToken, pop = document.getElementById('pop');
      pop.innerHTML = `<div class="card pop">${spinner('...')}</div>`;
      const context = story.text.split(/(?<=[.!?;])\s+/).find(s => s.includes(word)) || '';
      try {
        const r = await api('explain', { lang, word, context });
        if (token !== popToken) return;
        pop.innerHTML = `<div class="card pop">
          <div class="row between"><b class="ltr">${esc(r.lemma || word)}</b><span class="muted">${esc(r.pos || '')}</span></div>
          <p>${esc(r.meaning_ar)}</p>
          ${r.note_ar ? `<p class="muted">${esc(r.note_ar)}</p>` : ''}
          ${r.example ? `<p class="ltr">${esc(r.example)}<br><span class="muted">${esc(r.example_ar || '')}</span></p>` : ''}
          <div class="row">${r.unknown ? '' : '<button data-act="padd">＋ أضف للمراجعة</button>'}<button data-act="psay">🔊</button><button data-act="pclose">إغلاق</button>${r.link ? `<a class="btn" href="${esc(r.link)}" target="_blank" rel="noopener">ترجمة جوجل ↗</a>` : ''}</div></div>`;
        popData = { lemma: r.lemma || word, meaning: r.meaning_ar };
      } catch (e) { if (token === popToken) pop.innerHTML = `<div class="card pop">${esc(e.message)}</div>`; }
    },
    padd() { if (addCard(lang, popData.lemma, popData.meaning)) { added++; toast('انضافت للمراجعة'); } else toast('موجودة من قبل'); },
    psay: () => speak(popData.lemma, lang),
    pclose() { popToken++; document.getElementById('pop').innerHTML = ''; },
    go: () => done(added),
  }));
}
let popData = { lemma: '', meaning: '' };

async function offlineWritingStep(lang) {
  const w = await api('writing', { lang, level: levelName(lang) });
  return step(done => view(`
    <div class="card">
      <h2>✍️ تمرين كتابة</h2>
      <p>${esc(w.prompt_ar)} <span class="muted">(بال${LANGS[lang].name})</span></p>
      <textarea class="ltr" id="txt" maxlength="1000" lang="${lang}"></textarea>
      <div class="row" style="margin-top:10px"><button class="primary" data-act="cmp">قارن مع جواب نموذجي</button><button data-act="skip">تخطّي</button></div>
      <div id="out"></div>
    </div>`, {
    skip: () => done(null),
    cmp() {
      if (!document.getElementById('txt').value.trim()) return toast('اكتب شيئًا أولًا');
      document.getElementById('out').innerHTML = `
        <div class="feedback ok ltr"><b>${esc(w.model)}</b></div>
        <p class="muted">قارن كتابتك بالنموذج: هل الأفعال والأزمنة صحيحة؟ هل ترتيب الكلمات مشابه؟ هل في كلمة تعلّمتها وتقدر تستخدمها؟</p>
        <div class="row"><button data-act="say">🔊 استمع</button><button class="primary" data-act="fin">متابعة ←</button></div>`;
    },
    say: () => speak(w.model, lang),
    fin: () => done(w),
  }));
}

async function writingStep(lang, story) {
  if (MODE === 'offline') return offlineWritingStep(lang);
  const prompt = `اكتب 2-3 جمل عن القصة أو عن يومك (بال${LANGS[lang].name})`;
  const result = await step(done => { let last = null; view(`
    <div class="card">
      <h2>✍️ تمرين كتابة</h2>
      <p class="muted">${esc(prompt)}</p>
      <textarea class="ltr" id="txt" maxlength="1000" lang="${lang}"></textarea>
      <div class="row" style="margin-top:10px"><button class="primary" data-act="chk">صحّح لي</button><button data-act="skip">تخطّي</button></div>
      <div id="out"></div>
    </div>`, {
    skip: () => done(null),
    fin: () => done(last),
    async chk(btn) {
      const text = document.getElementById('txt').value.trim();
      if (!text) return toast('اكتب شيئًا أولًا');
      btn.disabled = true;
      const out = document.getElementById('out');
      out.innerHTML = spinner('جاري التصحيح...');
      try {
        const r = await api('check', { lang, level: levelName(lang), text, prompt });
        out.innerHTML = `
          <div class="feedback ok ltr"><b>${esc(r.corrected)}</b></div>
          ${(r.mistakes || []).map(m => `<div class="feedback bad"><span class="ltr">${esc(m.wrong)} → <b>${esc(m.right)}</b></span><br>${esc(m.explanation_ar)}</div>`).join('')}
          ${r.tip_ar ? `<p class="muted">💡 ${esc(r.tip_ar)}</p>` : ''}
          <button class="primary" data-act="fin">متابعة ←</button>`;
        last = r;
      } catch (e) { out.innerHTML = `<p>${esc(e.message)}</p>`; btn.disabled = false; }
    },
  }); });
  return result;
}

async function session(lang, live) {
  if (!S.placed[lang] && !confirm('ما حدّدت مستواك بعد. تبي تبدأ من المستوى الافتراضي؟')) { location.hash = `#/placement/${lang}`; return; }

  const due = dueCards(lang).slice(0, 8);
  if (due.length) {
    const known = await reviewCards(due, 'مراجعة كلمات');
    if (!live()) return;
    toast(`راجعت ${due.length} كلمات، عرفت ${known}`);
  }

  const weak = S.cards.filter(c => c.lang === lang && c.box <= 2).slice(0, 6).map(c => c.word);
  let story;
  for (;;) {
    view(spinner('جاري كتابة قصة بمستواك...'));
    try { story = await api('story', { lang, level: levelName(lang), topic: pick(TOPICS), words: weak, seen: S.seen[lang] }); break; }
    catch (e) { await step(r => failScreen(e, r)); }
    if (!live()) return;
  }
  if (!live()) return;

  if (story.id) { S.seen[lang] = [...S.seen[lang].filter(id => id !== story.id), story.id].slice(-40); save(); }
  const added = await storyScreen(lang, story);
  if (!live()) return;

  let correct = 0;
  for (const [i, q] of story.questions.entries()) {
    if (await quizCard({ q, idx: i, total: story.questions.length, label: 'سؤال' })) correct++;
    if (!live()) return;
  }

  await writingStep(lang, story);
  if (!live()) return;

  const pct = Math.round((correct / story.questions.length) * 100);
  const before = levelName(lang);
  const change = adapt(lang, pct);
  S.sessions++; touchStreak(); save();
  const note = change === 'up' ? `🚀 ارتفع مستواك من ${lvlHtml(before)} إلى ${lvlHtml(levelName(lang))}!`
    : change === 'down' ? `🌱 خفّفنا الصعوبة لـ ${lvlHtml(levelName(lang))} عشان تثبّت الأساس، وبترجع تطلع.`
    : `المستوى الحالي: ${lvlHtml(levelName(lang))}`;
  view(`
    <div class="card" style="text-align:center">
      <h1>🎉 خلصت جلسة اليوم</h1>
      <p style="font-size:28px;margin:4px 0">${correct}/${story.questions.length} (${pct}%)</p>
      <p>${note}</p>
      <p class="muted">🔥 ${streakNow()} أيام متواصلة${added ? ` · أضفت ${added} كلمات للمراجعة` : ''}</p>
      <div class="row" style="justify-content:center"><a class="btn primary" href="#/">الرئيسية</a><a class="btn" href="#/session/${lang}" onclick="setTimeout(route,0)">جلسة أخرى</a></div>
    </div>`);
}

async function civics(live) {
  const params = await step(done => view(`
    <h1>🏛️ تدرّب على اختبار الجنسية</h1>
    <div class="card">
      <div class="warn">هذه أسئلة تدريب لتتعوّد على الأسلوب، وليست بنك الأسئلة الرسمي. اعتمد دائمًا على مادة الدراسة الرسمية، وتأكد من أي معلومة بتشك فيها.</div>
      <label for="topic">الموضوع</label>
      <select id="topic">
        <option value="mixed">منوّع</option><option value="history">التاريخ</option><option value="geography">الجغرافيا</option>
        <option value="government">الدولة والمؤسسات</option><option value="culture">الثقافة</option><option value="traditions">الأعياد والتقاليد</option>
      </select>
      <label for="count">عدد الأسئلة</label>
      <select id="count"><option>5</option><option>8</option><option>3</option></select>
      <p><button class="primary" data-act="start">ابدأ</button></p>
    </div>`, {
    start: () => done({ topic: document.getElementById('topic').value, count: +document.getElementById('count').value }),
  }));
  let data;
  for (;;) {
    view(spinner('جاري تجهيز الأسئلة...'));
    try { data = await api('civics', params); break; }
    catch (e) { await step(r => failScreen(e, r)); }
    if (!live()) return;
  }
  if (!live()) return;
  let correct = 0;
  for (const [i, q] of data.questions.entries()) {
    if (await quizCard({ q, idx: i, total: data.questions.length, label: q.topic || 'سؤال' })) correct++;
    if (!live()) return;
  }
  const pct = Math.round((correct / data.questions.length) * 100);
  S.civics.push({ date: today(), pct }); S.civics = S.civics.slice(-30);
  touchStreak(); save();
  view(`<div class="card" style="text-align:center"><h1>النتيجة: ${correct}/${data.questions.length} (${pct}%)</h1>
    <div class="row" style="justify-content:center"><a class="btn primary" href="#/">الرئيسية</a><a class="btn" href="#/civics" onclick="setTimeout(route,0)">محاولة أخرى</a></div></div>`);
}

async function words(live) {
  const draw = () => {
    const due = dueCards();
    view(`
      <h1>📝 الكلمات</h1>
      <div class="card">
        <p>${S.cards.length} كلمة محفوظة · <b>${due.length}</b> جاهزة للمراجعة الآن</p>
        <button class="primary" data-act="rev" ${due.length ? '' : 'disabled'}>ابدأ المراجعة</button>
        <p class="muted">أضف كلمات من القصص بالضغط عليها. كل ما عرفتها صح، بتظهر لك بعد فترة أطول.</p>
      </div>
      ${S.cards.length ? `<div class="card vocab">${S.cards.map(c => `
        <div><span class="ltr">${LANGS[c.lang].flag} <b>${esc(c.word)}</b> — ${esc(c.meaning)}</span>
        <button data-act="del" data-id="${c.id}" aria-label="حذف">🗑️</button></div>`).join('')}</div>` : ''}`, {
      async rev() {
        const known = await reviewCards(due.slice(0, 15), 'مراجعة');
        if (!live()) return;
        touchStreak(); save();
        toast(`عرفت ${known} كلمات`); draw();
      },
      del(b) { S.cards = S.cards.filter(c => String(c.id) !== b.dataset.id); save(); draw(); },
    });
  };
  draw();
}

// ---------- long reading ----------
const LONG_LEVELS = { el: ['B1', 'B2'], en: ['B1', 'B2'] };  // Greek B2 is optional stretch reading (adaptive scale stops at B1)
async function readLong(lang, level, live) {
  const story = Offline.story({ lang, level, seen: S.seenLong[lang], long: true });
  S.seenLong[lang] = [...S.seenLong[lang].filter(id => id !== story.id), story.id].slice(-40);
  save();
  const words = story.text.split(/\s+/).length;
  await step(done => view(`
    <div class="card"><h1>📖 قراءة طويلة · ${esc(level)}</h1>
      <p class="muted">${LANGS[lang].flag} نص من حوالي ${words} كلمة. اقرأه براحتك، وبعدها 4 أسئلة. اضغط على أي كلمة صعبة لشرحها.</p>
      <button class="primary big" data-act="go">ابدأ القراءة ←</button></div>`, { go: () => done() }));
  if (!live()) return;
  await storyScreen(lang, story);
  if (!live()) return;
  let correct = 0;
  for (const [i, q] of story.questions.entries()) {
    const above = `<div class="card"><h2 class="ltr">${esc(story.title)}</h2><p class="story ltr" style="font-size:17px;line-height:1.9">${esc(story.text)}</p></div>`;
    if (await quizCard({ q, idx: i, total: story.questions.length, label: 'فهم المقروء', above })) correct++;
    if (!live()) return;
  }
  const pct = Math.round((correct / story.questions.length) * 100);
  (S.reads[lang] = S.reads[lang] || []).push(pct); S.reads[lang] = S.reads[lang].slice(-20);
  touchStreak(); save();
  view(`
    <div class="card" style="text-align:center">
      <h1>📖 خلصت القراءة</h1>
      <p style="font-size:28px;margin:4px 0">${correct}/${story.questions.length} (${pct}%)</p>
      <p class="muted">${pct >= 75 ? 'ممتاز! فهمت النص الطويل.' : 'أعد قراءة النص ببطء، وركّز على الكلمات المفتاحية قبل أن تجيب.'}</p>
      <div class="feedback">${esc(story.translation_ar)}</div>
      <div class="row" style="justify-content:center"><a class="btn primary" href="#/read/${lang}/${level.toLowerCase()}" onclick="setTimeout(route,0)">نص آخر</a><a class="btn" href="#/">الرئيسية</a></div>
    </div>`);
}

// ---------- mock exam ----------
// Fixed difficulty (B1), content from the built-in bank. Writing is self-assessed and not part of the score.
const EXAM = {
  el: { reading: 'B1', grammar: ['A2', 'A2', 'A2', 'A2', 'B1', 'B1', 'B1', 'B1'], writing: 'B1', civics: 8 },
  en: { reading: 'B1', grammar: ['A2', 'A2', 'B1', 'B1', 'B1', 'B1', 'B2', 'B2'], writing: 'B1', civics: 0 },
};
const SECTION_ADVICE = {
  reading: ['القراءة', l => `#/session/${l}`, 'اقرأ المزيد من القصص في «جلسة اليوم»'],
  grammar: ['القواعد والمفردات', l => `#/session/${l}`, 'كرّر جلسات اليوم وراجع كلماتك'],
  listening: ['الاستماع', l => `#/listen/${l}/a`, 'تدرّب على تمارين الاستماع'],
  civics: ['الثقافة والتاريخ', () => '#/civics', 'تدرّب على أسئلة الجنسية'],
};

function examMenu() {
  const card = l => {
    const h = S.exams[l], last = h[h.length - 1];
    return `<div class="card">
      <h2>${LANGS[l].flag} ${LANGS[l].name} <span class="pill">B1</span></h2>
      <p class="muted">${l === 'el' ? 'قراءة، قواعد ومفردات، استماع، كتابة، وثقافة وتاريخ (٢٥ سؤالًا).' : 'قراءة، قواعد ومفردات، استماع، وكتابة (١٧ سؤالًا).'} حوالي ${l === 'el' ? 25 : 18} دقيقة.</p>
      ${last ? `<p>آخر نتيجة: <b>${last.pct}%</b> (${esc(last.date)})${h.length > 1 ? ` · المحاولات: ${h.map(x => x.pct + '%').join(' ← ')}` : ''}</p>` : ''}
      <a class="btn primary" href="#/exam/${l}">${last ? 'امتحان جديد' : 'ابدأ الامتحان'}</a>
    </div>`;
  };
  view(`<h1>📝 امتحان تجريبي</h1>
    <p class="muted">الامتحان بمستوى B1 ثابت (مو تكيّفي)، حتى تقيس وضعك الحالي. لا تستخدم قاموسًا. بالنهاية بيطلع لك تقرير بنقاط ضعفك.</p>
    <div class="warn">النتيجة تقدير من التطبيق وليست نتيجة رسمية، وشكل الامتحان الحقيقي وشروط النجاح ممكن تختلف. راجع الجهة المختصة.</div><br>
    ${Object.keys(LANGS).map(card).join('')}`);
}

async function exam(lang, live) {
  const cfg = EXAM[lang];
  const withListening = hasVoice(lang);
  const parts = ['reading', 'grammar', ...(withListening ? ['listening'] : []), ...(cfg.civics ? ['civics'] : [])];
  await step(done => view(`
    <div class="card">
      <h1>${LANGS[lang].flag} امتحان تجريبي</h1>
      <p>الأقسام: ${parts.map(p => SECTION_ADVICE[p][0]).join('، ')}، ثم الكتابة (تقييم ذاتي).</p>
      ${withListening ? '' : '<div class="warn">ما لقيت صوتًا لهذه اللغة، فبنتخطى الاستماع.</div><br>'}
      <ul><li>جاوب بهدوء، وما في وقت قاتل.</li><li>لا تستخدم قاموسًا.</li><li>بالنهاية بتشوف أخطاءك مع الجواب الصحيح.</li></ul>
      <button class="primary big" data-act="go">ابدأ ←</button>
    </div>`, { go: () => done() }));
  if (!live()) return;

  const started = Date.now();
  const score = {}, mistakes = [];
  const record = (section, q, ok) => {
    score[section] = score[section] || { right: 0, total: 0 };
    score[section].total++;
    if (ok) score[section].right++;
    else mistakes.push({ section, q: q.question, correct: q.options[q.answerIndex], e: q.explanation_ar || '', heard: q.heard });
  };

  // reading
  const story = Offline.story({ lang, level: cfg.reading, seen: [] });
  for (const [i, q] of story.questions.entries()) {
    const above = `<div class="card"><h2 class="ltr">${esc(story.title)}</h2><p class="story ltr">${esc(story.text)}</p></div>`;
    record('reading', q, await quizCard({ q, idx: i, total: story.questions.length, label: 'قراءة', above }));
    if (!live()) return;
  }

  // grammar and vocabulary
  const asked = [];
  for (const [i, level] of cfg.grammar.entries()) {
    const q = Offline.placement({ lang, level, asked });
    asked.push(q.question);
    record('grammar', q, await quizCard({ q, idx: i, total: cfg.grammar.length, label: 'قواعد ومفردات' }));
    if (!live()) return;
  }

  // listening
  if (withListening) {
    const pool = listenPool(lang), meanings = [...new Set(pool.map(x => x.a))];
    const items = sample(pool, 5);
    for (const [i, item] of items.entries()) {
      const options = sample([item.a, ...sample(meanings.filter(a => a !== item.a), 3)], 4);
      const ok = await listenChoice({ lang, item, options, idx: i, total: items.length });
      record('listening', { question: item.t, options: [item.a], answerIndex: 0 }, ok);
      if (!live()) return;
    }
    stopSpeech();
  }

  // civics (Greek only)
  if (cfg.civics) {
    const { questions } = Offline.civics({ count: cfg.civics, topic: 'mixed' });
    for (const [i, q] of questions.entries()) {
      record('civics', q, await quizCard({ q, idx: i, total: questions.length, label: 'ثقافة وتاريخ' }));
      if (!live()) return;
    }
  }

  // writing: self-assessed against a model answer
  const w = Offline.writing({ lang, level: cfg.writing });
  const selfScore = await step(done => view(`
    <div class="card">
      <h2>✍️ الكتابة</h2>
      <p>${esc(w.prompt_ar)} <span class="muted">(بال${LANGS[lang].name})</span></p>
      <textarea class="ltr" id="txt" maxlength="1000" lang="${lang}"></textarea>
      <p><button class="primary" data-act="cmp">قارن مع جواب نموذجي</button> <button data-act="skip">تخطّي</button></p>
      <div id="out"></div>
    </div>`, {
    skip: () => done(null),
    cmp() {
      if (!document.getElementById('txt').value.trim()) return toast('اكتب شيئًا أولًا');
      document.getElementById('out').innerHTML = `
        <div class="feedback ok ltr"><b>${esc(w.model)}</b></div>
        <p>كيف تقيّم كتابتك مقارنة بالنموذج؟</p>
        <div class="row"><button data-act="r" data-v="30">قريبة قليلًا</button><button data-act="r" data-v="65">مقبولة</button><button data-act="r" data-v="100">قريبة جدًا</button></div>`;
    },
    r: b => done(+b.dataset.v),
  }));
  if (!live()) return;

  // report
  const sections = Object.entries(score).map(([k, v]) => ({ key: k, ...v, pct: Math.round((v.right / v.total) * 100) }));
  const right = sections.reduce((a, x) => a + x.right, 0), total = sections.reduce((a, x) => a + x.total, 0);
  const pct = Math.round((right / total) * 100);
  const prev = S.exams[lang][S.exams[lang].length - 1];
  const minutes = Math.max(1, Math.round((Date.now() - started) / 60000));
  S.exams[lang].push({ date: today(), pct, sections: Object.fromEntries(sections.map(x => [x.key, x.pct])), writing: selfScore });
  S.exams[lang] = S.exams[lang].slice(-20);
  touchStreak(); save();
  const weakest = [...sections].sort((a, b) => a.pct - b.pct)[0];
  const verdict = pct >= 80 ? '🌟 ممتاز! مستواك قوي.' : pct >= 60 ? '👍 جيد وقريب. ركّز على القسم الأضعف.' : '🌱 تحتاج مزيدًا من التدريب، وهذا طبيعي. كرّر الجلسات اليومية.';
  const [wName, wLink, wTip] = SECTION_ADVICE[weakest.key];
  view(`
    <div class="card" style="text-align:center">
      <h1>${LANGS[lang].flag} نتيجة الامتحان التجريبي</h1>
      <p style="font-size:34px;margin:0">${pct}%</p>
      <p class="muted">${right}/${total} · ${minutes} دقيقة${prev ? ` · المرة السابقة ${prev.pct}% (${pct >= prev.pct ? '▲' : '▼'} ${Math.abs(pct - prev.pct)})` : ''}</p>
      <p>${verdict}</p>
    </div>
    <div class="card">
      <h2>نتائج الأقسام</h2>
      ${sections.map(x => `<div class="row between"><span>${SECTION_ADVICE[x.key][0]}</span><b>${x.right}/${x.total} (${x.pct}%)</b></div><div class="progress"><i style="width:${x.pct}%"></i></div>`).join('')}
      ${selfScore !== null ? `<div class="row between"><span>الكتابة (تقييم ذاتي)</span><b>${selfScore}%</b></div><div class="progress"><i style="width:${selfScore}%"></i></div>` : ''}
      <p class="muted">${weakest.pct === 100 ? 'كل الأقسام ممتازة. كرّر الامتحان بعد أسبوعين وراقب ثباتك.' : `القسم الأضعف: <b>${wName}</b>. <a href="${wLink(lang)}">${wTip} ←</a>`}</p>
    </div>
    ${mistakes.length ? `<div class="card"><h2>أخطاؤك (${mistakes.length})</h2>${mistakes.slice(0, 12).map(m => `
      <div class="feedback bad"><div class="ltr">${esc(m.q)}</div><div class="ltr">✔ <b>${esc(m.correct)}</b></div>${m.e ? `<div>${esc(m.e)}</div>` : ''}</div>`).join('')}</div>` : ''}
    <div class="row"><a class="btn primary" href="#/exam/${lang}" onclick="setTimeout(route,0)">امتحان جديد</a><a class="btn" href="#/">الرئيسية</a></div>
    <p class="muted">هذه نتيجة تقديرية من التطبيق وليست نتيجة رسمية.</p>`);
}

// ---------- listening ----------
const normText = t => t.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/ς/g, 'σ')
  .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

const stopSpeech = () => { try { speechSynthesis.cancel(); } catch { /* unsupported */ } };

function listenPool(lang) {
  const pool = [];
  for (const d of BANK.dialogues[lang]) for (const l of d.lines) pool.push({ t: l.t, a: l.a });
  if (lang === 'el') for (const g of BANK.survive) for (const it of g.items) pool.push({ t: it.g, a: it.a });
  return [...new Map(pool.map(x => [x.t, x])).values()];
}
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

function listenMenu() {
  const row = l => `
    <div class="card">
      <h2>${LANGS[l].flag} ${LANGS[l].name}</h2>
      ${hasVoice(l) ? '' : `<div class="warn">ما لقيت صوتًا للغة ${LANGS[l].name} على جهازك. بدون صوت ما بيشتغل التمرين. على Windows: الإعدادات ← الوقت واللغة ← اللغة، أضف ${LANGS[l].name} ونزّل حزمة الكلام.</div><br>`}
      <div class="row">
        <a class="btn primary" href="#/listen/${l}/a">اسمع واختر المعنى</a>
        <a class="btn" href="#/listen/${l}/b">اسمع واكتب</a>
        <a class="btn" href="#/listen/${l}/c">قصة بدون نص</a>
      </div>
      <p><button data-act="test" data-l="${l}">🔊 جرّب الصوت</button></p>
    </div>`;
  view(`<h1>🎧 تمرين استماع</h1>
    <p class="muted">نصيحة: استخدم سماعات، واستمع أكثر من مرة قبل ما تجاوب. زر 🐢 بيبطّئ الصوت.</p>
    ${Object.keys(LANGS).map(row).join('')}`, {
    test: b => speak(b.dataset.l === 'el' ? 'Καλημέρα, τι κάνετε;' : 'Good morning, how are you?', b.dataset.l),
  });
}

// One "hear it, pick the meaning" question; resolves true/false.
function listenChoice({ lang, item, options, idx, total }) {
  return step(done => {
    let correct = false;
    view(`
      <div class="progress"><i style="width:${(idx / total) * 100}%"></i></div>
      <div class="card">
        <div class="muted">استماع ${idx + 1}/${total}</div>
        <div class="row" style="justify-content:center;margin:12px 0"><button class="primary big" data-act="play">▶ استمع</button><button data-act="slow">🐢 أبطأ</button></div>
        <p class="muted">شو معنى الجملة؟</p>
        <div class="opts">${options.map((o, i) => `<button data-act="pick" data-i="${i}" style="direction:rtl">${esc(o)}</button>`).join('')}</div>
        <div id="fb"></div>
      </div>`, {
      play: () => speak(item.t, lang),
      slow: () => speak(item.t, lang, 0.55),
      pick(btn) {
        const ok = options[+btn.dataset.i] === item.a;
        correct = ok;
        $app.querySelectorAll('.opts button').forEach(b => { b.disabled = true; if (options[+b.dataset.i] === item.a) b.classList.add('ok'); });
        if (!ok) btn.classList.add('bad');
        document.getElementById('fb').innerHTML =
          `<div class="feedback ${ok ? 'ok' : 'bad'}">${ok ? '✅ صح!' : '❌ مو صح'}<div class="ltr"><b>${esc(item.t)}</b></div></div>
           <button class="primary" data-act="next">التالي ←</button>`;
      },
      next: () => done(correct),
    });
    speak(item.t, lang);
  });
}

// One dictation: hear a phrase and type it. Accents/punctuation/case are ignored when checking.
function dictation({ lang, item, idx, total }) {
  return step(done => {
    let correct = false;
    view(`
      <div class="progress"><i style="width:${(idx / total) * 100}%"></i></div>
      <div class="card">
        <div class="muted">إملاء ${idx + 1}/${total}</div>
        <div class="row" style="justify-content:center;margin:12px 0"><button class="primary big" data-act="play">▶ استمع</button><button data-act="slow">🐢 أبطأ</button></div>
        <input type="text" id="ans" class="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" lang="${lang}" aria-label="اكتب ما سمعته">
        <p class="muted">اكتب اللي سمعته. التشكيل (علامات النبر) وعلامات الترقيم غير مهمة هون.</p>
        <div class="row"><button class="primary" data-act="chk">تحقّق</button><button data-act="skip">تخطّي</button></div>
        <div id="fb"></div>
      </div>`, {
      play: () => speak(item.t, lang),
      slow: () => speak(item.t, lang, 0.55),
      chk() {
        const typed = normText(document.getElementById('ans').value).split(' ').filter(Boolean);
        if (!typed.length) return toast('اكتب شيئًا أولًا');
        const words = item.t.split(/\s+/);
        const exp = words.map(w => normText(w)).filter(Boolean);
        correct = typed.join(' ') === exp.join(' ');
        const shown = words.map((w, i) => {
          const same = !normText(w) || normText(w) === (typed[i] || '');
          return `<span style="${same ? '' : 'color:var(--bad);font-weight:600;text-decoration:underline'}">${esc(w)}</span>`;
        }).join(' ');
        document.getElementById('fb').innerHTML =
          `<div class="feedback ${correct ? 'ok' : 'bad'}">${correct ? '✅ ممتاز!' : '❌ قارن:'}<div class="ltr" style="font-size:19px">${shown}</div><div>${esc(item.a)}</div></div>
           <button class="primary" data-act="next">التالي ←</button>`;
        document.querySelector('[data-act=chk]').disabled = true;
      },
      skip: () => done(false),
      next: () => done(correct),
    });
    speak(item.t, lang);
  });
}

async function listen(lang, mode, live) {
  const total = 8;
  let right = 0, count = 0, label = '';
  if (mode === 'c') {
    label = 'قصة بدون نص';
    const story = await api('story', { lang, level: levelName(lang), topic: '', words: [], seen: S.seenListen[lang] });
    if (!live()) return;
    if (story.id) { S.seenListen[lang] = [...S.seenListen[lang].filter(i => i !== story.id), story.id].slice(-40); save(); }
    await step(done => view(`
      <div class="card" style="text-align:center">
        <h2>🎧 استمع للقصة</h2>
        <p class="muted">النص مخفي. استمع أكثر من مرة إذا بدك، وبعدها جاوب على الأسئلة.</p>
        <div class="row" style="justify-content:center"><button class="primary big" data-act="play">▶ استمع</button><button data-act="slow">🐢 أبطأ</button></div>
        <p><button class="primary" data-act="go">جاهز للأسئلة ←</button></p>
      </div>`, {
      play: () => speak(story.text, lang), slow: () => speak(story.text, lang, 0.55), go: () => done(),
    }));
    stopSpeech();
    if (!live()) return;
    count = story.questions.length;
    for (const [i, q] of story.questions.entries()) {
      if (await quizCard({ q, idx: i, total: count, label: 'سؤال' })) right++;
      if (!live()) return;
    }
    await step(done => view(`
      <div class="card"><h2 class="ltr">${esc(story.title)}</h2><p class="story ltr">${esc(story.text)}</p>
        <div class="feedback">${esc(story.translation_ar)}</div>
        <div class="row"><button data-act="say">🔊 استمع مع النص</button><button class="primary" data-act="ok">متابعة ←</button></div></div>`, {
      say: () => speak(story.text, lang), ok: () => done(),
    }));
    if (!live()) return;
  } else {
    const pool = listenPool(lang).filter(x => mode !== 'b' || x.t.split(/\s+/).length <= 9);
    const items = sample(pool, total);
    count = items.length;
    label = mode === 'a' ? 'اسمع واختر المعنى' : 'اسمع واكتب';
    for (const [i, item] of items.entries()) {
      let ok;
      if (mode === 'a') {
        const others = sample([...new Set(listenPool(lang).map(x => x.a))].filter(a => a !== item.a), 3);
        ok = await listenChoice({ lang, item, options: sample([item.a, ...others], 4), idx: i, total: count });
      } else ok = await dictation({ lang, item, idx: i, total: count });
      if (!live()) return;
      if (ok) right++;
    }
  }
  stopSpeech();
  const pct = Math.round((right / count) * 100);
  (S.listen[lang] = S.listen[lang] || []).push(pct); S.listen[lang] = S.listen[lang].slice(-20);
  touchStreak(); save();
  view(`
    <div class="card" style="text-align:center">
      <h1>🎧 ${esc(label)}</h1>
      <p style="font-size:28px;margin:4px 0">${right}/${count} (${pct}%)</p>
      <p class="muted">${pct >= 80 ? 'ممتاز! أذنك تتحسن.' : pct >= 50 ? 'جيد. كرّر التمرين وركّز على الجمل اللي غلطت فيها.' : 'طبيعي بالبداية. استخدم زر 🐢 وكرّر الاستماع.'}</p>
      <div class="row" style="justify-content:center"><a class="btn primary" href="#/listen/${lang}/${mode}" onclick="setTimeout(route,0)">مرة ثانية</a><a class="btn" href="#/listen">تمارين أخرى</a><a class="btn" href="#/">الرئيسية</a></div>
    </div>`);
}

function dialogues(lang, id) {
  const d = lang && (BANK.dialogues[lang] || []).find(x => x.id === id);
  if (!d) {
    return view(`
      <h1>🎭 حوارات عملية</h1>
      <p class="muted">اختر موقفًا. اقرأ الحوار واستمع له، ثم جرّب «وضع التدريب»: بتلعب دورك وتقول جملتك بصوت عالٍ قبل ما تشوفها.</p>
      ${Object.keys(LANGS).map(l => `
        <h2>${LANGS[l].flag} ${LANGS[l].name}</h2>
        ${BANK.dialogues[l].map(x => `<a class="card" style="display:block;color:inherit" href="#/dialogues/${l}/${x.id}"><b>${esc(x.title)}</b> <span class="pill">${esc(x.level)}</span> <span class="muted">${x.lines.length} سطر</span></a>`).join('')}`).join('')}`);
  }
  let practice = false, showAr = true;
  const revealed = new Set();
  const draw = () => view(`
    <p><a href="#/dialogues">← كل الحوارات</a></p>
    <h1>${esc(d.title)}</h1>
    ${d.note ? `<div class="warn">${esc(d.note)}</div><br>` : ''}
    <div class="row" style="margin-bottom:12px">
      <button data-act="mode" class="${practice ? 'primary' : ''}">${practice ? '📖 وضع القراءة' : '🎭 وضع التدريب'}</button>
      <button data-act="ar">${showAr ? 'إخفاء الترجمة' : 'إظهار الترجمة'}</button>
      <button data-act="all">🔊 استمع للحوار</button>
      <button data-act="addall">＋ جملي للمراجعة</button>
    </div>
    ${practice ? '<p class="muted">اقرأ سطر الطرف الثاني، ثم قل جملتك بصوت عالٍ قبل ما تكشفها.</p>' : ''}
    ${d.lines.map((l, i) => {
      const mine = l.w === 'm', hidden = practice && mine && !revealed.has(i);
      return `<div class="card line ${mine ? 'me' : ''}">
        <div class="muted">${mine ? '🙋 أنت' : '👤 الطرف الثاني'}</div>
        ${hidden
          ? `<div style="font-size:19px">🎯 ${esc(l.a)}</div><button data-act="reveal" data-i="${i}">اكشف الجملة</button>`
          : `<div class="ltr" style="font-size:19px;line-height:1.6"><b>${esc(l.t)}</b></div>
             ${showAr ? `<div>${esc(l.a)}</div>` : ''}
             <div class="row" style="margin-top:6px"><button data-act="say" data-i="${i}" aria-label="استمع">🔊</button></div>`}
      </div>`;
    }).join('')}`, {
    mode() { practice = !practice; revealed.clear(); draw(); },
    ar() { showAr = !showAr; draw(); },
    reveal(b) { revealed.add(+b.dataset.i); draw(); speak(d.lines[+b.dataset.i].t, lang); },
    say: b => speak(d.lines[+b.dataset.i].t, lang),
    all: () => speakLines(d.lines.map(l => l.t), lang),
    addall() {
      const n = d.lines.filter(l => l.w === 'm' && addCard(lang, l.t, l.a)).length;
      toast(n ? `أضفت ${n} جمل للمراجعة` : 'كلها موجودة من قبل');
    },
  });
  draw();
}

function survive(id) {
  const g = BANK.survive.find(x => x.id === id);
  if (!g) {
    return view(`
      <h1>🆘 جمل البقاء</h1>
      <p class="muted">جمل قصيرة وجاهزة للمواقف اللي بتحتاج فيها تحمي حالك وتتفاهم. اضغط 🔊 لتسمع النطق، و＋ لتضيفها لمراجعتك.</p>
      ${BANK.survive.map(x => `<a class="card" style="display:block;color:inherit" href="#/survive/${x.id}"><b>${esc(x.title)}</b> <span class="muted">(${x.items.length})</span></a>`).join('')}
      <p class="muted">النطق بالحروف العربية تقريبي. اعتمد على زر 🔊. هذا القسم للغة فقط وليس نصيحة قانونية. للمشاكل القانونية استشر جهة مختصة.</p>`);
  }
  view(`
    <p><a href="#/survive">← كل المواقف</a></p>
    <h1>${esc(g.title)}</h1>
    ${g.note ? `<div class="warn">${esc(g.note)}</div><br>` : ''}
    ${g.items.map((it, i) => `
      <div class="card">
        <div class="story ltr" style="font-size:20px;line-height:1.6"><b>${esc(it.g)}</b></div>
        <div>${esc(it.a)}</div>
        <div class="muted">🗣️ ${esc(it.p)}</div>
        <div class="row" style="margin-top:8px"><button data-act="say" data-i="${i}">🔊</button><button data-act="add" data-i="${i}">＋ مراجعة</button></div>
      </div>`).join('')}`, {
    say: b => speak(g.items[+b.dataset.i].g, 'el'),
    add(b) {
      const it = g.items[+b.dataset.i];
      toast(addCard('el', it.g, it.a) ? 'انضافت للمراجعة' : 'موجودة من قبل');
      b.textContent = '✓'; b.disabled = true;
    },
  });
}

function settings() {
  view(`
    <h1>⚙️ الإعدادات</h1>
    <div class="card">
      <label for="exam">موعد اختبار الجنسية</label>
      <input type="date" id="exam" value="${esc(S.examDate)}">
      <label for="pass">رمز الدخول (إذا السيرفر محمي)</label>
      <input type="password" id="pass" value="${esc(S.passcode)}" autocomplete="off">
      <p><button class="primary" data-act="save">حفظ</button></p>
    </div>
    <div class="card">
      <h2>نسخة احتياطية</h2>
      <p class="muted">بياناتك محفوظة في هذا المتصفح فقط. خذ نسخة قبل ما تغيّر جهازك أو تمسح بيانات المتصفح.</p>
      <div class="row"><button data-act="exp">تنزيل نسخة</button><button data-act="imp">استيراد نسخة</button>
      <input type="file" id="file" accept="application/json" hidden></div>
    </div>
    <div class="card"><button data-act="reset">🗑️ مسح كل البيانات</button></div>`, {
    save() {
      S.examDate = document.getElementById('exam').value;
      S.passcode = document.getElementById('pass').value;
      save(); toast('انحفظت الإعدادات');
    },
    exp() {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' }));
      a.download = `lang-backup-${today()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    imp() {
      const f = document.getElementById('file');
      f.onchange = async () => {
        try {
          const d = JSON.parse(await f.files[0].text());
          if (!d || typeof d !== 'object' || !d.level || !Array.isArray(d.cards)) throw 0;
          S = { ...defaults(), ...d }; save(); toast('تم الاستيراد'); settings();
        } catch { toast('الملف غير صالح'); }
      };
      f.click();
    },
    reset() { if (confirm('متأكد؟ رح تنمسح كل التقدّمات.')) { S = defaults(); save(); location.hash = '#/'; route(); } },
  });
}

// ---------- router ----------
let viewId = 0;
function route() {
  const id = ++viewId, live = () => id === viewId;
  const [, name = '', arg = '', arg2 = ''] = (location.hash || '#/').slice(1).split('/');
  const lang = LANGS[arg] ? arg : 'el';
  const run = p => p.catch(e => { if (live()) failScreen(e, route); });
  switch (name) {
    case 'placement': return run(placement(lang, live));
    case 'session': return run(session(lang, live));
    case 'civics': return run(civics(live));
    case 'words': return run(words(live));
    case 'read': {
      const level = (arg2 || 'b1').toUpperCase();
      return LANGS[arg] && LONG_LEVELS[arg].includes(level) ? run(readLong(arg, level, live)) : home();
    }
    case 'exam': return LANGS[arg] ? run(exam(arg, live)) : examMenu();
    case 'listen': return LANGS[arg] && ['a', 'b', 'c'].includes(arg2) ? run(listen(arg, arg2, live)) : listenMenu();
    case 'dialogues': return dialogues(LANGS[arg] ? arg : '', arg2);
    case 'survive': return survive(arg);
    case 'settings': return settings();
    default: return home();
  }
}
window.addEventListener('hashchange', route);

async function boot() {
  try {
    const st = await (await fetch('/api/status')).json();
    if (!st.demo) MODE = 'ai';
  } catch { /* offline: ignore */ }
  route();
}
boot();
