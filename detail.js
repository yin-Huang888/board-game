const gameData={
  ship:{name:'险恶迷航',type:'推理 / 阵营 / 社交',players:4,max:7,status:'招募中',time:'13:00–14:00',symbol:'⛵',cover:'linear-gradient(160deg,#dfaa4d 0 18%,#2d7181 50%,#173842)',intro:'本局适合新手，节奏轻松开心。适合推理阵营的同学，局主会提前讲解游戏规则，努力引导，希望大家准时参加、文明游戏。'},
  circus:{name:'害羞迁徙协会',type:'欢乐 / 聚会 / 轻策略',players:2,max:5,status:'招募中',time:'13:00–15:00',symbol:'🎪',cover:'linear-gradient(145deg,#7ed8e5,#2ba8c7 60%,#efad4d)',intro:'欢乐轻松的聚会局，对新手非常友好。大家可以边玩边认识新朋友，规则会在开局前统一讲解，请准时到场。'},
  night:{name:'血染之夜',type:'阵营 / 推理 / 角色扮演',players:6,max:6,status:'车开走了',time:'09:00–11:00',symbol:'🌙',cover:'radial-gradient(circle at 50% 32%,#c36237,#48140e 48%,#1d0807)',intro:'阵营推理进阶局，需要熟悉基础发言与身份逻辑。局主会在开局前统一讲解本局角色，请准时到场。'},
  wizard:{name:'出包魔法师',type:'欢乐 / 聚会 / 轻策略',players:3,max:6,status:'招募中',time:'15:00–16:30',symbol:'🪄',cover:'linear-gradient(145deg,#874a55,#cf983f 55%,#49326e)',intro:'轻松欢乐的魔法学徒聚会局，规则简单、节奏明快，新手也能快速加入。'},
  ninja:{name:'忍者之夜',type:'推理 / 阵营 / 聚会',players:5,max:8,status:'招募中',time:'19:00–20:30',symbol:'🥷',cover:'linear-gradient(145deg,#101820,#25384b 58%,#a76b2f)',intro:'夜幕下的忍者阵营展开秘密行动，通过观察、沟通和判断找出对手。'},
  uno:{name:'UNO',type:'卡牌 / 欢乐 / 聚会',players:4,max:8,status:'招募中',time:'14:00–15:00',symbol:'🃏',cover:'linear-gradient(145deg,#d92f28,#f1b91d 55%,#315aa7)',intro:'经典欢乐卡牌局，匹配颜色与数字，利用功能牌扭转局势，欢迎新手参加。'},
  gem:{name:'璀璨宝石',type:'策略 / 卡牌 / 引擎构筑',players:3,max:4,status:'招募中',time:'13:00–14:00',symbol:'💎',cover:'linear-gradient(145deg,#315d77,#77a9b9)',intro:'收集宝石筹码并购买发展卡，逐步建立自己的商业引擎，新手也可以轻松加入。'},
  werewolf:{name:'狼人杀',type:'阵营 / 推理 / 聚会',players:7,max:10,status:'招募中',time:'19:00–21:00',symbol:'🐺',cover:'linear-gradient(145deg,#1d2437,#71414b)',intro:'经典身份推理局，局主会说明角色技能和发言顺序，请大家文明交流。'},
  carcassonne:{name:'卡卡颂',type:'版图 / 策略 / 家庭',players:3,max:5,status:'招募中',time:'15:00–16:30',symbol:'🏰',cover:'linear-gradient(145deg,#bc7a32,#5a713c)',intro:'通过拼接道路、城市和田野完成版图，新手友好，开局前统一教学。'},
  dixit:{name:'妙语说书人',type:'想象 / 欢乐 / 聚会',players:4,max:8,status:'招募中',time:'14:00–15:30',symbol:'🎨',cover:'linear-gradient(145deg,#70518e,#d1849d)',intro:'轻松富有想象力的说书局，欢迎喜欢插画和创意表达的同学。'},
  codenames:{name:'行动代号',type:'推理 / 词语 / 阵营',players:5,max:8,status:'招募中',time:'18:00–19:00',symbol:'🕵️',cover:'linear-gradient(145deg,#34485f,#8a3f47)',intro:'根据队长的词语线索找出己方代号，适合喜欢语言联想和团队配合的玩家。'},
  dobble:{name:'德国心脏病',type:'反应 / 欢乐 / 聚会',players:3,max:6,status:'招募中',time:'16:00–17:00',symbol:'🔔',cover:'linear-gradient(145deg,#cc473d,#efb34b)',intro:'快速翻牌与拍铃的欢乐反应局，规则简单，适合聚会热场。'},
  azul:{name:'花砖物语',type:'策略 / 拼图 / 家庭',players:3,max:4,status:'招募中',time:'13:30–15:00',symbol:'🔷',cover:'linear-gradient(145deg,#1f78a4,#e7b450)',intro:'通过花砖选择与位置规划完成精美图案，适合轻策略玩家。'},
  sushi:{name:'寿司派对',type:'卡牌 / 欢乐 / 聚会',players:5,max:8,status:'招募中',time:'17:00–18:00',symbol:'🍣',cover:'linear-gradient(145deg,#f18d8c,#69a890)',intro:'轻松快速的卡牌轮抽游戏，凑齐寿司组合就能获得高分。'},
  avalon:{name:'阿瓦隆',type:'阵营 / 推理 / 聚会',players:6,max:10,status:'招募中',time:'19:00–20:30',symbol:'🛡️',cover:'linear-gradient(145deg,#253a6b,#ad8c42)',intro:'正义与邪恶阵营围绕任务展开推理与伪装，局主会提前说明角色。'}
};
const query = new URLSearchParams(location.search);
const requestedKey = query.get('game');
const key = gameData[requestedKey] || BoardGameByKey[requestedKey] ? requestedKey : 'ship';
const info = BoardGameByKey[key];
const game = gameData[key] || {name:info.name,type:info.category,players:1,max:Number(info.players.match(/\d+(?=人)/)?.[0] || 6),status:'招募中',time:'13:00–14:00',symbol:info.icon,cover:`linear-gradient(145deg,${info.colors[0]},${info.colors[1]})`,intro:`${info.name}拼车局，开局前会统一讲解游戏规则，欢迎大家准时参加。`};
const rideId = query.get('ride');
const storedRide = rideId ? RideStore.get(rideId) : null;
const isFull = storedRide ? storedRide.current >= storedRide.max : query.get('full') === '1' || game.players >= game.max;
let toastTimer;
function setText(id,value){document.getElementById(id).textContent=value}
const rawDate = storedRide?.date || query.get('date') || '9.16';
const displayDate = /^\d{4}\./.test(rawDate) ? rawDate : `${new Date().getFullYear()}.${rawDate}`;
setText('gameName',storedRide?.teamName || game.name);setText('coverName',game.name);setText('gameType',game.type);
setText('players',storedRide ? `${storedRide.current}/${storedRide.max}` : `${game.players}/${game.max}`);
setText('status',storedRide?.state === 'archived' ? '已归档' : isFull ? '车开走了' : '招募中');
setText('time',storedRide ? `${storedRide.start}–${storedRide.end}` : game.time);setText('coverSymbol',game.symbol);
setText('intro',storedRide?.intro || game.intro);setText('date',displayDate);setText('place',storedRide?.location || 'K5栋综合楼桌游室');
const gameCover = document.getElementById('gameCover');
if (['ship','night','uno'].includes(key)) {
  gameCover.classList.add('cover-photo', `cover-${key}`);
  gameCover.setAttribute('aria-label', `${game.name}封面`);
  gameCover.setAttribute('role', 'img');
  gameCover.removeAttribute('aria-hidden');
} else gameCover.style.background = game.cover;
const applyBtn = document.getElementById('applyBtn');
if (storedRide?.state === 'archived') { applyBtn.textContent='本局已取消'; applyBtn.disabled=true; applyBtn.classList.add('applied'); }
else if (storedRide?.owner === 'me') applyBtn.textContent='查看我的约局';
else if (storedRide?.joinedByMe) applyBtn.textContent='已加入，查看约局';
else if (isFull) { applyBtn.textContent='本局已满，无法申请';applyBtn.disabled=true;applyBtn.classList.add('applied'); }
function toast(message){const node=document.getElementById('toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2200)}
applyBtn.addEventListener('click',()=>{
  if(applyBtn.disabled)return;
  if(storedRide?.owner==='me'||storedRide?.joinedByMe){location.href=`./rides.html?highlight=${encodeURIComponent(storedRide.id)}`;return;}
  if (storedRide && (RideStore.get(storedRide.id)?.current ?? storedRide.current) >= storedRide.max) { toast('这场约局已经满员'); return; }
  const joined=storedRide?RideStore.update(storedRide.id,{joinedByMe:true,current:Math.min(storedRide.current+1,storedRide.max)}):RideStore.joinExternal({game:key,gameName:game.name,teamName:`${game.name}拼车局`,date:displayDate,start:game.time.split('–')[0],end:game.time.split('–')[1],location:'K5栋综合楼桌游室',current:game.players,max:game.max,intro:game.intro});
  if (!joined) { toast('这场约局已经满员'); return; }
  sessionStorage.setItem('joinedGame',key);
  location.href=`./success.html?game=${encodeURIComponent(key)}&date=${encodeURIComponent(displayDate)}&ride=${encodeURIComponent(joined.id)}`;
});
document.getElementById('backBtn').addEventListener('click',()=>history.back());
if(query.get('success')==='1'){
  document.body.insertAdjacentHTML('beforeend',`<div class="success-shade"></div><section class="success-pop" role="dialog" aria-modal="true" aria-label="拼车成功"><strong>拼车成功</strong><div class="success-car">🏁<span>🚕</span></div><button id="viewRideBtn" type="button">查看约车详情</button></section>`);
  document.getElementById('viewRideBtn').addEventListener('click',()=>{location.href=storedRide?`./rides.html?highlight=${encodeURIComponent(storedRide.id)}`:`./rides.html`});
}
