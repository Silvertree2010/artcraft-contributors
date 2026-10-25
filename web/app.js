(() => {
const AP = {
  photocraft: ['PhotoCraft', '#2f7bf5', '#1a5bc4', '#7fb0ff'], vectorcraft: ['VectorCraft', '#e8573f', '#b83a24', '#ff8a70'],
  filmcraft: ['FilmCraft', '#8b5cf6', '#6a3fd6', '#b69cff'], lightcraft: ['LightCraft', '#f2a516', '#8a5800', '#ffc14d'],
  pdfcraft: ['PdfCraft', '#12a58a', '#0a7563', '#3fd6b8'], effectcraft: ['EffectCraft', '#e0368f', '#b0206c', '#ff7ab8'],
  designcraft: ['DesignCraft', '#7bb51c', '#457008', '#a6e04a'], figcraft: ['FigCraft', '#02da96', '#047a56', '#4fe8b6'],
  wordcraft: ['WordCraft', '#3f5fe0', '#2a44b8', '#8ea2ff'], soundcraft: ['SoundCraft', '#1fa5c9', '#0e7290', '#5fd0ee'],
  deckcraft: ['DeckCraft', '#f07a1e', '#a84f0a', '#ffa060'], cadcraft: ['CADCraft', '#3ea6e8', '#1a6fa8', '#7cc8ff'],
  gridcraft: ['GridCraft', '#1f9d55', '#12703a', '#4fd68a'], artcraft: ['ArtCraft', '#4e7bfb', '#2a52c4', '#8aa8ff'],
  'craft-launcher': ['Launcher', '#8a8a90', '#55555c', '#b5b5bb'], anicraft: ['AniCraft', '#c25bd6', '#8e2fa3', '#e29af0'],
};
const NEU = ['#9a958c', '#6b665e', '#c2bdb4'];
const ORD = Object.keys(AP);
const dk = matchMedia('(prefers-color-scheme: dark)');
const ap = (n) => AP[n.toLowerCase()] || [n, ...NEU];
const col = (n) => ap(n)[1];
const ink = (n) => ap(n)[dk.matches ? 3 : 2];
const ico = (n) => AP[n.toLowerCase()] && !/^(artcraft|craft-launcher|anicraft)$/.test(n.toLowerCase()) ? `icons/${n.toLowerCase()}.png` : 'icons/artcraft-launcher.svg';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const av = (l, i, s = 48) => i ? `https://avatars.githubusercontent.com/u/${i}?s=${s}&v=4` : `https://avatars.githubusercontent.com/${encodeURIComponent(l)}?s=${s}`;
const nf = new Intl.NumberFormat('en-US');
const N = (x) => x == null ? '–' : nf.format(x);
const du = (s) => s == null ? '–' : s < 3600 ? Math.max(1, Math.round(s / 60)) + 'm' : s < 86400 ? (s / 3600).toFixed(s < 36000 ? 1 : 0) + 'h' : (s / 86400).toFixed(s < 864000 ? 1 : 0) + 'd';
const ago = (t) => { const s = Date.now() / 1000 - t; return s < 3600 ? Math.max(1, Math.round(s / 60)) + 'm ago' : s < 86400 ? Math.round(s / 3600) + 'h ago' : s < 86400 * 30 ? Math.round(s / 86400) + 'd ago' : dt(t); };
const dt = (t, y) => new Date(t * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(y ? { year: 'numeric' } : {}) });
const ts = (x) => Date.parse(x) / 1000;

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
  $('#nav').innerHTML = [['', 'Overview'], ['people', 'Leaderboard'], ...(ME ? [['me', 'You']] : [])]
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
  return `<div class="tw"><table><thead><tr><th>App</th><th class="n">Commits</th><th class="n hide-s">Merged</th><th class="hide-s">Built by</th><th style="width:18%" class="hide-s"></th></tr></thead><tbody>${r.map((x) => `<tr>
    <td><a class="app" href="https://github.com/storytold/${esc(x.n)}" target="_blank" rel="noopener" style="color:${ink(x.n)}"><img src="${ico(x.n)}" alt="">${esc(ap(x.n)[0])}</a></td>
    <td class="n">${N(x.cm)}</td><td class="n hide-s dim">${N(x.m)}</td><td class="hide-s">${x.b ? `<a class="dim" href="#/u/${encodeURIComponent(x.b)}">${esc(x.b)}</a>` : '<span class="dim">–</span>'}</td>
    <td class="hide-s"><div class="bar"><i style="width:${x.cm / mx * 100}%;background:${col(x.n)}"></i></div></td></tr>`).join('')}</tbody></table></div>`;
}
const blt = (b) => !b || !b.length ? '<span class="dim">–</span>' : b.slice(0, 2).map((n) => `<span style="color:${ink(n)}">${esc(ap(n)[0])}</span>`).join(', ') + (b.length > 2 ? ` <span class="dim">+${b.length - 2}</span>` : '');

