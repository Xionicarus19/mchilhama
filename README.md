# Slider Keahlian (Hugo)

Menggantikan bagian "Lima jalur kerja" di beranda dengan slider: satu kartu per slide, digeser
kiri/kanan (panah, titik halaman, swipe di HP, drag mouse, tombol ← → keyboard).

Kartu diambil otomatis dari halaman di `content/projects/` (urut `weight`), jadi menambah keahlian
cukup membuat halaman proyek baru. Klik di mana saja pada kartu membuka halaman detailnya.

## Pasang (3 langkah)

1. Salin file ke proyek Hugo:

   | File di zip                           | Taruh di                                 |
   |---------------------------------------|------------------------------------------|
   | `layouts/partials/skills-slider.html` | `layouts/partials/skills-slider.html`    |
   | `static/css/skills-slider.css`        | `static/css/skills-slider.css`           |
   | `static/js/skills-slider.js`          | `static/js/skills-slider.js`             |
   | `layouts/index.html`                  | `layouts/index.html` (timpa yang lama)   |

   `layouts/index.html` di zip adalah file kamu dengan satu perubahan: blok `<section id="jalur">`
   (Lima jalur kerja) diganti menjadi `{{ partial "skills-slider.html" . }}`. Kalau `index.html`
   kamu sudah berubah sejak dikirim, cukup ganti blok itu secara manual.

2. CSS dan JS dimuat otomatis oleh partial, tidak perlu mengedit `baseof.html`.

3. Jalankan `hugo server` dan buka beranda.

## Opsi di halaman proyek (semuanya opsional)

Tambahkan di front matter, misalnya `content/projects/ekologi-biodiversitas.md`:

```yaml
---
title: "Ekologi & Biodiversitas"
weight: 1
icon: leaf                          # leaf | megaphone | translate | pen | database | kanban | chart | code | camera | book
image: "images/skills/ekologi.jpg"  # foto kecil di kanan kartu (file di static/images/skills/)
labels: ["Survei Lapangan", "IUCN", "Monitoring"]
skill_summary: "Teks pendek khusus untuk kartu"   # kalau kosong dipakai ringkasan halaman
---
```

- Tanpa `icon`, ikon dipilih dari nama file halaman (ekologi-biodiversitas, marketing-ecommerce,
  penerjemahan, desain-presentasi, entri-data, proyek-pertama), selain itu ikon grafik.
- Tanpa `image`, kartu tampil tanpa foto. Nama file foto jangan pakai spasi.
- Teks kartu dipotong 200 karakter.

## Catatan

- Kartu "Proyek Pertama" masih isi contoh dari template (menampilkan `**Teknologi:**` mentah).
  Edit atau hapus `content/projects/proyek-pertama.md`.
- Mau tampil beberapa kartu sekaligus? Ubah `--sk-cols` / `--sk-rows` di bagian atas
  `skills-slider.css` (sekarang 1 × 1). Warna ada di `--sk-accent`, `--sk-bg`, `--sk-bg-soft`.
