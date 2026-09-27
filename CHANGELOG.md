# Changelog

## 2.0.0 — 2026-09-27

### Added
- `scripts/pmcalc.js`: zero-dependency calculator (EVM, PERT, CPM with total/free float, EMV, FPIF/PTA, CPIF, communication channels, NPV/IRR/payback, crashing) with unit tests.
- References: `workflows.md` (8 agent playbooks), `worked-examples.md`, `project-documents.md`, `tools-techniques.md`, `people-skills.md`, `foundations.md`, `exam-guide.md`, `glossary.md`.
- Templates: project management plan, change request and change log, issue log, status report, RACI, communications plan, requirements traceability matrix, lessons learned, closure report.
- CI: structural validation (49 processes, ITTO markers, cross-file references, frontmatter), calculator tests, installer smoke test, shellcheck.
- Installer options `--agent hermes|claude|codex`, `--target`, `--source`, `--ref`.
- Trademark disclaimer.

### Changed
- All `itto-*.md` rewritten with full PMBOK 6 inputs, tools and outputs (specific plan components and documents), a one-line purpose, and pitfalls for each process.
- `SKILL.md` rewritten as a compact router: bilingual description, routing table, core rules, calculator usage.
- `process-map.md`: main outputs per process and a "which process when" table.
- `formulas.md`: ETC variants, free float, both CPM conventions, path sigma, crashing, agile metrics, NPV/IRR/BCR, FPIF ceiling.
- `agile-environments.md`, `changes-v5-v6.md` (now Russian and complete), `contracts.md`, `tailoring.md` expanded.
- Templates for the charter, WBS and risk register reworked.

### Fixed
- Risk responses now include **Escalate** and the opportunity strategies (exploit, share, enhance).
- The risk register example values now match the probability-impact scale; matrix colours are consistent with the legend.
- `FF` renamed to `FFP` (Firm Fixed Price).
- The FPIF profit formula now caps the price at the ceiling price.
- Removed activities from the WBS template (the WBS stops at work packages).
- Identify Risks: removed Delphi (not in the PMBOK 6 ITTO); root cause analysis moved under data analysis.
- "Alphabetical list" in the process map was actually sorted by number; renamed.
- Garbled trigger `agile项目管理` removed.
- The installer no longer hides clone errors, cleans up on failure, and replaces the old install atomically.
- README no longer references a non-existent plugin marketplace entry.

## 1.0.0

- Initial release: 22 markdown files (SKILL.md, 17 references, 4 templates).
