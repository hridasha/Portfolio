// ---- footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- hero role cycler (typewriter) ----
const roleCycler = document.getElementById('roleCycler');
const roles = ['AI/ML Engineer', 'RAG Systems Builder', 'Computer Vision Engineer', 'LLM Fine-tuner'];

if (roleCycler) {
  if (prefersReducedMotion) {
    roleCycler.textContent = roles[0];
  } else {
    let roleIndex = 0, charIndex = 0, deleting = false;
    const TYPE_MS = 55, DELETE_MS = 30, HOLD_MS = 1600, PAUSE_MS = 300;

    (function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleCycler.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        roleCycler.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, PAUSE_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    })();
  }
}

// ---- browser tab title role cycler (same typewriter style) ----
const baseTitle = 'Hridasha Joshi';

if (!prefersReducedMotion) {
  let titleRoleIndex = 0, titleCharIndex = 0, titleDeleting = false;
  const TITLE_TYPE_MS = 90, TITLE_DELETE_MS = 45, TITLE_HOLD_MS = 1800, TITLE_PAUSE_MS = 400;

  (function titleTick() {
    const current = roles[titleRoleIndex];
    if (!titleDeleting) {
      titleCharIndex++;
      document.title = `${baseTitle} — ${current.slice(0, titleCharIndex)}`;
      if (titleCharIndex === current.length) {
        titleDeleting = true;
        setTimeout(titleTick, TITLE_HOLD_MS);
        return;
      }
      setTimeout(titleTick, TITLE_TYPE_MS);
    } else {
      titleCharIndex--;
      document.title = `${baseTitle} — ${current.slice(0, titleCharIndex)}`;
      if (titleCharIndex === 0) {
        titleDeleting = false;
        titleRoleIndex = (titleRoleIndex + 1) % roles.length;
        setTimeout(titleTick, TITLE_PAUSE_MS);
        return;
      }
      setTimeout(titleTick, TITLE_DELETE_MS);
    }
  })();
}

// ---- nav scroll state + mobile menu ----
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---- scroll to top ----
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- nav active-section highlight ----
const navAnchors = navLinks.querySelectorAll('a[data-section]');
const navSections = Array.from(navAnchors)
  .map(a => document.getElementById(a.dataset.section))
  .filter(Boolean);
if (navSections.length) {
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  navSections.forEach(sec => sectionIo.observe(sec));
}

// ---- reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- count-up telemetry stats ----
const countEls = document.querySelectorAll('.tele-num[data-count]');
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 900;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if (countEls.length) {
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => countIo.observe(el));
}

// ---- experience sub-list expand/collapse (mobile) ----
document.querySelectorAll('[data-sublist-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.previousElementSibling;
    const open = list.classList.toggle('expanded');
    btn.classList.toggle('open', open);
    btn.firstChild.textContent = open ? 'Show fewer ' : 'Show all 7 ';
  });
});

// ---- systems filter tabs ----
const filterTabs = document.querySelectorAll('.filter-tab');
const pipelineCards = document.querySelectorAll('.pipeline-card');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    pipelineCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !show);
    });
  });
});

// ---- project detail modal ----
const projectModal = document.getElementById('projectModal');
const projectModalId = document.getElementById('projectModalId');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalRole = document.getElementById('projectModalRole');
const projectModalDetail = document.getElementById('projectModalDetail');
let activeDetailHome = null;

function openProjectModal(card) {
  const detail = card.querySelector('.pl-detail');
  if (!detail) return;
  const placeholder = document.createComment('pl-detail-slot');
  detail.parentNode.insertBefore(placeholder, detail);
  activeDetailHome = { detail, placeholder };

  projectModalId.textContent = card.querySelector('.pl-id').textContent;
  projectModalTitle.textContent = card.querySelector('h3').textContent;
  projectModalRole.textContent = card.querySelector('.pl-role').textContent;
  detail.classList.add('detail-open');
  projectModalDetail.appendChild(detail);

  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProjectModal() {
  if (activeDetailHome) {
    const { detail, placeholder } = activeDetailHome;
    detail.classList.remove('detail-open');
    placeholder.parentNode.replaceChild(detail, placeholder);
    activeDetailHome = null;
  }
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
}
pipelineCards.forEach(card => {
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(card);
    }
  });
});
projectModal.querySelectorAll('[data-modal-close]').forEach(t => t.addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('modal-close')) closeProjectModal();
}));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal.classList.contains('open')) closeProjectModal();
});

// ---- contact modal ----
const contactModal = document.getElementById('contactModal');

function openContactModal() {
  contactModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const firstField = contactModal.querySelector('input[type="text"]');
  if (firstField) firstField.focus();
}
function closeContactModal() {
  contactModal.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-modal-open]').forEach(t => t.addEventListener('click', openContactModal));
contactModal.querySelectorAll('[data-modal-close]').forEach(t => t.addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('modal-close')) closeContactModal();
}));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('open')) closeContactModal();
});

// ---- copy-to-clipboard for contact rows ----
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = 'copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      /* clipboard unavailable — mailto/tel link still works as fallback */
    }
  });
});

// ---- contact form submit (Web3Forms) ----
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  formMsg.className = 'form-msg';
  formMsg.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    const data = await res.json();
    if (data.success) {
      formMsg.textContent = "Message sent — thanks, I'll get back to you soon.";
      formMsg.classList.add('success');
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Send failed');
    }
  } catch (err) {
    formMsg.textContent = 'Could not send — try emailing directly instead.';
    formMsg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
});
