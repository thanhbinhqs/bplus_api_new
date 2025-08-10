import { memo } from "react";
import { ChevronDown, Package, Tag, Star, AlertTriangle, Eye, Edit, Trash2, Copy, Archive, BarChart3 } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductContextMenuProps {
  product: Product;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (actionType: string, product: Product) => void;
}

export const ProductContextMenu = memo(function ProductContextMenu({
  product,
  position,
  onClose,
  onAction
}: ProductContextMenuProps) {
  const handleAction = (actionType: string) => {
    onAction(actionType, product);
    onClose();
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-lg border py-2 min-w-[180px]"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: position.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
        <div className="text-xs text-gray-500">SKU: {product.sku}</div>
      </div>

      <div className="py-1">
        <button
          onClick={() => handleAction('view')}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </button>

        <button
          onClick={() => handleAction('edit')}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </button>

        <button
          onClick={() => handleAction('duplicate')}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Copy className="mr-2 h-4 w-4" />
          Nhân bản
        </button>
      </div>

      <div className="border-t border-gray-100 py-1">
        {product.isActive ? (
          <button
            onClick={() => handleAction('deactivate')}
            className="flex items-center w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
          >
            <Archive className="mr-2 h-4 w-4" />
            Vô hiệu hóa
          </button>
        ) : (
          <button
            onClick={() => handleAction('activate')}
            className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50"
          >
            <Package className="mr-2 h-4 w-4" />
            Kích hoạt
          </button>
        )}

        <button
          onClick={() => handleAction('inventory')}
          className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Quản lý tồn kho
        </button>
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={() => handleAction('delete')}
          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa sản phẩm
        </button>
      </div>
    </div>
  );
});
