/* ============================================
   MOTHER'S DAY SURPRISE WEBSITE - script.js
   ============================================ */

/* ---- Page Navigation ---- */
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    // Force reflow so the opacity transition fires properly
    p.style.display = 'none';
  });

  const target = document.getElementById(pageId);
  if (!target) return;

  // Show target page with a slight delay so CSS transitions play
  target.style.display = 'flex';
  // Force reflow
  target.getBoundingClientRect();
  target.classList.add('active');

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Letter Modals ---- */
function openLetter(wrapperEl, letterId) {
  const overlay = document.getElementById(letterId);
  if (!overlay) return;
  overlay.classList.add('open');
  // Prevent background scroll
  document.body.style.overflow = 'hidden';
  // Sparkle burst effect at envelope position
  spawnBurst(wrapperEl);
}

function closeLetter(letterId) {
  const overlay = document.getElementById(letterId);
  if (!overlay) return;
  // Animate out
  overlay.style.animation = 'fadeOut 0.25s ease forwards';
  setTimeout(() => {
    overlay.classList.remove('open');
    overlay.style.animation = '';
    document.body.style.overflow = '';
  }, 240);
}

/* Add fadeOut keyframe dynamically */
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = '@keyframes fadeOut { from { opacity:1; } to { opacity:0; } }';
document.head.appendChild(fadeOutStyle);

/* Close letter when pressing Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.letter-overlay.open').forEach(o => {
      closeLetter(o.id);
    });
  }
});

/* ============================================
   SPARKLE BURST on envelope click
   ============================================ */
function spawnBurst(originEl) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const emojis = ['✨','💖','🌸','⭐','💕','🌟','🎀'];

  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${0.8 + Math.random() * 1.2}rem;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      animation: burst 0.8s ease forwards;
    `;
    spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = (360 / 12) * i + Math.random() * 15;
    const dist  = 60 + Math.random() * 80;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;

    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 820);
  }
}

/* Inject burst keyframe */
const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes burst {
    0%   { transform: translate(0,0) scale(1);   opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
  }
`;
document.head.appendChild(burstStyle);

/* ============================================
   FALLING PETALS ANIMATION
   ============================================ */
const PETALS = ['🌸','🌺','🌼','🌷','🌹','💮','🏵️','✿'];
const container = document.getElementById('petals-container');

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];

  const startX = Math.random() * 110 - 5; // -5vw to 105vw
  const duration = 6 + Math.random() * 10;
  const delay    = Math.random() * 12;
  const size     = 0.8 + Math.random() * 1.2;

  petal.style.left      = `${startX}vw`;
  petal.style.fontSize  = `${size}rem`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay   = `${delay}s`;

  container.appendChild(petal);

  // Remove after animation completes
  setTimeout(() => petal.remove(), (duration + delay) * 1000);
}

// Spawn petals continuously
function spawnPetals() {
  createPetal();
  // Vary the interval so it feels organic
  setTimeout(spawnPetals, 600 + Math.random() * 1000);
}
spawnPetals();

/* ============================================
   TWINKLING GLITTER ON HERO TITLE
   ============================================ */
function spawnGlitter() {
  const hero = document.getElementById('hero-page');
  if (!hero || !hero.classList.contains('active')) {
    requestAnimationFrame(spawnGlitter);
    return;
  }

  const g = document.createElement('div');
  const x = 15 + Math.random() * 70; // keep away from edges
  const y = 20 + Math.random() * 60;
  const symbols = ['✦','✧','⋆','·','✸'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];

  g.style.cssText = `
    position: absolute;
    left: ${x}%;
    top: ${y}%;
    font-size: ${0.5 + Math.random() * 0.9}rem;
    color: #f2c45a;
    pointer-events: none;
    z-index: 1;
    animation: twinkle ${0.8 + Math.random() * 1}s ease forwards;
    user-select: none;
  `;
  g.textContent = sym;
  hero.appendChild(g);
  setTimeout(() => g.remove(), 1800);

  setTimeout(spawnGlitter, 200 + Math.random() * 400);
}

/* Twinkle keyframe */
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
  @keyframes twinkle {
    0%   { opacity: 0; transform: scale(0.5) rotate(0deg); }
    40%  { opacity: 1; transform: scale(1.2) rotate(20deg); }
    100% { opacity: 0; transform: scale(0.3) rotate(40deg); }
  }
`;
document.head.appendChild(twinkleStyle);
spawnGlitter();

/* ============================================
   HERO TITLE LETTER-BY-LETTER GLOW
   ============================================ */
window.addEventListener('DOMContentLoaded', () => {
  const mothersEl = document.querySelector('.main-title .mothers');
  if (mothersEl) {
    const text = mothersEl.textContent;
    mothersEl.innerHTML = text.split('').map((char, i) => {
      if (char === ' ') return ' ';
      return `<span style="
        display:inline-block;
        animation: letterWave 2.5s ease-in-out ${i * 0.08}s infinite;
      ">${char}</span>`;
    }).join('');
  }
});

/* Letter wave keyframe */
const waveStyle = document.createElement('style');
waveStyle.textContent = `
  @keyframes letterWave {
    0%, 100% { transform: translateY(0px);    }
    50%       { transform: translateY(-6px); }
  }
`;
document.head.appendChild(waveStyle);