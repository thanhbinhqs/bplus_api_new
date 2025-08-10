import type { User, Role } from '../../types/user';
import { Permission } from '../../types/user';
import type { ApiResponse } from '../../types/response.dto';

/**
 * Mock API Service - Mô phỏng API calls, sẵn sàng thay thế bằng API thực
 */

// Helper function to generate mock users
function generateMockUsers(): User[] {
  const firstNames = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Tô', 'Lại', 'Đinh'
  ];
  
  const middleNames = [
    'Văn', 'Thị', 'Minh', 'Thanh', 'Hoàng', 'Xuân', 'Thu', 'Hạ', 'Đông', 'Nam',
    'Bắc', 'Tây', 'Đông', 'Quang', 'Hùng', 'Dũng', 'An', 'Bình', 'Cường', 'Đức'
  ];
  
  const lastNames = [
    'An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khánh', 'Long', 'Minh', 'Nam', 'Phúc',
    'Quân', 'Sơn', 'Tài', 'Thành', 'Tùng', 'Vinh', 'Xuân', 'Yên', 'Linh', 'Mai',
    'Hoa', 'Lan', 'Hương', 'Thảo', 'Trang', 'Hằng', 'Nga', 'Oanh', 'Phương', 'Quyên'
  ];

  const domains = ['company.com', 'business.vn', 'corp.com', 'enterprise.vn', 'tech.com', 'group.vn'];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin', 'Support'];
  
  const users: User[] = [];
  
  // Add the predefined users first
  const predefinedUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      username: 'admin',
      fullName: 'Quản trị viên hệ thống',
      avatar: '/avatars/admin.jpg',
      roles: mockRoles[0], // Admin role
      permissions: Object.values(Permission),
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    },
    {
      id: '2',
      email: 'manager@example.com',
      username: 'manager',
      fullName: 'Nguyễn Văn Quản lý',
      avatar: '/avatars/manager.jpg',
      roles: mockRoles[2], // Manager role
      permissions: mockRoles[2].permissions || [],
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      email: 'user@example.com',
      username: 'user',
      fullName: 'Trần Thị Người dùng',
      roles: mockRoles[1], // User role
      permissions: mockRoles[1].permissions || [],
      isActive: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];
  
  users.push(...predefinedUsers);
  
  // Generate additional users to reach 300 total
  for (let i = 4; i <= 300; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${middleName} ${lastName}`;
    
    const department = departments[Math.floor(Math.random() * departments.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const username = `${department.toLowerCase()}_${lastName.toLowerCase()}_${i}`;
    const email = `${username}@${domain}`;
    
    // Random role assignment with weights (more users get basic roles)
    let roleIndex: number;
    const rand = Math.random();
    if (rand < 0.6) {
      roleIndex = 1; // User role (60%)
    } else if (rand < 0.8) {
      roleIndex = 4; // Editor role (20%)
    } else if (rand < 0.9) {
      roleIndex = 3; // Moderator role (10%)
    } else if (rand < 0.95) {
      roleIndex = 7; // Support role (5%)
    } else if (rand < 0.98) {
      roleIndex = 2; // Manager role (3%)
    } else {
      roleIndex = 5; // HR Manager role (2%)
    }
    
    const role = mockRoles[roleIndex];
    
    // Random creation date in 2024
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const createdAt = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    // Random last login (within last 30 days for active users, older for inactive)
    const isActive = Math.random() > 0.05; // 95% active users
    const maxDaysAgo = isActive ? 30 : 90;
    const lastLoginAt = new Date(Date.now() - Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000);
    
    const user: User = {
      id: i.toString(),
      email,
      username,
      fullName,
      avatar: Math.random() > 0.7 ? `/avatars/${username}.jpg` : undefined, // 30% have avatars
      roles: role,
      permissions: role.permissions || [],
      isActive,
      createdAt,
      updatedAt: createdAt,
      lastLoginAt: isActive ? lastLoginAt : undefined
    };
    
    users.push(user);
  }
  
  return users;
}

// Mock roles data (need to define this before users)
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Toàn quyền hệ thống - có thể thực hiện mọi thao tác',
    permissions: Object.values(Permission)
  },
  {
    id: '2',
    name: 'User',
    description: 'Người dùng thông thường - quyền hạn cơ bản',
    permissions: [Permission.USER_READ, Permission.PERMISSION_READ]
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Quản lý nhân sự và hệ thống - quyền quản lý user và role',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_CREATE,
      Permission.USER_SET_ROLE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '4',
    name: 'Moderator',
    description: 'Điều hành nội dung - quyền xem và cập nhật thông tin user',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '5',
    name: 'Editor',
    description: 'Biên tập viên - quyền đọc thông tin cơ bản',
    permissions: [
      Permission.USER_READ,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '6',
    name: 'HR Manager',
    description: 'Quản lý nhân sự - quyền quản lý user và đặt mật khẩu',
    permissions: [
      Permission.USER_READ,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_SET_PASSWORD,
      Permission.USER_SET_ROLE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '7',
    name: 'Guest',
    description: 'Khách thăm quan - chỉ có thể xem permissions',
    permissions: [Permission.PERMISSION_READ]
  },
  {
    id: '8',
    name: 'Support',
    description: 'Hỗ trợ khách hàng - quyền xem và hỗ trợ user',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_SET_PASSWORD,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '9',
    name: 'Analyst',
    description: 'Chuyên viên phân tích - quyền xem dữ liệu để phân tích',
    permissions: [
      Permission.USER_READ,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '10',
    name: 'Intern',
    description: 'Thực tập sinh - quyền hạn tối thiểu',
    permissions: [Permission.PERMISSION_READ]
  },
  {
    id: '11',
    name: 'Developer',
    description: 'Lập trình viên - quyền quản lý role và permission',
    permissions: [
      Permission.USER_READ,
      Permission.ROLE_READ,
      Permission.ROLE_CREATE,
      Permission.ROLE_UPDATE,
      Permission.ROLE_SET_PERMISSIONS,
      Permission.PERMISSION_READ
    ]
  },
  {
    id: '12',
    name: 'Team Lead',
    description: 'Trưởng nhóm - quyền quản lý user trong team',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_CREATE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ]
  }
];

// Generate 300 mock users
const mockUsers: User[] = generateMockUsers();

// Log statistics about generated users
console.log(`🚀 Generated ${mockUsers.length} mock users:`);
console.log(`📊 Role distribution:`);
const roleStats = mockUsers.reduce((acc, user) => {
  acc[user.roles.name] = (acc[user.roles.name] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
Object.entries(roleStats).forEach(([role, count]) => {
  console.log(`   ${role}: ${count} users`);
});
console.log(`✅ Active users: ${mockUsers.filter(u => u.isActive).length}`);
console.log(`❌ Inactive users: ${mockUsers.filter(u => !u.isActive).length}`);

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * User API Functions
 */
export class UserAPI {
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    roleFilter?: string;
    statusFilter?: 'active' | 'inactive' | 'all';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ users: User[]; total: number; totalFiltered: number; stats?: any }>> {
    await delay();
    
    let filteredUsers = [...mockUsers];
    const originalTotal = filteredUsers.length;
    
    // Apply filters
    // 1. Search filter
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.fullName.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.roles.name.toLowerCase().includes(search)
      );
    }
    
    // 2. Role filter
    if (params?.roleFilter && params.roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.roles.name.toLowerCase() === params.roleFilter!.toLowerCase()
      );
    }
    
    // 3. Status filter
    if (params?.statusFilter && params.statusFilter !== 'all') {
      const isActive = params.statusFilter === 'active';
      filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
    }
    
    // 4. Date range filter
    if (params?.dateFrom) {
      const fromDate = new Date(params.dateFrom);
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.createdAt) >= fromDate
      );
    }
    
    if (params?.dateTo) {
      const toDate = new Date(params.dateTo);
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.createdAt) <= toDate
      );
    }
    
    const totalFiltered = filteredUsers.length;
    
    // Apply sorting
    const sortBy = params?.sortBy || 'fullName';
    const sortOrder = params?.sortOrder || 'asc';
    
    filteredUsers.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortBy) {
        case 'fullName':
          valueA = a.fullName.toLowerCase();
          valueB = b.fullName.toLowerCase();
          break;
        case 'username':
          valueA = a.username.toLowerCase();
          valueB = b.username.toLowerCase();
          break;
        case 'email':
          valueA = (a.email || '').toLowerCase();
          valueB = (b.email || '').toLowerCase();
          break;
        case 'roles':
          valueA = a.roles.name.toLowerCase();
          valueB = b.roles.name.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'lastLoginAt':
          valueA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
          valueB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
          break;
        case 'isActive':
          valueA = a.isActive ? 1 : 0;
          valueB = b.isActive ? 1 : 0;
          break;
        default:
          valueA = a.fullName.toLowerCase();
          valueB = b.fullName.toLowerCase();
      }
      
      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Generate stats
    const stats = {
      totalUsers: originalTotal,
      filteredUsers: totalFiltered,
      activeUsers: filteredUsers.filter(u => u.isActive).length,
      inactiveUsers: filteredUsers.filter(u => !u.isActive).length,
      roleDistribution: filteredUsers.reduce((acc, user) => {
        acc[user.roles.name] = (acc[user.roles.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      currentPage: page,
      totalPages: Math.ceil(totalFiltered / limit),
      pageSize: limit
    };
    
    return {
      success: true,
      data: {
        users: filteredUsers.slice(startIndex, endIndex),
        total: originalTotal,
        totalFiltered,
        stats
      },
      message: 'Users retrieved successfully'
    };
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    await delay();
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      data: user,
      message: 'User retrieved successfully'
    };
  }

  static async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    await delay();
    
    // Validate required fields
    if (!userData.username || !userData.fullName) {
      return {
        success: false,
        error: 'Username and full name are required'
      };
    }
    
    // Check if username already exists
    if (mockUsers.some(u => u.username === userData.username)) {
      return {
        success: false,
        error: 'Username already exists'
      };
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: userData.email,
      username: userData.username,
      fullName: userData.fullName,
      avatar: userData.avatar,
      roles: userData.roles || mockRoles.find(r => r.name === 'User') || mockRoles[1], // Default to User role
      permissions: userData.permissions || [Permission.USER_READ],
      isActive: userData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully'
    };
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    await delay();
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Check if new username already exists (if changing username)
    if (userData.username && userData.username !== mockUsers[userIndex].username) {
      if (mockUsers.some(u => u.username === userData.username && u.id !== id)) {
        return {
          success: false,
          error: 'Username already exists'
        };
      }
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    };
  }

  static async deleteUser(id: string): Promise<ApiResponse<null>> {
    await delay();
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Prevent deleting admin user
    if (mockUsers[userIndex].username === 'admin') {
      return {
        success: false,
        error: 'Cannot delete admin user'
      };
    }
    
    mockUsers.splice(userIndex, 1);
    
    return {
      success: true,
      data: null,
      message: 'User deleted successfully'
    };
  }

  static async setUserPassword(id: string, newPassword: string): Promise<ApiResponse<null>> {
    await delay();
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // In real implementation, hash the password
    // For mock, we just simulate success
    
    return {
      success: true,
      data: null,
      message: 'Password updated successfully'
    };
  }

  static async setUserRole(id: string, roleId: string): Promise<ApiResponse<User>> {
    await delay();
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    mockUsers[userIndex].roles = role;
    mockUsers[userIndex].permissions = role.permissions || [];
    mockUsers[userIndex].updatedAt = new Date();
    
    return {
      success: true,
      data: mockUsers[userIndex],
      message: 'User role updated successfully'
    };
  }

  static async setUserPermissions(id: string, permissions: string[]): Promise<ApiResponse<User>> {
    await delay();
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Validate permissions
    const validPermissions = Object.values(Permission);
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p as Permission));
    
    if (invalidPermissions.length > 0) {
      return {
        success: false,
        error: `Invalid permissions: ${invalidPermissions.join(', ')}`
      };
    }
    
    mockUsers[userIndex].permissions = permissions;
    mockUsers[userIndex].updatedAt = new Date();
    
    return {
      success: true,
      data: mockUsers[userIndex],
      message: 'User permissions updated successfully'
    };
  }
}

/**
 * Role API Functions
 */
export class RoleAPI {
  static async getRoles(): Promise<ApiResponse<Role[]>> {
    await delay();
    
    return {
      success: true,
      data: [...mockRoles],
      message: 'Roles retrieved successfully'
    };
  }

  static async getRoleById(id: string): Promise<ApiResponse<Role>> {
    await delay();
    
    const role = mockRoles.find(r => r.id === id);
    if (!role) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    return {
      success: true,
      data: role,
      message: 'Role retrieved successfully'
    };
  }

  static async createRole(roleData: Partial<Role>): Promise<ApiResponse<Role>> {
    await delay();
    
    if (!roleData.name) {
      return {
        success: false,
        error: 'Role name is required'
      };
    }
    
    // Check if role name already exists
    if (mockRoles.some(r => r.name === roleData.name)) {
      return {
        success: false,
        error: 'Role name already exists'
      };
    }
    
    const newRole: Role = {
      id: (mockRoles.length + 1).toString(),
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions || []
    };
    
    mockRoles.push(newRole);
    
    return {
      success: true,
      data: newRole,
      message: 'Role created successfully'
    };
  }

  static async updateRole(id: string, roleData: Partial<Role>): Promise<ApiResponse<Role>> {
    await delay();
    
    const roleIndex = mockRoles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    // Check if new name already exists (if changing name)
    if (roleData.name && roleData.name !== mockRoles[roleIndex].name) {
      if (mockRoles.some(r => r.name === roleData.name && r.id !== id)) {
        return {
          success: false,
          error: 'Role name already exists'
        };
      }
    }
    
    const updatedRole = {
      ...mockRoles[roleIndex],
      ...roleData,
      id // Ensure ID doesn't change
    };
    
    mockRoles[roleIndex] = updatedRole;
    
    // Update users with this role
    mockUsers.forEach(user => {
      if (user.roles.id === id) {
        user.roles = updatedRole;
        user.updatedAt = new Date();
      }
    });
    
    return {
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    };
  }

  static async deleteRole(id: string): Promise<ApiResponse<null>> {
    await delay();
    
    const roleIndex = mockRoles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    // Prevent deleting Admin role
    if (mockRoles[roleIndex].name === 'Admin') {
      return {
        success: false,
        error: 'Cannot delete Admin role'
      };
    }
    
    // Check if any users have this role
    const usersWithRole = mockUsers.filter(u => u.roles.id === id);
    if (usersWithRole.length > 0) {
      return {
        success: false,
        error: `Cannot delete role. ${usersWithRole.length} user(s) are assigned to this role.`
      };
    }
    
    mockRoles.splice(roleIndex, 1);
    
    return {
      success: true,
      data: null,
      message: 'Role deleted successfully'
    };
  }

  static async setRolePermissions(id: string, permissions: string[]): Promise<ApiResponse<Role>> {
    await delay();
    
    const roleIndex = mockRoles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    // Validate permissions
    const validPermissions = Object.values(Permission);
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p as Permission));
    
    if (invalidPermissions.length > 0) {
      return {
        success: false,
        error: `Invalid permissions: ${invalidPermissions.join(', ')}`
      };
    }
    
    mockRoles[roleIndex].permissions = permissions;
    
    // Update users with this role
    mockUsers.forEach(user => {
      if (user.roles.id === id) {
        user.roles.permissions = permissions;
        user.updatedAt = new Date();
      }
    });
    
    return {
      success: true,
      data: mockRoles[roleIndex],
      message: 'Role permissions updated successfully'
    };
  }
}

/**
 * Permission API Functions
 */
export class PermissionAPI {
  static async getPermissions(): Promise<ApiResponse<{ key: string; name: string; description: string }[]>> {
    await delay();
    
    const permissions = Object.values(Permission).map(permission => ({
      key: permission,
      name: permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: getPermissionDescription(permission)
    }));
    
    return {
      success: true,
      data: permissions,
      message: 'Permissions retrieved successfully'
    };
  }
}

// Helper function to get permission descriptions
function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    [Permission.USER_READ]: 'Xem thông tin người dùng',
    [Permission.USER_DELETE]: 'Xóa người dùng',
    [Permission.USER_UPDATE]: 'Cập nhật thông tin người dùng',
    [Permission.USER_CREATE]: 'Tạo người dùng mới',
    [Permission.USER_SET_PASSWORD]: 'Đặt lại mật khẩu người dùng',
    [Permission.USER_SET_ROLE]: 'Phân quyền vai trò cho người dùng',
    [Permission.USER_SET_PERMISSIONS]: 'Phân quyền chi tiết cho người dùng',
    [Permission.ROLE_READ]: 'Xem thông tin vai trò',
    [Permission.ROLE_DELETE]: 'Xóa vai trò',
    [Permission.ROLE_UPDATE]: 'Cập nhật thông tin vai trò',
    [Permission.ROLE_CREATE]: 'Tạo vai trò mới',
    [Permission.ROLE_SET_PERMISSIONS]: 'Phân quyền cho vai trò',
    [Permission.PERMISSION_READ]: 'Xem danh sách quyền hạn'
  };
  
  return descriptions[permission] || permission;
}
