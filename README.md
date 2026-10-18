# Alight Motion Website

Replika web dari **Alight Motion** — editor + player berbasis browser yang berusaha menjadi sedekat mungkin dengan aplikasi aslinya, tanpa perlu install aplikasi.

---

## Latar Belakang

Alight Motion sampai saat ini **hanya tersedia sebagai aplikasi mobile** (Android/iOS). Tim Alight Motion tidak berencana membuat versi PC/web, tetapi mereka **membolehkan siapa saja** untuk membuat replika versi web selama memahami caranya. Berangkat dari situ, project ini dimulai: membuat "Alight Motion versi web" yang bisa dipakai untuk menonton, mengedit, dan mengekspor preset secara nyata di browser.

Project ini dikerjakan oleh **DGXO** dan tim, berbasis pada hasil analisis terhadap runtime web (player/rendering) yang dipakai situs resmi Alight Motion. Tujuannya bukan sekadar menyalin, melainkan membangun ulang *Alight Motion yang bisa diakses dari mana saja*.

---

## Status Saat Ini

Versi sekarang sudah berfungsi sebagai **Alight Motion player**:

- Muat preset **XML / AMFX** (termasuk preset dari link share Alight Motion).
- Render penuh di WebGL (2D scene, efek GPU, video, audio, teks) dengan hasil **pixel-identik** dengan runtime web resmi.
- Semua tab utama: **Proyek, Media, Audio, Layer, Ekspor**.
- Timed codecression timeline, seek, play, loop, zoom.
- Ganti media per layer: **drag & drop** (desktop) atau **klik kanan / long-press** lalu pilih dari galeri — foto/video baru menggantikan media layer yang dipilih tanpa mengganggu layer lain.
- Ekspor video MP4 (WebCodecs + FFmpeg WASM fallback), dengan gabungan audio.
- Simple mode, debug layer, mode eksperimental, dan API otomasi (`window.AM`).

Namun **belum** menjadi editor penuh. Core rendering + parser sudah siap, tapi tool editing (gambar, buat shape, kurva, keyframe) dan katalog aset lengkap masih dalam pengerjaan.

---

## Arsitektur

```
index.html          – antarmuka utama (layout, tab, panel, timeline)
preset.js           – runtime utama: parser scene, UI, timeline, media, export, API
chunk.js            – inti rendering: parser efek, kompiler shader GLSL, math/noise
ffmpeg-export-v2.js – exporter FFmpeg WASM (fallback encode + mux audio)
preview-LSW44VKB.js – previewer efek realtime (halaman /preview.html)
server.cjs          – server statis ringan + proxy/cache aset untuk asset yang tidak ada lokal
effects/            – cache binari efek (definisi efek)
preset/             – preset contoh + media
effect-index.json   – indeks katalog efek
shape-index.json    – indeks katalog shape
```

Kunci dari project ini ada di **dua bagian besar**:

- **Rendering engine** — menerjemahkan scene XML (layer, shape, transform, easing, keyframe, efek) menjadi frame WebGL yang sama seperti AM. Bagian ini sudah berfungsi dan akurat.
- **Katalog aset** — definisi efek (AMFX/bin) dan shape yang dibutuhkan agar *semua* efek & bentuk AM bisa muncul di web. Katalog ini sedang dilengkapi (sebagian efek lama mungkin belum tersedia).

---

## Menjalankan

```bash
node server.cjs
# buka http://localhost:3000/
```

Server melayani file lokal, dan untuk aset yang tidak ada lokal akan di-proxy ke server aset AM (dengan caching). Mode simple: `?mode=simple`.

---

## Roadmap

- [x] Player: load, render, play, seek, export
- [x] Ganti media per-layer (drop / right-click)
- [ ] Katalog efek & shape AM lengkap
- [ ] Editor: tambah shape, teks, efek ke scene
- [ ] Transform layer (posisi/rotasi/scale) via stage
- [ ] Timeline editing (durasi, reorder, keyframe)
- [ ] Serialisasi kembali ke XML AM (file tetap bisa dibuka di app asli)

---

## Catatan

- Project ini adalah implementasi web independen; bukan versi resmi dari Alight Motion.
- Hasil render divalidasi kesetaraan frame demi frame dengan runtime web resmi AM.