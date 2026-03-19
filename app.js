/* ══════════════════════════════════════════
   DevStack — main.js
   ══════════════════════════════════════════ */

// ════════════════════════════════
// PARTICLES
// ════════════════════════════════
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 80; i++) {
  particles.push({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    vx:    (Math.random() - .5) * .4,
    vy:    (Math.random() - .5) * .4,
    r:     Math.random() * 1.5 + .5,
    alpha: Math.random() * .5 + .1
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0)            p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0)             p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,240,255,${p.alpha})`;
    ctx.fill();
  });

  // Connect nearby particles with lines
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,240,255,${.08 * (1 - d / 100)})`;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();


// ════════════════════════════════
// PRODUCTS DATA
// ════════════════════════════════
const allProducts = [
  { icon:'🌐', tags:['HTML5','Beginner'],      title:'HTML5 Complete Guide',   desc:'Build solid semantic foundations for every web project from scratch.',         price:'$29', old:'$59'  },
  { icon:'🎨', tags:['CSS3','Animations'],     title:'CSS3 Mastery',           desc:'Flexbox, Grid, animations, variables — every CSS superpower unlocked.',        price:'$34', old:'$69'  },
  { icon:'⚡', tags:['JavaScript','ES2024'],   title:'JS: Zero to Hero',       desc:'Async/await, modules, closures, and the modern JS ecosystem.',                 price:'$49', old:'$99'  },
  { icon:'⚛️', tags:['React.js','Hooks'],      title:'React.js Bootcamp',      desc:'Build production apps with hooks, context, and React Query.',                  price:'$59', old:'$119' },
  { icon:'🟢', tags:['Node.js','Backend'],     title:'Node.js API Builder',    desc:'REST APIs, authentication, databases — backend done right.',                   price:'$54', old:'$109' },
  { icon:'🌊', tags:['Tailwind','UI'],         title:'Tailwind CSS Design',    desc:'Utility-first design system for blazing-fast beautiful UIs.',                  price:'$39', old:'$79'  },
  { icon:'🐘', tags:['PHP','MySQL'],           title:'PHP & MySQL Pro',        desc:'Server-side scripting and relational databases from scratch.',                  price:'$44', old:'$89'  },
  { icon:'🚌', tags:['Bootstrap','5.x'],       title:'Bootstrap 5 Crash',      desc:'Responsive grids and components that deploy in minutes.',                      price:'$24', old:'$49'  },
  { icon:'🔴', tags:['Angular','TypeScript'],  title:'Angular Enterprise',     desc:'Components, services, RxJS, and NgRx for large-scale apps.',                   price:'$64', old:'$129' },
  { icon:'🐍', tags:['Python','Django'],       title:'Python Web Dev',         desc:'Django REST framework + PostgreSQL for powerful backends.',                    price:'$54', old:'$109' },
  { icon:'🗃️', tags:['SQL','Database'],        title:'SQL & Databases',        desc:'Query optimization, joins, indexes, and schema design.',                       price:'$34', old:'$69'  },
  { icon:'🔷', tags:['TypeScript','Advanced'], title:'TypeScript Deep Dive',   desc:'Type safety, generics, decorators for serious developers.',                    price:'$44', old:'$89'  },
];

const PAGE_SIZE  = 6;
let   currentPage = 0;
const totalPages  = Math.ceil(allProducts.length / PAGE_SIZE);


// ── Render product cards ──
function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const start = currentPage * PAGE_SIZE;
  const slice = allProducts.slice(start, start + PAGE_SIZE);
  grid.innerHTML = '';

  slice.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity   = '0';
    card.style.transform = 'translateY(20px)';
    card.innerHTML = `
      <div class="card-thumb"
           style="background:linear-gradient(135deg,rgba(0,240,255,.05),rgba(124,58,237,.05))">
        <span style="font-size:3.5rem">${p.icon}</span>
      </div>
      <div class="card-body">
        <div class="card-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <div class="card-price">${p.price}<span>${p.old}</span></div>
          <button class="next-btn"
            onclick="addToCart(this, '${p.title}')">Next →</button>
        </div>
      </div>`;
    grid.appendChild(card);

    // Staggered fade-in
    setTimeout(() => {
      card.style.transition = 'opacity .4s, transform .4s';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    }, i * 80 + 50);
  });

  renderPagination();
}


