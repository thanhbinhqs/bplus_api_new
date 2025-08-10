# User Interfaces và Authentication DTOs

Thư viện các interface và DTO cho quản lý người dùng và xác thực trong ứng dụng Remix.

## Cấu trúc thư mục

```
app/
├── types/
│   ├── index.ts              # Export tất cả types
│   ├── user.ts               # User interfaces, Role, UserToken, Permission enum
│   ├── auth.dto.ts           # Authentication DTOs
│   └── response.dto.ts       # API Response DTOs
├── lib/
│   ├── validations.ts        # Zod validation schemas
│   └── utils.ts              # Utility functions
└── routes/
    ├── login.tsx             # Example login route
    └── admin.roles.tsx       # Example roles management route
```

## Các Interface chính

### User Interface
```typescript
interface User {
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
```

### Role Interface
```typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}
```

### UserToken Interface
```typescript
interface UserToken {
  id: string;
  username: string;
  token: string;
  expiresAt: Date;
}
```

### Permission Enum
```typescript
enum Permission {
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
  // Permissions
  PERMISSION_READ = 'permission_read',
}
```

### Authentication DTOs
- `LoginDto` - Dữ liệu đăng nhập (username có thể là username hoặc email)
- `RegisterDto` - Dữ liệu đăng ký (với fullName thay vì firstName/lastName)
- `ForgotPasswordDto` - Yêu cầu quên mật khẩu
- `ResetPasswordDto` - Đặt lại mật khẩu
- `ChangePasswordDto` - Thay đổi mật khẩu
- `UpdateProfileDto` - Cập nhật thông tin cá nhân
- `UpdateUserPermissionsDto` - Cập nhật quyền người dùng
- `UpdateUserRoleDto` - Cập nhật vai trò người dùng
- `CreateRoleDto` - Tạo vai trò mới
- `UpdateRoleDto` - Cập nhật vai trò

### Response DTOs
- `ApiResponse<T>` - Cấu trúc response cơ bản
- `AuthResponse` - Response cho authentication (chứa User và UserToken)
- `PaginatedResponse<T>` - Response với phân trang
- `RoleListResponse` - Response cho danh sách roles
- `PermissionsResponse` - Response cho danh sách permissions

## Validation Schemas

Sử dụng Zod để validate dữ liệu:

```typescript
import { loginSchema, registerSchema, createRoleSchema } from '../lib/validations';

// Validate form data
const validation = await validateFormData(request, loginSchema);
if (!validation.success) {
  return validationErrorResponse(validation.errors);
}
```

### Các Schema có sẵn:
- `loginSchema` - Validate đăng nhập (username/email + password)
- `registerSchema` - Validate đăng ký (username, fullName, password)
- `updateProfileSchema` - Validate cập nhật profile
- `createRoleSchema` - Validate tạo role mới
- `updateRoleSchema` - Validate cập nhật role
- `updateUserPermissionsSchema` - Validate cập nhật quyền user
- `updateUserRoleSchema` - Validate cập nhật role của user

## Sử dụng trong Route

### Login Action
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const validation = await validateFormData(request, loginSchema);
  
  if (!validation.success) {
    return validationErrorResponse(validation.errors);
  }
  
  const { username, password } = validation.data; // username có thể là email
  
  try {
    const result = await authenticateUser(username, password);
    
    if (result.success) {
      return successResponse(result, 'Đăng nhập thành công');
    } else {
      return errorResponse('Thông tin đăng nhập không đúng', 401);
    }
  } catch (error) {
    return errorResponse('Có lỗi xảy ra');
  }
}
```

### Roles Management Action
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  
  if (intent === 'create') {
    const validation = await validateFormData(request, createRoleSchema);
    
    if (!validation.success) {
      return validationErrorResponse(validation.errors);
    }
    
    const { name, description, permissions } = validation.data;
    const newRole = await createRole(name, description, permissions);
    return successResponse(newRole, 'Tạo vai trò thành công');
  }
}
```

## Thay đổi chính từ phiên bản trước

### 1. User Interface
- ✅ Thay đổi `firstName`, `lastName` thành `fullName`
- ✅ Thay đổi `role: UserRole` thành `roles: Role`
- ✅ Thêm `permissions?: string[]`
- ✅ `email` trở thành optional

### 2. Authentication
- ✅ Login sử dụng `username` thay vì `email` (có thể nhập email hoặc username)
- ✅ Register sử dụng `fullName` thay vì `firstName`, `lastName`
- ✅ Thêm các DTO cho quản lý roles và permissions

### 3. Permission System
- ✅ Thêm `Permission` enum với các quyền chi tiết
- ✅ Thêm `Role` interface để quản lý vai trò
- ✅ Thêm `UserToken` interface cho authentication token

### 4. Validation
- ✅ Cập nhật schemas để hỗ trợ login bằng username hoặc email
- ✅ Thêm validation cho role management
- ✅ Cập nhật tất cả schemas theo cấu trúc mới

## Utility Functions

### validateFormData
Validate dữ liệu form với Zod schema:
```typescript
const validation = await validateFormData(request, loginSchema);
```

### Response Helpers
```typescript
// Success response
return successResponse(data, 'Thành công');

// Error response
return errorResponse('Có lỗi xảy ra', 500);

// Validation error response
return validationErrorResponse(errors, 400);
```

## Examples

Xem các file example:
- `app/routes/login.tsx` - Đăng nhập với username/email
- `app/routes/admin.roles.tsx` - Quản lý roles và permissions

## Installation

Dependencies đã được cài đặt:
- `zod` - Schema validation
- `@types/node` - Node.js types
- `typescript` - TypeScript support

Các file đã được cập nhật hoàn toàn theo cấu trúc User mới với hệ thống roles và permissions chi tiết.
