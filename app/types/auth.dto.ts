/**
 * Authentication DTOs - Các Data Transfer Objects cho xác thực
 */

/**
 * Login DTO - Dữ liệu đăng nhập
 */
export interface LoginDto {
  username: string; // Có thể là username hoặc email
  password: string;
  rememberMe?: boolean;
}

/**
 * Register DTO - Dữ liệu đăng ký tài khoản
 */
export interface RegisterDto {
  email?: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * Forgot Password DTO - Yêu cầu quên mật khẩu
 */
export interface ForgotPasswordDto {
  username: string; // Có thể là username hoặc email
}

/**
 * Reset Password DTO - Đặt lại mật khẩu
 */
export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Change Password DTO - Thay đổi mật khẩu
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Email Verification DTO - Xác thực email
 */
export interface EmailVerificationDto {
  token: string;
}

/**
 * Resend Verification DTO - Gửi lại email xác thực
 */
export interface ResendVerificationDto {
  username: string; // Có thể là username hoặc email
}

/**
 * Update Profile DTO - Cập nhật thông tin cá nhân
 */
export interface UpdateProfileDto {
  email?: string;
  username?: string;
  fullName?: string;
  avatar?: string;
}

/**
 * Update User Permissions DTO - Cập nhật quyền người dùng (Admin only)
 */
export interface UpdateUserPermissionsDto {
  userId: string;
  permissions: string[];
}

/**
 * Update User Role DTO - Cập nhật vai trò người dùng (Admin only)
 */
export interface UpdateUserRoleDto {
  userId: string;
  roleId: string;
}

/**
 * Create Role DTO - Tạo vai trò mới
 */
export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions?: string[];
}

/**
 * Update Role DTO - Cập nhật vai trò
 */
export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}
