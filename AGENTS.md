# AGENTS.md

This repository provides the `pmbok6` skill: project management based on the PMBOK® Guide 6th Edition.

## When to use this skill

Load `pmbok6/SKILL.md` when the user needs to:
- plan a project from scratch (charter, WBS, schedule, budget, risk register);
- evaluate performance (EVM: SPI, CPI, EAC, TCPI), critical path, PERT;
- handle change requests or scope creep;
- analyze risks (qualitative/quantitative, EMV, decision trees);
- choose a contract type (FFP, FPIF, CPFF, CPIF, T&M) and calculate incentives;
- audit a project against PMBOK or tailor processes for agile/hybrid;
- prepare for the PMP exam.

## Layout

- `pmbok6/SKILL.md`: orchestrator with routing table and core rules.
- `pmbok6/references/`: 25 reference files (workflows, ITTOs for 10 knowledge areas, formulas, worked examples, documents, tools, people skills, foundations, agile, tailoring, exam guide, glossary).
- `pmbok6/templates/`: 13 fillable document templates.
- `pmbok6/scripts/pmcalc.js`: zero-dependency Node.js calculator. Use it for every calculation.

## Contributing

- Content is in Russian; English terms go in parentheses on first use.
- Every process section in `itto-*.md` must keep the `**Входы:**`, `**Инструменты:**` and `**Выходы:**` markers (checked by CI).
- Reference other files with backticks, e.g. `formulas.md` or `templates/wbs.md`. CI checks that the targets exist.
- Run `npm test` before committing.
- Do not paste verbatim text from the PMBOK Guide. Write structured summaries in your own words.

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash                      # Hermes
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash -s -- --agent claude  # Claude Code
```
