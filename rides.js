const toast = document.getElementById('toast');
const highlightId = new URLSearchParams(location.search).get('highlight');
let toastTimer;
const PROFILE_KEY = 'play_board_game_profile_v1';
const avatarFile = document.getElementById('avatarFile');
const profileDialog = document.getElementById('profileDialog');
const profileBackdrop = document.getElementById('profileBackdrop');
let profile = { nickname: '用户昵称', avatar: '' };

try {
  const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  if (typeof saved.nickname === 'string' && saved.nickname.trim()) profile.nickname = saved.nickname.trim().slice(0, 16);
  if (typeof saved.avatar === 'string' && saved.avatar.startsWith('data:image/')) profile.avatar = saved.avatar;
} catch (_) {}

function renderProfile() {
  document.getElementById('profileName').textContent = profile.nickname;
  document.getElementById('nicknameInput').value = profile.nickname;
  for (const prefix of ['avatar', 'dialogAvatar']) {
    const image = document.getElementById(`${prefix}Image`);
    const fallback = document.getElementById(`${prefix}Fallback`);
    image.hidden = !profile.avatar;
    fallback.hidden = Boolean(profile.avatar);
    if (profile.avatar) image.src = profile.avatar;
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    renderProfile();
    return true;
  } catch (_) {
    showToast('保存失败，请换一张较小的头像再试');
    return false;
  }
}

function openProfileDialog() {
  renderProfile();
  profileDialog.hidden = false;
  profileBackdrop.hidden = false;
  document.getElementById('nicknameInput').focus();
}

function closeProfileDialog() {
  profileDialog.hidden = true;
  profileBackdrop.hidden = true;
}

document.getElementById('profileAvatar').addEventListener('click', () => avatarFile.click());
document.getElementById('dialogAvatar').addEventListener('click', () => avatarFile.click());
document.getElementById('resetAvatar').addEventListener('click', () => {
  profile.avatar = '';
  if (saveProfile()) showToast('已恢复默认头像');
});
document.getElementById('editProfile').addEventListener('click', openProfileDialog);
document.getElementById('cancelProfile').addEventListener('click', closeProfileDialog);
profileBackdrop.addEventListener('click', closeProfileDialog);
document.getElementById('saveProfile').addEventListener('click', () => {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (!nickname) { showToast('请输入昵称'); return; }
  profile.nickname = nickname.slice(0, 16);
  if (saveProfile()) { closeProfileDialog(); showToast('个人资料已保存'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !profileDialog.hidden) closeProfileDialog();
});
avatarFile.addEventListener('change', () => {
  const file = avatarFile.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('请选择图片文件'); return; }
  const objectUrl = URL.createObjectURL(file);
  const source = new Image();
  source.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    const side = Math.min(source.naturalWidth, source.naturalHeight);
    context.drawImage(source, (source.naturalWidth - side) / 2, (source.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
    URL.revokeObjectURL(objectUrl);
    profile.avatar = canvas.toDataURL('image/jpeg', 0.84);
    if (saveProfile()) showToast('头像已更新');
    avatarFile.value = '';
  };
  source.onerror = () => { URL.revokeObjectURL(objectUrl); showToast('这张图片无法打开，请换一张'); };
  source.src = objectUrl;
});
renderProfile();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1900);
}

const contactDialog = document.getElementById('contactDialog');
const contactBackdrop = document.getElementById('contactBackdrop');
let contactWechatId = '';
function closeContact() { contactDialog.hidden = true; contactBackdrop.hidden = true; }
function openContact(ride) {
  contactWechatId = ride.wechatId || 'panda_boardgame';
  document.getElementById('contactRideName').textContent = ride.teamName;
  document.getElementById('contactWechat').textContent = contactWechatId;
  document.getElementById('contactNote').textContent = ride.contactIsDemo || !ride.wechatId
    ? '这是示例局主的演示微信号，不是真实联系方式。实际约局请由局主填写自己的微信号。'
    : '复制微信号后，可到微信中搜索并联系这场约局的局主。这里不会自动发送微信消息。';
  contactBackdrop.hidden = false;
  contactDialog.hidden = false;
  document.getElementById('copyContact').focus();
}
document.getElementById('closeContact').addEventListener('click', closeContact);
contactBackdrop.addEventListener('click', closeContact);
document.getElementById('copyContact').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(contactWechatId); showToast('微信号已复制，可到微信中搜索'); }
  catch (_) { showToast('复制失败，请长按微信号手动复制'); }
});

const gameMeta = {
  ship: { icon: '⛵', label: '险恶迷航', crop: 'ship' },
  night: { icon: '🌙', label: '血染之夜', crop: 'night' },
  circus: { icon: '🎪', label: '害羞迁徙协会' },
  wizard: { icon: '🧙', label: '出包魔法师' },
  ninja: { icon: '🥷', label: '忍者之夜' },
  uno: { icon: '🃏', label: 'UNO', crop: 'uno' },
  gem: { icon: '💎', label: '璀璨宝石' },
  werewolf: { icon: '🐺', label: '狼人杀' },
  catan: { icon: '🏝️', label: '卡坦岛' },
  detective: { icon: '🔎', label: '侦探推理' },
  carcassonne: { icon: '🏰', label: '卡卡颂' },
  dixit: { icon: '🎨', label: '妙语说书人' },
  codenames: { icon: '🕵️', label: '行动代号' },
  dobble: { icon: '🔔', label: '德国心脏病' },
  azul: { icon: '🔷', label: '花砖物语' },
  sushi: { icon: '🍣', label: '寿司派对' },
  avalon: { icon: '🛡️', label: '阿瓦隆' }
};

