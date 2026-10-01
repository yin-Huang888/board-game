const input = document.getElementById('searchInput');
const grid = document.getElementById('gameGrid');
const count = document.getElementById('resultCount');
const empty = document.getElementById('emptyMessage');
const clear = document.getElementById('clearSearch');
const params = new URLSearchParams(location.search);
const discoverMode = params.get('mode') === 'discover';
input.value = params.get('q') || '';

function render() {
  const query = input.value.trim().toLocaleLowerCase();
  const matches = BoardGames.filter(game => !query || `${game.name} ${game.en} ${game.category} ${game.keywords}`.toLocaleLowerCase().includes(query));
  grid.innerHTML = matches.map(boardGameCard).join('');
  count.textContent = query ? `找到 ${matches.length} 款相关桌游` : `共 ${BoardGames.length} 款桌游，输入名称或类型可以筛选`;
  empty.hidden = matches.length > 0;
  clear.hidden = !input.value;
}

document.getElementById('searchForm').addEventListener('submit', event => { event.preventDefault(); input.blur(); render(); });
input.addEventListener('input', render);
clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
grid.addEventListener('click', event => {
  const card = event.target.closest('[data-game]');
  if (!card) return;
  if (discoverMode) location.href = `./game.html?game=${encodeURIComponent(card.dataset.game)}`;
  else {
    sessionStorage.setItem('selectedGame', card.dataset.game);
    const edit = params.get('edit');
    location.href = `./create.html?game=${encodeURIComponent(card.dataset.game)}${edit ? `&edit=${encodeURIComponent(edit)}` : ''}`;
  }
});
document.getElementById('bottomAction').addEventListener('click', () => { location.href = './create.html'; });
render();
