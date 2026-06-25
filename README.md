# 📚 KomikKu E-Library - Sistem Informasi Rental Komik Digital

[cite_start]Aplikasi **KomikKu E-Library** adalah platform sistem informasi rental komik digital berbasis web yang dibangun untuk memenuhi tugas Ujian Akhir Semester (UAS) mata kuliah **Pemrograman Web 2**[cite: 1]. 

[cite_start]Proyek ini menerapkan **Decoupled Architecture** (Arsitektur Terpisah) yang memisahkan secara penuh antara Server (Backend API) dan Klien (Frontend Single Page Application)[cite: 4].

---

## 👥 Identitas Mahasiswa
- **Nama Lengkap:** [LENI]
- **NIM:** [312410442]
- **Kelas:** [I241E]
- [cite_start]**Mata Kuliah:** Pemrograman Web 2 [cite: 1]
- **Kampus:** Universitas Pelita Bangsa

---

## 🛠️ Spesifikasi Ekosistem Teknologi

### [cite_start]1. Backend Engine (Folder: `backend-api/`) [cite: 62]
* [cite_start]**Framework:** PHP CodeIgniter 4 (CI4) yang dikonfigurasi murni sebagai RESTful API Server[cite: 8].
* [cite_start]**Controller:** Menggunakan `ResourceController` untuk menyediakan endpoint CRUD data master secara otomatis[cite: 8, 25].
* [cite_start]**Server-Side Security:** Menerapkan *CodeIgniter Filters* untuk memproteksi endpoint manipulasi data (`POST`, `PUT`, `DELETE`) menggunakan *Authorization Bearer Token*[cite: 26, 27].
* [cite_start]**Penanganan CORS:** Mengonfigurasi *CORS Filter* global pada `Config/Filters.php` agar API dapat menerima request lintas origin dari frontend tanpa terblokir oleh browser[cite: 28].

### [cite_start]2. Frontend Engine (Folder: `frontend-spa/`) [cite: 63]
* [cite_start]**Core Engine:** VueJS 3 berbasis CDN untuk mengelola komponen secara modular[cite: 9, 63].
* [cite_start]**Routing:** Vue Router berbasis CDN untuk perpindahan halaman tanpa memuat ulang browser (*Single Page Application / No Hard-Reload*)[cite: 9, 40].
* [cite_start]**Client-Side Security:** Menggunakan *Navigation Guards* (`router.beforeEach()`) dengan properti `meta: { requiresAuth: true }` untuk memproteksi halaman panel admin dari pengguna ilegal[cite: 43, 44].
* [cite_start]**Otomatisasi Token:** Menggunakan *Axios Request Interceptor* untuk menyuntikkan token dari `localStorage` secara otomatis, serta *Axios Response Interceptor* untuk menangkap error `401 Unauthorized` secara global[cite: 34, 46, 48].
* [cite_start]**User Interface (UI):** Didesain menggunakan *utility-first class* dari TailwindCSS via CDN agar tampilan responsif, rapi, dan modern[cite: 10].

### 3. Database
* [cite_start]**DBMS:** MySQL / MariaDB sebagai basis data utama[cite: 11].

---

## 🗺️ Arsitektur Database & Relasi Tabel

[cite_start]Sistem ini menggunakan 5 tabel database yang saling berelasi untuk memastikan integritas data arsitektur E-Library[cite: 23, 80]:
1. [cite_start]`users` : Menyimpan data kredensial akun admin (email, password, token)[cite: 24, 79, 82].
2. [cite_start]`komik` : Tabel utama penampung data koleksi komik digital[cite: 80].
3. [cite_start]`genre` : Tabel master data kategori genre komik (*Berelasi One-to-Many ke tabel komik*)[cite: 80].
4. [cite_start]`penulis` : Tabel master data penulis/penerbit komik (*Berelasi One-to-Many ke tabel komik*)[cite: 80].
5. [cite_start]`peminjaman` : Tabel transaksi yang menghubungkan tabel komik dan anggota[cite: 80].

### 📸 Screenshot Skema Relasi Tabel (phpMyAdmin)

<img width="1013" height="177" alt="tabel" src="https://github.com/user-attachments/assets/d7c3b96a-f3f4-4a30-b914-b82b4b460fff" />


---

## 💻 Implementasi Kode Inti (Core Code)

### 1. Backend: Konfigurasi CORS & Auth Filter (`app/Config/Filters.php`)
```php
<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\Honeypot;

class Filters extends BaseConfig
{
    // Mendaftarkan alias filter keamanan
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'cors'          => \App\Filters\CorsFilter::class,      // Menangani Lintas Origin (CORS)
        'authFilter'    => \App\Filters\AuthFilter::class,      // Menangani Validasi Bearer Token
    ];

    // Menerapkan CORS secara global pada semua request
    public array $globals = [
        'before' => [
            'cors', 
        ],
        'after' => [
            'toolbar',
        ],
    ];

    // Memproteksi endpoint manipulasi data komik
    public array $filters = [
        'authFilter' => [
            'before' => [
                'api/komik/create',
                'api/komik/update/*',
                'api/komik/delete/*',
            ]
        ]
    ];
}

```
## 2.⚙️ Frontend: Axios Interceptors Global Setup

