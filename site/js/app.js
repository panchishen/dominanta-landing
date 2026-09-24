/* Кристалис — лендинг. Вся интерактивность без зависимостей. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Тема (демо-переключатель для заказчика) ----------
     Управление живёт в панели настроек: кнопки .cfg__seg-btn[data-theme-set].
     Клик по ним перехватывает initConfig и зовёт applyTheme. */
  function syncThemeUI() {
    const cur = document.documentElement.getAttribute('data-theme') || 'kristalis';
    $$('.cfg__seg-btn[data-theme-set]').forEach(b => {
      const on = b.dataset.themeSet === cur;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }
  function applyTheme(t) {
    if (t === 'kristalis') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('kr-theme', t);
    syncThemeUI();
  }
  function initThemes() {
    const saved = localStorage.getItem('kr-theme');
    if (saved && saved !== 'kristalis') document.documentElement.setAttribute('data-theme', saved);
    syncThemeUI();
  }

  /* ---------- Плавающий (sticky) Header — появляется после Hero ---------- */
  function initFloatingHeader() {
    const fh = $('#floatingHeader');
    const hero = $('#hero');
    if (!fh || !hero) return;
    const onScroll = () => {
      // появляется, когда Hero почти прокручен за верх вьюпорта
      fh.classList.toggle('is-visible', hero.getBoundingClientRect().bottom < 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------- Бургер-меню (мобильный хедер) ---------- */
  function initBurger() {
    $$('[data-burger]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nav = btn.closest('.hdr')?.querySelector('.hdr__nav');
        const open = btn.classList.toggle('is-open');
        if (nav) nav.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-locked', open);
      });
    });
    // клик по якорной ссылке закрывает меню
    $$('.hdr__nav a').forEach(a => a.addEventListener('click', () => {
      $$('[data-burger].is-open').forEach(b => b.classList.remove('is-open'));
      $$('.hdr__nav.is-open').forEach(n => n.classList.remove('is-open'));
      document.body.classList.remove('nav-locked');
    }));
  }

  /* ---------- Якорная навигация (плавный скролл с учётом хедера) ---------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
        history.replaceState(null, '', id);
      });
    });
  }

  /* ---------- Аккордеон (Услуги, FAQ) ---------- */
  function initAccordion() {
    $$('.accordion').forEach(acc => {
      const single = acc.dataset.single !== 'false';
      const items = $$('.accordion__item', acc);
      items.forEach(item => {
        const head = $('.accordion__head', item);
        const panel = $('.accordion__panel', item);
        if (!head || !panel) return;
        // изначально открытый пункт показываем сразу (без анимации)
        if (item.classList.contains('is-open')) {
          panel.style.maxHeight = 'none';
          head.setAttribute('aria-expanded', 'true');
        }
        const onToggle = () => {
          const isOpen = item.classList.contains('is-open');
          if (single) items.forEach(i => { if (i !== item) closePanel(i); });
          isOpen ? closePanel(item) : openPanel(item);
        };
        head.addEventListener('click', onToggle);
        const toggleBtn = $('.icon-toggle', item);
        if (toggleBtn && !head.contains(toggleBtn)) toggleBtn.addEventListener('click', onToggle);
      });
    });
    function openPanel(item) {
      const panel = $('.accordion__panel', item);
      const head = $('.accordion__head', item);
      item.classList.add('is-open');
      head?.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.addEventListener('transitionend', function te() {
        if (item.classList.contains('is-open')) panel.style.maxHeight = 'none';
        panel.removeEventListener('transitionend', te);
      });
    }
    function closePanel(item) {
      const panel = $('.accordion__panel', item);
      const head = $('.accordion__head', item);
      if (!item.classList.contains('is-open')) return;
      panel.style.maxHeight = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.maxHeight = '0px'; });
      item.classList.remove('is-open');
      head?.setAttribute('aria-expanded', 'false');
    }
  }

  /* ---------- Телефон: маска +7 (___) ___-__-__ + валидация ---------- */
  function digitsRu(raw) {
    let d = raw.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] === '7') d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatRu(raw) {
    const d = digitsRu(raw);
    if (!d) return '';
    let s = '+7 (' + d.slice(0, 3);
    if (d.length >= 3) s += ')';
    if (d.length > 3) s += ' ' + d.slice(3, 6);
    if (d.length > 6) s += '-' + d.slice(6, 8);
    if (d.length > 8) s += '-' + d.slice(8, 10);
    return s;
  }
  function phoneValid(input) { return digitsRu(input.value).length === 10; }

  function bindPhone(input) {
    if (!input || input.dataset.phoneBound) return;
    input.dataset.phoneBound = '1';
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('autocomplete', 'tel');
    input.placeholder = input.placeholder || '+7 (___) ___-__-__';

    input.addEventListener('focus', () => { if (!input.value) input.value = '+7 '; });
    input.addEventListener('blur', () => {
      if (digitsRu(input.value).length === 0) input.value = '';
      validateField(input, !input.value || phoneValid(input)); // пусто на blur — не ошибка
    });
    input.addEventListener('input', () => {
      const before = input.value;
      const formatted = formatRu(before);
      input.value = formatted;
      // курсор в конец (простая и предсказуемая стратегия для масок)
      const len = input.value.length;
      try { input.setSelectionRange(len, len); } catch (e) {}
      if (input.classList.contains('is-error') && phoneValid(input)) validateField(input, true);
    });
    input.addEventListener('paste', e => {
      e.preventDefault();
      const txt = (e.clipboardData || window.clipboardData).getData('text');
      input.value = formatRu(txt);
    });
  }
  function validateField(field, ok, msg) {
    const wrap = field.closest('.field') || field.parentElement;
    field.classList.toggle('is-error', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    const err = wrap && wrap.querySelector('.field__error');
    if (err && msg) err.textContent = msg;
  }

  /* ---------- Модалка записи (вызов по любой CTA) ---------- */
  let lastFocus = null;
  function openModal() {
    const m = $('#bookingModal');
    if (!m) return;
    lastFocus = document.activeElement;
    resetModal(m);
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');
    const first = m.querySelector('input, button, [tabindex]');
    setTimeout(() => first && first.focus(), 60);
    document.addEventListener('keydown', onKey);
  }
  function closeModal() {
    const m = $('#bookingModal');
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-locked');
    document.removeEventListener('keydown', onKey);
    if (lastFocus) try { lastFocus.focus(); } catch (e) {}
  }
  function onKey(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') trapFocus(e);
  }
  function trapFocus(e) {
    const m = $('#bookingModal');
    const f = $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', m)
      .filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function resetModal(m) {
    m.querySelector('.modal__form').hidden = false;
    m.querySelector('.modal__success').hidden = true;
    const form = m.querySelector('form');
    if (form) { form.reset(); $$('.is-error', form).forEach(el => el.classList.remove('is-error')); }
  }
  function initModal() {
    const m = $('#bookingModal');
    if (!m) return;
    $$('[data-open-modal]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(); }));
    $$('[data-close-modal]', m).forEach(b => b.addEventListener('click', closeModal));
    m.addEventListener('click', e => { if (e.target === m || e.target.classList.contains('modal__scrim')) closeModal(); });

    const form = m.querySelector('form');
    const phone = form.querySelector('.js-phone');
    bindPhone(phone);
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Обязателен только телефон (по макету)
      if (!phoneValid(phone)) { validateField(phone, false, 'Введите номер полностью'); phone.focus(); return; }
      validateField(phone, true);
      // успех
      m.querySelector('.modal__form').hidden = true;
      const ok2 = m.querySelector('.modal__success');
      ok2.hidden = false;
      ok2.querySelector('[data-autofocus]')?.focus();
    });
  }

  /* ---------- Телефон в inline-формах (CTA-секция) ---------- */
  function initInlineForms() {
    $$('form[data-inline-form]').forEach(form => {
      const phone = form.querySelector('.js-phone');
      bindPhone(phone);
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!phoneValid(phone)) { validateField(phone, false, 'Введите номер полностью'); phone.focus(); return; }
        validateField(phone, true);
        form.classList.add('is-sent'); // покажем встроенное сообщение об успехе
      });
    });
  }

  /* ---------- Анимации появления (scroll reveal, со стаггером) ---------- */
  function initReveal() {
    const items = $$('.reveal');
    // стаггер внутри групп
    $$('[data-stagger]').forEach(group => {
      const step = parseInt(group.dataset.stagger, 10) || 70;
      $$('.reveal', group).forEach((el, i) => el.style.setProperty('--reveal-delay', (i * step) + 'ms'));
    });
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ---------- Карусель врачей ---------- */
  function initCarousel() {
    $$('[data-carousel]').forEach(car => {
      const track = $('.carousel__track', car);
      if (!track) return;
      const prev = $('[data-car-prev]', car), next = $('[data-car-next]', car);
      const step = () => Math.min(track.clientWidth * 0.9, 320);
      prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    });
  }

  /* ---------- Отзывы: показать больше ---------- */
  function initReviews() {
    $$('[data-reviews]').forEach(box => {
      const btn = $('[data-reviews-toggle]', box);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const expanded = box.classList.toggle('is-expanded');
        btn.textContent = expanded ? 'Свернуть отзывы' : 'Показать больше отзывов';
        // подхватить анимацию у только что показанных карточек
        if (expanded) $$('.review-card--more', box).forEach(c => c.classList.add('is-visible'));
      });
    });
  }

  /* ---------- Бегущие колонки отзывов ----------
     Раскладываем существующие карточки по 3 колонкам и дублируем содержимое каждой
     трижды: тогда сдвиг на -1/3 высоты трека — это ровно одна копия, и цикл получается
     бесшовным. Трёх копий (а не двух) достаточно, чтобы при короткой колонке в кадре
     не появлялась пустота. Разметку карточек не меняем — только переносим узлы. */
  function initReviewsMarquee() {
    const grid = $('.reviews__grid');
    if (!grid) return;
    const cards = $$('.review-card', grid);
    if (cards.length < 3) return;

    const COLS = 3, COPIES = 3;
    const durations = ['38s', '52s', '44s']; // у каждой колонки своя скорость
    const tracks = [];
    for (let i = 0; i < COLS; i++) {
      const col = document.createElement('div');
      col.className = 'reviews__col';
      const track = document.createElement('div');
      track.className = 'reviews__track';
      track.style.setProperty('--dur', durations[i]);
      col.appendChild(track);
      grid.appendChild(col);
      tracks.push(track);
    }
    cards.forEach((card, i) => tracks[i % COLS].appendChild(card));

    tracks.forEach(track => {
      const originals = [...track.children];
      for (let c = 1; c < COPIES; c++) {
        originals.forEach(node => {
          const clone = node.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true'); // дубли не читаем скринридером
          track.appendChild(clone);
        });
      }
    });
    grid.classList.add('is-marquee');
  }

  /* ---------- Счётчик акции в Hero ----------
     Акция действует до конца текущей недели: дедлайн — ближайшее воскресенье 23:59:59.
     Считаем его заново на каждом тике, а не запоминаем один раз: тогда в понедельник
     в 00:00 срок сам переносится на следующее воскресенье, и дату в тексте не нужно
     править руками. Заодно это переживает открытую на несколько суток вкладку. */
  function initHeroCountdown() {
    const boxes = $$('.js-hero-counter');
    if (!boxes.length) return;
    const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
    const pad = n => String(n).padStart(2, '0');
    const NB = ' ';

    const endOfWeek = now => {
      const d = new Date(now);
      const dow = (d.getDay() + 6) % 7;   // Пн = 0 … Вс = 6
      d.setDate(d.getDate() + (6 - dow)); // ближайшее воскресенье
      d.setHours(23, 59, 59, 999);
      return d;
    };

    const render = () => {
      const now = new Date();
      const end = endOfWeek(now);
      const left = Math.max(0, Math.floor((end - now) / 1000));
      const h = Math.floor(left / 3600);
      const m = Math.floor((left % 3600) / 60);
      const s = left % 60;
      const dateText = dateFmt.format(end).replace(' ', NB); // «10 августа» → неразрывный пробел
      boxes.forEach(box => {
        const title = box.querySelector('.hero-offer__title');
        if (title) title.textContent = 'До' + NB + dateText + ' консультация' + NB + '— бесплатно!';
        const cells = $$('.hero-offer__cell', box);
        if (cells.length >= 3) {
          cells[0].textContent = pad(h);
          cells[1].textContent = pad(m);
          cells[2].textContent = pad(s);
        }
      });
    };

    render();
    setInterval(render, 1000);
  }

  /* ---------- Интерактивный точечный паттерн (подсветка следует за курсором) ---------- */
  function initDots() {
    if (prefersReduced) return;
    $$('.hero, .pricing, .cta, .footer__card').forEach(block => {
      const move = e => {
        const r = block.getBoundingClientRect();
        block.style.setProperty('--dot-x', (e.clientX - r.left) + 'px');
        block.style.setProperty('--dot-y', (e.clientY - r.top) + 'px');
      };
      block.addEventListener('mouseenter', e => { move(e); block.classList.add('dots-active'); });
      block.addEventListener('mousemove', move);
      block.addEventListener('mouseleave', () => block.classList.remove('dots-active'));
    });
  }

  /* ---------- Ширина скроллбара в CSS ----------
     100vw включает полосу прокрутки, поэтому колонка внутри широких карточек считалась
     на её ширину больше внешней. --sbw снимает эту разницу. */
  function initScrollbarWidth() {
    const set = () => {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', (w > 0 ? w : 0) + 'px');
    };
    set();
    window.addEventListener('resize', set, { passive: true });
  }

  /* ---------- Раскрытие видео-фрейма при скролле: ширина collapsed → контейнер (высота фикс) ---------- */
  function initExpandMedia() {
    const el = $('[data-expand]');
    if (!el) return;
    const parent = el.parentElement;
    // автозапуск видео при появлении в кадре (надёжнее «autoplay»), пауза за экраном
    const vid = el.querySelector('video');
    if (vid && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { en.isIntersecting ? vid.play().catch(function () {}) : vid.pause(); });
      }, { threshold: 0.25 }).observe(el);
    }
    if (prefersReduced) { el.style.width = '100%'; return; }
    let raf = null;
    const update = () => {
      raf = null;
      const cs = getComputedStyle(parent);
      const full = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const collapsed = Math.min(450, full - 64);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.65)));
      el.style.width = (collapsed + p * (full - collapsed)) + 'px';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- Просмотр сертификата ----------
     Ссылка «Сертификаты» ведёт не на страницу, а открывает просмотрщик.
     Пока вместо файла показываем пустой лист А4 на затемнённом фоне. */
  function initCertViewer() {
    const m = document.querySelector('#certModal');
    if (!m) return;
    let opener = null;
    const onKey = e => { if (e.key === 'Escape') close(); };
    function open(btn) {
      opener = btn;
      m.classList.add('is-open');
      m.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-locked');
      document.addEventListener('keydown', onKey);
      const c = m.querySelector('[data-cert-close]');
      setTimeout(() => c && c.focus(), 60);
    }
    function close() {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
      document.removeEventListener('keydown', onKey);
      if (opener) { try { opener.focus(); } catch (e) {} opener = null; }
    }
    document.querySelectorAll('[data-cert-open]').forEach(b =>
      b.addEventListener('click', () => open(b)));
    m.querySelectorAll('[data-cert-close]').forEach(b => b.addEventListener('click', close));
    // клик мимо листа закрывает
    m.addEventListener('click', e => {
      if (e.target === m || e.target.classList.contains('modal__scrim')) close();
    });
  }

  /* ---------- Варианты блока услуг ----------
     Слоты лежат в разметке рядом; показываем нужный и помечаем секцию атрибутом,
     чтобы к варианту можно было цепляться из CSS. */
  function setServicesVariant(v) {
    const sec = $('#services');
    if (!sec) return;
    $$('.services-slot', sec).forEach(slot => {
      slot.hidden = slot.dataset.servicesSlot !== String(v);
    });
    sec.setAttribute('data-services-variant', String(v));
  }

  /* ---------- Варианты подвала ----------
     Устроено так же, как варианты блока услуг: оба слота лежат рядом,
     показываем нужный и помечаем сам footer атрибутом. */
  function setFooterVariant(v) {
    const f = document.querySelector('.footer');
    if (!f) return;
    f.querySelectorAll('.footer-slot').forEach(slot => {
      slot.hidden = slot.dataset.footerSlot !== String(v);
    });
    f.setAttribute('data-footer-variant', String(v));
  }

  /* ---------- Панель настроек (конфигуратор темы и Hero) ---------- */
  function initConfig() {
    const cfg = $('#cfg');
    if (!cfg) return;
    const toggle = $('.cfg__toggle', cfg);
    const setOpen = open => {
      cfg.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!cfg.classList.contains('is-open')));

    /* Сегменты (тема, вариант Hero) — одиночный выбор */
    $$('.cfg__seg', cfg).forEach(seg => {
      const btns = $$('.cfg__seg-btn', seg);
      btns.forEach(btn => btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        if (btn.dataset.variant) setHeroVariant(btn.dataset.variant);
        if (btn.dataset.themeSet) applyTheme(btn.dataset.themeSet);
        if (btn.dataset.servicesVariant) setServicesVariant(btn.dataset.servicesVariant);
        if (btn.dataset.footerVariant) setFooterVariant(btn.dataset.footerVariant);
      }));
    });

    /* ---- Hero: переключение вариантов 1/2/3 ---- */
    const hero = $('#hero');
    function setHeroVariant(n) {
      if (!hero) return;
      $$('.hero-slot', hero).forEach(slot => {
        const active = slot.dataset.heroVariant === n;
        slot.hidden = !active;
        slot.classList.toggle('is-active', active);
      });
      // опции «Блок под заголовком», «Счётчик», «Статистика на фото» относятся только к вариантам 1 и 2
      const applicable = n === '1' || n === '2';
      $$('[data-hero-opt-group]', cfg).forEach(group => { group.style.display = applicable ? '' : 'none'; });
    }

    /* ---- Hero: под-настройки (список/текст, кнопки, счётчик, статистика) ---- */
    function syncHeroOpt(attr, value) { if (hero) hero.setAttribute(attr, value); }

    const subRadios = $$('input[name="cfg-hero-sub"]', cfg);
    subRadios.forEach(r => r.addEventListener('change', () => { if (r.checked) syncHeroOpt('data-hero-sub', r.value); }));
    const checkedSub = subRadios.find(r => r.checked);
    if (checkedSub) syncHeroOpt('data-hero-sub', checkedSub.value);

    const btnPrimary = $('input[name="cfg-btn-primary"]', cfg);
    const btnSecondary = $('input[name="cfg-btn-secondary"]', cfg);
    const counterCheck = $('input[name="cfg-counter"]', cfg);
    const statsCheck = $('input[name="cfg-photo-stats"]', cfg);
    function bindHeroCheck(input, attr) {
      if (!input) return;
      const sync = () => syncHeroOpt(attr, input.checked ? 'on' : 'off');
      input.addEventListener('change', sync);
      sync();
    }
    bindHeroCheck(btnPrimary, 'data-hero-btn-primary');
    bindHeroCheck(btnSecondary, 'data-hero-btn-secondary');
    bindHeroCheck(counterCheck, 'data-hero-counter');
    bindHeroCheck(statsCheck, 'data-hero-stats');

    // применяем вариант, активный по умолчанию в разметке
    const activeVariantBtn = $('.cfg__seg-btn[data-variant].is-active', cfg);
    setHeroVariant(activeVariantBtn ? activeVariantBtn.dataset.variant : '1');

    document.addEventListener('keydown', e => { if (e.key === 'Escape' && cfg.classList.contains('is-open')) setOpen(false); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemes();
    initConfig();
    initFloatingHeader();
    initBurger();
    initAnchors();
    initAccordion();
    initModal();
    initInlineForms();
    initCarousel();
    initReviews();
    initReviewsMarquee();
    initCertViewer();
    initHeroCountdown();
    initReveal();
    initDots();
    initScrollbarWidth();
    initExpandMedia();
  });
})();
