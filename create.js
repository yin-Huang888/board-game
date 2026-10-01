const gameInfo = BoardGameByKey;
const $ = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const editingId = query.get('edit');
let currentPicker = '';
let toastTimer;

function showToast(text) {
  $('toast').textContent = text;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2100);
}

function dateOptions() {
  const list = [];
  const start = new Date();
  for (let index = 0; index < 14; index += 1) {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    list.push({value:`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`,label:`${date.getMonth()+1}月${date.getDate()}日`});
  }
  return list;
}

function selectMarkup(id, items, value) {
  return `<select id="${id}" size="5">${items.map(item => `<option value="${item.value ?? item}" ${(item.value ?? item) == value ? 'selected' : ''}>${item.label ?? item}</option>`).join('')}</select>`;
}

function openPicker(kind) {
  currentPicker = kind;
  $('pickerTitle').textContent = {date:'选择日期',start:'选择开始时间',end:'选择结束时间',min:'最少招募人数',max:'最多招募人数'}[kind];
  if (kind === 'date') {
    $('wheelArea').innerHTML = selectMarkup('wheelDate', dateOptions(), $('dateField').textContent);
  } else if (kind === 'start' || kind === 'end') {
    const current = $(kind === 'start' ? 'startField' : 'endField').textContent.split(':');
    $('wheelArea').innerHTML = selectMarkup('wheelHour', Array.from({length:24},(_,i)=>String(i).padStart(2,'0')), current[0]) + selectMarkup('wheelMinute',['00','15','30','45'],current[1]);
  } else {
    const current = parseInt($(kind === 'min' ? 'minField' : 'maxField').textContent.match(/\d+/)?.[0] || 5);
    $('wheelArea').innerHTML = selectMarkup('wheelCount', Array.from({length:12},(_,i)=>i+1), current);
  }
  $('pickerBackdrop').hidden = false;
  $('pickerSheet').hidden = false;
}

function closePicker() { $('pickerBackdrop').hidden = true; $('pickerSheet').hidden = true; }
document.querySelectorAll('[data-picker]').forEach(button => button.addEventListener('click', () => openPicker(button.dataset.picker)));
$('cancelPicker').addEventListener('click', closePicker);
$('pickerBackdrop').addEventListener('click', closePicker);
$('confirmPicker').addEventListener('click', () => {
  if (currentPicker === 'date') $('dateField').textContent = $('wheelDate').value;
  else if (currentPicker === 'start' || currentPicker === 'end') $(currentPicker === 'start' ? 'startField' : 'endField').textContent = `${$('wheelHour').value}:${$('wheelMinute').value}`;
  else $(currentPicker === 'min' ? 'minField' : 'maxField').textContent = `${currentPicker === 'min' ? '最少' : '最多'}${$('wheelCount').value}人`;
  closePicker();
});

$('gamePicker').addEventListener('click', () => { location.href = `./search.html?mode=create${editingId ? `&edit=${encodeURIComponent(editingId)}` : ''}`; });

const locationField = $('locationField');
const customLocation = $('customLocation');
locationField.addEventListener('change', () => { customLocation.hidden = locationField.value !== 'custom'; if (!customLocation.hidden) customLocation.focus(); });
function selectedLocation() { return locationField.value === 'custom' ? customLocation.value.trim() : locationField.value; }

function restoreGame(forcedKey) {
  const key = forcedKey || sessionStorage.getItem('selectedGame');
  if (!key || !gameInfo[key]) return;
  sessionStorage.setItem('selectedGame', key);
  const game = gameInfo[key];
  $('gamePlaceholder').hidden = true;
  $('pickedCover').hidden = false;
  $('pickedCover').className = `picked-cover cover-${key}`;
  $('teamName').textContent = game.name;
  if (!editingId) {
    const numbers = (game.players || '').match(/\d+/g)?.map(Number) || [];
    if (numbers.length) {
      const minimum = Math.max(2, numbers[0]);
      const maximum = Math.max(minimum, numbers[1] || numbers[0]);
      $('minField').textContent = `最少${minimum}人`;
      $('maxField').textContent = `最多${maximum}人`;
    }
  }
  const cover = $('pickedCover');
  if (!['ship','night','uno'].includes(key)) {
    cover.innerHTML = `<span>${game.icon}</span><b>${game.name}</b>`;
    cover.classList.add('illustrated-cover');
  } else cover.replaceChildren();
}

function loadEditingRide() {
  if (!editingId) {
    const today = new Date();
    $('dateField').textContent = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    restoreGame(query.get('game'));
    return;
  }
  const ride = RideStore.get(editingId);
  if (!ride || ride.owner !== 'me' || ride.state !== 'active') { restoreGame(); return; }
  restoreGame(query.get('game') || ride.game);
  $('dateField').textContent = ride.date;
  $('startField').textContent = ride.start;
  $('endField').textContent = ride.end;
  $('minField').textContent = `最少${ride.min}人`;
  $('maxField').textContent = `最多${ride.max}人`;
  $('introField').value = ride.intro || '';
  const preset = [...locationField.options].find(option => option.value === ride.location);
  locationField.value = preset ? preset.value : 'custom';
  customLocation.hidden = Boolean(preset);
  if (!preset) customLocation.value = ride.location || '';
  $('wechatField').value = ride.wechatId || '';
  $('startRideBtn').textContent = '保存修改';
  document.title = '编辑拼车';
}
loadEditingRide();

$('startRideBtn').addEventListener('click', () => {
  const gameKey = sessionStorage.getItem('selectedGame');
  if (!gameKey || !gameInfo[gameKey]) { showToast('请先选择一款桌游'); return; }
  const min = Number($('minField').textContent.match(/\d+/)?.[0]);
  const max = Number($('maxField').textContent.match(/\d+/)?.[0]);
  if (min > max) { showToast('最少人数不能大于最多人数'); return; }
  if ($('endField').textContent <= $('startField').textContent) { showToast('结束时间要晚于开始时间'); return; }
  if (!selectedLocation()) { showToast('请填写活动地点'); customLocation.focus(); return; }
  if (!$('wechatField').value.trim()) { showToast('请填写局主微信号，方便加入者联系'); $('wechatField').focus(); return; }
  const data = {
    game: gameKey, gameName: gameInfo[gameKey].name, teamName: $('teamName').textContent,
    date: $('dateField').textContent, start: $('startField').textContent, end: $('endField').textContent,
    location: selectedLocation(), wechatId: $('wechatField').value.trim(), min, max,
    intro: $('introField').value.trim() || '新手友好，局主会提前讲解游戏规则，欢迎大家准时参加。'
  };
  if (editingId && RideStore.get(editingId)) {
    RideStore.update(editingId, data);
    location.href = `./rides.html?highlight=${encodeURIComponent(editingId)}`;
    return;
  }
  const ride = RideStore.create(data);
  sessionStorage.setItem('lastCreatedRide', ride.id);
  location.href = `./success.html?game=${encodeURIComponent(gameKey)}&date=${encodeURIComponent(ride.date)}&ride=${encodeURIComponent(ride.id)}`;
});
