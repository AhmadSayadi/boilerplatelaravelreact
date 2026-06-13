# CRUD Global Layout Documentation

Dokumentasi komponen CRUD global yang reusable untuk seluruh halaman CRUD di project ini.

**Lokasi file:** `resources/js/components/crud/`

---

## Daftar Komponen

| Komponen | Fungsi |
|----------|--------|
| `CrudIndexLayout` | Layout halaman index (daftar data + tabel) |
| `CrudFormLayout` | Layout halaman Create / Edit (form) |
| `CrudShowLayout` | Layout halaman Show / Detail |
| `CrudDataTable` | DataTable reusable dengan search, filter, sort, pagination |
| `DeleteConfirmDialog` | Dialog konfirmasi hapus |
| `TableSkeleton` | Skeleton loading untuk tabel |
| `PageSkeleton` | Skeleton loading untuk header halaman |
| `FormSkeleton` | Skeleton loading untuk form |

---

## Import

```tsx
import {
  CrudIndexLayout,
  CrudFormLayout,
  CrudShowLayout,
  CrudDataTable,
  DeleteConfirmDialog,
  TableSkeleton,
  PageSkeleton,
  FormSkeleton,
} from "@/components/crud";

// Types
import type {
  CrudIndexLayoutProps,
  CrudFormLayoutProps,
  CrudShowLayoutProps,
  CrudDataTableProps,
  PaginatedData,
  FilterConfig,
  FilterOption,
  ActionConfig,
  DetailField,
} from "@/components/crud";
```

---

## 1. CrudIndexLayout

Layout lengkap untuk halaman daftar data (Index). Sudah include DashboardLayout, skeleton loading, tabel, search, filter, sort, pagination, delete dialog, dan bulk delete.

### Props

| Prop | Type | Default | Keterangan |
|------|------|---------|------------|
| `title` | `string` | *required* | Judul halaman (`<Head>`) |
| `cardTitle` | `string` | *required* | Judul card |
| `cardDescription` | `string` | *required* | Deskripsi card |
| `data` | `PaginatedData<T> \| T[]` | *required* | Data dari server (paginated) atau array lokal |
| `columns` | `DataTableColumn<T>[]` | *required* | Kolom tabel |
| `idAccessor` | `keyof T` | `"id"` | Field unik untuk identifikasi record |
| `searchKeys` | `(keyof T)[]` | `[]` | Field yang bisa dicari |
| `searchPlaceholder` | `string` | `"Cari..."` | Placeholder input search |
| `filters` | `FilterConfig[]` | `[]` | Konfigurasi filter dropdown |
| `entityName` | `string` | `"data"` | Nama entity untuk label (misal: "user", "produk") |
| `routePrefix` | `string` | *required* | Base route (misal: `/users`, `/products`) |
| `getItemId` | `(record: T) => string \| number` | `record[idAccessor]` | Custom resolver ID untuk routing |
| `getItemName` | `(record: T) => string` | `record.name` | Nama item untuk dialog hapus |
| `showCreateButton` | `boolean` | `true` | Tampilkan tombol "Tambah" |
| `createButtonLabel` | `string` | `"Tambah"` | Label tombol tambah |
| `canView` | `boolean` | `true` | Permission lihat |
| `canCreate` | `boolean` | `true` | Permission tambah |
| `canEdit` | `boolean` | `true` | Permission edit |
| `canDelete` | `boolean` | `true` | Permission hapus |
| `onView` | `(record: T) => void` | — | Custom handler view (override default routing) |
| `onEdit` | `(record: T) => void` | — | Custom handler edit (override default routing) |
| `onDeleteOverride` | `(record: T) => void` | — | Custom handler delete (override default) |
| `bulkDeleteField` | `string` | `"ids"` | Nama field request bulk delete |
| `bulkDeleteRoute` | `string` | `routePrefix + "/bulk-delete"` | Route bulk delete |
| `headerExtra` | `ReactNode` | — | Konten tambahan di header (sebelah tombol Tambah) |
| `renderActions` | `(record: T) => ReactNode` | — | Render custom penuh (override semua action) |
| `extraActions` | `ActionConfig<T>[]` | `[]` | Action tambahan per baris (selain view/edit/delete) |
| `defaultSortKey` | `keyof T` | — | Sort awal |
| `defaultSortDirection` | `"asc" \| "desc"` | `"desc"` | Arah sort awal |

