(() => {
const AP = {
  photocraft: ['PhotoCraft', '#2f7bf5', '#1a5bc4', '#7fb0ff'], vectorcraft: ['VectorCraft', '#e8573f', '#b83a24', '#ff8a70'],
  filmcraft: ['FilmCraft', '#8b5cf6', '#6a3fd6', '#b69cff'], lightcraft: ['LightCraft', '#f2a516', '#8a5800', '#ffc14d'],
  pdfcraft: ['PdfCraft', '#12a58a', '#0a7563', '#3fd6b8'], effectcraft: ['EffectCraft', '#e0368f', '#b0206c', '#ff7ab8'],
  designcraft: ['DesignCraft', '#7bb51c', '#457008', '#a6e04a'], figcraft: ['FigCraft', '#02da96', '#047a56', '#4fe8b6'],
  wordcraft: ['WordCraft', '#3f5fe0', '#2a44b8', '#8ea2ff'], soundcraft: ['SoundCraft', '#1fa5c9', '#0e7290', '#5fd0ee'],
  deckcraft: ['DeckCraft', '#f07a1e', '#a84f0a', '#ffa060'], cadcraft: ['CADCraft', '#3ea6e8', '#1a6fa8', '#7cc8ff'],
  gridcraft: ['GridCraft', '#1f9d55', '#12703a', '#4fd68a'], solidcraft: ['SolidCraft', '#46a1fb', '#1653ae', '#8cc4ff'], artcraft: ['ArtCraft', '#4e7bfb', '#2a52c4', '#8aa8ff'],
  'craft-launcher': ['Launcher', '#8a8a90', '#55555c', '#b5b5bb'], anicraft: ['AniCraft', '#c25bd6', '#8e2fa3', '#e29af0'],
};
const NEU = ['#9a958c', '#6b665e', '#c2bdb4'];
const ORD = Object.keys(AP);
const dk = matchMedia('(prefers-color-scheme: dark)');
const ap = (n) => AP[n.toLowerCase()] || [n, ...NEU];
const col = (n) => ap(n)[1];
const ink = (n) => ap(n)[dk.matches ? 3 : 2];
const ico = (n) => AP[n.toLowerCase()] && !/^(artcraft|craft-launcher|anicraft)$/.test(n.toLowerCase()) ? `icons/${n.toLowerCase()}.png` : 'icons/artcraft-launcher.svg';
const gu = (n) => `https://github.com/${encodeURIComponent((S && S.rs.find((x) => x.n === n) || {}).w || 'storytold')}/${encodeURIComponent(n)}`;
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const av = (l, i, s = 48) => i ? `https://avatars.githubusercontent.com/u/${i}?s=${s}&v=4` : `https://avatars.githubusercontent.com/${encodeURIComponent(l)}?s=${s}`;
const nf = new Intl.NumberFormat('en-US');
const N = (x) => x == null ? '–' : nf.format(x);
const du = (s) => s == null ? '–' : s < 3600 ? Math.max(1, Math.round(s / 60)) + 'm' : s < 86400 ? (s / 3600).toFixed(s < 36000 ? 1 : 0) + 'h' : (s / 86400).toFixed(s < 864000 ? 1 : 0) + 'd';
const ago = (t) => { const s = Date.now() / 1000 - t; return s < 3600 ? Math.max(1, Math.round(s / 60)) + 'm ago' : s < 86400 ? Math.round(s / 3600) + 'h ago' : s < 86400 * 30 ? Math.round(s / 86400) + 'd ago' : dt(t); };
const dt = (t, y) => new Date(t * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(y ? { year: 'numeric' } : {}) });
const ts = (x) => Date.parse(x) / 1000;
const nk = (k, v) => v == null ? '–' : `<span data-k="${esc(k)}" data-v="${v}">${N(v)}</span>`;
const NV = new Map(), rm = matchMedia('(prefers-reduced-motion: reduce)');
function roll() {
  document.querySelectorAll('[data-k]').forEach((el) => {
    const k = el.dataset.k, v = +el.dataset.v, o = NV.get(k);
    NV.set(k, v);
    if (o == null || o === v || rm.matches) return;
    const t0 = performance.now(), D = Math.min(2400, 900 + 120 * Math.abs(v - o));
    el.textContent = N(o); el.classList.add('up');
    const f = (t) => {
      const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3);
      el.textContent = N(Math.round(o + (v - o) * e));
      if (p < 1 && el.isConnected) requestAnimationFrame(f); else el.classList.remove('up');
    };
    requestAnimationFrame(f);
  });
}
const sa = (t) => { const s = Math.max(0, Math.round(Date.now() / 1000 - t)); return s < 60 ? s + 's ago' : ago(t); };
setInterval(() => { const e = $('#upd'); if (e && S) e.textContent = sa(S.at); }, 1000);

let S = null, ME = null, ON = false, hid = new Set(), per = 'all', srt = null, lim = 50, q = '';

const tip = $('#tip');
document.addEventListener('mousemove', (e) => {
  const t = e.target.closest && e.target.closest('[data-t]');
  if (!t) { tip.style.display = 'none'; return; }
  tip.innerHTML = t.dataset.t;
  tip.style.display = 'block';
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(innerWidth - w - 8, e.clientX + 14) + 'px';
  tip.style.top = (e.clientY + h + 20 > innerHeight ? e.clientY - h - 12 : e.clientY + 16) + 'px';
});

async function get(u) { const r = await fetch(u, { credentials: 'same-origin' }); if (!r.ok) { const e = new Error(r.status); e.s = r.status; throw e; } return r.json(); }

function hdr() {
  const r = location.hash.split('/')[1] || '';
  $('#nav').innerHTML = [['', 'Overview'], ['people', 'Leaderboard'], ['releases', 'Releases'], ['week', 'This week'], ...(ME ? [['me', 'You']] : [])]
    .map(([k, t]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}">${t}</a>`).join('');
  $('#acct').innerHTML = ME
    ? `<a href="#/me" title="${esc(ME.l)}"><img src="${av(ME.l, ME.i, 52)}" alt="${esc(ME.l)}"></a><button class="btn" id="out">Sign out</button>`
    : ON ? `<a class="btn pri" href="/auth/login">${GH}<span class="hide-s">Sign in with GitHub</span></a>` : '';
  const o = $('#out');
  if (o) o.onclick = async () => { await fetch('/auth/logout', { method: 'POST' }); ME = null; location.hash = '#/'; route(); };
}
const GH = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

function ax(mx) {
  const st = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
  const s = st.find((x) => mx / x <= 4) || Math.ceil(mx / 4);
  const top = Math.max(s, Math.ceil(mx / s) * s);
  const t = []; for (let v = 0; v <= top; v += s) t.push(v);
  return { top, t };
}

function bch(D, o = {}) {
  const W = o.W || 900, H = o.H || 170, L = 40, B = 22, T = 6, n = D.length || 1, bw = (W - L) / n, st = Math.max(1, Math.round(n / (o.lb || 7)));
  const { top, t } = ax(Math.max(1, ...D.map((d) => d[1])));
  const y = (x) => T + (H - T - B) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${big(x)}</text>`).join('');
  D.forEach((d, i) => {
    const x = L + i * bw;
    g += `<rect x="${x + .5}" y="${y(d[1])}" width="${Math.max(1, bw - 1.5)}" height="${(H - T - B) * d[1] / top}" fill="${o.c || 'var(--accent)'}"/>`;
    g += `<rect class="hv" x="${x}" y="${T}" width="${bw}" height="${H - T - B}" data-t="${esc(`<b>${o.wk ? 'Week of ' : ''}${dt(d[0], 1)}</b><br>${N(d[1])} ${o.u || ''}`)}"/>`;
    if (i % st === 0) g += `<text x="${x}" y="${H - 6}">${dt(d[0])}</text>`;
  });
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function lch(D, o = {}) {
  const W = o.W || 560, H = o.H || 200, L = 44, B = 22, T = 8, n = D.length;
  if (n < 2) return '<p class="empty">Not enough history yet.</p>';
  const t0 = D[0][0], t1 = D[n - 1][0], { top, t } = ax(Math.max(1, ...D.map((d) => d[1])));
  const X = (v) => L + (W - L - 4) * (v - t0) / Math.max(1, t1 - t0), y = (x) => T + (H - T - B) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${big(x)}</text>`).join('');
  for (let i = 0; i < 5; i++) { const v = t0 + (t1 - t0) * i / 4; g += `<text x="${X(v)}" y="${H - 6}" text-anchor="${i === 4 ? 'end' : i ? 'middle' : 'start'}">${dt(v, t1 - t0 > 300 * 86400)}</text>`; }
  const pts = D.map((d) => `${X(d[0]).toFixed(1)},${y(d[1]).toFixed(1)}`).join(' ');
  const hv = D.map((d, i) => { const a = i ? (X(D[i - 1][0]) + X(d[0])) / 2 : L, b = i < n - 1 ? (X(d[0]) + X(D[i + 1][0])) / 2 : W; return `<rect class="hv" x="${a}" y="${T}" width="${Math.max(0.5, b - a)}" height="${H - T - B}" data-t="${esc(`<b>${dt(d[0], 1)}</b><br>${N(d[1])} ${o.u || ''}`)}"/>`; }).join('');
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}<polygon points="${L},${y(0)} ${pts} ${X(t1)},${y(0)}" fill="var(--accent)" fill-opacity=".12"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/>${hv}</svg>`;
}
const dlt = (v, u = 'this week') => v ? `<span class="sub">+${N(v)} ${u}</span>` : '';

function vi() {
  const t = S.days.map((d) => d[3].reduce((a, b) => a + b, 0));
  const mx = Math.max(...t), f = t.findIndex((x) => x >= Math.max(3, mx * .05));
  return Math.max(0, Math.min(f < 0 ? 0 : f - 2, S.days.length - 21));
}
function daily() {
  const DD = S.days.slice(vi());
  const W = 900, H = 230, L = 34, B = 22, T = 6, n = DD.length, bw = (W - L) / n, st = Math.max(1, Math.round(n / 7));
  const v = DD.map((d) => d[3].reduce((s, x, i) => s + (hid.has(S.rs[i].n) ? 0 : x), 0));
  const { top, t } = ax(Math.max(1, ...v));
  const y = (x) => T + (H - T - B) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${x}</text>`).join('');
  DD.forEach((d, i) => {
    let a = 0; const x = L + i * bw, rows = [];
    d[3].forEach((m, j) => {
      const nm = S.rs[j].n;
      if (!m || hid.has(nm)) return;
      const h = (H - T - B) * m / top;
      g += `<rect x="${x + .5}" y="${y(a) - h}" width="${Math.max(1, bw - 1.5)}" height="${h}" fill="${col(nm)}"/>`;
      a += m; rows.push([m, nm]);
    });
    rows.sort((p, r) => r[0] - p[0]);
    const tt = `<b>${dt(d[0], 1)}</b><br>${N(a)} merged, ${N(d[1])} opened<br>${rows.slice(0, 6).map(([m, nm]) => `<i style="background:${col(nm)}"></i>${esc(ap(nm)[0])} ${m}`).join('<br>')}`;
    g += `<rect class="hv" x="${x}" y="${T}" width="${bw}" height="${H - T - B}" data-t="${esc(tt)}"/>`;
    if (i % st === 0) g += `<text x="${x}" y="${H - 6}">${dt(d[0])}</text>`;
  });
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

