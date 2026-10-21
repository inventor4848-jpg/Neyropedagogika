var neuronCtx = null;
var neuronAnimId = null;
var neuronParticles = [];

function neuronDemoMarkup() {
  return (
    '<div class="interactive-demo-block" style="margin-top:2rem;padding-top:2rem;border-top:1px solid var(--border);">' +
    '<h3 style="font-family:’Times New Roman’,Times,serif;color:var(--primary);font-size:1.3rem;margin-bottom:1rem;">🧠 Interaktiv namoyish: Neyron impulsini simulyatsiya qiling</h3>' +
    '<div class="demo-layout">' +
    '<div class="neuron-demo">' +
    '<div class="demo-canvas-wrap"><canvas id="neuronCanvas" width="500" height="280"></canvas></div>' +
    '<div class="demo-controls">' +
    '<div class="ctrl-row"><span class="ctrl-label">Impuls kuchi</span><input type="range" class="ctrl-slider" id="strength" min="1" max="10" value="5" oninput="updateNeuronSlider()"/><span class="ctrl-val" id="strengthVal">5</span></div>' +
    '<div class="ctrl-row"><span class="ctrl-label">Tezlik</span><input type="range" class="ctrl-slider" id="speed" min="1" max="10" value="5" oninput="updateNeuronSlider()"/><span class="ctrl-val" id="speedVal">5</span></div>' +
    '<div class="ctrl-row"><span class="ctrl-label">Sinaps soni</span><input type="range" class="ctrl-slider" id="synapses" min="1" max="8" value="4" oninput="updateNeuronSlider()"/><span class="ctrl-val" id="synapsesVal">4</span></div>' +
    '<button type="button" class="fire-btn" onclick="fireNeuronDemo()">⚡ Neyronni Faollashtirish</button>' +
    '</div></div>' +
    '<div class="demo-info">' +
    '<p>Har bir neyron dendritlar orqali signal qabul qiladi, soma (tanasi)da ishlaydi va akson orqali keyingi neyronlarga uzatadi. Bu jarayon elektrokimyoviy impuls asosida amalga oshadi.</p>' +
    '<p>Sinaptik aloqalar qanchalik ko’p va kuchli bo’lsa, xotira va o’rganish shunchalik samarali bo’ladi — bu Hebb qonunining asosi.</p>' +
    '<div class="fact-cards">' +
    '<div class="fact-card"><span class="fact-icon">⚡</span><div class="fact-text"><strong>Impuls tezligi:</strong> Neyron signali 1–120 m/s tezlikda uzatiladi — miyelin qobig’i bu tezlikni oshiradi.</div></div>' +
    '<div class="fact-card"><span class="fact-icon">🔗</span><div class="fact-text"><strong>Hebb qonuni:</strong> "Birga faollashadigan neyronlar o’zaro bog’lanadi" — takrorlash orqali ulanishlar kuchayadi.</div></div>' +
    '<div class="fact-card"><span class="fact-icon">🧠</span><div class="fact-text"><strong>Neyron soni:</strong> Inson miyasida ~86 milliard neyron, ular o’rtasida yuz trillion sinaptik aloqa mavjud.</div></div>' +
    '</div></div>' +
    '</div></div>'
  );
}

function initNeuronDemo(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = neuronDemoMarkup();
  var canvas = document.getElementById('neuronCanvas');
  if (!canvas) return;
  neuronCtx = canvas.getContext('2d');
  neuronParticles = [];
  drawNeuronDemo();
}

function updateNeuronSlider() {
  var strengthEl = document.getElementById('strength');
  var speedEl = document.getElementById('speed');
  var synEl = document.getElementById('synapses');
  if (strengthEl) document.getElementById('strengthVal').textContent = strengthEl.value;
  if (speedEl) document.getElementById('speedVal').textContent = speedEl.value;
  if (synEl) document.getElementById('synapsesVal').textContent = synEl.value;
}