const PI = { all: 2, '30d': 6, '7d': 5 };
function lead(full) {
  const pc = PI[per];
  let r = S.lead.filter((x) => x[pc] > 0 || per === 'all');
  if (srt) r = r.slice().sort((a, b) => srt[1] * ((a[srt[0]] ?? Infinity) - (b[srt[0]] ?? Infinity)));
  else r = r.slice().sort((a, b) => b[pc] - a[pc] || b[3] - a[3]);
  const rk = new Map(r.map((x, i) => [x[0], i + 1]));
  if (q) r = r.filter((x) => x[0].toLowerCase().includes(q));
  const lm = full ? lim : 15, sh = r.slice(0, lm);
  const th = (i, t, c = 'n') => `<th class="s ${c} ${srt && srt[0] === i ? 'on' : ''}" data-s="${i}">${t}</th>`;
  const me = ME && ME.l.toLowerCase();
  return `<div class="tw"><table><thead><tr><th class="n">#</th><th>Contributor</th>${th(pc, 'Merged')}${th(12, 'Commits', 'n hide-s')}${th(3, 'Opened', 'n hide-s')}${th(7, 'Apps', 'n hide-s')}<th class="hide-s">Mostly</th><th class="hide-s">Built</th>${th(11, 'Median merge', 'n hide-s')}${th(10, 'Last active', 'n hide-s')}</tr></thead><tbody>
    ${sh.map((x) => `<tr class="lk ${me === x[0].toLowerCase() ? 'me-row' : ''}" data-u="${esc(x[0])}"><td class="n dim">${rk.get(x[0])}</td>
    <td><span class="who"><img loading="lazy" src="${av(x[0], x[1])}" alt="">${esc(x[0])}</span></td>
    <td class="n">${N(x[pc])}</td><td class="n hide-s dim">${N(x[12])}</td><td class="n hide-s dim">${N(x[3])}</td><td class="n hide-s dim">${x[7]}</td>
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
    <span class="t"><a href="https://github.com/storytold/${esc(rn)}/pull/${nr}" target="_blank" rel="noopener">${esc(ti)}</a><br><span class="m"><a href="#/u/${encodeURIComponent(l)}" class="dim">${esc(l)}</a></span></span><span class="m">${ago(m)}</span></li>`).join('')}</ul>`;
}

