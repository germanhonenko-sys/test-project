import type { Localized } from '../types/index.ts'
import { loc } from '../i18n/text.ts'

export const DEFAULT_AI_PROMPT: Localized = loc(
  'Организовать работу команды на эту неделю',
  'Organize the team’s work for this week',
)

interface Template {
  test: (prompt: string) => boolean
  subtasks: Localized[]
}

const templates: Template[] = [
  {
    test: (prompt) => /telegram|телеграм|бот|чат|bot|chat/i.test(prompt),
    subtasks: [
      loc('Описать команды, которые можно отправить боту', 'List the commands the bot should accept'),
      loc(
        'Связать пользователей чата с участниками пространства',
        'Map chat users to workspace members',
      ),
      loc('Подтверждать задачу перед созданием', 'Confirm a task before creating it'),
      loc('Отправлять смену статуса обратно в чат', 'Send status changes back to the chat'),
    ],
  },
  {
    test: (prompt) => /сайт|лендинг|маркетинг|запуск|website|landing|marketing|launch/i.test(prompt),
    subtasks: [
      loc('Собрать структуру страницы и главное сообщение', 'Outline the page and the main message'),
      loc('Сделать первый экран и блоки о продукте', 'Design the hero and the product sections'),
      loc('Подготовить скриншоты и текст запуска', 'Prepare screenshots and launch copy'),
      loc('Показать страницу владельцу маркетинга', 'Show the page to the marketing owner'),
    ],
  },
  {
    test: (prompt) => /api|бэкенд|пайплайн|данные|backend|pipeline|data/i.test(prompt),
    subtasks: [
      loc('Зафиксировать входные данные и ожидаемый результат', 'Write down inputs and the expected result'),
      loc('Набросать поток данных и сценарии ошибок', 'Sketch the data flow and error cases'),
      loc('Разбить работу на задачи, которые можно проверить', 'Split the work into tasks that can be checked'),
      loc('Назначить владельца и дату', 'Assign an owner and a date'),
    ],
  },
  {
    test: (prompt) => /дизайн|дашборд|интерфейс|экран|макет|design|dashboard|ui|layout|screen/i.test(prompt),
    subtasks: [
      loc('Перечислить экраны, которые нужны для этой работы', 'List the screens this work needs'),
      loc('Описать содержимое и пустые состояния', 'Describe the content and empty states'),
      loc('Согласовать макет с владельцем продукта', 'Review the layout with the product owner'),
      loc('Превратить согласованные экраны в задачи', 'Turn the agreed screens into tasks'),
    ],
  },
]

const fallback: Localized[] = [
  loc('Разбить результат на конкретные части', 'Break the outcome into concrete parts'),
  loc('Назначить владельца каждой части', 'Assign an owner to each part'),
  loc('Упорядочить работу по зависимостям', 'Order the work by dependencies'),
  loc('Поставить срок первой проверки', 'Set a date for the first review'),
]

export function generateSubtasks(prompt: string) {
  const match = templates.find((template) => template.test(prompt))
  const short = prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt
  const clarify = loc(`Уточнить результат: «${short}»`, `Clarify the outcome: “${short}”`)
  return [clarify, ...(match?.subtasks ?? fallback)].slice(0, 5)
}
