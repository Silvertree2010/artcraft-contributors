import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const D = process.env.DATA || './data';
const W = path.resolve(process.env.WEB || './web');
const B = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const O = 'storytold';
const P = +(process.env.PORT || 8080);
const rf = (f) => { try { return fs.readFileSync(f, 'utf8').trim(); } catch { return ''; } };
const TK = process.env.GH_TOKEN || rf('/run/secrets/gh_token');
const CI = process.env.OAUTH_ID || rf('/run/secrets/oauth_id');
const CS = process.env.OAUTH_SECRET || rf('/run/secrets/oauth_secret');
fs.mkdirSync(D, { recursive: true });

const kf = path.join(D, 'key');
if (!fs.existsSync(kf)) fs.writeFileSync(kf, crypto.randomBytes(32).toString('hex'), { mode: 0o600 });
const K = Buffer.from(rf(kf), 'hex');

const H = 3600e3, DY = 86400e3;
const sl = (ms) => new Promise((r) => setTimeout(r, ms));
const rj = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(D, f), 'utf8')); } catch { return d; } };
const wj = (f, v) => { const t = path.join(D, f + '.tmp'); fs.writeFileSync(t, JSON.stringify(v)); fs.renameSync(t, path.join(D, f)); };
const hd = { Accept: 'application/vnd.github+json', 'User-Agent': 'artcraft-contributors', 'X-GitHub-Api-Version': '2022-11-28' };
if (TK) hd.Authorization = 'Bearer ' + TK;