function legend() {
  return `<div class="leg">${S.rs.filter((x) => x.o).sort((a, b) => ORD.indexOf(a.n) - ORD.indexOf(b.n)).map((r) => `<button data-a="${esc(r.n)}" class="${hid.has(r.n) ? 'off' : ''}"><i style="background:${col(r.n)}"></i>${esc(ap(r.n)[0])}</button>`).join('')}</div>`;
}

function growth() {
  let c = S.pre;
  const cm = S.days.map((d) => (c += d[5])), o = vi(), DD = S.days.slice(o), CC = cm.slice(o);
  const W = 560, H = 230, L = 40, R = 40, B = 22, T = 6, n = DD.length, bw = (W - L - R) / n, st = Math.max(1, Math.round(n / 5));
  const ma = ax(Math.max(1, ...DD.map((d) => d[4]))), ca = ax(Math.max(1, ...CC));
  const y = (x, tp) => T + (H - T - B) * (1 - x / tp);
  let g = ma.t.map((x) => `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(x, ma.top)}" y2="${y(x, ma.top)}"/><text x="${L - 6}" y="${y(x, ma.top) + 3}" text-anchor="end">${x}</text>`).join('');
  g += ca.t.map((x) => `<text x="${W - R + 6}" y="${y(x, ca.top) + 3}">${x >= 1000 ? (x / 1000) + 'k' : x}</text>`).join('');
  let pts = '', hv = '';
  DD.forEach((d, i) => {
    const x = L + i * bw;
    g += `<rect x="${x + .5}" y="${y(d[4], ma.top)}" width="${Math.max(1, bw - 1.5)}" height="${(H - T - B) * d[4] / ma.top}" fill="var(--line2)"/>`;
    pts += `${x + bw / 2},${y(CC[i], ca.top)} `;
    hv += `<rect class="hv" x="${x}" y="${T}" width="${bw}" height="${H - T - B}" data-t="${esc(`<b>${dt(d[0], 1)}</b><br>${d[4]} merged something<br>${d[5]} first PR<br>${N(CC[i])} total`)}"/>`;
    if (i % st === 0) g += `<text x="${x}" y="${H - 6}">${dt(d[0])}</text>`;
  });
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/>${hv}</svg>`;
}

function hist() {
  const lb = ['<1h', '1–3h', '3–6h', '6–12h', '12–24h', '1–2d', '2–4d', '4–7d', '>7d'];
  const W = 340, H = 230, B = 22, T = 18, n = S.hist.length, bw = W / n, mx = Math.max(1, ...S.hist), tot = S.hist.reduce((a, b) => a + b, 0) || 1;
  let g = `<line class="gl" x1="0" x2="${W}" y1="${H - B}" y2="${H - B}"/>`;
  S.hist.forEach((v, i) => {
    const h = (H - T - B) * v / mx, x = i * bw;
    g += `<rect x="${x + 3}" y="${H - B - h}" width="${bw - 6}" height="${h}" fill="var(--accent)"/>`;
    g += `<text x="${x + bw / 2}" y="${H - B - h - 5}" text-anchor="middle">${Math.round(v / tot * 100)}%</text>`;
    g += `<text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${lb[i]}</text>`;
    g += `<rect class="hv" x="${x}" y="0" width="${bw}" height="${H}" data-t="${esc(`<b>${lb[i]}</b><br>${N(v)} PRs`)}"/>`;
  });
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

function heat() {
  const off = -new Date().getTimezoneOffset() / 60, m = Array.from({ length: 7 }, () => new Array(24).fill(0));
  S.heat.forEach((r, d) => r.forEach((v, h) => { let lh = h + off, ld = d + Math.floor(lh / 24); lh = ((lh % 24) + 24) % 24; ld = ((ld % 7) + 7) % 7; m[ld][Math.floor(lh)] += v; }));
  const dn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], mx = Math.max(1, ...m.flat());
  const W = 900, L = 36, T = 4, cw = (W - L) / 24, chh = 22, H = T + 7 * chh + 20;
  let g = '';
  m.forEach((r, d) => {
    g += `<text x="0" y="${T + d * chh + 15}">${dn[d]}</text>`;
    r.forEach((v, h) => {
      const a = v ? .1 + .9 * Math.sqrt(v / mx) : 0;
      g += `<rect x="${L + h * cw + 1}" y="${T + d * chh + 1}" width="${cw - 2}" height="${chh - 2}" fill="var(--accent)" fill-opacity="${a.toFixed(3)}" data-t="${esc(`<b>${dn[d]} ${String(h).padStart(2, '0')}:00</b><br>${N(v)} merged`)}"/>`;
      if (!v) g += `<rect x="${L + h * cw + 1}" y="${T + d * chh + 1}" width="${cw - 2}" height="${chh - 2}" fill="var(--sunken)" pointer-events="none"/>`;
    });
  });
  for (let h = 0; h < 24; h += 3) g += `<text x="${L + h * cw + 2}" y="${H - 4}">${String(h).padStart(2, '0')}</text>`;
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

function apps() {
  const r = S.rs.filter((x) => x.o || x.cm).sort((a, b) => b.cm - a.cm || b.m - a.m), mx = Math.max(1, ...r.map((x) => x.cm));
  return `<div class="tw"><table><thead><tr><th>App</th><th class="n">Commits</th><th class="n hide-s">Merged</th><th class="n hide-s">Stars</th><th class="n hide-s">Downloads</th><th class="hide-s">Built by</th><th style="width:14%" class="hide-s"></th></tr></thead><tbody>${r.map((x) => `<tr class="lk" data-go="#/app/${encodeURIComponent(x.n)}">
    <td style="white-space:nowrap"><a class="app" href="#/app/${encodeURIComponent(x.n)}" style="color:${ink(x.n)};display:inline-flex;vertical-align:middle"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a>${x.x ? ' <span class="st n" style="margin-left:8px;vertical-align:middle" title="Maintained outside ArtCraft">Community</span>' : ''}</td>
    <td class="n">${nk('a.c.' + x.n, x.cm)}</td><td class="n hide-s dim">${nk('a.m.' + x.n, x.m)}</td><td class="n hide-s dim">${big(x.s)}</td><td class="n hide-s dim">${x.dl ? big(x.dl) : '–'}</td><td class="hide-s" style="white-space:nowrap">${x.b ? `<a class="dim" href="#/u/${encodeURIComponent(x.b)}">${esc(x.b)}</a>` : '<span class="dim">–</span>'}</td>
    <td class="hide-s"><div class="bar"><i style="width:${x.cm / mx * 100}%;background:${col(x.n)}"></i></div></td></tr>`).join('')}</tbody></table></div>`;
}
const pc0 = (x) => x == null ? '–' : Math.round(x * 100) + '%';
const QG = { OK: ['g', 'Passed'], ERROR: ['b', 'Failed'], WARN: ['w', 'Warning'] };
function qual() {
  const r = S.rs.filter((x) => x.q && x.q.ncloc).sort((a, b) => b.q.ncloc - a.q.ncloc);
  if (!r.length) return '';
  const k = (x, f, d = 0) => x == null ? '–' : f ? x.toFixed(d) + f : N(x);
  return `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Code quality</h2><span class="sub">SonarCloud, main branch</span></div><div class="tw"><table><thead><tr><th>App</th><th>Quality gate</th><th class="n">Code smells</th><th class="n">Per 1k lines</th><th class="n hide-s">Bugs</th><th class="n hide-s">Vulnerabilities</th><th class="n hide-s">Coverage</th><th class="n hide-s">Duplication</th><th class="n hide-s">Lines</th></tr></thead><tbody>${r.map((x) => { const q = x.q, g = QG[q.alert_status] || ['n', '–']; return `<tr>
    <td><a class="app" href="https://sonarcloud.io/project/overview?id=${esc(q.k)}" target="_blank" rel="noopener" style="color:${ink(x.n)}"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a></td>
    <td><span class="st ${g[0]}">${g[1]}</span></td><td class="n">${k(q.code_smells)}</td><td class="n">${q.code_smells != null ? (q.code_smells / q.ncloc * 1000).toFixed(1) : '–'}</td>
    <td class="n hide-s dim">${k(q.bugs)}</td><td class="n hide-s dim">${k(q.vulnerabilities)}</td><td class="n hide-s dim">${k(q.coverage, '%', 1)}</td><td class="n hide-s dim">${k(q.duplicated_lines_density, '%', 1)}</td><td class="n hide-s dim">${k(q.ncloc)}</td></tr>`; }).join('')}</tbody></table></div></section>`;
}
const tmt = (x) => x[17] ? `Merged ${N(x[17])} PRs, so likely has write access` : 'Public member of the storytold org';
const TAGS = { mmexicann: '67', wanikhawar: 'Cat' };
const tb = (x) => (x[16] ? `<span class="st n tm" data-t="${esc(tmt(x))}">Team</span>` : '') + (TAGS[x[0].toLowerCase()] ? `<span class="st n tm">${esc(TAGS[x[0].toLowerCase()])}</span>` : '');
function team() {
  if (!S.team || !S.team.length) return '';
  return `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Team</h2><span class="sub">Presumed, from who merges PRs and public org members</span></div><ul class="team">${S.team.map(([l, i, m, pm, k]) => `<li><${k ? `a href="#/u/${encodeURIComponent(l)}"` : `a href="https://github.com/${encodeURIComponent(l)}" target="_blank" rel="noopener"`} class="who"><img loading="lazy" src="${av(l, i)}" alt="">${esc(l)}</a><span class="m">${m ? `${nk('t.' + l, m)} merges` : 'Org member'}</span></li>`).join('')}</ul></section>`;
}
const blt = (b) => !b || !b.length ? '<span class="dim">–</span>' : b.slice(0, 2).map((n) => `<span style="color:${ink(n)}">${esc(ap(n)[0])}</span>`).join(', ') + (b.length > 2 ? ` <span class="dim">+${b.length - 2}</span>` : '');

const PI = { all: 2, '30d': 6, '7d': 5 }, CI = { all: 12, '30d': 19, '7d': 18 }, RI = { all: 20, '30d': 21, '7d': 22 };
function lead(full) {
  const pc = PI[per], cc = CI[per], rc = RI[per];
  let r = S.lead.filter((x) => x[pc] > 0 || x[cc] > 0 || x[rc] > 0 || per === 'all');
  if (srt) r = r.slice().sort((a, b) => (a[srt[0]] == null) - (b[srt[0]] == null) || srt[1] * (a[srt[0]] - b[srt[0]]));
  else r = r.slice().sort((a, b) => b[pc] - a[pc] || b[3] - a[3]);
  const rk = new Map(r.map((x, i) => [x[0], i + 1]));
  if (q) r = r.filter((x) => x[0].toLowerCase().includes(q));
  const lm = full ? lim : 15, sh = r.slice(0, lm);
  const th = (i, t, c = 'n') => `<th class="s ${c} ${srt && srt[0] === i ? 'on' : ''}" data-s="${i}">${t}</th>`;
  const me = ME && ME.l.toLowerCase();
  return `<div class="tw"><table><thead><tr><th class="n">#</th><th>Contributor</th>${th(pc, 'Merged')}${th(cc, 'Commits', 'n hide-s')}${th(rc, 'Reviews', 'n hide-s')}${th(14, 'Merge rate', 'n hide-s')}${th(15, 'Reverted', 'n hide-s')}${th(7, 'Apps', 'n hide-s')}<th class="hide-s">Mostly</th><th class="hide-s">Built</th>${th(11, 'Median merge', 'n hide-s')}${th(10, 'Last active', 'n hide-s')}</tr></thead><tbody>
    ${sh.map((x) => `<tr class="lk ${me === x[0].toLowerCase() ? 'me-row' : ''}" data-u="${esc(x[0])}"><td class="n dim">${rk.get(x[0])}</td>
    <td><span class="who"><img loading="lazy" src="${av(x[0], x[1])}" alt="">${esc(x[0])}${tb(x)}</span></td>
    <td class="n">${nk(`l.${x[0]}.${pc}`, x[pc])}</td><td class="n hide-s dim">${nk(`l.${x[0]}.${cc}`, x[cc])}</td><td class="n hide-s dim">${N(x[rc])}</td><td class="n hide-s dim">${pc0(x[14])}</td><td class="n hide-s dim">${N(x[15])}</td><td class="n hide-s dim">${x[7]}</td>
    <td class="hide-s" style="color:${x[8] ? ink(x[8]) : ''}">${x[8] ? esc(ap(x[8])[0]) : '–'}</td><td class="hide-s">${blt(x[13])}</td><td class="n hide-s dim">${du(x[11])}</td><td class="n hide-s dim">${ago(x[10])}</td></tr>`).join('')}
    </tbody></table></div>${!sh.length ? '<p class="empty">No one matches.</p>' : ''}
    ${full && r.length > lm ? `<button class="btn more" id="more">Show more (${N(r.length - lm)} left)</button>` : ''}
    ${!full ? '<a class="btn more" href="#/people">Full leaderboard</a>' : ''}`;
}
function segs() {
  return `<div class="seg" id="per">${[['all', 'All time'], ['30d', '30 days'], ['7d', '7 days']].map(([k, t]) => `<button data-p="${k}" class="${per === k ? 'on' : ''}">${t}</button>`).join('')}</div>`;
}

function feed() {
  return `<ul class="feed">${S.recent.slice(0, 14).map(([m, rn, nr, ti, l]) => `<li><img src="${ico(rn)}" alt="${esc(ap(rn)[0])}" title="${esc(ap(rn)[0])}">
    <span class="t"><a href="${esc(gu(rn))}/pull/${nr}" target="_blank" rel="noopener">${esc(ti)}</a><br><span class="m"><a href="#/u/${encodeURIComponent(l)}" class="dim">${esc(l)}</a></span></span><span class="m">${ago(m)}</span></li>`).join('')}</ul>`;
}

const PL = [['win', 'Windows', 'var(--accent)'], ['mac', 'macOS', 'var(--strong)'], ['lin', 'Linux', 'var(--good)'], ['bsd', 'FreeBSD', 'var(--bad)'], ['web', 'Web', '#8b5cf6'], ['cli', 'CLI', 'var(--line2)'], ['oth', 'Other', 'var(--faint)']];
const FN = { appimage: 'AppImage', deb: '.deb', rpm: '.rpm', flatpak: 'Flatpak', snap: 'Snap', msi: 'MSI', exe: 'EXE', msix: 'MSIX', dmg: 'DMG', pkg: 'PKG', zip: 'ZIP', 'pkg.tar.zst': 'Arch pkg', 'tar.gz': 'tar.gz', 'tar.xz': 'tar.xz' };
const big = (x) => x == null ? '–' : x >= 1e6 ? (x / 1e6).toFixed(x >= 1e7 ? 1 : 2) + 'M' : x >= 1e4 ? Math.round(x / 1e3) + 'k' : N(x);
const pct = (v, t) => t ? (v / t * 100 >= 10 ? Math.round(v / t * 100) : (v / t * 100).toFixed(1)) + '%' : '–';
function sbar(p, t, h = 6) {
  return `<div class="sbar" style="height:${h}px">${PL.filter(([k]) => p[k]).map(([k, n, c]) => `<i style="width:${p[k] / t * 100}%;background:${c}" data-t="${esc(`<b>${n}</b><br>${N(p[k])}, ${pct(p[k], t)}`)}"></i>`).join('')}</div>`;
}
function dls() {
  const D = S.dl || []; if (!D.length) return '';
  const P = {}, A = {}, F = {}; let T = 0, br = 0, d7 = 0, h7 = D.every((x) => x.d7 != null);
  for (const x of D) { T += x.t; br += x.br ? x.br[0] : 0; d7 += x.d7 || 0; for (const k in x.p) P[k] = (P[k] || 0) + x.p[k]; for (const k in x.a) A[k] = (A[k] || 0) + x.a[k]; for (const k in x.f) F[k] = (F[k] || 0) + x.f[k]; }
  const ot = (P.bsd || 0) + (P.web || 0) + (P.cli || 0) + (P.oth || 0);
  const lst = (o, f, n) => { const e = Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n), mx = Math.max(1, ...e.map((x) => x[1])); return `<table><tbody>${e.map(([k, v]) => `<tr><td>${f(k)}</td><td class="n">${N(v)}</td><td class="n dim">${pct(v, T)}</td><td style="width:40%"><div class="bar"><i style="width:${v / mx * 100}%;background:var(--accent)"></i></div></td></tr>`).join('')}</tbody></table>`; };
  const fk = (k) => { const [p, f] = k.split(':'); return `${esc(FN[f] || f)} <span class="dim">${esc((PL.find((x) => x[0] === p) || [, p])[1])}</span>`; };
  const r = D.slice().sort((a, b) => b.t - a.t), mx = Math.max(1, ...r.map((x) => x.t));
  return `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Downloads</h2><span class="sub">GitHub release assets, all versions</span></div>
  <div class="kpi" style="margin-bottom:20px">
    <div><span class="lbl">Total</span><b>${nk('d.t', T)}</b></div>
    ${h7 ? `<div><span class="lbl">Last 7 days</span><b>${nk('d.7', d7)}</b></div>` : ''}
    <div><span class="lbl">Windows</span><b>${big(P.win)}</b><span class="sub">${pct(P.win, T)}</span></div>
    <div><span class="lbl">macOS</span><b>${big(P.mac)}</b><span class="sub">${pct(P.mac, T)}</span></div>
    <div><span class="lbl">Linux</span><b>${big(P.lin)}</b><span class="sub">${pct(P.lin, T)}</span></div>
    <div><span class="lbl">BSD, Web, CLI</span><b>${big(ot)}</b><span class="sub">${pct(ot, T)}</span></div>
    ${h7 ? '' : `<div><span class="lbl">Homebrew, 30d</span><b>${nk('d.br', br)}</b><span class="sub">installs</span></div>`}
  </div>
  ${(S.dd || []).length >= 2 ? `<h3 class="h3">Per day</h3>${bch(S.dd, { u: 'downloads', H: 150 })}<div style="height:20px"></div>` : ''}
  ${sbar(P, T, 14)}<div class="leg">${PL.filter(([k]) => P[k]).map(([k, n, c]) => `<span><i style="background:${c}"></i>${n} ${pct(P[k], T)}</span>`).join('')}</div>
  <div class="grid g2" style="margin:20px 0 0">
    <div><h3 class="h3">Package formats</h3>${lst(F, fk, 10)}</div>
    <div><h3 class="h3">Architectures</h3>${lst(A, (k) => esc(k === 'universal' ? 'Universal (macOS)' : k), 6)}</div>
  </div>
  <h3 class="h3" style="margin-top:20px">Per app</h3>
  <div class="tw"><table><thead><tr><th>App</th><th class="n">Downloads</th>${h7 ? '<th class="n hide-s">7 days</th>' : ''}<th class="hide-s" style="width:22%">Platforms</th><th class="n hide-s">Windows</th><th class="n hide-s">macOS</th><th class="n hide-s">Linux</th><th class="n hide-s">Homebrew 30d</th><th class="hide-s">Latest</th><th class="n hide-s">Releases</th></tr></thead><tbody>${r.map((x) => `<tr>
    <td style="white-space:nowrap"><a class="app" href="#/app/${encodeURIComponent(x.n)}" style="color:${ink(x.n)}"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a></td>
    <td class="n">${nk('d.a.' + x.n, x.t)}</td>${h7 ? `<td class="n hide-s dim">${N(x.d7)}</td>` : ''}<td class="hide-s">${sbar(x.p, x.t)}</td>
    <td class="n hide-s dim">${big(x.p.win)}</td><td class="n hide-s dim">${big(x.p.mac)}</td><td class="n hide-s dim">${big(x.p.lin)}</td><td class="n hide-s dim">${x.br ? N(x.br[0]) : '–'}</td>
    <td class="hide-s" style="white-space:nowrap">${x.rl[0] ? `<a class="dim" href="${esc(gu(x.n))}/releases/tag/${encodeURIComponent(x.rl[0][0])}" target="_blank" rel="noopener" data-t="${esc(`<b>${x.rl[0][0]}</b><br>${dt(x.rl[0][1], 1)}<br>${N(x.rl[0][2])} downloads`)}">${esc(x.rl[0][0].replace(/^[a-z-]*v(?=\d)/i, 'v'))}</a> <span class="dim">${ago(x.rl[0][1])}</span>` : '–'}</td><td class="n hide-s dim">${x.nr}</td></tr>`).join('')}</tbody></table></div>
  </section>`;
}

function rvl() {
  const r = (S.rvl || []).slice(0, 12); if (!r.length) return '<p class="empty">Reviews are still syncing.</p>';
  const mx = Math.max(1, ...r.map((x) => x[2]));
  return `<table><thead><tr><th>Reviewer</th><th class="n">Reviews</th><th class="n hide-s">30 days</th><th class="hide-s">Mostly</th><th style="width:22%" class="hide-s"></th></tr></thead><tbody>${r.map((x) => `<tr class="lk" data-go="#/u/${encodeURIComponent(x[0])}"><td><span class="who"><img loading="lazy" src="${av(x[0], x[1])}" alt="">${esc(x[0])}</span></td><td class="n">${nk('rv.' + x[0], x[2])}</td><td class="n hide-s dim">${N(x[3])}</td><td class="hide-s" style="color:${ink(x[5])}">${esc(ap(x[5])[0])}</td><td class="hide-s"><div class="bar"><i style="width:${x[2] / mx * 100}%;background:var(--accent)"></i></div></td></tr>`).join('')}</tbody></table>`;
}
function iss() {
  const i = S.is;
  return `<div class="mini">
    <div><span class="lbl">Open</span><b>${nk('i.o', i.o)}</b></div>
    <div><span class="lbl">Opened, 30d</span><b>${nk('i.o30', i.o30)}</b></div>
    <div><span class="lbl">Closed, 30d</span><b>${nk('i.x30', i.x30)}</b></div>
    <div><span class="lbl">First reply</span><b>${du(i.fr)}</b><span class="sub">median, 30d</span></div>
    <div><span class="lbl">Open bugs</span><b>${N(i.b)}</b><span class="sub">${pct(i.b, i.o)} of open</span></div>
    <div><span class="lbl">Open features</span><b>${N(i.f)}</b><span class="sub">${pct(i.f, i.o)} of open</span></div>
  </div>
  <h3 class="h3" style="margin-top:18px">Open per app</h3>${(() => { const r = S.rs.filter((x) => x.is && x.is.o).sort((a, b) => b.is.o - a.is.o).slice(0, 8), mx = Math.max(1, ...r.map((x) => x.is.o)); return `<table><tbody>${r.map((x) => `<tr><td><a class="app" href="#/app/${encodeURIComponent(x.n)}" style="color:${ink(x.n)}"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a></td><td class="n">${N(x.is.o)}</td><td class="n dim hide-s">${x.is.b} bugs</td><td style="width:35%"><div class="bar"><i style="width:${x.is.o / mx * 100}%;background:${col(x.n)}"></i></div></td></tr>`).join('')}</tbody></table>`; })()}`;
}
const cir = (c) => c && c.n ? c.ok / c.n : null;
function cis() {
  const r = S.rs.filter((x) => x.ci && x.ci.n).sort((a, b) => cir(a.ci) - cir(b.ci));
  if (!r.length) return '<p class="empty">No CI data yet.</p>';
  return `<table><thead><tr><th>App</th><th class="n">Pass rate</th><th class="n hide-s">Runs</th><th class="n hide-s">Median run</th><th class="hide-s">Last</th></tr></thead><tbody>${r.map((x) => { const v = cir(x.ci); return `<tr><td><a class="app" href="#/app/${encodeURIComponent(x.n)}" style="color:${ink(x.n)}"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a></td><td class="n"><span style="color:var(${v >= .9 ? '--good' : v >= .7 ? '--muted' : '--bad'})">${pc0(v)}</span></td><td class="n hide-s dim">${N(x.ci.n)}</td><td class="n hide-s dim">${du(x.ci.med)}</td><td class="hide-s" style="white-space:nowrap">${x.ci.last ? `<span class="st ${x.ci.last[0] ? 'g' : 'b'}">${x.ci.last[0] ? 'Passed' : 'Failed'}</span> <span class="dim">${ago(x.ci.last[1])}</span>` : '–'}</td></tr>`; }).join('')}</tbody></table>`;
}

function overview() {
  const k = S.k;
  return `<div class="top"><div><h1>Craft App Bundle contributions</h1></div><span class="sub"><i class="lv"></i>Live${S.sync ? `, syncing ${S.sync} repos` : ''}, updated <span id="upd">${sa(S.at)}</span></span></div>
  ${S.err ? `<div class="err">GitHub sync error: ${esc(S.err)}</div>` : ''}
  <div class="kpi">
    <div><span class="lbl">Contributors</span><b>${nk('k.c', k.c)}</b>${dlt(k.n7)}</div>
    <div><span class="lbl">Merged PRs</span><b>${nk('k.m', k.m)}</b>${dlt(k.m7)}</div>
    <div><span class="lbl">Commits</span><b>${nk('k.cm', k.cm)}</b>${dlt(k.c7)}</div>
    <div><span class="lbl">Reviews</span><b>${nk('k.rv', k.rv)}</b>${dlt(k.rv7)}</div>
    <div><span class="lbl">Stars</span><b>${nk('k.st', k.st)}</b>${S.st.sy ? '' : dlt(k.s7)}</div>
    <div><span class="lbl">Downloads</span><b>${big((S.dl || []).reduce((a, x) => a + x.t, 0))}</b>${dlt((S.dd || []).slice(-7).reduce((a, x) => a + x[1], 0))}</div>
  </div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Merged per day</h2></div><div id="daily">${daily()}</div>${legend()}</section>
  <div class="grid g32">
    <section class="box"><div class="box-h"><h2>Contributors</h2><span class="sub"><span style="color:var(--accent-ink)">Total</span>, active per day</span></div>${growth()}</section>
    <section class="box"><div class="box-h"><h2>Time to merge</h2><span class="sub">Median ${du(k.t)}, first review ${du(k.fr)}, last 30 days</span></div>${hist()}</section>
  </div>
  ${dls()}
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>When PRs get merged</h2><span class="sub">Your local time</span></div>${heat()}</section>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Leaderboard</h2>${segs()}</div><div id="lead">${lead(false)}</div></section>
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Reviewers</h2><span class="sub">Reviews on someone else's PR</span></div>${rvl()}</section>
    <section class="box"><div class="box-h"><h2>Issues</h2>${S.is.sy ? `<span class="sub">Syncing ${S.is.sy} repos</span>` : ''}</div>${iss()}</section>
  </div>
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Stars</h2><span class="sub">${S.st.sy ? `Syncing history, ${S.st.sy} repos left` : `${N(S.st.t)} over time`}</span></div>${S.st.sy && S.st.wk.length < 2 ? '<p class="empty">Star history is still loading.</p>' : lch(S.st.wk, { u: 'stars' })}${S.st.sy ? '' : `<h3 class="h3" style="margin-top:16px">New stars per day</h3>${bch(S.days.map((d, i) => [d[0], S.st.d[i]]).slice(vi()), { W: 560, H: 120, u: 'stars', lb: 5 })}`}</section>
    <section class="box"><div class="box-h"><h2>CI on main</h2><span class="sub">GitHub Actions, push runs, last 14 days</span></div>${cis()}</section>
  </div>
  ${team()}
  ${qual()}
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Apps</h2></div>${apps()}</section>
  <section class="box"><div class="box-h"><h2>Latest merges</h2></div>${feed()}</section>`;
}

function people() {
  return `<div class="top"><h1>Leaderboard</h1><span class="sub">${N(S.lead.length)} contributors</span></div>
  <section class="box"><div class="box-h"><input class="srch" id="q" type="search" placeholder="Find a GitHub user" value="${esc(q)}">${segs()}</div><div id="lead">${lead(true)}</div></section>`;
}

function weekly(prs) {
  const now = Math.floor(Date.now() / 86400000), f = Math.min(...prs.map((p) => Math.floor(p[2] / 86400)));
  const n = Math.min(90, Math.max(14, now - f + 2)), d0 = now - n + 1, b = new Array(n).fill(0), o = new Array(n).fill(0);
  for (const p of prs) {
    const ci = Math.floor(p[2] / 86400) - d0; if (ci >= 0 && ci < n) o[ci]++;
    if (p[3]) { const mi = Math.floor(p[3] / 86400) - d0; if (mi >= 0 && mi < n) b[mi]++; }
  }
  const W = 900, H = 170, L = 30, B = 22, T = 6, bw = (W - L) / n, st = Math.max(1, Math.round(n / 7)), { top, t } = ax(Math.max(1, ...b, ...o));
  const y = (x) => T + (H - T - B) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${x}</text>`).join('');
  for (let i = 0; i < n; i++) {
    const x = L + i * bw, hw = (bw - 2) / 2;
    g += `<rect x="${x + 1}" y="${y(o[i])}" width="${hw}" height="${(H - T - B) * o[i] / top}" fill="var(--line2)"/>`;
    g += `<rect x="${x + 1 + hw}" y="${y(b[i])}" width="${hw}" height="${(H - T - B) * b[i] / top}" fill="var(--accent)"/>`;
    g += `<rect class="hv" x="${x}" y="${T}" width="${bw}" height="${H - T - B}" data-t="${esc(`<b>${dt((d0 + i) * 86400, 1)}</b><br>${o[i]} opened<br>${b[i]} merged`)}"/>`;
    if (i % st === 0) g += `<text x="${x}" y="${H - 6}">${dt((d0 + i) * 86400)}</text>`;
  }
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

