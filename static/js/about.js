/* Halaman Tentang: sertifikat (tampilkan yang terbaru + "Lihat semua") dan tombol Tambah Sertifikat.
   Tombol tambah hanya untuk pemilik: tampil di localhost, setelah membuka /about/?tambah=1
   (diingat di browser itu; ?tambah=0 untuk menyembunyikan), atau jika hugo.toml berisi showAddProject = true. */
(function () {
  'use strict';

  function store(v) {
    try {
      if (v === null) return localStorage.getItem('pj-admin');
      if (v) localStorage.setItem('pj-admin', '1'); else localStorage.removeItem('pj-admin');
    } catch (e) { return null; }
  }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function certs() {
    var list = document.querySelector('[data-ab-certs]');
    var btn = document.querySelector('[data-ab-more]');
    if (!list || !btn) return;
    var show = parseInt(list.getAttribute('data-show'), 10) || 4;
    var items = Array.prototype.slice.call(list.children);
    var open = false;
    function apply() {
      items.forEach(function (li, i) { li.hidden = !open && i >= show; });
      btn.textContent = open ? 'Tampilkan lebih sedikit' : 'Lihat semua sertifikat (' + items.length + ')';
    }
    btn.hidden = false;
    btn.addEventListener('click', function () { open = !open; apply(); });
    apply();
  }

  function admin() {
    var dlg = document.querySelector('[data-ab-dialog]');
    var els = all('[data-ab-admin]');
    if (!dlg || !els.length) return;
    var q = location.search.match(/[?&]tambah(?:=([^&]*))?/);
    if (q) store(q[1] !== '0');
    var h = location.hostname;
    var show = dlg.getAttribute('data-show') === 'true' || h === 'localhost' || h === '127.0.0.1' ||
      h === '[::1]' || h === '::1' || store(null) === '1';
    if (!show) return;
    els.forEach(function (el) { el.hidden = false; });

    var form = dlg.querySelector('[data-ab-form]');
    var repo = dlg.getAttribute('data-repo');
    var branch = dlg.getAttribute('data-branch') || 'main';
    var gh = dlg.querySelector('[data-ab-github]');
    var up = dlg.querySelector('[data-ab-upload]');
    var cmd = dlg.querySelector('[data-ab-cmd]');
    var copy = dlg.querySelector('[data-ab-copy]');

    var d = new Date();
    form.elements.date.value = d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1);

    function slug(t) {
      return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'sertifikat-baru';
    }
    function q2(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

    function build() {
      var f = form.elements;
      var img = f.image.value.trim();
      if (img && img.indexOf('/') < 0) img = 'images/sertifikat/' + img;
      var md = '---\n' +
        'title: ' + q2(f.title.value.trim() || 'Nama Sertifikat') + '\n' +
        'issuer: ' + q2(f.issuer.value.trim()) + '\n' +
        'date: ' + (f.date.value ? f.date.value + '-01' : '') + '\n' +
        'image: ' + q2(img) + '\n' +
        'link: ' + q2(f.link.value.trim()) + '\n' +
        '---\n' + (f.body.value.trim() ? '\n' + f.body.value.trim() + '\n' : '');
      var name = slug(f.title.value);
      gh.href = 'https://github.com/' + repo + '/new/' + branch +
        '?filename=' + encodeURIComponent('content/certificates/' + name + '.md') +
        '&value=' + encodeURIComponent(md);
      up.href = 'https://github.com/' + repo + '/upload/' + branch + '/static/images/sertifikat';
      cmd.textContent = 'hugo new certificates/' + name + '.md';
      return md;
    }

    var last = null;
    function openDlg() {
      last = document.activeElement; build();
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      form.elements.title.focus();
    }
    function close() {
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
      if (last && last.focus) last.focus();
    }
    all('[data-ab-open]').forEach(function (b) { b.addEventListener('click', openDlg); });
    dlg.querySelector('[data-ab-close]').addEventListener('click', close);
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

  function init() { certs(); admin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
