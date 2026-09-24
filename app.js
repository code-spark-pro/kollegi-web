const state = getKollegiState();
let currentUser = null;
let currentPage = 'home';
let currentDialog = null;
let matchCountry = '';
let matchCity = '';
let matchCooperation = '';

const I18N = {
  ru: { nav: ['Главная', 'Мэтчи', 'Idea Hub', 'Проекты', 'Сообщения'], mobile: ['Главная', 'Коллеги', 'Идеи', 'Проекты', 'Чаты'], search: 'Найти коллегу по навыку, городу или бизнес-задаче', profile: 'Мой профиль', homeKick: 'Ваше пространство', hello: 'Здравствуйте', homeSub: 'Здесь начинается новое деловое сотрудничество.', matchesKick: 'Умный подбор', matchesTitle: 'Подходящие коллеги', matchesSub: 'Ищите партнёров по компетенциям, географии и бизнес-задачам.', ideasKick: 'Банк идей', ideasTitle: 'Idea Hub', ideasSub: 'Публикуйте проблему, находите соавторов и превращайте идею в проект.', projectsKick: 'Совместная работа', projectsTitle: 'Мои проекты', projectsSub: 'Задачи, договорённости и прогресс команды в одном месте.', messagesKick: 'Безопасное общение', messagesTitle: 'Сообщения', messagesSub: 'Обсуждайте условия и превращайте контакт в совместное действие.', profileKick: 'Личный кабинет', profileTitle: 'Мой профиль', profileSub: 'Укажите компетенции, географию и формат делового сотрудничества.', allCountries: 'Все страны', allCities: 'Все города', allFormats: 'Все форматы', found: 'Найдено коллег', noResults: 'Подходящих коллег пока нет. Измените фильтры или поисковый запрос.' },
  en: { nav: ['Home', 'Matches', 'Idea Hub', 'Projects', 'Messages'], mobile: ['Home', 'People', 'Ideas', 'Projects', 'Chats'], search: 'Find a colleague by skill, city or business goal', profile: 'My profile', homeKick: 'Your workspace', hello: 'Hello', homeSub: 'This is where new business collaboration begins.', matchesKick: 'Smart matching', matchesTitle: 'Relevant colleagues', matchesSub: 'Find partners by expertise, location and business goals.', ideasKick: 'Idea bank', ideasTitle: 'Idea Hub', ideasSub: 'Share a problem, find co-authors and turn an idea into a project.', projectsKick: 'Collaboration', projectsTitle: 'My projects', projectsSub: 'Tasks, agreements and team progress in one place.', messagesKick: 'Secure communication', messagesTitle: 'Messages', messagesSub: 'Discuss terms and turn a contact into action.', profileKick: 'Personal account', profileTitle: 'My profile', profileSub: 'Specify expertise, geography and preferred collaboration format.', allCountries: 'All countries', allCities: 'All cities', allFormats: 'All formats', found: 'Colleagues found', noResults: 'No relevant colleagues found. Adjust filters or your search query.' },
  zh: { nav: ['首页', '匹配', '创意中心', '项目', '消息'], mobile: ['首页', '伙伴', '创意', '项目', '聊天'], search: '按技能、城市或商业目标寻找合作伙伴', profile: '我的资料', homeKick: '您的工作空间', hello: '您好', homeSub: '新的商业合作从这里开始。', matchesKick: '智能匹配', matchesTitle: '推荐合作伙伴', matchesSub: '按专业能力、地区和商业目标寻找合作伙伴。', ideasKick: '创意库', ideasTitle: '创意中心', ideasSub: '分享问题，寻找合作者，将创意转化为项目。', projectsKick: '协同工作', projectsTitle: '我的项目', projectsSub: '在一个地方管理任务、协议和团队进度。', messagesKick: '安全沟通', messagesTitle: '消息', messagesSub: '讨论合作条件，将联系转化为行动。', profileKick: '个人中心', profileTitle: '我的资料', profileSub: '填写专业能力、地区和合作方式。', allCountries: '所有国家', allCities: '所有城市', allFormats: '所有形式', found: '找到合作伙伴', noResults: '暂未找到合适的伙伴，请调整筛选条件。' }
};

const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const account = (id) => state.accounts.find((item) => item.id === Number(id));
const avatar = (user, extra = '') => `<span class="avatar ${extra}" style="background:${user.color}">${esc(user.initials)}</span>`;
const t = (key) => (I18N[currentUser?.interfaceLanguage || 'ru'] || I18N.ru)[key] || I18N.ru[key] || key;