function drawNeuronDemo() {
  var canvas = document.getElementById('neuronCanvas');
  if (!canvas || !neuronCtx) return;
  var ctx = neuronCtx;
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  var numSyn = parseInt(document.getElementById('synapses').value);
  ctx.fillStyle = '#FAFAF8';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#2FB8AC';
  ctx.lineWidth = 2;
  for (var i = 0; i < numSyn; i++) {
    var angle = -Math.PI / 2 + ((i / (numSyn - 1 || 1)) * Math.PI);
    var ex = 100 + Math.cos(angle) * 70, ey = H / 2 + Math.sin(angle) * 70;
    ctx.beginPath(); ctx.moveTo(160, H / 2); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fillStyle = '#2FB8AC'; ctx.fill();
  }
  var grad = ctx.createRadialGradient(160, H / 2, 5, 160, H / 2, 35);
  grad.addColorStop(0, '#2FB8AC'); grad.addColorStop(1, '#1A3A5C');
  ctx.beginPath(); ctx.arc(160, H / 2, 35, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px DM Sans,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Soma', 160, H / 2 + 4);
  ctx.strokeStyle = '#1A3A5C'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(195, H / 2); ctx.lineTo(380, H / 2); ctx.stroke();
  for (var m = 0; m < 4; m++) {
    var mx = 220 + m * 42;
    ctx.fillStyle = 'rgba(47,184,172,0.15)'; ctx.strokeStyle = 'rgba(47,184,172,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(mx, H / 2, 14, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(395, H / 2, 12, 0, Math.PI * 2); ctx.fillStyle = '#F4A261'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '7px DM Sans,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Terminal', 395, H / 2 + 2);
  ctx.fillStyle = '#6B7280'; ctx.font = '10px DM Sans,sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Dendritlar', 80, H - 10);
  ctx.fillText('Akson', 290, H / 2 - 18);
  ctx.fillStyle = '#F4A261'; ctx.font = '10px DM Sans,sans-serif';
  ctx.fillText('Keyingi neyron →', 395, H - 10);
  neuronParticles.forEach(function (p) {
    var alpha = p.life > 0.7 ? 1 : (p.life / 0.7);
    ctx.beginPath(); ctx.arc(p.x, p.y, 5 * p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,162,97,' + alpha + ')'; ctx.fill();
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')'; ctx.fill();
  });
}

function fireNeuronDemo() {
  var canvas = document.getElementById('neuronCanvas');
  if (!canvas || !neuronCtx) return;
  if (neuronAnimId) cancelAnimationFrame(neuronAnimId);
  neuronParticles = [];
  var speed = parseInt(document.getElementById('speed').value);
  var strength = parseInt(document.getElementById('strength').value);
  var numSyn = parseInt(document.getElementById('synapses').value);
  var start = null;
  var duration = 2000 - speed * 150;
  var H = canvas.height;
  for (var i = 0; i < numSyn; i++) {
    var angle = -Math.PI / 2 + ((i / (numSyn - 1 || 1)) * Math.PI);
    var ex = 100 + Math.cos(angle) * 70, ey = H / 2 + Math.sin(angle) * 70;
    neuronParticles.push({ sx: ex, sy: ey, ex: 160, ey: H / 2, x: ex, y: ey, life: 1, size: 0.6 + strength * 0.05, delay: i * 80 });
  }
  neuronParticles.push({ sx: 160, sy: H / 2, ex: 395, ey: H / 2, x: 160, y: H / 2, life: 1, size: 1 + strength * 0.06, delay: 400 });

  function animate(ts) {
    if (!start) start = ts;
    var elapsed = ts - start;
    neuronParticles.forEach(function (p) {
      if (elapsed < p.delay) { p.x = p.sx; p.y = p.sy; return; }
      var t = Math.min((elapsed - p.delay) / duration, 1);
      p.x = p.sx + (p.ex - p.sx) * t; p.y = p.sy + (p.ey - p.sy) * t; p.life = 1 - t;
    });
    drawNeuronDemo();
    if (elapsed < duration + 600) neuronAnimId = requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
