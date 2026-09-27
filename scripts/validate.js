#!/usr/bin/env node
// Structural checks for the pmbok6 skill. Zero dependencies.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL = path.join(ROOT, 'pmbok6');
const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

// 1. Frontmatter
const skillMd = fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8');
const fm = skillMd.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) fail('SKILL.md: missing YAML frontmatter');
else {
  const name = fm[1].match(/^name:\s*(.+)$/m);
  const desc = fm[1].match(/^description:\s*"?(.+?)"?$/m);
  if (!name || name[1].trim() !== 'pmbok6') fail('SKILL.md: name must be "pmbok6"');
  if (!desc) fail('SKILL.md: missing description');
  else if (desc[1].length > 1024) fail(`SKILL.md: description is ${desc[1].length} chars (max 1024)`);
}

// 2. Referenced files exist
const mdFiles = walk(SKILL).filter((f) => f.endsWith('.md'));
const refRe = /`((?:references|templates|scripts)\/[\w.-]+|[\w-]+\.(?:md|js))`/g;
for (const file of mdFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(refRe)) {
    const ref = m[1];
    const candidates = ref.includes('/')
      ? [path.join(SKILL, ref)]
      : [path.join(SKILL, 'references', ref), path.join(SKILL, 'templates', ref), path.join(SKILL, ref), path.join(SKILL, 'scripts', ref)];
    if (!candidates.some((c) => fs.existsSync(c))) fail(`${path.relative(ROOT, file)}: broken reference \`${ref}\``);
  }
}

// 3. Process map: 49 unique processes
const pm = fs.readFileSync(path.join(SKILL, 'references/process-map.md'), 'utf8');
const pmIds = [...pm.matchAll(/^\| (\d{1,2}\.\d) \|/gm)].map((m) => m[1]);
if (pmIds.length !== 49) fail(`process-map.md: expected 49 process rows, found ${pmIds.length}`);
if (new Set(pmIds).size !== pmIds.length) fail('process-map.md: duplicate process ids');

// 4. ITTO files: 49 processes, each with inputs/tools/outputs
const expected = { integration: 7, scope: 6, schedule: 6, cost: 4, quality: 3, resources: 6, communications: 3, risk: 7, procurement: 3, stakeholders: 4 };
let total = 0;
for (const [area, count] of Object.entries(expected)) {
  const file = path.join(SKILL, `references/itto-${area}.md`);
  if (!fs.existsSync(file)) { fail(`missing itto-${area}.md`); continue; }
  const sections = fs.readFileSync(file, 'utf8').split(/^## (?=\d{1,2}\.\d )/m).slice(1);
  if (sections.length !== count) fail(`itto-${area}.md: expected ${count} processes, found ${sections.length}`);
  for (const s of sections) {
    const id = s.split(' ')[0];
    if (!pmIds.includes(id)) fail(`itto-${area}.md: process ${id} not in process-map.md`);
    for (const key of ['**Входы:**', '**Инструменты:**', '**Выходы:**']) {
      if (!s.includes(key)) fail(`itto-${area}.md ${id}: missing ${key}`);
    }
  }
  total += sections.length;
}
if (total !== 49) fail(`ITTO files: expected 49 processes in total, found ${total}`);

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  console.error(`\n${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ pmbok6 skill is valid (${mdFiles.length} markdown files, 49 processes)`);