function stat(p) {
  const st = p[3] ? ['g', 'Merged'] : p[4] ? ['n', 'Closed'] : ['a', 'Open'];
  return `<span class="st ${st[0]}">${st[1]}</span>`;
}

function strk(ua) {
  const ds = Object.keys(ua).map(Number).filter((d) => ua[d].some((v) => v)).sort((a, b) => a - b);
  let lg = 0, cu = 0, run = 0, pv = null;
  for (const d of ds) { run = pv !== null && d === pv + 1 ? run + 1 : 1; lg = Math.max(lg, run); pv = d; }
  const td = Math.floor(Date.now() / 86400000);
  if (pv !== null && pv >= td - 1) cu = run;
  return { lg, cu, n: ds.length };
}
function cal(ua) {
  const td = Math.floor(Date.now() / 86400000), ds = Object.keys(ua).map(Number);
  const f = ds.length ? Math.min(...ds) : td, w1 = Math.floor((td + 3) / 7), w0 = Math.min(Math.floor((f + 3) / 7), w1 - 15);
  const nw = w1 - w0 + 1, cs = 13, L = 30, T = 16, W = L + nw * cs, H = T + 7 * cs + 4;
  const v = (d) => (ua[d] || [0, 0, 0, 0]).reduce((a, b) => a + b, 0), mx = Math.max(1, ...ds.map(v));
  let g = ['Mon', '', 'Wed', '', 'Fri', '', ''].map((t, i) => t ? `<text x="0" y="${T + i * cs + 10}">${t}</text>` : '').join(''), lm = -1;
  for (let w = w0; w <= w1; w++) {
    const x = L + (w - w0) * cs, m = new Date((w * 7 - 3) * 86400000).getUTCMonth();
    if (m !== lm) { g += `<text x="${x}" y="10">${new Date((w * 7 - 3) * 86400000).toLocaleDateString('en-GB', { month: 'short' })}</text>`; lm = m; }
    for (let i = 0; i < 7; i++) {
      const d = w * 7 - 3 + i; if (d > td) break;
      const a = ua[d] || [0, 0, 0, 0], n = v(d), o = n ? .15 + .85 * Math.sqrt(n / mx) : 0;
      g += `<rect x="${x}" y="${T + i * cs}" width="${cs - 2}" height="${cs - 2}" fill="${n ? 'var(--accent)' : 'var(--sunken)'}" ${n ? `fill-opacity="${o.toFixed(2)}"` : ''} data-t="${esc(`<b>${dt(d * 86400, 1)}</b><br>${a[0]} commits, ${a[1]} PRs opened<br>${a[2]} merged, ${a[3]} reviews`)}"/>`;
    }
  }
  return `<div class="tw"><svg class="ch cal" viewBox="0 0 ${W} ${H}" style="max-width:${W * 2.2}px">${g}</svg></div>`;
}
function bdg(r, sk) {
  const b = [], ms = (v, l, t) => { const h = [...l].reverse().find((x) => v >= x); if (h) b.push([`${N(h)}+ ${t}`, `${N(v)} ${t}`]); };
  ms(r[2], [1, 10, 50, 100, 250, 500, 1000], 'merged');
  ms(r[12], [100, 500, 1000, 5000, 10000], 'commits');
  ms(r[20] || 0, [10, 50, 100, 500, 1000], 'reviews');
  ms(r[23] || 0, [5, 25, 100], 'issues');
  if (r[7] >= 3) b.push([`${r[7]} apps`, `Contributed to ${r[7]} Craft apps`]);
  if (r[13] && r[13].length) b.push(['Builder', `Top committer of ${r[13].map((n) => ap(n)[0]).join(', ')}`]);
  if (sk.lg >= 7) b.push([`${sk.lg}-day streak`, `Longest run of active days in a row`]);
  if (r[14] != null && r[14] >= .9 && r[3] >= 20) b.push(['Clean merges', `${Math.round(r[14] * 100)}% of closed PRs merged`]);
  return b.length ? `<div class="bdg">${b.map(([t, d]) => `<span class="st a" data-t="${esc(d)}">${esc(t)}</span>`).join('')}</div>` : '';
}

