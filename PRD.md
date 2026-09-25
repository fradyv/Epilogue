# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Epilogue (DApp)
**Event:** Girl Meets Tech: Build Week Hackathon Vol.2
**Track:** AI Track (AI Advice Bot / Project #4)
**Target Deadline:** September 25, 2026 — 11:59 PM (GMT+7)
**Format Note:** *Dokumen ini diformat untuk diekspor ke PDF. Anda dapat menyalin teks ini ke Microsoft Word / Google Docs, atau menggunakan fitur "Print to PDF" di VS Code/Browser.*

---

## 1. Executive Summary

**Vision:**
Menyediakan ruang aman digital terdesentralisasi bagi mahasiswa untuk mendapatkan dukungan psikologis awal, bimbingan produktivitas, dan pelaporan perundungan/pelecehan yang anonim, berbasis *trauma-informed*, serta memiliki jejak bukti tak terubah (*tamper-proof*) menggunakan teknologi Web3.

**Problem Statement:**

1. Mahasiswa ragu melaporkan perundungan/pelecehan karena takut data dimanipulasi birokrasi kampus.
2. Tingginya tekanan akademis dan *imposter syndrome* yang butuh intervensi cepat dan empatis 24/7.

**Solution:**
DApp AI berbasis **Gemini 1.5 Flash** yang terintegrasi dengan **BOT Chain**. Aplikasi memfasilitasi interaksi AI yang empatis dan memungkinkan pencatatan laporan sensitif ke dalam *blockchain* sebagai bukti valid tanpa mengorbankan privasi.

---

## 2. Core Features & AI Architecture

Aplikasi beroperasi dalam tiga mode System Prompt utama. Setiap mode memiliki fungsi *blockchain* yang berbeda.

| Mode | Fokus Utama | System Prompt AI | Fungsi Web3 (Smart Contract) |
| --- | --- | --- | --- |
| **Resilience** | *Imposter syndrome*, kecemasan, kelelahan mental. | **CBT-lite:** Validasi emosi pengguna terlebih dahulu, *reframing* positif, tidak *judgemental*. | **Opsional:** Pengguna dapat *mint* respons AI (nasihat/kutipan) sebagai catatan abadi di *wallet*. |
| **Productivity** | Manajemen tugas UTS/UAS, jadwal, rencana aksi. | **Academic Coach:** Praktis, menyusun *timeblock*. Menanyakan *deadline* dan jadwal harian. | **Opsional:** Pengguna dapat *mint* jadwal atau *action plan* tersebut. |
| **Safety Report** | Perundungan (fisik/digital), pelecehan, krisis. | **Trauma-informed:** Tidak memaksa, mendampingi, mengarahkan ke tenaga profesional. | **Wajib/Disarankan:** Laporan di-*hash* kriptografi, dan kode *hash*-nya dicatat *on-chain* sebagai bukti. |

### Crisis Escalation Engine (Sistem Keamanan)

Pengecekan Regex berjalan di *frontend* untuk mendeteksi kata kunci krisis sebelum dan sesudah respons AI:

* **Kata Kunci:** "bunuh diri", "menyakiti diri", "dipukul", "diancam", "disebarkan", "dilecehkan".
* **Trigger Action:** Jika terdeteksi, antarmuka otomatis memunculkan **Banner Darurat** berisi nomor Hotline Kampus / Into The Light (119 ext 8) dan tombol eskalasi laporan ke *blockchain*.

---

## 3. Web3 & Smart Contract Architecture

Kontrak pintar (*smart contract*) ditulis dalam Solidity dan di-*deploy* ke **BOT Chain** (Testnet: 968, Mainnet: 677).

**Fungsi Utama Smart Contract:**

1. `mintAdvice(string category, string contentHash)`: Menyimpan saran akademis/mental ke *blockchain*.
2. `logSafetyReport(string reportHash, bool isAnonymous)`: Mencatat *hash* dari laporan krisis.

**Protokol Privasi (Hashing):**
Teks asli laporan pelecehan **tidak pernah** dikirim ke *blockchain*. Alurnya:
Laporan diketik -> Laravel melakukan *Hashing* (SHA-256) pada teks -> Laravel mengembalikan kode Hash ke Frontend -> Frontend mengirim kode Hash ke *Smart Contract* BOT Chain.

---

## 4. Technology Stack & Authentication Flow

* **Backend & Orkestrator AI:** Laravel (PHP)
* **Frontend & UI:** Inertia.js (React/Vue) dan Tailwind CSS
* **AI Engine:** Gemini 1.5 Flash API (Dipanggil dari *backend* Laravel untuk keamanan API Key)
* **Smart Contract IDE:** Remix IDE
* **Blockchain Network:** BOT Chain (EVM Compatible)

### Passwordless Web3 Authentication Flow

Untuk memenuhi syarat DApp tanpa membebani pengguna dengan pendaftaran konvensional, sistem menggunakan autentikasi *Wallet-to-Session*:

1. Pengguna menekan tombol **"Connect Wallet"** di *frontend*.
2. Inertia.js memanggil `window.ethereum.request({ method: 'eth_requestAccounts' })`.
3. MetaMask *pop-up* muncul. Pengguna menyetujui koneksi.
4. *Frontend* mengambil `wallet_address` pengguna dan mengirimkannya ke `AuthController` Laravel via *POST request*.
5. Laravel mengeksekusi `User::firstOrCreate(['wallet_address' => $request->wallet_address])` dan melakukan `Auth::login()`.
6. Pengguna langsung masuk ke dasbor AI Chat tanpa email atau kata sandi.

---

## 5. Hackathon Compliance & Gap Resolution (CRITICAL)

Mengingat aturan *Girl Meets Tech Build Week Vol.2*, berikut adalah penyesuaian infrastruktur dan *checklist* yang wajib dipenuhi sebelum penutupan (25 September 2026).

### A. Infrastruktur & Hosting (Penyelesaian Gap)

* **Kendala:** Aturan menyarankan GitHub Pages, namun GitHub Pages tidak mendukung Laravel (PHP).
* **Solusi:** DApp di-*deploy* menggunakan layanan *hosting* yang mendukung PHP (seperti Railway, Render, atau *shared hosting* konvensional).
* **Domain:** Aplikasi wajib dijalankan di *live domain* (misal: `.xyz`, `.online`) yang dibeli seharga $1-$1.50 dan diarahkan ke *server* Laravel tersebut.

### B. BOT Chain Requirements

* **Jaringan:** Kontrak pintar wajib beroperasi di **BOT Chain Mainnet**.
* **Gas Fee:** Pengembang wajib meminta alokasi token BOT Mainnet dari panitia/organizer *hackathon* untuk biaya *deploy* di Remix IDE.

### C. Pre-Submission Checklist

* [ ] **Fungsi Utama Berjalan:** Fitur login MetaMask, Chat AI, dan satu fungsi *Mint/Log* ke BOT Chain berjalan tanpa *error* di *frontend*.
* [ ] **Branding:** Menambahkan teks/logo "BOT Chain" di *footer* UI yang terhubung ke `botchain.ai` dan `scan.botchain.ai`.
* [ ] **GitHub Repository:** Memuat *source code* Laravel, *file* `.sol`, dan `README.md` yang menjelaskan cara kerja fitur dan **mencantumkan alamat Smart Contract (Testnet & Mainnet)**.
* [ ] **Syarat Media Sosial (X / Twitter):** Akun X proyek memiliki minimal 5 *post* dalam 30 hari terakhir. Wajib membagikan DApp (*screenshot/video*) dengan *tag* `@BOTChain_ai`.
* [ ] **Mainnet Announcement:** Terdapat pengumuman resmi di dalam situs web atau X bahwa "Campus Resilience Bot is officially launched on BOT Chain Mainnet".