import { useState, useMemo, useEffect, ReactNode, forwardRef } from "react";
import { DataTable, DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Pencil, Trash2, MoreVertical, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
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
import { router } from "@inertiajs/react";

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

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
  data: T[] | PaginatedData<T>;
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

const IconWrapper = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
);
IconWrapper.displayName = "IconWrapper";

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

  // Initialize from URL params if available
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  });

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initialFilters: Record<string, string> = filters.reduce((acc, f) => ({ ...acc, [f.key]: "all" }), {});
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      filters.forEach((f) => {
        const val = params.get(f.key);
        if (val) initialFilters[f.key] = val;
      });
    }
    return initialFilters;
  });

  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

  // Check if data is paginated
  const isPaginated = (d: any): d is PaginatedData<T> => {
    return d && "data" in d && "meta" in d ? false : d && "current_page" in d && "data" in d;
  };

  const rawData = isPaginated(data) ? data.data : data;

  // Client-side state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: (defaultSortKey as string) || "id",
    direction: defaultSortDirection,
  });
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    if (isPaginated(data)) {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const currentSearch = params.get("search") || "";
        
        if (search !== currentSearch) {
           router.get(
            window.location.pathname,
            getQueryParams({ page: 1 }),
            { preserveState: true, preserveScroll: true }
          );
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [search]);

  // Client-side filtering/sorting logic (only if not paginated)
  const filteredData = useMemo(() => {
    if (isPaginated(data)) return rawData; // Server handles filtering

    let result = rawData.filter((record) => {
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
  }, [data, search, searchKeys, filters, filterValues, sortStatus, rawData]);

  const displayData = useMemo(() => {
    if (isPaginated(data)) return rawData;

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return filteredData.slice(from, to);
  }, [filteredData, page, pageSize, data, rawData]);

  const getQueryParams = (overrides: Record<string, any> = {}) => {
    return {
      page: 1,
      search,
      sort: sortStatus.columnAccessor as string,
      direction: sortStatus.direction,
      ...filterValues,
      ...overrides,
    };
  };

  const handlePageChange = (p: number) => {
    if (isPaginated(data)) {
      router.get(
        window.location.pathname,
        getQueryParams({ page: p }),
        { preserveState: true, preserveScroll: true }
      );
    } else {
      setPage(p);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);

    if (isPaginated(data)) {
      router.get(
        window.location.pathname,
        { ...getQueryParams(), ...newFilters, page: 1 },
        { preserveState: true, preserveScroll: true }
      );
    } else {
      setPage(1);
    }
  };

  const handleSortStatusChange = (status: DataTableSortStatus<T>) => {
    setSortStatus(status);
    if (isPaginated(data)) {
      router.get(
        window.location.pathname,
        getQueryParams({
          page: data.current_page,
          sort: status.columnAccessor,
          direction: status.direction,
        }),
        { preserveState: true, preserveScroll: true }
      );
    }
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
                if (!isPaginated(data)) setPage(1);
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
            <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
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
            records={displayData}
            columns={tableColumns}
            totalRecords={isPaginated(data) ? data.total : filteredData.length}
            recordsPerPage={isPaginated(data) ? data.per_page : pageSize}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            page={isPaginated(data) ? data.current_page : page}
            onPageChange={handlePageChange}
            sortStatus={sortStatus}
            onSortStatusChange={handleSortStatusChange}
            sortIcons={{
              sorted: (
                <IconWrapper>
                  {sortStatus.direction === 'asc' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </IconWrapper>
              ),
              unsorted: (
                <IconWrapper>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </IconWrapper>
              ),
            }}
            selectedRecords={isMobile ? undefined : selectedRecords}
            onSelectedRecordsChange={isMobile ? undefined : setSelectedRecords}
            idAccessor={idAccessor as string}
            noRecordsText={`Tidak ada ${entityName} ditemukan`}
            paginationText={({ from, to, totalRecords }) => `${from} - ${to} / ${totalRecords}`}
            recordsPerPageLabel=""
            styles={{
              root: {
                fontSize: "0.875rem",
                backgroundColor: "transparent",
              },
              header: {
                fontSize: "0.75rem",
                backgroundColor: "transparent",
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
