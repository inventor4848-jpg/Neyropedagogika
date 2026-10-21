var NAV_LINKS = [
  { href: 'index.html', label: 'Bosh sahifa' },
  { href: 'about.html', label: 'Darslik haqida' },
  { href: 'topics.html', label: 'Mavzular' },
  { href: 'amaliy.html', label: "Amaliy mashg’ulotlar" },
  { href: 'final-test.html', label: 'Yakuniy test' },
  { href: 'literature.html', label: 'Adabiyotlar' }
];

var FONT_SCALES = [14, 16, 18];

function logoMarkup() {
  return (
    '<a class="logo" href="index.html">' +
    '<div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6l1 5h6l1-5c1.8-1.3 3-3.5 3-6 0-4-3-7-7-7z"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="12" y1="2" x2="12" y2="9"/></svg></div>' +
    '<div><div class="logo-text">NeuroPed</div><div class="logo-sub">Elektron Darslik</div></div>' +
    '</a>'
  );
}

function themeButtonLabel() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? '☀️' : '🌙';
}

function renderNavLinks(activePage) {
  return NAV_LINKS.map(function (link) {
    var active = link.href === activePage ? ' class="active"' : '';
    return '<a href="' + link.href + '"' + active + '>' + link.label + '</a>';
  }).join('');
}

function renderSiteNav(activePage) {
  var nav = document.getElementById('siteNav');
  var mobileMenu = document.getElementById('mobileMenu');
  if (nav) {
    nav.innerHTML =
      '<div class="nav-inner">' +
      logoMarkup() +
      '<ul class="nav-links">' + renderNavLinks(activePage) + '</ul>' +
      '<div class="nav-tools">' +
      '<button type="button" class="tool-btn" id="themeToggleBtn" onclick="toggleTheme()" aria-label="Tungi rejim" title="Tungi rejim">' + themeButtonLabel() + '</button>' +
      '<div class="font-size-group" role="group" aria-label="Shrift kattaligi">' +
      '<button type="button" class="tool-btn" onclick="changeFontSize(-1)" aria-label="Shriftni kichraytirish" title="Shriftni kichraytirish">A−</button>' +
      '<button type="button" class="tool-btn" onclick="changeFontSize(1)" aria-label="Shriftni kattalashtirish" title="Shriftni kattalashtirish">A+</button>' +
      '</div>' +
      '</div>' +
      '<div id="authMenu" class="auth-menu"></div>' +
      '<button class="nav-mobile-btn" onclick="toggleMobileMenu()" aria-label="Menyu">' +
      '<div class="hamburger"><span></span><span></span><span></span></div>' +
      '</button>' +
      '</div>';
  }
  if (mobileMenu) {
    mobileMenu.innerHTML = NAV_LINKS.map(function (link) {
      return '<a href="' + link.href + '">' + link.label + '</a>';
    }).join('') +
      '<div class="mobile-nav-tools">' +
      '<button type="button" class="tool-btn" id="themeToggleBtnMobile" onclick="toggleTheme()" aria-label="Tungi rejim">' + themeButtonLabel() + ' Tungi rejim</button>' +
      '<button type="button" class="tool-btn" onclick="changeFontSize(-1)" aria-label="Shriftni kichraytirish">A−</button>' +
      '<button type="button" class="tool-btn" onclick="changeFontSize(1)" aria-label="Shriftni kattalashtirish">A+</button>' +
      '</div>';
  }
}

function renderSiteFooter() {
  var footer = document.getElementById('siteFooter');
  if (!footer) return;
  footer.innerHTML =
    '<div class="footer-inner">' +
    '<div class="footer-brand"><h3>NeuroPed</h3><p>Neyropedagogika fanidan zamonaviy elektron darslik. Miya va ta’lim ilmini birlashtirgan ilmiy platforma.</p></div>' +
    '<div class="footer-col"><h4>Kurs</h4><a href="about.html">Darslik haqida</a><a href="topics.html">Mavzular</a><a href="amaliy.html">Amaliy mashg’ulotlar</a></div>' +
    '<div class="footer-col"><h4>Ma’lumot</h4><a href="final-test.html">Yakuniy test</a><a href="literature.html">Adabiyotlar</a><a href="about.html#mualliflar">Mualliflar</a></div>' +
    '<div class="footer-col"><h4>Aloqa</h4><p class="footer-contact">Aloqa: [EMAIL]</p></div>' +
    '</div>' +
    '<div class="footer-bottom"><p>© NeuroPed Elektron Darslik. Barcha huquqlar himoyalangan.</p><p>Neyrofan &bull; Pedagogika &bull; Ta’lim</p></div>';
}

function toggleTheme() {
  try {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    var btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = themeButtonLabel();
    var mobileBtn = document.getElementById('themeToggleBtnMobile');
    if (mobileBtn) mobileBtn.textContent = themeButtonLabel() + ' Tungi rejim';
  } catch (e) {}
}

function changeFontSize(direction) {
  try {
    var current = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--root-fs')) || 16;
    var idx = FONT_SCALES.indexOf(current);
    if (idx === -1) idx = 1;
    idx = Math.min(Math.max(idx + direction, 0), FONT_SCALES.length - 1);
    var next = FONT_SCALES[idx];
    document.documentElement.style.setProperty('--root-fs', next + 'px');
    localStorage.setItem('fontScale', String(next));
  } catch (e) {}
}
