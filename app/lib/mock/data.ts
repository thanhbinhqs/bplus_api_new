import type { User, Role } from '../../types/user';
import { Permission } from '../../types/user';

/**
 * Mock data constants and generators
 * Chứa dữ liệu mẫu và các hàm tạo dữ liệu giả
 */

// Seed data for consistent mock generation
export const MOCK_SEED = {
  FIRST_NAMES: [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Tô', 'Lại', 'Đinh'
  ],
  
  MIDDLE_NAMES: [
    'Văn', 'Thị', 'Minh', 'Thanh', 'Hoàng', 'Xuân', 'Thu', 'Hạ', 'Đông', 'Nam',
    'Bắc', 'Tây', 'Đông', 'Quang', 'Hùng', 'Dũng', 'An', 'Bình', 'Cường', 'Đức'
  ],
  
  LAST_NAMES: [
    'An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khánh', 'Long', 'Minh', 'Nam', 'Phúc',
    'Quân', 'Sơn', 'Tài', 'Thành', 'Tùng', 'Vinh', 'Xuân', 'Yên', 'Linh', 'Mai',
    'Hoa', 'Lan', 'Hương', 'Thảo', 'Trang', 'Hằng', 'Nga', 'Oanh', 'Phương', 'Quyên'
  ],
  
  EMAIL_DOMAINS: [
    'company.com', 'business.vn', 'corp.com', 'enterprise.vn', 'tech.com', 'group.vn'
  ],
  
  DEPARTMENTS: [
    'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin', 'Support'
  ]
};

// Mock roles with proper permissions
export const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Toàn quyền hệ thống - có thể thực hiện mọi thao tác',
    permissions: Object.values(Permission),
    color: '#dc2626', // red-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Quản trị viên - có quyền quản lý người dùng và vai trò',
    permissions: [
      Permission.USER_READ,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.ROLE_READ,
      Permission.ROLE_CREATE,
      Permission.ROLE_UPDATE,
      Permission.PERMISSION_READ
    ],
    color: '#ea580c', // orange-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Quản lý - có quyền xem và cập nhật thông tin người dùng',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ],
    color: '#2563eb', // blue-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Editor',
    description: 'Biên tập viên - có quyền chỉnh sửa nội dung',
    permissions: [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.PERMISSION_READ
    ],
    color: '#16a34a', // green-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Người xem - chỉ có quyền xem thông tin cơ bản',
    permissions: [
      Permission.USER_READ,
      Permission.PERMISSION_READ
    ],
    color: '#7c3aed', // violet-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'HR Manager',
    description: 'Quản lý nhân sự - có quyền quản lý thông tin nhân viên',
    permissions: [
      Permission.USER_READ,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.ROLE_READ,
      Permission.PERMISSION_READ
    ],
    color: '#db2777', // pink-600
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Predefined admin users
export const ADMIN_USERS: Partial<User>[] = [
  {
    id: '1',
    email: 'admin@company.com',
    username: 'admin',
    fullName: 'Quản trị viên hệ thống',
    avatar: '/avatars/admin.jpg',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date()
  },
  {
    id: '2',
    email: 'manager@company.com',
    username: 'manager',
    fullName: 'Nguyễn Văn Quản',
    avatar: '/avatars/manager.jpg',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '3',
    email: 'hr@company.com',
    username: 'hr_manager',
    fullName: 'Trần Thị Nhân',
    avatar: '/avatars/hr.jpg',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
];

// Configuration for mock data generation
export const MOCK_CONFIG = {
  TOTAL_USERS: 500,
  ACTIVE_USER_RATIO: 0.95, // 95% active users
  AVATAR_RATIO: 0.3, // 30% have avatars
  ROLE_DISTRIBUTION: {
    1: 0.01, // Super Admin: 1%
    2: 0.05, // Admin: 5%
    3: 0.10, // Manager: 10%
    4: 0.15, // Editor: 15%
    5: 0.65, // Viewer: 65%
    6: 0.04  // HR Manager: 4%
  },
  DATE_RANGE: {
    START: new Date('2024-01-01'),
    END: new Date('2024-12-31')
  }
};