async function gh(u, h = hd) {
  const r = await fetch('https://api.github.com' + u, { headers: h, signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error(u.split('?')[0] + ' ' + r.status);
  return r.json();
}

const db = rj('db.json', { a: {}, p: {}, u: {}, r: [], ca: {}, c: {} });
db.a ||= {}; db.p ||= {}; db.u ||= {}; db.r ||= []; db.ca ||= {}; db.c ||= {};
let dirty = 0, rt = 0, err = null;
const sec = (t) => (t ? Math.round(Date.parse(t) / 1000) : 0);
const okr = (r) => !r.archived && !/^placeholder-/i.test(r.name) && /craft/i.test(r.name);

async function repos() {
  const j = await gh(`/orgs/${O}/repos?per_page=100&type=public`);
  db.r = j.filter(okr).map((r) => ({ n: r.name, s: r.stargazers_count, f: r.forks_count, d: r.description || '' }));
  rt = Date.now(); dirty = 1;
}

const QM = 'alert_status,code_smells,bugs,vulnerabilities,ncloc,coverage,duplicated_lines_density';
let qt = 0;
async function sq() {
  const sf = async (u) => { const r = await fetch('https://sonarcloud.io/api' + u, { signal: AbortSignal.timeout(25000) }); if (!r.ok) throw new Error('sonar ' + r.status); return r.json(); };
  const pj = (await sf(`/components/search_projects?organization=${O}&ps=500`)).components || [];
  const km = Object.fromEntries(pj.map((c) => [c.key, c.name]));
  const q = {};
  for (let i = 0; i < pj.length; i += 50) {
    const j = await sf(`/measures/search?projectKeys=${pj.slice(i, i + 50).map((c) => c.key).join(',')}&metricKeys=${QM}`);
    for (const m of j.measures || []) (q[km[m.component]] ||= { k: m.component })[m.metric] = m.metric === 'alert_status' ? m.value : +m.value;
  }
  db.q = q; qt = Date.now(); dirty = 1;
}

const PQ = `query($o:String!,$r:String!,$a:String){repository(owner:$o,name:$r){pullRequests(first:100,after:$a,orderBy:{field:UPDATED_AT,direction:DESC}){pageInfo{hasNextPage endCursor}nodes{number title createdAt mergedAt closedAt updatedAt author{__typename login ...on User{databaseId}}}}}}`;
async function gql(q, v) {
  const r = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { ...hd, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q, variables: v }), signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error('graphql ' + r.status);
  const j = await r.json();
  if (!j.data) throw new Error('graphql ' + (j.errors && j.errors[0] && j.errors[0].message));
  return j.data;
}

const CQ = `query($o:String!,$r:String!,$a:String,$s:GitTimestamp){repository(owner:$o,name:$r){defaultBranchRef{target{...on Commit{history(first:100,after:$a,since:$s){pageInfo{hasNextPage endCursor}nodes{oid committedDate author{user{login databaseId}}}}}}}}}`;
async function csync() {
  let n = 0;
  for (const { n: rn } of db.r) {
    const s = (db.ca[rn] ||= { cur: null, start: null, aft: null, full: 0, si: null });
    if (!s.start) {
      if (s.cur && Date.now() - Date.parse(s.cur) < 10 * 60e3) continue;
      const fu = Date.now() - s.full > DY;
      s.start = new Date().toISOString(); s.aft = null;
      s.si = fu || !s.cur ? null : new Date(Date.parse(s.cur) - 3 * DY).toISOString();
      if (fu) s.full = Date.now();
    }
    while (s.start && n < 60) {
      const j = await gql(CQ, { o: O, r: rn, a: s.aft, s: s.si });
      n++;
      const h = j.repository && j.repository.defaultBranchRef && j.repository.defaultBranchRef.target && j.repository.defaultBranchRef.target.history;
      const cc = (db.c[rn] ||= {});
      for (const c of (h ? h.nodes : [])) {
        const us = c.author && c.author.user;
        if (!us) continue;
        if (us.databaseId) db.u[us.login] = us.databaseId;
        cc[c.oid.slice(0, 10)] = [us.login, sec(c.committedDate)];
      }
      dirty = 1;
      if (!h || !h.pageInfo.hasNextPage) { s.cur = s.start; s.start = null; s.aft = null; }
      else s.aft = h.pageInfo.endCursor;
      await sl(300);
    }
    if (dirty) { wj('db.json', db); dirty = 0; build(); }
    if (n >= 60) break;
  }
}

async function sync() {
  let n = 0;
  for (const { n: rn } of db.r) {
    const s = (db.a[rn] ||= { cur: null, start: null, aft: null });
    if (!s.start) {
      if (s.cur && Date.now() - Date.parse(s.cur) < 2 * 60e3) continue;
      s.start = new Date().toISOString(); s.aft = null;
    }
    while (s.start && n < 80) {
      const j = await gql(PQ, { o: O, r: rn, a: s.aft });
      n++;
      const pr = j.repository.pullRequests, pp = (db.p[rn] ||= {});
      for (const q of pr.nodes) {
        if (!q.author) continue;
        if (q.author.databaseId) db.u[q.author.login] = q.author.databaseId;
        const al = q.author.__typename === 'Bot' && !/\[bot\]$/.test(q.author.login) ? q.author.login + '[bot]' : q.author.login;
        pp[q.number] = [al, sec(q.createdAt), sec(q.mergedAt), sec(q.closedAt), (q.title || '').slice(0, 140)];
      }
      dirty = 1;
      const ls = pr.nodes[pr.nodes.length - 1];
      if (!pr.pageInfo.hasNextPage || (s.cur && ls && ls.updatedAt < s.cur)) { s.cur = s.start; s.start = null; s.aft = null; }
      else s.aft = pr.pageInfo.endCursor;
      await sl(300);
    }
    if (dirty) { wj('db.json', db); dirty = 0; build(); }
    if (n >= 80) break;
  }
}

const bot = (l) => /\[bot\]$/i.test(l);
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length & 1 ? s[m] : (s[m - 1] + s[m]) / 2; };
const TB = [3600, 3 * 3600, 6 * 3600, 12 * 3600, 86400, 2 * 86400, 4 * 86400, 7 * 86400, Infinity];
const wk = (t) => Math.floor((t / 86400 + 3) / 7);

let S = null, Sz = null, U = new Map(), C = new Map();