function updateShellLanguage() {
  const language = currentUser?.interfaceLanguage || 'ru';
  const copy = I18N[language] || I18N.ru;
  document.documentElement.lang = language === 'zh' ? 'zh' : language;
  document.querySelectorAll('#mainNav .nav-label').forEach((label, index) => label.textContent = copy.nav[index]);
  document.querySelectorAll('#mobileNav small').forEach((label, index) => label.textContent = copy.mobile[index]);
  $('#globalSearch').placeholder = copy.search;
  $('#quickLanguage').value = language;
  document.querySelector('.profile-mini small').textContent = copy.profile;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openModal(content) {
  $('#modalContent').innerHTML = content;
  $('#modal').classList.remove('hidden');
}

function closeModal() {
  $('#modal').classList.add('hidden');
}

function showSupportForm() {
  openModal(`<h2>Связаться с поддержкой</h2><p class="muted">Опишите вопрос. Обращение появится в очереди администратора.</p><form id="supportForm" class="modal-form"><label class="field">Тема<select name="category"><option>Работа с проектом</option><option>Профиль и настройки</option><option>Безопасность</option><option>Оплата и документы</option><option>Другое</option></select></label><label class="field">Приоритет<select name="priority"><option>Обычный</option><option>Высокий</option></select></label><label class="field">Описание<textarea name="topic" required maxlength="300" placeholder="Что произошло и какой результат вы ожидаете?"></textarea></label><button class="button button--primary" type="submit">Отправить обращение <span>→</span></button></form>`);
  $('#supportForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.support ||= [];
    state.support.unshift({ id: Date.now(), priority: form.get('priority'), topic: `${form.get('category')}: ${form.get('topic').trim()}`, userId: currentUser.id, status: 'Открыт', created: `Сегодня, ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` });
    saveKollegiState(state); closeModal(); showToast('Обращение отправлено в поддержку');
  });
}

function initLogin() {
  $('#demoAccounts').innerHTML = state.accounts.map((user) =>
    `<button type="button" class="demo-user" data-login="${user.login}" title="${esc(user.name)}" style="background:${user.color}">${esc(user.initials)}</button>`
  ).join('');
  document.querySelectorAll('.demo-user').forEach((button) => button.addEventListener('click', () => {
    $('#loginInput').value = button.dataset.login;
    $('#passwordInput').value = 'demo123';
    $('#passwordInput').focus();
  }));

  $('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const login = $('#loginInput').value.trim().toLowerCase();
    const user = state.accounts.find((item) => item.login === login && item.password === $('#passwordInput').value);
    if (!user) return showToast('Неверный логин или пароль');
    if ((state.blocked || []).includes(user.id)) return showToast('Аккаунт временно заблокирован');
    sessionStorage.setItem('kollegiUser', user.id);
    enterApp(user);
  });

  const savedId = sessionStorage.getItem('kollegiUser');
  if (savedId && account(savedId) && !(state.blocked || []).includes(Number(savedId))) enterApp(account(savedId));
}

function enterApp(user) {
  currentUser = user;
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  $('#sideAvatar').textContent = user.initials;
  $('#sideAvatar').style.background = user.color;
  $('#sideName').textContent = user.name;
  updateShellLanguage();
  navigate('home');
}

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('#mainNav button, #mobileNav button, .profile-mini').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
  $('#sidebar')?.classList.remove('open');
  const renderers = { home: renderHome, matches: renderMatches, ideas: renderIdeas, projects: renderProjects, messages: renderMessages, profile: renderProfile };
  renderers[page]();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pageHead(kicker, title, subtitle, action = '') {
  return `<div class="page-head"><div><p class="eyebrow eyebrow--dark">${esc(kicker)}</p><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${action || `<span class="date-chip">24 сентября · четверг</span>`}</div>`;
}