function prof(d, l, mine) {
  const r = d.row, by = {};
  for (const p of d.prs) if (p[3]) (by[p[0]] ||= [0, 0])[0]++;
  for (const [n, c] of d.cm || []) (by[n] ||= [0, 0])[1] = c;
  const ab = Object.entries(by).sort((a, b) => b[1][1] - a[1][1] || b[1][0] - a[1][0]), mx = Math.max(1, ...ab.map((x) => x[1][1]));
  const lp = mine ? 100 : 30, sk = strk(d.ua || {}), bu = `${location.origin}/badge/u/${encodeURIComponent(r[0])}.svg`, md = `[![ArtCraft contributions](${bu})](${location.origin}/u/${encodeURIComponent(r[0])})`;
  return `${bdg(r, sk)}<div class="kpi">
    <div><span class="lbl">Rank</span><b>${d.rank} <span class="sub" style="font:400 14px Inter;display:inline">of ${N(d.of)}</span></b></div>
    <div><span class="lbl">Merged</span><b>${nk('p.m', r[2])}</b><span class="sub">${pc0(r[14])} merge rate, ${N(r[15])} reverted</span></div>
    <div><span class="lbl">Commits</span><b>${nk('p.c', r[12])}</b></div>
    <div><span class="lbl">Reviews</span><b>${nk('p.r', r[20] || 0)}</b><span class="sub">${N(r[23] || 0)} issues opened</span></div>
    <div><span class="lbl">Streak</span><b>${N(sk.cu)} <span class="sub" style="font:400 14px Inter;display:inline">days</span></b><span class="sub">longest ${N(sk.lg)}, ${N(sk.n)} active days</span></div>
    <div><span class="lbl">Median merge</span><b>${du(r[11])}</b></div>
  </div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Activity</h2><span class="sub">Commits, PRs and reviews per day</span></div>${cal(d.ua || {})}</section>
  ${r[13] && r[13].length ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Built</h2><span class="sub">Top committer</span></div><div class="leg" style="margin:0">${r[13].map((n) => `<a class="app" style="color:${ink(n)};border:1px solid var(--line);padding:6px 10px" href="${esc(gu(n))}" target="_blank" rel="noopener"><img src="${ico(n)}" alt="">${esc(ap(n)[0])}</a>`).join('')}</div></section>` : ''}
  ${d.prs.length ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Per day</h2><span class="sub"><span style="color:var(--accent-ink)">Merged</span> and opened</span></div>${weekly(d.prs)}</section>` : ''}
  <div class="grid g32">
    <section class="box"><div class="box-h"><h2>Pull requests</h2><span class="sub">${N(d.prs.length)}</span></div>${d.prs.length ? '' : '<p class="empty">None.</p>'}<ul class="feed">${d.prs.slice(0, lp).map((p) => `<li><img src="${ico(p[0])}" alt="${esc(ap(p[0])[0])}" title="${esc(ap(p[0])[0])}"><span class="t"><a href="${esc(gu(p[0]))}/pull/${p[1]}" target="_blank" rel="noopener">${esc(p[5])}</a><br><span class="m">${esc(ap(p[0])[0])} #${p[1]}, ${dt(p[2], 1)}${p[3] ? `, merged in ${du(p[3] - p[2])}` : ''}</span></span>${stat(p)}</li>`).join('')}</ul>${d.prs.length > lp ? `<a class="btn more" target="_blank" rel="noopener" href="https://github.com/pulls?q=${encodeURIComponent(`is:pr author:${l} org:storytold${S.rs.filter((x) => x.x).map((x) => ` repo:${x.w}/${x.n}`).join('')}`)}">All on GitHub</a>` : ''}</section>
    <section class="box"><div class="box-h"><h2>Apps</h2></div><table><thead><tr><th>App</th><th class="n">Commits</th><th class="n">Merged</th><th style="width:30%"></th></tr></thead><tbody>${ab.map(([n, [m, c]]) => `<tr class="lk" data-go="#/app/${encodeURIComponent(n)}"><td><span class="app" style="color:${ink(n)}"><img src="${ico(n)}" alt="">${esc(ap(n)[0])}</span></td><td class="n">${N(c)}</td><td class="n dim">${N(m)}</td><td><div class="bar"><i style="width:${c / mx * 100}%;background:${col(n)}"></i></div></td></tr>`).join('') || '<tr><td class="dim">Nothing yet</td></tr>'}</tbody></table></section>
  </div>
  <div class="grid g2">
    <form class="box" id="vs" data-a="${esc(r[0])}"><div class="box-h"><h2>Compare</h2></div><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="srch" id="vsq" placeholder="Other GitHub user" autocomplete="off" list="vsl"><datalist id="vsl">${S ? S.lead.slice(0, 200).map((x) => `<option value="${esc(x[0])}">`).join('') : ''}</datalist><button class="btn">Compare</button></div></form>
    <section class="box"><div class="box-h"><h2>Badge for your README</h2><img src="${esc(bu)}" alt=""></div><div class="code"><code>${esc(md)}</code><button class="btn" data-cp="${esc(md)}">Copy</button></div></section>
  </div>`;
}

async function user(l) {
  let d;
  try { d = await get('/api/u/' + encodeURIComponent(l)); } catch (e) { return `<div class="top"><h1>${esc(l)}</h1></div><p class="empty">No contributions to the Craft apps from this account.</p>`; }
  const r = d.row;
  return `<div class="prof"><img src="${av(r[0], r[1], 144)}" alt=""><div class="x"><h1>${esc(r[0])}${tb(r)}</h1><div class="sub">${r[16] ? esc(tmt(r)) + '. ' : ''}First contribution ${dt(r[9], 1)}, <a href="https://github.com/${encodeURIComponent(r[0])}" target="_blank" rel="noopener">GitHub profile</a></div></div><button class="btn" data-cp="${esc(location.origin + '/u/' + encodeURIComponent(r[0]))}">Copy link</button></div>${prof(d, r[0])}`;
}

async function vs(a, b) {
  let A, Bd;
  try { [A, Bd] = await Promise.all([get('/api/u/' + encodeURIComponent(a)), get('/api/u/' + encodeURIComponent(b))]); }
  catch { return `<div class="top"><h1>Compare</h1></div><p class="empty">One of these accounts has no Craft contributions.</p>`; }
  const ra = A.row, rb = Bd.row, sa2 = strk(A.ua), sb = strk(Bd.ua);
  const rows = [['Rank', A.rank, Bd.rank, 1], ['Merged PRs', ra[2], rb[2]], ['Merged, 30 days', ra[6], rb[6]], ['Commits', ra[12], rb[12]], ['Commits, 30 days', ra[19], rb[19]], ['Reviews', ra[20] || 0, rb[20] || 0], ['Issues opened', ra[23] || 0, rb[23] || 0], ['Apps', ra[7], rb[7]], ['Merge rate', ra[14], rb[14], 0, pc0], ['Reverted', ra[15], rb[15], 1], ['Median merge', ra[11], rb[11], 1, du], ['Longest streak', sa2.lg, sb.lg], ['Active days', sa2.n, sb.n]];
  const cell = (v, w, lo, f) => { const win = v != null && w != null && v !== w && (lo ? v < w : v > w); return `<td class="n ${win ? 'win' : 'dim'}">${(f || N)(v)}</td>`; };
  const ab = {}; for (const [n, c] of A.cm) (ab[n] ||= [0, 0])[0] = c; for (const [n, c] of Bd.cm) (ab[n] ||= [0, 0])[1] = c;
  const pd = (d) => { const o = {}; for (const p of d.prs) if (p[3]) { const k = Math.floor(p[3] / 86400); o[k] = (o[k] || 0) + 1; } return o; };
  const pa = pd(A), pb = pd(Bd), td = Math.floor(Date.now() / 86400000);
  const ks = [...Object.keys(pa), ...Object.keys(pb)].map(Number), f0 = Math.max(td - 89, Math.min(td - 13, ...ks) - 1);
  const W = 900, H = 180, L = 30, Bm = 22, T = 6, n = td - f0 + 1, bw = (W - L) / n, { top, t } = ax(Math.max(1, ...ks.map((k) => Math.max(pa[k] || 0, pb[k] || 0))));
  const y = (x) => T + (H - T - Bm) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${x}</text>`).join(''), p1 = '', p2 = '';
  for (let i = 0; i < n; i++) { const d = f0 + i, x = L + i * bw + bw / 2; p1 += `${x},${y(pa[d] || 0)} `; p2 += `${x},${y(pb[d] || 0)} `; g += `<rect class="hv" x="${L + i * bw}" y="${T}" width="${bw}" height="${H - T - Bm}" data-t="${esc(`<b>${dt(d * 86400, 1)}</b><br>${esc(ra[0])}: ${pa[d] || 0}<br>${esc(rb[0])}: ${pb[d] || 0}`)}"/>`; if (i % Math.max(1, Math.round(n / 7)) === 0) g += `<text x="${L + i * bw}" y="${H - 6}">${dt(d * 86400)}</text>`; }
  return `<div class="top"><h1>${esc(ra[0])} <span class="dim">vs</span> ${esc(rb[0])}</h1><button class="btn" data-cp="${esc(location.origin + '/vs/' + encodeURIComponent(ra[0]) + '/' + encodeURIComponent(rb[0]))}">Copy link</button></div>
  <section class="box" style="margin-bottom:24px"><div class="tw"><table class="vs"><thead><tr><th></th><th class="n"><a class="who" style="justify-content:flex-end" href="#/u/${encodeURIComponent(ra[0])}"><img src="${av(ra[0], ra[1])}" alt="">${esc(ra[0])}</a></th><th class="n"><a class="who" style="justify-content:flex-end" href="#/u/${encodeURIComponent(rb[0])}"><img src="${av(rb[0], rb[1])}" alt="">${esc(rb[0])}</a></th></tr></thead><tbody>${rows.map(([l, v, w, lo, f]) => `<tr><td>${l}</td>${cell(v, w, lo, f)}${cell(w, v, lo, f)}</tr>`).join('')}</tbody></table></div></section>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Merged per day</h2><span class="sub"><span style="color:var(--accent-ink)">${esc(ra[0])}</span> and <span style="color:var(--strong)">${esc(rb[0])}</span></span></div><svg class="ch" viewBox="0 0 ${W} ${H}">${g}<polyline points="${p1}" fill="none" stroke="var(--accent)" stroke-width="2" pointer-events="none"/><polyline points="${p2}" fill="none" stroke="var(--strong)" stroke-width="2" stroke-dasharray="4 3" pointer-events="none"/></svg></section>
  <section class="box"><div class="box-h"><h2>Commits per app</h2></div><table><thead><tr><th>App</th><th class="n">${esc(ra[0])}</th><th class="n">${esc(rb[0])}</th></tr></thead><tbody>${Object.entries(ab).sort((x, z) => z[1][0] + z[1][1] - x[1][0] - x[1][1]).map(([nm, [u, v]]) => `<tr><td><span class="app" style="color:${ink(nm)}"><img src="${ico(nm)}" alt="">${esc(ap(nm)[0])}</span></td><td class="n ${u > v ? 'win' : 'dim'}">${N(u)}</td><td class="n ${v > u ? 'win' : 'dim'}">${N(v)}</td></tr>`).join('')}</tbody></table></section>`;
}

