const root = document.documentElement;
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const linkEls = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const yearEl = document.getElementById('year');

/* Header shadow on scroll */
const onScroll = () => {
  if (window.scrollY > 8) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });

/* Mobile nav */
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}
linkEls.forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

/* Smooth scroll */
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const id = target.getAttribute('href');
  if (id.length > 1) {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  }
});

/* Scroll spy */
const sections = Array.from(document.querySelectorAll('main section[id]'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`.nav-link[href="${id}"]`);
    if (link) {
      if (entry.isIntersecting) link.classList.add('is-active');
      else link.classList.remove('is-active');
    }
  });
}, { threshold: 0.4 });
sections.forEach((s) => observer.observe(s));

/* Reveal animations */
const revealEls = document.querySelectorAll('.section, .card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealEls.forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* Theme handling */
const THEME_KEY = 'preferred-theme-v1';
const applyThemeAttr = (value) => document.documentElement.setAttribute('data-theme', value);
const getStoredTheme = () => localStorage.getItem(THEME_KEY);
const setStoredTheme = (val) => localStorage.setItem(THEME_KEY, val);
const initTheme = () => {
  const stored = getStoredTheme();
  applyThemeAttr(stored || 'dark'); //just change dark to system if want to load in light by default. , like this : (stored || 'system');
};
initTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'system';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    applyThemeAttr(next);
    setStoredTheme(next);
  });
}

/* Contact form basic validation + mailto fallback */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const success = document.getElementById('formSuccess');

    let valid = true;
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    success.textContent = '';

    if (!name.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (message.value.trim().length < 10) {
      messageError.textContent = 'Please write at least 10 characters.';
      valid = false;
    }

    if (!valid) return;

    // const subject = encodeURIComponent('Portfolio Inquiry from ' + name.value.trim());
    // const body = encodeURIComponent(message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')');
    // window.location.href = `mailto:sinhashivam888@gmail.com?subject=${subject}&body=${body}`;
    // window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    // success.textContent = 'Thanks! Your email client should open now. If not, email sinhashivam888@gmail.com.';
    // form.reset();
    const subject = encodeURIComponent('Portfolio Inquiry from ' + name.value.trim());
    const body = encodeURIComponent(message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')');

// Gmail compose link
const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=thenameisking7@gmail.com&su=${subject}&body=${body}`;

window.open(gmailUrl, '_blank'); // open Gmail in a new tab
success.textContent = 'Redirecting you to Gmail...';
form.reset();

  });
}

/* Footer year */
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Typewriter effect
(function initTypewriter(){
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Full Stack Web Developer',
    'Tech Enthusiast',
    'showcasing skills in progress..'
  ];
  const speed = 50;
  const pause = 2000;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = phrases[textIndex];
    if (isDeleting) {
      if (charIndex > 0) {
        charIndex -= 1;
        el.textContent = current.substring(0, charIndex);
      } else {
        isDeleting = false;
        textIndex = (textIndex + 1) % phrases.length;
      }
    } else {
      if (charIndex < current.length) {
        charIndex += 1;
        el.textContent = current.substring(0, charIndex);
      } else {
        setTimeout(() => { isDeleting = true; }, pause);
      }
    }
    const interval = isDeleting ? speed / 2 : speed;
    setTimeout(tick, interval);
  }
  tick();
})();

// Animate skill progress bars on intersection
(function initSkillsProgress(){
  const section = document.querySelector('#skills .skills-cards');
  if (!section) return;
  const cards = Array.from(section.querySelectorAll('.skill-card-lg'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      cards.forEach((card, i) => {
        const level = parseInt(card.getAttribute('data-level') || '0', 10);
        const bar = card.querySelector('.progress-bar');
        const label = card.querySelector('.progress-label');
        setTimeout(() => {
          if (bar) bar.style.width = level + '%';
          // increment percentage counting animation
          let current = 0;
          const step = Math.max(1, Math.round(level / 30));
          const timer = setInterval(() => {
            current += step;
            if (current >= level) { current = level; clearInterval(timer); }
            if (label) label.textContent = current + '%';
          }, 30);
        }, i * 120);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  observer.observe(section);
})();

// About flip card tap handler
(function initFlipCard(){
  const card = document.querySelector('.flip-card');
  if (!card) return;
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('is-flipped');
    }
  });
})();

// Ensure Email instead opens in a new tab/window reliably
(function initEmailInstead(){
  const link = document.getElementById('emailInstead');
  if (!link) return;
  link.addEventListener('click', (e) => {
    try {
      // Some browsers block window.open for mailto, but this maximizes chances
      const href = link.getAttribute('href');
      if (!href) return;
      const w = window.open(href, '_blank', 'noopener,noreferrer');
      if (w) { e.preventDefault(); }
    } catch (_) { /* noop */ }
  });
})(); 