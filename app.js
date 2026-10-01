const games = [
  { key:'ship', name:'险恶迷航', icon:'⛵', meta:'5–8 人 · 推理冒险', type:'推理' },
  { key:'night', name:'血染之夜', icon:'🌙', meta:'6–15 人 · 阵营推理', type:'推理' },
  { key:'wizard', name:'出包魔法师', icon:'🧙', meta:'3–6 人 · 欢乐聚会', type:'欢乐' },
  { key:'ninja', name:'忍者之夜', icon:'🥷', meta:'4–8 人 · 阵营推理', type:'推理' },
  { key:'circus', name:'害羞迁徙协会', icon:'🎪', meta:'2–5 人 · 轻松欢乐', type:'欢乐' },
  { key:'uno', name:'UNO', icon:'🃏', meta:'2–10 人 · 卡牌', type:'卡牌' }
];

const el = (id) => document.getElementById(id);
const sheet = el('sheet');
const sheetBody = el('sheetBody');
const backdrop = el('backdrop');
const searchInput = el('searchInput');
const searchPanel = el('searchPanel');
const searchWrap = document.querySelector('.search-wrap');
let people = 4;
let toastTimer;

function toast(message) {
  const node = el('toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
}

function openSheet(title, kicker, html) {
  el('sheetTitle').textContent = title;
  el('sheetKicker').textContent = kicker;
  sheetBody.innerHTML = html;
  sheet.hidden = false;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => el('closeSheet').focus(), 10);
}

function closeSheet() {
  sheet.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

function choiceMarkup(items) {
  return `<div class="choice-grid">${items.map((item, i) => `<button class="choice${i === 0 ? ' selected' : ''}" type="button" data-choice="${item.title}"><strong>${item.icon} ${item.title}</strong><span>${item.sub}</span></button>`).join('')}</div>`;
}

function bookingControls(buttonText) {
  return `<span class="form-label">选择时段</span><div class="time-row"><button class="chip selected" type="button">今天 19:30</button><button class="chip" type="button">今天 21:00</button><button class="chip" type="button">明天 14:00</button></div><span class="form-label">期望人数</span><div class="counter"><span>本局总人数</span><div><button type="button" data-count="-1" aria-label="减少人数">−</button><strong id="peopleCount">${people} 人</strong><button type="button" data-count="1" aria-label="增加人数">＋</button></div></div><button class="primary-btn" type="button" data-confirm>${buttonText}</button>`;
}

function renderFlow(flow) {
  if (flow === 'nearby') {
    window.location.href = './plaza.html';
    return;
  }
  if (flow === 'type') {
    window.location.href = './types.html';
    return;
  }
  if (flow === 'create') {
    window.location.href = './create.html';
    return;
  }
  people = 4;
}

function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const results = games.filter(g => !query || `${g.name}${g.meta}${g.type}`.toLowerCase().includes(query));
  searchPanel.innerHTML = results.length ? results.map(g => `<button class="search-result" type="button" data-game="${g.key}"><span class="result-icon">${g.icon}</span><span class="result-copy"><strong>${g.name}</strong><small>${g.meta}</small></span><span class="result-add">＋</span></button>`).join('') : `<div class="empty">没找到这款桌游，换个名字试试吧</div>`;
  searchPanel.classList.add('open');
}

function openGameSearch() {
  const query = searchInput.value.trim();
  window.location.href = `./search.html?mode=discover&q=${encodeURIComponent(query)}`;
}

function showGame(name) {
  const game = games.find(g => g.name === name) || games[0];
  searchPanel.classList.remove('open');
  openSheet(game.name, '搜索结果', `<div class="game-detail"><div class="cover">${game.icon}</div><div><h3>${game.name}</h3><p>${game.meta}</p></div></div>${bookingControls('带上它发起约局')}`);
}

