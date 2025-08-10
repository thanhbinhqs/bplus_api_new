import { useState, useCallback } from 'react';
import { GenericDataTable, type Column, SimplePagination } from '../components/generic';
import { TableToolbar } from '../components/TableToolbar';
import { Search } from 'lucide-react';

// Sample data for testing
interface TestItem {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
  createdAt: Date;
}

const generateTestData = (): TestItem[] => {
  const data: TestItem[] = [];
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Davis'];
  const roles = ['Admin', 'User', 'Manager', 'Editor'];
  
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: `item-${i}`,
      name: `${names[i % names.length]} ${i}`,
      email: `user${i}@example.com`,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      role: roles[i % roles.length],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    });
  }
  
  return data;
};

export default function ComponentDemo() {
  const [allData] = useState(() => generateTestData());
  const [filteredData, setFilteredData] = useState(allData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  
  // Define columns
  const columns: Column<TestItem>[] = [
    {
      key: 'name',
      label: 'Name',
      width: 200,
      minWidth: 120,
      sortable: true,
      align: 'left'
    },
    {
      key: 'email',
      label: 'Email',
      width: 250,
      minWidth: 150,
      sortable: true,
      align: 'left'
    },
    {
      key: 'role',
      label: 'Role',
      width: 120,
      minWidth: 80,
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <span className={`
          inline-flex px-2 py-1 rounded-full text-xs font-medium
          ${value === 'Admin' ? 'bg-red-100 text-red-800' :
            value === 'Manager' ? 'bg-blue-100 text-blue-800' :
            value === 'Editor' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'}
        `}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      minWidth: 80,
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <span className={`
          inline-flex px-2 py-1 rounded-full text-xs font-medium
          ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: 120,
      minWidth: 100,
      sortable: true,
      align: 'left',
      render: (value: Date) => new Date(value).toLocaleDateString()
    }
  ];
  
  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const filtered = allData.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData]);
  
  // Filter handler
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    let filtered = allData;
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    // Role filter
    if (filters.roles.length > 0) {
      filtered = filtered.filter(item => filters.roles.includes(item.role));
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData]);
  
  // Sort handler
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...filteredData].sort((a, b) => {
      let aVal: any = a[field as keyof TestItem];
      let bVal: any = b[field as keyof TestItem];
      
      if (aVal instanceof Date) {
        aVal = aVal.getTime();
        bVal = bVal.getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (direction === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
    
    setFilteredData(sorted);
    // Don't reset page on sort to maintain user position
  }, [filteredData]);
  
  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Component Demo</h1>
        
        {/* Search Input Demo */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Search Input Component</h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Data Table Demo */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Data Table Component</h2>
            <p className="text-gray-600 mt-1">
              Complete table with toolbar, search, pagination, and export
            </p>
          </div>
          
          {/* Table Toolbar */}
          <TableToolbar
            data={currentData}
            columns={columns}
            onRefresh={() => {
              console.log('Refreshing data...');
              // In real app, this would reload data
            }}
            exportFilename="demo-data"
            loading={false}
          />
          
          <div className="h-96">
            <GenericDataTable
              data={currentData}
              columns={columns}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onRowClick={(item, index) => console.log('Row clicked:', item)}
              emptyMessage="No items found"
              className="h-full"
            />
          </div>
          
          {/* Pagination */}
          <SimplePagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize: number) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600">{allData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Filtered Items</h3>
            <p className="text-3xl font-bold text-green-600">{filteredData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Current Page</h3>
            <p className="text-3xl font-bold text-purple-600">{currentPage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
