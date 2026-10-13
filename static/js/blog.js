/* Halaman Blog: filter kategori (chip + sidebar), pencarian, form Berlangganan, dan tombol Tulis Artikel Baru.
   Tombol artikel baru hanya untuk pemilik: tampil di localhost, setelah membuka /blog/?tambah=1
   (diingat di browser itu; ?tambah=0 untuk menyembunyikan), atau jika hugo.toml berisi showAddProject = true. */
(function () {
  'use strict';

  function store(v) {
    try {
      if (v === null) return localStorage.getItem('pj-admin');
      if (v) localStorage.setItem('pj-admin', '1'); else localStorage.removeItem('pj-admin');
    } catch (e) { return null; }
  }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Filter + pencarian ---------- */
  function filtering() {
    var cards = all('.bl-card');
    var buttons = all('[data-filter]');
    var input = document.querySelector('[data-bl-search]');
    var none = document.querySelector('[data-bl-none]');
    var current = 'all';

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : '';
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (current === 'all' || c.getAttribute('data-cat') === current) &&
          (!term || (c.getAttribute('data-text') || '').indexOf(term) > -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      buttons.forEach(function (b) {
        if (b.classList.contains('bl-chip')) b.setAttribute('aria-pressed', b.getAttribute('data-filter') === current ? 'true' : 'false');
      });
      if (none) none.hidden = shown > 0 || !cards.length;
    }
    function set(key, push) {
      current = key; apply();
      if (push) {
        try { history.replaceState(null, '', key === 'all' ? location.pathname + location.search : '#' + key); } catch (e) { /* diabaikan */ }
      }
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-filter');
        set(current === k && !b.classList.contains('bl-chip') ? 'all' : k, true);
      });
    });
    if (input) input.addEventListener('input', apply);

    var hash = '';
    try { hash = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { hash = ''; }
    var known = buttons.some(function (b) { return b.getAttribute('data-filter') === hash; });
    set(known ? hash : 'all', false);
  }

  /* ---------- Berlangganan ---------- */
  function subscribe() {
    var f = document.querySelector('[data-bl-sub]');
    if (!f || f.getAttribute('action')) return;   /* ada newsletterAction: kirim apa adanya */
    var to = f.getAttribute('data-mailto');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!to) return;
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Berlangganan update blog') +
        '&body=' + encodeURIComponent('Mohon tambahkan email ini ke daftar update blog: ' + f.elements.email.value);
    });
  }

  /* ---------- Tulis artikel baru ---------- */
  function admin() {
    var dlg = document.querySelector('[data-bl-dialog]');
    var els = all('[data-bl-admin]');
    if (!dlg || !els.length) return;
    var q = location.search.match(/[?&]tambah(?:=([^&]*))?/);
    if (q) store(q[1] !== '0');
    var h = location.hostname;
    var show = dlg.getAttribute('data-show') === 'true' || h === 'localhost' || h === '127.0.0.1' ||
      h === '[::1]' || h === '::1' || store(null) === '1';
    if (!show) return;
    els.forEach(function (el) { el.hidden = false; });

    var form = dlg.querySelector('[data-bl-form]');
    var repo = dlg.getAttribute('data-repo');
    var branch = dlg.getAttribute('data-branch') || 'main';
    var gh = dlg.querySelector('[data-bl-github]');
    var up = dlg.querySelector('[data-bl-upload]');
    var cmd = dlg.querySelector('[data-bl-cmd]');
    var copy = dlg.querySelector('[data-bl-copy]');
    var note = dlg.querySelector('[data-bl-note]');
    var MAXURL = 7000;

    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var d = new Date();
    form.elements.date.value = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

    function slug(t) {
      return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'artikel-baru';
    }
    function q2(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

    function build() {
      var f = form.elements;
      var img = f.image.value.trim();
      if (img && img.indexOf('/') < 0) img = 'images/blog/' + img;
      var head = '---\n' +
        'title: ' + q2(f.title.value.trim() || 'Judul Artikel') + '\n' +
        'date: ' + (f.date.value || '') + '\n' +
        'categories: [' + q2(f.category.value.trim()) + ']\n' +
        'image: ' + q2(img) + '\n' +
        'summary: ' + q2(f.summary.value.trim()) + '\n' +
        'draft: false\n---\n\n';
      var body = f.body.value.trim() || 'Tulis artikelmu di sini.';
      var md = head + body + '\n';
      var name = slug(f.title.value);
      var base = 'https://github.com/' + repo + '/new/' + branch + '?filename=' + encodeURIComponent('content/blog/' + name + '.md') + '&value=';
      var url = base + encodeURIComponent(md);
      var tooLong = url.length > MAXURL;
      if (tooLong) url = base + encodeURIComponent(head + 'Tempel isi artikel di sini (Salin teks dari formulir).\n');
      gh.href = url;
      note.hidden = !tooLong;
      up.href = 'https://github.com/' + repo + '/upload/' + branch + '/static/images/blog';
      cmd.textContent = 'hugo new blog/' + name + '.md';
      return md;
    }

    var last = null;
    function open() {
      last = document.activeElement; build();
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      form.elements.title.focus();
    }
    function close() {
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
      if (last && last.focus) last.focus();
    }
    all('[data-bl-open]').forEach(function (b) { b.addEventListener('click', open); });
    dlg.querySelector('[data-bl-close]').addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    form.addEventListener('input', build);
    form.addEventListener('change', build);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    gh.addEventListener('click', function (e) {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); }
    });
    copy.addEventListener('click', function () {
      var md = build();
      var done = function () { copy.textContent = 'Tersalin!'; setTimeout(function () { copy.textContent = 'Salin teks'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, function () {});
      else done();
    });
  }

  function init() { filtering(); subscribe(); admin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
