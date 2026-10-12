# Bagian Beranda: Keahlian, Proyek Pilihan, Riwayat Perjalanan, Penelitian Terbaru, Kontak

Menggantikan bagian "Lima jalur kerja" dan "Mari bekerja sama" di beranda dengan 4 section baru plus footer. Semua isi kartu ada di file
YAML di folder `data/`, jadi menambah atau mengubah isi tidak perlu menyentuh HTML.

## Pasang

1. Salin file ke proyek Hugo:

   | File di zip                           | Taruh di                                   |
   |---------------------------------------|--------------------------------------------|
   | `layouts/index.html`                  | `layouts/index.html` (timpa yang lama)     |
   | `layouts/partials/home-sections.html` | `layouts/partials/home-sections.html`      |
   | `layouts/partials/home-contact.html`  | `layouts/partials/home-contact.html`       |
   | `layouts/partials/icon.html`          | `layouts/partials/icon.html`               |
   | `layouts/projects/list.html`          | `layouts/projects/list.html` (halaman Karya) |
   | `static/css/projects-page.css`        | `static/css/projects-page.css`             |
   | `static/js/projects-filter.js`        | `static/js/projects-filter.js`             |
   | `content/projects/*.md` (5 contoh)    | `content/projects/` (lihat bagian Halaman Karya) |
   | `static/css/home-sections.css`        | `static/css/home-sections.css`             |
   | `static/js/skills-slider.js`          | `static/js/skills-slider.js`               |
   | `data/*.yaml` (5 file)                | `data/` (skills, featured, timeline, publications, contact) |
   | `theme/ocean.css`                     | timpa `ocean.css` kamu (transisi warna antar section) |

2. Hapus file lama yang tidak dipakai lagi (dari versi slider sebelumnya), kalau ada:
   `layouts/partials/skills-slider.html` dan `static/css/skills-slider.css`.

3. `layouts/index.html` di zip adalah file kamu dengan dua perubahan: blok `<section id="jalur">`
   diganti `{{ partial "home-sections.html" . }}`, dan blok `<section class="section cta-band">`
   (Mari bekerja sama) diganti `{{ partial "home-contact.html" . }}`. Kalau `index.html` kamu sudah
   berubah, cukup ganti dua blok itu secara manual. CSS dan JS dimuat otomatis oleh partial.

4. Jalankan `hugo server`, lalu Ctrl + Shift + R di browser.

## Mengubah isi

| Bagian                     | Edit file                | Catatan |
|----------------------------|--------------------------|---------|
| Keahlian (4 kartu)         | `data/skills.yaml`       | Lebih dari 4 kartu: slider otomatis aktif (panah, titik, swipe). Tablet 2×2, HP 1 kartu per slide. |
| Proyek Pilihan             | `data/featured.yaml`     | Foto 16:10 di `static/images/proyek/`. `link` kosong = kartu tidak bisa diklik. |
| Riwayat Perjalanan         | `data/timeline.yaml`     | Urut dari atas ke bawah seperti ditulis. |
| Kontak (Mari Berkolaborasi) | `data/contact.yaml`     | Teks, tombol, foto latar, dan tulisan kanan footer. Daftar LinkedIn / Email / GitHub / Instagram diambil dari `hugo.toml` (`linkedin`, `email`, `github`, `instagram`); yang kosong tidak tampil. Foto latar: `static/images/latar-kontak.jpg` (lebar, gelap, mis. 1920x700). |
| Penelitian Terbaru         | `data/publications.yaml` | Hanya publikasi pertama yang tampil. Foto 3:4 di `static/images/publikasi/`. Tombol "Baca Selengkapnya" muncul kalau `link` diisi. |

Ikon yang tersedia: eco, leaf, droplets, file-search, file-text, growth, megaphone, flask, graduation,
briefcase, microscope, translate, pen, database, kanban, chart, code, camera, book.

Tanpa foto, kartu tampil dengan latar gradasi biru. Nama file foto jangan pakai spasi.

## Catatan

- Teks awal di file `data/` saya salin dari gambar referensimu. Cek ulang ejaan dan angka tahun
  (misalnya "Oseanografi", "2025" untuk publikasi, "2026" untuk Sarjana Biologi) sebelum dipublikasikan.
- Warna mengikuti variabel tema (`--cyan`, `--muted`, `--text`). Warna garis dan latar kartu ada di
  bagian atas `home-sections.css` (`--hs-line`, `--hs-card`).

## Kontak dan footer

- Di beranda, footer lama (`.site-footer`) disembunyikan dan diganti footer baru di bawah bagian kontak
  (hak cipta di kiri, ikon daun + "Nature • Data • Better Future" di kanan). Halaman lain tetap memakai
  footer lama. Kalau kamu ingin footer yang sama di semua halaman, kirim `layouts/partials/footer.html`.
- Kalau muncul dua footer di beranda, berarti footer temamu tidak memakai class `site-footer`.

## Halaman Karya & Proyek

Halaman `/projects/` berisi header, chip filter kategori, dan kartu 2 kolom (1 kolom di HP).
Setiap kartu adalah satu halaman di `content/projects/`, dengan front matter seperti ini:

```yaml
---
title: "Judul Proyek"
weight: 1                        # urutan, kecil tampil dulu
category: "Biodiversitas"        # WAJIB. Chip filter dibuat otomatis dari kategori yang ada
icon: leaf                       # ikon kategori (daftar ikon di atas; tambahan: sprout, flask-round)
image: "images/proyek/nama.jpg"  # foto lebar (rasio ~3:1), di static/images/proyek/
labels: ["Label 1", "Label 2"]
summary: "Ringkasan singkat di kartu."
---
```

- **Halaman tanpa `category` tidak tampil di daftar ini.** Halaman proyek lama (Ekologi & Biodiversitas,
  Marketing & E-commerce, dst.) tetap bisa dibuka lewat alamatnya, hanya tidak masuk daftar sampai kamu
  menambahkan `category`. Tautan di `data/featured.yaml` yang menunjuk ke halaman lama tetap berfungsi.
- Lima halaman contoh di zip meniru gambar referensi. Isi ulang teks, foto, dan bagian "Gambaran umum /
  Peran saya / Hasil" di tiap halaman dengan data proyekmu yang sebenarnya.
- Foto yang dipakai contoh: `survei-biodiversitas.jpg`, `mikroplastik.jpg`, `digital-marketing.jpg`
  (sama dengan foto di beranda), serta `laboratorium.jpg` dan `konservasi.jpg` (baru).
- Judul dan pengantar halaman bisa diubah di `content/projects/_index.md`:
  `heading: "Karya & Proyek"` dan `lead: "..."`.
- Chip filter hanya muncul kalau ada lebih dari satu kategori. Tautan langsung ke satu kategori
  juga bisa, mis. `/projects/#riset`.
