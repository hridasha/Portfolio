// ---- footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- nav scroll state + mobile menu ----
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

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

// ---- pipeline card tab switcher (diagram / snippet) ----
document.querySelectorAll('.pl-tabs').forEach(tabGroup => {
  const pane = tabGroup.closest('.pl-diagram-pane');
  tabGroup.querySelectorAll('.pl-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabGroup.querySelectorAll('.pl-tab').forEach(t => t.classList.remove('active'));
      pane.querySelectorAll('.pl-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
});
