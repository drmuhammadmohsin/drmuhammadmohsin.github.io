document.addEventListener('DOMContentLoaded', () => {
  initPageSwitcher();
  initMobileMenu();
  initPublicationsFilter();
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
      const section = link.getAttribute('data-section');
      showSection(section);

      // close mobile menu if open
      const mobile = document.getElementById('navMobile');
      if (mobile) mobile.classList.remove('open');
    });
  });

  // Activate "about" by default
  showSection('about');
}


/* ── Mobile Menu ── */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;

  burger.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });
}


/* ── Publications: real-time search, filter tabs, abstract/bibtex toggles ── */
function initPublicationsFilter() {
  const searchInput = document.getElementById('pubSearch');
  const filterBtns  = document.querySelectorAll('.pub-filter-btn');
  const pubItems    = document.querySelectorAll('.pub-entry-item');
  const groupYears  = document.querySelectorAll('.pub-list-year-group');

  if (pubItems.length === 0) return;

  if (searchInput) searchInput.addEventListener('input', filterPublications);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPublications();
    });
  });

  updateTabCounts();

  function filterPublications() {
    const query      = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn  = document.querySelector('.pub-filter-btn.active');
    const filter     = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    pubItems.forEach(item => {
      const type    = item.getAttribute('data-type');
      const title   = item.querySelector('.pub-title')?.textContent.toLowerCase() || '';
      const authors = item.querySelector('.pub-authors-list')?.textContent.toLowerCase() || '';
      const venue   = item.querySelector('.pub-venue-desc')?.textContent.toLowerCase() || '';
      const year    = item.closest('.pub-list-year-group')?.getAttribute('data-year') || '';

      const matchesSearch = !query || title.includes(query) || authors.includes(query) || venue.includes(query) || year.includes(query);
      const matchesFilter = filter === 'all' || type === filter;

      item.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
    });

    groupYears.forEach(group => {
      const visible = group.querySelectorAll('.pub-entry-item');
      const anyVisible = Array.from(visible).some(i => i.style.display !== 'none');
      group.style.display = anyVisible ? 'block' : 'none';
    });
  }

  function updateTabCounts() {
    filterBtns.forEach(btn => {
      const filter    = btn.getAttribute('data-filter');
      const countSpan = btn.querySelector('.pub-filter-count');
      if (!countSpan) return;
      const count = filter === 'all'
        ? pubItems.length
        : Array.from(pubItems).filter(i => i.getAttribute('data-type') === filter).length;
      countSpan.textContent = count;
    });
  }

  // Collapsible abstract/bibtex panels
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

  // Copy BibTeX
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
