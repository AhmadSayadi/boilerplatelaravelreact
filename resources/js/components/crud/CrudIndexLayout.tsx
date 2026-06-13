import { useState, useEffect, ReactNode } from "react";
import { router, Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CrudDataTable, PaginatedData, FilterConfig } from "./CrudDataTable";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { PageSkeleton, TableSkeleton } from "./index";
import { DataTableColumn } from "mantine-datatable";

export interface CrudIndexLayoutProps<T> {
  /** Page title for <Head> */
  title: string;
  /** Card title */
  cardTitle: string;
  /** Card description */
  cardDescription: string;
  /** Paginated data from server or local array */
  data: PaginatedData<T> | T[];
  /** DataTable column definitions */
  columns: DataTableColumn<T>[];
  /** Unique ID accessor (default: "id") */
  idAccessor?: keyof T;
  /** Keys to search on */
  searchKeys?: (keyof T)[];
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Filter configurations */
  filters?: FilterConfig[];
  /** Entity name for labels (e.g., "user", "produk") */
  entityName?: string;
  /** Base route path (e.g., "/users", "/products") */
  routePrefix: string;
  /** Function to get the item identifier for routing (default: record[idAccessor]) */
  getItemId?: (record: T) => string | number;
  /** Function to get item name for delete dialog */
  getItemName?: (record: T) => string;
  /** Whether to show the "Add" button */
  showCreateButton?: boolean;
  /** Custom create button label */
  createButtonLabel?: string;
  /** Permission check for view action */
  canView?: boolean;
  /** Permission check for create action */
  canCreate?: boolean;
  /** Permission check for edit action */
  canEdit?: boolean;
  /** Permission check for delete action */
  canDelete?: boolean;
  /** Custom handler for view action */
  onView?: (record: T) => void;
  /** Custom handler for edit action */
  onEdit?: (record: T) => void;
  /** Custom handler for delete (overrides default) */
  onDeleteOverride?: (record: T) => void;
  /** Custom bulk delete field name (default: "ids") */
  bulkDeleteField?: string;
  /** Custom bulk delete route (default: routePrefix + "/bulk-delete") */
  bulkDeleteRoute?: string;
  /** Additional header content (right side) */
  headerExtra?: ReactNode;
  /** Custom render actions per row */
  renderActions?: (record: T) => ReactNode;
  /** Default sort key */
  defaultSortKey?: keyof T;
  /** Default sort direction */
  defaultSortDirection?: "asc" | "desc";
}

export function CrudIndexLayout<T extends Record<string, any>>({
  title,
  cardTitle,
  cardDescription,
  data,
  columns,
  idAccessor = "id" as keyof T,
  searchKeys = [],
  searchPlaceholder,
  filters = [],
  entityName = "data",
  routePrefix,
  getItemId,
  getItemName,
  showCreateButton = true,
  createButtonLabel = "Tambah",
  canView = true,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  onView,
  onEdit,
  onDeleteOverride,
  bulkDeleteField = "ids",
  bulkDeleteRoute,
  headerExtra,
  renderActions,
  defaultSortKey,
  defaultSortDirection = "desc",
}: CrudIndexLayoutProps<T>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resolveId = (record: T): string | number => {
    if (getItemId) return getItemId(record);
    return record[idAccessor];
  };

  const resolveName = (record: T): string => {
    if (getItemName) return getItemName(record);
    return record["name"] || record[idAccessor] || "";
  };

  const handleView = (record: T) => {
    if (onView) {
      onView(record);
      return;
    }
    router.visit(`${routePrefix}/view/${resolveId(record)}`);
  };

  const handleEdit = (record: T) => {
    if (onEdit) {
      onEdit(record);
      return;
    }
    router.visit(`${routePrefix}/edit/${resolveId(record)}`);
  };

  const handleDelete = (record: T) => {
    if (onDeleteOverride) {
      onDeleteOverride(record);
      return;
    }
    setItemToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      router.delete(`${routePrefix}/${resolveId(itemToDelete)}`, {
        onSuccess: () => {
          toast.success(`${entityName} berhasil dihapus`);
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        },
        onError: () => {
          toast.error(`Gagal menghapus ${entityName}`);
        },
      });
    }
  };

  const handleBulkDelete = (selectedRecords: T[]) => {
    const ids = selectedRecords.map((r) => resolveId(r));
    const deleteRoute = bulkDeleteRoute || `${routePrefix}/bulk-delete`;

    router.post(deleteRoute, { [bulkDeleteField]: ids } as any, {
      onSuccess: () => {
        toast.success(`${selectedRecords.length} ${entityName} berhasil dihapus`);
      },
      onError: () => {
        toast.error(`Gagal menghapus beberapa ${entityName}`);
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title={title} />
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <PageSkeleton />
            <TableSkeleton />
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {headerExtra}
                {showCreateButton && canCreate && (
                  <Button onClick={() => router.visit(`${routePrefix}/create`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {createButtonLabel}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CrudDataTable
                data={data}
                columns={columns}
                idAccessor={idAccessor}
                searchKeys={searchKeys}
                searchPlaceholder={searchPlaceholder}
                filters={filters}
                entityName={entityName}
                onView={canView ? handleView : undefined}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                onBulkDelete={canDelete ? handleBulkDelete : undefined}
                renderActions={renderActions}
                defaultSortKey={defaultSortKey}
                defaultSortDirection={defaultSortDirection}
              />
            </CardContent>
          </Card>
        )}

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title={`Hapus ${entityName}`}
          description={`Apakah Anda yakin ingin menghapus "${itemToDelete ? resolveName(itemToDelete) : ""}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  );
}
