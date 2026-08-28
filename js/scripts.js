/* ─── ✨ CURSOR SPOTLIGHT ────────────────────────────────────
   rAF-throttled: coalesces bursts of pointer events into one
   write per frame. body::before is a full-viewport gradient with
   mix-blend-mode, so each write costs a whole-screen composite.
   Skipped entirely on touch — no cursor to follow.
   ────────────────────────────────────────────────────────── */
(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let x = '50%', y = '50%', queued = false;

  function paint() {
    queued = false;
    document.body.style.setProperty('--mouse-x', x);
    document.body.style.setProperty('--mouse-y', y);
  }

  document.addEventListener('pointermove', (e) => {
    x = (e.clientX / innerWidth) * 100 + '%';
    y = (e.clientY / innerHeight) * 100 + '%';
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  }, { passive: true });
})();

// Glow-cursor -- backup
/* document.addEventListener('pointermove', e => {
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
} */




/* ─── ⏳ LOADER DISMISS ──────────────────────────────────────
   ────────────────────────────────────────────────────────── */
(() => {
  const MIN_MS = 1400;
  const FADE_MS = 450;
  const start = performance.now();

  function dismissLoader() {
    const loader = document.getElementById('loader');

    if (!loader || loader.dataset.going) return;

    loader.dataset.going = '1';

    const wait = Math.max(
      0,
      MIN_MS - (performance.now() - start)
    );

    setTimeout(() => {
      loader.style.transition = `opacity ${FADE_MS}ms ease`;
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';

      setTimeout(() => {
        loader.remove();
      }, FADE_MS);
    }, wait);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismissLoader);
  } else {
    dismissLoader();
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

/* ─── EXPERIENCE ACCORDION ───────────────────────────────────── */
(() => {
  const jobs = document.querySelector('#jobs');

  const items = [
    ...document.querySelectorAll('#jobs .xp-item')
  ];

  if (!jobs || !items.length) return;


  const triggers = items.map(item =>
    item.querySelector('.xp-trigger')
  );

  const panels = items.map(item =>
    item.querySelector('.xp-panel')
  );


  let activeIndex =
    items.findIndex(item =>
      item.classList.contains('is-open')
    );

  if (activeIndex < 0) {
    activeIndex = 0;
  }


  /* Only one role remains open at a time. */
  function openItem(index) {
    items.forEach((item, i) => {
      const open = i === index;

      item.classList.toggle(
        'is-open',
        open
      );

      triggers[i].setAttribute(
        'aria-expanded',
        String(open)
      );

      panels[i].hidden = !open;
    });

    activeIndex = index;
  }


  /* ── Manual controls ───────────────────────────────────────── */


  triggers.forEach((trigger, index) => {

    trigger.addEventListener(
      'click',
      () => {
        openItem(index);
      }
    );


    trigger.addEventListener(
      'keydown',
      e => {
        const key = e.key;

        if (
          key !== 'ArrowDown' &&
          key !== 'ArrowUp' &&
          key !== 'Home' &&
          key !== 'End'
        ) {
          return;
        }

        e.preventDefault();

        let next = index;

        if (key === 'ArrowDown') {
          next = (index + 1) % items.length;
        }

        if (key === 'ArrowUp') {
          next =
            (index - 1 + items.length) %
            items.length;
        }

        if (key === 'Home') {
          next = 0;
        }

        if (key === 'End') {
          next = items.length - 1;
        }

        openItem(next);

        triggers[next].focus({
          preventScroll: true
        });
      }
    );

  });

  /* Ensure HTML and ARIA begin synchronized. */
  openItem(activeIndex);

})();


// ─── Mobile project expand / collapse ─────────────────────────── 
(() => {
  const projects = document.querySelector('#projects');

  if (!projects) return;

  projects.addEventListener('click', e => {
    const btn = e.target.closest('.project-toggle');

    if (!btn) return;

    const card = btn.closest('.project-card');
    const open = card.classList.toggle('is-open');

    btn.setAttribute('aria-expanded', String(open));

    const label = btn.querySelector('span');

    if (label) {
      label.textContent = open ? 'Show less' : 'See more';
    }
  });
})();

// ─── Mobile hamburger ────────────────────────────────────────────
(() => {
  const nav = document.querySelector('.main-nav');
  const btn = document.querySelector('.menu-toggle');
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

/* ─── 📈 STAT COUNT-UP ───────────────────────────────────────
   Animates each .about-proof number from 0 on first scroll into
   view. Parses the suffix (+ / %) off the existing text so the
   HTML stays the real value — if JS never runs, the correct
   numbers are already on the page.
   ────────────────────────────────────────────────────────── */
(() => {
  const nums = document.querySelectorAll('.about-proof strong');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function run(el) {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = +m[1], suffix = m[2], DUR = 1100;
    const t0 = performance.now();

    (function tick(now) {
      const p = Math.min(1, (now - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);       // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      run(e.target);
      io.unobserve(e.target);                     // fire once only
    });
  }, { threshold: .6 });

  nums.forEach((n) => io.observe(n));
})();
