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
const DU = (process.env.DCB_URL || '').replace(/\/$/, '');
const DT = process.env.DCB_TOKEN || rf('/run/secrets/dcb_token');
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
db.a ||= {}; db.p ||= {}; db.u ||= {}; db.r ||= []; db.ca ||= {}; db.c ||= {}; db.pm ||= []; db.dl ||= {}; db.dh ||= {}; db.rv ||= {}; db.is ||= {}; db.ia ||= {}; db.st ||= {}; db.ci ||= {}; db.rh ||= {}; db.ks ||= [];
db.dc ||= { d: {}, u: {}, ch: {}, h: Array.from({ length: 7 }, () => new Array(24).fill(0)), z: 0, zi: [], gp: [[1793201367, 1793367449]], on: 1, f: 0 };
if (db.iv !== 2) { for (const s of Object.values(db.ia)) { s.cur = null; s.start = null; s.aft = null; } db.iv = 2; }
if (db.v !== 3) { for (const s of Object.values(db.a)) { s.cur = null; s.start = null; s.aft = null; } db.v = 3; }
let dirty = 0, rt = 0, err = null, ef = 0;
const sec = (t) => (t ? Math.round(Date.parse(t) / 1000) : 0);
const okr = (r) => !r.archived && !/^placeholder-/i.test(r.name) && /craft/i.test(r.name);

