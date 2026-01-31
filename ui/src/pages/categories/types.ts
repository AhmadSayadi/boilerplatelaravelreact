import { Category } from "@/stores/categoryStore";

export type { Category };

export interface CategoryFormValues {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  slug?: string;
  image?: string;
  parentId?: string;
  productCount?: number;
}
