'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const calc = require('../pmbok6/scripts/pmcalc.js');

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !== ${b}`);

test('evm', () => {
  const r = calc.evm({ bac: '100000', pv: '50000', ev: '40000', ac: '45000' });
  assert.equal(r.SV, -10000);
  assert.equal(r.CV, -5000);
  close(r.SPI, 0.8);
  close(r.EAC.typical_BAC_div_CPI, 112500);
  close(r.EAC.atypical_AC_plus_BAC_minus_EV, 105000);
  close(r.EAC.cpi_x_spi, 129375);
  close(r.TCPI_BAC, 60000 / 55000);
});

test('pert sums variances, not sigmas', () => {
  const r = calc.pert({ tasks: '4,6,14;2,3,4' });
  close(r.path.expected, 10);
  close(r.path.sigma, Math.sqrt(25 / 9 + 1 / 9));
});

test('cpm finds critical path and floats', () => {
  const r = calc.cpm({ tasks: 'A:3;B:2:A;C:4:A;D:5:B;E:2:C;F:3:D,E' });
  assert.equal(r.duration, 13);
  assert.deepEqual(r.criticalPaths, ['A-B-D-F']);
  assert.equal(r.activities.C.TF, 1);
  assert.equal(r.activities.C.FF, 0);
  assert.equal(r.activities.E.FF, 1);
});

test('cpm reports parallel critical paths', () => {
  const r = calc.cpm({ tasks: 'A:2;B:3:A;C:3:A;D:1:B,C' });
  assert.deepEqual(r.criticalPaths.sort(), ['A-B-D', 'A-C-D']);
});

test('cpm rejects cycles and unknown predecessors', () => {
  assert.throws(() => calc.cpm({ tasks: 'A:1:B;B:1:A' }), /cycle/);
  assert.throws(() => calc.cpm({ tasks: 'A:1:Z' }), /unknown predecessor/);
});

test('emv', () => {
  const r = calc.emv({ risks: '0.3:-20000;0.1:-50000;0.2:10000' });
  close(r.totalEMV, -9000);
  close(r.contingencyReserveHint, 9000);
});

test('fpif applies ceiling and computes PTA', () => {
  const base = { 'target-cost': '100000', 'target-fee': '10000', ceiling: '120000', 'buyer-share': '0.7' };
  const r = calc.fpif({ ...base, actual: '110000' });
  close(r.PTA, 10000 / 0.7 + 100000);
  close(r.finalPrice, 117000);
  const over = calc.fpif({ ...base, actual: '130000' });
  assert.equal(over.ceilingApplied, true);
  close(over.finalPrice, 120000);
  close(over.sellerProfit, -10000);
});

test('cpif with fee limits', () => {
  close(calc.cpif({ 'target-cost': '100000', 'target-fee': '15000', 'buyer-share': '0.7', actual: '90000' }).fee, 18000);
  close(calc.cpif({ 'target-cost': '100000', 'target-fee': '15000', 'buyer-share': '0.7', actual: '50000', 'max-fee': '20000' }).fee, 20000);
});

test('channels', () => {
  const r = calc.channels({ n: '10', add: '3' });
  assert.equal(r.channels, 45);
  assert.equal(r.increase, 33);
});

test('npv, irr, payback', () => {
  const r = calc.npv({ rate: '0.1', cashflows: '-1000,300,400,500' });
  close(r.NPV, -21.0368, 1e-3);
  close(r.IRR, 0.0890, 1e-3);
  close(r.paybackPeriods, 2.6);
});

test('crash sorts by cost per period', () => {
  const r = calc.crash({ tasks: 'A:5:3:1000:1600;B:4:3:800:1000' });
  assert.deepEqual(r.rows.map((x) => x.id), ['B', 'A']);
});

test('missing arguments throw', () => {
  assert.throws(() => calc.evm({ bac: '1' }), /missing --pv/);
});
