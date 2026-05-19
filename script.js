/* ===== script.js ===== */

// ---------- NAVBAR ----------
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  scrollTop.classList.toggle('visible', window.scrollY > 400);
});

scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- HAMBURGER ----------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ---------- TYPEWRITER ----------
const phrases = ['Full Stack Developer', 'UI/UX Enthusiast', 'AI/ML Explorer', 'Open Source Contributor', 'Problem Solver'];
let pIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeLoop() {
  const cur = phrases[pIdx];
  tw.textContent = deleting ? cur.substring(0, cIdx--) : cur.substring(0, cIdx++);
  if (!deleting && cIdx === cur.length + 1) { deleting = true; setTimeout(typeLoop, 1400); return; }
  if (deleting && cIdx < 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(typeLoop, deleting ? 55 : 95);
}
typeLoop();

// ---------- PARTICLE CANVAS ----------
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animParticles);
}
animParticles();

// ---------- COUNTER ANIMATION ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (target >= 10 ? '+' : '');
    if (current >= target) clearInterval(interval);
  }, 40);
}

// ---------- SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('.section, .about-card, .skill-category, .project-card, .achieve-card, .contact-item');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate bars inside
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      // Animate counters inside
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Also trigger counters in hero on load
window.addEventListener('load', () => {
  document.querySelectorAll('.stat-num').forEach(el => {
    // Hero stats visible immediately
    if (el.closest('.hero')) animateCounter(el);
  });
  // Hero bar fills
  document.querySelectorAll('.hero .bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
});

// ---------- PROJECT FILTER ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? '' : 'none';
      card.style.animation = match ? 'fadeUp 0.4s ease both' : '';
    });
  });
});

// ---------- EMAILJS INIT ----------
// 🔑 Replace these with YOUR EmailJS credentials (see setup guide below)
const EMAILJS_PUBLIC_KEY = 'GGcQIZC5SfU1scZa1';   // from EmailJS → Account → Public Key
const EMAILJS_SERVICE_ID = 'service_a07yd6m';   // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_v0zgxzh';  // from EmailJS → Email Templates

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ---------- CONTACT FORM ----------
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const templateParams = {
    name:    document.getElementById('name').value,
    email:   document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      submitBtn.textContent = 'Send Message ✉️';
      submitBtn.disabled = false;
      formSuccess.style.display = 'block';
      formSuccess.textContent = '🎉 Message sent! I\'ll get back to you soon.';
      form.reset();
      setTimeout(() => formSuccess.style.display = 'none', 5000);
    })
    .catch((err) => {
      submitBtn.textContent = 'Send Message ✉️';
      submitBtn.disabled = false;
      formSuccess.style.display = 'block';
      formSuccess.style.background = 'rgba(255,80,80,0.15)';
      formSuccess.style.borderColor = 'rgba(255,80,80,0.3)';
      formSuccess.textContent = '❌ Failed to send. Please email me directly at mid81759@gmail.com';
      setTimeout(() => { formSuccess.style.display = 'none'; formSuccess.style.background = ''; formSuccess.style.borderColor = ''; }, 6000);
      console.error('EmailJS error:', err);
    });
});

// ---------- ACTIVE NAV LINK HIGHLIGHT ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
    link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '700' : '';
  });
});

// ---------- SMOOTH NAV CLICK ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
