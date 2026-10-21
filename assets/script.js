// Mobile menu
function toggleMobileMenu(){var m=document.getElementById('mobileMenu');m.classList.toggle('open')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open')}

// Auth Flow & Protection
const protectedPages = ['topics.html'];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const authMenu = document.getElementById('authMenu');

    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';

    if (protectedPages.includes(pageName) && !token) {
        window.location.href = 'login.html?redirect=' + pageName;
    }

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
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Glossary filter (glossary.html only)
function filterGlossary(){
  var val=document.getElementById('glossarySearch').value.toLowerCase();
  document.querySelectorAll('.glossary-item').forEach(function(el){
    var term=el.dataset.term;
    var def=el.querySelector('.glossary-def').textContent.toLowerCase();
    var title=el.querySelector('.glossary-term').textContent.toLowerCase();
    el.style.display=(term.includes(val)||def.includes(val)||title.includes(val))?'':'none';
  });
}