function showDetails() {
  openSheet('约局详情', '今晚可加入', `<div class="game-detail"><div class="cover">💎</div><div><h3>《璀璨宝石》轻策局</h3><p>新手友好，店内提供桌游和规则教学</p></div></div><ul class="info-list"><li><span>时间</span><strong>今天 19:30–21:30</strong></li><li><span>地点</span><strong>湖滨桌游馆 · 2楼</strong></li><li><span>人数</span><strong>2 / 4 人</strong></li><li><span>局长</span><strong>骰子不听话</strong></li></ul><button class="primary-btn" type="button" data-confirm>立即加入</button>`);
}

document.querySelectorAll('[data-flow]').forEach(btn => btn.addEventListener('click', () => renderFlow(btn.dataset.flow)));
el('detailBtn').addEventListener('click', () => { window.location.href = './rides.html'; });
el('closeSheet').addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);
el('searchBtn').addEventListener('click', openGameSearch);
document.querySelector('.search-box').addEventListener('click', e => {
  if (e.target === searchInput || e.target.closest('button')) return;
  searchInput.focus();
});
searchInput.addEventListener('focus', runSearch);
searchInput.addEventListener('input', () => { searchWrap.classList.toggle('has-value', !!searchInput.value); runSearch(); });
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') openGameSearch(); if (e.key === 'Escape') searchPanel.classList.remove('open'); });
el('clearSearch').addEventListener('click', () => { searchInput.value=''; searchWrap.classList.remove('has-value'); runSearch(); searchInput.focus(); });
searchPanel.addEventListener('click', e => {
  const item = e.target.closest('[data-game]');
  if (!item) return;
  window.location.href = `./game.html?game=${encodeURIComponent(item.dataset.game)}`;
});

sheetBody.addEventListener('click', e => {
  const choice = e.target.closest('[data-choice]');
  if (choice) { choice.parentElement.querySelectorAll('.choice').forEach(n => n.classList.remove('selected')); choice.classList.add('selected'); }
  const chip = e.target.closest('.chip');
  if (chip) { chip.parentElement.querySelectorAll('.chip').forEach(n => n.classList.remove('selected')); chip.classList.add('selected'); }
  const counter = e.target.closest('[data-count]');
  if (counter) { people = Math.max(2, Math.min(10, people + Number(counter.dataset.count))); const node = el('peopleCount'); if (node) node.textContent = `${people} 人`; }
  if (e.target.closest('[data-confirm]')) { closeSheet(); toast('约局已确认，记得准时赴约哦！'); }
});

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  if (item.dataset.nav !== '首页') toast(`${item.dataset.nav}功能已切换`);
}));

document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) searchPanel.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const safe = fn => { try { return fn(); } catch (error) { throw new Error(error.message || '操作失败'); } };
  context.registerTool({ name:'search_board_games', title:'搜索桌游', description:'按名称或类型搜索桌游，并在页面显示结果。', inputSchema:{ type:'object', properties:{ query:{type:'string'} }, required:['query'], additionalProperties:false }, annotations:{readOnlyHint:true,untrustedContentHint:false}, execute:({query}) => safe(() => { if(typeof query!=='string') throw new Error('query 必须是文本'); searchInput.value=query; searchWrap.classList.toggle('has-value',!!query); runSearch(); return {count:games.filter(g=>`${g.name}${g.meta}${g.type}`.toLowerCase().includes(query.toLowerCase())).length}; }) });
  context.registerTool({ name:'start_meetup_flow', title:'开始约局', description:'打开附近约局、桌游类型或发起拼桌流程。', inputSchema:{ type:'object', properties:{ mode:{type:'string',enum:['nearby','type','create']} }, required:['mode'], additionalProperties:false }, annotations:{readOnlyHint:false,untrustedContentHint:false}, execute:({mode}) => safe(() => { if(!['nearby','type','create'].includes(mode)) throw new Error('无效约局模式'); renderFlow(mode); return {status:'opened',mode}; }) });
  context.registerTool({ name:'open_my_rides', title:'查看我的约局', description:'打开个人资料以及我发起、参与的约局。', inputSchema:{type:'object',properties:{},additionalProperties:false}, annotations:{readOnlyHint:true,untrustedContentHint:false}, execute:() => { window.location.href = './rides.html'; return {status:'opened'}; } });
}
registerWebMCP();
