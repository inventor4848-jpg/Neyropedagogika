const FINAL_TEST_QCOUNT = 30;
const FINAL_TEST_PER_TOPIC = 2;
const FINAL_TEST_SECONDS = 40 * 60;

let ftQuestions = [];
let ftAnswers = [];
let ftCurrent = 0;
let ftTimeLeft = FINAL_TEST_SECONDS;
let ftTimerId = null;

function ftShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function ftBuildQuestionPool() {
  const snapshot = await db.collection('topics').get();
  const topics = snapshot.docs.map(d => ({ ...d.data(), docId: d.id }));
  let pool = [];
  topics.forEach(t => {
    if (!t.questions || !t.questions.length) return;
    const picked = ftShuffle(t.questions).slice(0, FINAL_TEST_PER_TOPIC);
    picked.forEach(q => {
      const optOrder = ftShuffle(q.opts.map((o, i) => i));
      const opts = optOrder.map(i => q.opts[i]);
      const ans = optOrder.indexOf(q.ans);
      pool.push({ q: q.q, opts, ans, topicName: t.name });
    });
  });
  pool = ftShuffle(pool).slice(0, FINAL_TEST_QCOUNT);
  return pool;
}

async function startFinalTest() {
  const startBtn = document.getElementById('ftStartBtn');
  startBtn.disabled = true;
  startBtn.textContent = 'Yuklanmoqda...';
  try {
    ftQuestions = await ftBuildQuestionPool();
    if (ftQuestions.length === 0) {
      alert("Savollar topilmadi. Birozdan so’ng qayta urinib ko’ring.");
      startBtn.disabled = false;
      startBtn.textContent = 'Boshlash';
      return;
    }
    ftAnswers = new Array(ftQuestions.length).fill(null);
    ftCurrent = 0;
    ftTimeLeft = FINAL_TEST_SECONDS;

    document.getElementById('ftStartScreen').style.display = 'none';
    document.getElementById('ftResultScreen').style.display = 'none';
    document.getElementById('ftExamScreen').style.display = 'block';

    renderFtPanel();
    renderFtQuestion();
    ftTimerId = setInterval(ftTick, 1000);
    updateFtTimerDisplay();
  } catch (e) {
    console.error(e);
    alert('Savollarni yuklashda xatolik yuz berdi.');
    startBtn.disabled = false;
    startBtn.textContent = 'Boshlash';
  }
}

function ftTick() {
  ftTimeLeft--;
  updateFtTimerDisplay();
  if (ftTimeLeft <= 0) {
    clearInterval(ftTimerId);
    finishFinalTest(true);
  }
}

function updateFtTimerDisplay() {
  const m = Math.floor(Math.max(ftTimeLeft, 0) / 60).toString().padStart(2, '0');
  const s = Math.max(ftTimeLeft, 0) % 60;
  const ss = s.toString().padStart(2, '0');
  const el = document.getElementById('ftTimer');
  el.textContent = m + ':' + ss;
  el.classList.toggle('ft-timer-warn', ftTimeLeft <= 300);
}

function renderFtPanel() {
  const panel = document.getElementById('ftPanel');
  panel.innerHTML = ftQuestions.map((q, i) => {
    const cls = i === ftCurrent ? 'ft-panel-btn ft-current' : (ftAnswers[i] !== null ? 'ft-panel-btn ft-answered' : 'ft-panel-btn');
    return `<button type="button" class="${cls}" onclick="goToFtQuestion(${i})">${i + 1}</button>`;
  }).join('');
}

function goToFtQuestion(i) {
  ftCurrent = i;
  renderFtQuestion();
  renderFtPanel();
}

