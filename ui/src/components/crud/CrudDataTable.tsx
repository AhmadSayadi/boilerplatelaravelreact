import { useState, useMemo, ReactNode } from "react";
import { DataTable, DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import sortBy from "lodash/sortBy";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeScroll } from "@/hooks/use-swipe-scroll";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

export interface CrudDataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  idAccessor?: keyof T;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterConfig[];
  entityName?: string;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onBulkDelete?: (records: T[]) => void;
  showActions?: boolean;
  actionsWidth?: number;
  defaultSortKey?: keyof T;
  defaultSortDirection?: "asc" | "desc";
  renderActions?: (record: T) => ReactNode;
}

const PAGE_SIZES = [5, 10, 25, 50];

export function CrudDataTable<T extends Record<string, any>>({
  data,
  columns,
  idAccessor = "id" as keyof T,
  searchPlaceholder = "Cari...",
  searchKeys = [],
  filters = [],
  entityName = "data",
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  showActions = true,
  actionsWidth = 120,
  defaultSortKey,
  defaultSortDirection = "desc",
  renderActions,
}: CrudDataTableProps<T>) {
  const isMobile = useIsMobile();
  const swipeContainerRef = useSwipeScroll(isMobile);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce((acc, f) => ({ ...acc, [f.key]: "all" }), {}),
  );
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: (defaultSortKey as string) || "id",
    direction: defaultSortDirection,
  });
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const filteredData = useMemo(() => {
    let result = data.filter((record) => {
      // Search filter
      const matchesSearch =
        searchKeys.length === 0 ||
        searchKeys.some((key) => String(record[key]).toLowerCase().includes(search.toLowerCase()));

      // Dynamic filters
      const matchesFilters = filters.every((filter) => {
        const filterValue = filterValues[filter.key];
        return filterValue === "all" || record[filter.key] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });

    // Sort
    const sorted = sortBy(result, sortStatus.columnAccessor);
    result = sortStatus.direction === "desc" ? sorted.reverse() : sorted;

    return result;
  }, [data, search, searchKeys, filters, filterValues, sortStatus]);

  const paginatedData = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return filteredData.slice(from, to);
  }, [filteredData, page, pageSize]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    if (onBulkDelete && selectedRecords.length > 0) {
      onBulkDelete(selectedRecords);
      setSelectedRecords([]);
      setBulkDeleteDialogOpen(false);
    }
  };

  // Mobile action menu
  const MobileActions = ({ record }: { record: T }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={() => onView(record)}>
            <Eye className="h-4 w-4 mr-2" />
            Lihat
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(record)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(record)} className="text-destructive focus:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Build columns with actions
  const tableColumns: DataTableColumn<T>[] = useMemo(() => {
    const cols = [...columns];

    if (showActions && (onView || onEdit || onDelete || renderActions)) {
      cols.push({
        accessor: "actions" as keyof T,
        title: "Aksi",
        textAlign: "center",
        width: actionsWidth,
        render: (record) =>
          renderActions ? (
            renderActions(record)
          ) : (
            <>
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center justify-center gap-1">
                {onView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                    onClick={() => onView(record)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => onEdit(record)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(record)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {/* Mobile Actions */}
              <div className="sm:hidden flex justify-center">
                <MobileActions record={record} />
              </div>
            </>
          ),
      });
    }

    return cols;
  }, [columns, showActions, onView, onEdit, onDelete, renderActions, actionsWidth]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
        {searchKeys.length > 0 && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        )}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key]}
                onValueChange={(v) => handleFilterChange(filter.key, v)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>

      {/* Bulk actions bar */}
      {selectedRecords.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b border-border">
          <span className="text-sm text-muted-foreground">
            {selectedRecords.length} {entityName} dipilih
          </span>
          {onBulkDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus {selectedRecords.length} {entityName}
            </Button>
          )}
        </div>
      )}

      {/* DataTable with swipe gesture */}
      <div
        ref={swipeContainerRef}
        className="overflow-x-auto touch-pan-y overscroll-x-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: isMobile ? "800px" : "auto" }}>
          <DataTable
            pinLastColumn={!isMobile && showActions}
            withTableBorder={false}
            borderRadius="md"
            striped
            highlightOnHover
            minHeight={200}
            scrollAreaProps={{ type: "never" }}
            records={paginatedData}
            columns={tableColumns}
            totalRecords={filteredData.length}
            recordsPerPage={pageSize}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            page={page}
            onPageChange={setPage}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            selectedRecords={isMobile ? undefined : selectedRecords}
            onSelectedRecordsChange={isMobile ? undefined : setSelectedRecords}
            idAccessor={idAccessor as string}
            noRecordsText={`Tidak ada ${entityName} ditemukan`}
            paginationText={({ from, to, totalRecords }) => `${from} - ${to} / ${totalRecords}`}
            recordsPerPageLabel=""
            styles={{
              root: {
                fontSize: "0.875rem",
              },
              header: {
                fontSize: "0.75rem",
              },
            }}
          />
        </div>
      </div>

      {/* Bulk Delete Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        title="Hapus Data"
        description={`Apakah Anda yakin ingin menghapus ${selectedRecords.length} ${entityName}? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
