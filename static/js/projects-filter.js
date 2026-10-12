/* Filter kategori di halaman Karya & Proyek.
   Klik chip untuk menampilkan hanya proyek dengan kategori itu. Tautan #kategori juga didukung
   (contoh: /projects/#riset). Tanpa JavaScript, semua proyek tetap tampil. */
(function () {
  'use strict';

  function init() {
    var bar = document.querySelector('[data-pj-filter]');
    if (!bar) return;
    var chips = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.pj-card'));
    var status = document.querySelector('[data-pj-status]');

    function apply(key, updateHash) {
      var shown = 0;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-filter') === key ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        var show = key === 'all' || card.getAttribute('data-cat') === key;
        card.hidden = !show;
        if (show) shown++;
      });
      if (status) status.textContent = shown + ' proyek ditampilkan';
      if (updateHash) {
        try {
          history.replaceState(null, '', key === 'all'
            ? location.pathname + location.search
            : '#' + key);
        } catch (e) { /* diabaikan */ }
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { apply(chip.getAttribute('data-filter'), true); });
    });

    var hash = '';
    try { hash = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { hash = ''; }
    var known = chips.some(function (c) { return c.getAttribute('data-filter') === hash; });
    apply(known ? hash : 'all', false);
    if (status && !known) status.textContent = '';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
