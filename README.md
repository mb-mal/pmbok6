# PMBOK 6 — навык управления проектами для AI-агентов

[![validate](https://github.com/mb-mal/pmbok6/actions/workflows/validate.yml/badge.svg)](https://github.com/mb-mal/pmbok6/actions/workflows/validate.yml)

Навык (skill) для AI-агентов по **PMBOK® Guide 6th Edition**. С ним агент планирует проекты, считает EVM, PERT и критический путь, ведёт риски, выбирает контракты, проводит аудит проекта и готовит к PMP. Контент на русском, описание навыка двуязычное.

*English summary below.*

## Что внутри

- **49 процессов с полными ITTO**: конкретные компоненты плана и документы, а также ловушки по каждому процессу.
- **8 рабочих сценариев** для агента: запуск проекта, статус по EVM, запрос на изменение, риск-сессия, аудит, выбор контракта, закрытие, подготовка к PMP.
- **Калькулятор `pmcalc.js`** (Node.js, без зависимостей). Считает EVM, PERT, CPM с резервами, EMV, FPIF/PTA, CPIF, каналы коммуникаций, NPV/IRR и сжатие расписания.
- **10 разобранных примеров**, проверенных калькулятором.
- **13 шаблонов**: устав, план УП, ИСР, реестр рисков, реестр стейкхолдеров, запрос на изменение, журнал проблем, статус-отчёт, RACI, план коммуникаций, RTM, уроки, итоговый отчёт.
- **Справочники**: где создаётся каждый из 33 документов, каталог инструментов, работа с людьми (конфликты, мотивация, власть, Такман), основы (оргструктуры, PMO, роль РП), agile и гибридные подходы, адаптация, глоссарий RU↔EN, изменения по сравнению с 5-м изданием.

## Установка

```bash
# Hermes Agent (по умолчанию)
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash

# Claude Code (~/.claude/skills/pmbok6)
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash -s -- --agent claude

# Codex CLI (~/.codex/skills/pmbok6)
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash -s -- --agent codex

# Произвольная папка
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash -s -- --target ./my-skills
```

Вручную: скопируйте папку `pmbok6/` в каталог skills вашего агента. Навык состоит из markdown-файлов и одного JS-скрипта, поэтому подходит любому агенту, который загружает навыки из файловой системы.

## Структура

```
pmbok6/
├── SKILL.md                    ← оркестратор: маршрутизация, правила, калькулятор
├── scripts/pmcalc.js           ← калькулятор (EVM, PERT, CPM, EMV, контракты, NPV)
├── references/
│   ├── workflows.md            ← 8 пошаговых сценариев для агента
│   ├── process-map.md          ← 49 процессов, главные выходы, «какой процесс когда»
│   ├── itto-*.md               ← полные ITTO по 10 областям знаний
│   ├── project-documents.md    ← план УП, 33 документа, ФСП/АПО, поток данных
│   ├── formulas.md             ← все формулы
│   ├── worked-examples.md      ← разобранные примеры
│   ├── contracts.md            ← типы контрактов, риски, расчёты
│   ├── tools-techniques.md     ← каталог инструментов, модели стейкхолдеров, 7QC
│   ├── people-skills.md        ← лидерство, конфликты, мотивация, власть
│   ├── foundations.md          ← проект/программа/портфель, оргструктуры, PMO, роль РП
│   ├── agile-environments.md   ← adaptive/hybrid, выбор подхода, роли, метрики
│   ├── tailoring.md            ← адаптация процессов
│   ├── key-concepts.md         ← ключевые концепции (X4)
│   ├── exam-guide.md           ← мышление PMI, ловушки, тренажёр
│   ├── changes-v5-v6.md        ← отличия 6-го издания
│   └── glossary.md             ← RU↔EN, сокращения
└── templates/                  ← 13 шаблонов документов
```

## Калькулятор

```bash
node pmbok6/scripts/pmcalc.js evm --bac 100000 --pv 50000 --ev 40000 --ac 45000
node pmbok6/scripts/pmcalc.js cpm --tasks "A:3;B:2:A;C:4:A;D:5:B;E:2:C;F:3:D,E" --json
```

## Разработка

```bash
npm test   # юнит-тесты калькулятора + структурная проверка навыка
```

CI проверяет, что процессов ровно 49, у каждого есть входы, инструменты и выходы, ссылки между файлами не битые, а frontmatter корректен. Также CI проверяет калькулятор и установщик.

---

## English

An agent skill for project management based on the **PMBOK® Guide, 6th Edition**. It covers all 49 processes with full ITTOs, eight step-by-step agent workflows (project kickoff, EVM status, change control, risk workshop, audit, contract selection, closure, PMP prep), a zero-dependency JavaScript calculator (EVM, PERT, CPM with floats, EMV, FPIF/PTA, CPIF, NPV/IRR, crashing), worked examples, and 13 document templates. The content is in Russian. The skill description is bilingual, so the skill triggers on English requests too.

Install for Claude Code: `curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash -s -- --agent claude`

## Правовая информация

PMBOK® и PMP® — зарегистрированные товарные знаки Project Management Institute, Inc. Проект независим и не аффилирован с PMI. Он содержит структурированный справочный материал и собственные пояснения и не заменяет оригинальное руководство. Код и собственный контент распространяются по лицензии MIT, см. [LICENSE](LICENSE).
