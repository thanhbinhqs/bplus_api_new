import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { useSearchParams, useSubmit } from "react-router";
import { toast } from "sonner";
import { LayoutFull } from "./Layout";
import { GenericTableToolbar as TableToolbar, type Column } from "../generic";

// Types cho generic table layout
export interface BaseFilters {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  [key: string]: any; // Cho phép thêm custom filters
}

export interface BaseLoaderData<T> {
  data: T[];
  total: number;
  totalFiltered: number;
  stats?: any;
  filters: BaseFilters;
  success: boolean;
  error?: string;
}

export interface BaseActionData {
  success: boolean;
  message: string;
  action?: string;
  error?: string;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  maxWidth?: number;
  sortable?: boolean;
  visible?: boolean;
  sticky?: 'left' | 'right' | 'none';
  render?: (value: any, item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableDataLayoutProps<T> {
  // Data props
  loaderData: BaseLoaderData<T>;
  actionData?: BaseActionData;
  
  // Table props
  columns: TableColumn<T>[];
  renderTable: (props: {
    data: T[];
    columns: TableColumn<T>[];
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onRowContextMenu?: (item: T, event: React.MouseEvent) => void;
    selectedItemId?: string;
    loading: boolean;
  }) => ReactNode;
  
  // Filter props
  renderFilterSidebar?: (props: {
    filters: BaseFilters;
    onFilterChange: (filters: any) => void;
    onSearch: (query: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    appliedFilters: BaseFilters;
    isMobile: boolean;
  }) => ReactNode;
  
  // Context menu props (optional)
  contextMenu?: {
    selectedItem: T | null;
    position: { x: number; y: number };
  } | null;
  onContextMenuAction?: (actionType: string, item: T) => void;
  onCloseContextMenu?: () => void;
  renderContextMenu?: (props: {
    item: T;
    position: { x: number; y: number };
    onClose: () => void;
    onAction: (actionType: string, item: T) => void;
  }) => ReactNode;
  
  // Modal props (optional)
  modals?: Record<string, T | null>;
  onCloseModal?: (modalType: string) => void;
  renderModals?: () => ReactNode;
  
  // Settings
  settingsKey: string;
  exportFilename?: string;
  
  // User info for layout
  user: {
    fullName: string;
    username: string;
    role: string;
  };
  
  // Custom filter clear function
  clearFilterParams?: string[];
}

// Helper functions
const saveUserSettings = (key: string, settings: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(settings));
  }
};

const loadUserSettings = (key: string): any => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const settings = localStorage.getItem(key);
    return settings ? JSON.parse(settings) : null;
  }
  return null;
};