function build() {
  const now = Date.now() / 1000;
  const rs = db.r.map((r) => r.n).filter((n) => db.p[n] || db.c[n]);
  const ri = Object.fromEntries(rs.map((n, i) => [n, i]));
  const ND = 90, d0 = Math.floor(now / 86400) - ND + 1;
  const days = Array.from({ length: ND }, (_, i) => ({ d: (d0 + i) * 86400, o: 0, x: 0, m: new Array(rs.length).fill(0), a: new Set(), n: 0 }));
  const heat = Array.from({ length: 7 }, () => new Array(24).fill(0));
  const hist = new Array(TB.length).fill(0);
  const ppl = new Map(), wks = new Map(), rp = rs.map((n) => ({ n, m: 0, o: 0, op: 0, c: new Set(), t: [], cm: 0, b: null }));
  const all = [];
  let tm = 0, op = 0, m1 = 0, m7 = 0, t30 = [];
  const np = (l, c) => { let p = ppl.get(l); if (!p) { p = { l, i: db.u[l] || 0, m: 0, o: 0, op: 0, m7: 0, m30: 0, r: {}, f: c, ls: c, t: [], cm: 0, cr: {}, b: [] }; ppl.set(l, p); } return p; };
  const CX = new Map();
  let tc = 0;
  for (const rn of rs) {
    const R = rp[ri[rn]], by = {};
    for (const [l, t] of Object.values(db.c[rn] || {})) {
      if (bot(l)) continue;
      const p = np(l, t);
      p.cm++; R.cm++; tc++;
      p.cr[rn] = (p.cr[rn] || 0) + 1;
      if (t < p.f) p.f = t;
      if (t > p.ls) p.ls = t;
      by[l] = (by[l] || 0) + 1;
    }
    const tp = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
    if (tp && R.cm >= 10 && tp[1] >= R.cm * .3) { R.b = tp[0]; ppl.get(tp[0]).b.push(rn); }
  }
  for (const rn of rs) {
    const R = rp[ri[rn]];
    for (const [nr, [l, c, m, x, ti]] of Object.entries(db.p[rn] || {})) {
      if (bot(l)) continue;
      const p = np(l, c);
      p.o++; R.o++; R.c.add(l);
      if (c < p.f) p.f = c;
      if (c > p.ls) p.ls = c;
      const di = Math.floor(c / 86400) - d0;
      if (di >= 0 && di < ND) days[di].o++;
      if (!x) { p.op++; R.op++; op++; }
      if (m) {
        tm++; p.m++; R.m++;
        p.r[rn] = (p.r[rn] || 0) + 1;
        if (m > p.ls) p.ls = m;
        const dt = m - c;
        p.t.push(dt); R.t.push(dt);
        if (now - m < 86400) m1++;
        if (now - m < 7 * 86400) { m7++; p.m7++; }
        if (now - m < 30 * 86400) { p.m30++; t30.push(dt); }
        hist[TB.findIndex((b) => dt < b)]++;
        const dd = new Date(m * 1000);
        heat[(dd.getUTCDay() + 6) % 7][dd.getUTCHours()]++;
        const mi = Math.floor(m / 86400) - d0;
        if (mi >= 0 && mi < ND) { days[mi].m[ri[rn]]++; days[mi].a.add(l); }
        const w = wk(m), W2 = wks.get(w) || { w, m: 0, a: new Set(), n: 0 };
        W2.m++; W2.a.add(l); wks.set(w, W2);
        all.push([m, rn, +nr, ti, l]);
      } else if (x) {
        const xi = Math.floor(x / 86400) - d0;
        if (xi >= 0 && xi < ND) days[xi].x++;
      }
    }
  }
  const tl = (t) => t.replace(/\s*\(#\d+\)\s*$/, '').trim().toLowerCase();
  for (const rn of rs) {
    const pr = db.p[rn]; if (!pr) continue;
    const bt = new Map();
    for (const v of Object.values(pr)) if (v[2]) bt.set(tl(v[4]), v[0]);
    for (const v of Object.values(pr)) {
      const mt = v[2] && /^revert\s+"(.+)"\s*(\(#\d+\))?$/i.exec(v[4]);
      if (!mt) continue;
      const ol = bt.get(tl(mt[1]));
      if (ol && ppl.has(ol)) ppl.get(ol).rv = (ppl.get(ol).rv || 0) + 1;
    }
  }
  let pre = 0;
  for (const p of ppl.values()) {
    const fi = Math.floor(p.f / 86400) - d0;
    if (fi < 0) pre++; else if (fi < ND) days[fi].n++;
    const w = wk(p.f), W2 = wks.get(w) || { w, m: 0, a: new Set(), n: 0 };
    W2.n++; wks.set(w, W2);
  }
  const wl = [...wks.values()].sort((a, b) => a.w - b.w);
  let cum = 0;
  const weeks = wl.map((w) => { cum += w.n; return [w.w * 7 * 86400 - 3 * 86400, w.m, w.a.size, w.n, cum]; });
  const lead = [...ppl.values()].map((p) => {
    const tr = Object.entries(p.r).sort((a, b) => b[1] - a[1]);
    const ca = Object.entries(p.cr).sort((a, b) => b[1] - a[1]);
    CX.set(p.l.toLowerCase(), ca);
    const ar = new Set([...Object.keys(p.r), ...Object.keys(p.cr)]);
    return [p.l, p.i, p.m, p.o, p.op, p.m7, p.m30, ar.size, tr[0] ? tr[0][0] : ca[0] ? ca[0][0] : '', p.f, p.ls, med(p.t), p.cm, p.b, p.m + (p.o - p.op - p.m) >= 5 ? Math.round(p.m / (p.o - p.op) * 1000) / 1000 : null, p.rv || 0];
  }).sort((a, b) => b[2] - a[2] || b[12] - a[12] || b[3] - a[3]);
  all.sort((a, b) => b[0] - a[0]);
  const n30 = [...ppl.values()].filter((p) => now - p.f < 30 * 86400).length;
  S = {
    at: Math.round(now), sync: !db.r.length ? 1 : db.r.filter((r) => !db.a[r.n] || !db.a[r.n].cur || !db.ca[r.n] || !db.ca[r.n].cur).length, err,
    k: { c: ppl.size, m: tm, o: op, cm: tc, m1, m7, t: med(t30), n30, pr: all.length && rp.reduce((s, r) => s + r.o, 0) },
    rs: rp.map((r) => ({ n: r.n, m: r.m, o: r.o, op: r.op, c: r.c.size, t: med(r.t), cm: r.cm, b: r.b, q: (db.q || {})[r.n] || null, s: (db.r.find((x) => x.n === r.n) || {}).s || 0 })),
    pre, days: days.map((d) => [d.d, d.o, d.x, d.m, d.a.size, d.n]), weeks, heat, hist, lead, recent: all.slice(0, 40),
  };
  Sz = zlib.gzipSync(JSON.stringify(S));
  const idx = new Map();
  for (const rn of rs) for (const [nr, v] of Object.entries(db.p[rn] || {})) {
    if (bot(v[0])) continue;
    const k = v[0].toLowerCase();
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k).push([rn, +nr, v[1], v[2], v[3], v[4]]);
  }
  U = idx; C = CX;
}

async function tick() {
  try {
    if (!db.r.length || Date.now() - rt > H) await repos();
    await sync();
    await csync();
    if (Date.now() - qt > H) await sq().catch((e) => console.error('[sonar]', e.message));
    err = null;
  } catch (e) { err = e.message; console.error('[sync]', e.message); }
  if (dirty) { wj('db.json', db); dirty = 0; }
  build();
}

const sk = (o) => { const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', K, iv); const b = Buffer.concat([c.update(JSON.stringify(o)), c.final()]); return Buffer.concat([iv, c.getAuthTag(), b]).toString('base64url'); };
const uk = (s) => { try { const b = Buffer.from(s, 'base64url'), d = crypto.createDecipheriv('aes-256-gcm', K, b.subarray(0, 12)); d.setAuthTag(b.subarray(12, 28)); const o = JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()])); return o.e > Date.now() ? o : null; } catch { return null; } };
const ck = (r) => Object.fromEntries((r.headers.cookie || '').split(';').map((x) => x.trim().split('=')).filter((x) => x[0]).map(([a, ...b]) => [a, b.join('=')]));
const sc = (n, v, a) => `${n}=${v}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${a}`;

function js(q, s, o, c = 'no-store') {
  const b = zlib.gzipSync(JSON.stringify(o));
  s.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Cache-Control': c });
  s.end(b);
}
const no = (s, c = 404, t = 'not found') => { s.writeHead(c, { 'Content-Type': 'text/plain' }); s.end(t); };

const GQ = `query($q:String!,$r:String!,$i:String!){
 o:search(query:$q,type:ISSUE,first:50){nodes{...on PullRequest{number title url isDraft createdAt updatedAt mergeable reviewDecision repository{name}
  comments(last:1){totalCount nodes{author{login} createdAt}}
  reviews(last:1){nodes{state author{login} submittedAt}}
  commits(last:1){nodes{commit{committedDate statusCheckRollup{state}}}}}}}
 r:search(query:$r,type:ISSUE,first:30){nodes{...on PullRequest{number title url createdAt repository{name} author{login}}}}
 i:search(query:$i,type:ISSUE,first:30){issueCount nodes{...on Issue{number title url createdAt repository{name} comments{totalCount}}}}}`;

async function me(u) {
  const h = { ...hd, Authorization: 'Bearer ' + u.t, 'Content-Type': 'application/json' };
  const r = await fetch('https://api.github.com/graphql', { method: 'POST', headers: h, signal: AbortSignal.timeout(25000), body: JSON.stringify({ query: GQ, variables: { q: `author:${u.l} org:${O} is:pr is:open`, r: `review-requested:${u.l} org:${O} is:pr is:open`, i: `author:${u.l} org:${O} is:issue is:open` } }) });
  if (r.status === 401) return null;
  const j = await r.json();
  if (!j.data) throw new Error('graphql');
  const d = j.data;
  return {
    open: d.o.nodes.filter((n) => n.number).map((n) => {
      const lc = n.commits.nodes[0]?.commit, cm = n.comments.nodes[0], rv = n.reviews.nodes[0];
      const pu = lc ? Date.parse(lc.committedDate) : 0;
      return { r: n.repository.name, n: n.number, t: n.title, u: n.url, dr: n.isDraft, c: n.createdAt, up: n.updatedAt, mg: n.mergeable, rd: n.reviewDecision, ci: lc?.statusCheckRollup?.state || null, cc: n.comments.totalCount,
        nc: !!(cm && cm.author && cm.author.login !== u.l && Date.parse(cm.createdAt) > pu), rv: rv ? { s: rv.state, a: rv.author?.login, at: rv.submittedAt } : null };
    }),
    rq: d.r.nodes.filter((n) => n.number).map((n) => ({ r: n.repository.name, n: n.number, t: n.title, u: n.url, c: n.createdAt, a: n.author?.login })),
    is: d.i.nodes.filter((n) => n.number).map((n) => ({ r: n.repository.name, n: n.number, t: n.title, u: n.url, c: n.createdAt, cc: n.comments.totalCount })),
  };
}

const MT = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };
const SH = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'Content-Security-Policy': "default-src 'self'; img-src 'self' https://avatars.githubusercontent.com; style-src 'self'; style-src-attr 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'" };

