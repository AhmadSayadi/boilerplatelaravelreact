import { useState, useMemo, useEffect, ReactNode, forwardRef } from "react";
import { DataTable, DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Pencil, Trash2, MoreVertical, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export interface ActionConfig<T> {
  /** Unique key for this action */
  key: string;
  /** Label shown in mobile dropdown */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Handler when action is clicked */
  onClick: (record: T) => void;
  /** Custom class for the button (optional) */
  className?: string;
  /** Whether to show this action for a specific record (optional, default: true) */
  visible?: (record: T) => boolean;
  /** Separator before this action in mobile menu (optional) */
  separator?: boolean;
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
  /** Additional custom actions (shown alongside view/edit/delete) */
  extraActions?: ActionConfig<T>[];
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
  extraActions = [],
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
    return d && "data" in d && "current_page" in d;
  };

  const rawData = isPaginated(data) ? data.data : data;

  // Client-side state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const perPage = params.get("per_page");
      if (perPage && PAGE_SIZES.includes(parseInt(perPage))) {
        return parseInt(perPage);
      }
    }
    return 10;
  });
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
      per_page: pageSize,
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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
    if (isPaginated(data)) {
      router.get(
        window.location.pathname,
        getQueryParams({ page: 1, per_page: size }),
        { preserveState: true, preserveScroll: true }
      );
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
          page: isPaginated(data) ? data.current_page : page,
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

  // Pagination helpers
  const currentPage = isPaginated(data) ? data.current_page : page;
  const totalRecords = isPaginated(data) ? data.total : filteredData.length;
  const totalPages = isPaginated(data) ? data.last_page : Math.ceil(filteredData.length / pageSize);
  const currentPerPage = isPaginated(data) ? data.per_page : pageSize;
  const fromRecord = isPaginated(data) ? data.from : (page - 1) * pageSize + 1;
  const toRecord = isPaginated(data) ? data.to : Math.min(page * pageSize, filteredData.length);

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
        {extraActions.length > 0 && (onView || onEdit) && <DropdownMenuSeparator />}
        {extraActions.map((action) => {
          const isVisible = action.visible ? action.visible(record) : true;
          if (!isVisible) return null;
          const Icon = action.icon;
          return (
            <span key={action.key}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={() => action.onClick(record)} className={action.className}>
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            </span>
          );
        })}
        {onDelete && (
          <>
            {(onView || onEdit || extraActions.length > 0) && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onDelete(record)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Build columns with actions
  const tableColumns: DataTableColumn<T>[] = useMemo(() => {
    const cols = [...columns];

    if (showActions && (onView || onEdit || onDelete || renderActions || extraActions.length > 0)) {
      // Calculate dynamic width based on number of actions
      const baseActionCount = [onView, onEdit, onDelete].filter(Boolean).length;
      const extraVisibleCount = extraActions.length;
      const totalActions = baseActionCount + extraVisibleCount;
      const dynamicWidth = actionsWidth || Math.max(120, totalActions * 40);

      cols.push({
        accessor: "actions" as keyof T,
        title: "Aksi",
        textAlign: "center",
        width: dynamicWidth,
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
                    title="Lihat"
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
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {extraActions.map((action) => {
                  const isVisible = action.visible ? action.visible(record) : true;
                  if (!isVisible) return null;
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.key}
                      variant="ghost"
                      size="icon"
                      className={action.className || "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"}
                      onClick={() => action.onClick(record)}
                      title={action.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(record)}
                    title="Hapus"
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
  }, [columns, showActions, onView, onEdit, onDelete, renderActions, actionsWidth, extraActions]);

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
            sortStatus={sortStatus}
            onSortStatusChange={handleSortStatusChange}
            sortIcons={{
              sorted: (
                <IconWrapper>
                  {sortStatus.direction === "asc" ? (
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

      {/* Custom Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
        {/* Records per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tampilkan</span>
          <Select
            value={currentPerPage.toString()}
            onValueChange={(v) => handlePageSizeChange(parseInt(v))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            dari {totalRecords} {entityName}
          </span>
        </div>

        {/* Page info + navigation */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {totalRecords > 0 ? `${fromRecord} - ${toRecord}` : "0"} / {totalRecords}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
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
