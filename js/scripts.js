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




/* ─── ⏳ LOADER DISMISS ──────────────────────────────────────
   Triggers on DOMContentLoaded (HTML parsed) instead of
   window.load (which waits on every image, font + CDN request).
   Holds MIN_MS so the hex-draw animation finishes, then fades.
   CSS carries an independent 2.4s failsafe — see #loader.
   ────────────────────────────────────────────────────────── */
(() => {
  const MIN_MS  = 1200;   // ≥ hex-draw duration (1.15s) so it never cuts off
  const FADE_MS = 500;
  const start   = performance.now();

  function dismiss() {
    const loader = document.getElementById('loader');
    if (!loader || loader.dataset.going) return;
    loader.dataset.going = '1';            // guard against double-firing

    const wait = Math.max(0, MIN_MS - (performance.now() - start));
    setTimeout(() => {
      loader.style.transition   = `opacity ${FADE_MS}ms ease`;
      loader.style.opacity      = '0';
      loader.style.pointerEvents = 'none'; // stop it eating clicks mid-fade
      setTimeout(() => loader.remove(), FADE_MS);
    }, wait);
  }

  // honour reduced-motion: no splash at all
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('loader')?.remove();
    });
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismiss);
  } else {
    dismiss();                             // DOM already parsed
  }
})();


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

// ─── Mobile hamburger ────────────────────────────────────────────
(() => {
  const nav  = document.querySelector('.main-nav');
  const btn  = document.querySelector('.menu-toggle');
  const list = document.getElementById('nav-links');
  if (!nav || !btn || !list) return;

  const icon = btn.querySelector('i');
  const isOpen = () => nav.classList.contains('open');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (icon) {
      icon.classList.toggle('fa-bars', !open);
      icon.classList.toggle('fa-xmark', open);
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!isOpen());
  });

  // close after tapping any link
  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });

  // close when tapping outside the nav
  document.addEventListener('click', (e) => {
    if (isOpen() && !nav.contains(e.target)) setMenu(false);
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setMenu(false);
  });

  // reset if the window grows back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && isOpen()) setMenu(false);
  });
})();
