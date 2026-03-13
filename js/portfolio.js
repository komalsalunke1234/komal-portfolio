const roleRotator = document.getElementById('role-rotator');
const roles = [
  'Java + Flutter Builder',
  'Full-Stack Developer',
  'DSA Problem Solver',
  'UI-Focused Product Maker'
];

const root = document.documentElement;
const storedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

const siteNav = document.getElementById('site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const filterButtons = [...document.querySelectorAll('.filter-chip')];
const projectCards = [...document.querySelectorAll('.project-card')];
const statNumbers = [...document.querySelectorAll('.stat-number')];
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

if (roleRotator) {
  let roleIndex = 0;
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleRotator.textContent = roles[roleIndex];
  }, 2200);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-10% 0px -40% 0px'
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    projectCards.forEach((card) => {
      const cardFilter = card.dataset.category;
      const isVisible = filter === 'all' || cardFilter === filter;
      card.classList.toggle('is-hidden', !isVisible);
    });
  });
});

function animateValue(element) {
  const target = Number(element.dataset.count || '0');
  const decimals = Number(element.dataset.decimals || '0');
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const current = target * (1 - Math.pow(1 - progress, 3));
    element.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();

    if (progress < 1) {
      window.requestAnimationFrame(frame);
    }
  }

  window.requestAnimationFrame(frame);
}

if ('IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateValue(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((stat) => statsObserver.observe(stat));
} else {
  statNumbers.forEach(animateValue);
}

if (contactForm && formNote) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const body = [
      'Hi Komal,',
      '',
      message,
      '',
      `Name: ${name}`,
      `Email: ${email}`
    ].join('\n');

    const query = new URLSearchParams({
      subject,
      body
    });

    window.location.href = `mailto:komal.22311095@viit.ac.in?${query.toString()}`;
    formNote.textContent = 'Your email client should open now. If it does not, use the direct email link on the left.';
    contactForm.reset();
  });
}

if (window.AOS) {
  window.AOS.init({
    duration: 700,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic'
  });
}