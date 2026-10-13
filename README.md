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
   | `static/js/projects-add.js`           | `static/js/projects-add.js` (tombol Tambah Karya Baru) |
   | `layouts/partials/footer.html`        | `layouts/partials/footer.html` (footer halaman dalam; timpa yang lama) |
   | `layouts/partials/project-new-url.html` | `layouts/partials/project-new-url.html` |
   | `layouts/partials/icon.html`          | `layouts/partials/icon.html` (timpa; ada ikon baru) |
   | `static/css/site-footer.css`          | `static/css/site-footer.css`               |
   | `archetypes/projects.md`              | `archetypes/projects.md`                   |
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


## Menambah karya baru (tombol "Tambah Karya Baru")

Di halaman `/projects/` ada tombol **Tambah Karya Baru** (di kanan judul) dan kartu putus-putus di akhir daftar.
Tombol ini tersembunyi untuk pengunjung biasa dan tampil jika:

- kamu membuka situs lewat `localhost` (saat `hugo server`), atau
- kamu membuka sekali `https://xionicarus19.github.io/mchilhama/projects/?tambah=1` (diingat di browser itu; `?tambah=0` untuk menyembunyikan lagi), atau
- `hugo.toml` berisi `showAddProject = true` di `[params]` (tampil untuk semua orang, tidak disarankan).

Cara pakai: klik tombol, isi judul, kategori, ikon, label, ringkasan, nama file foto, lalu:

1. **Buat halaman di GitHub**: membuka GitHub dengan file `content/projects/<judul>.md` yang sudah terisi. Tekan *Commit changes*.
2. **Unggah foto**: membuka halaman unggah ke `static/images/proyek/`. Nama file harus sama dengan yang kamu isi.
3. Tunggu 1-2 menit sampai situs ter-deploy. Kartu baru muncul otomatis, dan kategori baru otomatis menjadi chip filter.

Alternatif di komputer sendiri: `hugo new projects/nama-proyek.md` (memakai `archetypes/projects.md`), isi, lalu push.
Kategori yang sudah ada juga punya tombol cepat di kartu putus-putus. Repo dan branch default: `Xionicarus19/mchilhama` dan `main`;
ubah lewat `githubRepo` dan `githubBranch` di `[params]` bila perlu.

## Footer halaman dalam

`footer.html`: hak cipta di kiri, ikon LinkedIn / GitHub / Instagram / Email di kanan, diambil dari `hugo.toml`.
LinkedIn belum tampil karena `linkedin = ""`; isi URL-nya agar ikonnya muncul.

## Publikasi (otomatis terbaru)

Di `data/publications.yaml`, tambahkan item baru di bagian mana saja dengan `year` terisi.
Beranda otomatis menampilkan publikasi dengan tahun paling baru di "Penelitian Terbaru".


## Halaman Pengalaman (gaya LinkedIn)

Pasang: `layouts/experience/list.html`, `static/css/experience.css`, `static/js/experience.js`, `layouts/partials/icon.html` (timpa), dan folder `content/experience/`.
**Hapus berkas Pengalaman versi lama** kalau ada di repo-mu, karena bisa bentrok dan membuat halaman error / tampil rusak:
`content/experience.md`, `layouts/_default/experience.html`, `data/experience.yaml`, dan `static/css/experience-page.css`.
Sekarang `/experience/` adalah folder `content/experience/` (menu "Pengalaman" tetap jalan). Butuh Hugo 0.156 atau lebih baru (workflow-mu memakai 0.167).

Setiap pengalaman = satu file di `content/experience/`. `start` boleh ditulis `"2026-07"`, `"2026-7"`, atau `2026-07-15`. Isi file (poin deskripsi) ditulis sebagai daftar:

```
---
title: "Biodiversity Surveyor"      # jabatan
company: "PT. ITS Tekno Sains"
type: "Magang"                      # boleh kosong
logo: "images/logo/its.png"         # taruh di static/images/logo/ (kosong = ikon tas)
start: "2024-03"                    # tahun-bulan
end: "2024-11"                      # kosong = Sekarang
location: "Surabaya, Jawa Timur, Indonesia"
mode: "Lapangan"                    # Di tempat / Hybrid / Remote / Lapangan
skills: ["Survei Lapangan", "Pengolahan Data"]
media: ["images/pengalaman/foto1.jpg"]   # opsional, thumbnail
---
- Poin deskripsi pertama.
- Poin kedua.
```

Urutan otomatis dari `start` terbaru; durasi (mis. "1 thn 3 bln") dihitung otomatis. Deskripsi panjang dipotong 3 baris dengan "selengkapnya".
Kelompok lain (mis. Organisasi): isi `group: "Organisasi"` di entri, lalu daftarkan urutannya di `groups` pada `_index.md`.

