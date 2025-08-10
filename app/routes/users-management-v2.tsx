import { type LoaderFunction, type ActionFunction, useLoaderData, useActionData } from "react-router";
import { LayoutFull, TableDataLayout, type BaseLoaderData, type BaseActionData, type BaseFilters } from "../components/layout";
import { UserFilterSidebar, UserTable, createUserColumns, UserContextMenu, ViewUserModal, EditUserModal, DeleteUserModal, ResetPasswordModal } from "../components/user";
import { useTableDataLayout } from "../hooks/useTableDataLayout";
import { withAuth, type AuthContext } from "../lib/authMiddleware";
import type { User } from "../types/user";

// Generate mock data function (same as before)
function generateMockUsers(): User[] {
  const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];
  const roleNames = ["Admin", "Manager", "User", "Support", "HR Manager", "Moderator", "Editor"];
  const users: User[] = [];

  for (let i = 1; i <= 300; i++) {
    const roleName = roleNames[Math.floor(Math.random() * roleNames.length)];
    users.push({
      id: `user-${i}`,
      username: `user${i}`,
      fullName: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
      email: Math.random() > 0.3 ? `user${i}@example.com` : undefined,
      roles: {
        id: `role-${roleName.toLowerCase()}`,
        name: roleName,
        description: `${roleName} role`
      },
      isActive: Math.random() > 0.1,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      updatedAt: new Date()
    });
  }

  return users;
}

// Extended interfaces for users management
interface UserFilters extends BaseFilters {
  roleFilter: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  showActive: boolean;
  showInactive: boolean;
}

interface UserLoaderData extends BaseLoaderData<User> {
  filters: UserFilters;
  authContext: AuthContext;
}

interface UserActionData extends BaseActionData {
  // Add specific user action types if needed
}

