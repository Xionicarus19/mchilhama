/* Halaman Pengalaman: "selengkapnya" untuk deskripsi panjang + tombol + (tambah pengalaman, hanya pemilik).
   Tombol muncul di localhost, setelah membuka halaman ini dengan ?tambah=1 (diingat di browser itu),
   atau jika hugo.toml berisi showAddProject = true. Pengunjung biasa tidak melihatnya. */
(function () {
  'use strict';

  function store(v) {
    try {
      if (v === null) return localStorage.getItem('pj-admin');
      if (v) localStorage.setItem('pj-admin', '1'); else localStorage.removeItem('pj-admin');
    } catch (e) { return null; }
  }

  function clamp() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-xp-desc]'), function (d) {
      var btn = d.nextElementSibling;
      if (!btn || !btn.hasAttribute('data-xp-more')) return;
      if (d.getAttribute('data-ready')) { if (d.classList.contains('is-clamped')) btn.hidden = !(d.scrollHeight > d.clientHeight + 2); return; }
      d.setAttribute('data-ready', '1');
      d.classList.add('is-clamped');
      var over = d.scrollHeight > d.clientHeight + 2;
      btn.hidden = !over;
      if (!over) d.classList.remove('is-clamped');
      btn.addEventListener('click', function () {
        var open = d.classList.toggle('is-clamped') === false;
        btn.textContent = open ? 'lebih sedikit' : 'selengkapnya';
      });
    });
  }

  function admin() {
    var dlg = document.querySelector('[data-xp-dialog]');
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-xp-admin]'));
    if (!dlg || !els.length) return;
    var q = location.search.match(/[?&]tambah(?:=([^&]*))?/);
    if (q) store(q[1] !== '0');
    var h = location.hostname;
    var show = dlg.getAttribute('data-show') === 'true' || h === 'localhost' || h === '127.0.0.1' ||
      h === '[::1]' || h === '::1' || store(null) === '1';
    if (!show) return;
    els.forEach(function (el) { el.hidden = false; });

    var form = dlg.querySelector('[data-xp-form]');
    var repo = dlg.getAttribute('data-repo');
    var branch = dlg.getAttribute('data-branch') || 'main';
    var gh = dlg.querySelector('[data-xp-github]');
    var up = dlg.querySelector('[data-xp-upload]');
    var cmd = dlg.querySelector('[data-xp-cmd]');
    var copy = dlg.querySelector('[data-xp-copy]');

    function slug(t) {
      return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'pengalaman-baru';
    }
    function q2(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

    function build() {
      var f = form.elements;
      var skills = f.skills.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      var logo = f.logo.value.trim();
      if (logo && logo.indexOf('/') < 0) logo = 'images/logo/' + logo;
      var lines = f.desc.value.split('\n').map(function (x) { return x.trim().replace(/^[-•*]\s*/, ''); }).filter(Boolean);
      var md = '---\n' +
        'title: ' + q2(f.title.value.trim() || 'Jabatan') + '\n' +
        'company: ' + q2(f.company.value.trim()) + '\n' +
        'type: ' + q2(f.type.value) + '\n' +
        'logo: ' + q2(logo) + '\n' +
        'start: ' + q2(f.start.value) + '\n' +
        'end: ' + q2(f.end.value) + '\n' +
        'location: ' + q2(f.location.value.trim()) + '\n' +
        'mode: ' + q2(f.mode.value) + '\n' +
        'skills: [' + skills.map(q2).join(', ') + ']\n' +
        '---\n\n' + lines.map(function (x) { return '- ' + x; }).join('\n') + '\n';
      var name = slug(f.company.value + ' ' + f.title.value);
      gh.href = 'https://github.com/' + repo + '/new/' + branch +
        '?filename=' + encodeURIComponent('content/experience/' + name + '.md') +
        '&value=' + encodeURIComponent(md);
      up.href = 'https://github.com/' + repo + '/upload/' + branch + '/static/images/logo';
      cmd.textContent = 'hugo new experience/' + name + '.md';
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
    Array.prototype.forEach.call(document.querySelectorAll('[data-xp-open]'), function (b) { b.addEventListener('click', open); });
    dlg.querySelector('[data-xp-close]').addEventListener('click', close);
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

  function init() { clamp(); admin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('load', clamp);
})();