function chips(p) {
  const c = [];
  if (p.dr) c.push(['n', 'Draft']);
  if (p.mg === 'CONFLICTING') c.push(['b', 'Conflicts']);
  if (p.ci === 'FAILURE' || p.ci === 'ERROR') c.push(['b', 'CI failing']);
  else if (p.ci === 'PENDING' || p.ci === 'EXPECTED') c.push(['n', 'CI running']);
  else if (p.ci === 'SUCCESS') c.push(['g', 'CI passed']);
  if (p.rd === 'CHANGES_REQUESTED') c.push(['b', 'Changes requested']);
  else if (p.rd === 'APPROVED') c.push(['g', 'Approved']);
  if (p.nc) c.push(['a', 'New comment']);
  return c;
}

async function mine() {
  if (!ME) return `<div class="top"><h1>You</h1></div><div class="gate"><h2>Your pull requests, review requests and issues</h2><p>Only you see this. The server keeps no copy of your data or sign-in.</p>${ON ? `<a class="btn pri" href="/auth/login">${GH}Sign in with GitHub</a>` : '<p>Sign-in is not set up yet.</p>'}</div>`;
  let m, d;
  try { [m, d] = await Promise.all([get('/api/me'), get('/api/u/' + encodeURIComponent(ME.l)).catch(() => null)]); }
  catch (e) { if (e.s === 401) { ME = null; hdr(); return mine(); } return `<div class="err">Could not load your data from GitHub.</div>`; }
  const sc = (p) => chips(p).filter((c) => c[0] === 'b' || c[0] === 'a').length;
  const op = m.open.slice().sort((a, b) => sc(b) - sc(a) || ts(b.up) - ts(a.up));
  const nd = op.filter((p) => sc(p)).length;
  return `<div class="prof"><img src="${av(ME.l, ME.i, 144)}" alt=""><div class="x"><h1>${esc(ME.l)}</h1><div class="sub">${op.length} open PRs${nd ? `, ${nd} need you` : ''}</div></div></div>
  <p class="note">Only you see this. The server keeps no copy.</p>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Your open pull requests</h2></div>${op.length ? `<ul class="feed">${op.map((p) => `<li><img src="${ico(p.r)}" alt="${esc(ap(p.r)[0])}" title="${esc(ap(p.r)[0])}"><span class="t"><a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a><br><span class="m">${esc(ap(p.r)[0])} #${p.n}, opened ${ago(ts(p.c))}, ${p.cc} comments${p.rv ? `, last review ${esc(p.rv.a || '')} ${ago(ts(p.rv.at))}` : ''}</span></span><span class="sts">${chips(p).map(([k, t]) => `<span class="st ${k}">${t}</span>`).join('')}</span></li>`).join('')}</ul>` : '<p class="empty">No open pull requests.</p>'}</section>
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Review requests</h2></div>${m.rq.length ? `<ul class="feed">${m.rq.map((p) => `<li><img src="${ico(p.r)}" alt=""><span class="t"><a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a><br><span class="m">${esc(p.a || '')}, ${esc(ap(p.r)[0])} #${p.n}</span></span><span class="m">${ago(ts(p.c))}</span></li>`).join('')}</ul>` : '<p class="empty">None.</p>'}</section>
    <section class="box"><div class="box-h"><h2>Your open issues</h2></div>${m.is.length ? `<ul class="feed">${m.is.map((p) => `<li><img src="${ico(p.r)}" alt=""><span class="t"><a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a><br><span class="m">${esc(ap(p.r)[0])} #${p.n}, ${p.cc} comments</span></span><span class="m">${ago(ts(p.c))}</span></li>`).join('')}</ul>` : '<p class="empty">None.</p>'}</section>
  </div>
  ${d ? prof(d, ME.l, 1) : ''}`;
}

