import { z } from 'zod';

/**
 * Validation Schemas - Các schema validation sử dụng Zod
 */

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .min(1, 'Email là bắt buộc')
  .email('Email không hợp lệ')
  .max(254, 'Email quá dài');

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(128, 'Mật khẩu quá dài')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số');

/**
 * Username validation schema
 */
const usernameSchema = z
  .string()
  .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
  .max(30, 'Tên đăng nhập quá dài')
  .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');

/**
 * Username or Email validation schema (for login)
 */
const usernameOrEmailSchema = z
  .string()
  .min(1, 'Tên đăng nhập hoặc email là bắt buộc')
  .refine(
    (value) => {
      // Check if it's a valid email or valid username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      return emailRegex.test(value) || (usernameRegex.test(value) && value.length >= 3);
    },
    'Phải là email hợp lệ hoặc tên đăng nhập (ít nhất 3 ký tự, chỉ chữ cái, số và dấu gạch dưới)'
  );

/**
 * Full name validation schema
 */
const fullNameSchema = z
  .string()
  .min(1, 'Họ tên là bắt buộc')
  .max(100, 'Họ tên quá dài')
  .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng');

/**
 * Login Schema
 */
export const loginSchema = z.object({
  username: usernameOrEmailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  rememberMe: z.boolean().optional(),
});

/**
 * Register Schema
 */
export const registerSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema,
  fullName: fullNameSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'Bạn phải đồng ý với điều khoản sử dụng'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  username: usernameOrEmailSchema,
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token là bắt buộc'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  fullName: fullNameSchema.optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional().or(z.literal('')),
});

/**
 * Update User Permissions Schema
 */
export const updateUserPermissionsSchema = z.object({
  userId: z.string().min(1, 'User ID là bắt buộc'),
  permissions: z.array(z.string()).min(0, 'Danh sách quyền không hợp lệ'),
});

/**
 * Update User Role Schema
 */
export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, 'User ID là bắt buộc'),
  roleId: z.string().min(1, 'Role ID là bắt buộc'),
});

/**
 * Create Role Schema
 */
export const createRoleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc').max(50, 'Tên vai trò quá dài'),
  description: z.string().max(255, 'Mô tả quá dài').optional(),
  permissions: z.array(z.string()).optional(),
});

/**
 * Update Role Schema
 */
export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc').max(50, 'Tên vai trò quá dài').optional(),
  description: z.string().max(255, 'Mô tả quá dài').optional(),
  permissions: z.array(z.string()).optional(),
});

/**
 * Email Verification Schema
 */
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Token xác thực là bắt buộc'),
});

/**
 * Resend Verification Schema
 */
export const resendVerificationSchema = z.object({
  username: usernameOrEmailSchema,
});

// Export các type được infer từ schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdateUserPermissionsFormData = z.infer<typeof updateUserPermissionsSchema>;
export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>;
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
