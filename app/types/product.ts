export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: {
    id: string;
    name: string;
    description?: string;
  };
  stock: number;
  minStock: number;
  maxStock?: number;
  status: 'active' | 'inactive' | 'outOfStock' | 'discontinued';
  isActive: boolean;
  isFeatured: boolean;
  images?: string[];
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface ProductFilters {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  categoryFilter: string;
  statusFilter: string;
  priceFrom: string;
  priceTo: string;
  stockFrom: string;
  stockTo: string;
  dateFrom: string;
  dateTo: string;
  showActive: boolean;
  showInactive: boolean;
  showFeatured: boolean;
  showOutOfStock: boolean;
}
