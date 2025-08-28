// Glow-cursor
document.addEventListener('pointermove', e => {
  const x = (e.clientX / innerWidth) * 100 + '%';
  const y = (e.clientY / innerHeight) * 100 + '%';
  document.body.style.setProperty('--mouse-x', x);
  document.body.style.setProperty('--mouse-y', y);
});

// tagline animation: fun → cool → interesting
const words = ['impactful', 'ship-ready', 'scalable', 'frictionless', 'measurable'
];
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

// ensure loader is visible at least 1.2s, then fade out and remove safely
const start = performance.now();

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const elapsed = performance.now() - start;
  const wait = Math.max(0, 1200 - elapsed);

  setTimeout(() => {
    loader.style.transition = 'opacity 0.5s';
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader && loader.parentNode) loader.remove();
    }, 500);
  }, wait);
});


// timeline fade-in on scroll
window.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.tl-content');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    // fallback: show all if no IO support
    items.forEach(el => el.classList.add('is-in'));
  }
});
