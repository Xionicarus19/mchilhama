/* Tombol "Tambah Karya Baru": formulir kecil yang membuat halaman proyek (markdown)
   lalu membukanya sebagai file baru di GitHub (sudah terisi). Tidak mengubah apa pun sendiri.
   Tombol hanya tampil untuk pemilik: di localhost, setelah membuka /projects/?tambah=1
   (diingat di browser ini; ?tambah=0 untuk menyembunyikan), atau jika hugo.toml berisi showAddProject = true. */
(function () {
  'use strict';

  function store(v) {
    try {
      if (v === null) return localStorage.getItem('pj-admin');
      if (v) localStorage.setItem('pj-admin', '1'); else localStorage.removeItem('pj-admin');
    } catch (e) { return null; }
  }

  function init() {
    var dlg = document.querySelector('[data-pj-dialog]');
    var admin = Array.prototype.slice.call(document.querySelectorAll('[data-pj-admin]'));
    if (!dlg || !admin.length) return;

    var q = location.search.match(/[?&]tambah(?:=([^&]*))?/);
    if (q) store(q[1] !== '0');
    var host = location.hostname;
    var show = dlg.getAttribute('data-show') === 'true' ||
      host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1' ||
      store(null) === '1';
    if (!show) return;
    admin.forEach(function (el) { el.hidden = false; });

    var form = dlg.querySelector('[data-pj-form]');
    var repo = dlg.getAttribute('data-repo');
    var branch = dlg.getAttribute('data-branch') || 'main';
    var gh = dlg.querySelector('[data-pj-github]');
    var up = dlg.querySelector('[data-pj-upload]');
    var cmd = dlg.querySelector('[data-pj-cmd]');
    var copy = dlg.querySelector('[data-pj-copy]');

    function slug(t) {
      return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'proyek-baru';
    }
    function q2(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

    function build() {
      var f = form.elements;
      var labels = f.labels.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      var img = f.image.value.trim();
      if (img && img.indexOf('/') < 0) img = 'images/proyek/' + img;
      var md = '---\n' +
        'title: ' + q2(f.title.value.trim() || 'Judul Proyek') + '\n' +
        'weight: ' + (parseInt(f.weight.value, 10) || 10) + '\n' +
        'category: ' + q2(f.category.value.trim()) + '\n' +
        'icon: ' + f.icon.value + '\n' +
        'image: ' + q2(img) + '\n' +
        'labels: [' + labels.map(q2).join(', ') + ']\n' +
        'summary: ' + q2(f.summary.value.trim()) + '\n' +
        '---\n\n## Gambaran umum\n\n(Isi dengan latar belakang dan tujuan proyek ini.)\n\n' +
        '## Peran saya\n\n(Isi dengan tugas dan tanggung jawabmu.)\n\n## Hasil\n\n(Isi dengan hasil atau capaian.)\n';
      var name = slug(f.title.value);
      gh.href = 'https://github.com/' + repo + '/new/' + branch +
        '?filename=' + encodeURIComponent('content/projects/' + name + '.md') +
        '&value=' + encodeURIComponent(md);
      up.href = 'https://github.com/' + repo + '/upload/' + branch + '/static/images/proyek';
      cmd.textContent = 'hugo new projects/' + name + '.md';
      return md;
    }

    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      build();
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      var t = form.elements.title; if (t) t.focus();
    }
    function close() {
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-pj-open]'), function (b) {
      b.addEventListener('click', open);
    });
    dlg.querySelector('[data-pj-close]').addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    form.addEventListener('input', build);
    form.addEventListener('change', build);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    gh.addEventListener('click', function (e) {
      if (!form.elements.title.value.trim() || !form.elements.category.value.trim()) {
        e.preventDefault(); form.reportValidity();
      }
    });
    copy.addEventListener('click', function () {
      var md = build();
      var done = function () { copy.textContent = 'Tersalin!'; setTimeout(function () { copy.textContent = 'Salin teks'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, function () {});
      else done();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