export function TableDataLayout<T extends { id: string }>({
  loaderData,
  actionData,
  columns,
  renderTable,
  renderFilterSidebar,
  contextMenu,
  onContextMenuAction,
  onCloseContextMenu,
  renderContextMenu,
  modals,
  onCloseModal,
  renderModals,
  settingsKey,
  exportFilename = "table-data",
  user,
  clearFilterParams = ['search', 'sortBy', 'sortOrder']
}: TableDataLayoutProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Applied filters tracking
  const [appliedFilters, setAppliedFilters] = useState(loaderData.filters);
  
  // Column settings
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnStickyState, setColumnStickyState] = useState<Record<string, 'left' | 'right' | 'none'>>({});
  
  const settingsHydratedRef = useRef(false);

  // Hydrate settings from localStorage
  useEffect(() => {
    const savedSettings = loadUserSettings(settingsKey);
    if (savedSettings) {
      setColumnVisibility(savedSettings.columnVisibility || {});
      setColumnStickyState(savedSettings.columnStickyState || {});
    }
    settingsHydratedRef.current = true;
  }, [settingsKey]);

  // Save settings
  useEffect(() => {
    if (!settingsHydratedRef.current) return;
    saveUserSettings(settingsKey, { columnVisibility, columnStickyState });
  }, [columnVisibility, columnStickyState, settingsKey]);

  // Update applied filters when loader data changes
  useEffect(() => {
    setAppliedFilters(loaderData.filters);
  }, [loaderData.filters]);

  // Show action messages
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message);
      } else {
        toast.error(actionData.message);
      }
    }
  }, [actionData]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu && onCloseContextMenu) {
        onCloseContextMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu, onCloseContextMenu]);

  // Update filters in URL
  const updateFilters = useCallback((newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    clearFilterParams.forEach(key => {
      params.delete(key);
    });
    
    // Set new filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== 'all' && value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          params.set(key, String(value));
        } else if (value !== false) {
          params.set(key, String(value));
        }
      }
    });
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    setAppliedFilters(newFilters);
    setSearchParams(params);
  }, [searchParams, setSearchParams, clearFilterParams]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle sorting
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortOrder', direction);
    params.set('page', '1');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle column visibility
  const handleColumnVisibilityChange = useCallback((columnKey: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnKey]: visible }));
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumnVisibility({});
  }, []);

  // Handle column sticky
  const handleColumnStickyChange = useCallback((columnKey: string, sticky: 'left' | 'right' | 'none') => {
    setColumnStickyState(prev => ({ ...prev, [columnKey]: sticky }));
  }, []);

  // Process columns with visibility and sticky state
  const processedColumns = columns.map(col => ({
    ...col,
    visible: columnVisibility[col.key] !== false,
    sticky: columnStickyState[col.key] || col.sticky || 'none'
  }));

  // Check if there are active filters
  const hasActiveFilters = Object.entries(appliedFilters).some(([key, value]) => {
    if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
    if (key === 'search') return value !== '';
    if (typeof value === 'string' && (value === 'all' || value === '')) return false;
    if (typeof value === 'boolean' && value === true) return false;
    return true;
  });

  // Error state
  if (!loaderData.success) {
    return (
      <LayoutFull user={user}>
        <div className="h-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lỗi tải dữ liệu</h1>
            <p className="text-gray-600 mb-4">{loaderData.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </LayoutFull>
    );
  }

  return (
    <LayoutFull user={user}>
      <div className="bg-gray-50 flex flex-col h-full">
        <div className="flex-1 flex overflow-hidden">
          {/* Filter Sidebar */}
          {renderFilterSidebar && (
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} ${isMobile ? 'absolute inset-0 z-10' : ''}`}>
              {renderFilterSidebar({
                filters: loaderData.filters,
                onFilterChange: updateFilters,
                onSearch: handleSearch,
                isCollapsed: sidebarCollapsed,
                onToggleCollapse: () => setSidebarCollapsed(!sidebarCollapsed),
                appliedFilters,
                isMobile
              })}
            </div>
          )}

          {/* Main table area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Toolbar */}
            <TableToolbar
              data={loaderData.data}
              columns={processedColumns}
              onRefresh={() => window.location.reload()}
              onColumnVisibilityChange={handleColumnVisibilityChange}
              onResetColumns={handleResetColumns}
              onColumnStickyChange={handleColumnStickyChange}
              exportFilename={exportFilename}
              loading={false}
              showFilterToggle={!!renderFilterSidebar}
              isFilterCollapsed={sidebarCollapsed}
              onFilterToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              hasActiveFilters={hasActiveFilters}
            />
            
            {/* Table */}
            <div className="flex-1 min-h-0">
              {renderTable({
                data: loaderData.data,
                columns: processedColumns,
                onSort: handleSort,
                sortField: loaderData.filters.sortBy,
                sortDirection: loaderData.filters.sortOrder,
                onRowContextMenu: onContextMenuAction ? (item, event) => {
                  event.preventDefault();
                  // This would need to be handled in parent component
                } : undefined,
                selectedItemId: contextMenu?.selectedItem?.id,
                loading: false
              })}
            </div>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && contextMenu.selectedItem && renderContextMenu && onContextMenuAction && onCloseContextMenu && (
          renderContextMenu({
            item: contextMenu.selectedItem,
            position: contextMenu.position,
            onClose: onCloseContextMenu,
            onAction: onContextMenuAction
          })
        )}

        {/* Modals */}
        {renderModals && renderModals()}
      </div>
    </LayoutFull>
  );
}
