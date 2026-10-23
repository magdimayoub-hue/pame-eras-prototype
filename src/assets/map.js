// Draws the "reach" map: arcs from Dubai to every city in the event archive.
window.PAME_map = (svg, events, onPick) => {
  const W = 900, H = 420, lon0 = -14, lon1 = 122, lat0 = 58, lat1 = 8;
  const px = (lon, lat) => [(lon - lon0) / (lon1 - lon0) * W, (lat0 - lat) / (lat0 - lat1) * H];
  const ns = 'http://www.w3.org/2000/svg';
  const mk = (t, a, parent) => { const e = document.createElementNS(ns, t); for (const k in a) e.setAttribute(k, a[k]); parent && parent.appendChild(e); return e; };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const g = mk('g', {}, svg);
  const dots = mk('g', {class: 'map-dots'}, g);
  for (let x = 12; x < W; x += 20) for (let y = 12; y < H; y += 20) mk('circle', {cx: x, cy: y, r: 1.2}, dots);
  const arcs = mk('g', {class: 'map-arcs'}, g), pins = mk('g', {class: 'map-pins'}, g);

  // one pin per city; Dubai is the hub
  const byCity = new Map();
  events.forEach(e => { const k = e.city; if (!byCity.has(k)) byCity.set(k, {...e, all: []}); byCity.get(k).all.push(e); });
  const hub = byCity.get('Dubai');
  const [hx, hy] = px(hub.lon, hub.lat);
  const LABEL = {Cairo: 'l', Kuwait: 'l', 'Saudi Arabia': 'l', Muscat: 'r', Beirut: 'l', Egypt: 'l', 'Hong Kong': 'l', 'ERAS Asia': 'r'};
  let i = 0;
  byCity.forEach((c, name) => {
    if (name === 'Dubai' || name === 'Egypt') return; // Egypt 2016 shares Cairo's pin
    const [x, y] = px(c.lon, c.lat);
    const mx = (hx + x) / 2, my = Math.min(hy, y) - Math.abs(hx - x) * .28 - 24;
    mk('path', {d: `M${hx},${hy} Q${mx},${my} ${x},${y}`, class: 'arc', style: `--i:${i}`}, arcs);
    const pin = mk('g', {class: 'pin', tabindex: 0, role: 'button', 'aria-label': `${name}: ${c.all.map(e => e.year + ' ' + e.title).join('; ')}`, style: `--i:${i}`}, pins);
    mk('circle', {cx: x, cy: y, r: 10, class: 'ring'}, pin);
    mk('circle', {cx: x, cy: y, r: 5, class: 'dot'}, pin);
    const side = LABEL[name] || (x > W - 110 ? 'l' : 'r');
    const t = mk('text', {x: side === 'r' ? x + 11 : x - 11, y: y + 4, 'text-anchor': side === 'r' ? 'start' : 'end'}, pin);
    t.textContent = name;
    const pick = () => onPick && onPick(name === 'Cairo' ? [...c.all, ...(byCity.get('Egypt')?.all || [])] : c.all, name);
    pin.addEventListener('click', pick);
    pin.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    i++;
  });
  const hubG = mk('g', {class: 'pin hub', tabindex: 0, role: 'button', 'aria-label': 'Dubai: first meeting 2015, IASCN 2025'}, pins);
  mk('circle', {cx: hx, cy: hy, r: 14, class: 'ring'}, hubG);
  mk('circle', {cx: hx, cy: hy, r: 7, class: 'dot'}, hubG);
  const ht = mk('text', {x: hx + 14, y: hy - 10}, hubG); ht.textContent = 'Dubai · 2015';
  const pickHub = () => onPick && onPick(hub.all, 'Dubai');
  hubG.addEventListener('click', pickHub);
  hubG.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickHub(); } });
};
