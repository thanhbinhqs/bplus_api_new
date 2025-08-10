import { useState, useEffect } from 'react';
import React from 'react';
import { GenericFilterSidebar, type FilterSection, type SimpleSearchFilters } from '../generic';

interface UserFilters {
  search: string;
  roleFilter: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  showInactive: boolean;
  showActive: boolean;
}

interface UserFilterSidebarProps {
  filters: UserFilters;
  onFilterChange: (filters: any) => void;
  onSearch: (query: string) => void;
  onAdvancedFilterChange: (filters: SimpleSearchFilters) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  // Apply button mode
  useApplyButton?: boolean;
  appliedFilters?: UserFilters;
  // Hide toggle button when managed externally
  hideToggleButton?: boolean;
  // Mobile responsive props
  isMobile?: boolean;
  showAsOverlay?: boolean;
}

export function UserFilterSidebar({
  filters,
  onFilterChange,
  onSearch,
  onAdvancedFilterChange,
  isCollapsed,
  onToggleCollapse,
  useApplyButton = false,
  appliedFilters,
  hideToggleButton = false,
  isMobile = false,
  showAsOverlay = false
}: UserFilterSidebarProps) {
  
  // Track pending filters when Apply button is enabled
  const [pendingFilters, setPendingFilters] = useState<UserFilters>(() => {
    // Initialize with appliedFilters if in apply mode, otherwise with filters
    return useApplyButton && appliedFilters ? appliedFilters : filters;
  });

  // Sync pendingFilters with filters when not in apply mode or when filters change
  useEffect(() => {
    if (!useApplyButton) {
      setPendingFilters(filters);
    }
  }, [filters, useApplyButton]);

  // Sync pendingFilters with appliedFilters when they change (after successful apply)
  useEffect(() => {
    if (useApplyButton && appliedFilters) {
      setPendingFilters(prev => {
        const shouldUpdate = JSON.stringify(prev) !== JSON.stringify(appliedFilters);
        if (shouldUpdate) {
          return appliedFilters;
        }
        return prev;
      });
    }
  }, [appliedFilters, useApplyButton]);

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = {
      ...pendingFilters,
      [key]: value
    };
    setPendingFilters(newFilters);
    
    // If Apply button is disabled, apply immediately
    if (!useApplyButton) {
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      roleFilter: 'all',
      statusFilter: 'all',
      dateFrom: '',
      dateTo: '',
      showInactive: true,
      showActive: true
    };
    setPendingFilters(clearedFilters);
    
    // Always apply immediately when clearing, regardless of Apply button mode
    onFilterChange(clearedFilters);
  };

  // Apply pending filters
  const handleApplyFilters = () => {
    onFilterChange(pendingFilters);
  };

  // Handle pending filters change with type conversion
  const handlePendingFiltersChange = (filters: SimpleSearchFilters) => {
    setPendingFilters(filters as UserFilters);
  };

  const currentFilters = useApplyButton ? pendingFilters : filters;

  // Status Filter Section
  const statusFilterSection = (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showActive"
          checked={currentFilters.showActive}
          onChange={(e) => handleFilterUpdate('showActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showActive" className="text-sm text-gray-700">
          Hoạt động
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showInactive"
          checked={currentFilters.showInactive}
          onChange={(e) => handleFilterUpdate('showInactive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showInactive" className="text-sm text-gray-700">
          Không hoạt động
        </label>
      </div>
    </div>
  );

  // Role Filter Section
  const roleFilterSection = (
    <select
      value={currentFilters.roleFilter}
      onChange={(e) => handleFilterUpdate('roleFilter', e.target.value)}
      className="w-full h-8 px-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="all">Tất cả vai trò</option>
      <option value="Admin">Admin</option>
      <option value="Manager">Manager</option>
      <option value="User">User</option>
      <option value="Moderator">Moderator</option>
      <option value="Editor">Editor</option>
      <option value="HR Manager">HR Manager</option>
      <option value="Support">Support</option>
      <option value="Analyst">Analyst</option>
    </select>
  );

  // Date Range Section
  const dateRangeSection = (
    <div className="space-y-2">
      <div>
        <label htmlFor="dateFrom" className="block text-xs text-gray-500 mb-1">Từ ngày</label>
        <input
          id="dateFrom"
          type="date"
          value={currentFilters.dateFrom}
          onChange={(e) => handleFilterUpdate('dateFrom', e.target.value)}
          className="w-full h-8 px-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="dateTo" className="block text-xs text-gray-500 mb-1">Đến ngày</label>
        <input
          id="dateTo"
          type="date"
          value={currentFilters.dateTo}
          onChange={(e) => handleFilterUpdate('dateTo', e.target.value)}
          className="w-full h-8 px-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Advanced Status Filter Section
  const advancedStatusSection = (
    <select
      value={currentFilters.statusFilter}
      onChange={(e) => handleFilterUpdate('statusFilter', e.target.value)}
      className="w-full h-8 px-2 text-sm border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="all">Tất cả</option>
      <option value="active">Chỉ hoạt động</option>
      <option value="inactive">Chỉ không hoạt động</option>
    </select>
  );

  const filterSections: FilterSection[] = [
    {
      id: 'status',
      title: 'Trạng thái',
      content: statusFilterSection
    },
    {
      id: 'role',
      title: 'Vai trò',
      content: roleFilterSection
    },
    {
      id: 'dateRange',
      title: 'Ngày tạo',
      content: dateRangeSection,
      collapsible: true,
      defaultCollapsed: true
    },
    {
      id: 'advanced',
      title: 'Lọc nâng cao',
      content: advancedStatusSection,
      collapsible: true,
      defaultCollapsed: true
    }
  ];

  return (
    <GenericFilterSidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      onSearch={onSearch}
      onFilterChange={handleApplyFilters}
      searchPlaceholder="Tìm kiếm theo tên, username, email..."
      searchQuery={currentFilters.search}
      showSearch={true}
      showAdvancedFilters={true}
      sections={filterSections}
      onClearAll={clearAllFilters}
      showApplyButton={useApplyButton}
      onApplyChanges={handleApplyFilters}
      hideToggleButton={hideToggleButton}
      isMobile={isMobile}
      showAsOverlay={showAsOverlay}
    />
  );
}
