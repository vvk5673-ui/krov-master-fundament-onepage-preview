(function () {
  var STORAGE_KEY = 'km_lead_attribution_v1';
  var PARAMS = [
    'yclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ];

  function readStored() {
    try {
      var value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (e) {
      return {};
    }
  }

  function captureLanding() {
    var current = readStored();
    var params = new URLSearchParams(window.location.search);
    var hasAdvertisingParams = PARAMS.some(function (name) { return params.has(name); });

    if (!hasAdvertisingParams || current.yclid || current.utm_source) return current;

    var attribution = {
      landing_path: window.location.pathname,
      captured_at: new Date().toISOString()
    };
    PARAMS.forEach(function (name) {
      var value = params.get(name);
      if (value) attribution[name] = value.slice(0, 500);
    });

    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution)); } catch (e) {}
    return attribution;
  }

  function format(attribution) {
    var labels = {
      yclid: 'yclid',
      utm_source: 'utm_source',
      utm_medium: 'utm_medium',
      utm_campaign: 'кампания',
      utm_content: 'объявление',
      utm_term: 'запрос',
      landing_path: 'первая страница'
    };
    return Object.keys(labels).map(function (name) {
      return attribution[name] ? labels[name] + ': ' + attribution[name] : '';
    }).filter(Boolean).join('; ');
  }

  captureLanding();

  window.kmLeadAttribution = {
    get: function () { return readStored(); },
    enrichSource: function (source) {
      var details = format(readStored());
      if (!details) return source || '';
      return (source ? source + '\n' : '') + 'Рекламная атрибуция: ' + details;
    }
  };
})();
