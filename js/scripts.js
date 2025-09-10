// Glow-cursor
document.addEventListener('pointermove', e => {
  const x = (e.clientX / innerWidth) * 100 + '%';
  const y = (e.clientY / innerHeight) * 100 + '%';
  document.body.style.setProperty('--mouse-x', x);
  document.body.style.setProperty('--mouse-y', y);
});

// tagline animation: rotates words if target exists
const words = ['impactful', 'ship-ready', 'scalable', 'frictionless', 'measurable'];
let idx = 0;
const animEl = document.querySelector('#landing .tagline #anim-word');
if (animEl) {
  setInterval(() => {
    idx = (idx + 1) % words.length;
    animEl.textContent = words[idx];
  }, 2000);
}




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


document.addEventListener("DOMContentLoaded", () => {
  const hint = document.querySelector(".xp-hint");
  const nav = document.querySelector(".experience-nav");
  if (!hint || !nav) return;

  const hide = () => hint.style.display = "none";
  nav.addEventListener("scroll", hide, { once: true });
  nav.addEventListener("pointerdown", hide, { once: true }); // covers touch+mouse
  nav.addEventListener("click", hide, { once: true });
});



// Accessible Experience tabs + gentle auto-advance (no page jump)
(() => {
  const tabs = [...document.querySelectorAll('.xp-tab')];
  const panes = [...document.querySelectorAll('#jobs .job-pane')];
  const nav = document.querySelector('.experience-nav');
  if (!tabs.length || !panes.length || !nav) return;

  // init visibility
  panes.forEach(p => p.hidden = !p.classList.contains('active'));
  tabs.forEach(t => t.tabIndex = t.classList.contains('active') ? 0 : -1);

  function centerTabHorizontally(idx) {
    // Only adjust the horizontal scroll of the tab strip
    const t = tabs[idx];
    const targetLeft = t.offsetLeft - (nav.clientWidth - t.clientWidth) / 2;
    nav.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }

  function activate(idx, { fromAuto = false } = {}) {
    tabs.forEach((t, i) => {
      const on = i === idx;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      panes[i].classList.toggle('active', on);
      panes[i].hidden = !on;
    });

    // Keep keyboard focus where it was unless user clicked/pressed
    if (!fromAuto) {
      tabs[idx].focus({ preventScroll: true }); // no vertical jump
    }
    centerTabHorizontally(idx); // safe: only horizontal scroll within nav
    activeIndex = idx;
  }

  // Click + keyboard controls
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); activate((i + 1) % tabs.length); }
      if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length); }
      if (k === 'Home') { e.preventDefault(); activate(0); }
      if (k === 'End') { e.preventDefault(); activate(tabs.length - 1); }
    });
  });

  // ---------- Auto-advance ----------
  let activeIndex = tabs.findIndex(t => t.classList.contains('active'));
  if (activeIndex < 0) activeIndex = 0;

  const AUTOPLAY_MS = 5000;
  let timer = null;

  function nextAuto() {
    const next = (activeIndex + 1) % tabs.length;
    activate(next, { fromAuto: true }); // no focus, no jump
  }

  function startAuto() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // respect user setting
    if (!timer) timer = setInterval(nextAuto, AUTOPLAY_MS);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Stop on any real interaction; don’t restart (feels respectful)
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => {
    window.addEventListener(ev, stopAuto, { once: true, passive: true });
  });
  nav.addEventListener('scroll', stopAuto, { once: true, passive: true });

  // Start autoplay only when the Experience section is in view (stop when it leaves)
  const jobs = document.querySelector('#jobs');
  if (jobs && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startAuto(); else stopAuto();
    }, { threshold: 0.5 });
    io.observe(jobs);
  } else {
    // fallback
    window.addEventListener('load', startAuto);
  }

  // Also pause if the tab is hidden (e.g., user switches apps)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
  });
})();

// Mobile hamburger toggle
(() => {
  const nav = document.querySelector('.main-nav');
  const btn = document.querySelector('.menu-toggle');
  const list = document.getElementById('nav-links');
  if (!nav || !btn || !list) return;

  function toggleMenu(force) {
    const open = force ?? !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', () => toggleMenu());

  // close after clicking any link
  list.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') toggleMenu(false);
  });

  // close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();
