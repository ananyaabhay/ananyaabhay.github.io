    // Glow-cursor
    document.addEventListener('pointermove', e => {
      const x = (e.clientX/innerWidth)*100 + '%';
      const y = (e.clientY/innerHeight)*100 + '%';
      document.body.style.setProperty('--mouse-x', x);
      document.body.style.setProperty('--mouse-y', y);
    });

    // tagline animation: fun → cool → interesting
    const words = ['fun','cool','interesting'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % words.length;
      document.querySelector('#landing .tagline #anim-word')
              .textContent = words[idx];
    }, 2000);

    // jobs tab switching
    document.querySelectorAll('#jobs .experience-nav li').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#jobs .experience-nav li')
                .forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#jobs .job-pane')
                .forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.job).classList.add('active');
      });
    });
    // ensure loader shows at least 1.5s
const start = performance.now();
window.addEventListener('load', () => {
  const elapsed = performance.now() - start;
  const wait    = Math.max(0, 1500 - elapsed);
  setTimeout(() => document.getElementById('loader').remove(), wait);
});


// Fade out loader once the page is fully loaded
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.style.transition = 'opacity 0.5s';
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 500);
});
