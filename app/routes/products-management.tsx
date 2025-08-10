import { type LoaderFunction, type ActionFunction, useLoaderData, useActionData } from "react-router";
import { LayoutFull, TableDataLayout, type BaseLoaderData, type BaseActionData } from "../components/layout";
import { ProductFilterSidebar, ProductTable, createProductColumns, ProductContextMenu, ViewProductModal, EditProductModal, DeleteProductModal, InventoryModal } from "../components/product";
import { useTableDataLayout } from "../hooks/useTableDataLayout";
import { withAuth, type AuthContext } from "../lib/authMiddleware";
import type { Product, ProductFilters } from "../types/product";

// Generate mock data function
function generateMockProducts(): Product[] {
  const categories = [
    { id: 'electronics', name: 'Điện tử', description: 'Thiết bị điện tử' },
    { id: 'clothing', name: 'Thời trang', description: 'Quần áo thời trang' },
    { id: 'books', name: 'Sách', description: 'Sách và tài liệu' },
    { id: 'home', name: 'Gia dụng', description: 'Đồ gia dụng' },
    { id: 'sports', name: 'Thể thao', description: 'Dụng cụ thể thao' },
    { id: 'beauty', name: 'Làm đẹp', description: 'Mỹ phẩm làm đẹp' }
  ];

  const productNames = [
    'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'MacBook Air M3', 'Dell XPS 13',
    'Áo sơ mi trắng', 'Quần jeans nam', 'Váy đầm nữ', 'Giày thể thao Nike',
    'Lập trình JavaScript', 'Thiết kế UX/UI', 'Marketing Digital', 'Quản trị kinh doanh',
    'Nồi cơm điện', 'Máy xay sinh tố', 'Bàn làm việc', 'Ghế văn phòng',
    'Bóng đá Adidas', 'Vợt tennis Wilson', 'Xe đạp thể thao', 'Máy chạy bộ',
    'Kem dưỡng da', 'Son môi MAC', 'Nước hoa Chanel', 'Mascara Maybelline'
  ];

  const products: Product[] = [];

  for (let i = 1; i <= 150; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = productNames[Math.floor(Math.random() * productNames.length)] + ` ${i}`;
    const basePrice = Math.floor(Math.random() * 5000000) + 50000; // 50k - 5M VND
    const hasDiscount = Math.random() > 0.7;
    const originalPrice = hasDiscount ? basePrice + Math.floor(basePrice * 0.2) : undefined;
    const stock = Math.floor(Math.random() * 1000);
    const minStock = Math.floor(Math.random() * 50) + 10;

    let status: Product['status'] = 'active';
    if (stock === 0) {
      status = 'outOfStock';
    } else if (Math.random() > 0.9) {
      status = 'discontinued';
    } else if (Math.random() > 0.95) {
      status = 'inactive';
    }

    products.push({
      id: `product-${i}`,
      name,
      sku: `SKU-${category.id.toUpperCase()}-${String(i).padStart(4, '0')}`,
      description: `Mô tả chi tiết cho sản phẩm ${name}. Đây là sản phẩm chất lượng cao.`,
      price: basePrice,
      originalPrice,
      category,
      stock,
      minStock,
      maxStock: minStock * 10,
      status,
      isActive: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      images: Math.random() > 0.3 ? [
        `https://via.placeholder.com/400x400?text=${encodeURIComponent(name.substring(0, 20))}`
      ] : undefined,
      tags: Math.random() > 0.5 ? ['hot', 'sale', 'new'] : undefined,
      weight: Math.random() * 10,
      dimensions: {
        length: Math.random() * 100,
        width: Math.random() * 100,
        height: Math.random() * 100
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      updatedAt: new Date(),
      createdBy: 'admin',
      lastModifiedBy: 'admin'
    });
  }

  return products;
}

// Extended interfaces for product management
interface ProductLoaderData extends BaseLoaderData<Product> {
  filters: ProductFilters;
  authContext: AuthContext;
}

interface ProductActionData extends BaseActionData {
  // Add specific product action types if needed
}

export const loader: LoaderFunction = async ({ request }): Promise<ProductLoaderData> => {
  return withAuth(request, async (authContext) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const filters: ProductFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      categoryFilter: searchParams.get('categoryFilter') || 'all',
      statusFilter: searchParams.get('statusFilter') || 'all',
      priceFrom: searchParams.get('priceFrom') || '',
      priceTo: searchParams.get('priceTo') || '',
      stockFrom: searchParams.get('stockFrom') || '',
      stockTo: searchParams.get('stockTo') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      showActive: searchParams.get('showActive') !== 'false',
      showInactive: searchParams.get('showInactive') !== 'false',
      showFeatured: searchParams.get('showFeatured') === 'true',
      showOutOfStock: searchParams.get('showOutOfStock') === 'true'
    };

    try {
      // Generate and filter mock products
      let allProducts = generateMockProducts();
      
      // Apply filters
      let filteredProducts = allProducts.filter(product => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower)) ||
            product.category.name.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        // Category filter
        if (filters.categoryFilter !== 'all') {
          const allowedCategories = filters.categoryFilter.split(',').filter(Boolean);
          if (allowedCategories.length > 0 && !allowedCategories.includes(product.category.id)) {
            return false;
          }
        }
        
        // Status filter
        if (filters.statusFilter === 'active' && product.status !== 'active') return false;
        if (filters.statusFilter === 'inactive' && product.status !== 'inactive') return false;
        if (filters.statusFilter === 'outOfStock' && product.status !== 'outOfStock') return false;
        if (filters.statusFilter === 'discontinued' && product.status !== 'discontinued') return false;
        
        // Price filters
        if (filters.priceFrom) {
          const fromPrice = parseFloat(filters.priceFrom);
          if (product.price < fromPrice) return false;
        }
        if (filters.priceTo) {
          const toPrice = parseFloat(filters.priceTo);
          if (product.price > toPrice) return false;
        }
        
        // Stock filters
        if (filters.stockFrom) {
          const fromStock = parseInt(filters.stockFrom);
          if (product.stock < fromStock) return false;
        }
        if (filters.stockTo) {
          const toStock = parseInt(filters.stockTo);
          if (product.stock > toStock) return false;
        }
        
        // Date filters
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (product.createdAt < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (product.createdAt > toDate) return false;
        }
        
        // Show active/inactive filter
        if (!filters.showActive && product.isActive) return false;
        if (!filters.showInactive && !product.isActive) return false;
        
        // Featured filter
        if (filters.showFeatured && !product.isFeatured) return false;
        
        // Out of stock filter
        if (!filters.showOutOfStock && product.stock === 0) return false;
        
        return true;
      });
      
      // Sorting
      filteredProducts.sort((a, b) => {
        let aVal, bVal;
        
        switch (filters.sortBy) {
          case 'name':
            aVal = a.name;
            bVal = b.name;
            break;
          case 'sku':
            aVal = a.sku;
            bVal = b.sku;
            break;
          case 'category':
            aVal = a.category.name;
            bVal = b.category.name;
            break;
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          case 'stock':
            aVal = a.stock;
            bVal = b.stock;
            break;
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
          case 'createdAt':
            aVal = a.createdAt.getTime();
            bVal = b.createdAt.getTime();
            break;
          default:
            aVal = a.name;
            bVal = b.name;
        }
        
        if (filters.sortOrder === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
      
      // Pagination
      const totalFiltered = filteredProducts.length;
      const startIndex = (filters.page - 1) * filters.limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + filters.limit);
      
      // Generate stats
      const stats = {
        totalProducts: allProducts.length,
        filteredProducts: totalFiltered,
        activeProducts: allProducts.filter(p => p.isActive && p.status === 'active').length,
        inactiveProducts: allProducts.filter(p => !p.isActive || p.status !== 'active').length,
        outOfStockProducts: allProducts.filter(p => p.stock === 0).length,
        lowStockProducts: allProducts.filter(p => p.stock > 0 && p.stock <= p.minStock).length,
        featuredProducts: allProducts.filter(p => p.isFeatured).length,
        categoryDistribution: allProducts.reduce((acc, product) => {
          acc[product.category.name] = (acc[product.category.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averagePrice: allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length,
        totalValue: allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
      };

      return {
        data: paginatedProducts,
        total: allProducts.length,
        totalFiltered: totalFiltered,
        stats,
        filters,
        success: true,
        authContext
      };
    } catch (error) {
      console.error('Loader error:', error);
      return {
        data: [],
        total: 0,
        totalFiltered: 0,
        stats: null,
        filters,
        success: false,
        error: 'Không thể tải dữ liệu sản phẩm',
        authContext
      };
    }
  });
};

export const action: ActionFunction = async ({ request }): Promise<ProductActionData> => {
  const formData = await request.formData();
  const actionType = formData.get('action') as string;
  const productId = formData.get('productId') as string;

  try {
    switch (actionType) {
      case 'edit': {
        const updateData = {
          name: formData.get('name') as string,
          sku: formData.get('sku') as string,
          description: formData.get('description') as string,
          price: parseFloat(formData.get('price') as string),
          categoryId: formData.get('categoryId') as string,
          stock: parseInt(formData.get('stock') as string),
          minStock: parseInt(formData.get('minStock') as string),
          status: formData.get('status') as string,
          isActive: formData.get('isActive') === 'on',
          isFeatured: formData.get('isFeatured') === 'on'
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã cập nhật thông tin sản phẩm thành công`,
          action: 'edit'
        };
      }

      case 'delete': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã xóa sản phẩm thành công`,
          action: 'delete'
        };
      }

      case 'duplicate': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã nhân bản sản phẩm thành công`,
          action: 'duplicate'
        };
      }

      case 'activate': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã kích hoạt sản phẩm thành công`,
          action: 'activate'
        };
      }

      case 'deactivate': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã vô hiệu hóa sản phẩm thành công`,
          action: 'deactivate'
        };
      }

      case 'inventory': {
        const adjustmentType = formData.get('adjustmentType') as string;
        const quantity = parseInt(formData.get('quantity') as string);
        const reason = formData.get('reason') as string;

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã cập nhật tồn kho thành công`,
          action: 'inventory'
        };
      }

      default:
        throw new Error(`Unknown action: ${actionType}`);
    }
  } catch (error) {
    console.error('Action error:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default function ProductsManagementPage() {
  const loaderData = useLoaderData<ProductLoaderData>();
  const actionData = useActionData<ProductActionData>();

  // Use the table data layout hook
  const {
    isMobile,
    sidebarCollapsed,
    setSidebarCollapsed,
    appliedFilters,
    columnVisibility,
    columnStickyState,
    contextMenu,
    modals,
    hasActiveFilters,
    updateFilters,
    handleSearch,
    handleSort,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnStickyChange,
    handleRowContextMenu,
    closeContextMenu,
    handleContextAction,
    openModal,
    closeModal,
    submitAction
  } = useTableDataLayout<Product>({
    filters: loaderData.filters,
    actionData,
    settingsKey: "products-management-settings",
    clearFilterParams: ['search', 'categoryFilter', 'statusFilter', 'priceFrom', 'priceTo', 'stockFrom', 'stockTo', 'dateFrom', 'dateTo', 'showInactive', 'showActive', 'showFeatured', 'showOutOfStock']
  });

  // Create columns with proper width settings
  const columns = createProductColumns().map(col => ({
    ...col,
    width: col.width || 150,
    minWidth: col.minWidth || 100,
    visible: columnVisibility[col.key] !== false,
    sticky: columnStickyState[col.key] || col.sticky || 'none'
  }));

  // Custom context menu actions
  const handleProductContextAction = (actionType: string, product: Product) => {
    switch (actionType) {
      case 'view':
        openModal('view', product);
        break;
      case 'edit':
        openModal('edit', product);
        break;
      case 'delete':
        openModal('delete', product);
        break;
      case 'duplicate':
        submitAction('duplicate', product);
        break;
      case 'inventory':
        openModal('inventory', product);
        break;
      case 'activate':
      case 'deactivate':
        submitAction(actionType, product);
        break;
      default:
        handleContextAction(actionType, product);
    }
  };

  return (
    <TableDataLayout<Product>
      loaderData={loaderData}
      actionData={actionData}
      columns={columns}
      renderTable={({ data, columns, onSort, sortField, sortDirection, loading }) => (
        <ProductTable
          products={data}
          onSort={(field) => onSort(field, sortDirection === 'asc' ? 'desc' : 'asc')}
          sortField={sortField}
          sortDirection={sortDirection}
          onRowContextMenu={(event, product) => handleRowContextMenu(product, event)}
          selectedProductId={contextMenu?.selectedItem.id}
          loading={loading}
          enablePagination={true}
          initialItemsPerPage={loaderData.filters.limit}
          columns={columns}
        />
      )}
      renderFilterSidebar={({ filters, onFilterChange, onSearch, isCollapsed, onToggleCollapse, appliedFilters, isMobile }) => (
        <ProductFilterSidebar
          filters={filters as ProductFilters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          useApplyButton={true}
          appliedFilters={appliedFilters as ProductFilters}
          hideToggleButton={!isMobile}
          isMobile={isMobile}
          showAsOverlay={isMobile}
        />
      )}
      contextMenu={contextMenu}
      onContextMenuAction={handleProductContextAction}
      onCloseContextMenu={closeContextMenu}
      renderContextMenu={({ item, position, onClose, onAction }) => (
        <ProductContextMenu
          product={item}
          position={position}
          onClose={onClose}
          onAction={onAction}
        />
      )}
      modals={modals}
      onCloseModal={closeModal}
      renderModals={() => (
        <>
          <ViewProductModal
            isOpen={!!modals.view}
            onClose={() => closeModal('view')}
            product={modals.view}
          />
          
          <EditProductModal
            isOpen={!!modals.edit}
            onClose={() => closeModal('edit')}
            product={modals.edit}
          />
          
          <DeleteProductModal
            isOpen={!!modals.delete}
            onClose={() => closeModal('delete')}
            product={modals.delete}
          />
          
          <InventoryModal
            isOpen={!!modals.inventory}
            onClose={() => closeModal('inventory')}
            product={modals.inventory}
          />
        </>
      )}
      settingsKey="products-management-settings"
      exportFilename="products-data"
      user={{
        fullName: loaderData.authContext.user?.name || "Demo User",
        username: loaderData.authContext.user?.name || "demo", 
        role: loaderData.authContext.user?.role || "Admin"
      }}
      clearFilterParams={['search', 'categoryFilter', 'statusFilter', 'priceFrom', 'priceTo', 'stockFrom', 'stockTo', 'dateFrom', 'dateTo', 'showInactive', 'showActive', 'showFeatured', 'showOutOfStock']}
    />
  );
}
