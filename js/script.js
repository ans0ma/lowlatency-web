/* ══ Burger ══ */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

function closeDrawer() {
    burger.classList.remove('open');
    drawer.classList.remove('open');
}
burger.addEventListener('click', e => {
    e.stopPropagation();
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
});
document.addEventListener('click', e => {
    if (!drawer.contains(e.target) && !burger.contains(e.target)) closeDrawer();
});

/* ══ Nav scroll ══ */
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
});

/* ══ Terminal ══ */
const LINES = [
    { prefix: '>', text: 'INIT SECURED TUNNEL', hi: false },
    { prefix: '>', text: 'PROTOCOL: HYSTERIA 2 + VLESS REALITY', hi: false },
    { prefix: '>', text: 'DPI-BYPASS: ENABLED', hi: false },
    { prefix: '[SYS]', text: 'Authenticating with auth.lowlatency.me... <span class="t-ok">OK</span>', hi: false },
    { prefix: '[NET]', text: 'UDP MTU probing... 1390 bytes', hi: false },
    { prefix: '[BBR]', text: 'Congestion control initialized', hi: false },
    { prefix: '[SEC]', text: 'CIPHER ACTIVE', hi: false },
    { prefix: '[XTLS]', text: 'Reality handshake verified', hi: false },
    { prefix: '[NET]', text: 'Handshake success (RTT: 12ms)', hi: false },
    { prefix: '[SYS]', text: 'Bandwidth allocation: 10Gbps link', hi: false },
    { prefix: '>', text: 'STATUS: LOWLATENCY VPN SECURED', hi: true },
];
const term = document.getElementById('terminal');

const cursorRow = document.createElement('div');
cursorRow.className = 't-cursor-line';
cursorRow.innerHTML = '<span class="t-prompt">root@ll-node:~#</span><span class="t-cursor-block"></span>';
term.appendChild(cursorRow);

let idx = 0;
function tick() {
    if (idx >= LINES.length) return;
    const l = LINES[idx++];
    const row = document.createElement('div');
    row.className = 't-line';
    row.innerHTML =
        `<span class="t-prefix">${l.prefix}</span>` +
        `<span${l.hi ? ' class="t-highlight"' : ''}>${l.text}</span>`;
    term.insertBefore(row, cursorRow);
    setTimeout(tick, 100 + Math.random() * 130);
}
setTimeout(tick, 500);

/* ══ ВЫДЕЛЕНИЕ ГРАНИЦЫ КАРТОЧЕК ПРИ НАВЕДЕНИИ ══ */
document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const y = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mx', x);
        card.style.setProperty('--my', y);
    });
});