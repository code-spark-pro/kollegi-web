const adminState = getKollegiState();
const adminEsc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const adminAccount = (id) => adminState.accounts.find((item) => item.id === Number(id));

function adminToast(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function adminAvatar(user) {
  return `<span class="avatar" style="background:${user.color}">${adminEsc(user.initials)}</span>`;
}

function enterAdmin() {
  document.querySelector('#adminLogin').classList.add('hidden');
  document.querySelector('#adminApp').classList.remove('hidden');
  renderAdmin('overview');
}

function adminHeader(title, subtitle) {
  return `<p class="eyebrow eyebrow--dark">Управление платформой</p><h1>${title}</h1><p class="muted">${subtitle}</p>`;
}

function renderAdmin(section) {
  document.querySelectorAll('#adminNav button').forEach((button) => button.classList.toggle('active', button.dataset.section === section));
  if (section === 'overview') renderOverview();
  if (section === 'users') renderUsers();
  if (section === 'ideas') renderAdminIdeas();
  if (section === 'moderation') renderModeration();
  if (section === 'support') renderSupport();
}

function renderOverview() {
  const page = document.querySelector('#adminPage');
  const blockedCount = (adminState.blocked || []).length;
  const openSupport = (adminState.support || []).filter((ticket) => ticket.status !== 'Закрыт').length;
  const projectsWithProgress = adminState.projects.filter((project) => project.progress > 0).length;
  page.innerHTML = `${adminHeader('Обзор платформы', 'Ключевые показатели и активность тестового сообщества.')}
    <div class="admin-metrics"><div class="metric"><span>Участников</span><b>${adminState.accounts.length - blockedCount}</b><small>${blockedCount} заблокировано</small></div><div class="metric"><span>Активных идей</span><b>${adminState.ideas.length}</b><small>${adminState.ideas.reduce((sum, idea) => sum + idea.comments, 0)} комментариев</small></div><div class="metric"><span>Проектов</span><b>${projectsWithProgress}</b><small>${adminState.projects.length} всего</small></div><div class="metric"><span>Открытые обращения</span><b>${openSupport}</b><small>нужна обработка</small></div></div>
    <div class="admin-grid"><section class="admin-panel"><h2>Последние события</h2><div class="activity"><span class="activity-mark">✦</span><div><p><b>Новая идея:</b> «${adminEsc(adminState.ideas[0]?.title)}»</p><small>12 минут назад</small></div></div><div class="activity"><span class="activity-mark">◇</span><div><p><b>Новый мэтч:</b> Анна и Максим начали диалог</p><small>38 минут назад</small></div></div><div class="activity"><span class="activity-mark">✓</span><div><p><b>Задача завершена</b> в проекте «Навигатор профессий»</p><small>1 час назад</small></div></div></section>
    <section class="admin-panel"><h2>Сферы участников</h2>${adminState.accounts.map((user, index) => `<div class="bar-row"><div><span>${adminEsc(user.area)}</span><b>${20 - index * 2}%</b></div><div class="mini-bar"><span style="width:${90 - index * 11}%"></span></div></div>`).join('')}</section></div>`;
}

function renderUsers() {
  const blocked = adminState.blocked || [];
  document.querySelector('#adminPage').innerHTML = `${adminHeader('Участники', 'Пять личных кабинетов, созданных для этапа разработки.')}
    <div class="admin-toolbar"><input id="adminUserSearch" placeholder="Поиск по имени, городу, стране или сфере"><select id="adminUserStatus"><option value="">Все статусы</option><option value="active">Активные</option><option value="blocked">Заблокированные</option></select></div><div id="usersTable" class="table-wrap"></div>`;
  const drawUsers = () => {
    const query = document.querySelector('#adminUserSearch').value.toLowerCase().trim();
    const status = document.querySelector('#adminUserStatus').value;
    const users = adminState.accounts.filter((user) => { const isBlocked = blocked.includes(user.id); const haystack = [user.name, user.login, user.area, user.city, user.country].join(' ').toLowerCase(); return (!query || haystack.includes(query)) && (!status || (status === 'blocked' ? isBlocked : !isBlocked)); });
    document.querySelector('#usersTable').innerHTML = `<table class="admin-table"><thead><tr><th>Пользователь</th><th>Логин</th><th>География</th><th>Сфера</th><th>Надёжность</th><th>Статус</th><th>Действие</th></tr></thead><tbody>${users.map((user) => `<tr><td><div class="user-cell">${adminAvatar(user)}<b>${adminEsc(user.name)}</b></div></td><td>${adminEsc(user.login)}</td><td>${adminEsc(user.city)}, ${adminEsc(user.country)}</td><td>${adminEsc(user.area)}</td><td>${user.reliability}%</td><td><span class="status-dot ${blocked.includes(user.id) ? 'blocked' : ''}"></span>${blocked.includes(user.id) ? 'Заблокирован' : 'Активен'}</td><td><button class="small-action ${blocked.includes(user.id) ? '' : 'danger'}" data-toggle-user="${user.id}">${blocked.includes(user.id) ? 'Разблокировать' : 'Заблокировать'}</button></td></tr>`).join('') || '<tr><td colspan="7" class="empty-admin">Ничего не найдено</td></tr>'}</tbody></table>`;
    document.querySelectorAll('[data-toggle-user]').forEach((button) => button.addEventListener('click', () => { const id = Number(button.dataset.toggleUser); adminState.blocked ||= []; if (adminState.blocked.includes(id)) adminState.blocked = adminState.blocked.filter((item) => item !== id); else adminState.blocked.push(id); saveKollegiState(adminState); renderUsers(); adminToast('Статус участника изменён'); }));
  };
  drawUsers();
  document.querySelector('#adminUserSearch').addEventListener('input', drawUsers);
  document.querySelector('#adminUserStatus').addEventListener('change', drawUsers);
}

function renderAdminIdeas() {
  document.querySelector('#adminPage').innerHTML = `${adminHeader('Идеи', 'Просмотр и модерация публикаций Idea Hub.')}<section class="admin-panel" style="margin-top:28px">${adminState.ideas.map((idea) => { const author = adminAccount(idea.authorId); return `<div class="admin-idea"><div><span class="idea-stage">${adminEsc(idea.stage)}</span><h3>${adminEsc(idea.title)}</h3><p>${adminEsc(author.name)} · ${idea.lights} подсветок · ${idea.comments} комментариев</p></div><button class="small-action danger" data-delete-idea="${idea.id}">Удалить</button></div>`; }).join('') || '<div class="empty-admin">Нет опубликованных идей</div>'}</section>`;
  document.querySelectorAll('[data-delete-idea]').forEach((button) => button.addEventListener('click', () => {
    if (!confirm('Удалить эту идею?')) return;
    adminState.ideas = adminState.ideas.filter((idea) => idea.id !== Number(button.dataset.deleteIdea)); saveKollegiState(adminState); renderAdminIdeas(); adminToast('Идея удалена');
  }));
}

function renderModeration() {
  const reports = adminState.reports || [];
  const blocked = (adminState.blocked || []).length;
  const resolved = reports.filter((report) => report.status === 'Закрыта').length;
  document.querySelector('#adminPage').innerHTML = `${adminHeader('Модерация', 'Жалобы, безопасность общения и контроль сообщества.')}<div class="admin-metrics"><div class="metric"><span>Открытые жалобы</span><b>${reports.length - resolved}</b></div><div class="metric"><span>Рассмотрено</span><b>${resolved}</b></div><div class="metric"><span>Заблокировано</span><b>${blocked}</b></div><div class="metric"><span>Всего сигналов</span><b>${reports.length}</b></div></div><section class="admin-panel"><h2>Очередь проверки</h2>${reports.length ? reports.map((report) => `<div class="activity"><span class="activity-mark">!</span><p>${adminEsc(report.text)}</p></div>`).join('') : '<div class="empty-admin">Новых жалоб нет. Всё спокойно.</div>'}</section>`;
}

function renderSupport() {
  const tickets = adminState.support || [];
  document.querySelector('#adminPage').innerHTML = `${adminHeader('Поддержка', 'Обращения пользователей и контроль времени ответа.')}<div class="admin-metrics"><div class="metric"><span>Всего обращений</span><b>${tickets.length}</b></div><div class="metric"><span>Открытые</span><b>${tickets.filter((ticket) => ticket.status === 'Открыт').length}</b></div><div class="metric"><span>В работе</span><b>${tickets.filter((ticket) => ticket.status === 'В работе').length}</b></div><div class="metric"><span>SLA</span><b>8ч</b></div></div><section class="admin-panel support-list"><h2>Очередь обращений</h2>${tickets.length ? tickets.map((ticket) => { const user = adminAccount(ticket.userId); return `<div class="support-ticket"><div><span class="priority ${ticket.priority === 'Высокий' ? 'high' : ''}">${adminEsc(ticket.priority)}</span><h3>${adminEsc(ticket.topic)}</h3><p>${adminEsc(user.name)} · ${adminEsc(ticket.created)}</p></div><select data-ticket-status="${ticket.id}"><option ${ticket.status === 'Открыт' ? 'selected' : ''}>Открыт</option><option ${ticket.status === 'В работе' ? 'selected' : ''}>В работе</option><option ${ticket.status === 'Закрыт' ? 'selected' : ''}>Закрыт</option></select></div>`; }).join('') : '<div class="empty-admin">Новых обращений нет</div>'}</section>`;
  document.querySelectorAll('[data-ticket-status]').forEach((select) => select.addEventListener('change', () => { const ticket = adminState.support.find((item) => item.id === Number(select.dataset.ticketStatus)); ticket.status = select.value; saveKollegiState(adminState); renderSupport(); adminToast('Статус обращения обновлён'); }));
}

document.querySelector('#adminLoginForm').addEventListener('submit', (event) => {
  event.preventDefault(); const form = new FormData(event.target);
  if (form.get('login') !== 'admin' || form.get('password') !== 'admin123') return adminToast('Неверные данные администратора');
  sessionStorage.setItem('kollegiAdmin', 'true'); enterAdmin();
});
document.querySelectorAll('#adminNav button').forEach((button) => button.addEventListener('click', () => renderAdmin(button.dataset.section)));
document.querySelector('#adminLogout').addEventListener('click', () => { sessionStorage.removeItem('kollegiAdmin'); location.reload(); });
if (sessionStorage.getItem('kollegiAdmin') === 'true') enterAdmin();
