import type { User, Role } from '../../types/user';
import { Permission } from '../../types/user';
import { MOCK_SEED, MOCK_ROLES, ADMIN_USERS, MOCK_CONFIG } from './data';

/**
 * Mock data generators
 * Chứa các hàm tạo dữ liệu giả một cách có hệ thống
 */

// Utility functions
const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateUsername = (fullName: string): string => {
  const parts = fullName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .split(' ');
  
  const firstName = parts[parts.length - 1];
  const lastName = parts[0];
  const middle = parts.length > 2 ? parts[1].charAt(0) : '';
  
  return `${firstName}${middle}${lastName}`.replace(/\s+/g, '');
};

const generateEmail = (username: string): string => {
  const domain = randomChoice(MOCK_SEED.EMAIL_DOMAINS);
  return `${username}@${domain}`;
};

const selectRoleByDistribution = (): Role => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const [roleId, probability] of Object.entries(MOCK_CONFIG.ROLE_DISTRIBUTION)) {
    cumulativeProbability += probability;
    if (random <= cumulativeProbability) {
      return MOCK_ROLES.find(role => role.id === roleId) || MOCK_ROLES[4]; // Default to Viewer
    }
  }
  
  return MOCK_ROLES[4]; // Default to Viewer
};

/**
 * Generate a single mock user
 */
export const generateMockUser = (id: number): User => {
  // Check if this should be a predefined admin user
  const adminUser = ADMIN_USERS.find(admin => admin.id === id.toString());
  if (adminUser) {
    const role = MOCK_ROLES.find(r => r.id === (id <= 2 ? '1' : id === 3 ? '6' : '2')) || MOCK_ROLES[0];
    return {
      ...adminUser,
      roles: role,
      permissions: role.permissions || []
    } as User;
  }

  // Generate random user
  const firstName = randomChoice(MOCK_SEED.FIRST_NAMES);
  const middleName = randomChoice(MOCK_SEED.MIDDLE_NAMES);
  const lastName = randomChoice(MOCK_SEED.LAST_NAMES);
  const fullName = `${firstName} ${middleName} ${lastName}`;
  const username = generateUsername(fullName);
  const email = generateEmail(username);
  
  const role = selectRoleByDistribution();
  const isActive = Math.random() < MOCK_CONFIG.ACTIVE_USER_RATIO;
  const hasAvatar = Math.random() < MOCK_CONFIG.AVATAR_RATIO;
  
  const createdAt = randomDate(MOCK_CONFIG.DATE_RANGE.START, MOCK_CONFIG.DATE_RANGE.END);
  const updatedAt = new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()));
  
  // Generate last login date
  let lastLoginAt: Date | undefined;
  if (isActive) {
    const maxDaysAgo = 30;
    lastLoginAt = new Date(Date.now() - Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000);
  } else {
    // Inactive users have older last login dates
    const minDaysAgo = 60;
    const maxDaysAgo = 180;
    lastLoginAt = new Date(Date.now() - (minDaysAgo + Math.random() * (maxDaysAgo - minDaysAgo)) * 24 * 60 * 60 * 1000);
  }
  
  return {
    id: id.toString(),
    email,
    username,
    fullName,
    avatar: hasAvatar ? `/avatars/${username}.jpg` : undefined,
    roles: role,
    permissions: role.permissions || [],
    isActive,
    createdAt,
    updatedAt,
    lastLoginAt: isActive ? lastLoginAt : undefined
  };
};

/**
 * Generate array of mock users
 */
export const generateMockUsers = (count: number = MOCK_CONFIG.TOTAL_USERS): User[] => {
  const users: User[] = [];
  
  for (let i = 1; i <= count; i++) {
    users.push(generateMockUser(i));
  }
  
  return users;
};

/**
 * Get all mock roles
 */
export const getMockRoles = (): Role[] => {
  return [...MOCK_ROLES];
};

/**
 * Get mock permissions with descriptions
 */
export const getMockPermissions = (): { key: string; name: string; description: string }[] => {
  const permissionDescriptions: Record<string, string> = {
    [Permission.USER_READ]: 'Xem thông tin người dùng',
    [Permission.USER_CREATE]: 'Tạo người dùng mới',
    [Permission.USER_UPDATE]: 'Cập nhật thông tin người dùng',
    [Permission.USER_DELETE]: 'Xóa người dùng',
    [Permission.USER_SET_PASSWORD]: 'Đặt lại mật khẩu người dùng',
    [Permission.USER_SET_ROLE]: 'Phân quyền vai trò cho người dùng',
    [Permission.USER_SET_PERMISSIONS]: 'Phân quyền cụ thể cho người dùng',
    [Permission.ROLE_READ]: 'Xem danh sách vai trò',
    [Permission.ROLE_CREATE]: 'Tạo vai trò mới',
    [Permission.ROLE_UPDATE]: 'Cập nhật thông tin vai trò',
    [Permission.ROLE_DELETE]: 'Xóa vai trò',
    [Permission.ROLE_SET_PERMISSIONS]: 'Phân quyền cho vai trò',
    [Permission.PERMISSION_READ]: 'Xem danh sách quyền hạn'
  };
  
  return Object.values(Permission).map(permission => ({
    key: permission,
    name: permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: permissionDescriptions[permission] || permission
  }));
};

/**
 * Reset and regenerate all mock data
 */
export const resetMockData = (): { users: User[]; roles: Role[] } => {
  const users = generateMockUsers();
  const roles = getMockRoles();
  
  console.log(`🔄 Mock data reset - Generated ${users.length} users and ${roles.length} roles`);
  console.log(`✅ Active users: ${users.filter(u => u.isActive).length}`);
  console.log(`❌ Inactive users: ${users.filter(u => !u.isActive).length}`);
  
  return { users, roles };
};
