export const DEFAULT_AI_PROMPT = 'Организовать работу команды на эту неделю'

interface Template {
  test: (prompt: string) => boolean
  subtasks: string[]
}

const templates: Template[] = [
  {
    test: (prompt) => /telegram|телеграм|бот|чат|bot|chat/i.test(prompt),
    subtasks: [
      'Описать команды, которые можно отправить боту',
      'Связать пользователей чата с участниками пространства',
      'Подтверждать задачу перед созданием',
      'Отправлять смену статуса обратно в чат',
    ],
  },
  {
    test: (prompt) => /сайт|лендинг|маркетинг|запуск|website|landing|marketing|launch/i.test(prompt),
    subtasks: [
      'Собрать структуру страницы и главное сообщение',
      'Сделать первый экран и блоки о продукте',
      'Подготовить скриншоты и текст запуска',
      'Показать страницу владельцу маркетинга',
    ],
  },
  {
    test: (prompt) => /api|бэкенд|пайплайн|данные|backend|pipeline|data/i.test(prompt),
    subtasks: [
      'Зафиксировать входные данные и ожидаемый результат',
      'Набросать поток данных и сценарии ошибок',
      'Разбить работу на задачи, которые можно проверить',
      'Назначить владельца и дату',
    ],
  },
  {
    test: (prompt) => /дизайн|дашборд|интерфейс|экран|макет|design|dashboard|ui|layout|screen/i.test(prompt),
    subtasks: [
      'Перечислить экраны, которые нужны для этой работы',
      'Описать содержимое и пустые состояния',
      'Согласовать макет с владельцем продукта',
      'Превратить согласованные экраны в задачи',
    ],
  },
]

const fallback = [
  'Разбить результат на конкретные части',
  'Назначить владельца каждой части',
  'Упорядочить работу по зависимостям',
  'Поставить срок первой проверки',
]

export function generateSubtasks(prompt: string) {
  const match = templates.find((template) => template.test(prompt))
  const short = prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt
  return [`Уточнить результат: «${short}»`, ...(match?.subtasks ?? fallback)].slice(0, 5)
}