function apage(d) {
  const r = d.row || {}, n = d.n, c = col(n);
  const ti = d.days.slice(Math.max(0, d.days.findIndex((x) => x[1] || x[2] || x[3]) - 2));
  const kp = `<div class="kpi">
    <div><span class="lbl">Contributors</span><b>${N(r.c)}</b></div>
    <div><span class="lbl">Merged PRs</span><b>${N(r.m)}</b><span class="sub">${N(r.op)} open</span></div>
    <div><span class="lbl">Commits</span><b>${N(r.cm)}</b></div>
    <div><span class="lbl">Stars</span><b>${N(d.s)}</b><span class="sub">${N(d.f)} forks</span></div>
    <div><span class="lbl">Downloads</span><b>${d.dl ? big(d.dl.t) : '–'}</b>${d.dl && d.dl.br ? `<span class="sub">${N(d.dl.br[0])} Homebrew, 30d</span>` : ''}</div>
    <div><span class="lbl">Merge time</span><b>${du(r.t)}</b><span class="sub">first review ${du(r.fr)}</span></div>
  </div>`;
  const pm = Math.max(1, ...d.ppl.map((x) => x[3]));
  const ppl = `<div class="tw"><table><thead><tr><th>Contributor</th><th class="n">Commits</th><th class="n">Merged</th><th class="n hide-s">Reviews</th><th class="n hide-s">Issues</th><th class="hide-s" style="width:20%"></th></tr></thead><tbody>${d.ppl.slice(0, 25).map((x) => `<tr class="lk" data-go="#/u/${encodeURIComponent(x[0])}"><td><span class="who"><img loading="lazy" src="${av(x[0], x[1])}" alt="">${esc(x[0])}</span></td><td class="n">${N(x[3])}</td><td class="n dim">${N(x[2])}</td><td class="n hide-s dim">${N(x[4])}</td><td class="n hide-s dim">${N(x[5])}</td><td class="hide-s"><div class="bar"><i style="width:${x[3] / pm * 100}%;background:${c}"></i></div></td></tr>`).join('')}</tbody></table></div>`;
  const rl = d.rl.slice(0, 15);
  const rt = rl.length ? `<div class="tw"><table><thead><tr><th>Release</th><th>Date</th><th class="n">Downloads</th><th class="n hide-s">First 24h</th><th class="n hide-s">First 7 days</th><th class="n hide-s">Changes</th></tr></thead><tbody>${rl.map((x) => `<tr><td><a href="${esc(gu(n))}/releases/tag/${encodeURIComponent(x[0])}" target="_blank" rel="noopener">${esc(x[0])}</a>${x[3] ? ' <span class="st n">Pre</span>' : ''}</td><td class="dim">${dt(x[1], 1)}</td><td class="n">${N(x[2])}</td><td class="n hide-s dim">${N(x[5])}</td><td class="n hide-s dim">${N(x[6])}</td><td class="n hide-s dim">${x[4] || '–'}</td></tr>`).join('')}</tbody></table></div>${d.rl.length > 15 ? `<a class="btn more" href="#/releases">All releases</a>` : ''}<p class="note" style="margin:10px 0 0">First 24h and 7 days are tracked from 30 Oct 2026 on. Changes counts bullet points in the release notes.</p>` : '<p class="empty">No releases.</p>';
  const i = r.is;
  return `<div class="prof"><img src="${ico(n)}" alt="" style="border:0"><div class="x"><h1 style="color:${ink(n)}">${esc(ap(n)[0])}${d.x ? ' <span class="st n tm">Community</span>' : ''}</h1><div class="sub">${esc(d.d)}${d.d ? '. ' : ''}<a href="${esc(gu(n))}" target="_blank" rel="noopener">${esc(d.w)}/${esc(n)} on GitHub</a></div></div><button class="btn" data-cp="${esc(location.origin + '/app/' + encodeURIComponent(n))}">Copy link</button></div>
  ${kp}
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Per day</h2><span class="sub"><span style="color:${ink(n)}">Merged</span>, commits as line</span></div>${dual(ti, c)}</section>
  <div class="grid g32">
    <section class="box"><div class="box-h"><h2>Contributors</h2><span class="sub">Top ${Math.min(25, d.ppl.length)}</span></div>${ppl}</section>
    <section class="box"><div class="box-h"><h2>Latest merges</h2></div><ul class="feed">${d.rec.slice(0, 14).map(([m, rn, nr, ti, l]) => `<li><img src="${av(l, 0, 44)}" alt=""><span class="t"><a href="${esc(gu(rn))}/pull/${nr}" target="_blank" rel="noopener">${esc(ti)}</a><br><span class="m"><a href="#/u/${encodeURIComponent(l)}" class="dim">${esc(l)}</a></span></span><span class="m">${ago(m)}</span></li>`).join('') || '<li class="dim">None yet</li>'}</ul></section>
  </div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Releases</h2><span class="sub">${N(d.rl.length)} total</span></div>${rt}</section>
  ${d.dl ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Downloads</h2></div>${d.dd.length >= 2 ? `<h3 class="h3">Per day</h3>${bch(d.dd, { u: 'downloads', H: 140, c })}<div style="height:16px"></div>` : ''}${sbar(d.dl.p, d.dl.t, 14)}<div class="leg">${PL.filter(([k]) => d.dl.p[k]).map(([k, nm, cc]) => `<span><i style="background:${cc}"></i>${nm} ${N(d.dl.p[k])} (${pct(d.dl.p[k], d.dl.t)})</span>`).join('')}</div></section>` : ''}
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Stars</h2></div>${d.st ? lch(d.swk, { u: 'stars' }) : '<p class="empty">Star history is still loading.</p>'}</section>
    <section class="box"><div class="box-h"><h2>Issues</h2></div>${i ? `<div class="mini"><div><span class="lbl">Open</span><b>${N(i.o)}</b></div><div><span class="lbl">Opened, 30d</span><b>${N(i.o30)}</b></div><div><span class="lbl">Closed, 30d</span><b>${N(i.x30)}</b></div><div><span class="lbl">Open bugs</span><b>${N(i.b)}</b></div><div><span class="lbl">Open features</span><b>${N(i.f)}</b></div><div><span class="lbl">First reply</span><b>${du(i.fr)}</b></div></div><a class="btn more" target="_blank" rel="noopener" href="${esc(gu(n))}/issues">Issues on GitHub</a>` : '<p class="empty">Issues are still syncing.</p>'}</section>
  </div>
  ${d.ci ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>CI on ${esc('main')}</h2><span class="sub">${pc0(d.ci.n ? d.ci.ok / d.ci.n : null)} of ${N(d.ci.n)} push runs passed, last 14 days, median ${du(d.ci.med)}</span></div><table><thead><tr><th>Workflow</th><th class="n">Passed</th><th class="n">Failed</th><th class="n">Rate</th></tr></thead><tbody>${d.ci.wf.map(([w, [o, f]]) => `<tr><td>${esc(w)}</td><td class="n">${N(o)}</td><td class="n dim">${N(f)}</td><td class="n">${pc0(o / (o + f))}</td></tr>`).join('')}</tbody></table></section>` : ''}
  ${r.q ? `<p class="note">Code quality on SonarCloud: gate ${esc((QG[r.q.alert_status] || [, '–'])[1])}, ${N(r.q.code_smells)} code smells, ${N(r.q.ncloc)} lines. <a href="https://sonarcloud.io/project/overview?id=${esc(r.q.k)}" target="_blank" rel="noopener">Details</a></p>` : ''}
  <h3 class="h3" style="margin-top:24px">Badge for your README</h3><div class="code"><code>${esc(`[![${ap(n)[0]} downloads](${location.origin}/badge/app/${n}.svg)](${location.origin}/app/${n})`)}</code><button class="btn" data-cp="${esc(`[![${ap(n)[0]} downloads](${location.origin}/badge/app/${n}.svg)](${location.origin}/app/${n})`)}">Copy</button></div>`;
}
function dual(D, c) {
  const W = 900, H = 190, L = 34, B = 22, T = 6, n = D.length || 1, bw = (W - L) / n, st = Math.max(1, Math.round(n / 7));
  const { top, t } = ax(Math.max(1, ...D.map((d) => Math.max(d[2], d[3]))));
  const y = (x) => T + (H - T - B) * (1 - x / top);
  let g = t.map((x) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(x)}" y2="${y(x)}"/><text x="${L - 6}" y="${y(x) + 3}" text-anchor="end">${x}</text>`).join(''), pts = '';
  D.forEach((d, i) => {
    const x = L + i * bw;
    g += `<rect x="${x + .5}" y="${y(d[2])}" width="${Math.max(1, bw - 1.5)}" height="${(H - T - B) * d[2] / top}" fill="${c}"/>`;
    pts += `${x + bw / 2},${y(d[3])} `;
    g += `<rect class="hv" x="${x}" y="${T}" width="${bw}" height="${H - T - B}" data-t="${esc(`<b>${dt(d[0], 1)}</b><br>${d[2]} merged, ${d[1]} opened<br>${d[3]} commits${d[4] ? `<br>${d[4]} new stars` : ''}`)}"/>`;
    if (i % st === 0) g += `<text x="${x}" y="${H - 6}">${dt(d[0])}</text>`;
  });
  return `<svg class="ch" viewBox="0 0 ${W} ${H}">${g}<polyline points="${pts}" fill="none" stroke="var(--strong)" stroke-width="1.5" pointer-events="none"/></svg>`;
}

