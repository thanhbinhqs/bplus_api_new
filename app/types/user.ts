/**
 * User Interface - Định nghĩa cấu trúc dữ liệu người dùng
 */
export interface User {
  id: string;
  email?: string;
  username: string;
  fullName: string;
  avatar?: string;
  roles: Role;
  permissions?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * User Role Enum - Vai trò người dùng
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface UserToken {
    id: string;
    username: string;
    token: string;
    expiresAt: Date;
}

export enum Permission {
    USER_READ = 'user_read',
    USER_DELETE = 'user_delete',
    USER_UPDATE = 'user_update',
    USER_CREATE = 'user_create',
    USER_SET_PASSWORD = 'user_set_password',
    USER_SET_ROLE = 'user_set_role',
    USER_SET_PERMISSIONS = 'user_set_permissions',

    // Role Permissions
    ROLE_READ = 'role_read',
    ROLE_DELETE = 'role_delete',
    ROLE_UPDATE = 'role_update',
    ROLE_CREATE = 'role_create',
    ROLE_SET_PERMISSIONS = 'role_set_permissions',

    //Permisions
    PERMISSION_READ = 'permission_read',
}