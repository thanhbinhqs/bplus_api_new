import { memo, useState } from "react";
import { Search, Filter, SlidersHorizontal, X, ChevronDown, Package, Tag, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { Button, Input, Checkbox } from "../ui";
import type { ProductFilters } from "../../types/product";

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onSearch: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  useApplyButton?: boolean;
  appliedFilters?: ProductFilters;
  hideToggleButton?: boolean;
  isMobile?: boolean;
  showAsOverlay?: boolean;
}

export const ProductFilterSidebar = memo(function ProductFilterSidebar({
  filters,
  onFilterChange,
  onSearch,
  isCollapsed,
  onToggleCollapse,
  useApplyButton = false,
  appliedFilters,
  hideToggleButton = false,
  isMobile = false,
  showAsOverlay = false
}: ProductFilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [tempFilters, setTempFilters] = useState<Partial<ProductFilters>>({});
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    category: true,
    price: true,
    stock: true,
    status: true,
    date: false
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!useApplyButton) {
      onSearch(value);
    } else {
      setTempFilters(prev => ({ ...prev, search: value }));
    }
  };

  const handleFilterChange = (filterKey: keyof ProductFilters, value: any) => {
    if (!useApplyButton) {
      onFilterChange({ [filterKey]: value });
    } else {
      setTempFilters(prev => ({ ...prev, [filterKey]: value }));
    }
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...tempFilters,
      search: searchQuery
    };
    
    onFilterChange(filtersToApply);
    onSearch(searchQuery);
    setTempFilters({});
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      categoryFilter: 'all',
      statusFilter: 'all',
      priceFrom: '',
      priceTo: '',
      stockFrom: '',
      stockTo: '',
      dateFrom: '',
      dateTo: '',
      showActive: true,
      showInactive: true,
      showFeatured: false,
      showOutOfStock: false
    };
    
    setSearchQuery('');
    setTempFilters({});
    onFilterChange(resetFilters);
    onSearch('');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCurrentValue = (key: keyof ProductFilters) => {
    if (useApplyButton && tempFilters[key] !== undefined) {
      return tempFilters[key];
    }
    return filters[key];
  };

  const getStringValue = (key: keyof ProductFilters): string => {
    const value = getCurrentValue(key);
    return typeof value === 'string' ? value : String(value);
  };

  const getBooleanValue = (key: keyof ProductFilters): boolean => {
    const value = getCurrentValue(key);
    return typeof value === 'boolean' ? value : Boolean(value);
  };

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'electronics', label: 'Điện tử' },
    { value: 'clothing', label: 'Thời trang' },
    { value: 'books', label: 'Sách' },
    { value: 'home', label: 'Gia dụng' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'beauty', label: 'Làm đẹp' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'outOfStock', label: 'Hết hàng' },
    { value: 'discontinued', label: 'Ngừng kinh doanh' }
  ];

  // Responsive classes
  const sidebarClasses = showAsOverlay
    ? `fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`
    : `relative bg-white border-r transition-all duration-300 ${
        isCollapsed ? 'w-0 overflow-hidden' : 'w-80'
      }`;

  if (showAsOverlay && isCollapsed) {
    return null;
  }

  return (
    <>
      {showAsOverlay && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggleCollapse}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
            </div>
            <div className="flex items-center space-x-1">
              {!hideToggleButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('basic')}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Tìm kiếm</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.basic && (
                <div className="space-y-3 ml-6">
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('category')}
              >
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Danh mục</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.category && (
                <div className="space-y-2 ml-6">
                  <select
                    value={getStringValue('categoryFilter')}
                    onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Giá bán</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.price && (
                <div className="space-y-3 ml-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={getStringValue('priceFrom')}
                      onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={getStringValue('priceTo')}
                      onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stock Filter */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('stock')}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Tồn kho</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.stock && (
                <div className="space-y-3 ml-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={getStringValue('stockFrom')}
                      onChange={(e) => handleFilterChange('stockFrom', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={getStringValue('stockTo')}
                      onChange={(e) => handleFilterChange('stockTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('status')}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Trạng thái</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.status ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.status && (
                <div className="space-y-3 ml-6">
                  <select
                    value={getStringValue('statusFilter')}
                    onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={getBooleanValue('showFeatured')}
                        onCheckedChange={(checked) => handleFilterChange('showFeatured', checked)}
                      />
                      <span className="text-sm">Chỉ sản phẩm nổi bật</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={getBooleanValue('showOutOfStock')}
                        onCheckedChange={(checked) => handleFilterChange('showOutOfStock', checked)}
                      />
                      <span className="text-sm">Bao gồm hết hàng</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('date')}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Ngày tạo</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.date ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedSections.date && (
                <div className="space-y-3 ml-6">
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={getStringValue('dateFrom')}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="date"
                      value={getStringValue('dateTo')}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {useApplyButton && (
            <div className="border-t p-4 space-y-2">
              <Button
                onClick={handleApplyFilters}
                className="w-full"
                size="sm"
              >
                Áp dụng bộ lọc
              </Button>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Đặt lại
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
