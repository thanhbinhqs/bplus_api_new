import { useState, useEffect, useCallback, useRef } from "react";
import { type LoaderFunction, type ActionFunction, useLoaderData, useActionData, useSearchParams, useSubmit } from "react-router";
import { toast } from "sonner";
import { LayoutFull } from "../components/layout";
import { UserFilterSidebar, UserTable, createUserColumns, UserContextMenu, ViewUserModal, EditUserModal, DeleteUserModal, ResetPasswordModal } from "../components/user";
import { GenericTableToolbar as TableToolbar } from "../components/generic";
import type { User } from "../types/user";
import { requireAuth } from "../lib/authMiddleware";

// Simulate mock data directly in loader
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

// Types for loader/action data
interface LoaderData {
  users: User[];
  total: number;
  totalFiltered: number;
  stats: any;
  filters: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    roleFilter: string;
    statusFilter: string;
    dateFrom: string;
    dateTo: string;
    showActive: boolean;
    showInactive: boolean;
  };
  success: boolean;
  error?: string;
}

interface ActionData {
  success: boolean;
  message: string;
  action?: string;
  error?: string;
}

// Loader function - chạy trước khi render component
export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  requireAuth(request);

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const filters = {
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
    // Generate mock users
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
      
      // Role filter - handle multiple roles
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
    
    // Sorting
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
      users: paginatedUsers,
      total: allUsers.length,
      totalFiltered: totalFiltered,
      stats,
      filters,
      success: true
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      users: [],
      total: 0,
      totalFiltered: 0,
      stats: null,
      filters,
      success: false,
      error: 'Không thể tải dữ liệu người dùng'
    };
  }
};

// Action function - xử lý form submissions
export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
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

        // TODO: Implement actual API call
        // const result = await userApi.update(userId, updateData);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return {
          success: true,
          message: `Đã cập nhật thông tin người dùng thành công`,
          action: 'edit'
        };
      }

      case 'delete': {
        // TODO: Implement actual API call
        // const result = await userApi.delete(userId);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return {
          success: true,
          message: `Đã xóa người dùng thành công`,
          action: 'delete'
        };
      }

      case 'resetPassword': {
        const newPassword = formData.get('newPassword') as string;
        const sendEmail = formData.get('sendEmail') === 'on';

        // TODO: Implement actual API call
        // const result = await userApi.resetPassword(userId, { newPassword, sendEmail });
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return {
          success: true,
          message: `Đã đặt lại mật khẩu thành công`,
          action: 'resetPassword'
        };
      }

      case 'activate': {
        // TODO: Implement actual API call
        // const result = await userApi.activate(userId);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return {
          success: true,
          message: `Đã kích hoạt tài khoản thành công`,
          action: 'activate'
        };
      }

      case 'deactivate': {
        // TODO: Implement actual API call
        // const result = await userApi.deactivate(userId);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
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

// Helper function to save user settings to localStorage
const saveUserSettings = (key: string, settings: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(settings));
  }
};

// Helper function to load user settings from localStorage
const loadUserSettings = (key: string): any => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const settings = localStorage.getItem(key);
    return settings ? JSON.parse(settings) : null;
  }
  return null;
};

