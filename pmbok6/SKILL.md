---
name: pmbok6
description: "Project management by PMBOK® Guide 6th Edition (PMI): 49 processes with full ITTOs, EVM/PERT/CPM/EMV/contract formulas with a JS calculator, risk and stakeholder management, contract selection, agile/hybrid tailoring, document templates, project audits and PMP exam prep. Use when planning a project (charter, WBS, schedule, budget, risk register), evaluating status (SPI, CPI, EAC, TCPI), handling change requests, choosing a contract type, auditing a project against PMBOK, or studying for PMP. Управление проектами по PMBOK 6: устав, ИСР, расписание, бюджет, EVM, риски, контракты, аудит, подготовка к PMP."
triggers:
  - project management
  - PMBOK
  - PMP
  - project planning
  - project charter
  - WBS
  - critical path
  - earned value
  - EVM
  - risk register
  - risk management
  - stakeholder
  - change request
  - contract type
  - agile hybrid
  - управление проектом
  - управление проектами
  - устав проекта
  - ИСР
  - критический путь
  - освоенный объём
  - реестр рисков
  - процессные группы
  - области знаний
  - подготовка к PMP
  - гибкая методология
---

# PMBOK® Guide 6 — навык управления проектами

**Модель:** 5 групп процессов × 10 областей знаний = 49 процессов. PMBOK — **стандарт, а не методология**: адаптируй под проект.

## Как работать с навыком

1. **Определи тип запроса** по таблице маршрутизации и открой **только нужные** файлы.
2. Для практических задач следуй сценарию из `references/workflows.md` (W1–W8).
3. **Любые расчёты** — через `scripts/pmcalc.js` (Node.js, без зависимостей), не в уме.
4. Документы — по шаблонам из `templates/`; заполняй известным, неизвестное помечай `[уточнить]` и выноси в допущения.
5. Ссылайся на процессы номером и названием («11.5 Планирование реагирования на риски»).

## Маршрутизация

| Запрос пользователя | Сценарий | Открыть |
|---|---|---|
| Новый проект, «с чего начать», устав, план | W1 | `workflows.md`, `templates/project-charter.md`, `templates/wbs.md`, `project-documents.md` |
| Статус, SPI/CPI, EAC, «укладываемся ли» | W2 | `formulas.md` §1, `worked-examples.md` §1, `templates/status-report.md` |
| Сроки, критический путь, PERT, сжатие | — | `itto-schedule.md`, `formulas.md` §2, `worked-examples.md` §2–4 |
| Запрос на изменение, scope creep | W3 | `itto-integration.md` 4.6, `templates/change-request.md` |
| Риски: выявить, оценить, ответить, EMV | W4 | `itto-risk.md`, `templates/risk-register.md`, `worked-examples.md` §5–6 |
| Аудит / health check проекта | W5 | `workflows.md` W5, `process-map.md` |
| Тип контракта, FPIF/CPIF, PTA, закупки | W6 | `contracts.md`, `itto-procurement.md` |
| Закрытие проекта/фазы, уроки | W7 | `itto-integration.md` 4.7, `templates/project-closure-report.md` |
| Подготовка к PMP, вопросы, ловушки | W8 | `exam-guide.md`, `process-map.md`, `project-documents.md` |
| «Какой процесс когда», ITTO, входы/выходы | — | `process-map.md` → `itto-<область>.md` |
| Какой документ где создаётся, ФСП/АПО | — | `project-documents.md` |
| Команда, конфликт, мотивация, лидерство | — | `people-skills.md`, `itto-resources.md` |
| Стейкхолдеры, коммуникации | — | `itto-stakeholders.md`, `itto-communications.md`, `templates/stakeholder-register.md`, `templates/communications-plan.md` |
| Agile, гибрид, выбор подхода | — | `agile-environments.md`, `tailoring.md` |
| Роль РП, оргструктуры, PMO, ЖЦ | — | `foundations.md` |
| Инструмент/метод (Исикава, Монте-Карло, RACI…) | — | `tools-techniques.md` |
| Термины RU↔EN | — | `glossary.md` |
| Отличия от 5-го издания | — | `changes-v5-v6.md` |

