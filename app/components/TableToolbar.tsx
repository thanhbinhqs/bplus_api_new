import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff, 
  Columns3,
  SortAsc,
  SortDesc,
  Filter,
  FilterX,
  Clock
} from 'lucide-react';
import { GenericExportMenu } from './generic';
import { type Column } from './generic';

interface TableToolbarProps<T> {
  data: T[];
  columns: Column<T>[];
  onRefresh?: () => void;
  onColumnVisibilityChange?: (columnKey: string, visible: boolean) => void;
  onResetColumns?: () => void;
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
  onColumnStickyChange?: (columnKey: string, sticky: 'left' | 'right' | 'none') => void;
  exportFilename?: string;
  loading?: boolean;
  className?: string;
  // Filter toggle props
  showFilterToggle?: boolean;
  isFilterCollapsed?: boolean;
  onFilterToggle?: () => void;
  hasActiveFilters?: boolean;
}

export function TableToolbar<T extends Record<string, any>>({
  data,
  columns,
  onRefresh,
  onColumnVisibilityChange,
  onResetColumns,
  onColumnReorder,
  onColumnStickyChange,
  exportFilename = 'table-data',
  loading = false,
  className = "",
  showFilterToggle = false,
  isFilterCollapsed = false,
  onFilterToggle,
  hasActiveFilters = false
}: TableToolbarProps<T>) {
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  
  // Current column visibility từ columns prop
  const currentColumnVisibility = columns.reduce((acc, col) => {
    const visible = col.visible !== false; // Mặc định true nếu không có property visible
    return { ...acc, [String(col.key)]: visible };
  }, {} as Record<string, boolean>);

  // Local pending changes cho apply mode
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<Record<string, boolean>>(currentColumnVisibility);
  const [pendingColumnSticky, setPendingColumnSticky] = useState<Record<string, 'left' | 'right' | 'none'>>(
    columns.reduce((acc, col) => {
      return { ...acc, [String(col.key)]: col.sticky || 'none' };
    }, {} as Record<string, 'left' | 'right' | 'none'>)
  );

  // Sync pending với current khi columns thay đổi
  useEffect(() => {
    setPendingColumnVisibility(currentColumnVisibility);
    setPendingColumnSticky(
      columns.reduce((acc, col) => {
        return { ...acc, [String(col.key)]: col.sticky || 'none' };
      }, {} as Record<string, 'left' | 'right' | 'none'>)
    );
  }, [JSON.stringify(currentColumnVisibility), JSON.stringify(columns.map(col => ({ key: col.key, sticky: col.sticky })))]);

  const handleColumnVisibilityToggle = (columnKey: string) => {
    setPendingColumnVisibility(prev => ({ 
      ...prev, 
      [columnKey]: !prev[columnKey] 
    }));
  };

  const handleColumnStickyChange = (columnKey: string, sticky: 'left' | 'right' | 'none') => {
    setPendingColumnSticky(prev => ({
      ...prev,
      [columnKey]: sticky
    }));
  };

  const handleApplyChanges = () => {
    // Apply tất cả pending changes
    Object.entries(pendingColumnVisibility).forEach(([columnKey, visible]) => {
      if (visible !== currentColumnVisibility[columnKey]) {
        onColumnVisibilityChange?.(columnKey, visible);
      }
    });
    
    // Apply sticky changes
    Object.entries(pendingColumnSticky).forEach(([columnKey, sticky]) => {
      const currentColumn = columns.find(col => String(col.key) === columnKey);
      const currentSticky = currentColumn?.sticky || 'none';
      if (sticky !== currentSticky) {
        onColumnStickyChange?.(columnKey, sticky);
      }
    });
    
    setShowColumnSettings(false);
  };

  const handleCancelChanges = () => {
    // Reset về current state
    setPendingColumnVisibility(currentColumnVisibility);
    setPendingColumnSticky(
      columns.reduce((acc, col) => {
        return { ...acc, [String(col.key)]: col.sticky || 'none' };
      }, {} as Record<string, 'left' | 'right' | 'none'>)
    );
    setShowColumnSettings(false);
  };

  const handleRefresh = () => {
    if (loading) return;
    onRefresh?.();
  };

  const handleResetColumns = () => {
    // Reset tất cả về visible và no sticky
    const resetVisibility = columns.reduce((acc, col) => ({ ...acc, [String(col.key)]: true }), {});
    const resetSticky = columns.reduce((acc, col) => ({ ...acc, [String(col.key)]: 'none' as const }), {});
    setPendingColumnVisibility(resetVisibility);
    setPendingColumnSticky(resetSticky);
  };

  const visibleColumnsCount = Object.values(currentColumnVisibility).filter(Boolean).length;
  const hiddenColumnsCount = columns.length - visibleColumnsCount;
  const hasColumnChanges = hiddenColumnsCount > 0;
  
  // Check if có pending changes chưa apply
  const hasPendingChanges = JSON.stringify(pendingColumnVisibility) !== JSON.stringify(currentColumnVisibility) ||
    JSON.stringify(pendingColumnSticky) !== JSON.stringify(
      columns.reduce((acc, col) => {
        return { ...acc, [String(col.key)]: col.sticky || 'none' };
      }, {} as Record<string, 'left' | 'right' | 'none'>)
    );

  return (
    <div className={`bg-white border-b border-gray-200 px-3 py-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Info */}
        <div className="flex items-center space-x-3">
          {/* Filter Toggle Button */}
          {showFilterToggle && (
            <button
              onClick={onFilterToggle}
              className={`relative inline-flex items-center px-3 py-2 rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md text-sm font-medium ${
                isFilterCollapsed 
                  ? 'border-gray-300 hover:bg-gray-50 text-gray-600 bg-white' 
                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-600'
              }`}
              title={isFilterCollapsed ? "Show filters" : "Hide filters"}
            >
              {isFilterCollapsed ? (
                <Filter className="h-4 w-4" />
              ) : (
                <FilterX className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">
                {isFilterCollapsed ? 'Filters' : 'Hide'}
              </span>
              {/* Chỉ hiển thị indicator khi collapsed và có active filters */}
              {isFilterCollapsed && hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
              )}
            </button>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </button>

          {/* Column Settings */}
          <div className="relative">
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className={`relative inline-flex items-center px-2.5 py-1.5 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                hasColumnChanges || hasPendingChanges
                  ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 shadow-sm' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Column settings"
            >
              <Columns3 className="h-4 w-4" />
              {/* Indicator cho thay đổi */}
              {(hasColumnChanges || hasPendingChanges) && (
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white ${
                  hasPendingChanges ? 'bg-blue-500' : 'bg-orange-500'
                }`}></div>
              )}
            </button>

            {/* Column Settings Dropdown */}
            {showColumnSettings && (
              <div className="absolute right-0 mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[520px] overflow-hidden">
                {/* Header with status */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Column Settings</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{visibleColumnsCount} visible</span>
                      {hiddenColumnsCount > 0 && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{hiddenColumnsCount} hidden</span>
                      )}
                    </div>
                  </div>
                  
                  {hasPendingChanges && (
                    <div className="mt-2 flex items-center text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                      <Clock className="h-3 w-3 mr-1" />
                      Unsaved changes
                    </div>
                  )}
                </div>
                
                {/* Scrollable content */}
                <div className="p-3 max-h-72 overflow-y-auto">
                  <div className="space-y-2">
                    {columns.map((column) => {
                      const columnKey = String(column.key);
                      const isVisible = pendingColumnVisibility[columnKey];
                      
                      return (
                        <div
                          key={columnKey}
                          className={`group p-3 rounded-lg border transition-all duration-200 ${
                            isVisible 
                              ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {/* Column visibility & Sticky controls */}
                          <div className="flex items-center justify-between w-full">
                            <label className="flex items-center space-x-3 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={() => handleColumnVisibilityToggle(columnKey)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                              />
                              <div className="flex items-center space-x-2">
                                {isVisible ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={`font-medium ${isVisible ? 'text-green-900' : 'text-gray-600'}`}>
                                  {column.label}
                                </span>
                              </div>
                            </label>
                            
                            {isVisible && (
                              <div className="flex items-center">
                                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColumnStickyChange(columnKey, 'none');
                                    }}
                                    className={`px-2 py-1 text-xs font-medium transition-all duration-200 ${
                                      pendingColumnSticky[columnKey] === 'none'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title="No pinning"
                                  >
                                    None
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColumnStickyChange(columnKey, 'left');
                                    }}
                                    className={`px-2 py-1 text-xs font-medium border-l border-gray-200 transition-all duration-200 ${
                                      pendingColumnSticky[columnKey] === 'left'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title="Pin to left"
                                  >
                                    Left
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColumnStickyChange(columnKey, 'right');
                                    }}
                                    className={`px-2 py-1 text-xs font-medium border-l border-gray-200 transition-all duration-200 ${
                                      pendingColumnSticky[columnKey] === 'right'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title="Pin to right"
                                  >
                                    Right
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Quick actions - Fixed at bottom */}
                <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {Object.values(pendingColumnVisibility).filter(Boolean).length} of {columns.length} columns visible
                    </div>
                    <button
                      onClick={handleResetColumns}
                      className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                      title="Reset to default columns"
                    >
                      Reset
                    </button>
                  </div>
                  
                  {/* Apply/Cancel row */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleApplyChanges}
                      disabled={!hasPendingChanges}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-all duration-200 shadow-sm"
                    >
                      Apply Changes
                    </button>
                    <button
                      onClick={handleCancelChanges}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-md transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Menu */}
          <GenericExportMenu 
            data={data} 
            filename={exportFilename}
          />
        </div>
      </div>

      {/* Close column settings when clicking outside */}
      {showColumnSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColumnSettings(false)}
        />
      )}
    </div>
  );
}