const ow = (n) => (db.r.find((r) => r.n === n) || {}).o || O;
async function comm() {
  const f = await gh('/repos/storytold/craft-launcher/contents/crates/core/src/catalog.rs');
  const t = Buffer.from(f.content, 'base64').toString('utf8');
  const cs = [...t.matchAll(/kind:\s*AppKind::Community[\s\S]*?"([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)"/g)].map((m) => [m[1], m[2]]).filter(([o]) => o.toLowerCase() !== O);
  const out = [];
  for (const [o, n] of cs) { try { out.push(await gh(`/repos/${o}/${n}`)); } catch (e) { console.error('[comm]', o, n, e.message); } }
  return out;
}
async function repos() {
  const j = await gh(`/orgs/${O}/repos?per_page=100&type=public`);
  const cx = await comm().catch((e) => { console.error('[comm]', e.message); return db.r.filter((r) => r.c).map((r) => ({ name: r.n, owner: { login: r.o }, stargazers_count: r.s, forks_count: r.f, description: r.d })); });
  db.r = [...j.filter(okr).map((r) => ({ n: r.name, o: O, s: r.stargazers_count, f: r.forks_count, d: r.description || '', b: r.default_branch, io: r.open_issues_count })),
    ...cx.filter((r) => !r.archived && !j.some((x) => x.name === r.name)).map((r) => ({ n: r.name, o: r.owner.login, c: 1, s: r.stargazers_count, f: r.forks_count, d: r.description || '', b: r.default_branch, io: r.open_issues_count }))];
  db.pm = (await gh(`/orgs/${O}/public_members?per_page=100`)).map((m) => m.login);
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

const pf = (a) => {
  const x = a.toLowerCase();
  if (/\.(zsync|sig|asc|sha256|blockmap|txt|json|ya?ml|mp4|webm|mov|gif|png|jpe?g)$|sha256sums/.test(x)) return null;
  const p = /-cli-/.test(x) ? 'cli' : /-web-|wasm/.test(x) ? 'web' : /freebsd/.test(x) ? 'bsd' : /windows|win(32|64)|\.(msi|exe|msix)$/.test(x) ? 'win'
    : /macos|darwin|osx|universal|\.(dmg|pkg)$/.test(x) ? 'mac' : /linux|\.(appimage|deb|rpm|flatpak|snap)$|\.pkg\.tar/.test(x) ? 'lin' : 'oth';
  const r = /aarch64|arm64/.test(x) ? 'arm64' : /riscv/.test(x) ? 'riscv64' : /x86_64|x64|amd64/.test(x) ? 'x64' : /x86|i686|win32/.test(x) ? 'x86' : /universal/.test(x) ? 'universal' : '';
  const f = (/\.(appimage|deb|rpm|flatpak|snap|msi|exe|msix|dmg|pkg|zip)$/.exec(x) || /\.(pkg\.tar\.zst|tar\.gz|tar\.xz)$/.exec(x) || [])[1] || '';
  return [p, r, f];
};
let dt0 = 0;
const sk0 = (k) => /^(__proto__|constructor|prototype)$/.test(k) ? '_' + k : k;
async function dl() {
  const out = {}, td = Math.floor(Date.now() / DY) * 86400;
  for (const r of db.r) {
    const o = { t: 0, p: {}, a: {}, f: {}, rl: [] };
    for (let pg = 1; pg <= 5; pg++) {
      const j = await gh(`/repos/${r.o || O}/${r.n}/releases?per_page=100&page=${pg}`);
      for (const R of j) {
        let rt = 0;
        for (const a of R.assets) {
          const c = pf(a.name); if (!c) continue;
          const n = a.download_count; rt += n; o.t += n;
          o.p[c[0]] = (o.p[c[0]] || 0) + n;
          if (c[1]) o.a[c[1]] = (o.a[c[1]] || 0) + n;
          if (c[2]) o.f[c[0] + ':' + c[2]] = (o.f[c[0] + ':' + c[2]] || 0) + n;
        }
        o.rl.push([R.tag_name, sec(R.published_at), rt, R.prerelease ? 1 : 0, (R.body || '').split('\n').filter((l) => /^\s*[-*]\s/.test(l)).length]);
        const ag = Date.now() / 1000 - sec(R.published_at);
        if (ag < 8 * 86400) { const hh = ((db.rh[r.n] ||= Object.create(null))[sk0(R.tag_name)] ||= []); if (!hh.length || hh[hh.length - 1][1] !== rt) hh.push([Math.round(Date.now() / 1000), rt]); }
      }
      if (j.length < 100) break;
    }
    try {
      const b = await fetch(`https://formulae.brew.sh/api/cask/${r.n === 'craft-launcher' ? 'artcraft-launcher' : r.n}.json`, { signal: AbortSignal.timeout(15000) });
      if (b.ok) { const j = await b.json(); if (j.url && j.url.toLowerCase().includes(`github.com/${(r.o || O).toLowerCase()}/${r.n.toLowerCase()}/`)) { const i = j.analytics && j.analytics.install; o.br = i ? [30, 90, 365].map((d) => Object.values(i[d + 'd'] || {})[0] || 0) : null; } }
    } catch (e) { console.error('[brew]', r.n, e.message); }
    out[r.n] = o;
    const h = (db.dh[r.n] ||= []);
    if (h.length && h[h.length - 1][0] === td) h[h.length - 1][1] = o.t; else h.push([td, o.t]);
    if (h.length > 400) h.splice(0, h.length - 400);
    await sl(200);
  }
  db.dl = out; dt0 = Date.now(); dirty = 1;
}

const PF = 'number title createdAt mergedAt closedAt updatedAt mergedBy{login} author{__typename login ...on User{databaseId}}';
const PQ = `query($o:String!,$r:String!,$a:String){repository(owner:$o,name:$r){pullRequests(first:100,after:$a,orderBy:{field:UPDATED_AT,direction:DESC}){pageInfo{hasNextPage endCursor}nodes{${PF} reviews(first:30){nodes{author{__typename login} submittedAt state}}}}}}`;
const RS = { APPROVED: 'A', CHANGES_REQUESTED: 'C', COMMENTED: 'R', DISMISSED: 'D' };
const prv = (rn, q) => {
  if (!q.reviews || !q.author) return;
  const v = q.reviews.nodes.filter((x) => x.author && x.author.login !== q.author.login && x.submittedAt).map((x) => [x.author.__typename === 'Bot' && !/\[bot\]$/.test(x.author.login) ? x.author.login + '[bot]' : x.author.login, sec(x.submittedAt), RS[x.state] || 'R']);
  const m = (db.rv[rn] ||= {});
  if (v.length) m[q.number] = v; else delete m[q.number];
};
const pt = (q) => {
  if (!q.author) return null;
  if (q.author.databaseId) db.u[q.author.login] = q.author.databaseId;
  const al = q.author.__typename === 'Bot' && !/\[bot\]$/.test(q.author.login) ? q.author.login + '[bot]' : q.author.login;
  return [al, sec(q.createdAt), sec(q.mergedAt), sec(q.closedAt), (q.title || '').slice(0, 140), (q.mergedBy && q.mergedBy.login) || ''];
};
let RL = { rem: 5000, reset: 0 };
const low = () => RL.rem < 800 && Date.now() < RL.reset;
async function gql(q, v) {
  let r;
  for (let i = 0; ; i++) {
    r = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { ...hd, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q, variables: v }), signal: AbortSignal.timeout(30000) }).catch((e) => { if (i >= 2) throw e; return null; });
    if (r && r.status < 500) break;
    if (i >= 2) break;
    await new Promise((f) => setTimeout(f, 3000 * (i + 1)));
  }
  const rm = r.headers.get('x-ratelimit-remaining'), rs = r.headers.get('x-ratelimit-reset');
  if (rm != null) RL = { rem: +rm, reset: +rs * 1000 };
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
    while (s.start && n < 60 && !low()) {
      const j = await gql(CQ, { o: ow(rn), r: rn, a: s.aft, s: s.si });
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
    while (s.start && n < 80 && !low()) {
      const j = await gql(PQ, { o: ow(rn), r: rn, a: s.aft });
      n++;
      const pr = j.repository.pullRequests, pp = (db.p[rn] ||= {});
      for (const q of pr.nodes) { const v = pt(q); if (v) pp[q.number] = v; prv(rn, q); }
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

const BK = (ls) => ls.some((l) => /bug|crash|regress|broken|defect/i.test(l)) ? 'b' : ls.some((l) => /feature|enhancement|request|idea|proposal/i.test(l)) ? 'f' : '';
const TCK = (t) => /\b(bug|crash\w*|errors?|fail\w*|broken|freez\w*|hangs?|not working|doesn'?t|does not|can'?t|cannot|won'?t|wrong|incorrect|regression|glitch\w*|missing|unable|issues?|problems?|exception|panic|slow|lag\w*|disappear\w*|stuck|corrupt\w*|bad|not \w+|dont|doesnt|illegible|cursed|unreadable|blank|garbled|misaligned|overlap\w*)\b/i.test(t) ? 'b' : /^\s*\[?(question|help|how)\b|\?\s*$/i.test(t) ? 'q' : /^[A-Z][\w /&+-]{1,40}:\s/.test(t) ? 't' : /\b(feature|request|add\w*|support\w*|please|would be nice|suggest\w*|idea|implement\w*|allow\w*|option|ability|enhance\w*|improve\w*|proposal|new|integrat\w*|want|wish|could you|make it|requests?|consider|distribute|change|move|let|enable|export|import|sign\w*|via|mode|dark|shortcut\w*|tool|plugin|feature)\b/i.test(t) ? 'f' : '';
const IQ = `query($o:String!,$r:String!,$a:String){repository(owner:$o,name:$r){issues(first:100,after:$a,orderBy:{field:UPDATED_AT,direction:DESC}){pageInfo{hasNextPage endCursor}nodes{number title createdAt closedAt updatedAt stateReason author{__typename login} labels(first:10){nodes{name}} comments(first:6){nodes{createdAt author{__typename login}}}}}}}`;
async function isync() {
  let n = 0;
  for (const { n: rn } of db.r) {
    const s = (db.ia[rn] ||= { cur: null, start: null, aft: null });
    if (!s.start) {
      if (s.cur && Date.now() - Date.parse(s.cur) < 10 * 60e3) continue;
      s.start = new Date().toISOString(); s.aft = null;
    }
    while (s.start && n < 80 && !low()) {
      const j = await gql(IQ, { o: ow(rn), r: rn, a: s.aft });
      n++;
      if (!j.repository) { s.cur = s.start; s.start = null; s.aft = null; break; }
      const is = j.repository.issues, ii = (db.is[rn] ||= {});
      for (const q of is.nodes) {
        if (!q.author) continue;
        const a = q.author.__typename === 'Bot' && !/\[bot\]$/.test(q.author.login) ? q.author.login + '[bot]' : q.author.login;
        const fc = q.comments.nodes.find((c) => c.author && c.author.login !== q.author.login && c.author.__typename !== 'Bot');
        ii[q.number] = [a, sec(q.createdAt), sec(q.closedAt), BK(q.labels.nodes.map((l) => l.name)) || TCK(q.title || ''), fc ? sec(fc.createdAt) : 0, q.stateReason === 'NOT_PLANNED' ? 2 : q.stateReason === 'COMPLETED' ? 1 : 0];
      }
      dirty = 1;
      const ls = is.nodes[is.nodes.length - 1];
      if (!is.pageInfo.hasNextPage || (s.cur && ls && ls.updatedAt < s.cur)) { s.cur = s.start; s.start = null; s.aft = null; }
      else s.aft = is.pageInfo.endCursor;
      await sl(300);
    }
    if (n >= 80 || low()) break;
  }
}

const SQ = `query($o:String!,$r:String!,$a:String){repository(owner:$o,name:$r){stargazers(first:100,after:$a,orderBy:{field:STARRED_AT,direction:DESC}){pageInfo{hasNextPage endCursor}edges{starredAt}}}}`;
async function ssync() {
  let n = 0;
  for (const { n: rn } of db.r) {
    const s = (db.st[rn] ||= { d: {}, top: 0, run: null, at: 0 });
    if (!s.run) {
      if (Date.now() - s.at < 30 * 60e3) continue;
      s.run = { aft: null, top: 0, d: {} };
    }
    const R2 = s.run;
    while (s.run && n < 50 && !low()) {
      const j = await gql(SQ, { o: ow(rn), r: rn, a: R2.aft });
      n++;
      if (!j.repository) { s.run = null; s.at = Date.now(); break; }
      const g = j.repository.stargazers;
      let stop = !g.pageInfo.hasNextPage;
      for (const e of g.edges) {
        const t = sec(e.starredAt);
        if (s.top && t <= s.top) { stop = true; break; }
        if (t > R2.top) R2.top = t;
        const d = Math.floor(t / 86400);
        R2.d[d] = (R2.d[d] || 0) + 1;
      }
      if (stop) {
        if (!s.top) s.d = R2.d; else for (const [d, c] of Object.entries(R2.d)) s.d[d] = (s.d[d] || 0) + c;
        if (R2.top > s.top) s.top = R2.top;
        s.run = null; s.at = Date.now();
      } else R2.aft = g.pageInfo.endCursor;
      dirty = 1;
      await sl(250);
    }
    if (n >= 50 || low()) break;
  }
}

let ct = 0;
async function ci() {
  const since = new Date(Date.now() - 14 * DY).toISOString().slice(0, 10);
  for (const r of db.r) {
    if (!r.b) continue;
    const rr = [];
    for (let pg = 1; pg <= 3; pg++) {
      const j = await gh(`/repos/${r.o || O}/${r.n}/actions/runs?branch=${encodeURIComponent(r.b)}&event=push&per_page=100&page=${pg}&created=%3E%3D${since}`);
      rr.push(...j.workflow_runs);
      if (j.workflow_runs.length < 100) break;
    }
    const dn = rr.filter((x) => x.status === 'completed' && /^(success|failure|timed_out)$/.test(x.conclusion));
    const wf = Object.create(null);
    for (const x of dn) { const w = (wf[x.name] ||= [0, 0]); w[x.conclusion === 'success' ? 0 : 1]++; }
    const ds = dn.filter((x) => x.conclusion === 'success' && x.run_started_at).map((x) => (Date.parse(x.updated_at) - Date.parse(x.run_started_at)) / 1000);
    db.ci[r.n] = { n: dn.length, ok: dn.filter((x) => x.conclusion === 'success').length, med: med(ds), wf, last: dn[0] ? [dn[0].conclusion === 'success' ? 1 : 0, sec(dn[0].updated_at)] : null };
    await sl(200);
  }
  ct = Date.now(); dirty = 1;
}

let dbusy = 0;
async function dpoll() {
  if (!DT || dbusy) return;
  dbusy = 1;
  const X = db.dc, now = Math.round(Date.now() / 1000);
  try {
    let ok = false;
    try { const r = await fetch(DU + '/health', { signal: AbortSignal.timeout(8000) }); ok = r.ok && (await r.json()).ok; } catch {}
    if (!ok && X.on) { X.gp.push([now, 0]); X.on = 0; dirty = 1; }
    if (ok && !X.on) { X.gp[X.gp.length - 1][1] = now; X.on = 1; dirty = 1; }
    for (let i = 0; i < 20; i++) {
      const r = await fetch(`${DU}/statistik?seit=${X.z}`, { headers: { Authorization: 'Bearer ' + DT }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error('dcb ' + r.status);
      const j = await r.json();
      const zs = new Set(X.zi);
      for (const [id, , ch, hs, z] of j) {
        if (z < X.z || (z === X.z && zs.has(id))) continue;
        const d = Math.floor(z / 86400), dd = new Date(z * 1000);
        X.d[d] = (X.d[d] || 0) + 1;
        const u = (X.u[d] ||= []); if (!u.includes(hs)) u.push(hs);
        const c = (X.ch[sk0(String(ch))] ||= {}); c[d] = (c[d] || 0) + 1;
        X.h[(dd.getUTCDay() + 6) % 7][dd.getUTCHours()]++;
        if (!X.f || z < X.f) X.f = z;
        if (z > X.z) { X.z = z; X.zi = []; zs.clear(); }
        X.zi.push(id); zs.add(id);
        dirty = 1;
      }
      if (j.length < 5000) break;
    }
    const lo = Math.floor(now / 86400) - 35;
    for (const d of Object.keys(X.u)) if (+d < lo) delete X.u[d];
    if (dirty) build();
  } catch (e) { console.error('[discord]', e.message); }
  dbusy = 0;
}

let lw = 0, lbusy = 0;
async function live() {
  if (!db.r.length || lbusy) return;
  lbusy = 1;
  try {
    const q = `query($s:GitTimestamp){${db.r.map((r, i) => `r${i}:repository(owner:${JSON.stringify(r.o || O)},name:${JSON.stringify(r.n)}){pullRequests(first:30,orderBy:{field:UPDATED_AT,direction:DESC}){nodes{${PF}}} defaultBranchRef{target{...on Commit{history(first:100,since:$s){nodes{oid committedDate author{user{login databaseId}}}}}}}}`).join(' ')}}`;
    const j = await gql(q, { s: new Date(Date.now() - 15 * 60e3).toISOString() });
    let ch = 0;
    db.r.forEach((r, i) => {
      const x = j['r' + i];
      if (!x) return;
      const pp = (db.p[r.n] ||= {}), cc = (db.c[r.n] ||= {});
      for (const n of x.pullRequests.nodes) {
        const v = pt(n);
        if (v && JSON.stringify(pp[n.number]) !== JSON.stringify(v)) { pp[n.number] = v; ch = 1; }
      }
      const h = x.defaultBranchRef && x.defaultBranchRef.target && x.defaultBranchRef.target.history;
      for (const c of h ? h.nodes : []) {
        const us = c.author && c.author.user, k = c.oid.slice(0, 10);
        if (!us || cc[k]) continue;
        if (us.databaseId) db.u[us.login] = us.databaseId;
        cc[k] = [us.login, sec(c.committedDate)]; ch = 1;
      }
    });
    if (ch) {
      dirty = 1; build();
      if (Date.now() - lw > 120e3) { wj('db.json', db); dirty = 0; lw = Date.now(); }
    }
  } catch (e) { console.error('[live]', e.message); }
  lbusy = 0;
}

const bot = (l) => /\[bot\]$/i.test(l);
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length & 1 ? s[m] : (s[m - 1] + s[m]) / 2; };
const TB = [3600, 3 * 3600, 6 * 3600, 12 * 3600, 86400, 2 * 86400, 4 * 86400, 7 * 86400, Infinity];
const wk = (t) => Math.floor((t / 86400 + 3) / 7);

let S = null, Sz = null, SV = {}, U = new Map(), C = new Map(), UA = new Map(), RV = new Map(), ver = 0;

function bd(fk) {
  const now = Date.now() / 1000;
  const RR = fk === 'a' ? db.r : db.r.filter((r) => fk === 't' ? r.c : !r.c);
  const rs = RR.map((r) => r.n).filter((n) => db.p[n] || db.c[n]);
  const ri = Object.fromEntries(rs.map((n, i) => [n, i]));
  const ND = 90, d0 = Math.floor(now / 86400) - ND + 1;
  const days = Array.from({ length: ND }, (_, i) => ({ d: (d0 + i) * 86400, o: 0, x: 0, m: new Array(rs.length).fill(0), a: new Set(), n: 0, c: 0, r: 0 }));
  const heat = Array.from({ length: 7 }, () => new Array(24).fill(0));
  const hist = new Array(TB.length).fill(0);
  const rc = new Set(RR.filter((r) => r.c).map((r) => r.n));
  const ppl = new Map(), wks = new Map(), rp = rs.map((n) => ({ n, m: 0, o: 0, op: 0, c: new Set(), t: [], cm: 0, b: null }));
  const all = [];
  let tm = 0, op = 0, m1 = 0, m7 = 0, t30 = [];
  const mb = new Map();
  const np = (l, c) => { let p = ppl.get(l); if (!p) { p = { l, i: db.u[l] || 0, m: 0, o: 0, op: 0, m7: 0, m30: 0, r: {}, f: c, ls: c, t: [], cm: 0, c7: 0, c30: 0, cr: {}, b: [] }; ppl.set(l, p); } return p; };
  const CX = new Map();
  let tc = 0;
  for (const rn of rs) {
    const R = rp[ri[rn]], by = {};
    for (const [l, t] of Object.values(db.c[rn] || {})) {
      if (bot(l)) continue;
      const p = np(l, t);
      p.cm++; R.cm++; tc++;
      { const ci = Math.floor(t / 86400) - d0; if (ci >= 0 && ci < ND) days[ci].c++; }
      if (now - t < 7 * 86400) p.c7++;
      if (now - t < 30 * 86400) p.c30++;
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
    for (const [nr, [l, c, m, x, ti, by]] of Object.entries(db.p[rn] || {})) {
      if (by && !bot(by) && !rc.has(rn)) mb.set(by, (mb.get(by) || 0) + 1);
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
  const tn = new Set([...mb.keys(), ...db.pm].map((l) => l.toLowerCase()));
  const team = [...new Set([...mb.keys(), ...db.pm])].map((l) => [l, db.u[l] || 0, mb.get(l) || 0, db.pm.includes(l) ? 1 : 0, ppl.has(l) ? 1 : 0]).sort((a, b) => b[2] - a[2] || b[3] - a[3]);
  const ua = new Map(), uad = (l, t, k) => { const L = l.toLowerCase(); let m = ua.get(L); if (!m) ua.set(L, m = {}); const d = Math.floor(t / 86400); (m[d] ||= [0, 0, 0, 0])[k]++; };
  for (const rn of rs) {
    for (const [l, t] of Object.values(db.c[rn] || {})) if (!bot(l)) uad(l, t, 0);
    for (const [l, c, m] of Object.values(db.p[rn] || {})) if (!bot(l)) { uad(l, c, 1); if (m) uad(l, m, 2); }
  }
  const rvp = new Map(), frt = [], rvr = {};
  for (const rn of rs) {
    const rr = (rvr[rn] = []);
    for (const [nr, v] of Object.entries(db.rv[rn] || {})) {
      const pr = (db.p[rn] || {})[nr];
      for (const [l, t] of v) {
        if (bot(l)) continue;
        let x = rvp.get(l); if (!x) rvp.set(l, x = [0, 0, 0, {}]);
        x[0]++; if (now - t < 30 * 86400) x[1]++; if (now - t < 7 * 86400) x[2]++;
        x[3][rn] = (x[3][rn] || 0) + 1;
        uad(l, t, 3);
        { const ri2 = Math.floor(t / 86400) - d0; if (ri2 >= 0 && ri2 < ND) days[ri2].r++; }
      }
      if (pr && !rc.has(rn)) {
        const f = Math.min(...v.filter((x) => !bot(x[0])).map((x) => x[1]));
        if (isFinite(f) && f >= pr[1] && now - pr[1] < 30 * 86400) { frt.push(f - pr[1]); rr.push(f - pr[1]); }
      }
    }
  }
  const io = new Map();
  let iop = 0, i30 = 0, x30 = 0, np30 = 0, ib = 0, ifr = 0, iq = 0, it2 = 0; const ifs = [], irs = {};
  for (const r of RR) {
    const ii = db.is[r.n]; if (!ii) continue;
    const z = (irs[r.n] = { o: 0, b: 0, f: 0, q: 0, o30: 0, x30: 0, fr: [] });
    for (const [a, c, x, k, fr, rsn] of Object.values(ii)) {
      if (!bot(a)) io.set(a, (io.get(a) || 0) + 1);
      if (!x) { iop++; z.o++; if (k === 'b') { ib++; z.b++; } else if (k === 'f') { ifr++; z.f++; } else if (k === 'q') { iq++; z.q++; } else if (k === 't') { it2++; z.t = (z.t || 0) + 1; } }
      if (now - c < 30 * 86400) { i30++; z.o30++; if (fr) { ifs.push(fr - c); z.fr.push(fr - c); } }
      if (x && now - x < 30 * 86400) { x30++; z.x30++; if (rsn === 2) np30++; }
    }
    z.fr = med(z.fr);
  }
  for (const x of lead) { const v = rvp.get(x[0]) || [0, 0, 0]; x.push(tn.has(x[0].toLowerCase()) ? 1 : 0, mb.get(x[0]) || 0, ppl.get(x[0]).c7, ppl.get(x[0]).c30, v[0], v[1], v[2], io.get(x[0]) || 0, ppl.get(x[0]).r); }
  const rvl = [...rvp.entries()].map(([l, v]) => [l, db.u[l] || 0, v[0], v[1], v[2], Object.entries(v[3]).sort((a, b) => b[1] - a[1])[0][0]]).sort((a, b) => b[2] - a[2]);
  const SD = {}; let stt = 0;
  for (const r of RR) { const st = db.st[r.n]; if (!st || st.run && !st.top) continue; for (const [d, c] of Object.entries(st.d)) SD[d] = (SD[d] || 0) + c; }
  const sdk = Object.keys(SD).map(Number).sort((a, b) => a - b);
  const swk = []; { let cum = 0, cw = null; for (const d of sdk) { cum += SD[d]; const w = Math.floor((d + 3) / 7); if (cw !== w) { swk.push([w * 7 * 86400 - 3 * 86400, cum]); cw = w; } else swk[swk.length - 1][1] = cum; } stt = cum; }
  const s90 = days.map((d) => SD[d.d / 86400] || 0);
  const dpd = {};
  for (const r of RR) { const h = db.dh[r.n] || []; for (let i = 1; i < h.length; i++) if (h[i][0] - h[i - 1][0] === 86400) dpd[h[i][0]] = (dpd[h[i][0]] || 0) + h[i][1] - h[i - 1][1]; }
  const X = db.dc, td = Math.floor(now / 86400), gday = (d) => d === Math.floor(X.f / 86400) || X.gp.some(([a, b]) => a < (d + 1) * 86400 && (b || now) > d * 86400);
  const f0 = X.f ? Math.max(Math.floor(X.f / 86400), td - 59) : td;
  const dcd = []; for (let d = f0; d <= td; d++) dcd.push([d * 86400, X.d[d] || 0, (X.u[d] || []).length, gday(d) ? 1 : 0]);
  const chs = (n) => Object.entries(X.ch).map(([c, v]) => [c, Object.entries(v).reduce((a, [d, k]) => a + (+d > td - n ? k : 0), 0)]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]);
  const u7 = new Set(); for (let d = td - 6; d <= td; d++) for (const h of X.u[d] || []) u7.add(h);
  const full = dcd.slice(-8, -1).filter((x) => !x[3]);
  const dc = X.f ? { days: dcd, ch7: chs(7).slice(0, 12), ch30: chs(30).length, h: X.h, m7: dcd.slice(-7).reduce((a, x) => a + x[1], 0), u7: u7.size, a7: full.length ? Math.round(full.reduce((a, x) => a + x[2], 0) / full.length) : null, f: X.f, on: X.on, gp: X.gp.filter((g) => !g[1] || g[1] > now - 60 * 86400) } : null;
  const nw7 = [...ppl.values()].filter((p) => now - p.f < 7 * 86400).length, c7t = [...ppl.values()].reduce((a, p) => a + p.c7, 0);
  all.sort((a, b) => b[0] - a[0]);
  const dd = (n, d) => { const h = db.dh[n] || [], c = h[h.length - 1]; if (!c) return null; const b = [...h].reverse().find((x) => x[0] <= c[0] - d * 86400); return b ? c[1] - b[1] : null; };
  const dla = RR.map((r) => r.n).filter((n) => db.dl[n] && db.dl[n].t).map((n) => { const o = db.dl[n], rl = o.rl.filter((x) => !x[3]).sort((a, b) => b[1] - a[1]); return { n, w: ow(n), x: rc.has(n) ? 1 : 0, t: o.t, p: o.p, a: o.a, f: o.f, br: o.br || null, d1: dd(n, 1), d7: dd(n, 7), rl: rl.slice(0, 12), nr: o.rl.length }; });
  const n30 = [...ppl.values()].filter((p) => now - p.f < 30 * 86400).length;
  const s0 = {
    at: Math.round(now), sync: !RR.length ? 1 : RR.filter((r) => !db.a[r.n] || !db.a[r.n].cur || !db.ca[r.n] || !db.ca[r.n].cur).length, err,
    k: { c: ppl.size, m: tm, o: op, cm: tc, m1, m7, t: med(t30), n30, pr: all.length && rp.reduce((s, r) => s + r.o, 0), n7: nw7, c7: c7t, fr: med(frt), st: RR.reduce((a, r) => a + (r.s || 0), 0), fk: RR.reduce((a, r) => a + (r.f || 0), 0), s7: s90.slice(-7).reduce((a, b) => a + b, 0), rv: [...rvp.values()].reduce((a, v) => a + v[0], 0), rv7: [...rvp.values()].reduce((a, v) => a + v[2], 0) },
    is: { o: iop, o30: i30, x30, np30, b: ib, f: ifr, q: iq, t: it2, fr: med(ifs), sy: RR.filter((r) => !db.ia[r.n] || !db.ia[r.n].cur).length },
    st: { wk: swk, d: s90, t: stt, sy: RR.filter((r) => !db.st[r.n] || !db.st[r.n].top).length },
    dd: Object.entries(dpd).map(([d, v]) => [+d, v]).sort((a, b) => a[0] - b[0]).slice(-120),
    rvl: rvl.slice(0, 50), dc,
    rs: rp.map((r) => ({ n: r.n, m: r.m, o: r.o, op: r.op, c: r.c.size, t: med(r.t), cm: r.cm, b: r.b, q: (db.q || {})[r.n] || null, s: (RR.find((x) => x.n === r.n) || {}).s || 0, f: (RR.find((x) => x.n === r.n) || {}).f || 0, w: ow(r.n), x: rc.has(r.n) ? 1 : 0, ci: db.ci[r.n] ? { n: db.ci[r.n].n, ok: db.ci[r.n].ok, med: db.ci[r.n].med, last: db.ci[r.n].last } : null, is: irs[r.n] || null, fr: med(rvr[r.n] || []), dl: db.dl[r.n] ? db.dl[r.n].t : 0 })),
    v: ver, pre, days: days.map((d) => [d.d, d.o, d.x, d.m, d.a.size, d.n, d.c, d.r]), weeks, heat, hist, lead, team, recent: all.slice(0, 40), dl: dla,
  };
  const idx = new Map();
  for (const rn of rs) for (const [nr, v] of Object.entries(db.p[rn] || {})) {
    if (bot(v[0])) continue;
    const k = v[0].toLowerCase();
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k).push([rn, +nr, v[1], v[2], v[3], v[4]]);
  }
  return { S: s0, Sz: zlib.gzipSync(JSON.stringify(s0)), U: idx, C: CX, UA: ua, RV: rvp };
}
function build() {
  ver++;
  const a = bd('a');
  ({ S, Sz, U, C, UA, RV } = a);
  SV = { a: Sz, s: bd('s').Sz, t: bd('t').Sz };
}

function vel(rn, tag, pub) {
  const h = (db.rh[rn] || {})[sk0(tag)];
  if (!h || !h.length) return [null, null];
  const at = (t) => { if (h[h.length - 1][0] < t) return null; let i = h.findIndex((x) => x[0] >= t); if (i <= 0) return i === 0 && h[0][0] - pub < 3 * 3600 ? h[0][1] : null; const [a, b] = [h[i - 1], h[i]]; return Math.round(a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0])); };
  return [at(pub + 86400), at(pub + 7 * 86400)];
}
function rels() {
  const out = [];
  for (const r of db.r) for (const x of (db.dl[r.n] || {}).rl || []) out.push([r.n, ...x, ...vel(r.n, x[0], x[1])]);
  return out.sort((a, b) => b[2] - a[2]);
}
function appd(n) {
  const r = db.r.find((x) => x.n.toLowerCase() === n.toLowerCase());
  if (!r || !S) return null;
  n = r.n;
  const now = Date.now() / 1000, ND = 90, d0 = Math.floor(now / 86400) - ND + 1;
  const days = Array.from({ length: ND }, (_, i) => [(d0 + i) * 86400, 0, 0, 0, 0]);
  const pp = {}, P = (l) => (pp[l] ||= [l, db.u[l] || 0, 0, 0, 0, 0]);
  for (const [l, t] of Object.values(db.c[n] || {})) { if (bot(l)) continue; P(l)[3]++; const i = Math.floor(t / 86400) - d0; if (i >= 0 && i < ND) days[i][3]++; }
  const rec = [];
  for (const [nr, [l, c, m, x, ti]] of Object.entries(db.p[n] || {})) {
    if (bot(l)) continue;
    const i = Math.floor(c / 86400) - d0; if (i >= 0 && i < ND) days[i][1]++;
    if (m) { P(l)[2]++; const j = Math.floor(m / 86400) - d0; if (j >= 0 && j < ND) days[j][2]++; rec.push([m, n, +nr, ti, l]); }
  }
  for (const v of Object.values(db.rv[n] || {})) for (const [l] of v) if (!bot(l)) P(l)[4]++;
  for (const [a] of Object.values(db.is[n] || {})) if (!bot(a)) P(a)[5]++;
  const st = db.st[n] && db.st[n].top ? db.st[n].d : null;
  let cum = 0; const swk = [];
  if (st) for (const d of Object.keys(st).map(Number).sort((a, b) => a - b)) { cum += st[d]; const w = Math.floor((d + 3) / 7) * 7 * 86400 - 3 * 86400; if (swk.length && swk[swk.length - 1][0] === w) swk[swk.length - 1][1] = cum; else swk.push([w, cum]); }
  for (const d of days) d[4] = st ? st[d[0] / 86400] || 0 : 0;
  const ci = db.ci[n] || null, dl = db.dl[n] || null, h = db.dh[n] || [];
  return {
    n, w: r.o || O, d: r.d, s: r.s, f: r.f, x: r.c ? 1 : 0, row: S.rs.find((x) => x.n === n) || null, days, st: !!st, swk,
    ppl: Object.values(pp).sort((a, b) => b[3] + b[2] * 3 - a[3] - a[2] * 3).slice(0, 40),
    rec: rec.sort((a, b) => b[0] - a[0]).slice(0, 20),
    rl: dl ? dl.rl.map((x) => [...x, ...vel(n, x[0], x[1])]).sort((a, b) => b[1] - a[1]) : [],
    dl: dl ? { t: dl.t, p: dl.p, a: dl.a, f: dl.f, br: dl.br || null } : null, dd: h.slice(1).map((x, i) => [x[0], x[1] - h[i][1]]),
    ci: ci ? { ...ci, wf: Object.entries(ci.wf).sort((a, b) => b[1][0] + b[1][1] - a[1][0] - a[1][1]) } : null,
  };
}
function week() {
  const now = Date.now() / 1000, w0 = now - 7 * 86400;
  const nw = S.lead.filter((x) => x[9] >= w0).map((x) => { const f = (U.get(x[0].toLowerCase()) || []).filter((p) => p[2] >= w0).sort((a, b) => a[2] - b[2])[0]; return [x[0], x[1], x[2], x[12], f ? [f[0], f[1], f[5]] : null]; }).sort((a, b) => b[2] - a[2] || b[3] - a[3]);
    const pr = {}, iw = [0, 0];
  for (const r of db.r) {
    for (const v of Object.values(db.p[r.n] || {})) if (v[2] >= w0 && !bot(v[0])) pr[r.n] = (pr[r.n] || 0) + 1;
    for (const v of Object.values(db.is[r.n] || {})) { if (v[1] >= w0) iw[0]++; if (v[2] >= w0) iw[1]++; }
  }
  const all = [];
  for (const r of db.r) for (const [nr, v] of Object.entries(db.p[r.n] || {})) if (v[2] >= w0 && !bot(v[0])) all.push([v[2], r.n, +nr, v[4], v[0]]);
  all.sort((a, b) => b[0] - a[0]);
  return {
    f: w0, t: now, nw, top: S.lead.filter((x) => x[5]).sort((a, b) => b[5] - a[5]).slice(0, 10).map((x) => [x[0], x[1], x[5], x[18]]),
    cm: S.lead.filter((x) => x[18]).sort((a, b) => b[18] - a[18]).slice(0, 10).map((x) => [x[0], x[1], x[18]]),
    rv: S.rvl.filter((x) => x[4]).sort((a, b) => b[4] - a[4]).slice(0, 10).map((x) => [x[0], x[1], x[4]]),
    apps: Object.entries(pr).sort((a, b) => b[1] - a[1]), rl: rels().filter((x) => x[2] >= w0), is: iw, k: S.k, dd: S.dd.filter((x) => x[0] >= w0 - 86400), mg: all.length, recent: all.slice(0, 30),
  };
}

async function tick() {
  try {
    if (!db.r.length || Date.now() - rt > H) await repos();
    await sync();
    await csync();
    if (Date.now() - dt0 > H) await dl().catch((e) => console.error('[dl]', e.message));
    if (Date.now() - ct > H) await ci().catch((e) => console.error('[ci]', e.message));
    await isync().catch((e) => console.error('[issues]', e.message));
    await ssync().catch((e) => console.error('[stars]', e.message));
    if (Date.now() - qt > H) await sq().catch((e) => console.error('[sonar]', e.message));
    err = null; ef = 0;
  } catch (e) { if (++ef > 1) err = e.message; console.error('[sync]', e.message); }
  build();
  const td = Math.floor(Date.now() / DY) * 86400;
  if (S && (!db.ks.length || db.ks[db.ks.length - 1][0] !== td)) { db.ks.push([td, S.k.c, S.k.m, S.k.cm, S.dl.reduce((a, x) => a + x.t, 0), S.k.st, S.is.o, S.k.fk]); dirty = 1; }
  if (dirty) { wj('db.json', db); dirty = 0; }
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

const GQO = `query($q:String!){o:search(query:$q,type:ISSUE,first:20){issueCount nodes{...on PullRequest{number title url isDraft createdAt updatedAt mergeable reviewDecision repository{name}
  comments(last:1){totalCount nodes{author{login} createdAt}}
  reviews(last:1){nodes{state author{login} submittedAt}}
  commits(last:1){nodes{commit{committedDate statusCheckRollup{state}}}}}}}}`;
const GQR = `query($q:String!){r:search(query:$q,type:ISSUE,first:10){issueCount nodes{...on PullRequest{number title url createdAt repository{name} author{login}}}}}`;
const GQI = `query($q:String!){i:search(query:$q,type:ISSUE,first:10){issueCount nodes{...on Issue{number title url createdAt repository{name} comments{totalCount}}}}}`;

const sco = () => [`org:${O}`, ...db.r.filter((r) => r.c).map((r) => `repo:${r.o}/${r.n}`)].join(' ');
async function me(u) {
  const h = { ...hd, Authorization: 'Bearer ' + u.t, 'Content-Type': 'application/json' };
  const g = async (query, q) => {
    const r = await fetch('https://api.github.com/graphql', { method: 'POST', headers: h, signal: AbortSignal.timeout(25000), body: JSON.stringify({ query, variables: { q } }) });
    if (r.status === 401) return null;
    const j = await r.json();
    if (!j.data) throw new Error('graphql');
    return j.data;
  };
  const x = await Promise.all([g(GQO, `author:${u.l} ${sco()} is:pr is:open sort:updated-desc`), g(GQR, `review-requested:${u.l} ${sco()} is:pr is:open sort:updated-desc`), g(GQI, `author:${u.l} ${sco()} is:issue is:open sort:updated-desc`)]);
  if (x.some((v) => !v)) return null;
  const d = Object.assign({}, ...x);
  return {
    on: d.o.issueCount, rn: d.r.issueCount, inn: d.i.issueCount,
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

const xe = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const AN = (n) => ({ 'craft-launcher': 'Launcher', cadcraft: 'CADCraft', pdfcraft: 'PdfCraft', anicraft: 'AniCraft', texturecraft: 'TextureCraft', 'craft-anything': 'Craft Anything' }[n.toLowerCase()] || n.replace(/^(\w)(\w*?)craft/i, (_, a, b) => a.toUpperCase() + b + 'Craft'));
const nfm = new Intl.NumberFormat('en-US');
function feedx(s) {
  const it = [
    ...S.recent.map(([m, rn, nr, ti, l]) => ({ t: m, ti: `${AN(rn)}: ${ti}`, u: `https://github.com/${ow(rn)}/${rn}/pull/${nr}`, d: `Merged pull request #${nr} by ${l}`, g: `pr-${rn}-${nr}` })),
    ...rels().slice(0, 30).map(([rn, tag, t, n]) => ({ t, ti: `${AN(rn)} ${tag} released`, u: `https://github.com/${ow(rn)}/${rn}/releases/tag/${encodeURIComponent(tag)}`, d: `${AN(rn)} ${tag}, ${nfm.format(n)} downloads so far`, g: `rel-${rn}-${tag}` })),
  ].sort((a, b) => b.t - a.t).slice(0, 60);
  const x = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>ArtCraft Contributors</title><link>${B}/</link><description>Merged pull requests and releases across the Craft App Bundle.</description>${it.map((i) => `<item><title>${xe(i.ti)}</title><link>${xe(i.u)}</link><guid isPermaLink="false">${xe(i.g)}</guid><pubDate>${new Date(i.t * 1000).toUTCString()}</pubDate><description>${xe(i.d)}</description></item>`).join('')}</channel></rss>`;
  s.writeHead(200, { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'max-age=300' });
  s.end(x);
}
const tw = (t) => Math.round([...t].reduce((a, c) => a + (/[il.,:'|!]/.test(c) ? 3.2 : /[mwMW]/.test(c) ? 9.5 : /[A-Z0-9#]/.test(c) ? 7.2 : 6.1), 0)) + 10;
const CL = { photocraft: '#2f7bf5', vectorcraft: '#e8573f', filmcraft: '#8b5cf6', lightcraft: '#f2a516', pdfcraft: '#12a58a', effectcraft: '#e0368f', designcraft: '#7bb51c', figcraft: '#02da96', wordcraft: '#3f5fe0', soundcraft: '#1fa5c9', deckcraft: '#f07a1e', cadcraft: '#3ea6e8', gridcraft: '#1f9d55', solidcraft: '#46a1fb', artcraft: '#4e7bfb', anicraft: '#c25bd6' };
const BS = { dark: ['#101014', '#2d81ff', '#fff', '#fff'], light: ['#e9e8e4', '#101014', '#101014', '#fff'], blue: ['#1659c4', '#2d81ff', '#fff', '#fff'], mono: ['#101014', '#3a3a40', '#fff', '#fff'] };
const kfm = (v) => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e4 ? Math.round(v / 1e3) + 'k' : nfm.format(v);
function ustrk(l) {
  const ua = UA.get(l.toLowerCase()) || {}, ds = Object.keys(ua).map(Number).filter((d) => ua[d].some((v) => v)).sort((a, b) => a - b);
  let lg = 0, run = 0, pv = null;
  for (const d of ds) { run = pv !== null && d === pv + 1 ? run + 1 : 1; lg = Math.max(lg, run); pv = d; }
  return { cu: pv !== null && pv >= Math.floor(Date.now() / DY) - 1 ? run : 0, lg };
}
function svgo(s, x) { s.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=1800' }); s.end(x); }
function badge(s, p, q) {
  const st = BS[q.get('s')] || BS.dark, mt = q.get('m') || '';
  const c = /^\/badge\/card\/([^/]+?)\.svg$/.exec(p);
  if (c && S) return card(s, decodeURIComponent(c[1]), st);
  let m = /^\/badge\/(u|app)\/([^/]+?)\.svg$/.exec(p), L = 'ArtCraft', V = null;
  if (m && S && m[1] === 'u') {
    const l = decodeURIComponent(m[2]).toLowerCase(), i = S.lead.findIndex((r) => r[0].toLowerCase() === l);
    if (i >= 0) { const r = S.lead[i], k = ustrk(l);
      V = { merged: `${nfm.format(r[2])} merged PRs`, commits: `${nfm.format(r[12])} commits`, reviews: `${nfm.format(r[20] || 0)} reviews`, apps: `${r[7]} Craft apps`, streak: `${k.cu}-day streak`, rank: `rank #${i + 1} of ${nfm.format(S.lead.length)}` }[mt] || `#${i + 1} · ${nfm.format(r[2])} merged`; }
  }
  if (m && S && m[1] === 'app') {
    const n = decodeURIComponent(m[2]).toLowerCase(), r = S.rs.find((x) => x.n.toLowerCase() === n);
    if (r) { L = AN(r.n);
      V = { stars: `${kfm(r.s)} stars`, contributors: `${nfm.format(r.c)} contributors`, merged: `${kfm(r.m)} merged PRs`, commits: `${kfm(r.cm)} commits`, ci: r.ci && r.ci.n ? `CI ${Math.round(r.ci.ok / r.ci.n * 100)}%` : null }[mt] || (r.dl ? `${kfm(r.dl)} downloads` : null); }
  }
  if (!V) return no(s);
  const a = tw(L), b = tw(V);
  svgo(s, `<svg xmlns="http://www.w3.org/2000/svg" width="${a + b}" height="20" role="img" aria-label="${xe(L)}: ${xe(V)}"><title>${xe(L)}: ${xe(V)}</title><rect width="${a}" height="20" fill="${st[0]}"/><rect x="${a}" width="${b}" height="20" fill="${st[1]}"/><g font-family="Verdana,DejaVu Sans,sans-serif" font-size="11"><text x="6" y="14" fill="${st[2]}">${xe(L)}</text><text x="${a + 6}" y="14" fill="${st[3]}">${xe(V)}</text></g></svg>`);
}
function card(s, l, st) {
  const i = S.lead.findIndex((r) => r[0].toLowerCase() === l.toLowerCase());
  if (i < 0) return no(s);
  const r = S.lead[i], k = ustrk(r[0]), cm = (C.get(r[0].toLowerCase()) || []).filter(([n]) => CL[n.toLowerCase()]).slice(0, 6), ct = cm.reduce((a, x) => a + x[1], 0) || 1;
  const lt = st === BS.light, bg = lt ? '#f2f1ee' : '#121316', fg = lt ? '#101014' : '#f2f1ee', mu = lt ? 'rgba(16,16,20,.6)' : 'rgba(242,241,238,.6)', ln = lt ? 'rgba(16,16,20,.16)' : 'rgba(242,241,238,.15)', ac = st === BS.mono ? fg : '#2d81ff';
  const S2 = [['Rank', `#${i + 1}`], ['Merged', nfm.format(r[2])], ['Commits', kfm(r[12])], ['Reviews', kfm(r[20] || 0)], ['Streak', `${k.cu}d`]];
  let x = 20, bars = '';
  for (const [n, v] of cm) { const w = 380 * v / ct; bars += `<rect x="${x}" y="112" width="${Math.max(1, w - 2)}" height="6" fill="${CL[n.toLowerCase()]}"><title>${xe(AN(n))}: ${v}</title></rect>`; x += w; }
  const sv = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140" viewBox="0 0 420 140" role="img" aria-label="${xe(r[0])} on ArtCraft"><title>${xe(r[0])}: rank ${i + 1}, ${r[2]} merged PRs</title>
<rect width="420" height="140" fill="${bg}"/><rect x=".5" y=".5" width="419" height="139" fill="none" stroke="${ln}"/>
<g font-family="Verdana,DejaVu Sans,sans-serif">
<text x="20" y="32" font-size="16" font-weight="bold" fill="${fg}">${xe(r[0])}</text>
<text x="400" y="32" font-size="10" fill="${mu}" text-anchor="end" letter-spacing="1">ARTCRAFT CONTRIBUTIONS</text>
${S2.map(([t, v], j) => `<text x="${20 + j * 78}" y="62" font-size="9" fill="${mu}" letter-spacing="1">${t.toUpperCase()}</text><text x="${20 + j * 78}" y="86" font-size="18" font-weight="bold" fill="${j ? fg : ac}">${xe(v)}</text>`).join('')}
${bars}<text x="20" y="133" font-size="9" fill="${mu}">${xe(cm.slice(0, 3).map(([n]) => AN(n)).join(', '))}${cm.length > 3 ? ' and more' : ''}</text>
</g></svg>`;
  svgo(s, sv);
}
const BV = (() => { try { return crypto.createHash('sha1').update(fs.readFileSync(path.join(W, 'app.js'))).update(fs.readFileSync(path.join(W, 'style.css'))).digest('hex').slice(0, 10); } catch { return '0'; } })();
let IX = null;
function ogh(p) {
  try { IX ||= fs.readFileSync(path.join(W, 'index.html'), 'utf8'); } catch { return null; }
  const [, k, a, b] = p.split('/').map((x) => decodeURIComponent(x || ''));
  let t = null, d = null, im = `${B}/icons/og.png`;
  if (k === 'u' && a && S) { const i = S.lead.findIndex((r) => r[0].toLowerCase() === a.toLowerCase()); if (i >= 0) { const r = S.lead[i]; t = `${r[0]} on ArtCraft Contributors`; d = `Rank ${i + 1} of ${nfm.format(S.lead.length)}. ${nfm.format(r[2])} merged PRs and ${nfm.format(r[12])} commits across ${r[7]} Craft apps.`; im = `https://avatars.githubusercontent.com/u/${r[1]}?s=400`; } }
  else if (k === 'app' && a && S) { const r = S.rs.find((x) => x.n.toLowerCase() === a.toLowerCase()); if (r) { t = `${AN(r.n)} contributions`; d = `${nfm.format(r.c)} contributors, ${nfm.format(r.m)} merged PRs, ${nfm.format(r.cm)} commits${r.dl ? `, ${nfm.format(r.dl)} downloads` : ''}.`; if (fs.existsSync(path.join(W, 'icons', r.n.toLowerCase() + '.png'))) im = `${B}/icons/${r.n.toLowerCase()}.png`; } }
  else if (k === 'vs' && a && b) { t = `${a} vs ${b}`; d = 'Side by side on ArtCraft Contributors.'; }
  else if (k === 'releases') { t = 'Craft App Bundle releases'; d = 'Every release across the Craft apps, with downloads.'; }
  else if (k === 'week') { t = 'This week in the Craft apps'; d = 'New contributors, top mergers, reviewers and releases of the last 7 days.'; }
  else if (k === 'people') { t = 'Craft App Bundle leaderboard'; d = 'Everyone who contributed to the Craft apps.'; }
  if (!t) return IX;
  const m = `<title>${xe(t)}</title><meta name="description" content="${xe(d)}"><meta property="og:title" content="${xe(t)}"><meta property="og:description" content="${xe(d)}"><meta property="og:image" content="${xe(im)}"><meta property="og:url" content="${xe(B + p)}"><meta property="og:site_name" content="ArtCraft Contributors"><meta name="twitter:card" content="summary">`;
  return IX.replace(/<meta (property="og:|name="twitter:)[^>]*>\n?/g, '').replace(/<title>[\s\S]*?<meta name="description"[^>]*>/, m);
}

const MT = { '.xml': 'application/xml', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };
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
      s.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Cache-Control': 'no-cache' });
      return s.end(SV[u.searchParams.get('f')] || Sz);
    }
    if (p === '/api/v') { s.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return s.end(`{"v":${ver},"b":"${BV}"}`); }
    if (p.startsWith('/api/u/')) {
      const l = decodeURIComponent(p.slice(7)).toLowerCase(), L = U.get(l) || [];
      const row = S ? S.lead.findIndex((r) => r[0].toLowerCase() === l) : -1;
      if (row < 0) return no(s);
      const rv = RV.get(S.lead[row][0]);
      return js(q, s, { row: S.lead[row], rank: row + 1, of: S.lead.length, prs: [...L].sort((a, b) => b[2] - a[2]), cm: C.get(l) || [], ua: UA.get(l) || {}, rva: rv ? Object.entries(rv[3]).sort((a, b) => b[1] - a[1]) : [] }, 'no-cache');
    }
    if (p.startsWith('/api/app/')) { const d = appd(decodeURIComponent(p.slice(9))); return d ? js(q, s, d, 'no-cache') : no(s); }
    if (p === '/api/releases') return S ? js(q, s, { rl: rels() }, 'no-cache') : no(s, 503, 'warming up');
    if (p === '/api/week') return S ? js(q, s, week(), 'no-cache') : no(s, 503, 'warming up');
    if (p === '/feed.xml') return S ? feedx(s) : no(s, 503, 'warming up');
    if (p.startsWith('/badge/')) return badge(s, p, u.searchParams);
    const og = /^\/(u|app|vs|releases|week|people)(\/|$)/.test(p) && ogh(p);
    if (og) { s.writeHead(200, { ...SH, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }); return s.end(og);
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
setInterval(live, 10e3);
setInterval(dpoll, 120e3);
setTimeout(dpoll, 5000);
run();
