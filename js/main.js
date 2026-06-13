/* ==========================================================================
   Dr. Muhammad Mohsin - Academic Portfolio Redesign Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initTheme();
  initMobileMenu();
  initScrollspy();
  initPublicationsFilter();
  initCountdown();
  initBackToTop();
});

/* ==========================================================================
   THEME TOGGLER (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleMobileBtn = document.getElementById('themeToggleMobileBtn');
  
  if (!themeToggleBtn && !themeToggleMobileBtn) return;
  
  // Check stored theme or system preference
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = 'light';
  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    currentTheme = 'dark';
  }
  
  // Apply initial theme
  setTheme(currentTheme);
  
  // Event listeners
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
  }
  
  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button icons
    updateThemeIcons(theme);
  }
  
  function updateThemeIcons(theme) {
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    const targets = [
      { btn: themeToggleBtn, textId: 'themeToggleText' },
      { btn: themeToggleMobileBtn, textId: null }
    ];
    
    targets.forEach(target => {
      if (!target.btn) return;
      
      const iconWrap = target.btn.querySelector('.theme-icon-wrap') || target.btn;
      if (theme === 'dark') {
        iconWrap.innerHTML = sunIcon;
        if (target.textId) {
          const textEl = document.getElementById(target.textId);
          if (textEl) textEl.textContent = 'Light Mode';
        }
      } else {
        iconWrap.innerHTML = moonIcon;
        if (target.textId) {
          const textEl = document.getElementById(target.textId);
          if (textEl) textEl.textContent = 'Dark Mode';
        }
      }
    });
  }
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (!menuToggle || !sidebar) return;
  
  // Create overlay if not exists
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.querySelector('.app-container').appendChild(overlay);
  }
  
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking sidebar links
  const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
  
  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

/* ==========================================================================
   SCROLLSPY (Highlight nav as you scroll) & SMOOTH SCROLLING
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section.section, #about');
  const navLinks = document.querySelectorAll('.sidebar-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  // Intersection Observer Options
  const options = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        activateNavLink(id);
      }
    });
  }, options);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  function activateNavLink(id) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll click handler (supporting scrolling offset)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = 80; // Margin offset for mobile header
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - (window.innerWidth <= 1024 ? headerOffset : 30);
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   PUBLICATIONS REAL-TIME SEARCH & FILTER
   ========================================================================== */
function initPublicationsFilter() {
  const searchInput = document.getElementById('pubSearch');
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubItems = document.querySelectorAll('.pub-entry-item');
  const groupYears = document.querySelectorAll('.pub-list-year-group');
  
  if (pubItems.length === 0) return;

  // Real-time Search Listener
  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  // Filter Tab Button Listener
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPublications();
    });
  });

  // Calculate and update counts for tabs on load
  updateTabCounts();

  function filterPublications() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeTabBtn = document.querySelector('.pub-filter-btn.active');
    const activeFilter = activeTabBtn ? activeTabBtn.getAttribute('data-filter') : 'all';

    pubItems.forEach(item => {
      const type = item.getAttribute('data-type');
      
      // Search text components: title, authors, venue, year
      const title = item.querySelector('.pub-title').textContent.toLowerCase();
      const authors = item.querySelector('.pub-authors-list').textContent.toLowerCase();
      const venue = item.querySelector('.pub-venue-desc').textContent.toLowerCase();
      const year = item.closest('.pub-list-year-group') ? item.closest('.pub-list-year-group').getAttribute('data-year') : '';
      
      const matchesSearch = 
        title.includes(query) || 
        authors.includes(query) || 
        venue.includes(query) || 
        year.includes(query);
        
      const matchesFilter = activeFilter === 'all' || type === activeFilter;

      if (matchesSearch && matchesFilter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Clean up empty year group titles
    groupYears.forEach(group => {
      const visibleItemsInGroup = group.querySelectorAll('.pub-entry-item[style="display: flex;"], .pub-entry-item:not([style*="display: none"])');
      if (visibleItemsInGroup.length === 0) {
        group.style.display = 'none';
      } else {
        group.style.display = 'block';
      }
    });
  }

  function updateTabCounts() {
    filterBtns.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const countSpan = btn.querySelector('.pub-filter-count');
      if (!countSpan) return;

      let count = 0;
      if (filter === 'all') {
        count = pubItems.length;
      } else {
        pubItems.forEach(item => {
          if (item.getAttribute('data-type') === filter) {
            count++;
          }
        });
      }
      countSpan.textContent = count;
    });
  }

  // Bind Collapsible Abstract/BibTeX Toggles
  const collapsibleToggles = document.querySelectorAll('.pub-action-link[data-target]');
  collapsibleToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = toggle.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.contains('open');
      
      // Close other panels of the SAME publication
      const parentEntry = panel.closest('.pub-details');
      if (parentEntry) {
        parentEntry.querySelectorAll('.pub-collapsible-panel').forEach(p => {
          if (p !== panel) {
            p.classList.remove('open');
            // Reset text on toggle if necessary
          }
        });
      }

      panel.classList.toggle('open', !isOpen);
    });
  });

  // Bind BibTeX copy buttons
  const copyBtns = document.querySelectorAll('.copy-bibtex-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preEl = btn.nextElementSibling;
      if (!preEl || preEl.tagName !== 'CODE') return;
      
      const bibText = preEl.textContent.trim();
      navigator.clipboard.writeText(bibText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = '#16b981';
        btn.style.borderColor = '#16b981';
        btn.style.color = '#fff';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

/* ==========================================================================
   DEADLINE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');
  const countdownContainer = document.querySelector('.countdown-timer-grid');
  
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  
  // Target deadline date: June 5, 2026 at 23:59:59 (Finland / Eastern European Time is UTC+3)
  // Let's use UTC standard representing 2026-06-05T20:59:59Z to represent 23:59:59 Finnish Time
  const deadlineDate = new Date('2026-06-05T20:59:59Z').getTime();
  
  function updateTimer() {
    const now = new Date().getTime();
    const distance = deadlineDate - now;
    
    if (distance < 0) {
      if (countdownContainer) {
        countdownContainer.innerHTML = `<div style="grid-column: span 4; text-align: center; font-size: 0.9rem; font-weight: 700; color: var(--text-muted); padding: 0.5rem 0;">Submission Closed</div>`;
      }
      return;
    }
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the results with leading zeros
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  // Run once immediately, then every second
  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   BACK TO TOP CONTROL
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
