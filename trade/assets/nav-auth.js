(function () {
  var STRATEGY = '/b2b-strategy.html';
  var TRAINING = '/training.html';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function currentFile() {
    var path = location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function insert(nav) {
    if (nav.querySelector('a[href="' + STRATEGY + '"]')) return;
    var work = nav.querySelector('a[href="/agents.html"]');
    if (!work) return;
    var file = currentFile();
    var strategy = document.createElement('a');
    strategy.href = STRATEGY;
    strategy.textContent = 'Strategy';
    if (file === 'b2b-strategy.html') strategy.className = 'on';
    var training = document.createElement('a');
    training.href = TRAINING;
    training.textContent = 'Training';
    if (file === 'training.html') training.className = 'on';
    nav.insertBefore(strategy, work);
    nav.insertBefore(training, work);
  }

  ready(function () {
    var nav = document.querySelector('.navlinks');
    if (!nav) return;
    if (nav.querySelector('a[href="' + STRATEGY + '"]')) return;
    fetch(STRATEGY, { credentials: 'same-origin', cache: 'no-store' })
      .then(function (res) {
        if (res.ok) insert(nav);
      })
      .catch(function () {});
  });
})();