function file(q, s, p) {
  const f = path.join(W, path.normalize(p === '/' ? '/index.html' : p));
  if (!f.startsWith(W + path.sep)) return no(s);
  fs.readFile(f, (e, b) => {
    if (e) { if (!path.extname(p)) return file(q, s, '/'); return no(s); }
    const x = path.extname(f), im = /\.(woff2|png|svg)$/.test(x);
    const gz = /gzip/.test(q.headers['accept-encoding'] || '') && /\.(html|js|css|svg|txt)$/.test(x);
    s.writeHead(200, { ...SH, 'Content-Type': MT[x] || 'application/octet-stream', 'Cache-Control': im ? 'public, max-age=604800' : 'no-cache', ...(gz ? { 'Content-Encoding': 'gzip' } : {}) });
    s.end(gz ? zlib.gzipSync(b) : b);
  });
}

http.createServer(async (q, s) => {
  const u = new URL(q.url, B), p = u.pathname;
  try {
    if (p === '/api/stats') {
      if (!Sz) return no(s, 503, 'warming up');
      s.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Cache-Control': 'public, max-age=30' });
      return s.end(Sz);
    }
    if (p.startsWith('/api/u/')) {
      const l = decodeURIComponent(p.slice(7)).toLowerCase(), L = U.get(l) || [];
      const row = S ? S.lead.findIndex((r) => r[0].toLowerCase() === l) : -1;
      if (row < 0) return no(s);
      return js(q, s, { row: S.lead[row], rank: row + 1, of: S.lead.length, prs: [...L].sort((a, b) => b[2] - a[2]), cm: C.get(l) || [] }, 'public, max-age=30');
    }
    if (p === '/api/session') {
      const c = uk(ck(q).s || '');
      return js(q, s, { on: !!(CI && CS), me: c ? { l: c.l, i: c.i } : null });
    }
    if (p === '/api/me') {
      const c = uk(ck(q).s || '');
      if (!c) return no(s, 401, 'sign in');
      const m = await me(c);
      if (!m) { s.setHeader('Set-Cookie', sc('s', '', 0)); return no(s, 401, 'sign in'); }
      return js(q, s, m);
    }
    if (p === '/auth/login') {
      if (!CI) return no(s, 503, 'sign-in not configured');
      const st = crypto.randomBytes(16).toString('hex');
      s.writeHead(302, { 'Set-Cookie': sc('st', st, 600), Location: `https://github.com/login/oauth/authorize?client_id=${CI}&redirect_uri=${encodeURIComponent(B + '/auth/cb')}&state=${st}&allow_signup=false` });
      return s.end();
    }
    if (p === '/auth/cb') {
      const st = ck(q).st, cd = u.searchParams.get('code');
      if (!st || !cd || st !== u.searchParams.get('state')) return no(s, 400, 'bad state');
      const r = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: CI, client_secret: CS, code: cd, redirect_uri: B + '/auth/cb' }), signal: AbortSignal.timeout(15000) });
      const j = await r.json();
      if (!j.access_token) return no(s, 400, 'sign-in failed');
      const me = await gh('/user', { ...hd, Authorization: 'Bearer ' + j.access_token });
      s.writeHead(302, { 'Set-Cookie': [sc('st', '', 0), sc('s', sk({ l: me.login, i: me.id, t: j.access_token, e: Date.now() + 30 * DY }), 30 * 86400)], Location: '/#/me' });
      return s.end();
    }
    if (p === '/auth/logout' && q.method === 'POST') {
      s.writeHead(204, { 'Set-Cookie': sc('s', '', 0) });
      return s.end();
    }
    if (p === '/healthz') return no(s, 200, 'ok');
    if (q.method !== 'GET' && q.method !== 'HEAD') return no(s, 405, 'method');
    return file(q, s, p);
  } catch (e) {
    console.error('[req]', p, e.message);
    if (!s.headersSent) no(s, 502, 'upstream error');
  }
}).listen(P, () => console.log('listening', P));

build();
let busy = 0;
const run = async () => { if (busy) return; busy = 1; await tick(); busy = 0; };
setInterval(run, 60e3);
run();
