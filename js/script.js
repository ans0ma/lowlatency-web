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
    { prefix: '>', text: 'Подключаемся к скоростным серверам <span class="accent-text">LowLatency</span> ❤️‍🔥', hi: false },
    { prefix: '>', text: 'Поиск оптимального маршрута - задержка <span class="accent-text">&lt;15мс</span>', hi: false },
    { prefix: '>', text: 'Обход ограничений и маскировка трафика - <span class="accent-text">успешно ✓</span>', hi: false },
    { prefix: '>', text: 'Проверка стабильности: канал свободен - качество  <span class="accent-text">превосходное</span> 🔥', hi: false },
    { prefix: '>', text: 'Добро пожаловать в <span class="accent-text">LowLatency</span> -  твой ключ к <span class="accent-text">свободному интернету</span> 🚀', hi: false },

];
const term = document.getElementById('terminal');

const cursorRow = document.createElement('div');
cursorRow.className = 't-cursor-line';
cursorRow.innerHTML = '<span class="t-prompt">root@lowlatency.me:~#</span><span class="t-cursor-block"></span>';
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

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let isClickScrolling = false;

    // 1. Выносим логику подсветки в отдельную функцию
    function updateActiveNav() {
        if (isClickScrolling) return;

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 80)) {
                current = section.getAttribute('id');
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            const lastSection = sections[sections.length - 1];
            current = lastSection.getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // 2. СРАЗУ проверяем, где мы при загрузке страницы
    function updateActiveNav() {
        if (isClickScrolling) return;

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 80)) {
                current = section.getAttribute('id');
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            const lastSection = sections[sections.length - 1];
            current = lastSection.getAttribute('id');
        }

        // --- НОВАЯ МАГИЯ ДЛЯ АДРЕСНОЙ СТРОКИ ---
        if (current) {
            const newHash = `#${current}`;
            // Если хеш изменился, тихо обновляем адресную строку
            if (window.location.hash !== newHash) {
                // replaceState меняет URL, но не создает новую запись в истории "Назад"
                history.replaceState(null, null, newHash);
            }
        }
        // ---------------------------------------

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // 3. Обрабатываем КЛИК по любой якорной кнопке
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetHref = this.getAttribute('href');

            // --- ПЕРЕХВАТ ДЛЯ МОДАЛЬНЫХ ОКНЕН ---
            if (targetHref === '#faq' || targetHref === '#contacts') {
                e.preventDefault();

                // Тихо меняем адресную строку на #faq или #contacts
                history.replaceState(null, null, targetHref);

                const modalId = targetHref === '#faq' ? 'modal-faq' : 'modal-contacts';
                openModal(modalId);
                return;
            }

            isClickScrolling = true;

            navLinks.forEach(nav => nav.classList.remove('active'));

            const matchingNavLink = Array.from(navLinks).find(nav => nav.getAttribute('href') === targetHref);

            if (matchingNavLink) {
                matchingNavLink.classList.add('active');
            }

            setTimeout(() => {
                isClickScrolling = false;
            }, 800);
        });
    });

    // 4. Обрабатываем обычный СКРОЛЛ
    window.addEventListener('scroll', updateActiveNav);
});

// --- УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('open');
    document.body.classList.add('modal-open');

    // Обработчик закрытия по клику на крестик или фон
    const closeBtn = modal.querySelector('.modal-close');

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', handleEsc);

        // Искусственно вызываем событие скролла, чтобы скрипт сам 
        // вернул правильный хеш секции на заднем фоне (например, #cta)
        window.dispatchEvent(new Event('scroll'));
    };

    const handleEsc = (e) => {
        if (e.key === 'Escape') closeModal();
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Слушаем нажатие Esc
    window.addEventListener('keydown', handleEsc);
}

// --- ЛОГИКА АККОРДЕОНА FAQ ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Закрываем все остальные открытые вопросы (опционально, для чистоты)
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        // Переключаем текущий
        if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
        } else {
            item.classList.add('active');
            // Задаем точную высоту контента для плавной CSS-анимации
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});