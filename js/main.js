document.addEventListener('DOMContentLoaded', () => {
  initPageSwitcher();
  initMobileMenu();
  initPublicationToggles();
});


/* ── Page Switcher: show only one section at a time ── */
function initPageSwitcher() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.page-section');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById('page-' + id);
    if (target) target.classList.add('active');

    navLinks.forEach(l => {
      if (l.getAttribute('data-section') === id) l.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.getAttribute('data-section'));
      const mobile = document.getElementById('navMobile');
      if (mobile) mobile.classList.remove('open');
    });
  });

  showSection('about');
}


/* ── Mobile Menu ── */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;
  burger.addEventListener('click', () => mobile.classList.toggle('open'));
}


/* ── Publication abstract / BibTeX toggles ── */
function initPublicationToggles() {
  document.querySelectorAll('.pub-action-link[data-target]').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = document.getElementById(toggle.getAttribute('data-target'));
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      toggle.closest('.pub-details')?.querySelectorAll('.pub-collapsible-panel').forEach(p => p.classList.remove('open'));
      if (!isOpen) panel.classList.add('open');
    });
  });

  document.querySelectorAll('.copy-bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.nextElementSibling;
      if (!code || code.tagName !== 'CODE') return;
      navigator.clipboard.writeText(code.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.cssText = 'background:#16b981;border-color:#16b981;color:#fff;';
        setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 2000);
      });
    });
  });
}
