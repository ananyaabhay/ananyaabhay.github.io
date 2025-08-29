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

// Accessible Experience tabs (click + arrow keys)
(() => {
  const tabs = Array.from(document.querySelectorAll('.xp-tab'));
  const panes = Array.from(document.querySelectorAll('#jobs .job-pane'));

  function activate(idx) {
    tabs.forEach((t, i) => {
      const selected = i === idx;
      t.classList.toggle('active', selected);
      t.setAttribute('aria-selected', selected);
      t.tabIndex = selected ? 0 : -1;
      panes[i].classList.toggle('active', selected);
      panes[i].hidden = !selected;
    });
    tabs[idx].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'ArrowDown' || key === 'ArrowRight') { e.preventDefault(); activate((i + 1) % tabs.length); }
      if (key === 'ArrowUp' || key === 'ArrowLeft') { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length); }
      if (key === 'Home') { e.preventDefault(); activate(0); }
      if (key === 'End') { e.preventDefault(); activate(tabs.length - 1); }
    });
  });

  // init state
  panes.forEach((p, i) => { p.hidden = !p.classList.contains('active'); });
  tabs.forEach((t, i) => { t.tabIndex = t.classList.contains('active') ? 0 : -1; });
})();


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

// ----- XP "swipe" hint -----
const xpNav = document.querySelector('.experience-nav');
const xpHint = document.querySelector('.xp-hint');
if (xpNav && xpHint) {
  const hideHint = () => xpHint.style.display = 'none';
  xpNav.addEventListener('scroll', hideHint, { once: true });
  xpNav.addEventListener('pointerdown', hideHint, { once: true });
}

// ----- auto-advance tabs  -----
// cycles through .xp-tab every 5s, stops on any interaction
/*
let xpAuto = setInterval(nextXpTab, 5000);
['pointerdown','scroll','keydown'].forEach(ev =>
  window.addEventListener(ev, () => { clearInterval(xpAuto); xpAuto=null; }, { once:true })
);

function nextXpTab(){
  const tabs = [...document.querySelectorAll('.xp-tab')];
  const active = tabs.findIndex(t => t.classList.contains('active'));
  const next = tabs[(active + 1) % tabs.length];
  if (!next) return;
  next.click();
  // ensure the active tab is visible in the strip
  next.scrollIntoView({ inline:'center', behavior:'smooth', block:'nearest' });
}
*/
