/* ================= SKILLS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('skills');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Progress bars ---------- */
  const resetBars = (pane) =>
    pane.querySelectorAll('.progress-bar').forEach((b) => (b.style.width = '0%'));

  const fillBars = (pane) =>
    pane.querySelectorAll('.progress-bar').forEach((b) => (b.style.width = b.dataset.width));

  // Replay the animation each time a tab is opened
  document.querySelectorAll('#skillsTabs [data-bs-toggle="pill"]').forEach((tab) => {
    const pane = document.querySelector(tab.dataset.bsTarget);

    tab.addEventListener('show.bs.tab', () => resetBars(pane));
    tab.addEventListener('shown.bs.tab', () => requestAnimationFrame(() => fillBars(pane)));
  });

  /* ---------- Doughnut chart ---------- */
  const canvas = document.getElementById('donutChart');
  const pctEl = document.querySelector('.donut-pct');
  const labelEl = document.querySelector('.donut-label');
  const legendItems = document.querySelectorAll('.legend-item');

  const labels = ['Markup', 'Styling', 'Scripting', 'Testing'];
  const values = [40, 26, 20, 14];
  let chart = null;

  const setCentre = (i) => {
    pctEl.textContent = values[i] + '%';
    labelEl.textContent = labels[i];
  };
  const resetCentre = () => {
    pctEl.textContent = '100%';
    labelEl.textContent = 'Effort';
  };

  const buildChart = () => {
    if (chart || !canvas || !window.Chart) return;

    chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#4F46E5', '#06B6D4', '#FF6B4A', '#F59E0B'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        layout: { padding: 6 },
        animation: reduceMotion ? false : { duration: 1100, easing: 'easeOutQuart' },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        onHover: (e, els) => (els.length ? setCentre(els[0].index) : resetCentre())
      }
    });
  };

  // Highlight a segment when its legend item is hovered
  legendItems.forEach((item) => {
    const i = Number(item.dataset.index);

    item.addEventListener('mouseenter', () => {
      if (!chart) return;
      chart.setActiveElements([{ datasetIndex: 0, index: i }]);
      chart.update();
      setCentre(i);
    });

    item.addEventListener('mouseleave', () => {
      if (!chart) return;
      chart.setActiveElements([]);
      chart.update();
      resetCentre();
    });
  });

  /* ---------- Start everything when the section scrolls into view ---------- */
  const start = () => {
    const activePane = document.querySelector('#skillsTabContent .tab-pane.active');
    if (activePane) fillBars(activePane);
    buildChart();
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      start();
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(section);
});


/* ================= PROJECTS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('#projectGrid .project-item');
  const pills = document.querySelectorAll('.filter-pill');
  const loadWrap = document.getElementById('loadMoreWrap');
  const loadBtn = document.getElementById('loadMoreBtn');
  const modalEl = document.getElementById('projectModal');
  if (!items.length) return;
 
  const labels = {
    'web-apps': 'Web App',
    landing: 'Landing Page',
    dashboards: 'Dashboard',
    ecommerce: 'E-commerce'
  };
 
  let current = 'all';
  let loaded = false;
 
  /* ---------- Filter + load more ---------- */
  const render = () => {
    let pending = 0;
 
    items.forEach((item) => {
      const matches = current === 'all' || item.dataset.category.split(' ').includes(current);
      const isExtra = item.classList.contains('is-extra');
 
      item.classList.toggle('d-none', !(matches && (!isExtra || loaded)));
      if (matches && isExtra && !loaded) pending++;
    });
 
    loadWrap.classList.toggle('d-none', loaded || pending === 0);
  };
 
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      current = pill.dataset.filter;
      pills.forEach((p) => {
        const on = p === pill;
        p.classList.toggle('active', on);
        p.setAttribute('aria-pressed', on);
      });
      render();
    });
  });
 
  loadBtn.addEventListener('click', () => {
    loaded = true;
    render();
  });
 
  /* ---------- Detail modal ---------- */
  modalEl.addEventListener('show.bs.modal', (e) => {
    const item = e.relatedTarget && e.relatedTarget.closest('.project-item');
    if (!item) return;
 
    modalEl.querySelector('#projectModalTitle').textContent =
      item.querySelector('.project-title').textContent;
    modalEl.querySelector('#modalDesc').textContent =
      item.querySelector('.project-desc').textContent;
    modalEl.querySelector('#modalTags').innerHTML =
      item.querySelector('.project-tags').innerHTML;
    modalEl.querySelector('#modalCategory').textContent =
      item.dataset.category.split(' ').map((c) => labels[c]).join(' · ');
  });
 
  render();
});
 
/* ================= TESTIMONIALS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('testimonialCarousel');
  if (!el || !window.bootstrap) return;
 
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  new bootstrap.Carousel(el, {
    interval: 6000,                          // 6 seconds per slide
    ride: reduceMotion ? false : 'carousel', // no auto-play for reduced-motion users
    pause: 'hover',                          // stops while the mouse is over it
    touch: true,                             // swipe on phones
    wrap: true                               // loops from last back to first
  });
});
 
/* ============ Contact form ============ */
(() => {
    const form = document.getElementById('contactForm');
    if (!form) return;
 
    const status = document.getElementById('formStatus');
    const sendBtn = document.getElementById('sendBtn');
 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.className = 'form-status';
        status.textContent = '';
 
        // Show Bootstrap validation styles
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            status.classList.add('is-error');
            status.textContent = 'Please fix the highlighted fields and try again.';
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
 
        // Fake "sending" state (replace with fetch() to a real backend later)
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Sending&hellip;';
 
        setTimeout(() => {
            form.reset();
            form.classList.remove('was-validated');
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send message <span aria-hidden="true">&rarr;</span>';
            status.classList.add('is-success');
            status.textContent = "Thanks! Your message is on its way. I'll reply within one working day.";
        }, 900);
    });
 
    // Clear the status message as soon as the user edits the form again
    form.addEventListener('input', () => {
        if (status.textContent) {
            status.textContent = '';
            status.className = 'form-status';
        }
    });
})();
 
/* ============ Footer ============ */
(() => {
    // Auto-update the copyright year
    const year = document.getElementById('footYear');
    if (year) year.textContent = new Date().getFullYear();
 
    // Newsletter form
    const form = document.getElementById('newsForm');
    if (!form) return;
 
    const input = document.getElementById('newsEmail');
    const status = document.getElementById('newsStatus');
    const btn = form.querySelector('.footer-join');
 
    const setStatus = (msg, type) => {
        status.textContent = msg;
        status.className = 'footer-news-status' + (type ? ' is-' + type : '');
    };
 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
 
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            setStatus(input.value ? 'Please enter a valid email address.' : 'Please enter your email address.', 'error');
            input.focus();
            return;
        }
 
        input.classList.remove('is-invalid');
        btn.disabled = true;
        btn.textContent = '...';
 
        // Fake request (replace with fetch() to a real backend later)
        setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btn.textContent = 'Join';
            setStatus("Thanks for joining! I'll be in touch.", 'success');
        }, 800);
    });
 
    input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        if (status.textContent) setStatus('', '');
    });
})();