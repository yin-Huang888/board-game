const gameData = {
  ship:{id:'ship',name:'险恶迷航',time:'13:00–15:00',players:2,max:5,review:'审核',className:'ship',full:false},
  circus:{id:'circus',name:'害羞迁徙协会',time:'13:00–15:00',players:2,max:5,review:'免审核',className:'circus',full:false},
  night:{id:'night',name:'血染之夜',time:'09:00–11:00',players:6,max:6,review:'审核',className:'night',full:true}
};
const extraSymbols = {gem:'💎',werewolf:'🐺',carcassonne:'🏰',dixit:'🎨',codenames:'🕵️',dobble:'🔔',azul:'🔷',sushi:'🍣',avalon:'🛡️'};
const schedules = {1:{open:['ship','circus'],closed:['night']},2:{open:['circus','ship'],closed:['night']},3:{open:['ship'],closed:['night']},4:{open:['circus','ship'],closed:['night']},5:{open:['ship','circus'],closed:['night']},6:{open:['circus'],closed:['night']},0:{open:['ship'],closed:[]}};
const monday = (() => { const now=new Date(); const day=now.getDay()||7; const date=new Date(now); date.setHours(12,0,0,0); date.setDate(now.getDate()-day+1); return date; })();
let selectedDay = 1;

function dateFor(day) { const date=new Date(monday); date.setDate(date.getDate()+(day===0?6:day-1)); return date; }
function shortDate(date) { return `${date.getMonth()+1}.${date.getDate()}`; }
function fullDate(date) { return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`; }

function card(game) {
  const avatars = Array.from({length:Math.min(game.players,6)},()=>'<span class="avatar" aria-hidden="true">🐼</span>').join('');
  const custom = Boolean(game.rideId);
  return `<article class="game-card${game.full?' full':''}" role="button" tabindex="0" data-game="${game.id}" data-full="${game.full?'1':'0'}" ${custom?`data-ride="${game.rideId}"`:''} aria-label="查看${game.name}详情">
    <time class="card-time">${game.time}</time><span class="status-pill">${game.full?'车开走了':custom?'我发起的':'招募中'}</span>
    ${game.className === 'generated' ? `<div class="cover-crop generated-cover" role="img" aria-label="${game.name}封面"><span>${BoardGameByKey[game.id]?.icon || extraSymbols[game.id] || '🎲'}</span></div>` : `<div class="cover-crop ${game.className}"><img src="./assets/plaza-screen.jpg" alt=""></div>`}
    <div class="card-main"><h2 class="game-title">${game.name}</h2><div class="game-meta"><span>♟ ${game.players}/${game.max}</span><span><i class="dot${game.review==='免审核'?' green':''}"></i>${game.review}</span></div><div class="avatars">${avatars}${game.full?'':'<span class="plus" aria-hidden="true">＋</span>'}</div></div>
  </article>`;
}

function customRidesFor(date) {
  return RideStore.public().filter(ride => ride.date === fullDate(date)).map(ride => ({
    id:ride.game, name:ride.teamName, time:`${ride.start}–${ride.end}`, players:ride.current,
    max:ride.max, review:'免审核', className:gameData[ride.game]?.className || 'generated', full:ride.current>=ride.max, rideId:ride.id
  }));
}

function render() {
  const dateObject = dateFor(selectedDay);
  const date = shortDate(dateObject);
  const schedule = schedules[selectedDay];
  const custom = customRidesFor(dateObject);
  const open = [...custom.filter(ride=>!ride.full), ...schedule.open.map(id => gameData[id])];
  const closed = [...custom.filter(ride=>ride.full), ...schedule.closed.map(id => gameData[id])];
  document.querySelectorAll('[data-day]').forEach(button => button.classList.toggle('active',Number(button.dataset.day)===selectedDay));
  document.getElementById('dateOne').textContent = date;
  document.getElementById('dateTwo').textContent = date;
  document.getElementById('countOne').textContent = `${open.length} 场`;
  document.getElementById('countTwo').textContent = `${closed.length} 场`;
  document.getElementById('openCards').innerHTML = open.length ? open.map(card).join('') : '<div class="empty">当天暂无招募中的拼车</div>';
  document.getElementById('closedCards').innerHTML = closed.length ? closed.map(card).join('') : '<div class="empty">当天暂无已结束的拼车</div>';
}

function openGame(game, ride, full) {
  const params = new URLSearchParams({game,date:shortDate(dateFor(selectedDay))});
  if (ride) params.set('ride',ride);
  if (full) params.set('full','1');
  location.href = `./loading.html?${params.toString()}`;
}
document.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click',()=>{selectedDay=Number(button.dataset.day);render();}));
document.querySelector('.plaza-page').addEventListener('click', event => { const node=event.target.closest('[data-game]'); if(node) openGame(node.dataset.game,node.dataset.ride,node.dataset.full==='1'); });
document.querySelector('.plaza-page').addEventListener('keydown', event => { if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-game]')){event.preventDefault();openGame(event.target.dataset.game,event.target.dataset.ride,event.target.dataset.full==='1');} });
document.getElementById('backBtn').addEventListener('click',()=>{location.href='./index.html';});
window.addEventListener('rides:changed',render);
window.addEventListener('storage',render);
render();
