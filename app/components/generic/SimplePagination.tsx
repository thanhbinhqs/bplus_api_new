interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
  showItemsPerPage?: boolean;
  pageSizeOptions?: number[];
}

export function SimplePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
  showItemsPerPage = true,
  pageSizeOptions = [10, 20, 50, 100]
}: SimplePaginationProps) {
  
  // Validate props to prevent errors
  const validCurrentPage = Math.max(1, Math.min(currentPage || 1, totalPages || 1));
  const validTotalPages = Math.max(1, totalPages || 1);
  const validTotalItems = Math.max(0, totalItems || 0);
  
  const startItem = validTotalItems > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(validCurrentPage * itemsPerPage, validTotalItems);

  return (
    <div className={`flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 ${className}`}>
      {/* Left side: Info */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="font-medium">
          {validTotalItems > 0 ? `${startItem}-${endItem} / ${validTotalItems}` : '0 / 0'}
        </span>
        
        {/* Items per page */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-1">
            <span className="text-xs">Hiển thị:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          title="Trang trước"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-50 rounded border">
          {validCurrentPage} / {validTotalPages}
        </span>

        <button
          onClick={() => onPageChange(validCurrentPage + 1)}
          disabled={validCurrentPage === validTotalPages}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          title="Trang sau"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
