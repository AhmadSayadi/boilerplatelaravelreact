import { create } from "zustand";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  status: "Active" | "Inactive";
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  bulkDeleteCategories: (ids: string[]) => void;
  getCategory: (id: string) => Category | undefined;
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Elektronik",
    slug: "elektronik",
    description: "Produk-produk elektronik seperti handphone, laptop, dan aksesoris",
    status: "Active",
    productCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
  {
    id: "2",
    name: "Fashion Pria",
    slug: "fashion-pria",
    description: "Pakaian dan aksesoris untuk pria",
    status: "Active",
    productCount: 120,
    createdAt: "2024-01-10",
    updatedAt: "2024-03-18",
  },
  {
    id: "3",
    name: "Fashion Wanita",
    slug: "fashion-wanita",
    description: "Pakaian dan aksesoris untuk wanita",
    status: "Active",
    productCount: 200,
    createdAt: "2024-01-08",
    updatedAt: "2024-03-22",
  },
  {
    id: "4",
    name: "Makanan & Minuman",
    slug: "makanan-minuman",
    description: "Produk makanan dan minuman",
    status: "Active",
    productCount: 85,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "5",
    name: "Kesehatan",
    slug: "kesehatan",
    description: "Produk kesehatan dan suplemen",
    status: "Inactive",
    productCount: 30,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "6",
    name: "Olahraga",
    slug: "olahraga",
    description: "Peralatan dan pakaian olahraga",
    status: "Active",
    productCount: 55,
    createdAt: "2024-02-20",
    updatedAt: "2024-03-25",
  },
  {
    id: "7",
    name: "Rumah Tangga",
    slug: "rumah-tangga",
    description: "Peralatan dan perlengkapan rumah tangga",
    status: "Active",
    productCount: 75,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-28",
  },
  {
    id: "8",
    name: "Otomotif",
    slug: "otomotif",
    description: "Aksesoris dan spare part kendaraan",
    status: "Inactive",
    productCount: 40,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-20",
  },
];

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: initialCategories,
  addCategory: (category) =>
    set((state) => ({
      categories: [
        ...state.categories,
        {
          ...category,
          id: String(Date.now()),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        },
      ],
    })),
  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id
          ? { ...c, ...category, updatedAt: new Date().toISOString().split("T")[0] }
          : c
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  bulkDeleteCategories: (ids) =>
    set((state) => ({
      categories: state.categories.filter((c) => !ids.includes(c.id)),
    })),
  getCategory: (id) => get().categories.find((c) => c.id === id),
}));