function renderFtQuestion() {
  const q = ftQuestions[ftCurrent];
  document.getElementById('ftQNum').textContent = `${ftCurrent + 1}-savol / ${ftQuestions.length}`;
  document.getElementById('ftQText').textContent = q.q;
  const optsDiv = document.getElementById('ftOptions');
  optsDiv.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ft-option-btn' + (ftAnswers[ftCurrent] === i ? ' selected' : '');
    btn.textContent = opt;
    btn.onclick = () => {
      ftAnswers[ftCurrent] = i;
      renderFtQuestion();
      renderFtPanel();
    };
    optsDiv.appendChild(btn);
  });
  document.getElementById('ftPrevBtn').disabled = ftCurrent === 0;
  document.getElementById('ftNextBtn').style.display = ftCurrent === ftQuestions.length - 1 ? 'none' : 'inline-block';
  document.getElementById('ftFinishBtn').style.display = ftCurrent === ftQuestions.length - 1 ? 'inline-block' : 'none';
}

function ftPrev() { if (ftCurrent > 0) { ftCurrent--; renderFtQuestion(); renderFtPanel(); } }
function ftNext() { if (ftCurrent < ftQuestions.length - 1) { ftCurrent++; renderFtQuestion(); renderFtPanel(); } }

function confirmFinishFinalTest() {
  const unanswered = ftAnswers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`${unanswered} ta savolga javob berilmagan. Baribir yakunlaysizmi?`)) return;
  }
  finishFinalTest(false);
}

function gradeLabel(pct) {
  if (pct >= 90) return "a’lo";
  if (pct >= 70) return 'yaxshi';
  if (pct >= 60) return 'qoniqarli';
  return 'qoniqarsiz';
}

function finishFinalTest(timedOut) {
  clearInterval(ftTimerId);
  let correct = 0;
  ftQuestions.forEach((q, i) => { if (ftAnswers[i] === q.ans) correct++; });
  const pct = Math.round((correct / ftQuestions.length) * 100);
  const ball = Math.round((pct / 100) * 50);
  const grade = gradeLabel(pct);

  try {
    const best = JSON.parse(localStorage.getItem('finalTestBestScore') || 'null');
    if (!best || pct > best.pct) {
      localStorage.setItem('finalTestBestScore', JSON.stringify({ pct, ball, grade, date: new Date().toISOString() }));
    }
  } catch (e) {}

  document.getElementById('ftExamScreen').style.display = 'none';
  document.getElementById('ftResultScreen').style.display = 'block';
  document.getElementById('ftResultSummary').innerHTML =
    (timedOut ? '<p class="ft-timeout-note">⏰ Vaqt tugadi — test avtomatik yakunlandi.</p>' : '') +
    `<div class="ft-score-big">${pct}%</div>` +
    `<p>${correct} / ${ftQuestions.length} ta to’g'ri javob</p>` +
    `<p><strong>${ball} / 50 ball</strong> (yakuniy nazorat)</p>` +
    `<p class="ft-grade-badge ft-grade-${grade.replace("'", '')}">Baho: ${grade}</p>`;

  const reviewEl = document.getElementById('ftReview');
  reviewEl.innerHTML = ftQuestions.map((q, i) => {
    const userAns = ftAnswers[i];
    const isCorrect = userAns === q.ans;
    return `<div class="ft-review-item ${isCorrect ? 'ft-review-correct' : 'ft-review-wrong'}">
      <div class="ft-review-q">${i + 1}. ${q.q} <span class="ft-review-topic">(${q.topicName})</span></div>
      <div class="ft-review-a">Sizning javobingiz: ${userAns !== null ? q.opts[userAns] : '— javob berilmagan —'}</div>
      ${!isCorrect ? `<div class="ft-review-correct-a">To’g'ri javob: ${q.opts[q.ans]}</div>` : ''}
    </div>`;
  }).join('');
}

function restartFinalTest() {
  document.getElementById('ftResultScreen').style.display = 'none';
  document.getElementById('ftStartScreen').style.display = 'block';
  document.getElementById('ftStartBtn').disabled = false;
  document.getElementById('ftStartBtn').textContent = 'Boshlash';
}