function personCard(user, compact = false, searchScore = 0) {
  const shared = user.skills.filter((skill) => currentUser.skills.includes(skill)).length;
  const score = Math.min(98, 76 + shared * 8 + ((user.id + currentUser.id) % 8));
  const reasons = [];
  if (shared) reasons.push(`${shared} общих навыка`);
  if (user.market === currentUser.market) reasons.push('один рынок');
  if (user.cooperation === currentUser.cooperation) reasons.push('совпадает формат');
  if (user.languages.some((language) => currentUser.languages.includes(language))) reasons.push('общий язык');
  if (!reasons.length) reasons.push('дополняющие компетенции');
  return `<article class="person-card">
    <div class="person-top">${avatar(user)}<div><h3>${esc(user.name)}</h3><p>📍 ${esc(user.city)}, ${esc(user.country)}</p></div><div class="score">${searchScore ? Math.min(99, score + searchScore) : score}%<small>мэтч</small></div></div>
    <div class="match-reasons"><small>Почему подходит</small><span>${reasons.map((reason) => `✓ ${esc(reason)}`).join(' · ')}</span></div>
    <div class="business-request"><small>Бизнес-запрос</small><p>${esc(user.businessGoal)}</p></div>
    ${compact ? '' : `<p class="person-bio">${esc(user.bio)}</p>`}
    <div class="tags">${user.skills.slice(0, 3).map((skill) => `<span class="tag">${esc(skill)}</span>`).join('')}</div>
    <div class="person-details"><span>🤝 ${esc(user.cooperation)} · ${esc(user.projectStage)}</span><span>🌏 ${esc(user.market)} · ${esc(user.timezone)}</span><span>💬 ${user.languages.map(esc).join(' · ')}</span></div>
    <div class="card-actions"><button class="button button--soft" data-profile-id="${user.id}">Профиль</button><button class="button button--lime" data-connect-id="${user.id}">Связаться</button><button class="button button--invite" data-invite-id="${user.id}">Пригласить в проект</button></div>
  </article>`;
}

function bindPersonActions() {
  document.querySelectorAll('[data-profile-id]').forEach((button) => button.addEventListener('click', () => showPerson(Number(button.dataset.profileId))));
  document.querySelectorAll('[data-connect-id]').forEach((button) => button.addEventListener('click', () => connect(Number(button.dataset.connectId))));
  document.querySelectorAll('[data-invite-id]').forEach((button) => button.addEventListener('click', () => showProjectInvite(Number(button.dataset.inviteId))));
}

function renderHome() {
  const recommendations = state.accounts.filter((user) => user.id !== currentUser.id && !(state.blocked || []).includes(user.id)).slice(0, 3);
  const activeProjects = state.projects.filter((project) => project.members.includes(currentUser.id));
  $('#pageContent').innerHTML = `${pageHead(t('homeKick'), `${t('hello')}, ${currentUser.name.split(' ')[0]}!`, t('homeSub'))}
    <div class="hero-grid">
      <section class="welcome"><span class="eyebrow">Фокус недели</span><h2>Одна встреча может стать большим проектом.</h2><p>Мы нашли людей, чьи навыки дополняют ваши. Посмотрите новые рекомендации и начните с предложенного вопроса.</p><button class="button button--lime" data-go="matches">Смотреть мэтчи →</button></section>
      <section class="impact-card"><small>Индекс пользы</small><div><div class="impact-value">${currentUser.impact}</div><p>Вы в топ-15% активных участников своей сферы</p></div><span>↗ +6 за этот месяц</span></section>
    </div>
    <div class="stats-grid" style="margin-top:15px">
      <div class="stat-card"><span>Активные проекты</span><b>${activeProjects.length}</b></div><div class="stat-card"><span>Завершено</span><b>${currentUser.projects}</b></div><div class="stat-card"><span>Надёжность</span><b>${currentUser.reliability}%</b></div><div class="stat-card"><span>Новые контакты</span><b>12</b></div>
    </div>
    <div class="section-title"><h2>Подходящие коллеги</h2><button class="link-button" data-go="matches">Все рекомендации →</button></div>
    <div class="match-grid">${recommendations.map((user) => personCard(user, true)).join('')}</div>`;
  bindCommonActions();
  bindPersonActions();
}

function matchRelevance(user, query) {
  if (!query) return 0;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [user.name, user.area, user.country, user.city, user.businessGoal, user.cooperation, user.skills.join(' '), user.languages.join(' ')].join(' ').toLowerCase();
  return words.reduce((score, word) => score + (fields.includes(word) ? 5 : 0), 0);
}