function coverMarkup(ride) {
  const meta = gameMeta[ride.game] || { icon: BoardGameByKey[ride.game]?.icon || '🎲', label: ride.gameName || '桌游' };
  if (meta.crop) {
    return `<div class="ride-cover crop-${meta.crop}" role="img" aria-label="${ride.gameName}封面"></div>`;
  }
  return `<div class="ride-cover illustrated" role="img" aria-label="${ride.gameName}封面"><span>${meta.icon}</span><b>${meta.label}</b></div>`;
}

function card(ride, mode) {
  const dateText = ride.date.replace(/^(\d{4})\.(\d+)\.(\d+)$/, '$1年$2月$3日');
  const checkInStart = RideStore.startTime(ride);
  const canCheckIn = mode === 'joined' && !ride.attendedAt && checkInStart &&
    Date.now() >= checkInStart.getTime() - 15 * 60 * 1000 &&
    Date.now() <= new Date(checkInStart.getFullYear(), checkInStart.getMonth(), checkInStart.getDate(), ...ride.end.split(':').map(Number)).getTime();
  const actions = mode === 'owner'
    ? `<button data-action="detail" data-id="${ride.id}">查看详情</button><button data-action="edit" data-id="${ride.id}">编辑约局</button><button data-action="cancel" data-id="${ride.id}" class="danger">取消约局</button>`
    : `<button data-action="detail" data-id="${ride.id}">查看详情</button><button data-action="leave" data-id="${ride.id}" class="danger">退出约局</button>${canCheckIn ? `<button data-action="checkin" data-id="${ride.id}">确认到场</button>` : `<button data-action="contact" data-id="${ride.id}">联系局主</button>`}`;
  return `<article class="ride-card${highlightId === ride.id ? ' highlighted' : ''}" data-ride-id="${ride.id}">
    <div class="card-head"><strong>${ride.teamName}</strong><span><i></i>${ride.attendedAt ? '已到场' : mode === 'owner' ? (ride.demo || ride.teamName === '险恶迷航新手局' && ride.min === 3 && ride.max === 5 ? '示例约局' : '招募中') : '已加入'}</span></div>
    <div class="ride-body">${coverMarkup(ride)}<div class="ride-copy">
      <p><b>桌游：</b>${ride.gameName}</p><p><b>时间：</b>${dateText}<br>${ride.start}–${ride.end}</p>
      <p><b>活动地点：</b>${ride.location}</p><p><b>人数：</b>${ride.current}/${ride.max}</p>
    </div></div>
    <div class="actions">${actions}</div>
  </article>`;
}

function render() {
  document.getElementById('creditScore').textContent = RideStore.creditScore();
  const initiated = RideStore.initiated();
  const joined = RideStore.joined();
  document.getElementById('initiatedList').innerHTML = initiated.length ? initiated.map(ride => card(ride, 'owner')).join('') : '<div class="empty-state">还没有发起约局<br><a href="./create.html">去发起拼车</a></div>';
  document.getElementById('joinedList').innerHTML = joined.length ? joined.map(ride => card(ride, 'joined')).join('') : '<div class="empty-state">还没有参与约局<br><a href="./plaza.html">去拼车广场看看</a></div>';
}

document.querySelector('.rides-page').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const ride = RideStore.get(button.dataset.id);
  if (!ride) { render(); return; }
  const action = button.dataset.action;
  if (action === 'detail') location.href = `./detail.html?game=${encodeURIComponent(ride.game)}&date=${encodeURIComponent(ride.date)}&ride=${encodeURIComponent(ride.id)}`;
  else if (action === 'edit') location.href = `./create.html?edit=${encodeURIComponent(ride.id)}`;
  else if (action === 'cancel') {
    const penalty = RideStore.exitPenalty(ride);
    if (!confirm(`确定取消这个约局吗？取消后将从前台列表移除。${penalty ? `距离开局不足 2 小时，将扣 ${penalty} 分信誉分。` : ''}`)) return;
    RideStore.archive(ride.id, '局主取消'); render(); showToast(penalty ? `已取消约局，信誉分 -${penalty}` : '约局已取消并转入后台归档');
  } else if (action === 'leave') {
    const penalty = RideStore.exitPenalty(ride);
    if (!confirm(`确定退出这个约局吗？${penalty ? `距离开局不足 2 小时，将扣 ${penalty} 分信誉分。` : ''}`)) return;
    RideStore.archive(ride.id, '用户退出'); render(); showToast(penalty ? `已退出约局，信誉分 -${penalty}` : '已退出约局，前台记录已移除');
  } else if (action === 'checkin') {
    if (RideStore.markAttended(ride.id)) { render(); showToast('已确认准时到场，信誉分保持不变'); }
    else showToast('仅可在开局前 15 分钟至结束前确认到场');
  } else if (action === 'contact') openContact(ride);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !contactDialog.hidden) closeContact(); });
window.addEventListener('rides:changed', render);
RideStore.ensureDemoInitiated();
render();