function overview() {
  const k = S.k;
  return `<div class="top"><div><h1>Craft App Suite contributions</h1></div><span class="sub">${S.sync ? `Syncing ${S.sync} repos, ` : ''}Updated ${ago(S.at)}</span></div>
  ${S.err ? `<div class="err">GitHub sync error: ${esc(S.err)}</div>` : ''}
  <div class="kpi">
    <div><span class="lbl">Contributors</span><b>${N(k.c)}</b></div>
    <div><span class="lbl">Merged PRs</span><b>${N(k.m)}</b></div>
    <div><span class="lbl">Commits</span><b>${N(k.cm)}</b></div>
    <div><span class="lbl">Merged, 7d</span><b>${N(k.m7)}</b></div>
    <div><span class="lbl">Median merge, 30d</span><b>${du(k.t)}</b></div>
    <div><span class="lbl">New people, 30d</span><b>${N(k.n30)}</b></div>
  </div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Merged per day</h2></div><div id="daily">${daily()}</div>${legend()}</section>
  <div class="grid g32">
    <section class="box"><div class="box-h"><h2>Contributors</h2><span class="sub"><span style="color:var(--accent-ink)">Total</span>, active per day</span></div>${growth()}</section>
    <section class="box"><div class="box-h"><h2>Time to merge</h2></div>${hist()}</section>
  </div>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>When PRs get merged</h2><span class="sub">Your local time</span></div>${heat()}</section>
  <section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Leaderboard</h2>${segs()}</div><div id="lead">${lead(false)}</div></section>
  <div class="grid g2">
    <section class="box"><div class="box-h"><h2>Apps</h2></div>${apps()}</section>
    <section class="box"><div class="box-h"><h2>Latest merges</h2></div>${feed()}</section>
  </div>`;
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

function prof(d, l, mine) {
  const r = d.row, by = {};
  for (const p of d.prs) if (p[3]) (by[p[0]] ||= [0, 0])[0]++;
  for (const [n, c] of d.cm || []) (by[n] ||= [0, 0])[1] = c;
  const ab = Object.entries(by).sort((a, b) => b[1][1] - a[1][1] || b[1][0] - a[1][0]), mx = Math.max(1, ...ab.map((x) => x[1][1]));
  const lp = mine ? 100 : 30;
  return `<div class="kpi">
    <div><span class="lbl">Rank</span><b>${d.rank} <span class="sub" style="font:400 14px Inter">of ${N(d.of)}</span></b></div>
    <div><span class="lbl">Merged</span><b>${N(r[2])}</b></div>
    <div><span class="lbl">Opened</span><b>${N(r[3])}</b></div>
    <div><span class="lbl">Commits</span><b>${N(r[12])}</b></div>
    <div><span class="lbl">Merged, 30 days</span><b>${N(r[6])}</b></div>
    <div><span class="lbl">Median merge</span><b>${du(r[11])}</b></div>
  </div>
  ${r[13] && r[13].length ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Built</h2><span class="sub">Top committer</span></div><div class="leg" style="margin:0">${r[13].map((n) => `<a class="app" style="color:${ink(n)};border:1px solid var(--line);padding:6px 10px" href="https://github.com/storytold/${esc(n)}" target="_blank" rel="noopener"><img src="${ico(n)}" alt="">${esc(ap(n)[0])}</a>`).join('')}</div></section>` : ''}
  ${d.prs.length ? `<section class="box" style="margin-bottom:24px"><div class="box-h"><h2>Per day</h2><span class="sub"><span style="color:var(--accent-ink)">Merged</span> and opened</span></div>${weekly(d.prs)}</section>` : ''}
  <div class="grid g32">
    <section class="box"><div class="box-h"><h2>Pull requests</h2><span class="sub">${N(d.prs.length)}</span></div>${d.prs.length ? '' : '<p class="empty">None.</p>'}<ul class="feed">${d.prs.slice(0, lp).map((p) => `<li><img src="${ico(p[0])}" alt="${esc(ap(p[0])[0])}" title="${esc(ap(p[0])[0])}"><span class="t"><a href="https://github.com/storytold/${esc(p[0])}/pull/${p[1]}" target="_blank" rel="noopener">${esc(p[5])}</a><br><span class="m">${esc(ap(p[0])[0])} #${p[1]}, ${dt(p[2], 1)}${p[3] ? `, merged in ${du(p[3] - p[2])}` : ''}</span></span>${stat(p)}</li>`).join('')}</ul>${d.prs.length > lp ? `<a class="btn more" target="_blank" rel="noopener" href="https://github.com/pulls?q=${encodeURIComponent(`is:pr author:${l} org:storytold`)}">All on GitHub</a>` : ''}</section>
    <section class="box"><div class="box-h"><h2>Apps</h2></div><table><thead><tr><th>App</th><th class="n">Commits</th><th class="n">Merged</th><th style="width:30%"></th></tr></thead><tbody>${ab.map(([n, [m, c]]) => `<tr><td><span class="app" style="color:${ink(n)}"><img src="${ico(n)}" alt="">${esc(ap(n)[0])}</span></td><td class="n">${N(c)}</td><td class="n dim">${N(m)}</td><td><div class="bar"><i style="width:${c / mx * 100}%;background:${col(n)}"></i></div></td></tr>`).join('') || '<tr><td class="dim">Nothing yet</td></tr>'}</tbody></table></section>
  </div>`;
}

async function user(l) {
  let d;
  try { d = await get('/api/u/' + encodeURIComponent(l)); } catch (e) { return `<div class="top"><h1>${esc(l)}</h1></div><p class="empty">No contributions to the Craft apps from this account.</p>`; }
  const r = d.row;
  return `<div class="prof"><img src="${av(r[0], r[1], 144)}" alt=""><div class="x"><h1>${esc(r[0])}</h1><div class="sub">First contribution ${dt(r[9], 1)}, <a href="https://github.com/${encodeURIComponent(r[0])}" target="_blank" rel="noopener">GitHub profile</a></div></div></div>${prof(d, r[0])}`;
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
  bl();
}
function bl() {
  const L = $('#lead'); if (!L) return;
  L.querySelectorAll('tr.lk').forEach((r) => r.onclick = () => location.hash = '#/u/' + encodeURIComponent(r.dataset.u));
  L.querySelectorAll('th.s').forEach((h) => h.onclick = () => { const i = +h.dataset.s; srt = srt && srt[0] === i ? (srt[1] === -1 ? [i, 1] : null) : [i, i === 11 ? 1 : -1]; relead(); });
  const mo = $('#more'); if (mo) mo.onclick = () => { lim += 100; relead(); };
}
function relead() { const L = $('#lead'); if (L) { L.innerHTML = lead(!!$('#q')); bl(); } }

let seq = 0;
async function route() {
  const id = ++seq, h = location.hash.replace(/^#\/?/, ''), [p, a] = h.split('/');
  hdr();
  const m = $('#m');
  if (p === 'me') { m.innerHTML = '<p class="empty">Loading…</p>'; const x = await mine(); if (id === seq) m.innerHTML = x; }
  else if (!S) { m.innerHTML = '<p class="empty">Loading…</p>'; return; }
  else if (p === 'u' && a) { m.innerHTML = '<p class="empty">Loading…</p>'; const x = await user(decodeURIComponent(a)); if (id === seq) m.innerHTML = x; }
  else if (p === 'people') m.innerHTML = people();
  else m.innerHTML = overview();
  if (id === seq) { bind(); if (!a) scrollTo(0, 0); }
}

async function load() {
  try { S = await get('/api/stats'); } catch (e) { if (!S) $('#m').innerHTML = `<p class="empty">${e.s === 503 ? 'Syncing with GitHub.' : 'Could not load data.'}</p>`; setTimeout(load, 15000); return false; }
  return true;
}

addEventListener('hashchange', route);
dk.addEventListener('change', route);
(async () => {
  try { const s = await get('/api/session'); ON = s.on; ME = s.me; } catch {}
  hdr();
  if (await load()) route();
  else if (location.hash.startsWith('#/me')) route();
  setInterval(async () => { const p = location.hash.replace(/^#\/?/, '').split('/')[0]; if (await load() && (p === '' || p === 'people') && !document.querySelector('#q:focus')) { const y = scrollY; await route(); scrollTo(0, y); } }, 120000);
})();
})();
