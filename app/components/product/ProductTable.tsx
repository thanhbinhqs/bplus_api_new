import { memo, useState } from "react";
import { ChevronUp, ChevronDown, Package, Star, AlertTriangle, Eye, Edit, Trash2, ExternalLink, Tag, DollarSign, BarChart3 } from "lucide-react";
import { Button, Checkbox } from "../ui";
import type { Product } from "../../types/product";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  visible?: boolean;
  sticky?: 'left' | 'right' | 'none';
}

interface ProductTableProps {
  products: Product[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onRowContextMenu?: (event: React.MouseEvent, product: Product) => void;
  selectedProductId?: string;
  loading?: boolean;
  enablePagination?: boolean;
  initialItemsPerPage?: number;
  columns?: Column[];
}

export function createProductColumns(): Column[] {
  return [
    { key: 'select', label: '', width: 50, minWidth: 50, sticky: 'left' },
    { key: 'image', label: 'Hình ảnh', width: 80, minWidth: 80, sticky: 'left' },
    { key: 'name', label: 'Tên sản phẩm', sortable: true, width: 250, minWidth: 200, sticky: 'left' },
    { key: 'sku', label: 'SKU', sortable: true, width: 120, minWidth: 100 },
    { key: 'category', label: 'Danh mục', sortable: true, width: 150, minWidth: 120 },
    { key: 'price', label: 'Giá bán', sortable: true, width: 120, minWidth: 100 },
    { key: 'stock', label: 'Tồn kho', sortable: true, width: 100, minWidth: 80 },
    { key: 'status', label: 'Trạng thái', sortable: true, width: 120, minWidth: 100 },
    { key: 'featured', label: 'Nổi bật', width: 80, minWidth: 80 },
    { key: 'createdAt', label: 'Ngày tạo', sortable: true, width: 130, minWidth: 120 },
    { key: 'actions', label: 'Thao tác', width: 100, minWidth: 100, sticky: 'right' }
  ];
}

export const ProductTable = memo(function ProductTable({
  products,
  onSort,
  sortField,
  sortDirection,
  onRowContextMenu,
  selectedProductId,
  loading = false,
  enablePagination = false,
  initialItemsPerPage = 20,
  columns = createProductColumns()
}: ProductTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const visibleColumns = columns.filter(col => col.visible !== false);

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (product: Product) => {
    if (!product.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Không hoạt động</span>;
    }

    switch (product.status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Đang bán</span>;
      case 'outOfStock':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Hết hàng</span>;
      case 'discontinued':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">Ngừng bán</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Không rõ</span>;
    }
  };

  const getStockIndicator = (product: Product) => {
    if (product.stock <= 0) {
      return <span className="text-red-600 font-medium">Hết hàng</span>;
    } else if (product.stock <= product.minStock) {
      return <span className="text-orange-600 font-medium">{product.stock}</span>;
    } else {
      return <span className="text-gray-900">{product.stock}</span>;
    }
  };

  // Pagination logic
  const totalPages = enablePagination ? Math.ceil(products.length / itemsPerPage) : 1;
  const displayedProducts = enablePagination 
    ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : products;

  const allSelected = selectedProducts.size === products.length && products.length > 0;
  const someSelected = selectedProducts.size > 0 && selectedProducts.size < products.length;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Table Header with Actions */}
      {selectedProducts.size > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-b flex items-center justify-between">
          <span className="text-sm text-blue-700">
            Đã chọn {selectedProducts.size} sản phẩm
          </span>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Chỉnh sửa hàng loạt
            </Button>
            <Button size="sm" variant="outline">
              <Package className="h-4 w-4 mr-1" />
              Cập nhật tồn kho
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sticky === 'left' ? 'sticky left-0 bg-gray-50 z-10' : 
                    column.sticky === 'right' ? 'sticky right-0 bg-gray-50 z-10' : ''
                  }`}
                  style={{ 
                    width: column.width, 
                    minWidth: column.minWidth 
                  }}
                >
                  {column.key === 'select' ? (
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  ) : column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : displayedProducts.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Package className="h-8 w-8 text-gray-400" />
                    <span>Không có sản phẩm nào</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedProductId === product.id ? 'bg-blue-50' : ''
                  }`}
                  onContextMenu={(e) => onRowContextMenu?.(e, product)}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 whitespace-nowrap text-sm ${
                        column.sticky === 'left' ? 'sticky left-0 bg-white z-10' : 
                        column.sticky === 'right' ? 'sticky right-0 bg-white z-10' : ''
                      }`}
                    >
                      {column.key === 'select' && (
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                        />
                      )}
                      
                      {column.key === 'image' && (
                        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      )}
                      
                      {column.key === 'name' && (
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-gray-500 text-xs truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {column.key === 'sku' && (
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {product.sku}
                        </code>
                      )}
                      
                      {column.key === 'category' && (
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span>{product.category.name}</span>
                        </div>
                      )}
                      
                      {column.key === 'price' && (
                        <div>
                          <div className="font-medium">{formatPrice(product.price)}</div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {column.key === 'stock' && (
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                          {getStockIndicator(product)}
                        </div>
                      )}
                      
                      {column.key === 'status' && getStatusBadge(product)}
                      
                      {column.key === 'featured' && (
                        product.isFeatured ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <Star className="h-4 w-4 text-gray-300" />
                        )
                      )}
                      
                      {column.key === 'createdAt' && (
                        <span className="text-gray-600">{formatDate(product.createdAt)}</span>
                      )}
                      
                      {column.key === 'actions' && (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>trên tổng {products.length} sản phẩm</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </Button>
            
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
