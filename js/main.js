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