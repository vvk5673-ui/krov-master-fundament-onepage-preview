(function () {
  var METRIKA_ID = 112416737;
  var STORAGE_KEY = 'cookie_consent';
  var PENDING_GOALS_KEY = 'metrika_pending_goals';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function getPendingGoals() {
    try {
      var goals = JSON.parse(sessionStorage.getItem(PENDING_GOALS_KEY) || '[]');
      return Array.isArray(goals) ? goals : [];
    } catch (e) {
      return [];
    }
  }

  function savePendingGoals(goals) {
    try {
      if (goals.length) sessionStorage.setItem(PENDING_GOALS_KEY, JSON.stringify(goals));
      else sessionStorage.removeItem(PENDING_GOALS_KEY);
    } catch (e) {}
  }

  function flushPendingGoals() {
    if (getConsent() !== 'accepted' || typeof window.ym !== 'function') return;
    var goals = getPendingGoals();
    savePendingGoals([]);
    goals.forEach(function (goal) {
      window.ym(METRIKA_ID, 'reachGoal', goal);
    });
  }

  window.kmTrackGoal = function (goal) {
    if (!goal || getConsent() === 'declined') return false;
    if (getConsent() === 'accepted') {
      if (typeof window.ym !== 'function') loadMetrika();
      window.ym(METRIKA_ID, 'reachGoal', goal);
      return true;
    }
    var goals = getPendingGoals();
    if (goals.indexOf(goal) === -1) goals.push(goal);
    savePendingGoals(goals);
    return false;
  };

  function loadMetrika() {
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(METRIKA_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
    flushPendingGoals();
  }

  function hideBanner() {
    var el = document.getElementById('cookie-consent-banner');
    if (el) el.remove();
  }

  function showBanner() {
    var style = document.createElement('style');
    style.id = 'cookie-consent-banner-styles';
    style.textContent =
      '#cookie-consent-banner{' +
      'position:fixed;left:50%;bottom:16px;z-index:9999;width:calc(100% - 32px);max-width:640px;' +
      'transform:translateX(-50%);box-sizing:border-box;background:#fff;color:#5D6979;' +
      'padding:8px 8px 8px 14px;display:flex;align-items:center;gap:10px;' +
      'font-family:inherit;font-size:13px;line-height:1.35;border-radius:14px;' +
      'box-shadow:0 6px 24px rgba(7,24,41,.25);}' +
      '#cookie-consent-banner>span{flex:1;min-width:0;}' +
      '#cookie-consent-banner a{color:inherit;text-decoration:underline;text-underline-offset:2px;}' +
      '#cookie-consent-accept{background:#980B11;color:#fff;border:none;padding:8px 14px;' +
      'border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;}' +
      '@media(max-width:560px){#cookie-consent-banner{left:8px;right:8px;bottom:calc(84px + env(safe-area-inset-bottom));' +
      'width:auto;max-width:none;transform:none;font-size:12px;}}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'cookie-consent-banner';
    bar.innerHTML =
      '<span>Используем cookie для аналитики. <a href="/krov-master-fundament-onepage-preview/politika-konfidencialnosti/">Подробнее</a></span>' +
      '<button type="button" id="cookie-consent-accept">Принять</button>';
    document.body.appendChild(bar);

    document.getElementById('cookie-consent-accept').addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch (e) {}
      hideBanner();
      loadMetrika();
    });
  }

  var consent = getConsent();

  if (consent === 'accepted') {
    loadMetrika();
  } else if (consent !== 'declined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
