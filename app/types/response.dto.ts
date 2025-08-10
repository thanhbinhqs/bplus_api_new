import type { User, UserToken, Role } from './user';

/**
 * Response DTOs - Các cấu trúc dữ liệu trả về từ API
 */

/**
 * Base API Response - Cấu trúc cơ bản cho mọi API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Pagination Info - Thông tin phân trang
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated Response - Response với phân trang
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * Auth Response - Response cho authentication
 */
export interface AuthResponse {
  user: User;
  userToken: UserToken;
}

/**
 * Login Response - Response cho đăng nhập
 */
export interface LoginResponse extends ApiResponse<AuthResponse> {}

/**
 * Register Response - Response cho đăng ký
 */
export interface RegisterResponse extends ApiResponse<{
  user: User;
  message: string;
  verificationRequired: boolean;
}> {}

/**
 * Profile Response - Response cho thông tin profile
 */
export interface ProfileResponse extends ApiResponse<User> {}

/**
 * User List Response - Response cho danh sách user (admin)
 */
export interface UserListResponse extends PaginatedResponse<User> {}

/**
 * Role List Response - Response cho danh sách roles
 */
export interface RoleListResponse extends PaginatedResponse<Role> {}

/**
 * Role Response - Response cho thông tin role
 */
export interface RoleResponse extends ApiResponse<Role> {}

/**
 * Permissions Response - Response cho danh sách permissions
 */
export interface PermissionsResponse extends ApiResponse<string[]> {}

/**
 * Validation Error Response - Lỗi validation
 */
export interface ValidationErrorResponse extends ApiResponse {
  success: false;
  errors: Record<string, string[]>;
}

/**
 * Success Message Response - Response chỉ trả về thông báo thành công
 */
export interface SuccessMessageResponse extends ApiResponse<null> {
  success: true;
  message: string;
}

/**
 * Error Response - Response cho lỗi
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}
