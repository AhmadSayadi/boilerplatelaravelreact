import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  image?: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "iPhone 15 Pro", sku: "IPH-15P-256", category: "Elektronik", price: 19999000, stock: 45, description: "iPhone 15 Pro 256GB", status: "Active", createdAt: "2024-01-15", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop" },
  { id: "2", name: "Samsung Galaxy S24", sku: "SAM-S24-128", category: "Elektronik", price: 14999000, stock: 32, description: "Samsung Galaxy S24 128GB", status: "Active", createdAt: "2024-02-20", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop" },
  { id: "3", name: "MacBook Air M3", sku: "MAC-AIR-M3", category: "Elektronik", price: 18499000, stock: 18, description: "MacBook Air M3 256GB", status: "Active", createdAt: "2024-03-10", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" },
  { id: "4", name: "Kaos Polos Premium", sku: "FSH-KP-001", category: "Fashion", price: 89000, stock: 250, description: "Kaos polos cotton combed 30s", status: "Active", createdAt: "2024-01-25" },
  { id: "5", name: "Celana Jeans Slim", sku: "FSH-CJ-002", category: "Fashion", price: 299000, stock: 85, description: "Celana jeans slim fit stretch", status: "Active", createdAt: "2024-04-05" },
  { id: "6", name: "Sepatu Sneakers", sku: "FSH-SS-003", category: "Fashion", price: 549000, stock: 60, description: "Sepatu sneakers casual", status: "Active", createdAt: "2024-02-14", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  { id: "7", name: "Kopi Arabica 250gr", sku: "MKN-KA-001", category: "Makanan", price: 75000, stock: 120, description: "Kopi arabica premium Toraja", status: "Active", createdAt: "2024-03-22" },
  { id: "8", name: "Rendang Padang 500gr", sku: "MKN-RP-002", category: "Makanan", price: 125000, stock: 45, description: "Rendang daging sapi asli Padang", status: "Active", createdAt: "2024-01-08" },
  { id: "9", name: "Teh Hijau Organik", sku: "MNM-TH-001", category: "Minuman", price: 45000, stock: 200, description: "Teh hijau organik 100 sachet", status: "Active", createdAt: "2024-04-12" },
  { id: "10", name: "Air Mineral 600ml", sku: "MNM-AM-002", category: "Minuman", price: 4000, stock: 500, description: "Air mineral kemasan 600ml", status: "Active", createdAt: "2024-03-18" },
  { id: "11", name: "Vitamin C 1000mg", sku: "KES-VC-001", category: "Kesehatan", price: 89000, stock: 150, description: "Vitamin C 1000mg 30 tablet", status: "Active", createdAt: "2024-02-28" },
  { id: "12", name: "Masker KF94", sku: "KES-MK-002", category: "Kesehatan", price: 35000, stock: 8, description: "Masker KF94 isi 10pcs", status: "Inactive", createdAt: "2024-01-30" },
  { id: "13", name: "Serum Wajah", sku: "KEC-SW-001", category: "Kecantikan", price: 185000, stock: 75, description: "Serum wajah vitamin C", status: "Active", createdAt: "2024-04-02", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop" },
  { id: "14", name: "Sunscreen SPF 50", sku: "KEC-SS-002", category: "Kecantikan", price: 125000, stock: 90, description: "Sunscreen SPF 50 PA+++", status: "Active", createdAt: "2024-03-05" },
  { id: "15", name: "Dumbbell 5kg", sku: "OLR-DB-001", category: "Olahraga", price: 175000, stock: 40, description: "Dumbbell 5kg sepasang", status: "Active", createdAt: "2024-02-10" },
  { id: "16", name: "Matras Yoga", sku: "OLR-MY-002", category: "Olahraga", price: 250000, stock: 55, description: "Matras yoga anti slip 6mm", status: "Active", createdAt: "2024-01-22", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&h=100&fit=crop" },
  { id: "17", name: "Oli Motor 1L", sku: "OTM-OM-001", category: "Otomotif", price: 85000, stock: 100, description: "Oli motor synthetic 1 liter", status: "Active", createdAt: "2024-04-08" },
  { id: "18", name: "Aki Motor", sku: "OTM-AK-002", category: "Otomotif", price: 350000, stock: 25, description: "Aki motor MF 5Ah", status: "Active", createdAt: "2024-03-15" },
  { id: "19", name: "Panci Set", sku: "PRH-PS-001", category: "Peralatan Rumah", price: 450000, stock: 30, description: "Set panci stainless 5pcs", status: "Active", createdAt: "2024-02-05", image: "https://images.unsplash.com/photo-1584990347449-a3b23ef35e67?w=100&h=100&fit=crop" },
  { id: "20", name: "Blender 1.5L", sku: "PRH-BL-002", category: "Peralatan Rumah", price: 599000, stock: 22, description: "Blender 1.5 liter 350 watt", status: "Active", createdAt: "2024-01-18" },
  { id: "21", name: "AirPods Pro 2", sku: "ELK-AP-003", category: "Elektronik", price: 3999000, stock: 35, description: "AirPods Pro 2nd Gen", status: "Active", createdAt: "2024-04-15", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop" },
  { id: "22", name: "Jaket Hoodie", sku: "FSH-JH-004", category: "Fashion", price: 249000, stock: 95, description: "Jaket hoodie fleece", status: "Active", createdAt: "2024-03-28" },
  { id: "23", name: "Snack Box", sku: "MKN-SB-003", category: "Makanan", price: 55000, stock: 3, description: "Snack box camilan ringan", status: "Inactive", createdAt: "2024-02-22" },
  { id: "24", name: "Jus Buah 1L", sku: "MNM-JB-003", category: "Minuman", price: 28000, stock: 180, description: "Jus buah segar 1 liter", status: "Active", createdAt: "2024-01-12" },
  { id: "25", name: "Hand Sanitizer", sku: "KES-HS-003", category: "Kesehatan", price: 25000, stock: 220, description: "Hand sanitizer 500ml", status: "Active", createdAt: "2024-04-20" },
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkDeleteProducts: (ids: string[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: initialProducts,
  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  bulkDeleteProducts: (ids) =>
    set((state) => ({ products: state.products.filter((p) => !ids.includes(p.id)) })),
}));
