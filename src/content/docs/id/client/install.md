---
title: 'Instalasi dan pertama kali dijalankan'
description: 'Membukanya pertama kali (macOS langsung terbuka; Windows perlu Jalankan saja), masuk dengan Google, membuat karakter, dan mulai bermain.'
---

## Membukanya pertama kali

### macOS — langsung terbuka

**Build macOS ditandatangani dengan Apple Developer ID, dinotarisasi oleh Apple, dan tiketnya ditempelkan ke aplikasi.** Ekstrak, klik dua kali, dan ia berjalan tanpa peringatan Gatekeeper.

Kamu tidak perlu klik kanan → Buka, dan tidak perlu `xattr -cr` — saran yang kamu temukan di internet untuk aplikasi tak bertanda tangan tidak berlaku untuk build ini.

### Windows — satu klik tambahan

**Build Windows tidak ditandatangani**, jadi SmartScreen menampilkan “Windows protected your PC”. Klik **More info** → **Run anyway**.

Sertifikat penandatanganan kode berbiaya setiap tahun dan saat ini hanya ada satu, untuk macOS. Kalau proyek ini berguna bagimu, [mendukungnya](https://ko-fi.com/dakywang) membantu membuat sertifikat Windows terjangkau.

### Linux — nyalakan bit eksekusi

AppImage tidak punya penandatanganan yang berarti; ia hanya perlu bisa dieksekusi:

```bash
chmod +x openmmo-agent-*linux-x64.AppImage
./openmmo-agent-*linux-x64.AppImage
```

## Pertama kali dijalankan

Empat layar berurutan dan kamu sudah di dalam gim. **Tidak ada langkah “Main” terpisah** — memilih karakter langsung masuk ke permainan.

### 1. Server — pilih profil koneksi

Profil bawaan `openmmo.to.nexus` bersifat tetap, dan itulah yang diinginkan sebagian besar pemain.

Sebuah profil mengikat tiga hal: URL server, asal aset medan, dan ID/secret klien Google. Ketiganya harus berjalan bersama, karena server hanya menerima token masuk yang diterbitkan oleh ID klien dalam daftar izinnya sendiri. Kalau kamu menjalankan server sendiri, kamu bisa membuat, menyunting, menyalin, dan menghapus profil, serta menguji koneksinya sebelum dipakai.

### 2. Login — alur perangkat Google

Tekan tombolnya dan sebuah kode muncul; masukkan di peramban. Kredensial yang tersimpan langsung melompat ke langkah berikutnya.

### 3. Karakter — pilih atau buat

Dua tab:

- **Pilih karaktermu** — maksimal 3 per akun (dipaksakan server). Klik untuk masuk bermain, atau hapus.
- **Buat karakter baru** — nama, kelas, jenis. Disembunyikan begitu kamu mencapai batas.

### 4. Gim

Modenya ditentukan untukmu saat masuk: **otomatis kalau ada backend LLM yang terpasang dan lolos validasi, manual kalau tidak**. Kalau otomatis gagal mulai, ia jatuh ke manual. Kamu bisa berganti kapan saja dari bilah atas.

## Dua mode bermain

Server hanya mengizinkan tepat satu sesi pengendali per karakter, jadi kedua mode mencapainya dengan cara berbeda.

**Main manual** adalah koneksi langsung — klien web OpenMMO yang tertanam masuk dengan akun Google-mu sendiri dan berbicara langsung ke server, persis seperti bermain di peramban. Tanpa relai, tanpa `agent-client`.

**Main otomatis** menjalankan `agent-client`, yang membutuhkan satu sesi itu untuk dirinya — jadi menontonnya tidak bisa berarti masuk di sebelahnya. Alih-alih, sebuah relai duduk di loopback:

```
agent-client <--ws--> proxy (127.0.0.1) <--wss--> openmmo.to.nexus
                        |
                        +--> penonton (/mirror)
```

Server sama sekali tidak tahu ada sesuatu di belakang agen. Berada di tengah membuat relai bisa menyalin setiap pesan server ke tampilan penonton yang hanya-baca. **Relai hanya mendengarkan di `127.0.0.1`, jadi tidak ada yang keluar dari mesinmu.**

## Layar permainan

Bilah atas menampilkan status koneksi, tanda vital, penggunaan memori penonton, tombol memuat ulang tampilan 3D, sakelar manual/AI, dan tombol untuk berganti karakter atau server. Ubah pengaturan saat agen berjalan dan tombol **Terapkan & mulai ulang** akan muncul.

Bilah kiri membuka enam panel geser:

| Panel | Apa yang ditampilkan |
|---|---|
| Perlengkapan | Yang dipakai, slot demi slot |
| Tas | Yang dibawa, dan item mana yang boleh dijual atau dibuang agen |
| Kepribadian & Memori | Prompt khusus karakter ini (bisa disunting) dan apa yang dicatat agen (hanya-baca) |
| Koordinat | Penanda tempat, termasuk “pakai posisi sekarang” |
| Praset Instruksi | Instruksi yang sering dipakai disimpan sebagai tombol sekali klik |
| Aktivitas | Dua tab: Pikiran (setiap prompt dan jawaban) dan Log (keluaran proses agen) |

Setiap panel dijelaskan rinci di [referensi panel](../panel/).

**Instruksi**, yang menempel di bawah tampilan permainan, adalah satu-satunya kendali yang menjangkau agen yang sedang berjalan: ketik sebuah instruksi dan ia datang sebagai giliran berikutnya karakter, **sebisanya — tanpa jaminan akan dipatuhi.**

## Di mana kunci-kuncimu disimpan

Kunci API dan secret profil koneksi dienkripsi dengan keychain sistem (`safeStorage` milik Electron, dengan AES-GCM sebagai cadangan) dan diberikan ke agen sebagai variabel lingkungan — **tidak pernah dituliskan ke `config.toml`.** Konfigurasi yang ditempel ke laporan bug tidak membawa kredensial apa pun.

## Pemecahan masalah

**Versi protokol tidak cocok** — server sudah diperbarui. Ambil build baru dari [halaman unduhan](../download/).

**Sudah mengubah pengaturan tapi tidak ada yang terjadi** — agen membaca konfigurasinya sekali saja saat mulai. Tekan **Terapkan & mulai ulang** di bilah atas.

**Dijalankan dari terminal VS Code dan tidak pernah terbuka** — VS Code sendiri adalah aplikasi Electron dan membocorkan `ELECTRON_RUN_AS_NODE=1`, sehingga klien dimulai sebagai Node biasa:

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

**Ada yang hilang atau membeku di tampilan penonton** — tampilan penonton main otomatis dimulai dari sebuah snapshot, jadi apa pun yang diketahui agen tapi tidak sedang dilacaknya akan muncul begitu kembali masuk pandangan.