### Contoh Penggunaan

```tsx
import { CrudIndexLayout } from "@/components/crud";
import { usePermission } from "@/hooks/usePermission";
import { Badge } from "@/components/ui/badge";
import { PaginatedData } from "@/components/crud";

interface User {
  username: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
}

interface Props {
  users: PaginatedData<User>;
}

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

const UsersIndex = ({ users }: Props) => {
  const { hasPermission } = usePermission();

  const columns = [
    { accessor: "name" as keyof User, title: "Nama", sortable: true },
    { accessor: "email" as keyof User, title: "Email", sortable: true },
    {
      accessor: "status" as keyof User,
      title: "Status",
      sortable: true,
      render: (user: User) => (
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status === "active" ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
  ];

  return (
    <CrudIndexLayout
      title="Manajemen Pengguna"
      cardTitle="Daftar Pengguna"
      cardDescription="Daftar semua pengguna yang terdaftar dalam sistem."
      data={users}
      columns={columns}
      idAccessor="username"
      searchKeys={["name", "username", "email"]}
      searchPlaceholder="Cari nama, username, atau email..."
      filters={[
        { key: "status", placeholder: "Filter Status", options: statusFilters },
      ]}
      entityName="user"
      routePrefix="/users"
      getItemId={(user) => user.username}
      getItemName={(user) => user.name}
      createButtonLabel="Tambah Pengguna"
      canView={hasPermission("view-users")}
      canCreate={hasPermission("create-users")}
      canEdit={hasPermission("edit-users")}
      canDelete={hasPermission("delete-users")}
      bulkDeleteField="usernames"
    />
  );
};

export default UsersIndex;
```

---

## 2. CrudFormLayout

Layout untuk halaman Create dan Edit. Sudah include DashboardLayout, tombol back, skeleton loading, card, dan tombol submit/cancel.

### Props

| Prop | Type | Default | Keterangan |
|------|------|---------|------------|
| `title` | `string` | *required* | Judul halaman (`<Head>`) |
| `heading` | `string` | *required* | Heading halaman |
| `subtitle` | `string` | — | Subtitle/deskripsi halaman |
| `cardTitle` | `string` | — | Judul card (opsional) |
| `isEdit` | `boolean` | `false` | Mode edit |
| `backRoute` | `string` | *required* | Route tombol back |
| `submitRoute` | `string` | *required* | Route submit form |
| `submitMethod` | `"post" \| "put"` | auto (`post`/`put`) | HTTP method |
| `formValues` | `Record<string, any>` | *required* | Data form yang dikirim |
| `isSubmitting` | `boolean` | *required* | State submitting |
| `setIsSubmitting` | `(value: boolean) => void` | *required* | Setter state submitting |
| `successMessage` | `string` | auto | Pesan sukses |
| `errorMessage` | `string` | auto | Pesan error |
| `onSuccess` | `() => void` | — | Callback setelah sukses |
| `onError` | `(errors) => void` | — | Callback setelah error |
| `onSubmit` | `() => void` | — | Custom submit handler (override default) |
| `skeletonFields` | `number` | `4` | Jumlah field skeleton saat loading |
| `submitLabel` | `string` | `"Simpan"` | Label tombol submit |
| `cancelLabel` | `string` | `"Batal"` | Label tombol cancel |
| `children` | `ReactNode` | *required* | Konten form |

### Contoh Penggunaan (Create)

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { CrudFormLayout } from "@/components/crud";
import { UserFormFields } from "./Partial/Form";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
});

