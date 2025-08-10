import { useState, useEffect, type ChangeEvent } from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface GenericSearchFilters {
  categories: string[];
  status: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  customFilters?: Record<string, any>;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

interface GenericSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filters: GenericSearchFilters) => void;
  initialQuery?: string;
  className?: string;
  showFilters?: boolean;
  // Customizable options
  categoryOptions?: CategoryOption[];
  statusOptions?: StatusOption[];
  categoryLabel?: string;
  statusLabel?: string;
  dateFromLabel?: string;
  dateToLabel?: string;
  applyFiltersText?: string;
  clearFiltersText?: string;
  filtersText?: string;
  // Default filters
  defaultFilters?: Partial<GenericSearchFilters>;
}

export function GenericSearchBar({
  placeholder = "Tìm kiếm...",
  onSearch,
  onFilterChange,
  initialQuery = "",
  className = "",
  showFilters = false,
  categoryOptions = [],
  statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ],
  categoryLabel = "Phân loại",
  statusLabel = "Trạng thái",
  dateFromLabel = "Từ ngày",
  dateToLabel = "Đến ngày",
  applyFiltersText = "Áp dụng",
  clearFiltersText = "Xóa bộ lọc",
  filtersText = "Bộ lọc",
  defaultFilters = {}
}: GenericSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<GenericSearchFilters>({
    categories: [],
    status: 'all',
    dateRange: {},
    customFilters: {},
    ...defaultFilters
  });

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearQuery = () => {
    setQuery('');
  };

  const handleFilterChange = (key: keyof GenericSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(r => r !== category)
      : [...filters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      status: 'all',
      dateRange: {},
      customFilters: {}
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
    setShowFilterPanel(false);
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.status !== 'all' || 
                          filters.dateRange.from || 
                          filters.dateRange.to;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`px-3 py-2 border rounded-md flex items-center space-x-2 transition-colors ${
              hasActiveFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">{filtersText}</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filters.categories.length + (filters.status !== 'all' ? 1 : 0) + (filters.dateRange.from || filters.dateRange.to ? 1 : 0)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
          <div className="space-y-4">
            {/* Categories */}
            {categoryOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {categoryLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(option.value)}
                        onChange={() => handleCategoryToggle(option.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {statusLabel}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dateFromLabel}
                </label>
                <input
                  type="date"
                  value={filters.dateRange.from?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    from: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dateToLabel}
                </label>
                <input
                  type="date"
                  value={filters.dateRange.to?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    to: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {clearFiltersText}
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                {applyFiltersText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