// Helper function to compare two objects
const isEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export default function UsersManagementPage() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  const settingsKey = "users-management-settings";

  // Mobile detection hook
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Local state for UI - auto-collapse sidebar on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Track applied filters separately from URL filters for Apply button mode
  const [appliedFilters, setAppliedFilters] = useState(loaderData.filters);

  // Column visibility state - init empty, hydrate on client
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  // Column sticky state - init empty, hydrate on client
  const [columnStickyState, setColumnStickyState] = useState<Record<string, 'left' | 'right' | 'none'>>({});

  // Hydration flag to avoid saving before we load from storage
  const settingsHydratedRef = useRef(false);

  // Hydrate settings from localStorage once on client
  useEffect(() => {
    const savedSettings = loadUserSettings(settingsKey);
    if (savedSettings) {
      setColumnVisibility(savedSettings.columnVisibility || {});
      setColumnStickyState(savedSettings.columnStickyState || {});
    }
    settingsHydratedRef.current = true;
  }, []);

  // Save settings whenever column visibility or sticky state changes (after hydration)
  useEffect(() => {
    if (!settingsHydratedRef.current) return;
    saveUserSettings(settingsKey, { columnVisibility, columnStickyState });
  }, [columnVisibility, columnStickyState]);

  // Update applied filters when loader data changes (on first load or navigation)
  useEffect(() => {
    setAppliedFilters(loaderData.filters);
  }, [loaderData.filters]);

  const [contextMenu, setContextMenu] = useState<{
    user: User;
    position: { x: number; y: number };
  } | null>(null);
  
  const [modals, setModals] = useState({
    view: null as User | null,
    edit: null as User | null,
    delete: null as User | null,
    resetPassword: null as User | null
  });

  // Update filters in URL
  const updateFilters = (newFilters: any) => {
    console.log('updateFilters called with:', newFilters);
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params first
    ['search', 'roleFilter', 'statusFilter', 'dateFrom', 'dateTo', 'showInactive', 'showActive'].forEach(key => {
      params.delete(key);
    });
    
    // Set new filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== 'all' && value !== null && value !== undefined) {
        // Handle boolean values specifically
        if (typeof value === 'boolean') {
          params.set(key, String(value));
        } else if (value !== false) {
          params.set(key, String(value));
        }
      }
    });
    
    console.log('New URL params:', params.toString());
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Update applied filters state
    setAppliedFilters(newFilters);
    
    setSearchParams(params);
  };

  // Handle search
  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle filter changes from advanced filters
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);
    
    // Handle roles filter
    if (filters.roles.length > 0) {
      params.set('roleFilter', filters.roles.join(','));
    } else {
      params.delete('roleFilter');
    }
    
    // Handle status filter
    if (filters.status !== 'all') {
      params.set('statusFilter', filters.status);
    } else {
      params.delete('statusFilter');
    }
    
    // Handle date range
    if (filters.dateRange.from) {
      params.set('dateFrom', filters.dateRange.from.toISOString().split('T')[0]);
    } else {
      params.delete('dateFrom');
    }
    
    if (filters.dateRange.to) {
      params.set('dateTo', filters.dateRange.to.toISOString().split('T')[0]);
    } else {
      params.delete('dateTo');
    }
    
    params.set('page', '1'); // Reset to page 1
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle sorting
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortOrder', direction);
    params.set('page', '1'); // Reset to page 1
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle column visibility changes
  const handleColumnVisibilityChange = useCallback((columnKey: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnKey]: visible }));
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumnVisibility({});
  }, []);

  // Handle column sticky changes
  const handleColumnStickyChange = useCallback((columnKey: string, sticky: 'left' | 'right' | 'none') => {
    setColumnStickyState(prev => ({ ...prev, [columnKey]: sticky }));
  }, []);

  // Handle context menu
  const handleRowContextMenu = (user: User, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      user,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handle context menu actions
  const handleContextAction = (actionType: string, user: User) => {
    switch (actionType) {
      case 'view':
        setModals(prev => ({ ...prev, view: user }));
        break;
      case 'edit':
        setModals(prev => ({ ...prev, edit: user }));
        break;
      case 'delete':
        setModals(prev => ({ ...prev, delete: user }));
        break;
      case 'resetPassword':
        setModals(prev => ({ ...prev, resetPassword: user }));
        break;
      case 'activate':
      case 'deactivate':
        // Submit form for immediate action
        const formData = new FormData();
        formData.append('action', actionType);
        formData.append('userId', user.id);
        submit(formData, { method: 'post' });
        break;
      case 'copyId':
        navigator.clipboard.writeText(user.id);
        toast.success('Đã copy ID người dùng');
        break;
      case 'copyUsername':
        navigator.clipboard.writeText(user.username);
        toast.success('Đã copy username');
        break;
      default:
        console.warn(`Unhandled action: ${actionType}`);
    }
  };

  // Close modals
  const closeModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: null }));
  };

  // Show success/error messages from action
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message);
        
        // Close modals after successful action
        if (actionData.action === 'edit') {
          setModals(prev => ({ ...prev, edit: null }));
        } else if (actionData.action === 'delete') {
          setModals(prev => ({ ...prev, delete: null }));
        } else if (actionData.action === 'resetPassword') {
          setModals(prev => ({ ...prev, resetPassword: null }));
        }
      } else {
        toast.error(actionData.message);
      }
    }
  }, [actionData]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  if (!loaderData.success) {
    return (
      <LayoutFull user={{ fullName: "Demo User", username: "demo", role: "Admin" }}>
        <div className="h-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lỗi tải dữ liệu</h1>
            <p className="text-gray-600 mb-4">{loaderData.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </LayoutFull>
    );
  }

  return (
    <LayoutFull user={{ fullName: "Demo User", username: "demo", role: "Admin" }}>
      <div className="bg-gray-50 flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Filter */}
          <UserFilterSidebar
            filters={loaderData.filters}
            onFilterChange={updateFilters}
            onSearch={handleSearch}
            onAdvancedFilterChange={handleFilterChange}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            useApplyButton={true}
            appliedFilters={appliedFilters}
            hideToggleButton={!isMobile} // Only show close button on mobile
            isMobile={isMobile}
            showAsOverlay={isMobile} // Show as overlay on mobile
          />

          {/* Main table area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Toolbar */}
            <TableToolbar
              data={loaderData.users}
              columns={createUserColumns().map(col => ({
                ...col,
                visible: columnVisibility[String(col.key)] !== false,
                sticky: columnStickyState[String(col.key)] || col.sticky || 'none'
              }))}
              onRefresh={() => window.location.reload()}
              onColumnVisibilityChange={handleColumnVisibilityChange}
              onResetColumns={handleResetColumns}
              onColumnStickyChange={handleColumnStickyChange}
              exportFilename="users-data"
              loading={false}
              showFilterToggle={true}
              isFilterCollapsed={sidebarCollapsed}
              onFilterToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              hasActiveFilters={Object.entries(appliedFilters).some(([key, value]) => {
                if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') return false;
                if (key === 'search') return value !== '';
                if (key === 'roleFilter' || key === 'statusFilter') return value !== 'all';
                if (key === 'dateFrom' || key === 'dateTo') return value !== '';
                if (key === 'showActive' || key === 'showInactive') return value !== true;
                return false;
              })}
            />
            
            {/* Table */}
            <div className="flex-1 min-h-0">
              <UserTable
                users={loaderData.users}
                onSort={handleSort}
                sortField={loaderData.filters.sortBy}
                sortDirection={loaderData.filters.sortOrder}
                onRowContextMenu={handleRowContextMenu}
                selectedUserId={contextMenu?.user.id}
                loading={false}
                enablePagination={true}
                initialItemsPerPage={loaderData.filters.limit}
                columns={createUserColumns().map(col => ({
                  ...col,
                  visible: columnVisibility[String(col.key)] !== false,
                  sticky: columnStickyState[String(col.key)] || col.sticky || 'none'
                }))}
              />
            </div>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <UserContextMenu
            user={contextMenu.user}
            position={contextMenu.position}
            onClose={closeContextMenu}
            onAction={handleContextAction}
          />
        )}

        {/* Modals */}
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
      </div>
    </LayoutFull>
  );
}
