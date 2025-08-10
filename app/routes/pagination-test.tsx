import { useState } from 'react';
import { SimplePagination } from '../components/generic';

export default function PaginationTest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Test data
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const handlePageChange = (page: number) => {
    console.log('Page change:', page);
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (newSize: number) => {
    console.log('Items per page change:', newSize);
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pagination Test</h1>
        
        {/* Test Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Current Page:</strong> {currentPage}
            </div>
            <div>
              <strong>Total Pages:</strong> {totalPages}
            </div>
            <div>
              <strong>Total Items:</strong> {totalItems}
            </div>
            <div>
              <strong>Items Per Page:</strong> {itemsPerPage}
            </div>
            <div>
              <strong>Start Item:</strong> {startItem}
            </div>
            <div>
              <strong>End Item:</strong> {endItem}
            </div>
          </div>
        </div>

        {/* Mock Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Mock Data Table</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-2">
              {Array.from({ length: Math.min(itemsPerPage, totalItems - startItem + 1) }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Item {startItem + i}</span>
                  <span className="text-gray-500">Mock data for pagination test</span>
                </div>
              ))}
            </div>
          </div>

          {/* SimplePagination Component */}
          <SimplePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Page 1
            </button>
            <button
              onClick={() => setCurrentPage(Math.ceil(totalPages / 2))}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Middle Page
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Go to Last Page
            </button>
            <button
              onClick={() => {
                setItemsPerPage(5);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Set 5 per page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
