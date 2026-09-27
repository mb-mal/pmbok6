#!/usr/bin/env node
// pmcalc — PMBOK 6 calculator for agents. Zero dependencies, Node.js >= 14.
// Usage: node pmcalc.js <command> [--key value ...] [--json]
// Run without arguments for help.

'use strict';

const HELP = `pmcalc — PMBOK 6 calculator

Commands:
  evm       --bac N --pv N --ev N --ac N [--eac N]
            EVM: SV, CV, SPI, CPI, EAC (3 formulas; --eac = bottom-up EAC), ETC, VAC, TCPI
  pert      --tasks "O,M,P;O,M,P;..."   (one or more activities on a path)
            Beta/triangular estimates, sigma, variance, path totals, ranges
  cpm       --tasks "A:3;B:2:A;C:4:A;D:1:B,C" | --file tasks.json
            Critical path (zero-based convention): ES, EF, LS, LF, TF, FF
            JSON file: [{"id":"A","d":3,"pred":[]}, ...]
  emv       --risks "P:I;P:I;..."   (I < 0 threat, I > 0 opportunity)
  channels  --n N [--add K]
  fpif      --target-cost N --target-fee N --ceiling N --buyer-share 0.7 --actual N
  cpif      --target-cost N --target-fee N --buyer-share 0.8 --actual N [--min-fee N --max-fee N]
  npv       --rate 0.1 --cashflows "-1000,300,400,500"   (t = 0,1,2,...)
  crash     --tasks "id:normalDur:crashDur:normalCost:crashCost;..."
            Crash cost per period, sorted cheapest first

Flags:  --json   machine-readable output
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) args[key] = true;
      else { args[key] = next; i++; }
    } else args._.push(a);
  }
  return args;
}

function num(args, key, required = true) {
  const v = args[key];
  if (v === undefined || v === true) {
    if (required) throw new Error(`missing --${key}`);
    return undefined;
  }
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`--${key} must be a number, got "${v}"`);
  return n;
}

const r = (x, d = 4) => (Number.isFinite(x) ? Math.round(x * 10 ** d) / 10 ** d : x);

function evm(args) {
  const bac = num(args, 'bac'), pv = num(args, 'pv'), ev = num(args, 'ev'), ac = num(args, 'ac');
  const cpi = ev / ac, spi = ev / pv;
  const eacTypical = bac / cpi;
  const eacAtypical = ac + (bac - ev);
  const eacCpiSpi = ac + (bac - ev) / (cpi * spi);
  const eacManual = num(args, 'eac', false);
  const out = {
    SV: ev - pv, CV: ev - ac, SPI: spi, CPI: cpi,
    percentComplete: ev / bac, percentSpent: ac / bac,
    EAC: { typical_BAC_div_CPI: eacTypical, atypical_AC_plus_BAC_minus_EV: eacAtypical, cpi_x_spi: eacCpiSpi },
    ETC: { typical: eacTypical - ac, atypical: bac - ev },
    VAC: { typical: bac - eacTypical, atypical: bac - eacAtypical },
    TCPI_BAC: (bac - ev) / (bac - ac),
    status: [
      spi < 1 ? 'behind schedule' : spi > 1 ? 'ahead of schedule' : 'on schedule',
      cpi < 1 ? 'over budget' : cpi > 1 ? 'under budget' : 'on budget',
    ],
  };
  if (eacManual !== undefined) {
    out.EAC.given = eacManual;
    out.TCPI_EAC = (bac - ev) / (eacManual - ac);
  }
  return out;
}

function parseTriples(s) {
  if (!s || s === true) throw new Error('missing --tasks');
  return String(s).split(';').filter(Boolean).map((t) => {
    const [o, m, p] = t.split(',').map(Number);
    if (![o, m, p].every(Number.isFinite)) throw new Error(`bad triple "${t}", expected O,M,P`);
    if (!(o <= m && m <= p)) throw new Error(`expected O <= M <= P in "${t}"`);
    return { o, m, p };
  });
}

function pert(args) {
  const tasks = parseTriples(args.tasks).map(({ o, m, p }) => {
    const sigma = (p - o) / 6;
    return { O: o, M: m, P: p, beta: (o + 4 * m + p) / 6, triangular: (o + m + p) / 3, sigma, variance: sigma ** 2 };
  });
  const mean = tasks.reduce((s, t) => s + t.beta, 0);
  const variance = tasks.reduce((s, t) => s + t.variance, 0);
  const sigma = Math.sqrt(variance);
  return {
    tasks,
    path: {
      expected: mean, variance, sigma,
      range_1sigma_68pct: [mean - sigma, mean + sigma],
      range_2sigma_95pct: [mean - 2 * sigma, mean + 2 * sigma],
      range_3sigma_99pct: [mean - 3 * sigma, mean + 3 * sigma],
    },
  };
}

function parseNetwork(args) {
  if (args.file) {
    const raw = JSON.parse(require('fs').readFileSync(args.file, 'utf8'));
    return raw.map((t) => ({ id: String(t.id), d: Number(t.d), pred: (t.pred || []).map(String) }));
  }
  if (!args.tasks || args.tasks === true) throw new Error('missing --tasks or --file');
  return String(args.tasks).split(';').filter(Boolean).map((t) => {
    const [id, d, pred] = t.split(':');
    return { id: id.trim(), d: Number(d), pred: pred ? pred.split(',').map((x) => x.trim()).filter(Boolean) : [] };
  });
}

function cpm(args) {
  const tasks = parseNetwork(args);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  for (const t of tasks) {
    if (!Number.isFinite(t.d) || t.d < 0) throw new Error(`bad duration for ${t.id}`);
    for (const p of t.pred) if (!byId.has(p)) throw new Error(`unknown predecessor ${p} of ${t.id}`);
  }
  // Topological order (Kahn); detects cycles.
  const indeg = new Map(tasks.map((t) => [t.id, t.pred.length]));
  const succ = new Map(tasks.map((t) => [t.id, []]));
  for (const t of tasks) for (const p of t.pred) succ.get(p).push(t.id);
  const queue = tasks.filter((t) => t.pred.length === 0).map((t) => t.id);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const s of succ.get(id)) {
      indeg.set(s, indeg.get(s) - 1);
      if (indeg.get(s) === 0) queue.push(s);
    }
  }
  if (order.length !== tasks.length) throw new Error('network has a cycle');

  const n = {};
  for (const id of order) {
    const t = byId.get(id);
    const es = t.pred.length ? Math.max(...t.pred.map((p) => n[p].EF)) : 0;
    n[id] = { d: t.d, ES: es, EF: es + t.d };
  }
  const finish = Math.max(...order.map((id) => n[id].EF));
  for (const id of [...order].reverse()) {
    const s = succ.get(id);
    const lf = s.length ? Math.min(...s.map((x) => n[x].LS)) : finish;
    n[id].LF = lf;
    n[id].LS = lf - n[id].d;
  }
  for (const id of order) {
    const s = succ.get(id);
    n[id].TF = n[id].LS - n[id].ES;
    n[id].FF = (s.length ? Math.min(...s.map((x) => n[x].ES)) : finish) - n[id].EF;
    n[id].critical = n[id].TF === 0;
  }
  // Enumerate all critical paths.
  const paths = [];
  const walk = (id, acc) => {
    const next = succ.get(id).filter((x) => n[x].critical && n[x].ES === n[id].EF);
    if (!next.length) { if (n[id].EF === finish) paths.push([...acc, id]); return; }
    for (const x of next) walk(x, [...acc, id]);
  };
  for (const id of order) if (n[id].critical && byId.get(id).pred.length === 0) walk(id, []);
  return { convention: 'zero-based (EF = ES + D)', duration: finish, criticalPaths: paths.map((p) => p.join('-')), activities: n };
}

function emv(args) {
  if (!args.risks || args.risks === true) throw new Error('missing --risks');
  const risks = String(args.risks).split(';').filter(Boolean).map((s, i) => {
    const [p, impact] = s.split(':').map(Number);
    if (!(p >= 0 && p <= 1) || !Number.isFinite(impact)) throw new Error(`bad risk "${s}", expected P:I with 0<=P<=1`);
    return { id: i + 1, P: p, I: impact, EMV: p * impact };
  });
  const total = risks.reduce((s, x) => s + x.EMV, 0);
  const threats = risks.filter((x) => x.EMV < 0).reduce((s, x) => s + x.EMV, 0);
  const opps = risks.filter((x) => x.EMV > 0).reduce((s, x) => s + x.EMV, 0);
  return { risks, totalEMV: total, threatsEMV: threats, opportunitiesEMV: opps, contingencyReserveHint: Math.max(0, -total) };
}

function channels(args) {
  const n = num(args, 'n');
  const add = num(args, 'add', false) || 0;
  const c = (k) => (k * (k - 1)) / 2;
  const out = { n, channels: c(n) };
  if (add) Object.assign(out, { newN: n + add, newChannels: c(n + add), increase: c(n + add) - c(n) });
  return out;
}

function fpif(args) {
  const tc = num(args, 'target-cost'), tf = num(args, 'target-fee'), ceiling = num(args, 'ceiling');
  const bs = num(args, 'buyer-share'), actual = num(args, 'actual');
  if (!(bs > 0 && bs < 1)) throw new Error('--buyer-share must be between 0 and 1');
  const ss = 1 - bs;
  const targetPrice = tc + tf;
  const fee = tf + (tc - actual) * ss;
  const uncapped = actual + fee;
  const price = Math.min(uncapped, ceiling);
  const pta = (ceiling - targetPrice) / bs + tc;
  return {
    targetPrice, sellerShare: ss, PTA: pta,
    feeBeforeCeiling: fee, priceBeforeCeiling: uncapped,
    finalPrice: price, sellerProfit: price - actual, ceilingApplied: uncapped > ceiling,
  };
}

function cpif(args) {
  const tc = num(args, 'target-cost'), tf = num(args, 'target-fee');
  const bs = num(args, 'buyer-share'), actual = num(args, 'actual');
  const minFee = num(args, 'min-fee', false), maxFee = num(args, 'max-fee', false);
  let fee = tf + (tc - actual) * (1 - bs);
  if (minFee !== undefined) fee = Math.max(fee, minFee);
  if (maxFee !== undefined) fee = Math.min(fee, maxFee);
  return { sellerShare: 1 - bs, fee, totalPrice: actual + fee };
}

function npv(args) {
  const rate = num(args, 'rate');
  if (!args.cashflows || args.cashflows === true) throw new Error('missing --cashflows');
  const cf = String(args.cashflows).split(',').map(Number);
  if (!cf.every(Number.isFinite)) throw new Error('bad --cashflows');
  const f = (rt) => cf.reduce((s, c, t) => s + c / (1 + rt) ** t, 0);
  // IRR by bisection on [-0.99, 10].
  let irr = null, lo = -0.99, hi = 10;
  if (f(lo) * f(hi) < 0) {
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
    }
    irr = (lo + hi) / 2;
  }
  let cum = 0, payback = null;
  for (let t = 0; t < cf.length; t++) {
    const prev = cum;
    cum += cf[t];
    if (payback === null && t > 0 && prev < 0 && cum >= 0) payback = t - 1 + -prev / cf[t];
  }
  return { NPV: f(rate), IRR: irr, paybackPeriods: payback, presentValues: cf.map((c, t) => c / (1 + rate) ** t) };
}

function crash(args) {
  if (!args.tasks || args.tasks === true) throw new Error('missing --tasks');
  const rows = String(args.tasks).split(';').filter(Boolean).map((s) => {
    const [id, nd, cd, nc, cc] = s.split(':');
    const [ndN, cdN, ncN, ccN] = [nd, cd, nc, cc].map(Number);
    if (![ndN, cdN, ncN, ccN].every(Number.isFinite) || cdN > ndN) throw new Error(`bad crash row "${s}"`);
    const periods = ndN - cdN;
    return { id, maxReduction: periods, costPerPeriod: periods ? (ccN - ncN) / periods : null, extraCost: ccN - ncN };
  });
  return { note: 'crash only critical-path activities; recheck the critical path after each step', rows: rows.sort((a, b) => (a.costPerPeriod ?? Infinity) - (b.costPerPeriod ?? Infinity)) };
}

const COMMANDS = { evm, pert, cpm, emv, channels, fpif, cpif, npv, crash };

function roundDeep(x) {
  if (typeof x === 'number') return r(x);
  if (Array.isArray(x)) return x.map(roundDeep);
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, roundDeep(v)]));
  return x;
}

function printHuman(x, indent = '') {
  for (const [k, v] of Object.entries(x)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      console.log(`${indent}${k}:`);
      printHuman(v, indent + '  ');
    } else if (Array.isArray(v) && v.some((e) => e && typeof e === 'object')) {
      console.log(`${indent}${k}:`);
      v.forEach((e) => console.log(`${indent}  - ${JSON.stringify(e)}`));
    } else {
      console.log(`${indent}${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  if (!cmd || args.help || !COMMANDS[cmd]) {
    process.stdout.write(HELP);
    process.exit(cmd && !COMMANDS[cmd] ? 1 : 0);
  }
  try {
    const out = roundDeep(COMMANDS[cmd](args));
    if (args.json) console.log(JSON.stringify(out, null, 2));
    else printHuman(out);
  } catch (e) {
    console.error(`error: ${e.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = COMMANDS;
