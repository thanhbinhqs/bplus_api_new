interface GenericPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
  // Customizable text
  itemLabel?: string;
  showText?: string;
  toText?: string;
  ofText?: string;
  resultsText?: string;
  showLabel?: string;
  perPageText?: string;
  previousText?: string;
  nextText?: string;
  // Customizable page size options
  pageSizeOptions?: number[];
}

export function GenericPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
  // Default Vietnamese text
  showText = "Hiển thị",
  toText = "đến",
  ofText = "trong số",
  resultsText = "kết quả",
  showLabel = "Hiển thị:",
  perPageText = "/ trang",
  previousText = "Trước",
  nextText = "Sau",
  pageSizeOptions = [10, 20, 50, 100]
}: GenericPaginationProps) {
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 3) {
        // Show first pages + ellipsis + last
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first + ellipsis + last pages
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first + ellipsis + current area + ellipsis + last
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3 sm:gap-0 ${className}`}>
      {/* Simplified info text */}
      <div className="flex flex-col xs:flex-row xs:items-center text-sm text-gray-700 gap-2 xs:gap-4">
        <span className="whitespace-nowrap">
          <span className="font-medium">{startItem}-{endItem}</span> / <span className="font-medium">{totalItems}</span>
        </span>
        
        {/* Items per page selector - more compact */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Hiển thị:</span>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Simplified pagination controls */}
      <div className="flex items-center justify-center sm:justify-end">
        <div className="flex items-center bg-gray-50 rounded-lg p-1 gap-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 transition-colors"
            title="Trang trước"
          >
            ‹
          </button>

          {/* Current page indicator - always visible */}
          <div className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 transition-colors"
            title="Trang sau"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
