// Shared catalogue for discovery, search and creating a ride.
// The colored cover cards are original interface artwork, not publisher box art.
window.BoardGames = Object.freeze([
  {key:'ship',name:'险恶迷航',en:'',category:'推理',icon:'⛵',colors:['#295a6b','#d9a14f'],players:'5–8人',duration:'约60分钟',keywords:'航海 阵营 社交',art:'photo'},
  {key:'night',name:'血染之夜',en:'',category:'推理',icon:'🌙',colors:['#40142b','#c35b3e'],players:'6–12人',duration:'约90分钟',keywords:'血染 阵营 身份',art:'photo'},
  {key:'wizard',name:'出包魔法师',en:'',category:'欢乐',icon:'🪄',colors:['#553172','#d6a24e'],players:'3–6人',duration:'约30分钟',keywords:'魔法 聚会'},
  {key:'ninja',name:'忍者之夜',en:'Ninja Night',category:'推理',icon:'🥷',colors:['#162c41','#a76b42'],players:'5–10人',duration:'约45分钟',keywords:'忍者 阵营'},
  {key:'circus',name:'害羞迁徙协会',en:'',category:'欢乐',icon:'🎪',colors:['#188fbd','#f4ac48'],players:'2–5人',duration:'约40分钟',keywords:'派对 社交'},
  {key:'uno',name:'UNO',en:'UNO',category:'卡牌',icon:'🃏',colors:['#df252c','#ffc338'],players:'2–10人',duration:'约20分钟',keywords:'乌诺 出牌',art:'uno'},
  {key:'gem',name:'璀璨宝石',en:'Splendor',category:'策略',icon:'💎',colors:['#275f77','#80bdbd'],players:'2–4人',duration:'约40分钟',keywords:'宝石 引擎'},
  {key:'werewolf',name:'狼人杀',en:'Werewolf',category:'推理',icon:'🐺',colors:['#1d263d','#8d4c64'],players:'6–12人',duration:'约60分钟',keywords:'身份 阵营'},
  {key:'carcassonne',name:'卡卡颂',en:'Carcassonne',category:'家庭',icon:'🏰',colors:['#8d6539','#699365'],players:'2–5人',duration:'约45分钟',keywords:'拼图 版图'},
  {key:'dixit',name:'妙语说书人',en:'Dixit',category:'欢乐',icon:'🎨',colors:['#71518a','#d18ca7'],players:'3–8人',duration:'约35分钟',keywords:'想象 插画'},
  {key:'codenames',name:'行动代号',en:'Codenames',category:'推理',icon:'🕵️',colors:['#314c63','#967383'],players:'4–10人',duration:'约30分钟',keywords:'词语 阵营'},
  {key:'dobble',name:'德国心脏病',en:'Halli Galli',category:'欢乐',icon:'🔔',colors:['#c4523c','#ecb957'],players:'2–6人',duration:'约20分钟',keywords:'拍铃 反应'},
  {key:'azul',name:'花砖物语',en:'Azul',category:'策略',icon:'🔷',colors:['#2b78a8','#dbbe72'],players:'2–4人',duration:'约45分钟',keywords:'花砖 拼图'},
  {key:'sushi',name:'寿司派对',en:'Sushi Go!',category:'卡牌',icon:'🍣',colors:['#e78983','#75b19e'],players:'2–8人',duration:'约25分钟',keywords:'寿司 轮抽'},
  {key:'avalon',name:'阿瓦隆',en:'The Resistance: Avalon',category:'推理',icon:'🛡️',colors:['#344477','#bb9b58'],players:'5–10人',duration:'约40分钟',keywords:'阵营 身份'},
  {key:'catan',name:'卡坦岛',en:'CATAN',category:'策略',icon:'🏝️',colors:['#297d84','#d9a153'],players:'3–4人',duration:'约90分钟',keywords:'资源 交易'},
  {key:'ticket',name:'车票之旅',en:'Ticket to Ride',category:'家庭',icon:'🚂',colors:['#376b89','#c19456'],players:'2–5人',duration:'约60分钟',keywords:'铁路 路线'},
  {key:'pandemic',name:'瘟疫危机',en:'Pandemic',category:'合作',icon:'🧪',colors:['#20566d','#87b6a0'],players:'2–4人',duration:'约45分钟',keywords:'抗疫 协作'},
  {key:'wingspan',name:'展翅翱翔',en:'Wingspan',category:'策略',icon:'🕊️',colors:['#577777','#d9b58a'],players:'1–5人',duration:'约60分钟',keywords:'鸟类 引擎'},
  {key:'cascadia',name:'卡斯卡迪亚之旅',en:'Cascadia',category:'家庭',icon:'🦊',colors:['#3d8067','#c9b578'],players:'1–4人',duration:'约45分钟',keywords:'自然 动物 拼图'},
  {key:'seven',name:'七大奇迹：对决',en:'7 Wonders Duel',category:'策略',icon:'🏛️',colors:['#926b4d','#dfbf78'],players:'2人',duration:'约30分钟',keywords:'文明 对决'},
  {key:'justone',name:'只言片语',en:'Just One',category:'合作',icon:'💬',colors:['#6872b0','#d0a8c8'],players:'3–7人',duration:'约20分钟',keywords:'猜词 词语'},
  {key:'crew',name:'The Crew：深海任务',en:'The Crew: Mission Deep Sea',category:'合作',icon:'🤿',colors:['#155c84','#47b0b2'],players:'3–5人',duration:'约20分钟',keywords:'船员 深海 合作 卡牌'},
  {key:'tokyo',name:'东京之王',en:'King of Tokyo',category:'欢乐',icon:'🦖',colors:['#593d7d','#ef8c56'],players:'2–6人',duration:'约30分钟',keywords:'怪兽 骰子'},
  {key:'loveletter',name:'情书',en:'Love Letter',category:'卡牌',icon:'💌',colors:['#8d4666','#edbb87'],players:'2–6人',duration:'约20分钟',keywords:'手牌 轻策略'},
  {key:'hanabi',name:'花火',en:'Hanabi',category:'合作',icon:'🎆',colors:['#273a7a','#a167b7'],players:'2–5人',duration:'约25分钟',keywords:'烟花 记忆 卡牌'},
  {key:'patchwork',name:'拼布艺术',en:'Patchwork',category:'策略',icon:'🧵',colors:['#9a627d','#d6ac7b'],players:'2人',duration:'约30分钟',keywords:'拼布 双人'},
  {key:'kingdomino',name:'多米诺王国',en:'Kingdomino',category:'家庭',icon:'👑',colors:['#397aa3','#84ae61'],players:'2–4人',duration:'约20分钟',keywords:'多米诺 王国 拼图'},
  {key:'sagrada',name:'圣家堂',en:'Sagrada',category:'策略',icon:'🪟',colors:['#455ca2','#d2778a'],players:'1–4人',duration:'约40分钟',keywords:'彩窗 骰子'},
  {key:'jaipur',name:'斋浦尔',en:'Jaipur',category:'卡牌',icon:'🐪',colors:['#b96e48','#e4c284'],players:'2人',duration:'约30分钟',keywords:'交易 双人'}
]);
window.BoardGameByKey = Object.fromEntries(window.BoardGames.map(game => [game.key, game]));
window.boardGameCard = function (game) {
  const art = game.art === 'photo' ? `photo photo-${game.key}` : game.art === 'uno' ? 'uno-art' : 'illustrated-art';
  const inside = game.art === 'photo' || game.art === 'uno' ? '' : `<span class="cover-icon">${game.icon}</span><span class="cover-english">${game.en || game.category}</span>`;
  return `<button class="game-card" type="button" data-game="${game.key}" aria-label="查看${game.name}">
    <span class="cover-frame"><span class="cover-tile ${art}" style="--cover-a:${game.colors[0]};--cover-b:${game.colors[1]}" role="img" aria-label="${game.name}封面">${inside}</span></span>
    <span class="game-name">${game.name}</span><span class="game-facts">${game.category} · ${game.players} · ${game.duration}</span>
  </button>`;
};
