// Iron Nexus — main.js
'use strict';

// ── Mobile Nav Toggle ──
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '✕' : '☰';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#site-header')) {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });

  // Touch-friendly dropdowns on mobile
  document.querySelectorAll('.nav-dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });
}

// ── Active Nav Link ──
(function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a, .dropdown-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) link.classList.add('active');
  });
})();

// ── Scroll-reveal animation ──
function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.exhibit-card, .timeline-card, .station, .citation-entry').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ── Animated counters ──
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1600;
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += stepValue;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          const display = Number.isInteger(target)
            ? Math.round(current).toLocaleString()
            : current.toFixed(1);
          el.textContent = prefix + display + suffix;
        }, duration / steps);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

// ── QR Code generation ──
function initQR() {
  const container = document.getElementById('qr-container');
  if (!container) return;
  const url = container.dataset.url || window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=003087&bgcolor=ffffff&qzone=2`;
  const img = document.createElement('img');
  img.src = qrUrl;
  img.alt = 'QR code to open this website';
  img.width = 200;
  img.height = 200;
  img.loading = 'lazy';
  container.appendChild(img);
}

// ── Footnote tooltips ──
function initFootnoteTooltips() {
  document.querySelectorAll('sup a[href^="#fn"]').forEach(ref => {
    ref.addEventListener('mouseenter', (e) => {
      const id = ref.getAttribute('href').slice(1);
      const fn = document.getElementById(id);
      if (!fn) return;
      const tip = document.createElement('div');
      tip.className = 'fn-tooltip';
      tip.textContent = fn.textContent.replace(/^\[\d+\]\s*/, '');
      tip.style.cssText = `position:fixed;background:var(--blue-dark);color:#fff;font-size:0.8rem;padding:0.6rem 0.9rem;border-radius:6px;max-width:320px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.3);pointer-events:none;border-top:3px solid var(--gold-primary);`;
      const rect = ref.getBoundingClientRect();
      tip.style.top = (rect.top - 10) + 'px';
      tip.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
      document.body.appendChild(tip);
      ref._tip = tip;
    });
    ref.addEventListener('mouseleave', () => {
      if (ref._tip) { ref._tip.remove(); ref._tip = null; }
    });
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll();
  animateCounters();
  initQR();
  initFootnoteTooltips();
});
