import type { User, Role } from '../../types/user';
import type { ApiResponse } from '../../types/response.dto';
import { UserService, RoleService, PermissionService } from '../mock';

/**
 * Client API Helper - Wrapper functions để gọi API từ components
 * Sử dụng Mock Services thay vì API routes thực
 */

class ApiClient {
  // User API methods
  users = {
    /**
     * Lấy danh sách users với pagination, search, sort và filter
     */
    getList: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      roleFilter?: string;
      statusFilter?: 'active' | 'inactive' | 'all';
      dateFrom?: string;
      dateTo?: string;
    }): Promise<ApiResponse<{ users: User[]; total: number; totalFiltered: number; stats?: any }>> => {
      return UserService.getUsers(params);
    },

    /**
     * Lấy thông tin user theo ID
     */
    getById: async (id: string): Promise<ApiResponse<User>> => {
      return UserService.getUserById(id);
    },

    /**
     * Tạo user mới
     */
    create: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
      return UserService.createUser(userData);
    },

    /**
     * Cập nhật user
     */
    update: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
      return UserService.updateUser(id, userData);
    },

    /**
     * Xóa user
     */
    delete: async (id: string): Promise<ApiResponse<null>> => {
      return UserService.deleteUser(id);
    },

    /**
     * Đặt lại mật khẩu user
     */
    setPassword: async (id: string, newPassword: string): Promise<ApiResponse<null>> => {
      return UserService.setUserPassword(id, newPassword);
    },

    /**
     * Gán role cho user
     */
    setRole: async (id: string, roleId: string): Promise<ApiResponse<User>> => {
      return UserService.setUserRole(id, roleId);
    },

    /**
     * Gán permissions cho user
     */
    setPermissions: async (id: string, permissions: string[]): Promise<ApiResponse<User>> => {
      return UserService.setUserPermissions(id, permissions);
    },
  };

  // Role API methods
  roles = {
    /**
     * Lấy danh sách tất cả roles
     */
    getList: async (): Promise<ApiResponse<Role[]>> => {
      return RoleService.getRoles();
    },

    /**
     * Lấy thông tin role theo ID
     */
    getById: async (id: string): Promise<ApiResponse<Role>> => {
      return RoleService.getRoleById(id);
    },

    /**
     * Tạo role mới
     */
    create: async (roleData: Partial<Role>): Promise<ApiResponse<Role>> => {
      return RoleService.createRole(roleData);
    },

    /**
     * Cập nhật role
     */
    update: async (id: string, roleData: Partial<Role>): Promise<ApiResponse<Role>> => {
      return RoleService.updateRole(id, roleData);
    },

    /**
     * Xóa role
     */
    delete: async (id: string): Promise<ApiResponse<null>> => {
      return RoleService.deleteRole(id);
    },

    /**
     * Gán permissions cho role
     */
    setPermissions: async (id: string, permissions: string[]): Promise<ApiResponse<Role>> => {
      return RoleService.setRolePermissions(id, permissions);
    },
  };

  // Permission API methods
  permissions = {
    /**
     * Lấy danh sách tất cả permissions
     */
    getList: async (): Promise<ApiResponse<{ key: string; name: string; description: string }[]>> => {
      return PermissionService.getPermissions();
    },
  };
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances if needed
export { ApiClient };

// Export individual modules for convenience
export const { users: userApi, roles: roleApi, permissions: permissionApi } = apiClient;