function renderMatches() {
  const query = $('#globalSearch').value.trim();
  const countries = Object.keys(KOLLEGI_COUNTRIES);
  const cities = matchCountry ? KOLLEGI_COUNTRIES[matchCountry] : Object.values(KOLLEGI_COUNTRIES).flat();
  const formats = [...new Set(state.accounts.map((user) => user.cooperation))];
  const people = state.accounts
    .filter((user) => user.id !== currentUser.id && !(state.blocked || []).includes(user.id))
    .map((user) => ({ user, relevance: matchRelevance(user, query) }))
    .filter(({ user, relevance }) => (!query || relevance > 0) && (!matchCountry || user.country === matchCountry) && (!matchCity || user.city === matchCity) && (!matchCooperation || user.cooperation === matchCooperation))
    .sort((a, b) => b.relevance - a.relevance || b.user.reliability - a.user.reliability);
  $('#pageContent').innerHTML = `${pageHead(t('matchesKick'), t('matchesTitle'), t('matchesSub'))}
    <section class="search-panel" aria-label="Фильтры поиска"><div class="search-panel-title"><span>🌏</span><div><b>География сотрудничества</b><small>ЕАЭС и Китай</small></div></div><label><span>Страна</span><select id="countryFilter"><option value="">${t('allCountries')}</option>${countries.map((country) => `<option ${country === matchCountry ? 'selected' : ''}>${esc(country)}</option>`).join('')}</select></label><label><span>Город</span><select id="cityFilter"><option value="">${t('allCities')}</option>${cities.map((city) => `<option ${city === matchCity ? 'selected' : ''}>${esc(city)}</option>`).join('')}</select></label><label><span>Формат</span><select id="cooperationFilter"><option value="">${t('allFormats')}</option>${formats.map((format) => `<option ${format === matchCooperation ? 'selected' : ''}>${esc(format)}</option>`).join('')}</select></label><button id="clearMatchFilters" class="button button--soft">Сбросить</button></section>
    <div class="results-line"><b>${t('found')}: ${people.length}</b>${query ? `<span>По запросу «${esc(query)}»</span>` : '<span>Сначала наиболее надёжные и релевантные</span>'}</div>
    <div class="match-grid">${people.length ? people.map(({ user, relevance }) => personCard(user, false, relevance)).join('') : `<div class="empty empty--wide">${t('noResults')}</div>`}</div>`;
  bindPersonActions();
  $('#countryFilter').addEventListener('change', (event) => { matchCountry = event.target.value; matchCity = ''; renderMatches(); });
  $('#cityFilter').addEventListener('change', (event) => { matchCity = event.target.value; renderMatches(); });
  $('#cooperationFilter').addEventListener('change', (event) => { matchCooperation = event.target.value; renderMatches(); });
  $('#clearMatchFilters').addEventListener('click', () => { matchCountry = ''; matchCity = ''; matchCooperation = ''; $('#globalSearch').value = ''; renderMatches(); });
}

function ideaCard(idea) {
  const author = account(idea.authorId);
  return `<article class="idea-card"><span class="idea-stage">${esc(idea.stage)}</span><h3>${esc(idea.title)}</h3><p>${esc(idea.text)}</p><div class="tags">${idea.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div><div class="idea-footer">${avatar(author)}&nbsp; ${esc(author.name)}<span><button data-light-id="${idea.id}">✦ ${idea.lights}</button>&nbsp;&nbsp; ◯ ${idea.comments}</span></div></article>`;
}

function renderIdeas() {
  const action = `<button id="newIdea" class="button button--primary">Опубликовать идею <span>＋</span></button>`;
  $('#pageContent').innerHTML = `${pageHead(t('ideasKick'), t('ideasTitle'), t('ideasSub'), action)}
    <div class="filters"><button class="filter active">Все идеи</button><button class="filter">Зёрна</button><button class="filter">Обсуждения</button><button class="filter">Ищут команду</button></div>
    <div class="ideas-grid">${state.ideas.map(ideaCard).join('')}</div>`;
  $('#newIdea').addEventListener('click', showNewIdea);
  document.querySelectorAll('[data-light-id]').forEach((button) => button.addEventListener('click', () => {
    const idea = state.ideas.find((item) => item.id === Number(button.dataset.lightId));
    idea.lights += 1; saveKollegiState(state); button.textContent = `✦ ${idea.lights}`; showToast('Идея подсвечена');
  }));
}

