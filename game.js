const catalog = {
  ship:{name:'险恶迷航',stars:3,type:'身份推理 / 阵营 / 社交',players:'5–8人',duration:'约60分钟',intro:'玩家们化身海盗，邪教徒与船员在航行途中展开身份博弈。你需要观察发言、隐藏阵营并完成目标，规则容易上手，新手也能快速融入。',cover:'crop'},
  night:{name:'血染之夜',stars:4,type:'阵营 / 推理 / 角色扮演',players:'6–12人',duration:'约90分钟',intro:'充满身份与信息博弈的阵营推理游戏。每位玩家拥有独特能力，在交流、判断与伪装中寻找真正的威胁。',cover:'crop'},
  wizard:{name:'出包魔法师',stars:2,type:'欢乐 / 聚会 / 轻策略',players:'3–6人',duration:'约30分钟',intro:'手忙脚乱的魔法学徒聚会游戏，规则轻松、节奏明快，适合新手和朋友一起快速开局。'},
  ninja:{name:'忍者之夜',stars:3,type:'推理 / 阵营 / 聚会',players:'5–10人',duration:'约45分钟',intro:'夜幕下的忍者阵营展开秘密行动。通过观察、沟通与判断找出对手，适合喜欢身份推理的玩家。'},
  circus:{name:'害羞迁徙协会',stars:2,type:'欢乐 / 聚会 / 轻策略',players:'2–5人',duration:'约40分钟',intro:'轻松可爱的聚会桌游，玩家合作又竞争，规则简单，新手也能很快享受游戏乐趣。',cover:'crop'},
  uno:{name:'UNO',stars:1,type:'卡牌 / 欢乐 / 聚会',players:'2–10人',duration:'约20分钟',intro:'经典欢乐卡牌游戏，匹配颜色或数字并利用功能牌反转局势，最后先出完手牌的人获胜。'},
  gem:{name:'璀璨宝石',stars:3,type:'策略 / 卡牌 / 引擎构筑',players:'2–4人',duration:'约40分钟',intro:'收集宝石筹码并购买发展卡，逐步建立自己的商业引擎。规则清晰、回合紧凑，适合喜欢轻策略的玩家。',symbol:'💎'},
  werewolf:{name:'狼人杀',stars:3,type:'阵营 / 推理 / 聚会',players:'6–12人',duration:'约60分钟',intro:'经典身份推理游戏。村民需要从发言中找出狼人，狼人则要隐藏身份并影响大家的判断。',symbol:'🐺'},
  carcassonne:{name:'卡卡颂',stars:2,type:'版图 / 策略 / 家庭',players:'2–5人',duration:'约45分钟',intro:'轮流拼接道路、城市和田野，在不断扩展的版图上部署随从并争夺分数。',symbol:'🏰'},
  dixit:{name:'妙语说书人',stars:1,type:'想象 / 欢乐 / 聚会',players:'3–8人',duration:'约35分钟',intro:'用一句话描述充满想象力的插画，让同伴猜中却又不能让所有人都猜中，轻松又富有创意。',symbol:'🎨'},
  codenames:{name:'行动代号',stars:2,type:'推理 / 词语 / 阵营',players:'4–10人',duration:'约30分钟',intro:'队长用一个词关联多个代号，队友通过线索找出己方角色，同时避开危险目标。',symbol:'🕵️'},
  dobble:{name:'德国心脏病',stars:1,type:'反应 / 欢乐 / 聚会',players:'2–6人',duration:'约20分钟',intro:'快速翻牌并观察水果数量，在正确时机拍铃。节奏明快，非常适合朋友聚会。',symbol:'🔔'},
  azul:{name:'花砖物语',stars:3,type:'策略 / 拼图 / 家庭',players:'2–4人',duration:'约45分钟',intro:'挑选精美花砖完成墙面图案，在位置规划与取舍中争取最高分数。',symbol:'🔷'},
  sushi:{name:'寿司派对',stars:1,type:'卡牌 / 欢乐 / 聚会',players:'2–8人',duration:'约25分钟',intro:'挑选寿司组合并把剩余手牌传给下一位玩家，规则简单、节奏轻快。',symbol:'🍣'},
  avalon:{name:'阿瓦隆',stars:3,type:'阵营 / 推理 / 聚会',players:'5–10人',duration:'约40分钟',intro:'正义与邪恶阵营围绕任务展开推理与伪装，通过投票和发言判断隐藏身份。',symbol:'🛡️'}
};
const params = new URLSearchParams(location.search);
const requestedKey = params.get('game');
const key = catalog[requestedKey] || BoardGameByKey[requestedKey] ? requestedKey : 'ship';
const info = BoardGameByKey[key];
const game = catalog[key] || {name:info.name,stars:2,type:info.category,players:info.players,duration:info.duration,intro:`${info.name}是一款适合朋友相约体验的${info.category}桌游。开局前局主会讲解规则，欢迎按时到场一起游玩。`,symbol:info.icon};
const cover = document.getElementById('gameCover');
const coverImage = document.getElementById('coverImage');

