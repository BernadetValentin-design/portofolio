document.addEventListener('DOMContentLoaded', () => {

    const TABS = ['all', 'projects', 'experience', 'skills', 'about'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const home = document.getElementById('home');
    const results = document.getElementById('results');
    const homeForm = document.getElementById('home-form');
    const homeInput = document.getElementById('home-input');
    const suggestionsEl = document.getElementById('suggestions');
    const resForm = document.getElementById('res-form');
    const resInput = document.getElementById('res-input');
    const stats = document.getElementById('stats');
    const pager = document.getElementById('pager');
    const tabInk = document.querySelector('.tab-ink');
    const drawer = document.getElementById('drawer');
    const drawerBody = document.getElementById('drawer-body');
    const toastEl = document.getElementById('toast');

    let currentTab = null;
    let currentQuery = '';

    // ================= Language =================

    function initialLang() {
        try {
            const fromUrl = new URLSearchParams(location.search).get('lang');
            if (LANGS[fromUrl]) return fromUrl;
        } catch (e) { }
        try {
            const saved = localStorage.getItem('vb-lang');
            if (LANGS[saved]) return saved;
        } catch (e) { }
        const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
        return LANGS[browser] ? browser : 'en';
    }

    let lang = initialLang();

    // A value is either the same in every language, or {en, fr, es}
    const tx = (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v ? v[lang] : v);
    const t = (key) => tx(UI[key]);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/<[^>]+>/g, ' ');
    const seconds = () => {
        const s = (Math.random() * 0.3 + 0.08).toFixed(2);
        return lang === 'en' ? s : s.replace('.', ',');
    };

    function setLang(next) {
        if (!LANGS[next] || next === lang) return;
        lang = next;
        try { localStorage.setItem('vb-lang', lang); } catch (e) { }
        applyStatic();
        restartPlaceholder();
        if (!results.hidden) route();
        if (drawer.open) openProject(drawer.dataset.current);
        toast(t('lang_toast'));
    }

    function langButtons(withNames) {
        return Object.keys(LANGS).map((code) =>
            `<button type="button" data-lang="${code}" lang="${code}" aria-pressed="${code === lang}">${withNames ? LANGS[code] : code.toUpperCase()}</button>`
        ).join('');
    }

    // Everything written in the HTML itself: data-i18n, data-i18n-html, data-i18n-attr
    function applyStatic() {
        document.documentElement.lang = lang;
        document.title = t('title');

        document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
        document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
        document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
            el.dataset.i18nAttr.split(',').forEach((pair) => {
                const [attr, key] = pair.split(':');
                el.setAttribute(attr, t(key));
            });
        });

        document.querySelectorAll('[data-lang-links]').forEach((el) => { el.innerHTML = langButtons(true); });
        document.querySelectorAll('[data-lang-switch]').forEach((el) => { el.innerHTML = langButtons(false); });
        document.querySelectorAll('[data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => setLang(btn.dataset.lang));
        });

        suggestionsEl.innerHTML = t('suggestions').map(([label, tab]) =>
            `<li data-go="${tab}"><i class="fas fa-magnifying-glass"></i> ${label}</li>`
        ).join('');

        updateThemeButtons();
    }

    // ================= Theme =================

    function isDark() {
        const forced = document.documentElement.dataset.theme;
        return forced ? forced === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateThemeButtons() {
        document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
            const label = isDark() ? t('theme_light') : t('theme_dark');
            if ('iconOnly' in btn.dataset) {
                btn.innerHTML = `<i class="fas ${isDark() ? 'fa-sun' : 'fa-moon'}"></i>`;
                btn.setAttribute('aria-label', label);
                btn.title = label;
            } else {
                btn.textContent = label;
            }
        });
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const next = isDark() ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try { localStorage.setItem('vb-theme', next); } catch (e) { }
            updateThemeButtons();
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeButtons);

    // ================= Toast =================

    let toastTimer;
    function toast(message) {
        toastEl.textContent = message;
        toastEl.classList.add('is-shown');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 3200);
    }

    // ================= Home =================

    // Placeholder that types itself
    let placeholderTimer;
    function restartPlaceholder() {
        clearTimeout(placeholderTimer);
        const phrases = t('placeholders');
        if (reduceMotion) {
            homeInput.placeholder = phrases[0];
            return;
        }
        let p = 0;
        let c = 0;
        let deleting = false;
        (function tick() {
            const word = phrases[p];
            c += deleting ? -1 : 1;
            homeInput.placeholder = word.slice(0, c);
            let delay = deleting ? 35 : 75;
            if (!deleting && c === word.length) {
                deleting = true;
                delay = 1800;
            } else if (deleting && c === 0) {
                deleting = false;
                p = (p + 1) % phrases.length;
                delay = 400;
            }
            placeholderTimer = setTimeout(tick, delay);
        })();
    }

    // Suggestions (mouse + arrow keys)
    let activeSuggestion = -1;

    suggestionsEl.addEventListener('mousedown', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        // mousedown fires before the input loses focus and hides the list
        e.preventDefault();
        location.hash = li.dataset.go;
    });

    homeInput.addEventListener('keydown', (e) => {
        const items = [...suggestionsEl.children];
        if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            location.hash = items[activeSuggestion].dataset.go;
            return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        activeSuggestion = (activeSuggestion + step + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle('is-active', i === activeSuggestion));
    });

    homeInput.addEventListener('input', () => {
        activeSuggestion = -1;
        [...suggestionsEl.children].forEach((li) => li.classList.remove('is-active'));
    });

    homeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        search(homeInput.value);
    });

    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        search(resInput.value);
    });

    // "I'm Feeling Lucky" opens a random project
    document.getElementById('lucky').addEventListener('click', () => {
        const project = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
        location.hash = 'projects';
        setTimeout(() => {
            openProject(project.id);
            toast(t('lucky_toast')(tx(project.title)));
        }, 150);
    });

    // "/" focuses the search field, like on the real thing
    document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || drawer.open || /input|textarea/i.test(document.activeElement.tagName)) return;
        e.preventDefault();
        const input = results.hidden ? homeInput : resInput;
        input.focus();
        input.select();
    });

    // ================= Search =================

    // Words that lead straight to a tab, in the three languages
    const TAB_WORDS = {
        projects: ['project', 'projects', 'projet', 'projets', 'proyecto', 'proyectos', 'portfolio'],
        experience: ['experience', 'experiences', 'experiencia', 'parcours', 'trayectoria', 'cv', 'resume', 'career'],
        skills: ['skill', 'skills', 'competence', 'competences', 'habilidades', 'stack'],
        about: ['about', 'propos', 'contact', 'contacto', 'sobre', 'hobbies', 'fun', 'drole', 'divertido'],
    };

    function queryWords(query) {
        return norm(query).split(/[\s?!.,]+/).filter((w) => w && !['valentin', 'bernadet', 'is', 'est', 'es', 'il'].includes(w));
    }

    function search(query) {
        const words = queryWords(query);
        if (!words.length) {
            location.hash = 'all';
            return;
        }
        const tab = Object.keys(TAB_WORDS).find((key) => words.some((w) => TAB_WORDS[key].includes(w)));
        location.hash = tab || 'search/' + encodeURIComponent(query.trim());
    }

    // ================= Building blocks =================

    function crumb(path) {
        return `<p class="crumb">valentin.dev › ${esc(path.slice(0, -1).join(' › '))}${path.length > 1 ? ' › ' : ''}<b>${esc(path[path.length - 1])}</b></p>`;
    }

    function projectLinks(p) {
        if (!p.demo) return '';
        return `<p class="result-links">
            <a href="${p.demo}" target="_blank" rel="noopener">${t('demo_s')} ↗</a>
            <a href="${p.code}" target="_blank" rel="noopener">${t('code_s')} ↗</a></p>`;
    }

    function projectResult(p, withThumb) {
        const title = tx(p.title);
        const ongoing = p.ongoing ? ` <span class="tag">${t('ongoing')}</span>` : '';
        return `<article class="result${withThumb ? ' result-thumb' : ''}" data-project="${p.id}">
            <div>
                ${crumb([t('seg_projects'), p.slug])}
                <h3><button type="button" class="hl" data-open="${p.id}">${esc(title)}</button>${ongoing}</h3>
                <p>${esc(tx(p.desc).split('. ')[0])}.</p>
                ${projectLinks(p)}
            </div>
            ${withThumb ? `<img src="${p.img}" alt="${esc(title)}" loading="lazy" data-open="${p.id}">` : ''}
        </article>`;
    }

    function experienceResult(e) {
        const bullets = tx(e.bullets);
        const body = bullets
            ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
            : `<p>${esc(tx(e.text))}</p>`;
        return `<li class="result"><p class="crumb">${esc(tx(e.when))}</p><h3>${esc(tx(e.title))}</h3>${body}</li>`;
    }

    function paaBlock() {
        return `<h2 class="block-title">${t('paa')}</h2>
        <div class="paa">${PAA[lang].map(([q, a]) =>
            `<details><summary>${esc(q)}</summary><div class="paa-body"><p>${a}</p></div></details>`
        ).join('')}</div>`;
    }

    function relatedBlock(words) {
        return `<h2 class="block-title">${t('related')}</h2>
        <div class="related">${words.map((w) =>
            `<button type="button" data-search="${esc(w)}"><i class="fas fa-magnifying-glass"></i> ${esc(w)}</button>`
        ).join('')}</div>`;
    }

    function knowledgePanel() {
        const [a, b] = [PROJECTS[0], PROJECTS[5]];
        return `<aside class="kp" aria-label="Valentin Bernadet">
            <div class="kp-images">
                <img src="${PORTRAIT}" alt="${esc(t('portrait'))}">
                <img src="${a.img}" alt="${esc(tx(a.title))}" data-open="${a.id}">
                <img src="${b.img}" alt="${esc(tx(b.title))}" data-open="${b.id}">
            </div>
            <div class="kp-body">
                <h2>Valentin Bernadet</h2>
                <p class="kp-sub">${t('kp_sub')}</p>
                <p class="kp-desc">${t('kp_desc')}<small>${t('kp_source')}</small></p>
                <dl class="kp-facts">${t('kp_facts').map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
                <div class="kp-actions">
                    <a href="mailto:${EMAIL}" class="btn btn-sm"><i class="fas fa-envelope"></i> ${t('email_btn')}</a>
                    <a href="${LINKEDIN}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost"><i class="fab fa-linkedin-in"></i> LinkedIn</a>
                    <a href="${GITHUB}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost"><i class="fab fa-github"></i> GitHub</a>
                </div>
            </div>
        </aside>`;
    }

    // ================= Panels =================

    const panels = {
        all() {
            const ifs = EXPERIENCE[0];
            return `<div class="all-grid">
                <div class="col-results">
                    <p class="didyoumean">${t('did_you_mean')} <a href="mailto:${EMAIL}">${t('hire')}</a>?</p>
                    <article class="result">
                        ${crumb([t('seg_experience'), 'ifs'])}
                        <h3><a href="#experience" class="hl">${esc(tx(ifs.title))}</a></h3>
                        <p>${esc(tx(ifs.when))}. ${esc(tx(ifs.bullets)[0])}</p>
                    </article>
                    ${projectResult(PROJECTS[0], false)}
                    ${projectResult(PROJECTS[1], false)}
                    ${paaBlock()}
                    ${relatedBlock(t('related_words'))}
                </div>
                ${knowledgePanel()}
            </div>`;
        },

        projects() {
            return PROJECTS.map((p) => projectResult(p, true)).join('');
        },

        experience() {
            return `<ol class="timeline">${EXPERIENCE.map(experienceResult).join('')}</ol>`;
        },

        skills() {
            return `<div class="terminal">
                <div class="term-bar"><span></span><span></span><span></span><p>valentin@portfolio: ~/skills</p></div>
                <pre class="term-body" id="term" aria-label="Skills"></pre>
            </div>
            <p class="hint">${t('skills_hint')}</p>`;
        },

        about() {
            return `<div class="about">
                <div class="about-text">
                    <div class="about-head"><img src="${PORTRAIT}" alt="${esc(t('portrait'))}"><h2>${t('about_hi')}</h2></div>
                    ${t('about_p').map((p) => `<p>${esc(p)}</p>`).join('')}
                    <div class="contact">
                        <h3>${t('contact_title')}</h3>
                        <dl>
                            <dt>${t('c_email')}</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd>
                            <dt>${t('c_phone')}</dt><dd><a href="tel:${PHONE.href}">${PHONE.label}</a></dd>
                            <dt>LinkedIn</dt><dd><a href="${LINKEDIN}" target="_blank" rel="noopener">valentin-bernadet</a></dd>
                            <dt>GitHub</dt><dd><a href="${GITHUB}" target="_blank" rel="noopener">BernadetValentin-design</a></dd>
                        </dl>
                    </div>
                </div>
                <div>
                    <div class="stickers" id="stickers">
                        ${INTERESTS.map(([icon, label]) => `<span class="sticker"><i class="fas ${icon}"></i> ${esc(tx(label))}</span>`).join('')}
                    </div>
                    <p class="play-cap">${t('play_cap')}</p>
                </div>
            </div>`;
        },

        search() {
            const words = queryWords(currentQuery);
            const hit = (text) => {
                const s = norm(text);
                return words.every((w) => s.includes(w));
            };
            const out = [];

            PROJECTS.forEach((p) => {
                const text = [tx(p.title), tx(p.sub), tx(p.desc), tx(p.tags).join(' '), tx(p.facts).flat().join(' ')].join(' ');
                if (hit(text)) out.push(projectResult(p, true));
            });
            EXPERIENCE.forEach((e) => {
                const text = [tx(e.title), tx(e.when), (tx(e.bullets) || []).join(' '), tx(e.text) || ''].join(' ');
                if (hit(text)) out.push(`<ol class="timeline">${experienceResult(e)}</ol>`);
            });
            const skills = SKILLS.flatMap(([, list]) => list).filter((s) => hit(s));
            if (skills.length) {
                out.push(`<article class="result">${crumb([t('seg_skills')])}
                    <h3><a href="#skills" class="hl">Skills: ${esc(skills.slice(0, 6).join(', '))}</a></h3></article>`);
            }
            PAA[lang].forEach(([q, a]) => {
                if (hit(q + ' ' + a)) {
                    out.push(`<article class="result">${crumb([t('seg_questions')])}<h3>${esc(q)}</h3><p>${a}</p></article>`);
                }
            });

            stats.textContent = t('stats_search')(out.length, currentQuery, seconds());
            if (!out.length) {
                return `<div class="empty"><h3>${esc(t('empty_h')(currentQuery))}</h3><p>${t('empty_p')}</p>
                    <div class="related">${t('related_words').map((w) =>
                        `<button type="button" data-search="${esc(w)}"><i class="fas fa-magnifying-glass"></i> ${esc(w)}</button>`).join('')}</div></div>`;
            }
            return out.join('') + relatedBlock(t('related_words'));
        },
    };

    function statsFor(tab) {
        if (tab === 'all') return t('stats_all')(seconds());
        if (tab === 'about') return t('stats_about')(seconds());
        if (tab === 'projects') return t('stats_n')(PROJECTS.length, seconds());
        if (tab === 'experience') return t('stats_n')(EXPERIENCE.length, seconds());
        if (tab === 'skills') return t('stats_n')(40, seconds());
        return '';
    }

    // "Vaaaaaalentin" with one page per tab
    function renderPager(tab) {
        const index = TABS.indexOf(tab);
        if (index < 0) {
            pager.hidden = true;
            return;
        }
        pager.hidden = false;
        const letters = ['V', ...Array(6).fill('a'), 'l', 'e', 'n', 't', 'i', 'n'];
        const prev = index > 0 ? `<a href="#${TABS[index - 1]}">${t('prev')}</a>` : '';
        const next = index < TABS.length - 1 ? `<a href="#${TABS[index + 1]}">${t('next')}</a>` : '';
        pager.innerHTML = `<span class="logo" aria-hidden="true">${letters.map((l) => `<span>${l}</span>`).join('')}</span>
            <div class="pager-row">${prev}${TABS.map((id, i) =>
                `<a href="#${id}"${i === index ? ' aria-current="page"' : ''} aria-label="${esc(t('tab_' + id))}">${i + 1}</a>`
            ).join('')}${next}</div>`;
    }

    // ================= Routing =================

    function moveTabInk(link) {
        tabInk.style.opacity = link ? 1 : 0;
        if (!link) return;
        tabInk.style.width = link.offsetWidth + 'px';
        tabInk.style.transform = `translateX(${link.offsetLeft}px)`;
    }

    // Line the tabs and results up with the end of the small logo, like the real thing
    function alignToLogo() {
        const logo = document.querySelector('.logo-sm');
        results.style.setProperty('--offset', logo.offsetWidth + 28 + 'px');
    }

    function showResults(tab) {
        home.hidden = true;
        results.hidden = false;
        alignToLogo();

        const changedTab = tab !== currentTab;
        currentTab = tab;

        document.querySelectorAll('.panel').forEach((panel) => {
            const on = panel.dataset.panel === tab;
            panel.hidden = !on;
            if (on) panel.innerHTML = panels[tab]();
        });
        if (tab !== 'search') stats.textContent = statsFor(tab);

        let current = null;
        document.querySelectorAll('.tabs a').forEach((link) => {
            const on = link.dataset.tab === tab;
            link.setAttribute('aria-selected', on);
            if (on) current = link;
        });
        moveTabInk(current);

        resInput.value = tab === 'search' ? currentQuery
            : 'valentin bernadet' + (tab === 'all' ? '' : ' ' + t('tab_' + tab).toLowerCase());

        renderPager(tab);
        if (tab === 'skills') typeTerminal();
        if (tab === 'about') startStickers();
        if (changedTab) window.scrollTo(0, 0);
    }

    function showHome() {
        results.hidden = true;
        home.hidden = false;
        currentTab = null;
        homeInput.value = '';
        window.scrollTo(0, 0);
    }

    function route() {
        const hash = decodeURIComponent(location.hash.slice(1));
        if (!hash) {
            showHome();
        } else if (hash.startsWith('search/')) {
            currentQuery = hash.slice(7);
            currentTab = null;
            showResults('search');
        } else {
            showResults(TABS.includes(hash) ? hash : 'all');
        }
    }

    window.addEventListener('hashchange', route);

    // Clicks inside the results: open a project, or run a related search
    results.addEventListener('click', (e) => {
        const opener = e.target.closest('[data-open]');
        if (opener) {
            e.preventDefault();
            openProject(opener.dataset.open);
            return;
        }
        const related = e.target.closest('[data-search]');
        if (related) search(related.dataset.search);
    });

    window.addEventListener('resize', () => {
        if (results.hidden) return;
        alignToLogo();
        moveTabInk(document.querySelector('.tabs a[aria-selected="true"]'));
    });

    // ================= Skills: a terminal that types itself =================

    function terminalLines() {
        const lines = ['<span class="c">$</span> cat skills.json', '{'];
        SKILLS.forEach(([key, list]) => {
            const items = list.map((s) => `<span class="s">"${s}"</span>`).join('<span class="m">, </span>');
            lines.push(`  <span class="k">"${key}"</span>: [${items}],`);
        });
        const l = SKILL_LANGS[lang];
        lines.push(`  <span class="k">"languages"</span>: { <span class="s">"fr": "${l.fr}"</span>, ` +
            `<span class="s">"es": "${l.es}"</span>, <span class="s">"en": "${l.en}"</span> }`);
        lines.push('}');
        lines.push('<span class="c">$</span> <span class="caret"></span>');
        // Each line is a block with a hanging indent, so wrapped skills stay aligned
        return lines.map((html) => `<span class="ln">${html}</span>`);
    }

    let typingTimer;
    function typeTerminal() {
        clearTimeout(typingTimer);
        const term = document.getElementById('term');
        const lines = terminalLines();
        if (reduceMotion) {
            term.innerHTML = lines.join('');
            return;
        }
        let i = 0;
        (function next() {
            term.innerHTML = lines.slice(0, i + 1).join('');
            i += 1;
            if (i < lines.length) typingTimer = setTimeout(next, i === 1 ? 400 : 150);
        })();
    }

    // ================= About: stickers you can grab and throw =================

    function startStickers() {
        const box = document.getElementById('stickers');
        const W = () => box.clientWidth;
        const H = () => box.clientHeight;

        const bodies = [...box.querySelectorAll('.sticker')].map((el, i) => ({
            el,
            w: el.offsetWidth,
            h: el.offsetHeight,
            x: Math.max(0, Math.min(((i % 3) + 0.5) * W() / 3 - el.offsetWidth / 2, W() - el.offsetWidth)),
            y: reduceMotion ? H() - 50 - Math.floor(i / 3) * 50 : 16 + Math.floor(i / 3) * 60,
            vx: reduceMotion ? 0 : (Math.random() - 0.5) * 2,
            vy: 0,
            rot: (Math.random() - 0.5) * 14,
            drag: false,
        }));

        const place = (b) => { b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`; };
        bodies.forEach(place);

        bodies.forEach((b) => {
            let offX = 0, offY = 0, lastX = 0, lastY = 0, lastT = 0, moved = false;

            b.el.addEventListener('pointerdown', (e) => {
                b.el.setPointerCapture(e.pointerId);
                b.drag = true;
                moved = false;
                b.el.classList.add('is-dragging');
                const r = box.getBoundingClientRect();
                offX = e.clientX - r.left - b.x;
                offY = e.clientY - r.top - b.y;
                lastX = e.clientX;
                lastY = e.clientY;
                lastT = performance.now();
            });

            b.el.addEventListener('pointermove', (e) => {
                if (!b.drag) return;
                const r = box.getBoundingClientRect();
                const now = performance.now();
                const dt = Math.max(8, now - lastT);
                b.x = Math.min(Math.max(0, e.clientX - r.left - offX), W() - b.w);
                b.y = Math.min(Math.max(0, e.clientY - r.top - offY), H() - b.h);
                // Remember the hand's speed so the sticker keeps it when thrown
                b.vx = (e.clientX - lastX) / dt * 16;
                b.vy = (e.clientY - lastY) / dt * 16;
                if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > 2) moved = true;
                lastX = e.clientX;
                lastY = e.clientY;
                lastT = now;
                place(b);
            });

            const release = () => {
                if (!b.drag) return;
                b.drag = false;
                b.el.classList.remove('is-dragging');
                // A tap without moving makes it jump
                if (!moved && !reduceMotion) {
                    b.vy = -9;
                    b.vx = (Math.random() - 0.5) * 8;
                    b.rot += (Math.random() - 0.5) * 30;
                }
                if (reduceMotion) b.vx = b.vy = 0;
            };
            b.el.addEventListener('pointerup', release);
            b.el.addEventListener('pointercancel', release);
        });

        if (reduceMotion) return;

        (function step() {
            if (!box.isConnected) return;
            for (const b of bodies) {
                if (b.drag) continue;
                b.vy += 0.35;
                b.vx *= 0.985;
                b.vy *= 0.985;
                b.x += b.vx;
                b.y += b.vy;
                const maxX = W() - b.w;
                const maxY = H() - b.h;
                if (b.x < 0) { b.x = 0; b.vx = -b.vx * 0.7; }
                if (b.x > maxX) { b.x = maxX; b.vx = -b.vx * 0.7; }
                if (b.y < 0) { b.y = 0; b.vy = -b.vy * 0.7; }
                if (b.y > maxY) {
                    b.y = maxY;
                    b.vy = -b.vy * 0.55;
                    b.vx *= 0.9;
                    b.rot *= 0.92;
                    if (Math.abs(b.vy) < 0.6) b.vy = 0;
                }
            }
            // Push overlapping stickers apart
            for (let pass = 0; pass < 4; pass++) {
                for (let i = 0; i < bodies.length; i++) {
                    for (let j = i + 1; j < bodies.length; j++) {
                        const a = bodies[i], c = bodies[j];
                        const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
                        const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
                        if (ox <= 0 || oy <= 0) continue;
                        const ka = a.drag ? 0 : c.drag ? 1 : 0.5;
                        const kc = 1 - ka;
                        if (ox < oy) {
                            const d = a.x < c.x ? -1 : 1;
                            a.x += d * ox * ka;
                            c.x -= d * ox * kc;
                            const v = a.vx;
                            if (!a.drag) a.vx = c.vx * 0.8;
                            if (!c.drag) c.vx = v * 0.8;
                        } else {
                            const d = a.y < c.y ? -1 : 1;
                            a.y += d * oy * ka;
                            c.y -= d * oy * kc;
                            const v = a.vy;
                            if (!a.drag) a.vy = c.vy * 0.6;
                            if (!c.drag) c.vy = v * 0.6;
                        }
                    }
                }
            }
            for (const b of bodies) {
                b.x = Math.min(Math.max(0, b.x), W() - b.w);
                b.y = Math.min(Math.max(0, b.y), H() - b.h);
                place(b);
            }
            requestAnimationFrame(step);
        })();
    }

    // ================= Project page =================

    function openProject(id) {
        const index = PROJECTS.findIndex((p) => p.id === id);
        if (index < 0) return;
        const p = PROJECTS[index];
        const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
        const next = PROJECTS[(index + 1) % PROJECTS.length];
        const title = tx(p.title);

        drawerBody.innerHTML = `
            <div class="drawer-top">
                <div class="drawer-nav">
                    <button type="button" class="btn btn-sm btn-ghost" data-go="${prev.id}" aria-label="${esc(t('prev') + ': ' + tx(prev.title))}">← ${t('prev')}</button>
                    <button type="button" class="btn btn-sm btn-ghost" data-go="${next.id}" aria-label="${esc(t('next') + ': ' + tx(next.title))}">${t('next')} →</button>
                </div>
                <button type="button" class="btn btn-sm btn-ghost" data-close>${t('close')} ✕</button>
            </div>
            <div class="drawer-img"><img src="${p.img}" alt="${esc(title)}"></div>
            <h2 id="drawer-title">${esc(title)}${p.ongoing ? ` <span class="tag">${t('ongoing')}</span>` : ''}</h2>
            <p class="lead">${esc(tx(p.sub))}</p>
            <div class="chips">${tx(p.tags).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
            <p class="desc">${esc(tx(p.desc))}</p>
            ${p.demo ? `<div class="drawer-links">
                <a href="${p.demo}" target="_blank" rel="noopener" class="btn btn-sm">${t('demo')} ↗</a>
                <a href="${p.code}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost">${t('code')} ↗</a></div>` : ''}
            <dl class="facts">${tx(p.facts).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
            <p class="drawer-tip">${t('drawer_tip')}</p>`;

        drawerBody.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => openProject(btn.dataset.go)));
        drawerBody.querySelector('[data-close]').addEventListener('click', () => drawer.close());

        drawer.dataset.current = id;
        if (!drawer.open) drawer.showModal();
        drawer.scrollTop = 0;
        drawerBody.querySelector('[data-close]').focus();
    }

    // Click on the dimmed background closes the page
    drawer.addEventListener('click', (e) => {
        if (e.target === drawer) drawer.close();
    });

    drawer.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const index = PROJECTS.findIndex((p) => p.id === drawer.dataset.current);
        const step = e.key === 'ArrowRight' ? 1 : -1;
        openProject(PROJECTS[(index + step + PROJECTS.length) % PROJECTS.length].id);
    });

    // ================= Start =================

    applyStatic();
    restartPlaceholder();
    route();
    document.fonts.ready.then(() => {
        if (results.hidden) return;
        alignToLogo();
        moveTabInk(document.querySelector('.tabs a[aria-selected="true"]'));
    });
});
