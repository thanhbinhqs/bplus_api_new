import { useState, useRef, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

// Generic column configuration
export interface Column<T> {
  key: keyof T | string;
  label: string;
  width: number;
  minWidth: number;
  maxWidth?: number;
  sortable?: boolean;
  render?: (value: any, item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  autoWidth?: boolean; // Tự động tính chiều rộng
  resizable?: boolean; // Có thể resize hay không
  manuallyResized?: boolean; // Đã được resize manually
  visible?: boolean; // Có hiển thị hay không, mặc định là true
  sticky?: 'left' | 'right' | 'none'; // Sticky position
}

// Helper function to calculate optimal column width
const calculateOptimalWidth = <T,>(
  column: Column<T>, 
  data: T[], 
  maxSampleSize: number = 50
): number => {
  if (!column.autoWidth) return column.width;

  // Check if running in browser environment
  if (typeof document === 'undefined') {
    // SSR environment - return default width
    return column.width;
  }

  // If no data, return a reasonable default
  if (!data || data.length === 0) {
    return Math.max(column.minWidth, Math.min(column.width, column.maxWidth || 300));
  }

  // Create a temporary div to measure text width
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.whiteSpace = 'nowrap';
  tempDiv.style.fontSize = '14px'; // Default table font size
  tempDiv.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif'; // Tailwind default
  tempDiv.style.padding = '8px 12px'; // Table cell padding
  tempDiv.style.top = '-9999px'; // Ensure it's off-screen
  tempDiv.style.left = '-9999px';
  
  document.body.appendChild(tempDiv);

  let maxWidth = 0;

  try {
    // Measure header width first
    tempDiv.textContent = column.label;
    maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);

    // Sample data for width calculation (limit for performance)
    const sampleData = data.slice(0, Math.min(maxSampleSize, data.length));

    // Measure content width
    sampleData.forEach((item, index) => {
      let content = '';
      
      if (column.render) {
        // For rendered content, we'll estimate based on the raw value
        const rawValue = item[column.key as keyof T];
        if (typeof rawValue === 'string') {
          content = rawValue;
        } else if (typeof rawValue === 'number') {
          content = rawValue.toString();
        } else if (typeof rawValue === 'boolean') {
          content = rawValue ? 'Hoạt động' : 'Không hoạt động'; // Vietnamese text
        } else if (rawValue instanceof Date) {
          content = rawValue.toLocaleDateString('vi-VN');
        } else if (rawValue && typeof rawValue === 'object' && 'name' in rawValue) {
          // Handle role objects
          content = String(rawValue.name || '');
        } else {
          content = String(rawValue || '');
        }
      } else {
        const rawValue = item[column.key as keyof T];
        content = String(rawValue || '');
      }

      // Add some extra characters to account for complex renders
      if (column.render) {
        content = content + '    '; // Add padding for badges, etc.
      }

      tempDiv.textContent = content;
      maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
    });

    // Also measure some common long values for this column type
    if (column.key === 'email') {
      tempDiv.textContent = 'example.very.long.email@domain.com';
      maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
    } else if (column.key === 'fullName') {
      tempDiv.textContent = 'Nguyễn Văn Thành Công';
      maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
    } else if (column.key === 'username') {
      tempDiv.textContent = 'user.name.123';
      maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
    }

  } catch (error) {
    console.warn('Error calculating optimal width:', error);
    // Fallback to original width if error occurs
    return column.width;
  } finally {
    // Always cleanup
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
  }

  // Add some padding and respect min/max width constraints
  const calculatedWidth = maxWidth + 30; // Extra padding for safety
  const finalWidth = Math.max(
    column.minWidth,
    Math.min(calculatedWidth, column.maxWidth || 500)
  );

  return Math.round(finalWidth);
};

// Table props
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (item: T, index: number) => void;
  onRowContextMenu?: (item: T, event: React.MouseEvent, index: number) => void;
  selectedRowIndex?: number;
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  // Bulk selection props
  enableBulkSelection?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  getRowId?: (item: T) => string;
}

