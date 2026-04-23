# 🚀 devfolio - Portfolio Management Platform

**devfolio** adalah platform berbasis web yang memungkinkan pengguna untuk membuat, mengelola, dan membagikan portfolio profesional mereka secara instan. Dibangun dengan fokus pada kecepatan, estetika modern, dan kemudahan penggunaan.

---

## 🛠️ Tech Stack

Project ini menggunakan teknologi modern (Bleeding Edge) untuk performa dan skalabilitas:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🏗️ Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **Hybrid Rendering** yang mengoptimalkan *Server-Side Rendering* (SSR) dan *Client-Side Rendering* (CSR):

1.  **Server Components**: Digunakan untuk halaman publik dan dashboard utama guna mempercepat *Initial Page Load* dan optimasi SEO.
2.  **Client Components**: Digunakan untuk elemen interaktif seperti form input, toggle sidebar, dan autentikasi.
3.  **BaaS (Backend as a Service)**: Menggunakan Supabase untuk menangani seluruh logika backend (Auth, Database CRUD, dan Row Level Security) tanpa perlu server Node.js terpisah.
4.  **Middleware & Server Actions**: Mengatur alur autentikasi dan validasi data secara *secure* di sisi server.

---

## 📂 Struktur Folder

```text
portfolio-platform/
├── app/                    # Next.js App Router (Routing & Pages)
│   ├── auth/               # Folder untuk Autentikasi
│   │   ├── login/          # Halaman Login
│   │   ├── register/       # Halaman Pendaftaran
│   │   └── callback/       # OAuth Callback handler
│   ├── dashboard/          # Area Admin (Private)
│   │   ├── projects/       # Kelola Project
│   │   ├── experiences/    # Kelola Pengalaman Kerja
│   │   ├── skills/         # Kelola Tech Stack
│   │   └── layout.tsx      # Sidebar & Shell Dashboard
│   ├── [username]/         # Dynamic Route Halaman Portfolio Publik
│   ├── globals.css         # Custom CSS & Tailwind base
│   └── layout.tsx          # Root Layout (Fonts, Metadata)
├── components/             # Reusable UI Components
│   ├── dashboard/          # Komponen khusus Admin (Sidebar, Form, dll)
│   └── ui/                 # Komponen UI dasar (Buttons, Inputs, Cards)
├── lib/                    # Utilitas & Konfigurasi Library
│   ├── supabase/           # Client & Server-side Supabase setup
│   └── types.ts            # TypeScript Definitions / Interfaces
├── public/                 # Static Assets (Images, Icons, Fonts)
├── supabase/               # Konfigurasi Database (Migrations, Seed)
├── .env.local.example      # Template Environment Variables
├── next.config.js          # Konfigurasi Next.js
├── tailwind.config.ts      # Konfigurasi Desain & Tema
└── vercel.json             # Konfigurasi Deployment Vercel
```

---

## 🚀 Fitur Utama

### 1. Autentikasi Modern
- Login & Register via Email/Password.
- Integrasi **OAuth** (Google & Facebook).
- Proteksi route (Dashboard hanya untuk user yang login).

### 2. Dashboard Management
- **Profile Editor**: Ubah nama, bio, website, sosial media, hingga koordinat Map.
- **Project Manager**: Tambah, edit, dan hapus project dengan dukungan gambar dan link.
- **Skill Tracker**: Kelola keahlian dengan level (Beginner - Expert).
- **Collapsible Sidebar**: Sidebar yang bisa dibuka-tutup untuk kenyamanan kerja (Desktop & Mobile).

### 3. Public Portfolio
- URL unik untuk setiap pengguna: `devfolio.app/username`.
- Desain minimalis, elegan, dan responsif (Mobile Friendly).
- Integrasi Google Maps dinamis berdasarkan koordinat profil.

---

## ⚙️ Instalasi Lokal

1.  **Clone repository**:
    ```bash
    git clone https://github.com/username/portfolio-platform.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Salin `.env.local.example` menjadi `.env.local` dan isi kredensial Supabase Anda.
4.  **Run development server**:
    ```bash
    npm run dev
    ```

---

## 📄 Lisensi
Project ini dibuat untuk keperluan portfolio pribadi. Silakan gunakan sebagai referensi belajar.

---
*Crafted with ❤️ by devfolio Team*
