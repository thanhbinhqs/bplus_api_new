import { useState } from 'react';
import { GenericDataTable, type Column, GenericPagination } from "../generic";
import type { User } from "../../types/user";

// Export the user columns for use in other components
export const createUserColumns = (startIndex: number = 0): Column<User>[] => [
  {
    key: 'no',
    label: 'No',
    width: 60,
    minWidth: 50,
    maxWidth: 80,
    sortable: false,
    align: 'center',
    resizable: false, // Không cho resize cột số thứ tự
    sticky: 'left', // Pin cột số thứ tự bên trái
    render: (value: any, item: User, index: number) => (
      <span className="text-gray-600 font-mono text-sm">
        {startIndex + index + 1}
      </span>
    )
  },
  {
    key: 'fullName',
    label: 'Họ tên',
    width: 180,
    minWidth: 120,
    maxWidth: 250,
    sortable: true,
    align: 'left',
    autoWidth: true
  },
  {
    key: 'username',
    label: 'Username',
    width: 140,
    minWidth: 100,
    sortable: true,
    align: 'left',
    autoWidth: true
  },
  {
    key: 'email',
    label: 'Email',
    width: 220,
    minWidth: 150,
    maxWidth: 300,
    sortable: true,
    align: 'left',
    autoWidth: true,
    render: (value) => value || <span className="text-gray-400">Chưa có</span>
  },
  {
    key: 'roles',
    label: 'Vai trò',
    width: 120,
    minWidth: 100,
    maxWidth: 150,
    sortable: true,
    align: 'center',
    resizable: false, // Không cho resize cột vai trò
    render: (value: User['roles']) => (
      <span className={`
        inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
        ${value.name === 'Admin' ? 'bg-red-100 text-red-800' :
          value.name === 'Manager' ? 'bg-blue-100 text-blue-800' :
          value.name === 'HR Manager' ? 'bg-purple-100 text-purple-800' :
          value.name === 'Moderator' ? 'bg-orange-100 text-orange-800' :
          value.name === 'Editor' ? 'bg-green-100 text-green-800' :
          value.name === 'Support' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'}
      `}>
        {value.name}
      </span>
    )
  },
  {
    key: 'isActive',
    label: 'Trạng thái',
    width: 110,
    minWidth: 100,
    sortable: true,
    align: 'center',
    resizable: false, // Không cho resize cột trạng thái
    autoWidth: true,
    render: (value: boolean) => (
      <span className={`
        inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
        ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      `}>
        {value ? 'Hoạt động' : 'Không hoạt động'}
      </span>
    )
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    width: 100,
    minWidth: 90,
    maxWidth: 120,
    sortable: true,
    align: 'center',
    resizable: false, // Không cho resize cột ngày tạo
    render: (value: Date) => {
      return (
        <span className="font-mono text-sm">
          {new Date(value).toLocaleDateString('vi-VN', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          })}
        </span>
      );
    }
  },
  {
    key: 'lastLoginAt',
    label: 'Lần cuối',
    width: 100,
    minWidth: 90,
    sortable: true,
    align: 'center',
    resizable: true, // Không cho resize cột lần cuối
    render: (value?: Date) => {
      if (!value) return <span className="text-gray-400 text-sm">Chưa đăng nhập</span>;
      return (
        <span className="font-mono text-sm">
          {new Date(value).toLocaleDateString('vi-VN', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          })}
        </span>
      );
    }
  }
];

interface UserTableProps {
  users: User[];
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onRowContextMenu: (user: User, event: React.MouseEvent) => void;
  selectedUserId?: string;
  loading?: boolean;
  enablePagination?: boolean;
  initialItemsPerPage?: number;
  columns?: Column<User>[]; // Optional custom columns
}

export function UserTable({
  users,
  onSort,
  sortField,
  sortDirection,
  onRowContextMenu,
  selectedUserId,
  loading = false,
  enablePagination = true,
  initialItemsPerPage = 20,
  columns: customColumns
}: UserTableProps) {
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = enablePagination 
    ? users.slice(startIndex, endIndex)
    : users;

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };
  
  // Define columns for User table with proper start index for numbering
  // Use custom columns if provided, otherwise use default columns
  const columns: Column<User>[] = customColumns || createUserColumns(enablePagination ? startIndex : 0);

  const handleRowClick = (user: User, index: number) => {
    // Could be used for selection
  };

  const handleRowContextMenu = (user: User, event: React.MouseEvent, index: number) => {
    onRowContextMenu(user, event);
  };

  const getRowClassName = (user: User, index: number) => {
    if (selectedUserId === user.id) {
      return 'ring-2 ring-blue-400';
    }
    return '';
  };

  const selectedRowIndex = selectedUserId 
    ? currentUsers.findIndex(user => user.id === selectedUserId)
    : undefined;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <GenericDataTable
          data={currentUsers}
          columns={columns}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onRowClick={handleRowClick}
          onRowContextMenu={handleRowContextMenu}
          selectedRowIndex={selectedRowIndex}
          rowClassName={getRowClassName}
          emptyMessage="Không có người dùng nào"
          loading={loading}
          className="h-full"
          storageKey="users-management:user-table"
        />
      </div>
      
      {enablePagination && totalItems > 0 && (
        <GenericPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="border-t-0"
        />
      )}
    </div>
  );
}
