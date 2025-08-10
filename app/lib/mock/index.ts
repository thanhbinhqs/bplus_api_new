/**
 * Mock API Module
 * Export tất cả các service và utility functions
 */

// Export services
export { UserService, RoleService, PermissionService } from './services';

// Export data and generators
export { 
  MOCK_SEED, 
  MOCK_ROLES, 
  ADMIN_USERS, 
  MOCK_CONFIG 
} from './data';

export { 
  generateMockUser, 
  generateMockUsers, 
  getMockRoles, 
  getMockPermissions, 
  resetMockData 
} from './generators';

// Legacy exports for compatibility with existing code
export { UserService as UserAPI } from './services';
export { RoleService as RoleAPI } from './services';
export { PermissionService as PermissionAPI } from './services';
