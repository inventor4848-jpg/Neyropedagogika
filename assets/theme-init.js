(function () {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    var fontScale = localStorage.getItem('fontScale');
    if (fontScale) {
      document.documentElement.style.setProperty('--root-fs', fontScale + 'px');
    }
  } catch (e) {}
})();
