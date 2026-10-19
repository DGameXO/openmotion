# OpenMotion (Alight Motion Web Port)

**OpenMotion** adalah porting web mandiri dari engine & antarmuka **Alight Motion** — menghadirkan pengalaman motion design, animasi, dan video compositing profesional langsung di dalam browser modern tanpa perlu emulator maupun instalasi native.

---

## Fitur Utama

### 🎨 Rendering & Motion Engine (WebGL)
- **Akselerasi GPU Penuh:** Pipeline rendering WebGL untuk scene 2D/3D, blending mode, masking, dan efek visual realtime.
- **Dukungan Format Preset:** Kompatibel dengan format preset XML / AMFX standar Alight Motion.
- **Keyframe & Kurva Animasi:** Sistem interpolasi keyframe lengkap dengan editor kurva bezier (Linear, Ease In, Ease Out, Ease In-Out, Bounce, Stair-step, Oscillate).
- **Multi-layer Compositing:** Dukungan teks, bentuk vektor (Live Shapes), gambar, video, null object, dan audio layer.

### 📱 Authentic Mobile & Desktop UI
- **Antarmuka Responsif:** Layout adaptif yang presisi 1:1 mengikuti standar UI mobile Alight Motion (Playbar, Timeline, Sub-panel, Action Bar).
- **Move & Transform:** Kontrol posisi (X/Y/Z), rotasi, skala (berantai/terpisah), dan skew via touchpad gesture maupun numeric input.
- **Color & Fill:** Solid color, linear gradient, radial gradient, serta custom media fill.
- **Border & Shadow:** Stroke internal/eksternal, shadow depth, color glow, dan corner rounding.
- **Blending & Opacity:** Full blend modes (Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Masking).
- **Katalog Efek Lengkap:** Panel inspeksi efek terintegrasi untuk blur, distortion, color tuning, repeat, dan visual FX lainnya.

### 🎬 Timeline & Editing
- **Multi-track Timeline:** Pengaturan durasi, split, trim (kiri/kanan), retime, layer reordering, dan visibility toggle.
- **Audio Scrubber & VU Meter:** Realtime audio peak LevelMeterView bilateral dengan visualisasi gradient akurat.
- **Multi-select & Grouping:** Kelola dan transform beberapa layer sekaligus, masking group, atau un-grouping.

### 📤 Ekspor & Render
- **High-Performance Export:** Didukung WebCodecs hardware encoding dengan fallback FFmpeg WASM.
- **Pilihan Format:** Ekspor video MP4 dengan sinkronisasi audio, GIF animasi, Image Sequence, dan AMFX Package.

---

## Arsitektur Proyek

```
.
├── index.html          – Shell aplikasi utama (viewport, layout, container player & timeline)
├── preset.js           – Core engine: scene graph, XML/AMFX parser, WebGL renderer, timeline playback
├── am-mobile-ui.js     – Mobile UI controller (modal, subpanel, keyframe editor, text & media tools)
├── am-mobile-ui.css    – Styling 1:1 standar mobile Alight Motion
├── am-movetransform.js – Modul Move & Transform, gesture handling, dan matrix calculation
├── chunk.js            – Shader compiler GLSL, mathematical curves, & GPU noise routines
├── ffmpeg-export-v2.js – Exporter video MP4 & audio muxing
├── server.cjs          – Server statis lokal & asset proxy
├── effects/            – Definisi binari & shader efek
├── shapes/             – Asset geometri Live Shapes
└── icons/              – Asset ikon SVG interface
```

---

## Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)

### Instalasi & Menjalankan Server
```bash
# Jalankan server
node server.cjs
```

Buka browser dan akses:
```
http://localhost:3000/
```

Untuk mode tampilan ringkas, tambahkan query parameter `?mode=simple`.

---

## Lisensi & Kontribusi

Proyek ini dikembangkan secara terbuka untuk riset teknologi grafis web modern dan porting aplikasi kreatif ke ekosistem web terbuka. Kontribusi, laporan bug, dan pull request dipersilakan.