let rapp = '', rlim = 60;
function rpage(d) {
  const all = d.rl, now = Date.now() / 1000;
  const wk = new Map();
  for (const x of all) { if (x[4]) continue; const w = Math.floor((x[2] / 86400 + 3) / 7); wk.set(w, (wk.get(w) || 0) + 1); }
  const ws = [...wk.keys()].sort((a, b) => a - b), cad = [];
  if (ws.length) for (let w = Math.max(ws[0], ws[ws.length - 1] - 11); w <= ws[ws.length - 1]; w++) cad.push([w * 7 * 86400 - 3 * 86400, wk.get(w) || 0]);
  const r = all.filter((x) => !rapp || x[0] === rapp), sh = r.slice(0, rlim);
  const apps = [...new Set(all.map((x) => x[0]))].sort((a, b) => ORD.indexOf(a) - ORD.indexOf(b));
  const r7 = all.filter((x) => now - x[2] < 7 * 86400 && !x[4]).length, r30 = all.filter((x) => now - x[2] < 30 * 86400 && !x[4]).length;
  return `<div class="top"><h1>Releases</h1><span class="sub">${N(all.length)} releases across ${apps.length} repos. <a href="/feed.xml">RSS feed</a></span></div>
  <div class="kpi" style="grid-template-columns:repeat(3,1fr)"><div><span class="lbl">Last 7 days</span><b>${N(r7)}</b></div><div><span class="lbl">Last 30 days</span><b>${N(r30)}</b></div><div><span class="lbl">Downloads</span><b>${big(all.reduce((a, x) => a + x[3], 0))}</b></div></div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Releases per week</h2></div>${bch(cad, { u: 'releases', wk: 1, H: 150 })}</section>
  <section class="box"><div class="box-h"><h2>All releases</h2></div><div class="leg" id="rf" style="margin:0 0 14px">${apps.map((a) => `<button data-r="${esc(a)}" class="${rapp && rapp !== a ? 'off' : ''}"><i style="background:${col(a)}"></i>${esc(ap(a)[0])}</button>`).join('')}</div>
  <div class="tw"><table><thead><tr><th>App</th><th>Release</th><th>Date</th><th class="n">Downloads</th><th class="n hide-s">First 24h</th><th class="n hide-s">First 7 days</th><th class="n hide-s">Changes</th></tr></thead><tbody>${sh.map((x) => `<tr><td style="white-space:nowrap"><a class="app" href="#/app/${encodeURIComponent(x[0])}" style="color:${ink(x[0])}"><img src="${ico(x[0])}" alt="">${esc(ap(x[0])[0])}</a></td><td><a href="${esc(gu(x[0]))}/releases/tag/${encodeURIComponent(x[1])}" target="_blank" rel="noopener">${esc(x[1])}</a>${x[4] ? ' <span class="st n">Pre</span>' : ''}</td><td class="dim" style="white-space:nowrap">${dt(x[2], 1)}, ${ago(x[2])}</td><td class="n">${N(x[3])}</td><td class="n hide-s dim">${N(x[6])}</td><td class="n hide-s dim">${N(x[7])}</td><td class="n hide-s dim">${x[5] || '–'}</td></tr>`).join('')}</tbody></table></div>
  ${r.length > rlim ? `<button class="btn more" id="rmore">Show more (${N(r.length - rlim)} left)</button>` : ''}</section>`;
}

