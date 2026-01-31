# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## SIPNU (Sistem Informasi Pelajar NU)
### Sistem Pendataan Organisasi PAC IPNU – IPPNU

---

## 1. Ringkasan Produk
SIPNU (Sistem Informasi Pelajar NU) adalah aplikasi berbasis web yang digunakan untuk mengelola data organisasi IPNU (Putra) dan IPPNU (Putri) di tingkat Kecamatan (PAC), dengan struktur organisasi di bawahnya berupa Ranting. Sistem ini berfungsi sebagai pusat data kader, alumni, kaderisasi, administrasi surat, keuangan, dan kegiatan secara terintegrasi, aman, dan berkelanjutan lintas masa khidmat.

---

## 2. Tujuan Produk
- Menyatukan pendataan IPNU dan IPPNU dalam satu sistem
- Menjaga pemisahan data Putra dan Putri
- Memudahkan PAC dalam kontrol dan pelaporan
- Menjadi arsip digital kader & alumni jangka panjang
- Mendukung administrasi resmi NU (surat, SK, LPJ)

---

## 3. Cakupan Pengguna (User Roles)

### 3.1 Role Utama
- Super Admin Sistem
- Admin PAC IPNU
- Admin PAC IPPNU
- Ketua PAC
- Sekretaris PAC
- Bendahara PAC
- Operator Ranting
- Viewer PC / PK (Read Only)

---

## 4. Struktur Organisasi dalam Sistem

- Organisasi: IPNU / IPPNU
- Level: PAC → Ranting
- Masa Khidmat (periode kepengurusan)

Setiap data wajib memiliki relasi:
- Organisasi
- Wilayah (PAC / Ranting)
- Masa Khidmat

---

## 5. Modul & Kebutuhan Fungsional

### 5.1 Modul Setting Sistem
**Fungsi:**
- Setting organisasi (IPNU & IPPNU)
- Setting masa khidmat
- Setting logo & identitas
- Setting format nomor surat
- Setting jenjang kaderisasi

---

### 5.2 Modul Wilayah & Struktur
**Fungsi:**
- Data PAC
- Data Ranting
- Struktur Pengurus
- Jabatan & Bidang
- Riwayat kepengurusan

---

### 5.3 Modul Anggota & Kader
**Tujuan:** menyimpan profil kader secara lengkap (identitas, keanggotaan, pendidikan, prestasi) untuk kebutuhan pendataan, pembinaan, rekomendasi, dan pelaporan.

**Fungsi:**
- Input data anggota/kader
- Penetapan NIA
- Status anggota (aktif / nonaktif / alumni)
- Ranting asal
- Riwayat jabatan
- Verifikasi anggota oleh Ranting (sesuai alur mobile)

**Submodul: Form Profil Kader (Data Pendidikan & Prestasi) — Wajib**
1) **Data Identitas (wajib diisi saat pendaftaran/validasi)**
- Nama lengkap
- NIS / NISN (opsional, jika tersedia)
- Tempat & tanggal lahir
- Jenis kelamin
- Agama
- Kewarganegaraan
- Alamat lengkap
- Foto kader (upload)

2) **Data Akademik / Riwayat Sekolah (multi-entry / 1 kader bisa banyak jenjang)**
- Sekolah / Madrasah
- Jenjang & kelas
- Jurusan (jika ada)
- Tahun masuk
- Tahun keluar (opsional)
- Status siswa (aktif, pindah, lulus, keluar)
- Riwayat kelas / kenaikan kelas (opsional)

3) **Prestasi (multi-entry / 1 kader bisa banyak prestasi)**
- Kategori: Akademik / Non-akademik
- Nama prestasi
- Tingkat: Sekolah/Ranting/PAC/Kab- Kota/Provinsi/Nasional/Internasional
- Tahun
- Penyelenggara (opsional)
- Lampiran bukti (sertifikat/piagam) (opsional)

4) **Ekstrakurikuler (multi-entry)**
- Nama ekskul
- Peran (anggota/pengurus/kapten/dll)
- Periode
- Keterangan