function showNewIdea() {
  openModal(`<h2>Посадить зерно идеи</h2><form id="ideaForm" class="modal-form"><label class="field">Название<input name="title" maxlength="80" required placeholder="Какую проблему вы хотите решить?"></label><label class="field">Короткое описание<textarea name="text" maxlength="320" required placeholder="Опишите проблему без готового решения"></textarea></label><label class="field">Темы<input name="tags" placeholder="EdTech, AI, малый бизнес"></label><button class="button button--primary" type="submit">Опубликовать <span>→</span></button></form>`);
  $('#ideaForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.ideas.unshift({ id: Date.now(), authorId: currentUser.id, stage: 'Зерно', title: form.get('title').trim(), text: form.get('text').trim(), tags: form.get('tags').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 4), lights: 0, comments: 0 });
    saveKollegiState(state); closeModal(); renderIdeas(); showToast('Идея опубликована');
  });
}

function renderProjects() {
  const projects = state.projects.filter((project) => project.members.includes(currentUser.id));
  const cards = projects.length ? projects.map((project) => `<article class="project-card"><span class="idea-stage">В работе</span><h3>${esc(project.title)}</h3><div class="progress"><div style="width:${project.progress}%"></div></div><div class="progress-label"><span>Прогресс</span><b>${project.progress}%</b></div><div class="tasks">${project.tasks.map((task, index) => `<label class="task"><input type="checkbox" data-project="${project.id}" data-task="${index}" ${task.done ? 'checked' : ''}><span>${esc(task.text)}</span></label>`).join('')}</div><div class="project-meta"><div class="avatar-stack">${project.members.map((id) => avatar(account(id))).join('')}</div><span>Срок: ${esc(project.deadline)}</span></div></article>`).join('') : '<div class="empty">Пока нет активных проектов. Начните с идеи или нового мэтча.</div>';
  $('#pageContent').innerHTML = `${pageHead(t('projectsKick'), t('projectsTitle'), t('projectsSub'), '<button id="newProject" class="button button--primary">Новый проект <span>＋</span></button>')}<div class="project-grid">${cards}</div>`;
  document.querySelectorAll('[data-project]').forEach((box) => box.addEventListener('change', () => {
    const project = state.projects.find((item) => item.id === Number(box.dataset.project));
    project.tasks[Number(box.dataset.task)].done = box.checked;
    project.progress = Math.round(project.tasks.filter((task) => task.done).length / project.tasks.length * 100);
    saveKollegiState(state); renderProjects();
  }));
  $('#newProject').addEventListener('click', () => showToast('Сначала пригласите коллегу из раздела «Мэтчи»'));
}

function userDialogs() {
  return state.messages.filter((dialog) => dialog.users.includes(currentUser.id));
}

function renderMessages(dialogId) {
  const dialogs = userDialogs();
  const dialog = dialogs.find((item) => item.id === Number(dialogId)) || dialogs[0];
  currentDialog = dialog?.id || null;
  const list = dialogs.map((item) => {
    const other = account(item.users.find((id) => id !== currentUser.id));
    const last = item.texts.at(-1);
    return `<button class="dialog-item ${item.id === currentDialog ? 'active' : ''}" data-dialog="${item.id}">${avatar(other)}<div><b>${esc(other.name)}</b><small>${esc(last?.text || 'Новый контакт')}</small></div></button>`;
  }).join('');
  let chat = '<div class="empty">Выберите собеседника</div>';
  if (dialog) {
    const other = account(dialog.users.find((id) => id !== currentUser.id));
    chat = `<div class="chat-head">${avatar(other)}<div><b>${esc(other.name)}</b><small>● в сети · ${esc(other.city)}, ${esc(other.country)} · ${esc(other.timezone)}</small></div><button class="chat-head-action" data-invite-id="${other.id}">Пригласить в проект</button></div><div class="business-prompts"><button type="button" data-prompt="Предлагаю коротко обсудить цели, сроки и ожидаемый результат сотрудничества.">Обсудить условия</button><button id="scheduleMeeting" type="button">📅 Назначить встречу</button><button type="button" data-prompt="Могу отправить краткое описание проекта и предполагаемую роль в команде.">Описать проект</button></div><div class="chat-body"><div class="icebreaker">Тема для старта: как ваши компетенции могут дополнить друг друга в одном небольшом проекте?</div>${dialog.texts.map((message) => `<div class="bubble ${message.from === currentUser.id ? 'mine' : ''}">${esc(message.text)}<small>${esc(message.time)}</small></div>`).join('')}</div><form id="chatForm" class="chat-form"><div class="emoji-wrap"><button id="emojiButton" class="emoji-button" type="button" aria-label="Добавить эмодзи">😊</button><div id="emojiPicker" class="emoji-picker hidden">${['👍','🤝','💼','📌','✅','💡','🚀','👏','🙂','🌏','📊','📅'].map((emoji) => `<button type="button" data-emoji="${emoji}">${emoji}</button>`).join('')}</div></div><input name="message" required autocomplete="off" placeholder="Написать сообщение..."><button class="button button--lime">Отправить</button></form>`;
  }
  $('#pageContent').innerHTML = `${pageHead(t('messagesKick'), t('messagesTitle'), t('messagesSub'))}<div class="chat-layout"><aside class="dialogs"><h3>Диалоги</h3>${list || '<div class="empty">Нет диалогов</div>'}</aside><section class="chat">${chat}</section></div>`;
  document.querySelectorAll('[data-dialog]').forEach((button) => button.addEventListener('click', () => renderMessages(Number(button.dataset.dialog))));
  document.querySelectorAll('[data-invite-id]').forEach((button) => button.addEventListener('click', () => showProjectInvite(Number(button.dataset.inviteId))));
  document.querySelectorAll('[data-prompt]').forEach((button) => button.addEventListener('click', () => {
    const input = $('#chatForm').elements.message; input.value = button.dataset.prompt; input.focus();
  }));
  $('#scheduleMeeting')?.addEventListener('click', () => showMeetingForm(dialog));
  $('#emojiButton')?.addEventListener('click', () => $('#emojiPicker').classList.toggle('hidden'));
  document.querySelectorAll('[data-emoji]').forEach((button) => button.addEventListener('click', () => {
    const input = $('#chatForm').elements.message; input.value += button.dataset.emoji; input.focus(); $('#emojiPicker').classList.add('hidden');
  }));
  $('#chatForm')?.addEventListener('submit', (event) => {
    event.preventDefault(); const input = event.target.elements.message; const text = input.value.trim(); if (!text) return;
    dialog.texts.push({ from: currentUser.id, text, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) });
    saveKollegiState(state); renderMessages(dialog.id);
  });
}

