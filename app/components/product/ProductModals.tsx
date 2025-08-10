import { memo, useState } from "react";
import { X, Package, Tag, DollarSign, BarChart3, Star, Image, Calendar, User } from "lucide-react";
import { Button, Input, Label, Checkbox } from "../ui";
import type { Product } from "../../types/product";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

// Modal Base Component
function Modal({ isOpen, onClose, title, children, size = "md" }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-lg w-full mx-4 ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export const ViewProductModal = memo(function ViewProductModal({
  isOpen,
  onClose,
  product
}: ViewProductModalProps) {
  if (!product) return null;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết sản phẩm" size="lg">
      <div className="p-6 space-y-6">
        {/* Product Images */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>Hình ảnh sản phẩm</span>
          </h4>
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Thông tin cơ bản</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Tên sản phẩm</Label>
                <p className="text-gray-900">{product.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">SKU</Label>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{product.sku}</code>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
                <p className="text-gray-900">{product.description || "Không có mô tả"}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Danh mục</Label>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span>{product.category.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Giá và tồn kho</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Giá bán</Label>
                <p className="text-lg font-semibold text-green-600">{formatPrice(product.price)}</p>
              </div>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Giá gốc</Label>
                  <p className="text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Tồn kho</Label>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className={`font-medium ${
                    product.stock <= 0 ? 'text-red-600' :
                    product.stock <= product.minStock ? 'text-orange-600' :
                    'text-gray-900'
                  }`}>
                    {product.stock}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Tồn kho tối thiểu</Label>
                <p className="text-gray-900">{product.minStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Features */}
        <div className="space-y-4">
          <h4 className="font-medium">Trạng thái và tính năng</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                !product.isActive ? 'bg-gray-100 text-gray-700' :
                product.status === 'active' ? 'bg-green-100 text-green-700' :
                product.status === 'outOfStock' ? 'bg-red-100 text-red-700' :
                product.status === 'discontinued' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {!product.isActive ? 'Không hoạt động' :
                 product.status === 'active' ? 'Đang bán' :
                 product.status === 'outOfStock' ? 'Hết hàng' :
                 product.status === 'discontinued' ? 'Ngừng bán' : 'Không rõ'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Nổi bật:</span>
              {product.isFeatured ? (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              ) : (
                <Star className="h-4 w-4 text-gray-300" />
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t">
          <div>
            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Ngày tạo</span>
            </Label>
            <p className="text-gray-900">{formatDate(product.createdAt)}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Cập nhật lần cuối</span>
            </Label>
            <p className="text-gray-900">{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t p-4 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
});

export const EditProductModal = memo(function EditProductModal({
  isOpen,
  onClose,
  product
}: EditProductModalProps) {
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    categoryId: product?.category.id || '',
    stock: product?.stock || 0,
    minStock: product?.minStock || 0,
    status: product?.status || 'active' as 'active' | 'inactive' | 'outOfStock' | 'discontinued',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false
  }));

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Edit product:', formData);
    onClose();
  };

  const categories = [
    { id: 'electronics', name: 'Điện tử' },
    { id: 'clothing', name: 'Thời trang' },
    { id: 'books', name: 'Sách' },
    { id: 'home', name: 'Gia dụng' },
    { id: 'sports', name: 'Thể thao' },
    { id: 'beauty', name: 'Làm đẹp' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa sản phẩm" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Danh mục *</Label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Giá bán *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="originalPrice">Giá gốc</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="stock">Tồn kho *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="minStock">Tồn kho tối thiểu *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Không hoạt động</option>
                <option value="outOfStock">Hết hàng</option>
                <option value="discontinued">Ngừng bán</option>
              </select>
            </div>
            
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <span>Kích hoạt sản phẩm</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))}
                />
                <span>Sản phẩm nổi bật</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export const DeleteProductModal = memo(function DeleteProductModal({
  isOpen,
  onClose,
  product
}: DeleteProductModalProps) {
  if (!product) return null;

  const handleConfirm = () => {
    // Handle delete here
    console.log('Delete product:', product.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận xóa sản phẩm" size="sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">Xóa sản phẩm</h4>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          <div className="text-sm text-gray-500">Danh mục: {product.category.name}</div>
        </div>
        
        <p className="text-sm text-red-600 mb-6">
          <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến sản phẩm sẽ bị xóa vĩnh viễn.
        </p>
      </div>
      
      <div className="border-t p-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
          Xóa sản phẩm
        </Button>
      </div>
    </Modal>
  );
});

export const InventoryModal = memo(function InventoryModal({
  isOpen,
  onClose,
  product
}: InventoryModalProps) {
  const [adjustment, setAdjustment] = useState({
    type: 'add' as 'add' | 'subtract' | 'set',
    quantity: 0,
    reason: ''
  });

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle inventory adjustment
    console.log('Inventory adjustment:', adjustment);
    onClose();
  };

  const getNewStock = () => {
    switch (adjustment.type) {
      case 'add':
        return product.stock + adjustment.quantity;
      case 'subtract':
        return Math.max(0, product.stock - adjustment.quantity);
      case 'set':
        return adjustment.quantity;
      default:
        return product.stock;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quản lý tồn kho" size="md">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-medium text-gray-900 mb-2">{product.name}</div>
            <div className="text-sm text-gray-500 mb-2">SKU: {product.sku}</div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Tồn kho hiện tại: <strong>{product.stock}</strong>
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Loại điều chỉnh</Label>
              <select
                value={adjustment.type}
                onChange={(e) => setAdjustment(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="add">Thêm tồn kho</option>
                <option value="subtract">Giảm tồn kho</option>
                <option value="set">Đặt tồn kho</option>
              </select>
            </div>
            
            <div>
              <Label>Số lượng</Label>
              <Input
                type="number"
                min="0"
                value={adjustment.quantity}
                onChange={(e) => setAdjustment(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                required
              />
            </div>
            
            <div>
              <Label>Lý do điều chỉnh</Label>
              <textarea
                value={adjustment.reason}
                onChange={(e) => setAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                placeholder="Nhập lý do điều chỉnh tồn kho..."
                required
              />
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700">
                Tồn kho sau điều chỉnh: <strong>{getNewStock()}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            Cập nhật tồn kho
          </Button>
        </div>
      </form>
    </Modal>
  );
});