5) **Catatan Kedisiplinan/Pelanggaran (single record; akses terbatas)**
- Status kedisiplinan (baik/peringatan/pembinaan)
- Tanggal terakhir pembaruan
- Ringkasan catatan (teks)
- Tindak lanjut/sanksi (jika ada)
- Lampiran (opsional)

Catatan:
- Hanya **1 catatan aktif** per kader
- Digunakan sebagai status pembinaan, bukan riwayat kasus

6)  **Minat & Bakat**
- Minat (tag/daftar)
- Bakat/keahlian (tag/daftar)
- Portofolio/link (opsional)

**Aturan Akses & Persetujuan:**
- Pengisian awal identitas dilakukan saat pendaftaran; kelengkapan profil dapat dilanjutkan setelah Approved.
- Data akademik/prestasi/ekskul/minat-bakat dapat diinput oleh kader setelah Approved dan dapat diverifikasi oleh Ranting (opsional sesuai kebijakan).
- Catatan pelanggaran bersifat sensitif: hanya role tertentu di Ranting/PAC yang boleh melihat/menambah (mis. Ketua/Sekretaris/Admin).

**Catatan Relasi Data:**
- 1 kader → banyak riwayat sekolah
- 1 kader → banyak prestasi
- 1 kader → banyak ekskul
- 1 kader → 1 catatan kedisiplinan

---

#### B. Data Akademik (Multi Jenjang)
- Nama Sekolah / Madrasah
- Jenjang Pendidikan (SD/MI, SMP/MTs, SMA/MA/SMK, PT)
- Kelas / Semester
- Jurusan (jika ada)
- Tahun Masuk
- Tahun Lulus (opsional)
- Status Siswa (Aktif, Pindah, Lulus, Keluar)
- Riwayat Kenaikan Kelas

Catatan:
- Satu kader dapat memiliki **lebih dari satu riwayat jenjang sekolah**.
- Riwayat pendidikan disimpan sebagai data historis (tidak menimpa data lama).

---

#### C. Prestasi Kader (Multi Data)
- Jenis Prestasi (Akademik / Non-Akademik)
- Nama Prestasi
- Tingkat (Sekolah, Kecamatan, Kabupaten, Provinsi, Nasional)
- Tahun
- Penyelenggara
- Bukti Prestasi (Upload Sertifikat)

Catatan:
- Satu kader dapat memiliki **banyak prestasi**.

---

#### D. Ekstrakurikuler
- Nama Kegiatan
- Peran (Anggota / Pengurus)
- Tahun Aktif
- Keterangan

---

#### E. Minat & Bakat
- Bidang Minat (Organisasi, Dakwah, Olahraga, Seni, Akademik, Teknologi, dll)
- Deskripsi Singkat

---

#### F. Catatan Disiplin & Pelanggaran (Internal)
- Jenis Pelanggaran
- Tingkat (Ringan / Sedang / Berat)
- Tanggal
- Keterangan
- Penanganan

Catatan:
- Bersifat internal
- Hanya bisa diakses oleh Admin Ranting & PAC

---

### 5.4 Modul Kaderisasi
**Jenjang:**
- MAKESTA
- LAKMUD
- LAKUT

**Fungsi Umum:**
- Input peserta
- Validasi kelulusan
- Sertifikat kaderisasi
- Riwayat kaderisasi
- Monitoring kader naik jenjang

**Fitur Khusus MAKESTA (Wajib):**
- Form Pendaftaran Publik (Public Form)
- Status Pendaftaran (Dibuka / Ditutup)
- Link Pendaftaran Umum (tanpa login)
- Field wajib: Nama, TTL, Alamat, Ranting, IPNU/IPPNU, Kontak
- Validasi data oleh PAC
- Konversi otomatis ke data Anggota setelah lulus

Catatan:
- Selama status pendaftaran = Dibuka, form publik wajib tersedia
- Setelah Ditutup, form otomatis tidak bisa diakses
- Data pendaftar tersimpan terpisah sebelum validasi

---

### 5.5 Modul Alumni
**Fungsi:**
- Penetapan status alumni
- Arsip data alumni
- Riwayat organisasi
- Kontak alumni
- Alumni strategis

Catatan: data alumni dikunci (read-only)