function showMeetingForm(dialog) {
  const other = account(dialog.users.find((id) => id !== currentUser.id));
  openModal(`<h2>Назначить встречу</h2><p class="muted">Часовой пояс ${esc(other.name)}: ${esc(other.timezone)}. Уточните время перед подтверждением.</p><form id="meetingForm" class="modal-form"><label class="field">Дата<input name="date" type="date" required></label><label class="field">Время<input name="time" type="time" required></label><label class="field">Формат<select name="format"><option>Видеозвонок</option><option>Телефонный звонок</option><option>Личная встреча</option></select></label><label class="field">Повестка<input name="agenda" required placeholder="Например, цели и роли в проекте"></label><button class="button button--primary" type="submit">Отправить приглашение <span>→</span></button></form>`);
  $('#meetingForm').addEventListener('submit', (event) => {
    event.preventDefault(); const form = new FormData(event.target);
    dialog.texts.push({ from: currentUser.id, text: `📅 Предлагаю встречу: ${form.get('date')} в ${form.get('time')} (${currentUser.timezone}). Формат: ${form.get('format')}. Повестка: ${form.get('agenda')}.`, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) });
    saveKollegiState(state); closeModal(); renderMessages(dialog.id); showToast('Приглашение на встречу отправлено');
  });
}