function wpage(d) {
  const k = d.k, pl = (r, u) => r.length ? `<table><tbody>${r.map((x) => `<tr class="lk" data-go="#/u/${encodeURIComponent(x[0])}"><td><span class="who"><img loading="lazy" src="${av(x[0], x[1])}" alt="">${esc(x[0])}</span></td><td class="n">${N(x[2])} <span class="dim">${u}</span></td></tr>`).join('')}</tbody></table>` : '<p class="empty">Nobody yet.</p>';
  const dsum = d.dd.reduce((a, x) => a + x[1], 0);
  return `<div class="top"><h1>This week</h1><span class="sub">${dt(d.f, 1)} to ${dt(d.t, 1)}</span></div>
  <div class="kpi">
    <div><span class="lbl">Merged PRs</span><b>${N(d.mg)}</b></div>
    <div><span class="lbl">Commits</span><b>${N(k.c7)}</b></div>
    <div><span class="lbl">New people</span><b>${N(d.nw.length)}</b></div>
    <div><span class="lbl">Releases</span><b>${N(d.rl.length)}</b></div>
    <div><span class="lbl">New stars</span><b>${S && S.st.sy ? '–' : N(k.s7)}</b></div>
    <div><span class="lbl">Issues</span><b>${N(d.is[0])}</b><span class="sub">opened, ${N(d.is[1])} closed</span></div>
  </div>
  ${dsum ? `<p class="note">${N(dsum)} downloads this week.</p>` : ''}
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>New contributors</h2><span class="sub">First PR or commit this week</span></div>${d.nw.length ? `<ul class="feed">${d.nw.slice(0, 30).map(([l, i, m, c, f]) => `<li><img src="${av(l, i, 44)}" alt=""><span class="t"><a href="#/u/${encodeURIComponent(l)}">${esc(l)}</a><br><span class="m">${f ? `${esc(ap(f[0])[0])} #${f[1]}: ${esc(f[2])}` : `${N(c)} commits`}</span></span><span class="m">${N(m)} merged</span></li>`).join('')}</ul>` : '<p class="empty">No one new this week.</p>'}</section>
  <div class="grid" style="grid-template-columns:repeat(3,1fr)">
    <section class="box"><div class="box-h"><h2>Most merged</h2></div>${pl(d.top, 'PRs')}</section>
    <section class="box"><div class="box-h"><h2>Most commits</h2></div>${pl(d.cm, '')}</section>
    <section class="box"><div class="box-h"><h2>Most reviews</h2></div>${pl(d.rv, '')}</section>
  </div>
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Busiest apps</h2><span class="sub">Merged PRs</span></div>${(() => { const mx = Math.max(1, ...d.apps.map((x) => x[1])); return `<table><tbody>${d.apps.map(([n, v]) => `<tr class="lk" data-go="#/app/${encodeURIComponent(n)}"><td><span class="app" style="color:${ink(n)}"><img src="${ico(n)}" alt="">${esc(ap(n)[0])}</span></td><td class="n">${N(v)}</td><td style="width:40%"><div class="bar"><i style="width:${v / mx * 100}%;background:${col(n)}"></i></div></td></tr>`).join('')}</tbody></table>`; })()}</section>
    <section class="box"><div class="box-h"><h2>Releases</h2></div>${d.rl.length ? `<ul class="feed">${d.rl.map((x) => `<li><img src="${ico(x[0])}" alt=""><span class="t"><a href="${esc(gu(x[0]))}/releases/tag/${encodeURIComponent(x[1])}" target="_blank" rel="noopener">${esc(ap(x[0])[0])} ${esc(x[1])}</a><br><span class="m">${N(x[3])} downloads</span></span><span class="m">${ago(x[2])}</span></li>`).join('')}</ul>` : '<p class="empty">No releases this week.</p>'}</section>
  </div>
  <section class="box"><div class="box-h"><h2>Merged this week</h2><span class="sub">Latest ${Math.min(30, d.mg)} of ${N(d.mg)}</span></div><ul class="feed">${d.recent.map(([m, rn, nr, ti, l]) => `<li><img src="${ico(rn)}" alt=""><span class="t"><a href="${esc(gu(rn))}/pull/${nr}" target="_blank" rel="noopener">${esc(ti)}</a><br><span class="m"><a href="#/u/${encodeURIComponent(l)}" class="dim">${esc(l)}</a></span></span><span class="m">${ago(m)}</span></li>`).join('')}</ul></section>`;
}

function bind() {
  const m = $('#m');
  m.querySelectorAll('.leg button').forEach((b) => b.onclick = () => {
    const a = b.dataset.a;
    if (hid.has(a)) hid.delete(a); else hid.add(a);
    $('#daily').innerHTML = daily(); b.classList.toggle('off');
  });
  const per0 = $('#per');
  if (per0) per0.onclick = (e) => { const p = e.target.dataset.p; if (!p) return; per = p; srt = null; lim = 50; per0.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.p === p)); relead(); };
  const qi = $('#q');
  if (qi) qi.oninput = () => { q = qi.value.trim().toLowerCase(); lim = 50; relead(); };
  m.querySelectorAll('tr[data-go]').forEach((r) => r.onclick = (e) => { if (!e.target.closest('a')) location.hash = r.dataset.go; });
  const vs = $('#vs');
  if (vs) vs.onsubmit = (e) => { e.preventDefault(); const v = $('#vsq').value.trim(); if (v) location.hash = `#/vs/${encodeURIComponent(vs.dataset.a)}/${encodeURIComponent(v)}`; };
  m.querySelectorAll('[data-cp]').forEach((b) => b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.cp); const t = b.textContent; b.textContent = 'Copied'; setTimeout(() => b.textContent = t, 1400); } catch {} });
  const rf = $('#rf');
  if (rf) rf.onclick = (e) => { const a = e.target.closest('button'); if (!a) return; rapp = a.dataset.r === rapp ? '' : a.dataset.r; rlim = 60; route(); };
  const rm2 = $('#rmore'); if (rm2) rm2.onclick = () => { rlim += 120; route(); };
  bl();
}
function bl() {
  const L = $('#lead'); if (!L) return;
  L.querySelectorAll('tr.lk').forEach((r) => r.onclick = () => location.hash = '#/u/' + encodeURIComponent(r.dataset.u));
  L.querySelectorAll('th.s').forEach((h) => h.onclick = () => { const i = +h.dataset.s; srt = srt && srt[0] === i ? (srt[1] === -1 ? [i, 1] : null) : [i, i === 11 ? 1 : -1]; relead(); });
  const mo = $('#more'); if (mo) mo.onclick = () => { lim += 100; relead(); };
}
function relead() { const L = $('#lead'); if (L) { L.innerHTML = lead(!!$('#q')); bl(); roll(); } }

let seq = 0, lh = null;
async function route() {
  const id = ++seq, h = location.hash.replace(/^#\/?/, ''), [p, a] = h.split('/');
  if (h !== lh) { NV.clear(); lh = h; }
  hdr();
  const m = $('#m');
  if (p === 'me') { m.innerHTML = '<p class="empty">Loading…</p>'; const x = await mine(); if (id === seq) m.innerHTML = x; }
  else if (!S) { m.innerHTML = '<p class="empty">Loading…</p>'; return; }
  else if (p === 'u' && a) { m.innerHTML = '<p class="empty">Loading…</p>'; const x = await user(decodeURIComponent(a)); if (id === seq) m.innerHTML = x; }
  else if (p === 'people') m.innerHTML = people();
  else if (p === 'app' && a) { m.innerHTML = '<p class="empty">Loading…</p>'; let x; try { x = apage(await get('/api/app/' + encodeURIComponent(decodeURIComponent(a)))); } catch { x = '<p class="empty">Unknown app.</p>'; } if (id === seq) m.innerHTML = x; }
  else if (p === 'releases') { if (!m.querySelector('#rf')) m.innerHTML = '<p class="empty">Loading…</p>'; const x = rpage(await get('/api/releases')); if (id === seq) m.innerHTML = x; }
  else if (p === 'week') { m.innerHTML = '<p class="empty">Loading…</p>'; const x = wpage(await get('/api/week')); if (id === seq) m.innerHTML = x; }
  else if (p === 'vs' && a) { m.innerHTML = '<p class="empty">Loading…</p>'; const x = await vs(decodeURIComponent(a), decodeURIComponent(h.split('/')[2] || '')); if (id === seq) m.innerHTML = x; }
  else m.innerHTML = overview();
  if (id === seq) { bind(); roll(); if (!a && p !== 'releases') scrollTo(0, 0); }
}

async function load() {
  try { S = await get('/api/stats?v=' + Date.now()); } catch (e) { if (!S) $('#m').innerHTML = `<p class="empty">${e.s === 503 ? 'Syncing with GitHub.' : 'Could not load data.'}</p>`; setTimeout(load, 15000); return false; }
  return true;
}

if (location.pathname !== '/' && !location.hash) history.replaceState(null, '', '/#' + location.pathname);
addEventListener('hashchange', route);
dk.addEventListener('change', route);
(async () => {
  try { const s = await get('/api/session'); ON = s.on; ME = s.me; } catch {}
  hdr();
  if (await load()) route();
  else if (location.hash.startsWith('#/me')) route();
  let bz = 0;
  setInterval(async () => {
    if (bz || document.hidden || !S) return;
    bz = 1;
    try {
      const { v } = await get('/api/v');
      const p = location.hash.replace(/^#\/?/, '').split('/')[0];
      if (v !== S.v && await load() && (p === '' || p === 'people' || p === 'u') && !document.querySelector('#q:focus')) { const y = scrollY; await route(); scrollTo(0, y); }
    } catch {}
    bz = 0;
  }, 3000);
})();
})();