---

### 5.6 Modul Administrasi & Surat
**Fungsi:**
- Surat masuk
- Surat keluar
- Disposisi
- Template surat
- Penomoran otomatis
- Arsip digital

---

### 5.7 Modul Keuangan
**Fungsi:**
- Kas organisasi
- Iuran anggota
- Donasi & sponsorship
- Pengeluaran
- Anggaran kegiatan
- Laporan keuangan

---

### 5.8 Modul Kegiatan
**Fungsi:**
- Program kerja
- Agenda kegiatan
- Panitia
- Absensi
- Dokumentasi

---

### 5.9 Modul Laporan & Dashboard
**Fungsi:**
- Dashboard Ketua & Sekretaris
- Rekap kader & alumni
- Rekap kaderisasi
- Rekap keuangan
- Export PDF / Excel

---

### 5.10 Modul Keamanan & Audit
**Fungsi:**
- Hak akses (RBAC)
- Log aktivitas
- Riwayat perubahan data
- Backup sistem

---

## 6. Alur Kerja Utama (User Flow)

### 6.1 Alur Pendaftaran Anggota via Mobile (Roadmap)
1. Calon anggota membuka aplikasi Mobile SIPNU
2. Calon anggota memilih organisasi (IPNU / IPPNU) dan Ranting
3. Calon anggota mengisi form pendaftaran (data dasar + kontak)
4. Sistem membuat status pendaftar = **Menunggu Verifikasi Ranting**
5. Admin/Operator Ranting membuka menu **Verifikasi Anggota**
6. Ranting melakukan pengecekan (validasi identitas & domisili/asal ranting)
7. Jika valid, Ranting **Approve** → status menjadi **Anggota Aktif**
8. Jika tidak valid/duplikat, Ranting **Tolak** dengan alasan

Catatan:
- Pendaftar yang belum di-approve belum dianggap anggota dan tidak memiliki akses fitur kaderisasi internal.
- Semua approval tersimpan dalam audit log.

### 6.2 Alur Upload Kaderisasi oleh Anggota
1. Anggota yang sudah **Approved** login (web/mobile)
2. Anggota membuka menu **Riwayat Kaderisasi**
3. Anggota memilih jenis kaderisasi (MAKESTA/LAKMUD/LATIN-LATPEL/LAKUT)
4. Anggota mengisi detail (tanggal, tempat, penyelenggara, nomor sertifikat jika ada)
5. Anggota mengunggah bukti (sertifikat/foto dokumen)
6. Sistem membuat status kaderisasi = **Menunggu Persetujuan Ranting**
7. Admin/Operator Ranting meninjau dan **Approve/Tolak**
8. Jika Approved, riwayat kaderisasi masuk ke profil kader dan dapat dipakai untuk syarat jenjang berikutnya.

Catatan:
- Proses approval kaderisasi dilakukan di ranting masing-masing.
- PAC memiliki akses monitoring & rekap lintas ranting.

---

### 6.2 Alur Kaderisasi oleh Anggota
1. Anggota login (Web / Mobile)
2. Upload data kaderisasi (MAKESTA / LAKMUD / LATIN / LAKUT)
3. Status data kaderisasi: **Menunggu Verifikasi Ranting**
4. Admin Ranting melakukan pengecekan
5. Jika sesuai → Approve
6. Jika tidak sesuai → Revisi / Ditolak
7. Data kaderisasi tersimpan permanen di profil anggota

---

## 7. Non-Functional Requirements
- Web-based & mobile friendly
- Role-based access control
- Aman & terenkripsi
- Mudah dikembangkan ke PC/PK
- Siap multi tahun kepengurusan

---

## 8. Indikator Keberhasilan
- Data kader tidak hilang antar masa khidmat
- Laporan PAC cepat & akurat
- Surat menyurat rapi & konsisten
- Alumni terdata dan terhubung

---

## 9. Catatan Pengembangan Lanjutan
- Mobile App (Android)
- Integrasi WhatsApp
- KTA Digital
- Dashboard PC / PW

---

**Dokumen ini menjadi acuan resmi pengembangan sistem pendataan PAC IPNU–IPPNU.**

