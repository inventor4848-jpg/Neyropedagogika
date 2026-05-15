// Mobile menu
function toggleMobileMenu(){var m=document.getElementById('mobileMenu');m.classList.toggle('open')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open')}

// Topics
function showTopic(id,btn){
  document.querySelectorAll('.topic-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.topic-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

// Auth Flow & Protection
const protectedPages = ['topics.html', 'demo.html', 'quiz.html', 'glossary.html'];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const authMenu = document.getElementById('authMenu');
    
    // Check path
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    // Protection
    if (protectedPages.includes(pageName) && !token) {
        window.location.href = 'login.html?redirect=' + pageName;
    }
    
    // Render Auth Menu
    if(authMenu) {
        if(token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            authMenu.innerHTML = `
                <span style="font-size:0.85rem; font-weight:600; color:var(--primary); margin-right:10px;">${user.name}</span>
                <button onclick="logout()" class="btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem; background:transparent; border:1px solid var(--primary); color:var(--primary);">Chiqish</button>
            `;
        } else {
            authMenu.innerHTML = `
              <a href="login.html" style="text-decoration:none; color:var(--text); font-weight:600; font-size:0.9rem; align-self:center;">Kirish</a>
              <a href="register.html" class="btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;">Ro'yxatdan o'tish</a>
            `;
        }
    }

    // Handle topic query param
    if (pageName === 'topics.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const topicId = urlParams.get('t');
        if (topicId) {
            const btn = document.querySelector(`.topic-btn[onclick*="'t${topicId}'"]`);
            if (btn) showTopic('t' + topicId, btn);
        }
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Slider
function updateSlider(){
  var strengthEl = document.getElementById('strength');
  var speedEl = document.getElementById('speed');
  var synEl = document.getElementById('synapses');
  if(strengthEl) document.getElementById('strengthVal').textContent = strengthEl.value;
  if(speedEl) document.getElementById('speedVal').textContent = speedEl.value;
  if(synEl) document.getElementById('synapsesVal').textContent = synEl.value;
}

// Neuron canvas
var canvas=document.getElementById('neuronCanvas');
if(canvas) {
    var ctx=canvas.getContext('2d');
    var animId=null;
    var particles=[];
    var synapseNodes=[];

    function drawNeuron(){
      var W=canvas.width,H=canvas.height;
      ctx.clearRect(0,0,W,H);
      var numSyn=parseInt(document.getElementById('synapses').value);
      ctx.fillStyle='#FAFAF8';
      ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#2FB8AC';
      ctx.lineWidth=2;
      synapseNodes=[];
      for(var i=0;i<numSyn;i++){
        var angle=-Math.PI/2+((i/(numSyn-1||1))*Math.PI);
        var ex=100+Math.cos(angle)*70,ey=H/2+Math.sin(angle)*70;
        synapseNodes.push({x:ex,y:ey});
        ctx.beginPath();ctx.moveTo(160,H/2);ctx.lineTo(ex,ey);ctx.stroke();
        ctx.beginPath();ctx.arc(ex,ey,6,0,Math.PI*2);ctx.fillStyle='#2FB8AC';ctx.fill();
      }
      var grad=ctx.createRadialGradient(160,H/2,5,160,H/2,35);
      grad.addColorStop(0,'#2FB8AC');grad.addColorStop(1,'#1A3A5C');
      ctx.beginPath();ctx.arc(160,H/2,35,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 11px DM Sans,sans-serif';ctx.textAlign='center';
      ctx.fillText('Soma',160,H/2+4);
      ctx.strokeStyle='#1A3A5C';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(195,H/2);ctx.lineTo(380,H/2);ctx.stroke();
      for(var m=0;m<4;m++){
        var mx=220+m*42;
        ctx.fillStyle='rgba(47,184,172,0.15)';ctx.strokeStyle='rgba(47,184,172,0.4)';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(mx,H/2,14,10,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      }
      ctx.beginPath();ctx.arc(395,H/2,12,0,Math.PI*2);ctx.fillStyle='#F4A261';ctx.fill();
      ctx.fillStyle='#fff';ctx.font='7px DM Sans,sans-serif';ctx.textAlign='center';
      ctx.fillText('Terminal',395,H/2+2);
      ctx.fillStyle='#6B7280';ctx.font='10px DM Sans,sans-serif';
      ctx.textAlign='center';ctx.fillText('Dendritlar',80,H-10);
      ctx.fillText('Akson',290,H/2-18);
      ctx.fillStyle='#F4A261';ctx.font='10px DM Sans,sans-serif';
      ctx.fillText('Keyingi neyron →',395,H-10);
      particles.forEach(function(p){
        var alpha=p.life>0.7?1:(p.life/0.7);
        ctx.beginPath();ctx.arc(p.x,p.y,5*p.size,0,Math.PI*2);
        ctx.fillStyle='rgba(244,162,97,'+alpha+')';ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+alpha+')';ctx.fill();
      });
    }

    function fireNeuron(){
      if(animId) cancelAnimationFrame(animId);
      particles=[];
      var speed=parseInt(document.getElementById('speed').value);
      var strength=parseInt(document.getElementById('strength').value);
      var numSyn=parseInt(document.getElementById('synapses').value);
      var start=null;
      var duration=2000-speed*150;
      var H=canvas.height;
      for(var i=0;i<numSyn;i++){
        var angle=-Math.PI/2+((i/(numSyn-1||1))*Math.PI);
        var ex=100+Math.cos(angle)*70,ey=H/2+Math.sin(angle)*70;
        particles.push({sx:ex,sy:ey,ex:160,ey:H/2,x:ex,y:ey,life:1,size:0.6+strength*0.05,phase:'dendrite',delay:i*80,done:false});
      }
      particles.push({sx:160,sy:H/2,ex:395,ey:H/2,x:160,y:H/2,life:1,size:1+strength*0.06,phase:'axon',delay:400,done:false});
      function animate(ts){
        if(!start)start=ts;
        var elapsed=ts-start;
        particles.forEach(function(p){
          if(elapsed<p.delay){p.x=p.sx;p.y=p.sy;return;}
          var t=Math.min((elapsed-p.delay)/duration,1);
        p.x=p.sx+(p.ex-p.sx)*t;p.y=p.sy+(p.ey-p.sy)*t;p.life=1-t;
        });
        drawNeuron();
        if(elapsed<duration+600) animId=requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }

    drawNeuron();
}

// QUIZ
var quizCard = document.querySelector('.quiz-card');
if(quizCard) {
    var questions=[
      {q:"Miyaning qaysi hududi xotira jarayonida asosiy rol o'ynaydi?",opts:["Amigdala","Gippokamp","Prefrontal korteks","Serebellyum"],ans:1,exp:"Gippokamp yangi xotiralarni shakllantirish va ularni uzoq muddatli xotiraga o'tkazishda asosiy rol o'ynaydi."},
      {q:"Hebb qonuni nima deydi?",opts:["Neyronlar mustaqil ishlaydi","Birga otatgan neyronlar birga birikadilar","Ko'proq neyron = ko'proq xotira","Stres xotirani yaxshilaydi"],ans:1,exp:"Hebb qonuniga ko'ra, bir vaqtda faollashgan neyronlar o'rtasidagi sinaptik aloqa kuchayadi — bu o'rganishning asosi."},
      {q:"Qaysi neyrotransmitter mukofot va motivatsiya bilan bog'liq?",opts:["Serotonin","GABA","Dopamin","Asetilxolin"],ans:2,exp:"Dopamin asab tizimining mukofot tizimida markaziy rol o'ynaydi va motivatsiya, qoniqish hissi bilan chambarchas bog'liq."},
      {q:"Kognitiv yuklanish nazariyasi kimga tegishli?",opts:["Erik Kandel","John Sweller","Michael Merzenich","David Sousa"],ans:1,exp:"John Sweller 1988-yilda kognitiv yuklanish nazariyasini ishlab chiqdi — bu ta'lim dizaynida muhim nazariy asos."},
      {q:"Neyroплasticlik deganda nima tushuniladi?",opts:["Miyaning o'lchami katta bo'lishi","Miyaning yangi neyron ulanishlarini shakllantirish qobiliyati","Neyronlar soni ko'payishi","Miya charchashi"],ans:1,exp:"Нейропластиклик miyaning tajriba va o'rganish asosida o'zini qayta tashkil etish qobiliyati — u umr bo'yi davom etadi."},
      {q:"Qaysi uyqu fazasi xotira konsolidatsiyasida muhimroq?",opts:["NREM (sekin to'lqinli uyqu)","REM uyqu","Ikkalasi ham muhim","Uyqu ahamiyatsiz"],ans:2,exp:"Ilmiy tadqiqotlar shuni ko'rsatadiki, ham NREM, ham REM uyqu bosqichlari turli xotira turlarini konsolidatsiya qilishda muhim rol o'ynaydi."},
      {q:"Amigdala asosan qaysi vazifani bajaradi?",opts:["Harakat koordinatsiyasi","His-tuyg'ularni qayta ishlash","Til ishlab chiqarish","Ko'ruv ma'lumotlarini qayta ishlash"],ans:1,exp:"Amigdala his-tuyg'ularni, ayniqsa qo'rquv va xavotir sezgilarini qayta ishlashda markaziy rol o'ynaydi va emotsional xotira bilan bog'liq."}
    ];
    var qi=0,correct=0,answered=false;

    function renderQuiz(){
      var q=questions[qi];
      document.getElementById('quizNum').textContent='Savol '+(qi+1)+' / '+questions.length;
      document.getElementById('quizQ').textContent=q.q;
      document.getElementById('quizBar').style.width=((qi+1)/questions.length*100)+'%';
      document.getElementById('quizScore').textContent='To\'g\'ri: '+correct;
      document.getElementById('quizFeedback').className='quiz-feedback';
      document.getElementById('quizFeedback').textContent='';
      document.getElementById('nextBtn').disabled=true;
      answered=false;
      var opts=document.getElementById('quizOpts');
      opts.innerHTML='';
      q.opts.forEach(function(o,i){
        var btn=document.createElement('button');
        btn.className='quiz-option';
        btn.textContent=o;
        btn.onclick=function(){selectAnswer(i,btn)};
        opts.appendChild(btn);
      });
    }

    function selectAnswer(i,btn){
      if(answered)return;
      answered=true;
      var q=questions[qi];
      var allBtns=document.querySelectorAll('.quiz-option');
      allBtns[q.ans].classList.add('correct');
      var fb=document.getElementById('quizFeedback');
      if(i===q.ans){
        correct++;
        btn.classList.add('correct');
        fb.textContent='✅ To\'g\'ri! '+q.exp;
        fb.className='quiz-feedback correct show';
      } else {
        btn.classList.add('wrong');
        fb.textContent='❌ Noto\'g\'ri. '+q.exp;
        fb.className='quiz-feedback wrong show';
      }
      document.getElementById('quizScore').textContent='To\'g\'ri: '+correct;
      document.getElementById('nextBtn').disabled=false;
      if(qi===questions.length-1)document.getElementById('nextBtn').textContent='Natija';
    }

    function nextQuestion(){
      qi++;
      if(qi>=questions.length){
        var pct=Math.round(correct/questions.length*100);
        quizCard.innerHTML='<div style="text-align:center;padding:2rem"><div style="font-size:4rem;margin-bottom:1rem">'+(pct>=70?'🎉':'📚')+'</div><h3 style="font-family:Playfair Display,serif;font-size:1.8rem;color:var(--primary);margin-bottom:0.5rem">Test yakunlandi!</h3><p style="color:var(--muted);margin-bottom:1.5rem">Siz '+correct+' ta to\'g\'ri javob berdingiz ('+pct+'%)</p><div style="background:var(--bg);border-radius:12px;padding:1.5rem;border:1px solid var(--border);margin-bottom:1.5rem"><div style="font-size:2.5rem;font-weight:700;color:var(--primary);font-family:Playfair Display,serif">'+pct+'%</div><div style="color:var(--muted);font-size:0.9rem">'+(pct>=90?'A\'lo natija! Mukammal bilim!':pct>=70?'Yaxshi natija! Davom eting.':'Ko\'proq o\'qish tavsiya etiladi.')+'</div></div><button class="btn-primary" onclick="restartQuiz()" style="margin:0 auto">🔄 Qayta Boshlash</button></div>';
        return;
      }
      renderQuiz();
    }

    function restartQuiz(){
      qi=0;correct=0;
      quizCard.innerHTML='<div class="quiz-progress"><div class="quiz-bar" id="quizBar" style="width:14%"></div></div><div class="quiz-q-num" id="quizNum"></div><div class="quiz-question" id="quizQ"></div><div class="quiz-options" id="quizOpts"></div><div class="quiz-feedback" id="quizFeedback"></div><div class="quiz-nav"><span class="quiz-score" id="quizScore">To\'g\'ri: 0</span><button class="btn-quiz" id="nextBtn" onclick="nextQuestion()" disabled>Keyingi →</button></div>';
      renderQuiz();
    }

    renderQuiz();
}

// Glossary filter
function filterGlossary(){
  var val=document.getElementById('glossarySearch').value.toLowerCase();
  document.querySelectorAll('.glossary-item').forEach(function(el){
    var term=el.dataset.term;
    var def=el.querySelector('.glossary-def').textContent.toLowerCase();
    var title=el.querySelector('.glossary-term').textContent.toLowerCase();
    el.style.display=(term.includes(val)||def.includes(val)||title.includes(val))?'':'none';
  });
}