// ── Pagination dots ──
function renderPagination() {
  const pg = document.getElementById('pagination');
  pg.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.className = 'page-dot' + (i === currentPage ? ' active' : '');
    dot.onclick   = () => { currentPage = i; renderProducts(); };
    pg.appendChild(dot);
  }
}


// ── Add to cart feedback ──
function addToCart(btn, title) {
  btn.textContent       = '✅ Added!';
  btn.style.background  = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.textContent      = 'Next →';
    btn.style.background = '';
  }, 2000);
}

renderProducts();


// ════════════════════════════════
// LOGIN MODAL
// ════════════════════════════════
function openLogin()  { document.getElementById('loginModal').classList.add('open');    }
function closeLogin() { document.getElementById('loginModal').classList.remove('open'); }

// Close when clicking the dark overlay
document.getElementById('loginModal').addEventListener('click', function (e) {
  if (e.target === this) closeLogin();
});

function loginAnim() {
  const btn = document.querySelector('.enter-btn');
  btn.textContent = '⚡ Logging in...';
  setTimeout(() => {
    btn.textContent = '✅ Welcome back!';
    setTimeout(() => {
      closeLogin();
      btn.textContent = '⚡ ENTER';
    }, 1200);
  }, 1000);
}


// ════════════════════════════════
// SCROLL-TO-TOP
// ════════════════════════════════
window.addEventListener('scroll', () => {
  const st = document.getElementById('scrollTop');
  if (window.scrollY > 400) st.classList.add('visible');
  else                       st.classList.remove('visible');
});


// ════════════════════════════════
// QR CODE  (drawn on <canvas>)
// ════════════════════════════════
function toggleQR() {
  const popup = document.getElementById('qrPopup');
  popup.classList.toggle('show');
  if (popup.classList.contains('show')) drawQR();
}

function drawQR() {
  const c    = document.getElementById('qr-canvas');
  const cx   = c.getContext('2d');
  const size = 160;
  const cells = 21;
  const cell  = size / cells;

  // White background
  cx.fillStyle = '#ffffff';
  cx.fillRect(0, 0, size, size);

  // QR-style bit matrix
  const qrData = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
    [1,1,1,0,1,1,1,1,0,0,1,0,1,1,1,0,1,1,1,0,1],
    [0,0,1,1,0,0,0,0,1,1,0,1,0,0,1,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,0,1,0],
  ];

  qrData.forEach((row, r) => {
    row.forEach((col, c2) => {
      if (col) {
        cx.fillStyle = '#080b14';
        cx.fillRect(c2 * cell, r * cell, cell - .5, cell - .5);
      }
    });
  });

  // Accent finder pattern (top-left corner)
  cx.fillStyle = '#00f0ff';
  cx.fillRect(0, 0, cell * 7, cell * 7);
  cx.fillStyle = '#fff';
  cx.fillRect(cell, cell, cell * 5, cell * 5);
  cx.fillStyle = '#080b14';
  cx.fillRect(cell * 2, cell * 2, cell * 3, cell * 3);
}


// ════════════════════════════════
// LIVE SEARCH
// ════════════════════════════════
document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();

  // If empty, restore normal paginated view
  if (!q) { renderProducts(); return; }

  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );

  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  document.getElementById('pagination').innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);font-family:'Space Mono',monospace;grid-column:1/-1;text-align:center;padding:3rem 0">
      // No results for "${q}"</p>`;
    return;
  }

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = 'opacity:0;transform:translateY(20px)';
    card.innerHTML = `
      <div class="card-thumb"
           style="background:linear-gradient(135deg,rgba(0,240,255,.05),rgba(124,58,237,.05))">
        <span style="font-size:3.5rem">${p.icon}</span>
      </div>
      <div class="card-body">
        <div class="card-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <div class="card-price">${p.price}<span>${p.old}</span></div>
          <button class="next-btn"
            onclick="addToCart(this,'${p.title}')">Next →</button>
        </div>
      </div>`;
    grid.appendChild(card);
    setTimeout(() => {
      card.style.transition = 'opacity .4s, transform .4s';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    }, i * 80 + 50);
  });
});