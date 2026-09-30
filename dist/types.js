const categories = ['全部','策略','推理','欢乐','卡牌','合作','家庭'];
const filters = document.getElementById('filters');
const typeSearch = document.getElementById('typeSearch');
const grid = document.getElementById('gameGrid');
const count = document.getElementById('typeCount');
const emptyMessage = document.getElementById('emptyMessage');
let selected = '全部';

filters.innerHTML = categories.map(category => `<button class="${category === selected ? 'active' : ''}" type="button" data-filter="${category}" aria-pressed="${category === selected}">${category}</button>`).join('');
function render() {
  const query = typeSearch.value.trim().toLocaleLowerCase();
  const visible = BoardGames.filter(game => (selected === '全部' || game.category === selected) && (!query || `${game.name} ${game.en} ${game.keywords}`.toLocaleLowerCase().includes(query)));
  grid.innerHTML = visible.map(boardGameCard).join('');
  count.textContent = `${selected} · ${visible.length} 款桌游`;
  emptyMessage.hidden = visible.length > 0;
}
filters.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  selected = button.dataset.filter;
  filters.querySelectorAll('button').forEach(item => { const active = item === button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
  render();
});
typeSearch.addEventListener('input',render);
grid.addEventListener('click', event => { const card = event.target.closest('[data-game]'); if (card) location.href = `./game.html?game=${encodeURIComponent(card.dataset.game)}&from=types`; });
document.getElementById('backHome').addEventListener('click', () => { location.href = './index.html'; });
render();
