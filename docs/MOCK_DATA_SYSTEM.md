# Mock Data System Documentation

## Tổng quan

Hệ thống Mock Data được thiết kế theo tiêu chuẩn enterprise với cấu trúc modular, type-safe và dễ bảo trì. Hệ thống này thay thế hoàn toàn các API routes thực và cung cấp dữ liệu giả lập đầy đủ chức năng.

## Cấu trúc thư mục

```
app/lib/mock/
├── data.ts          # Constants và cấu hình mock data
├── generators.ts    # Các hàm tạo dữ liệu giả
├── services.ts      # API services cho User, Role, Permission
└── index.ts         # Export chính của module
```

## Các tính năng chính

### 1. **Data Generation (Tạo dữ liệu)**
- ✅ Tạo 500 users với thông tin đa dạng
- ✅ Phân phối vai trò theo tỷ lệ thực tế
- ✅ Random nhưng consistent data
- ✅ Support tiếng Việt hoàn toàn

### 2. **User Management**
- ✅ CRUD operations đầy đủ
- ✅ Pagination với search, sort, filter
- ✅ Role assignment
- ✅ Permission management
- ✅ Password management

### 3. **Role Management**
- ✅ Hierarchical roles system
- ✅ Permission-based access control
- ✅ Color coding cho roles
- ✅ Protected system roles

### 4. **API Simulation**
- ✅ Realistic API delays (300ms)
- ✅ Error simulation (2% tỷ lệ lỗi)
- ✅ Consistent response format
- ✅ Full TypeScript support

## Cấu hình Mock Data

### Roles Distribution
```typescript
ROLE_DISTRIBUTION: {
  1: 0.01, // Super Admin: 1%
  2: 0.05, // Admin: 5%
  3: 0.10, // Manager: 10%
  4: 0.15, // Editor: 15%
  5: 0.65, // Viewer: 65%
  6: 0.04  // HR Manager: 4%
}
```

### Default Configuration
```typescript
MOCK_CONFIG: {
  TOTAL_USERS: 500,           // Tổng số users
  ACTIVE_USER_RATIO: 0.95,    // 95% users active
  AVATAR_RATIO: 0.3,          // 30% có avatar
  DATE_RANGE: {               // Ngày tạo tài khoản
    START: new Date('2024-01-01'),
    END: new Date('2024-12-31')
  }
}
```

## Cách sử dụng

### 1. **Import Services**
```typescript
import { UserService, RoleService, PermissionService } from '@/lib/mock';
```

### 2. **Sử dụng qua API Client (Recommended)**
```typescript
import { userApi, roleApi, permissionApi } from '@/lib/api/client';

// Lấy danh sách users với filter
const result = await userApi.getList({
  page: 1,
  limit: 10,
  search: 'Nguyễn',
  roleFilter: '2',
  statusFilter: 'active'
});
```

### 3. **Direct Service Usage**
```typescript
// Tạo user mới
const newUser = await UserService.createUser({
  username: 'newuser',
  fullName: 'Nguyễn Văn Mới',
  email: 'newuser@company.com',
  roles: mockRoles[4] // Viewer role
});

// Cập nhật role
await UserService.setUserRole('1', '2');
```

## API Methods Available

### UserService
- `getUsers(params)` - Lấy danh sách với filter/pagination
- `getUserById(id)` - Lấy user theo ID
- `createUser(userData)` - Tạo user mới
- `updateUser(id, userData)` - Cập nhật user
- `deleteUser(id)` - Xóa user
- `setUserPassword(id, password)` - Đặt mật khẩu
- `setUserRole(id, roleId)` - Gán role
- `setUserPermissions(id, permissions)` - Gán permissions

### RoleService
- `getRoles()` - Lấy tất cả roles
- `getRoleById(id)` - Lấy role theo ID
- `createRole(roleData)` - Tạo role mới
- `updateRole(id, roleData)` - Cập nhật role
- `deleteRole(id)` - Xóa role
- `setRolePermissions(id, permissions)` - Gán permissions cho role

### PermissionService
- `getPermissions()` - Lấy tất cả permissions với descriptions

## Response Format

Tất cả API methods trả về consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Success response
{
  success: true,
  data: { /* actual data */ }
}

// Error response
{
  success: false,
  error: "Error message"
}
```

## Pre-defined Data

### Admin Users
- `admin@company.com` - Super Admin
- `manager@company.com` - Admin  
- `hr@company.com` - HR Manager

### Available Roles
1. **Super Admin** - Toàn quyền hệ thống
2. **Admin** - Quản trị viên
3. **Manager** - Quản lý
4. **Editor** - Biên tập viên
5. **Viewer** - Người xem
6. **HR Manager** - Quản lý nhân sự

### Permissions
- `user_*` - User management permissions
- `role_*` - Role management permissions  
- `permission_read` - View permissions

## Error Handling

Hệ thống simulation các lỗi phổ biến:
- **Network errors** (2% probability)
- **Validation errors** (duplicate username/email)
- **Authorization errors** (protected operations)
- **Not found errors** (invalid IDs)

## Performance Features

- ✅ **Realistic delays** - 300ms average response time
- ✅ **Efficient filtering** - Client-side filtering với full-text search
- ✅ **Memory optimization** - Shared data references
- ✅ **Type safety** - Full TypeScript support

## Migration từ API Routes

Việc migration đã được thực hiện tự động:
1. ✅ Xóa `/app/routes/api/` folder
2. ✅ Cập nhật `routes.ts`
3. ✅ Thay thế `client.ts` để sử dụng Mock Services
4. ✅ Giữ nguyên interface để không breaking changes

## Development Notes

- Mock data được generate một lần khi khởi động
- Data persist trong memory session hiện tại
- Restart application để reset data
- Use `resetMockData()` function để regenerate data programmatically

## Future Enhancements

- [ ] Data persistence với localStorage
- [ ] Export/Import mock data sets
- [ ] Advanced search with Elasticsearch-like queries
- [ ] Real-time updates simulation
- [ ] Bulk operations support