function renderProfile() {
  const countryOptions = Object.keys(KOLLEGI_COUNTRIES).map((country) => `<option ${country === currentUser.country ? 'selected' : ''}>${esc(country)}</option>`).join('');
  const cityOptions = (KOLLEGI_COUNTRIES[currentUser.country] || [currentUser.city]).map((city) => `<option ${city === currentUser.city ? 'selected' : ''}>${esc(city)}</option>`).join('');
  $('#pageContent').innerHTML = `${pageHead(t('profileKick'), t('profileTitle'), t('profileSub'))}
    <div class="profile-grid"><section class="panel profile-card">${avatar(currentUser)}<h2>${esc(currentUser.name)}</h2><p>📍 ${esc(currentUser.city)}, ${esc(currentUser.country)} · ${esc(currentUser.timezone)}</p><span class="tag">${esc(currentUser.status)}</span><div class="profile-score"><div><b>${currentUser.impact}</b><small>индекс пользы</small></div><div><b>${currentUser.reliability}%</b><small>надёжность</small></div></div><div class="profile-business"><small>МОЙ БИЗНЕС-ЗАПРОС</small><b>${esc(currentUser.businessGoal)}</b><span>${esc(currentUser.market)} · ${esc(currentUser.projectStage)} · ${esc(currentUser.budget)}</span></div><p>${esc(currentUser.bio)}</p><div class="profile-languages">💬 ${currentUser.languages.map(esc).join(' · ')}</div></section>
    <form id="profileForm" class="panel profile-form"><h2>Деловой профиль</h2><div class="form-section-title">Основная информация</div><div class="form-grid"><label class="field">Имя<input name="name" value="${esc(currentUser.name)}" required></label><label class="field">Сфера<input name="area" value="${esc(currentUser.area)}"></label><label class="field">Страна<select id="profileCountry" name="country">${countryOptions}</select></label><label class="field">Город<select id="profileCity" name="city">${cityOptions}</select></label><label class="field">Часовой пояс<input name="timezone" value="${esc(currentUser.timezone)}" placeholder="UTC+3"></label><label class="field">Рынок<select name="market">${['Россия и СНГ','ЕАЭС','Центральная Азия','Китай и Юго-Восточная Азия','Международный'].map((market) => `<option ${market === currentUser.market ? 'selected' : ''}>${market}</option>`).join('')}</select></label><label class="field">Формат сотрудничества<select name="cooperation">${['Партнёрство','Соосновательство','Проектная работа','Консультации','Экспертная поддержка'].map((format) => `<option ${format === currentUser.cooperation ? 'selected' : ''}>${format}</option>`).join('')}</select></label><label class="field">Стадия проекта<select name="projectStage">${['Проверка идеи','MVP','Первые продажи','Масштабирование','Выход на рынок'].map((stage) => `<option ${stage === currentUser.projectStage ? 'selected' : ''}>${stage}</option>`).join('')}</select></label></div><div class="form-section-title">Цели и компетенции</div><div class="form-grid"><label class="field field--wide">Бизнес-запрос<input name="businessGoal" value="${esc(currentUser.businessGoal)}" placeholder="Какую задачу вы хотите решить?"></label><label class="field">Бюджет или гонорар<input name="budget" value="${esc(currentUser.budget)}" placeholder="Например, до 300 000 ₽"></label><label class="field">Тип мышления<select name="role">${['Аналитик','Генератор идей','Исполнитель','Стратег','Эмпат-коммуникатор'].map((role) => `<option ${role === currentUser.role ? 'selected' : ''}>${role}</option>`).join('')}</select></label><label class="field field--wide">О себе<textarea name="bio">${esc(currentUser.bio)}</textarea></label><label class="field field--wide">Навыки через запятую<input name="skills" value="${esc(currentUser.skills.join(', '))}"></label></div><div class="form-section-title">Язык и коммуникация</div><div class="form-grid"><label class="field">Язык интерфейса<select name="interfaceLanguage">${KOLLEGI_UI_LANGUAGES.map((language) => `<option value="${language.code}" ${language.code === currentUser.interfaceLanguage ? 'selected' : ''}>${language.label}</option>`).join('')}</select></label><label class="field">Языки общения<input name="languages" value="${esc(currentUser.languages.join(', '))}" placeholder="Русский, English, 中文"></label></div><button class="button button--primary" style="margin-top:24px" type="submit">Сохранить изменения <span>→</span></button></form></div>`;
  $('#profileCountry').addEventListener('change', (event) => {
    $('#profileCity').innerHTML = KOLLEGI_COUNTRIES[event.target.value].map((city) => `<option>${esc(city)}</option>`).join('');
  });
  $('#profileForm').addEventListener('submit', (event) => {
    event.preventDefault(); const form = new FormData(event.target);
    ['name','city','country','area','role','bio','businessGoal','cooperation','interfaceLanguage','timezone','market','budget','projectStage'].forEach((key) => currentUser[key] = form.get(key).trim());
    currentUser.skills = form.get('skills').split(',').map((skill) => skill.trim()).filter(Boolean).slice(0, 15);
    currentUser.languages = form.get('languages').split(',').map((language) => language.trim()).filter(Boolean).slice(0, 6);
    currentUser.initials = currentUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    saveKollegiState(state); $('#sideName').textContent = currentUser.name; $('#sideAvatar').textContent = currentUser.initials; updateShellLanguage(); showToast('Профиль сохранён'); renderProfile();
  });
}

