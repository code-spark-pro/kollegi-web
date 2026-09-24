const KOLLEGI_SEED = {
  accounts: [
    { id: 1, login: 'anna', password: 'demo123', name: 'Анна Воронова', initials: 'АВ', color: '#e8ff76', area: 'Продуктовый дизайн', role: 'Генератор идей', country: 'Россия', city: 'Москва', timezone: 'UTC+3', market: 'Россия и СНГ', status: 'Ищу команду', businessGoal: 'Ищу технологического партнёра для запуска EdTech-продукта', cooperation: 'Партнёрство', budget: 'до 300 000 ₽', projectStage: 'Проверка идеи', languages: ['Русский', 'English'], interfaceLanguage: 'ru', impact: 84, reliability: 96, projects: 7, skills: ['UX-исследования', 'Figma', 'Прототипирование', 'EdTech'], bio: 'Превращаю сложные сервисы в понятные продукты. Хочу сделать образование внимательнее к человеку.' },
    { id: 2, login: 'maxim', password: 'demo123', name: 'Максим Орлов', initials: 'МО', color: '#75d9ff', area: 'Разработка', role: 'Аналитик', country: 'Беларусь', city: 'Минск', timezone: 'UTC+3', market: 'Международный', status: 'Готов присоединиться', businessGoal: 'Разработка MVP, интеграция AI и аудит архитектуры', cooperation: 'Проектная работа', budget: 'Обсуждается', projectStage: 'MVP', languages: ['Русский', 'English', 'Беларуская'], interfaceLanguage: 'ru', impact: 71, reliability: 91, projects: 5, skills: ['React', 'Node.js', 'AI', 'Архитектура'], bio: 'Собираю быстрые MVP и помогаю командам принимать технические решения без лишней сложности.' },
    { id: 3, login: 'elena', password: 'demo123', name: 'Елена Соколова', initials: 'ЕС', color: '#ffb5a7', area: 'Маркетинг', role: 'Стратег', country: 'Казахстан', city: 'Алматы', timezone: 'UTC+5', market: 'Центральная Азия', status: 'Ищу сооснователя', businessGoal: 'Вывод B2B-сервисов на рынки Центральной Азии', cooperation: 'Соосновательство', budget: 'до 1 000 000 ₸', projectStage: 'Первые продажи', languages: ['Русский', 'Қазақша', 'English'], interfaceLanguage: 'ru', impact: 93, reliability: 98, projects: 11, skills: ['B2B-маркетинг', 'Исследования', 'Go-to-market', 'Контент'], bio: 'Запускаю продукты на B2B-рынке. Особенно интересны сервисы, которые помогают малому бизнесу.' },
    { id: 4, login: 'dmitry', password: 'demo123', name: 'Дмитрий Волков', initials: 'ДВ', color: '#c9b8ff', area: 'Аналитика', role: 'Исполнитель', country: 'Армения', city: 'Ереван', timezone: 'UTC+4', market: 'ЕАЭС', status: 'Хочу обсуждать идеи', businessGoal: 'Финансовые модели и аналитика для инвестиционных проектов', cooperation: 'Консультации', budget: 'от 50 000 ₽', projectStage: 'Масштабирование', languages: ['Русский', 'English', 'Հայերեն'], interfaceLanguage: 'ru', impact: 65, reliability: 89, projects: 4, skills: ['Python', 'Data Science', 'Финмодели', 'SQL'], bio: 'Ищу закономерности в данных и объясняю их человеческим языком. За проекты с измеримым эффектом.' },
    { id: 5, login: 'sofia', password: 'demo123', name: 'София Лебедева', initials: 'СЛ', color: '#ffc963', area: 'Международный бизнес', role: 'Эмпат-коммуникатор', country: 'Китай', city: 'Шанхай', timezone: 'UTC+8', market: 'Китай и Юго-Восточная Азия', status: 'Ищу проект', businessGoal: 'Помогаю компаниям выходить на рынок Китая и выстраивать деловые связи', cooperation: 'Экспертная поддержка', budget: 'от 2 000 ¥', projectStage: 'Выход на рынок', languages: ['Русский', '中文', 'English'], interfaceLanguage: 'ru', impact: 88, reliability: 97, projects: 9, skills: ['Китай', 'Локализация', 'Переговоры', 'Менторство'], bio: 'Сопровождаю международные команды и создаю среду, где партнёры понимают деловой контекст друг друга.' }
  ],
  ideas: [
    { id: 1, authorId: 3, stage: 'Обсуждение', title: 'Микро-консультации для малого бизнеса', text: 'Сервис, где предприниматель за 30 минут получает ответ профильного эксперта и понятный следующий шаг.', tags: ['B2B', 'Маркетплейс'], lights: 47, comments: 12 },
    { id: 2, authorId: 5, stage: 'Зерно', title: 'Навигатор первых 90 дней в новой профессии', text: 'Персональный маршрут с маленькими практическими задачами и поддержкой людей из индустрии.', tags: ['EdTech', 'Карьера'], lights: 31, comments: 8 },
    { id: 3, authorId: 2, stage: 'Драфт', title: 'Открытая карта доступности города', text: 'Жители отмечают реальные барьеры городской среды, а бизнес и муниципалитет видят приоритеты.', tags: ['Social Impact', 'Data'], lights: 62, comments: 19 }
  ],
  projects: [
    { id: 1, title: 'Навигатор профессий', progress: 68, members: [1, 2, 5], deadline: '12 октября', tasks: [{ text: 'Провести 5 интервью', done: true }, { text: 'Собрать интерактивный прототип', done: false }, { text: 'Проверить гипотезу маршрутов', done: false }] },
    { id: 2, title: 'Карта доступности', progress: 34, members: [2, 4], deadline: '28 октября', tasks: [{ text: 'Подготовить структуру данных', done: true }, { text: 'Импортировать открытые данные', done: false }] }
  ],
  messages: [
    { id: 1, users: [1, 2], texts: [{ from: 2, text: 'Привет! Посмотрел твой прототип навигатора. Могу помочь с технической частью.', time: '10:42' }, { from: 1, text: 'Супер! Как раз хочу обсудить архитектуру первого MVP.', time: '10:45' }] },
    { id: 2, users: [1, 5], texts: [{ from: 5, text: 'Анна, предлагаю созвониться и разобрать сценарий первого дня.', time: 'Вчера' }] }
  ],
  support: [
    { id: 1, priority: 'Высокий', topic: 'Не могу добавить участника в проект', userId: 2, status: 'Открыт', created: 'Сегодня, 09:42' },
    { id: 2, priority: 'Обычный', topic: 'Вопрос по настройкам языка', userId: 5, status: 'В работе', created: 'Вчера, 16:10' }
  ]
};