**File:** `frontend-spa/assets/js/app.js`

```javascript
// 1. Request Interceptor: Otomatis menyuntikkan Bearer Token dari localStorage
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Response Interceptor: Menangkap error 401 secara global
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah habis atau Anda tidak memiliki akses. Silakan login kembali.');
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '#/login';
        }
        return Promise.reject(error);
    }
);
```

---

## 🧪 Dokumentasi Uji Coba API (Postman)

### 🛑 Skenario 1 — GET Komik Tanpa Token (200 OK)

| Field | Value |
|---|---|
| Method | `GET` |
| URL | `http://localhost:8080/api/komik` |
| Keterangan | Endpoint publik, dapat diakses bebas untuk menampilkan daftar komik di landing page. |

<img width="810" height="310" alt="get" src="https://github.com/user-attachments/assets/1da1d4a3-727d-4f12-9573-bea2526a203d" />



---

### 🛑 Skenario 2 — POST Komik Tanpa Token (401 Unauthorized)

| Field | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:8080/api/komik` |
| Keterangan | Sistem menolak permintaan karena klien tidak melampirkan token valid di HTTP Header. |

<img width="830" height="437" alt="401" src="https://github.com/user-attachments/assets/b0f11d4a-d22a-436c-bcd7-88ae6ed00820" />


---

### 🔑 Skenario 3 — Request Token via Login (200 OK)

| Field | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:8080/api/login` |

**Body (JSON):**
```json
{
  "email": "admin@elibrary.com",
  "password": "password"
}
```

Keterangan: API memeriksa kecocokan data dan menghasilkan token autentikasi unik untuk klien.


---

### 🟢 Skenario 4 — POST Komik Dengan Bearer Token (201 Created)

| Field | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:8080/api/komik` |
| Header | `Authorization: Bearer [TOKEN_HASIL_LOGIN]` |

**Body (JSON):**
```json
{
  "judul": "Crayon Shinchan Vol. 50",
  "genre_id": 2,
  "penulis_id": 4,
  "tahun_terbit": "2015",
  "stok": 7
}
```

Keterangan: Data baru berhasil masuk ke database karena token diverifikasi sah oleh server.

---

## 📸 Antarmuka Aplikasi

1. **Halaman Login Admin** — Form login dengan desain Tailwind CSS dark theme
2. **Dashboard Panel Utama** — Overview data dan navigasi modul
3. **Form Modal Interaktif** — Tambah & edit data dengan modal overlay

Halaman Home

<img width="1366" height="642" alt="home" src="https://github.com/user-attachments/assets/19db51f8-7f4d-46d2-8b49-2f5f53a44360" />


Halaman Login Admin

<img width="1366" height="620" alt="login" src="https://github.com/user-attachments/assets/44e281ff-19fa-4e0a-b16b-7b3898d38bbe" />

Halaman Dashboard

<img width="1365" height="644" alt="dahsboard" src="https://github.com/user-attachments/assets/f00d0af3-3803-4b11-b539-1100f16b0f05" />

---

## 💻 Petunjuk Instalasi Lokal

### Langkah 1 — Clone Repositori

```bash
git clone https://github.com/[Username_GitHub_Kamu]/UAS_Web2_NIM_Nama.git
cd UAS_Web2_NIM_Nama
```

### Langkah 2 — Konfigurasi Backend (CodeIgniter 4)

```bash
cd backend-api
cp .env.example .env
```

Edit file `.env` dan sesuaikan kredensial database:

```
database.default.hostname = localhost
database.default.database = db_komikku
database.default.username = root
database.default.password = 
```

Impor file `.sql` ke phpMyAdmin, lalu jalankan server:

```bash
php spark serve
```

> Backend API berjalan di: `http://localhost:8080`

### Langkah 3 — Konfigurasi Frontend (Vue 3 SPA)

```bash
cd ../frontend-spa
```

Pastikan Base URL Axios di dalam script komponen sudah mengarah ke `http://localhost:8080/`.

Jalankan `index.html` menggunakan ekstensi **Live Server** di VS Code, atau buka langsung melalui browser.

---

## 🔗 Tautan Penting

| | Link |
|---|---|
| 🌐 Demo Aplikasi | *(Tambahkan link demo jika tersedia)* |
| 🎥 Video Presentasi (YouTube) | *(https://youtu.be/gL2NxENuW-I)* |

---

> Dibuat untuk memenuhi tugas UAS Mata Kuliah Pemrograman Web 2.