function showPerson(id) {
  const user = account(id);
  openModal(`<div class="profile-card">${avatar(user)}<h2>${esc(user.name)}</h2><p>${esc(user.area)} · ${esc(user.city)}, ${esc(user.country)}</p><span class="tag">${esc(user.cooperation)}</span><div class="profile-score"><div><b>${user.impact}</b><small>индекс пользы</small></div><div><b>${user.reliability}%</b><small>надёжность</small></div></div><div class="profile-business"><small>БИЗНЕС-ЗАПРОС</small><b>${esc(user.businessGoal)}</b></div><p>${esc(user.bio)}</p><div class="tags">${user.skills.map((skill) => `<span class="tag">${esc(skill)}</span>`).join('')}</div><div class="profile-languages">💬 ${user.languages.map(esc).join(' · ')}</div><div class="profile-modal-actions"><button class="button button--soft" data-invite-modal="${user.id}">Пригласить в проект</button><button class="button button--lime" data-connect-modal="${user.id}">Начать диалог</button></div></div>`);
  $('[data-connect-modal]').addEventListener('click', () => { closeModal(); connect(user.id); });
  $('[data-invite-modal]').addEventListener('click', () => showProjectInvite(user.id));
}

function showProjectInvite(userId) {
  const user = account(userId);
  const projects = state.projects.filter((project) => project.members.includes(currentUser.id));
  if (!projects.length) {
    closeModal();
    return showToast('Сначала создайте свой проект');
  }
  openModal(`<h2>Пригласить в проект</h2><p class="muted">Выберите проект для ${esc(user.name)}.</p><div class="invite-list">${projects.map((project) => {
    const joined = project.members.includes(user.id);
    return `<button class="invite-project ${joined ? 'joined' : ''}" data-invite-project="${project.id}" ${joined ? 'disabled' : ''}><span><b>${esc(project.title)}</b><small>${project.members.length} участника · срок ${esc(project.deadline)}</small></span><strong>${joined ? 'Уже в команде' : 'Пригласить →'}</strong></button>`;
  }).join('')}</div>`);
  document.querySelectorAll('[data-invite-project]').forEach((button) => button.addEventListener('click', () => inviteToProject(Number(button.dataset.inviteProject), user.id)));
}

function inviteToProject(projectId, userId) {
  const project = state.projects.find((item) => item.id === projectId);
  const user = account(userId);
  if (!project || project.members.includes(userId)) return;
  project.members.push(userId);
  let dialog = state.messages.find((item) => item.users.includes(currentUser.id) && item.users.includes(userId));
  if (!dialog) {
    dialog = { id: Date.now(), users: [currentUser.id, userId], texts: [] };
    state.messages.unshift(dialog);
  }
  dialog.texts.push({ from: currentUser.id, text: `Приглашаю вас в проект «${project.title}». Буду рад(а) обсудить вашу роль в команде!`, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) });
  saveKollegiState(state);
  closeModal();
  showToast(`${user.name} приглашён(а) в проект`);
}

function connect(userId) {
  let dialog = state.messages.find((item) => item.users.includes(currentUser.id) && item.users.includes(userId));
  if (!dialog) {
    dialog = { id: Date.now(), users: [currentUser.id, userId], texts: [] };
    state.messages.unshift(dialog); saveKollegiState(state); showToast('Мэтч создан. Начните разговор!');
  }
  navigate('messages'); renderMessages(dialog.id);
}

function bindCommonActions() {
  document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.go)));
}

document.querySelectorAll('#mainNav button, #mobileNav button, .profile-mini').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.page)));
$('#logoutButton').addEventListener('click', () => { sessionStorage.removeItem('kollegiUser'); location.reload(); });
$('#menuButton').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#modalClose').addEventListener('click', closeModal);
$('#modal').addEventListener('click', (event) => { if (event.target === $('#modal')) closeModal(); });
$('#globalSearch').addEventListener('input', () => {
  clearTimeout($('#globalSearch').searchTimer);
  $('#globalSearch').searchTimer = setTimeout(() => { if (currentPage === 'matches') renderMatches(); }, 250);
});
$('#globalSearch').addEventListener('keydown', (event) => { if (event.key === 'Enter') { navigate('matches'); showToast(`Результаты по запросу «${event.target.value}»`); } });
$('#quickLanguage').addEventListener('change', (event) => {
  if (!currentUser) return;
  currentUser.interfaceLanguage = event.target.value;
  saveKollegiState(state);
  updateShellLanguage();
  navigate(currentPage);
});
$('.help-button').addEventListener('click', showSupportForm);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
initLogin();
