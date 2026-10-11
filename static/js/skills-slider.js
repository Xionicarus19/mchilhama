/* Slider keahlian: tombol panah, titik halaman, keyboard, dan drag mouse.
   Geser sentuh (swipe) di HP sudah ditangani native oleh CSS scroll-snap. */
(function () {
  'use strict';

  function init(root) {
    var track = root.querySelector('.skills-track');
    var dotsWrap = root.querySelector('[data-skills-dots]');
    var section = root.closest('.skills') || document;
    var prev = section.querySelector('[data-skills-prev]');
    var next = section.querySelector('[data-skills-next]');
    if (!track) return;

    var pages = 1;
    var current = 0;

    function gap() {
      return parseFloat(getComputedStyle(track).columnGap) || 0;
    }
    function pageWidth() {
      return track.clientWidth + gap();
    }
    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function goTo(page) {
      page = Math.max(0, Math.min(pages - 1, page));
      track.scrollTo({ left: Math.min(page * pageWidth(), maxScroll()) });
    }

    /* Susun kartu per baris (kiri ke kanan, lalu baris berikutnya) di tiap halaman */
    function layoutCards() {
      var cs = getComputedStyle(section);
      var cols = parseInt(cs.getPropertyValue('--sk-cols'), 10) || 3;
      var rows = parseInt(cs.getPropertyValue('--sk-rows'), 10) || 1;
      var perPage = cols * rows;
      var cards = track.querySelectorAll('.skill-card');
      Array.prototype.forEach.call(cards, function (card, i) {
        var page = Math.floor(i / perPage);
        var k = i % perPage;
        card.style.gridRow = Math.floor(k / cols) + 1;
        card.style.gridColumn = page * cols + (k % cols) + 1;
      });

      /* Penyangga tak terlihat di kolom terakhir, supaya halaman terakhir
         yang kartunya sedikit tetap berhenti di awal halaman (tidak mundur). */
      var spacer = track.querySelector('.skills-spacer');
      if (!spacer) {
        spacer = document.createElement('div');
        spacer.className = 'skills-spacer';
        spacer.setAttribute('aria-hidden', 'true');
        track.appendChild(spacer);
      }
      var totalPages = Math.max(1, Math.ceil(cards.length / perPage));
      spacer.style.gridRow = 1;
      spacer.style.gridColumn = totalPages * cols;
    }

    function buildDots() {
      pages = maxScroll() < 4 ? 1 : Math.ceil(maxScroll() / pageWidth()) + 1;
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      if (pages < 2) return;
      for (var i = 0; i < pages; i++) {
        (function (i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('role', 'tab');
          b.setAttribute('aria-label', 'Halaman ' + (i + 1));
          b.addEventListener('click', function () { goTo(i); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }

    function update() {
      var sl = track.scrollLeft;
      if (sl >= maxScroll() - 2) current = pages - 1;
      else current = Math.round(sl / pageWidth());
      current = Math.max(0, Math.min(pages - 1, current));

      if (prev) prev.disabled = sl <= 2;
      if (next) next.disabled = sl >= maxScroll() - 2;
      if (prev && next) {
        var single = pages < 2;
        prev.hidden = next.hidden = single;
      }
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
      }
    }

    if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    /* Drag dengan mouse (desktop) */
    var startX = 0, startLeft = 0, dragging = false, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        track.classList.add('is-dragging');
      }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        track.classList.remove('is-dragging');
        goTo(Math.round(track.scrollLeft / pageWidth()));
      }
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { layoutCards(); buildDots(); update(); }, 120);
    });

    layoutCards();
    buildDots();
    update();
    window.addEventListener('load', function () { buildDots(); update(); });
  }

  function start() {
    document.querySelectorAll('[data-skills-slider]').forEach(init);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
