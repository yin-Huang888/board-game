(function () {
  const STORAGE_KEY = 'play_board_game_rides_v2';
  const DEMO_INITIATED_KEY = 'play_board_game_demo_initiated_v1';
  const LATE_EXIT_PENALTY = 10;
  const listeners = new Set();

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function write(rides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
    listeners.forEach(listener => listener(rides));
    window.dispatchEvent(new CustomEvent('rides:changed', { detail: rides }));
    return rides;
  }

  function create(input) {
    const rides = read();
    if (!input.demo) {
      rides.forEach(item => {
        if (isDemo(item) && item.state === 'active') {
          item.state = 'archived';
          item.archivedReason = '已由真实约局替换';
          item.archivedAt = new Date().toISOString();
        }
      });
    }
    const ride = {
      id: `ride-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      game: input.game || 'ship',
      gameName: input.gameName || '桌游拼车',
      teamName: input.teamName || input.gameName || '桌游拼车',
      date: input.date,
      start: input.start || '13:00',
      end: input.end || '16:00',
      location: input.location || 'K5栋综合楼桌游室',
      wechatId: input.wechatId || '',
      min: Number(input.min || 2),
      max: Number(input.max || 6),
      current: Number(input.current || 1),
      intro: input.intro || '欢迎新朋友加入，开局前会统一讲解游戏规则。',
      demo: Boolean(input.demo),
      owner: 'me',
      joinedByMe: false,
      state: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    rides.unshift(ride);
    write(rides);
    return ride;
  }

  function joinExternal(input) {
    const rides = read();
    const existing = rides.find(ride => ride.owner === 'other' && ride.state === 'active' && ride.game === input.game && ride.date === input.date && ride.start === input.start);
    if (existing) {
      if (existing.joinedByMe) return existing;
      if (Number(existing.current) >= Number(existing.max)) return null;
      existing.joinedByMe = true;
      existing.current = Math.min(Number(existing.current) + 1, Number(existing.max));
      existing.updatedAt = new Date().toISOString();
      write(rides);
      return existing;
    }
    if (Number(input.current) >= Number(input.max)) return null;
    const ride = {
      id: `joined-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      game: input.game || 'ship', gameName: input.gameName || '桌游拼车',
      teamName: input.teamName || input.gameName || '桌游拼车', date: input.date,
      start: input.start || '13:00', end: input.end || '14:00',
      location: input.location || 'K5栋综合楼桌游室', min: 2,
      max: Number(input.max || 6), current: Math.min(Number(input.current || 4) + 1, Number(input.max || 6)),
      intro: input.intro || '新手友好，欢迎加入。', owner: 'other', joinedByMe: true,
      wechatId: input.wechatId || 'panda_boardgame', contactIsDemo: !input.wechatId,
      state: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    rides.unshift(ride);
    write(rides);
    return ride;
  }

  function update(id, patch) {
    const rides = read();
    const ride = rides.find(item => item.id === id);
    if (!ride) return null;
    Object.assign(ride, patch, { updatedAt: new Date().toISOString() });
    write(rides);
    return ride;
  }

  function startTime(ride) {
    const date = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/.exec(ride.date || '');
    const time = /^(\d{1,2}):(\d{2})$/.exec(ride.start || '');
    if (!date || !time) return null;
    const result = new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]), Number(time[1]), Number(time[2]));
    return Number.isNaN(result.getTime()) ? null : result;
  }

  function exitPenalty(ride, now = new Date()) {
    if (!ride || ride.state !== 'active' || isDemo(ride) || ride.attendedAt) return 0;
    const start = startTime(ride);
    if (!start) return 0;
    const remaining = start.getTime() - now.getTime();
    return remaining >= 0 && remaining <= 2 * 60 * 60 * 1000 ? LATE_EXIT_PENALTY : 0;
  }

  function creditScore() {
    const deductions = read().reduce((sum, ride) => sum + Math.min(Number(ride.creditDelta) || 0, 0), 0);
    return Math.max(0, 100 + deductions);
  }

  function markAttended(id) {
    const ride = read().find(item => item.id === id);
    if (!ride || ride.state !== 'active' || ride.attendedAt || (ride.owner !== 'me' && !ride.joinedByMe)) return null;
    const start = startTime(ride);
    const endParts = /^(\d{1,2}):(\d{2})$/.exec(ride.end || '');
    const end = endParts && start ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), Number(endParts[1]), Number(endParts[2])) : null;
    if (!start || !end || Date.now() < start.getTime() - 15 * 60 * 1000 || Date.now() > end.getTime()) return null;
    return update(id, { attendedAt: new Date().toISOString() });
  }

  function archive(id, reason) {
    const ride = read().find(item => item.id === id);
    if (!ride || ride.state !== 'active') return null;
    return update(id, {
      state: 'archived', archivedReason: reason || '已取消',
      archivedAt: new Date().toISOString(), joinedByMe: false,
      creditDelta: -exitPenalty(ride)
    });
  }

  function isDemo(ride) {
    return ride.demo === true || (
      ride.game === 'ship' && ride.teamName === '险恶迷航新手局' &&
      ride.min === 3 && ride.max === 5 &&
      ride.intro === '新手友好，开局前会统一讲解规则，欢迎喜欢合作与推理的同学加入。'
    );
  }

  function ensureDemoInitiated() {
    if (localStorage.getItem(DEMO_INITIATED_KEY)) return null;
    localStorage.setItem(DEMO_INITIATED_KEY, 'done');
    if (read().some(ride => ride.owner === 'me')) return null;
    const now = new Date();
    const date = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
    return create({
      game: 'ship',
      gameName: '险恶迷航',
      teamName: '险恶迷航新手局',
      date,
      start: '13:00',
      end: '16:00',
      location: 'K5栋综合楼桌游室',
      min: 3,
      max: 5,
      current: 1,
      demo: true,
      intro: '新手友好，开局前会统一讲解规则，欢迎喜欢合作与推理的同学加入。'
    });
  }

  const api = {
    all: read,
    active: () => read().filter(ride => ride.state === 'active'),
    public: () => read().filter(ride => ride.state === 'active' && ride.owner === 'me' && !isDemo(ride)),
    initiated: () => {
      const own = read().filter(ride => ride.state === 'active' && ride.owner === 'me');
      return own.some(ride => !isDemo(ride)) ? own.filter(ride => !isDemo(ride)) : own;
    },
    joined: () => read().filter(ride => ride.state === 'active' && ride.owner === 'other' && ride.joinedByMe),
    archived: () => read().filter(ride => ride.state === 'archived'),
    get: id => read().find(ride => ride.id === id) || null,
    create, joinExternal, update, archive, ensureDemoInitiated,
    exitPenalty, creditScore, markAttended, startTime,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };
  window.RideStore = api;
})();