const UserCreate = ({ roles }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  return (
    <CrudFormLayout
      title="Tambah User Baru"
      heading="Tambah User"
      subtitle="Tambah pengguna baru ke sistem"
      cardTitle="Form User"
      backRoute="/users"
      submitRoute="/users"
      formValues={form.getValues()}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
      skeletonFields={6}
    >
      <Form {...form}>
        <UserFormFields form={form} roles={roles} />
      </Form>
    </CrudFormLayout>
  );
};

export default UserCreate;
```

### Contoh Penggunaan (Edit) dengan Custom onSubmit

```tsx
const UserEdit = ({ user, roles }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({ defaultValues: { name: user.name, email: user.email } });

  const handleSubmit = () => {
    const values = form.getValues();
    setIsSubmitting(true);
    router.put(`/users/${user.username}`, values, {
      onSuccess: () => toast.success("User diperbarui"),
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <CrudFormLayout
      title={`Edit User - ${user.name}`}
      heading="Edit User"
      subtitle={`Edit data user ${user.name}`}
      cardTitle="Form User"
      isEdit
      backRoute="/users"
      submitRoute={`/users/${user.username}`}
      formValues={form.getValues()}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
      onSubmit={handleSubmit}
    >
      <Form {...form}>
        <UserFormFields form={form} roles={roles} isEdit />
      </Form>
    </CrudFormLayout>
  );
};
```

---

## 3. CrudShowLayout

Layout untuk halaman detail/show. Bisa pakai props `fields` (otomatis render grid) atau `children` (custom layout).

### Props

| Prop | Type | Default | Keterangan |
|------|------|---------|------------|
| `title` | `string` | *required* | Judul halaman (`<Head>`) |
| `heading` | `string` | *required* | Heading halaman |
| `subtitle` | `string` | — | Subtitle halaman |
| `cardTitle` | `string` | `"Detail Informasi"` | Judul card |
| `backRoute` | `string` | *required* | Route tombol back |
| `editRoute` | `string` | — | Route tombol edit |
| `canEdit` | `boolean` | `true` | Apakah tombol edit ditampilkan |
| `fields` | `DetailField[]` | — | Array field detail (auto-render grid 2 kolom) |
| `children` | `ReactNode` | — | Custom content (alternatif dari `fields`) |
| `headerExtra` | `ReactNode` | — | Tombol/konten tambahan di header |

### Interface DetailField

```tsx
interface DetailField {
  label: string;       // Label field
  value: ReactNode;    // Nilai (string, Badge, JSX, dll)
}
```

### Contoh Penggunaan (dengan fields)

```tsx
import { CrudShowLayout } from "@/components/crud";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";

const UserShow = ({ user }) => {
  const { hasPermission } = usePermission();

  return (
    <CrudShowLayout
      title={`Detail User - ${user.name}`}
      heading="Detail User"
      subtitle={`Detail informasi user ${user.name}`}
      backRoute="/users"
      editRoute={`/users/edit/${user.username}`}
      canEdit={hasPermission("edit-users")}
      fields={[
        { label: "Nama Lengkap", value: user.name },
        { label: "Username", value: user.username },
        { label: "Email", value: user.email },
        { label: "Lokasi", value: user.location || "-" },
        {
          label: "Status",
          value: (
            <Badge variant={user.status === "active" ? "default" : "secondary"}>
              {user.status === "active" ? "Aktif" : "Tidak Aktif"}
            </Badge>
          ),
        },
        {
          label: "Tanggal Dibuat",
          value: new Date(user.created_at).toLocaleDateString("id-ID"),
        },
      ]}
    />
  );
};

export default UserShow;
```

### Contoh Penggunaan (dengan children - custom layout)

```tsx
const UserShow = ({ user }) => (
  <CrudShowLayout
    title={`Detail User - ${user.name}`}
    heading="Detail User"
    backRoute="/users"
    editRoute={`/users/edit/${user.username}`}
  >
    <div className="grid grid-cols-3 gap-6">
      {/* Custom layout bebas */}
      <div className="col-span-2">...</div>
      <div>...</div>
    </div>
  </CrudShowLayout>
);
```

---

## 4. Extra Actions (Custom Actions)

Menambahkan action custom di tabel (selain View, Edit, Delete). Muncul sebagai icon button di desktop dan dropdown menu item di mobile.

### Interface ActionConfig

```tsx
interface ActionConfig<T> {
  key: string;                         // Identifier unik
  label: string;                       // Label (tampil di mobile dropdown)
  icon: LucideIcon;                    // Icon dari lucide-react
  onClick: (record: T) => void;        // Handler saat diklik
  className?: string;                  // Custom CSS class (opsional)
  visible?: (record: T) => boolean;    // Kondisional show/hide per record (opsional)
  separator?: boolean;                 // Garis pemisah sebelum item di mobile (opsional)
}
```

### Contoh Penggunaan

```tsx
import { Copy, CheckCircle, Download, Ban } from "lucide-react";
import { ActionConfig } from "@/components/crud";

interface Product {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

const extraActions: ActionConfig<Product>[] = [
  {
    key: "duplicate",
    label: "Duplikat",
    icon: Copy,
    className: "h-8 w-8 text-amber-600 hover:text-amber-600 hover:bg-amber-100",
    onClick: (product) => {
      router.post(`/products/duplicate/${product.id}`);
    },
  },
  {
    key: "approve",
    label: "Approve",
    icon: CheckCircle,
    className: "h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-100",
    onClick: (product) => {
      router.post(`/products/approve/${product.id}`);
    },
    // Hanya tampil jika status bukan Active
    visible: (product) => product.status !== "Active",
  },
  {
    key: "deactivate",
    label: "Nonaktifkan",
    icon: Ban,
    className: "h-8 w-8 text-orange-600 hover:text-orange-600 hover:bg-orange-100",
    onClick: (product) => {
      router.post(`/products/deactivate/${product.id}`);
    },
    visible: (product) => product.status === "Active",
    separator: true, // Garis pemisah di mobile
  },
  {
    key: "export-pdf",
    label: "Export PDF",
    icon: Download,
    onClick: (product) => {
      window.open(`/products/export/${product.id}`, "_blank");
    },
  },
];

// Gunakan di CrudIndexLayout
<CrudIndexLayout
  // ... props lain
  extraActions={extraActions}
/>

// Atau langsung di CrudDataTable
<CrudDataTable
  // ... props lain
  extraActions={extraActions}
/>
```

### Urutan Tampilan Actions (Desktop)

```
[ View ] [ Edit ] [ ...extraActions ] [ Delete ]
```

### Urutan Tampilan Actions (Mobile Dropdown)

```
Lihat
Edit
─────────────── (separator otomatis jika ada extraActions)
Duplikat
Approve
─────────────── (separator manual via prop)
Nonaktifkan
Export PDF
─────────────── (separator otomatis sebelum Delete)
Hapus
```

---

## 5. CrudDataTable (Standalone)

Bisa dipakai langsung tanpa `CrudIndexLayout` jika butuh kontrol penuh atas layout.

### Fitur

- ✅ Server-side pagination (otomatis detect `PaginatedData<T>`)
- ✅ Client-side pagination (jika data berupa array)
- ✅ Search dengan debounce 500ms
- ✅ Dynamic filters (dropdown)
- ✅ Column sorting
- ✅ Bulk selection + bulk delete
- ✅ Extra custom actions
- ✅ Responsive (mobile: swipe scroll + dropdown actions)
- ✅ Custom pagination menggunakan shadcn/ui Select (bukan native select)
- ✅ Records per page: 5, 10, 25, 50

### Contoh Standalone

```tsx
import { CrudDataTable, PaginatedData } from "@/components/crud";

<CrudDataTable
  data={products}
  columns={columns}
  idAccessor="id"
  searchKeys={["name", "sku"]}
  searchPlaceholder="Cari produk..."
  filters={[
    { key: "status", placeholder: "Status", options: statusOptions },
    { key: "category", placeholder: "Kategori", options: categoryOptions },
  ]}
  entityName="produk"
  onView={(product) => router.visit(`/products/view/${product.id}`)}
  onEdit={(product) => router.visit(`/products/edit/${product.id}`)}
  onDelete={(product) => handleDelete(product)}
  onBulkDelete={(products) => handleBulkDelete(products)}
  extraActions={[
    { key: "clone", label: "Clone", icon: Copy, onClick: (p) => clone(p) },
  ]}
/>
```

---

## 6. FilterConfig

Konfigurasi filter dropdown di atas tabel.

```tsx
interface FilterConfig {
  key: string;             // Query param key (misal: "status", "category")
  placeholder: string;     // Placeholder select
  options: FilterOption[]; // Pilihan filter
}

interface FilterOption {
  value: string;   // Nilai (gunakan "all" untuk opsi semua)
  label: string;   // Label yang ditampilkan
}
```

### Contoh

```tsx
const statusFilters: FilterConfig = {
  key: "status",
  placeholder: "Filter Status",
  options: [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
  ],
};
```

---

## 7. PaginatedData Interface

Format data paginated dari Laravel (response `->paginate()`).

```tsx
interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: { url: string | null; label: string; active: boolean }[];
}
```

---

## Pattern Backend (Controller)

Untuk setiap entity CRUD, controller di Laravel mengikuti pattern ini:

```php
class EntityController extends Controller
{
    public function index(Request $request)
    {
        $query = Entity::query();

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        // Filter
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sort (whitelist)
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowed = ['name', 'status', 'created_at'];

        if (in_array($sortField, $allowed)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginate
        $data = $query->paginate($request->input('per_page', 10))->onEachSide(1);

        return Inertia::render('Entity/Index', [
            'data' => $data,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    public function create() { /* ... */ }
    public function store(Request $request) { /* ... */ }
    public function show($id) { /* ... */ }
    public function edit($id) { /* ... */ }
    public function update(Request $request, $id) { /* ... */ }
    public function destroy($id) { /* ... */ }
    public function bulkDestroy(Request $request) { /* ... */ }
}
```

---

## Pattern Routes

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/entity', [EntityController::class, 'index'])->name('entity');
    Route::post('/entity/bulk-delete', [EntityController::class, 'bulkDestroy'])->name('entity.bulk-delete');
    Route::get('/entity/create', [EntityController::class, 'create'])->name('entity.create');
    Route::post('/entity', [EntityController::class, 'store'])->name('entity.store');
    Route::get('/entity/edit/{id}', [EntityController::class, 'edit'])->name('entity.edit');
    Route::put('/entity/{id}', [EntityController::class, 'update'])->name('entity.update');
    Route::get('/entity/view/{id}', [EntityController::class, 'show'])->name('entity.show');
    Route::delete('/entity/{id}', [EntityController::class, 'destroy'])->name('entity.destroy');
});
```

---

## Checklist Membuat CRUD Baru

1. **Backend:**
   - [ ] Buat Model (`app/Models/Entity.php`)
   - [ ] Buat Migration (`database/migrations/...`)
   - [ ] Buat Controller (`app/Http/Controllers/EntityController.php`)
   - [ ] Tambah routes di `routes/web.php`

2. **Frontend:**
   - [ ] Buat `Pages/Entity/Types.ts` (interface + form values)
   - [ ] Buat `Pages/Entity/Index.tsx` (gunakan `CrudIndexLayout`)
   - [ ] Buat `Pages/Entity/Create.tsx` (gunakan `CrudFormLayout`)
   - [ ] Buat `Pages/Entity/Edit.tsx` (gunakan `CrudFormLayout` + `isEdit`)
   - [ ] Buat `Pages/Entity/Show.tsx` (gunakan `CrudShowLayout`)
   - [ ] Buat `Pages/Entity/Partial/Form.tsx` (form fields reusable)

3. **Opsional:**
   - [ ] Tambah permission di seeder
   - [ ] Tambah menu di sidebar
   - [ ] Tambah extra actions jika diperlukan