Tombol **+** (dan pensil) di kanan judul, seperti LinkedIn, hanya tampil untuk pemilik (aturan sama seperti Tambah Karya Baru: localhost, `?tambah=1`, atau `showAddProject = true`).
Tombol + membuka formulir yang menyiapkan file baru di GitHub; pensil di header membuka daftar file, pensil di tiap entri langsung mengedit entri itu.
Data contoh diambil dari tangkapan layarmu; periksa tanggal, lokasi, dan nama perusahaannya.


## Halaman Tentang Saya

Pasang: `content/about.md` (timpa; **isi dan foto bisa kamu sesuaikan**), `layouts/_default/about.html`, `static/css/about.css`, `layouts/partials/icon.html` (timpa).
Semuanya diatur dari front matter `content/about.md`: `heading`, `roles`, `quote`, `photo`, `name`, `education`, `location`, `note`,
`skills` (nama + ikon), dan `details` (Pendidikan, Sertifikasi, dll; boleh dihapus). Paragraf di bawah front matter = isi "Tentang Saya".
Ikon sosial diambil dari `hugo.toml` (linkedin, instagram, github, email); yang kosong tidak tampil.
Foto: taruh di `static/images/`, isi `photo` (kosong = foto beranda). Foto persegi/potret paling pas karena dipotong bulat.

## Halaman Blog

Pasang: `layouts/blog/list.html`, `static/css/blog.css`, `static/js/blog.js`, `content/blog/_index.md` (timpa; berisi judul, pengantar, kutipan), `archetypes/blog.md`, `layouts/partials/icon.html` (timpa).
Fitur: filter kategori (chip dan sidebar), pencarian, kartu 2 kolom, sidebar Kategori (+ jumlah), Artikel Terbaru, Berlangganan.

Setiap artikel = satu file di `content/blog/`:

```
---
title: "Judul"
date: 2026-10-13
categories: ["Ekologi & Biodiversitas"]   # yang pertama dipakai; huruf harus sama agar satu kategori
image: "images/blog/nama.jpg"             # opsional, taruh di static/images/blog/
summary: "Ringkasan di kartu."            # opsional (kalau kosong diambil dari awal isi)
---
Isi artikel...
```

Kategori baru otomatis menjadi chip dan muncul di sidebar. Waktu baca dihitung otomatis.

**Tulis Artikel Baru**: tombol di toolbar dan kartu putus-putus di akhir daftar, hanya untuk pemilik (localhost, `/blog/?tambah=1`, atau `showAddProject = true`).
Isi judul, kategori, tanggal, ringkasan, gambar, dan isi artikel, lalu "Buat artikel di GitHub" (file sudah terisi, tinggal Commit) dan "Unggah gambar".
Artikel yang sangat panjang tidak muat di tautan; pakai "Salin teks" lalu tempel di editor GitHub (formulir memberi tahu otomatis).

**Berlangganan**: situs ini statis, jadi tidak ada server yang menyimpan email. Secara bawaan tombolnya membuka email ke alamat di `hugo.toml`.
Untuk daftar langganan sungguhan, buat form di layanan seperti Buttondown atau Formspree, lalu isi `newsletterAction = "https://...."` di `[params]`.


## Sertifikat Terbaru (halaman Tentang)

Pasang: `layouts/_default/about.html` (timpa), `static/css/about.css` (timpa), `static/js/about.js`, `content/about.md` (timpa, atau cukup hapus bagian "Sertifikasi" dari `details`),
`layouts/partials/icon.html` (timpa), `archetypes/certificates.md`, dan folder `content/certificates/`.

Setiap sertifikat = satu file di `content/certificates/`:

```
---
title: "Basic Offshore Safety Training"
issuer: "Penerbit"
date: 2025-03-01            # tanggal terbit; yang terbaru tampil paling atas
image: "images/sertifikat/nama.jpg"   # opsional, taruh di static/images/sertifikat/
link: "https://..."         # opsional, tautan kredensial
---
```

- Yang punya `date` tampil urut dari terbaru, yang belum diberi tanggal tampil setelahnya (urut `weight`).
- Awalnya 4 sertifikat tampil; sisanya di balik tombol "Lihat semua sertifikat". Ubah jumlahnya lewat `show:` di `content/certificates/_index.md`.
- **Lima sertifikat lamamu sudah dibuatkan filenya, tetapi tanggal dan penerbitnya kosong.** Buka tiap file, isi `issuer`, dan hapus tanda `#` di baris `date`.
- Tombol **Tambah Sertifikat** (di kanan judul) hanya untuk pemilik (localhost, `/about/?tambah=1`, atau `showAddProject = true`). Formulirnya membuat file baru di GitHub yang sudah terisi, tinggal Commit; ada juga tombol unggah gambar.
