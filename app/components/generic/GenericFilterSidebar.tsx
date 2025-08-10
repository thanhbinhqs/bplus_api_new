import { useState, type ReactNode } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface SimpleSearchFilters {
  [key: string]: any;
}

export interface FilterSection {
  id: string;
  title: string;
  content: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface GenericFilterSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: SimpleSearchFilters) => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  showSearch?: boolean;
  showAdvancedFilters?: boolean;
  sections?: FilterSection[];
  onClearAll?: () => void;
  className?: string;
  // Apply button configuration
  showApplyButton?: boolean;
  applyButtonText?: string;
  clearButtonText?: string;
  // Apply button state
  onApplyChanges?: () => void;
  // Hide toggle button when managed externally
  hideToggleButton?: boolean;
  // Mobile responsive props
  isMobile?: boolean;
  showAsOverlay?: boolean;
}

export function GenericFilterSidebar({
  isCollapsed,
  onToggleCollapse,
  onSearch,
  onFilterChange,
  searchPlaceholder = "Tìm kiếm...",
  searchQuery = "",
  showSearch = true,
  showAdvancedFilters = true,
  sections = [],
  onClearAll,
  className = "",
  showApplyButton = false,
  applyButtonText = "Áp dụng",
  clearButtonText = "Xóa tất cả",
  onApplyChanges,
  hideToggleButton = false,
  isMobile = false,
  showAsOverlay = false
}: GenericFilterSidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultCollapsed).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Apply pending filters
  const handleApplyFilters = () => {
    onApplyChanges?.();
  };

  // Clear all filters
  const handleClearFilters = () => {
    onClearAll?.();
  };

  return (
    <>
      {/* Overlay backdrop for mobile */}
      {showAsOverlay && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${showAsOverlay 
          ? 'fixed left-0 top-0 h-full z-50 lg:relative lg:z-auto transform transition-transform duration-300 ease-in-out' 
          : 'relative'
        }
        ${showAsOverlay && isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        w-64 md:w-72 lg:w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg lg:shadow-none
        ${className}
      `}>
        {/* Header */}
        <div className="px-3 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <h2 className="text-base font-medium text-gray-900">Bộ lọc</h2>
          </div>
          <div className="flex items-center space-x-1">
            {(!hideToggleButton || showAsOverlay) && (
              <button
                onClick={onToggleCollapse}
                className="w-8 h-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      {/* Scrollable content */}
      <div className="flex-1 table-scroll p-3 space-y-4">
        {/* Search Section */}
        {showSearch && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Tìm kiếm</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
              {section.collapsible && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {collapsedSections.has(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            
            {(!section.collapsible || !collapsedSections.has(section.id)) && (
              <div>{section.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Fixed bottom buttons */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white shadow-lg">
        {showApplyButton ? (
          <div className="space-y-2">
            <button
              onClick={handleApplyFilters}
              className="w-full inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {applyButtonText}
            </button>
            <button
              onClick={handleClearFilters}
              className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {clearButtonText}
            </button>
          </div>
        ) : (
          // Original Clear All Button for immediate mode
          <button
            onClick={handleClearFilters}
            className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {clearButtonText}
          </button>
        )}
      </div>
      </div>
    </>
  );
}