export const loader: LoaderFunction = async ({ request }): Promise<UserLoaderData> => {
  return withAuth(request, async (authContext) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const filters: UserFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'fullName',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      roleFilter: searchParams.get('roleFilter') || 'all',
      statusFilter: searchParams.get('statusFilter') || 'all',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      showActive: searchParams.get('showActive') !== 'false',
      showInactive: searchParams.get('showInactive') !== 'false'
    };

    try {
      // Generate and filter mock users (same logic as before)
      let allUsers = generateMockUsers();
      
      // Apply filters
      let filteredUsers = allUsers.filter(user => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            user.fullName.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower) ||
            (user.email && user.email.toLowerCase().includes(searchLower));
          if (!matchesSearch) return false;
        }
        
        // Role filter
        if (filters.roleFilter !== 'all') {
          const allowedRoles = filters.roleFilter.split(',').filter(Boolean);
          if (allowedRoles.length > 0 && !allowedRoles.includes(user.roles.name)) {
            return false;
          }
        }
        
        // Status filter
        if (filters.statusFilter === 'active' && !user.isActive) return false;
        if (filters.statusFilter === 'inactive' && user.isActive) return false;
        
        // Date filters
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (user.createdAt < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (user.createdAt > toDate) return false;
        }
        
        return true;
      });
      
      // Sorting (same logic as before)
      filteredUsers.sort((a, b) => {
        let aVal, bVal;
        
        switch (filters.sortBy) {
          case 'fullName':
            aVal = a.fullName;
            bVal = b.fullName;
            break;
          case 'username':
            aVal = a.username;
            bVal = b.username;
            break;
          case 'email':
            aVal = a.email || '';
            bVal = b.email || '';
            break;
          case 'role':
            aVal = a.roles.name;
            bVal = b.roles.name;
            break;
          case 'isActive':
            aVal = a.isActive ? '1' : '0';
            bVal = b.isActive ? '1' : '0';
            break;
          case 'createdAt':
            aVal = a.createdAt.getTime();
            bVal = b.createdAt.getTime();
            break;
          default:
            aVal = a.fullName;
            bVal = b.fullName;
        }
        
        if (filters.sortOrder === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
      
      // Pagination
      const totalFiltered = filteredUsers.length;
      const startIndex = (filters.page - 1) * filters.limit;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + filters.limit);
      
      // Generate stats
      const stats = {
        totalUsers: allUsers.length,
        filteredUsers: totalFiltered,
        activeUsers: allUsers.filter(u => u.isActive).length,
        inactiveUsers: allUsers.filter(u => !u.isActive).length,
        roleDistribution: allUsers.reduce((acc, user) => {
          acc[user.roles.name] = (acc[user.roles.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return {
        data: paginatedUsers,
        total: allUsers.length,
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
        error: 'Không thể tải dữ liệu người dùng',
        authContext
      };
    }
  });
};

export const action: ActionFunction = async ({ request }): Promise<UserActionData> => {
  const formData = await request.formData();
  const actionType = formData.get('action') as string;
  const userId = formData.get('userId') as string;

  try {
    switch (actionType) {
      case 'edit': {
        const updateData = {
          fullName: formData.get('fullName') as string,
          username: formData.get('username') as string,
          email: formData.get('email') as string || undefined,
          role: formData.get('role') as string,
          isActive: formData.get('isActive') === 'on'
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã cập nhật thông tin người dùng thành công`,
          action: 'edit'
        };
      }

      case 'delete': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã xóa người dùng thành công`,
          action: 'delete'
        };
      }

      case 'resetPassword': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã đặt lại mật khẩu thành công`,
          action: 'resetPassword'
        };
      }

      case 'activate': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã kích hoạt tài khoản thành công`,
          action: 'activate'
        };
      }

      case 'deactivate': {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `Đã vô hiệu hóa tài khoản thành công`,
          action: 'deactivate'
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

export default function UsersManagementPageRefactored() {
  const loaderData = useLoaderData<UserLoaderData>();
  const actionData = useActionData<UserActionData>();

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
  } = useTableDataLayout<User>({
    filters: loaderData.filters,
    actionData,
    settingsKey: "users-management-settings",
    clearFilterParams: ['search', 'roleFilter', 'statusFilter', 'dateFrom', 'dateTo', 'showInactive', 'showActive']
  });

  // Create columns with proper width settings
  const columns = createUserColumns().map(col => ({
    ...col,
    width: col.width || 150,
    minWidth: col.minWidth || 100,
    visible: columnVisibility[col.key] !== false,
    sticky: columnStickyState[col.key] || col.sticky || 'none'
  }));

  // Custom context menu actions
  const handleUserContextAction = (actionType: string, user: User) => {
    switch (actionType) {
      case 'view':
        openModal('view', user);
        break;
      case 'edit':
        openModal('edit', user);
        break;
      case 'delete':
        openModal('delete', user);
        break;
      case 'resetPassword':
        openModal('resetPassword', user);
        break;
      case 'activate':
      case 'deactivate':
        submitAction(actionType, user);
        break;
      default:
        handleContextAction(actionType, user);
    }
  };

  return (
    <TableDataLayout<User>
      loaderData={loaderData}
      actionData={actionData}
      columns={columns}
      renderTable={({ data, columns, onSort, sortField, sortDirection, loading }) => (
        <UserTable
          users={data}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onRowContextMenu={handleRowContextMenu}
          selectedUserId={contextMenu?.selectedItem.id}
          loading={loading}
          enablePagination={true}
          initialItemsPerPage={loaderData.filters.limit}
          columns={columns}
        />
      )}
      renderFilterSidebar={({ filters, onFilterChange, onSearch, isCollapsed, onToggleCollapse, appliedFilters, isMobile }) => (
        <UserFilterSidebar
          filters={filters as UserFilters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
          onAdvancedFilterChange={() => {}} // Legacy prop
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          useApplyButton={true}
          appliedFilters={appliedFilters as UserFilters}
          hideToggleButton={!isMobile}
          isMobile={isMobile}
          showAsOverlay={isMobile}
        />
      )}
      contextMenu={contextMenu}
      onContextMenuAction={handleUserContextAction}
      onCloseContextMenu={closeContextMenu}
      renderContextMenu={({ item, position, onClose, onAction }) => (
        <UserContextMenu
          user={item}
          position={position}
          onClose={onClose}
          onAction={onAction}
        />
      )}
      modals={modals}
      onCloseModal={closeModal}
      renderModals={() => (
        <>
          <ViewUserModal
            isOpen={!!modals.view}
            onClose={() => closeModal('view')}
            user={modals.view}
          />
          
          <EditUserModal
            isOpen={!!modals.edit}
            onClose={() => closeModal('edit')}
            user={modals.edit}
          />
          
          <DeleteUserModal
            isOpen={!!modals.delete}
            onClose={() => closeModal('delete')}
            user={modals.delete}
          />
          
          <ResetPasswordModal
            isOpen={!!modals.resetPassword}
            onClose={() => closeModal('resetPassword')}
            user={modals.resetPassword}
          />
        </>
      )}
      settingsKey="users-management-settings"
      exportFilename="users-data"
      user={{
        fullName: loaderData.authContext.user?.name || "Demo User",
        username: loaderData.authContext.user?.name || "demo", 
        role: loaderData.authContext.user?.role || "Admin"
      }}
      clearFilterParams={['search', 'roleFilter', 'statusFilter', 'dateFrom', 'dateTo', 'showInactive', 'showActive']}
    />
  );
}
