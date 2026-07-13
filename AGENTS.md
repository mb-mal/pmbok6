# AGENTS.md

This repository provides the `pmbok6` skill — a complete Project Management methodology based on PMBOK® Guide 6th Edition.

## When to use this skill

Load this skill when:
- Planning a project from scratch (charter, WBS, schedule, budget)
- Evaluating project performance (EVM: SPI, CPI, EAC)
- Analyzing risks (qualitative/quantitative, EMV, Monte Carlo)
- Choosing contract types (FF, FPIF, CPFF, T&M)
- Preparing for PMP certification
- Auditing an existing project against PMBOK standards
- Adapting processes for Agile/hybrid environments

## Structure

The skill is organized as 22 markdown files:
- `SKILL.md` — orchestrator with navigation
- `references/` — 17 reference files (process map, formulas, ITTOs, contracts, agile, tailoring)
- `templates/` — 4 fillable templates (charter, WBS, risk register, stakeholder register)

## Installation

Run the installer:
```bash
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash
```

Or clone manually:
```bash
git clone https://github.com/mb-mal/pmbok6.git /tmp/pmbok6
cp -r /tmp/pmbok6/pmbok6 ~/.hermes/skills/project-management/
```