function getKollegiState() {
  const stored = localStorage.getItem('kollegiState');
  if (stored) {
    const state = JSON.parse(stored);
    state.accounts = KOLLEGI_SEED.accounts.map((seedAccount) => {
      const existing = (state.accounts || []).find((item) => item.id === seedAccount.id);
      const merged = { ...seedAccount, ...existing };
      if (existing && !existing.country) {
        merged.country = seedAccount.country;
        merged.city = seedAccount.city;
      }
      return merged;
    });
    state.reports ||= [];
    state.blocked ||= [];
    state.support ||= JSON.parse(JSON.stringify(KOLLEGI_SEED.support || []));
    localStorage.setItem('kollegiState', JSON.stringify(state));
    return state;
  }
  const state = JSON.parse(JSON.stringify(KOLLEGI_SEED));
  state.reports = [];
  state.blocked = [];
  localStorage.setItem('kollegiState', JSON.stringify(state));
  return state;
}

const KOLLEGI_COUNTRIES = {
  'Россия': ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'],
  'Беларусь': ['Минск', 'Брест', 'Гродно'],
  'Казахстан': ['Алматы', 'Астана', 'Шымкент'],
  'Армения': ['Ереван', 'Гюмри'],
  'Кыргызстан': ['Бишкек', 'Ош'],
  'Китай': ['Пекин', 'Шанхай', 'Шэньчжэнь', 'Гуанчжоу']
};

const KOLLEGI_UI_LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' }
];

function saveKollegiState(state) {
  localStorage.setItem('kollegiState', JSON.stringify(state));
}
