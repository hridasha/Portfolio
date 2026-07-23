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

// ---- fireflies canvas (nature accent, hero background) ----
const canvas = document.getElementById('fireflies');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function initParticles() {
  const count = Math.min(60, Math.floor((w * h) / 28000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    phase: Math.random() * Math.PI * 2,
    speed: 0.006 + Math.random() * 0.01,
    hue: Math.random() > 0.5 ? '111,207,151' : '224,172,82' // green / gold
  }));
}
initParticles();
window.addEventListener('resize', initParticles);

function tick(t) {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

    const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(p.phase + t * p.speed));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue},${twinkle * 0.7})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${p.hue},${twinkle})`;
    ctx.fill();
  });
  if (!prefersReducedMotion) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
