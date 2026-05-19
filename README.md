# Laravel React Admin Boilerplate

Boilerplate admin panel menggunakan Laravel 13 + React 18 + Inertia.js v2 dengan fitur lengkap untuk manajemen pengguna, role-based access control, dan CRUD operations.

## Tech Stack

### Backend
- **Laravel 13** — PHP 8.3+
- **Inertia.js v2** — SPA tanpa API terpisah
- **Spatie Laravel Permission** — RBAC (Role & Permission)
- **Laravel Sanctum** — Session-based authentication
- **Ziggy** — Laravel routes di frontend

### Frontend
- **React 18** + TypeScript
- **Vite 7** — Build tool
- **Tailwind CSS 3** — Utility-first CSS
- **shadcn/ui** — Komponen UI berbasis Radix primitives
- **Mantine DataTable** — Tabel data dengan fitur lengkap
- **Recharts** — Chart/grafik
- **React Hook Form + Zod** — Form handling & validasi
- **Zustand** — State management
- **Lucide React** — Icon library
- **Sonner** — Toast notifications
- **next-themes** — Dark/Light mode

## Fitur

### Autentikasi
- Login dengan username
- Registrasi
- Lupa password & reset password
- Verifikasi email
- Konfirmasi password

### Role-Based Access Control (RBAC)
- Manajemen role & permission (Spatie)
- Permission di-share ke frontend via Inertia middleware
- Hook `usePermission` untuk cek akses di React
- Menu sidebar & tombol aksi tampil berdasarkan permission
- Super Admin mendapat semua permission

### Dashboard
- Stat cards dengan animasi (Revenue, Orders, Users, Active)
- Revenue chart (area chart)
- Orders chart (bar chart)
- Users chart (line chart)
- Recent activity feed
- Responsive grid layout

### Manajemen Pengguna (CRUD)
- Tabel data server-side dengan pagination, search, sort, filter
- Tambah, edit, lihat detail, hapus user
- Bulk delete
- Username sebagai primary key (tanpa auto-increment ID)
- Assign multiple roles ke user
- Field: nama, username, email, password, lokasi, status

### Manajemen Role (CRUD)
- Tabel data server-side dengan pagination, search, sort, filter
- Tambah, edit, lihat detail, hapus role
- Bulk delete
- Permission dikelompokkan berdasarkan group
- Status aktif/tidak aktif

### Manajemen Kategori (CRUD)
- Tabel data server-side dengan search
- Tambah, edit, lihat detail, hapus kategori
- Auto-generate slug
- Dukungan parent-child (hierarki)
- Status aktif/tidak aktif

### Produk (Demo)
- Tabel data client-side dengan Zustand store
- Filter berdasarkan status & kategori
- Thumbnail gambar, SKU, harga (format IDR), indikator stok

### Komponen CRUD DataTable (Reusable)
- Server-side & client-side pagination
- Search dengan debounce
- Multi-filter
- Sortable columns
- Row selection & bulk delete dengan dialog konfirmasi
- Responsive — swipe scroll & dropdown menu di mobile
- Skeleton loading states

### UI & Layout
- **Sidebar** — collapsible, permission-gated, sub-menu, mobile overlay, tooltip saat collapsed
- **Navbar** — search, dark/light toggle, notifikasi, avatar menu, logout
- **Dark Mode** — toggle via next-themes (class strategy)
- **50+ shadcn/ui components** — button, card, dialog, dropdown, form, input, select, table, tabs, toast, dll
- **Custom animations** — fade-up, fade-in
- **Font Inter**
- **HSL CSS variable theming** — mudah ganti warna primary

### Audit Trails
- Trait `HasAuditTrails` otomatis mengisi:
  - `created_by` / `updated_by` / `deleted_by` (username)
  - `created_location` / `updated_location` / `deleted_location`
- Support SoftDeletes

### Developer Experience
- `composer dev` — jalankan server + queue + logs + vite sekaligus
- `composer setup` — setup project satu perintah
- Pest 4 untuk testing
- Laravel Pint untuk code style
- TypeScript strict mode

## Persyaratan

- PHP >= 8.3
- Composer
- Node.js >= 18
- MySQL / MariaDB / PostgreSQL / SQLite

## Instalasi

```bash
# Clone repository
git clone <repo-url> project-name
cd project-name

# Install dependencies
composer install
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
php artisan key:generate

# Konfigurasi database di .env lalu jalankan migrasi
php artisan migrate:fresh --seed

# Build frontend
npm run build
```

## Menjalankan Development

```bash
# Jalankan semua service sekaligus (server + queue + logs + vite)
composer dev
```

Atau jalankan terpisah:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev
```

## Akun Default

| Username | Password | Role |
|----------|----------|------|
| `superadmin` | `password` | Super Admin |

## Struktur Folder

```
app/
├── Http/Controllers/     # Controller (Auth, User, Role, Category, Product, Profile)
├── Http/Middleware/       # HandleInertiaRequests (share auth & permissions)
├── Http/Requests/        # Form request validation
├── Models/               # Eloquent models (User, Role, Permission, Category)
├── Providers/            # Service providers
└── Traits/               # HasAuditTrails

resources/js/
├── components/
│   ├── crud/             # CrudDataTable, DeleteConfirmDialog, Skeletons
│   ├── dashboard/        # Layout, Sidebar, Navbar, Charts, StatCard
│   └── ui/              # shadcn/ui components
├── hooks/                # usePermission, useIsMobile, useSwipeScroll
├── Pages/
│   ├── Auth/             # Login, Register, ForgotPassword, etc.
│   ├── Dashboard.tsx     # Dashboard utama
│   ├── Users/            # CRUD pages + Types + Partial/Form
│   ├── Roles/            # CRUD pages + Types + Partial/Form
│   ├── Categories/       # CRUD pages
│   └── Profile/          # Edit profile
├── stores/               # Zustand stores
└── types/                # TypeScript type definitions

database/
├── migrations/           # Schema migrations
├── seeders/              # RolePermission, SuperAdmin seeders
└── factories/            # UserFactory
```

## Kustomisasi

### Ganti Warna Primary

Edit `resources/css/app.css`, ubah nilai `--primary` dalam format HSL:

```css
:root {
    --primary: 148 45% 22%; /* Hijau tua (#1f5132) */
}
```

### Tambah Menu Sidebar

Edit `resources/js/components/dashboard/Sidebar.tsx`, tambahkan item di array `menuItems`:

```tsx
const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", permission: "view-dashboard" },
  { icon: NewIcon, label: "Menu Baru", path: "/new-menu", permission: "view-new-menu" },
];
```

### Tambah Permission Baru

1. Tambahkan di `database/seeders/RolePermissionSeeder.php`
2. Jalankan `php artisan db:seed --class=RolePermissionSeeder`

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `composer dev` | Jalankan development server (all-in-one) |
| `composer setup` | Setup project dari awal |
| `composer test` | Jalankan test suite |
| `npm run dev` | Vite development server |
| `npm run build` | Build production assets |

## Lisensi

MIT
