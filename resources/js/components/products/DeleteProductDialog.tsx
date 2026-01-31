import { Product } from "@/stores/productStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => void;
}

export function DeleteProductDialog({ open, onOpenChange, product, onConfirm }: DeleteProductDialogProps) {
  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 my-2">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {product.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