export function GenericDataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  onSort,
  sortField,
  sortDirection,
  onRowClick,
  onRowContextMenu,
  selectedRowIndex,
  className = "",
  rowClassName,
  emptyMessage = "Không có dữ liệu",
  loading = false
}: DataTableProps<T>) {
  
  // Filter only visible columns
  const visibleColumns = initialColumns.filter(col => col.visible !== false);
  
  // Initialize columns with default widths first
  const [columns, setColumns] = useState(visibleColumns);
  const [isClient, setIsClient] = useState(false);
  const [isCalculatingWidths, setIsCalculatingWidths] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    columnIndex: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<Column<T>[]>(visibleColumns);
  
  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Update columns when initialColumns change (for visibility changes)
  useEffect(() => {
    const newVisibleColumns = initialColumns.filter(col => col.visible !== false);
    setColumns(newVisibleColumns);
  }, [initialColumns]);
  
  // Update columnsRef when columns change
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);
  
  // Calculate sticky positions for columns
  const calculateStickyPositions = useCallback((columns: Column<T>[]) => {
    const positions: Record<string, number> = {};
    let leftOffset = 0;
    let rightOffset = 0;
    
    // Calculate left sticky positions
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (col.sticky === 'left') {
        positions[String(col.key)] = leftOffset;
        leftOffset += col.width;
      }
    }
    
    // Calculate right sticky positions (from right to left)
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (col.sticky === 'right') {
        positions[String(col.key)] = rightOffset;
        rightOffset += col.width;
      }
    }
    
    return positions;
  }, []);
  
  // Get sticky positions for current columns
  const stickyPositions = calculateStickyPositions(columns);
  
  // Calculate optimal widths
  const calculateColumnWidths = useCallback(() => {
    if (!isClient || typeof document === 'undefined' || !tableRef.current || isResizing) return;
    
    setIsCalculatingWidths(true);
    
    requestAnimationFrame(() => {
      try {
        const currentVisibleColumns = initialColumns.filter(col => col.visible !== false);
        
        // Preserve existing column state when rebuilding
        const updatedColumns = currentVisibleColumns.map((newCol, index) => {
          // Find existing column by key to preserve state
          const existingCol = columnsRef.current.find(c => String(c.key) === String(newCol.key));
          
          if (existingCol) {
            // If column exists, preserve its width and manual resize state
            return {
              ...newCol,
              width: existingCol.width,
              manuallyResized: existingCol.manuallyResized
            };
          } else {
            // New column - calculate auto width if needed
            if (newCol.autoWidth) {
              return {
                ...newCol,
                width: calculateOptimalWidth(newCol, data)
              };
            }
            return newCol;
          }
        });
        
        setColumns(updatedColumns);
      } finally {
        setIsCalculatingWidths(false);
      }
    });
  }, [isClient, data, initialColumns, isResizing]);
  
  // Calculate auto-width columns after component mounts and when data changes
  useEffect(() => {
    calculateColumnWidths();
  }, [calculateColumnWidths]);
  
  // Recalculate on window resize
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      calculateColumnWidths();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumnWidths, isClient]);
  
  // Handle column resizing
  const handleMouseDown = useCallback((columnIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Chỉ cho phép resize nếu column có thể resize
    if (columns[columnIndex].resizable === false) return;
    
    setIsResizing(true);
    setResizeData({
      columnIndex,
      startX: e.clientX,
      startWidth: columns[columnIndex].width
    });
  }, [columns]);

  // Handle double click to auto-fit column width
  const handleDoubleClick = useCallback((columnIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Chỉ cho phép auto-fit nếu column có thể resize
    if (columns[columnIndex].resizable === false) return;
    
    const column = columns[columnIndex];
    
    // Tính toán chiều rộng tối ưu cho column này
    const optimalWidth = calculateOptimalWidth(column, data);
    
    // Hiển thị hiệu ứng loading ngắn để người dùng biết action đã được thực hiện
    const handleElement = e.currentTarget as HTMLElement;
    handleElement.classList.add('auto-fitting');
    setTimeout(() => {
      handleElement.classList.remove('auto-fitting');
    }, 300);
    
    // Cập nhật chiều rộng của column
    setColumns(prev => prev.map((col, index) => 
      index === columnIndex 
        ? { 
            ...col, 
            width: optimalWidth,
            manuallyResized: false // Reset manual resize flag since this is auto-calculated
          }
        : col
    ));
  }, [columns, data]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeData) return;

    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - resizeData.startX;
    const newWidth = Math.max(
      resizeData.startWidth + deltaX,
      columns[resizeData.columnIndex].minWidth
    );

    // Kiểm tra maxWidth nếu có
    let finalWidth = newWidth;
    if (columns[resizeData.columnIndex].maxWidth) {
      const maxWidth = columns[resizeData.columnIndex].maxWidth!;
      finalWidth = Math.min(newWidth, maxWidth);
    }

    // Throttle updates để cải thiện performance
    requestAnimationFrame(() => {
      setColumns(prev => prev.map((col, index) => 
        index === resizeData.columnIndex 
          ? { ...col, width: Math.round(finalWidth) }
          : col
      ));
    });
  }, [isResizing, resizeData, columns]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isResizing && resizeData) {
      e.preventDefault();
      
      // Mark the resized column as manually resized
      setColumns(prev => prev.map((col, index) => 
        index === resizeData.columnIndex 
          ? { ...col, manuallyResized: true }
          : col
      ));
      
      setIsResizing(false);
      setResizeData(null);
    }
  }, [isResizing, resizeData]);

  useEffect(() => {
    if (isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMouseMove(e);
      };
      
      const handleGlobalMouseUp = (e: MouseEvent) => {
        handleMouseUp(e);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
      
      // Prevent text selection and other interactions during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      
      // Add resize class to table
      if (tableRef.current) {
        tableRef.current.classList.add('table-resizing');
      }

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        // Remove resize class from table
        if (tableRef.current) {
          tableRef.current.classList.remove('table-resizing');
        }
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleSort = useCallback((field: string) => {
    if (!onSort) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    onSort(field, direction);
  }, [onSort, sortField, sortDirection]);

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={tableRef} className={`bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full ${isResizing ? 'table-resizing' : ''} ${className}`}>
      {/* Table wrapper với single scroll */}
      <div className="flex-1 table-scroll">
        <div className="min-w-max">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="flex w-full">
              {columns.map((column, index) => {
                const columnKey = String(column.key);
                const stickyStyle = column.sticky && column.sticky !== 'none' ? {
                  position: 'sticky' as const,
                  [column.sticky]: `${stickyPositions[columnKey] || 0}px`,
                  zIndex: column.sticky === 'left' ? 15 : 14,
                  backgroundColor: '#f9fafb'
                } : {};
                
                return (
                  <div
                    key={columnKey}
                    className={`relative px-4 py-3 border-r border-gray-200 last:border-r-0 flex-shrink-0 ${
                      isResizing && resizeData?.columnIndex === index ? 'bg-blue-50' : ''
                    } ${column.sticky && column.sticky !== 'none' ? `sticky-column sticky-${column.sticky}` : ''}`}
                    style={{ 
                      width: `${column.width}px`,
                      textAlign: column.align || 'left',
                      ...stickyStyle
                    }}
                  >
                  <div 
                    className={`flex items-center space-x-2 text-sm font-medium text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <span className="truncate">{column.label}</span>
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                  
                  {/* Resize handle - chỉ hiển thị cho các cột có thể resize */}
                  {(column.resizable !== false) && (
                    <div
                      className={`column-resize-handle ${
                        isResizing && resizeData?.columnIndex === index ? 'resizing' : ''
                      }`}
                      onMouseDown={(e) => handleMouseDown(index, e)}
                      onDoubleClick={(e) => handleDoubleClick(index, e)}
                      title="Kéo để thay đổi kích thước cột hoặc double-click để tự động điều chỉnh"
                    />
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div>
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">{emptyMessage}</p>
                </div>
              </div>
            ) : (
              data.map((item, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex w-full border-b border-gray-100 hover:bg-gray-50 ${
                    selectedRowIndex === rowIndex ? 'bg-blue-50' : ''
                  } ${rowClassName ? rowClassName(item, rowIndex) : ''}`}
                  onClick={() => onRowClick?.(item, rowIndex)}
                  onContextMenu={(e) => onRowContextMenu?.(item, e, rowIndex)}
                >
                  {columns.map((column, colIndex) => {
                    const columnKey = String(column.key);
                    const value = columnKey.includes('.') 
                      ? columnKey.split('.').reduce((obj: any, key: string) => obj?.[key], item)
                      : item[column.key];
                    
                    const stickyStyle = column.sticky && column.sticky !== 'none' ? {
                      position: 'sticky' as const,
                      [column.sticky]: `${stickyPositions[columnKey] || 0}px`,
                      zIndex: column.sticky === 'left' ? 13 : 12,
                      backgroundColor: selectedRowIndex === rowIndex ? '#dbeafe' : '#ffffff'
                    } : {};
                    
                    return (
                      <div
                        key={`${rowIndex}-${columnKey}`}
                        className={`px-4 py-3 border-r border-gray-100 last:border-r-0 flex-shrink-0 ${
                          column.sticky && column.sticky !== 'none' ? `sticky-column sticky-${column.sticky}` : ''
                        }`}
                        style={{ 
                          width: `${column.width}px`,
                          textAlign: column.align || 'left',
                          ...stickyStyle
                        }}
                      >
                        <div className="truncate text-sm text-gray-900">
                          {column.render ? column.render(value, item, rowIndex) : String(value || '')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