Все пути `*.md` без префикса — в `references/`.

## Карта процессов (кратко)

| Область | Инициация | Планирование | Исполнение | Мониторинг и контроль | Закрытие |
|---|---|---|---|---|---|
| 4 Интеграция | 4.1 | 4.2 | 4.3, 4.4 | 4.5, 4.6 | 4.7 |
| 5 Содержание | | 5.1–5.4 | | 5.5, 5.6 | |
| 6 Расписание | | 6.1–6.5 | | 6.6 | |
| 7 Стоимость | | 7.1–7.3 | | 7.4 | |
| 8 Качество | | 8.1 | 8.2 | 8.3 | |
| 9 Ресурсы | | 9.1, 9.2 | 9.3–9.5 | 9.6 | |
| 10 Коммуникации | | 10.1 | 10.2 | 10.3 | |
| 11 Риски | | 11.1–11.5 | 11.6 | 11.7 | |
| 12 Закупки | | 12.1 | 12.2 | 12.3 | |
| 13 Стейкхолдеры | 13.1 | 13.2 | 13.3 | 13.4 | |
| **Итого** | **2** | **24** | **10** | **12** | **1** |

Названия и главные выходы всех 49 процессов — `process-map.md`.

## Калькулятор

```bash
node scripts/pmcalc.js evm --bac 100000 --pv 50000 --ev 40000 --ac 45000
node scripts/pmcalc.js cpm --tasks "A:3;B:2:A;C:4:A;D:5:B;E:2:C;F:3:D,E"
node scripts/pmcalc.js pert --tasks "4,6,14;2,3,4"
node scripts/pmcalc.js emv --risks "0.3:-20000;0.2:10000"
node scripts/pmcalc.js fpif --target-cost 100000 --target-fee 10000 --ceiling 120000 --buyer-share 0.7 --actual 110000
```
Также: `cpif`, `channels`, `npv`, `crash`. `--json` — машиночитаемый вывод. Без аргументов — справка. Путь `scripts/` — относительно папки навыка.

## Ключевые правила PMBOK (применяй всегда)

1. **Устав выпускает спонсор**; без устава проект не авторизован.
2. **Изменения базовых планов — только через 4.6** (оценка влияния → CCB → обновление → уведомление). Никаких «маленьких бесплатных» изменений.
3. **Интеграция не делегируется** — это ответственность РП.
4. **ИСР** — результаты, не действия; нижний уровень — пакет работ; правило 100%.
5. **Резерв на непредвиденные** — внутри базового плана (известные риски); **управленческий** — вне его (неизвестные).
6. **Верификация (8.3) → валидация/приёмка (5.5)**.
7. **Риски**: 5 стратегий для угроз (эскалация, уклонение, передача, снижение, принятие) и 5 для возможностей (эскалация, использование, совместное использование, усиление, принятие); один владелец на риск; ответы нужно **исполнять** (11.6).
8. **EVM**: EV всегда первый; < 1 или < 0 — плохо; EAC выбирать по причине отклонения.
9. **Стейкхолдеров** выявлять рано и повторно; цель — вовлечение, а не управление.
10. **Уроки** собираются всё время проекта, а не только в конце.
11. **Конфликты**: предпочтительно сотрудничество/решение проблемы, сначала — силами самих участников.
12. **Адаптируй** процессы под размер и сложность, но не выбрасывай их суть.

## Формат ответа

- Сначала краткий вывод / рекомендация, затем обоснование и расчёты.
- Разделяй «по PMBOK» и «практическая рекомендация».
- Для документов — заполненный шаблон, а не пересказ шаблона.
- Спрашивай только недостающие данные; разумные допущения явно помечай.

---
*PMBOK® и PMP® — зарегистрированные товарные знаки Project Management Institute, Inc. Навык — независимый справочный материал, не аффилирован с PMI и не заменяет оригинальное руководство.*
