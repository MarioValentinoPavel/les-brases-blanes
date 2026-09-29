/* Les Brases — la graella: arrossega la carn, es cou i et diu el preu; títol marcat a la brasa */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// [clau, nom, preu, amplada, alçada, radi, cru, fet]
const MEAT = [
  ['xurrasco', 'Xurrasco a la brasa', '13,90', 124, 72, '22px 30px 26px 20px', '#d9747a', '#5a2a14'],
  ['botifarra', 'Botifarra de pagès', '8,50', 140, 34, '17px', '#e59a9a', '#6e3419'],
  ['secret', 'Secret a la brasa', '11,50', 112, 56, '28px', '#e89a9a', '#6b3016'],
  ['xai', 'Xai a la brasa', '13,50', 96, 64, '40% 40% 18% 18%', '#d87f86', '#5c2c16'],
  ['pollastre', 'Mig pollastre a la brasa', '9,00', 112, 84, '50% 50% 42% 42%', '#f2c9a0', '#9a5a22'],
  ['cansalada', 'Cansalada', '', 116, 30, '8px', 'repeating-linear-gradient(90deg,#f1b8b0 0 14px,#fbe3dc 14px 20px)', '#7a3a1a'],
  ['xorico', 'Xoriço', '', 92, 26, '13px', '#c8423a', '#6b1f14']
];
const board = $('#board'), grill = $('#grill'), items = $('#grillItems');
const pieceHTML = m => `<div class="meat" data-k="${m[0]}" style="--w:${m[3]}px;--h:${m[4]}px;--r:${m[5]};--raw:${m[6]};--done:${m[7]}">
  <span class="meat__raw"></span><span class="meat__done"></span><span class="meat__marks"></span><span class="meat__steam"></span>
  <span class="meat__tag">${m[1]}${m[2] ? ` · <b>${m[2]} €</b>` : ''}</span></div>`;
function fillBoard() { board.innerHTML = MEAT.map(pieceHTML).join(''); $$('.meat', board).forEach(bind); }
function cook(el) {
  el.classList.add('is-cooking'); grill.classList.add('is-hot');
  gsap.fromTo(el, { '--cook': 0 }, { '--cook': 1, duration: 2.6, ease: 'power1.in', onComplete: () => { el.classList.remove('is-cooking'); el.classList.add('is-done'); gsap.from($('.meat__tag', el), { y: 10, scale: .8, duration: .5, ease: 'back.out(2)' }); } });
}
function placeOnGrill(el, x, y) {
  const g = items.getBoundingClientRect();
  const w = el.offsetWidth, h = el.offsetHeight;
  x = Math.max(8, Math.min(g.width - w - 8, x - w / 2)); y = Math.max(40, Math.min(g.height - h - 8, y - h / 2));
  items.appendChild(el);
  gsap.set(el, { position: 'absolute', left: x, top: y, x: 0, y: 0 });
  gsap.from(el, { scale: 1.25, duration: .35, ease: 'power2.out' });
  cook(el);
}
const randomSpot = () => { const g = items.getBoundingClientRect(); return [60 + Math.random() * (g.width - 120), 70 + Math.random() * (g.height - 120)]; };
function bind(el) {
  let sx, sy, moved = false, drag = false;
  el.addEventListener('pointerdown', e => {
    if (el.parentElement === items) return;
    drag = true; moved = false; sx = e.clientX; sy = e.clientY; try { el.setPointerCapture(e.pointerId); } catch (_) {}
    gsap.set(el, { zIndex: 20 });
  });
  el.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    gsap.set(el, { x: dx, y: dy, rotation: dx * .02 });
    const g = grill.getBoundingClientRect();
    grill.classList.toggle('is-over', e.clientX > g.left && e.clientX < g.right && e.clientY > g.top && e.clientY < g.bottom);
  });
  el.addEventListener('pointerup', e => {
    if (!drag) return; drag = false; grill.classList.remove('is-over');
    const g = items.getBoundingClientRect();
    const inside = e.clientX > g.left && e.clientX < g.right && e.clientY > g.top && e.clientY < g.bottom;
    if (!moved) { const [x, y] = randomSpot(); gsap.set(el, { x: 0, y: 0, rotation: 0 }); placeOnGrill(el, x, y); return; }
    if (inside) { gsap.set(el, { x: 0, y: 0, rotation: 0 }); placeOnGrill(el, e.clientX - g.left, e.clientY - g.top); }
    else gsap.to(el, { x: 0, y: 0, rotation: 0, duration: .5, ease: 'back.out(2)' });
  });
}
fillBoard();
$('#parrillada').addEventListener('click', () => {
  ['xurrasco', 'botifarra', 'pollastre', 'cansalada', 'xorico'].forEach((k, i) => {
    let el = $(`.meat[data-k="${k}"]`, board);
    if (!el) return;
    const g = items.getBoundingClientRect();
    setTimeout(() => placeOnGrill(el, g.width * (.2 + (i % 3) * .3), g.height * (i < 3 ? .35 : .72)), i * 180);
  });
});
$('#clear').addEventListener('click', () => { items.innerHTML = ''; grill.classList.remove('is-hot'); fillBoard(); gsap.from($$('.meat', board), { y: -20, opacity: 0, stagger: .05, duration: .4 }); });

/* ---------- entrada: el títol es marca a la brasa ---------- */
gsap.timeline({ delay: .3 })
  .from('.hero__title span', { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12 })
  .to('.hero__title span', { '--sear': '0%', duration: .9, ease: 'power2.inOut', stagger: .2 }, '-=.2')
  .from(['.hero .kicker', '.hero__lead', '.hero__row'], { y: 24, opacity: 0, duration: .8, stagger: .08 }, '-=.8');
gsap.set('.hero__title span', { '--sear': '100%' });

/* ---------- plats ---------- */
const P = [['g03', 'Canelons de la casa'], ['g06', 'Brasa i botifarra'], ['g08', 'Verdures a la brasa'], ['g24', 'Cargols'], ['g25', 'Croquetes'], ['g19', 'Gambes'], ['g32', 'Fideuà amb allioli'], ['g05', 'Guisat de la casa']];
$('#plats').innerHTML = P.map(([s, t]) => `<figure><img src="assets/maps/${s}.jpg" alt="${t}" loading="lazy"><figcaption>${t}</figcaption></figure>`).join('');

gsap.fromTo('.llar img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.llar', start: 'top bottom', end: 'bottom top', scrub: true } });
$$('.head, .board, .grill, .carta div, .menu__paper, .menu__pics img, .llar__txt, .plats__grid figure, .reviews blockquote, .visita > *').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'opacity', scrollTrigger: { trigger: n, start: 'top 90%', once: true } }));
