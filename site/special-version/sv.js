/* Кристалис — версия для слабовидящих: настройки отображения и озвучивание.
   Зависимостей нет. Настройки хранятся в localStorage и применяются
   атрибутами на <html> (ранняя инициализация — инлайном в <head>). */
(function () {
  'use strict';

  var root = document.documentElement;
  var live = document.getElementById('sv-live');

  /* Соответствие: имя настройки → атрибут на <html> и ключ хранилища */
  var SETTINGS = {
    fontSize:    { attr: 'data-font-size',    key: 'sv-font-size' },
    colorScheme: { attr: 'data-color-scheme', key: 'sv-color-scheme' },
    spacing:     { attr: 'data-spacing',      key: 'sv-spacing' },
    font:        { attr: 'data-font',         key: 'sv-font' }
  };

  /* Что произносит синтезатор при переключении */
  var SPOKEN = {
    fontSize:    { small: 'обычный размер шрифта', medium: 'крупный шрифт', large: 'очень крупный шрифт' },
    colorScheme: {
      'default': 'чёрным по белому',
      dark:      'белым по чёрному',
      blue:      'тёмно-синим по голубому',
      brown:     'коричневым по бежевому',
      green:     'зелёным по тёмно-коричневому'
    },
    spacing:     { normal: 'обычный интервал', wide: 'увеличенный интервал' },
    font:        { sans: 'шрифт без засечек', serif: 'шрифт с засечками' }
  };

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ── Синтез речи ────────────────────────────────────────────────── */

  var synth = window.speechSynthesis;
  var voice = null;
  var currentText = '';
  var currentButton = null;

  function pickVoice() {
    if (!synth) return;
    var voices = synth.getVoices();
    for (var i = 0; i < voices.length; i++) {
      if (/^ru/i.test(voices[i].lang)) { voice = voices[i]; return; }
    }
  }

  if (synth) {
    pickVoice();
    /* Список голосов в Chrome приезжает асинхронно */
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.addEventListener('voiceschanged', pickVoice);
    }
  }

  function soundOn() {
    return root.getAttribute('data-sound') !== 'off';
  }

  function speak(text, opts) {
    if (!synth || !text) return;
    if (!opts || !opts.force) { if (!soundOn()) return; }

    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 1;
    if (voice) u.voice = voice;

    u.addEventListener('end', resetPlaying);
    u.addEventListener('error', resetPlaying);

    currentText = text;
    synth.speak(u);
  }

  function stopSpeech() {
    if (synth) synth.cancel();
    resetPlaying();
  }

  function resetPlaying() {
    currentText = '';
    if (currentButton) {
      currentButton.classList.remove('is-playing');
      setLabel(currentButton, 'Прослушать');
      currentButton = null;
    }
  }

  function setLabel(button, text) {
    var nodes = button.childNodes;
    for (var i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].nodeType === 3) { nodes[i].nodeValue = text; return; }
    }
  }

  /* Текст блока для чтения: заголовок, абзацы и списки без служебных кнопок */
  function textOf(section) {
    var parts = [];
    var nodes = section.querySelectorAll('h2, h3, p, li, dt, dd');
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent.replace(/\s+/g, ' ').trim();
      if (t) parts.push(t);
    }
    return parts.join('. ').replace(/\.\.+/g, '.');
  }

  /* ── Переключение настроек ──────────────────────────────────────── */

  function apply(name, value, announce) {
    var cfg = SETTINGS[name];
    if (!cfg) return;

    root.setAttribute(cfg.attr, value);
    store(cfg.key, value);

    var buttons = document.querySelectorAll('[data-set="' + name + '"]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.value === value));
    }

    if (announce) {
      var phrase = (SPOKEN[name] && SPOKEN[name][value]) || '';
      if (phrase) {
        if (live) live.textContent = phrase;
        speak(phrase);
      }
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-set]');
    if (!btn) return;
    apply(btn.dataset.set, btn.dataset.value, true);
  });

  /* ── Кнопки «Прослушать» ────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-speak]');
    if (!btn) return;

    var section = document.querySelector(btn.dataset.speak);
    if (!section) return;

    if (!synth) {
      if (live) live.textContent = 'Браузер не поддерживает озвучивание текста';
      return;
    }

    /* Повторное нажатие на ту же кнопку останавливает чтение */
    if (currentButton === btn) { stopSpeech(); return; }

    resetPlaying();
    currentButton = btn;
    btn.classList.add('is-playing');
    setLabel(btn, 'Остановить');
    speak(textOf(section), { force: true });
  });

  /* ── Звук ───────────────────────────────────────────────────────── */

  var soundBtn = document.getElementById('sv-sound');
  if (soundBtn) {
    var savedSound = read('sv-sound');
    if (savedSound) root.setAttribute('data-sound', savedSound);
    syncSound();

    soundBtn.addEventListener('click', function () {
      var next = soundOn() ? 'off' : 'on';
      root.setAttribute('data-sound', next);
      store('sv-sound', next);
      syncSound();
      if (next === 'on') speak('звук включён');
      else stopSpeech();
    });
  }

  function syncSound() {
    var on = soundOn();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', 'Голосовые подсказки: ' + (on ? 'включены' : 'выключены'));
    var text = soundBtn.querySelector('.sv-sound__text');
    if (text) text.textContent = on ? 'Звук включён' : 'Звук выключен';
    var ico = soundBtn.querySelector('.sv-ico');
    if (ico) ico.textContent = on ? '🔊' : '🔇';
  }

  /* ── Наверх ─────────────────────────────────────────────────────── */

  var topBtn = document.getElementById('sv-top');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var main = document.getElementById('sv-main');
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* Escape останавливает чтение — самый ожидаемый способ прервать голос */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') stopSpeech();
  });

  /* Уход со страницы не должен оставлять голос говорить в фоне */
  window.addEventListener('beforeunload', function () {
    if (synth) synth.cancel();
  });

  /* ── Восстановление сохранённых настроек ────────────────────────── */

  for (var name in SETTINGS) {
    var saved = read(SETTINGS[name].key);
    if (saved) apply(name, saved, false);
  }
})();
