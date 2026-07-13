# PMBOK 6 — Project Management Skill for AI Agents

Навык управления проектами на основе PMBOK® Guide 6th Edition (PMI, 2017).

## Установка

### Hermes Agent

```bash
# Клонировать репозиторий
git clone https://github.com/mb-mal/pmbok6.git /tmp/pmbok6

# Скопировать навык
cp -r /tmp/pmbok6/pmbok6 ~/.hermes/skills/project-management/

# Проверить
hermes skill list | grep pmbok6
```

Или одной командой:

```bash
curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash
```

### Claude Code
```bash
/plugin install pmbok6@claude-plugins-official
```

### Другие AI-агенты
Скопируйте папку `pmbok6/` в директорию skills вашего агента. Навык написан на markdown, совместим с любым агентом, поддерживающим навыки через файловую систему.

## Структура

```
pmbok6/
├── SKILL.md                 ← оркестратор и навигатор
├── references/              ← 17 справочных файлов
│   ├── process-map.md       ← карта 49 процессов
│   ├── formulas.md          ← EVM, PERT, крит. путь
│   ├── key-concepts.md      ← ключевые концепции областей знаний
│   ├── contracts.md         ← типы контрактов
│   ├── agile-environments.md← гибкие/адаптивные среды
│   ├── tailoring.md         ← адаптация процессов
│   ├── changes-v5-v6.md     ← изменения между изданиями
│   └── itto-*.md            ← ITTO по 10 областям знаний
└── templates/               ← 4 шаблона
    ├── project-charter.md   ← устав проекта
    ├── wbs.md               ← ИСР
    ├── risk-register.md     ← реестр рисков
    └── stakeholder-register.md ← реестр стейкхолдеров
```

## Возможности

- 49 процессов PMBOK 6 с полными ITTO
- EVM-формулы (SPI, CPI, EAC, ETC, TCPI)
- PERT, критический путь, сжатие расписания
- Контракты (FF, FPIF, CPFF, CPIF, T&M)
- Agile-адаптация по PMBOK
- Шаблоны: устав, ИСР, реестр рисков, реестр стейкхолдеров

## Основа

Навык создан на основе полного русского перевода **PMBOK® Guide — Sixth Edition** (PMI, 2017, ISBN 978-1-62825-193-7, 762 стр.). PDF разобран, структурирован и преобразован в 22 markdown-файла.

## Лицензия

MIT — см. [LICENSE](LICENSE)