document.title = `${game.name}｜桌游详情`;
document.getElementById('gameName').textContent = game.name;
document.getElementById('stars').textContent = '★'.repeat(game.stars);
document.getElementById('gameType').textContent = game.type;
document.getElementById('playerRange').textContent = game.players;
document.getElementById('duration').textContent = game.duration;
document.getElementById('gameIntro').textContent = game.intro;

if (key === 'uno') {
  coverImage.remove();
  cover.insertAdjacentHTML('beforeend', '<div class="generated-cover uno-art" role="img" aria-label="UNO 桌游封面"></div>');
} else if (game.cover === 'crop' && ['ship','night'].includes(key)) {
  cover.classList.add(key);
} else {
  coverImage.remove();
  cover.insertAdjacentHTML('beforeend', `<div class="generated-cover"><span>${game.symbol || '🎲'}</span><b>${game.name}</b></div>`);
}

const maxPlayers = Number(game.players.match(/\d+(?=人)/)?.[0] || 6);
const sampleDate = offset => { const value = new Date(); value.setHours(12,0,0,0); value.setDate(value.getDate() + offset); return `${value.getFullYear()}.${value.getMonth()+1}.${value.getDate()}`; };
const seedRides = [
  {date:sampleDate(1),start:'13:00',end:'14:00',tag:'新手友好 · 示例约局'},
  {date:sampleDate(2),start:'15:00',end:'16:30',tag:'轻松欢乐 · 示例约局'},
  {date:sampleDate(3),start:'19:00',end:'20:30',tag:'欢迎萌新 · 示例约局'}
].map((ride,index) => ({...ride,current:Math.min(maxPlayers-1,Math.max(1,Math.floor(maxPlayers*.6)+(index===1?0:1))),max:maxPlayers,owner:'other'}));
const customRides = RideStore.public().filter(ride => ride.game === key).map(ride => ({...ride,tag:'我发起的'}));
const rides = [...customRides,...seedRides];

document.getElementById('rideList').innerHTML = rides.map((ride,index) => `
  <article class="ride-card">
    <div class="ride-info">
      <p><b>日期：</b>${ride.date}　${ride.start}–${ride.end}</p>
      <p><b>地点：</b>${ride.location || 'K5栋综合楼桌游室'}</p>
      <p><b>当前：</b>${ride.current}/${ride.max}人，还差${Math.max(ride.max-ride.current,0)}人</p>
      <p><b>局主：</b>${ride.owner==='me'?'我':'熊猫'}　<b>标签：</b>${ride.tag}</p>
    </div>
    <button class="apply-btn" type="button" data-index="${index}" ${ride.owner !== 'me' && ride.current >= ride.max ? 'disabled' : ''}>${ride.owner==='me'?'查看详情':ride.current >= ride.max?'本局已满':'申请上车'}</button>
  </article>`).join('');

document.getElementById('rideList').addEventListener('click', event => {
  const button = event.target.closest('.apply-btn');
  if (!button) return;
  const ride = rides[Number(button.dataset.index)];
  if (ride.owner === 'me') {
    location.href = `./detail.html?game=${encodeURIComponent(key)}&date=${encodeURIComponent(ride.date)}&ride=${encodeURIComponent(ride.id)}`;
    return;
  }
  if (ride.current >= ride.max) return;
  const storedRide = RideStore.joinExternal({game:key,gameName:game.name,teamName:`${game.name}拼车局`,date:ride.date,start:ride.start,end:ride.end,location:'K5栋综合楼桌游室',current:ride.current,max:ride.max,intro:game.intro});
  if (!storedRide) { button.textContent = '本局已满'; button.disabled = true; return; }
  sessionStorage.setItem('joinedGame', key);
  location.href = `./success.html?game=${encodeURIComponent(key)}&date=${encodeURIComponent(ride.date)}&ride=${encodeURIComponent(storedRide.id)}`;
});

document.getElementById('createRide').addEventListener('click', () => { location.href = './create.html'; });
document.getElementById('backBtn').addEventListener('click', () => { location.href = params.get('from') === 'types' ? './types.html' : './search.html?mode=discover'; });
