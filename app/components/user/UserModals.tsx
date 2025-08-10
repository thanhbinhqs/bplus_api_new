import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button, Checkbox } from "../ui";
import { X, Eye, EyeOff, Save, Settings, Trash2, RotateCcw, UserCheck } from "lucide-react";
import type { User } from "../../types/user";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  children: React.ReactNode;
  title: string;
  description?: string;
}

function Modal({ isOpen, onClose, children, title, description }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// View User Modal
interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết người dùng"
      description="Thông tin chi tiết của người dùng"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Họ và tên</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">{user.fullName}</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Username</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm font-mono">{user.username}</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">{user.email || 'Chưa có email'}</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vai trò</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.roles.name}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Trạng thái</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ngày tạo</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {new Date(user.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Lần đăng nhập cuối</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </Modal>
  );
}

// Edit User Modal
interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa người dùng"
      description="Cập nhật thông tin người dùng"
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="action" value="edit" />
        <input type="hidden" name="userId" value={user.id} />
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={user.fullName}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={user.username}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email || ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <select
            id="role"
            name="role"
            defaultValue={user.roles.name}
            className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
            <option value="Moderator">Moderator</option>
            <option value="Editor">Editor</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Support">Support</option>
            <option value="Analyst">Analyst</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isActive"
            name="isActive"
            defaultChecked={user.isActive}
          />
          <Label htmlFor="isActive">Tài khoản hoạt động</Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

// Delete User Modal
interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa người dùng"
      description="Hành động này không thể hoàn tác"
    >
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Xác nhận xóa</h4>
              <p className="text-sm text-red-600 mt-1">
                Bạn có chắc chắn muốn xóa người dùng <strong>{user.fullName}</strong> (@{user.username})?
                Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </div>
        </div>
        
        <Form method="post" className="flex justify-end space-x-2">
          <input type="hidden" name="action" value="delete" />
          <input type="hidden" name="userId" value={user.id} />
          
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="destructive" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa người dùng
              </>
            )}
          </Button>
        </Form>
      </div>
    </Modal>
  );
}

// Reset Password Modal
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ResetPasswordModal({ isOpen, onClose, user }: ResetPasswordModalProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đặt lại mật khẩu"
      description={`Tạo mật khẩu mới cho ${user.fullName}`}
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="action" value="resetPassword" />
        <input type="hidden" name="userId" value={user.id} />
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <RotateCcw className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Lưu ý</h4>
              <p className="text-sm text-yellow-600 mt-1">
                Người dùng sẽ cần đăng nhập lại với mật khẩu mới. 
                Hãy thông báo mật khẩu mới cho họ một cách an toàn.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="sendEmail" name="sendEmail" />
          <Label htmlFor="sendEmail" className="text-sm">
            Gửi mật khẩu mới qua email (nếu có)
          </Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đặt lại...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại mật khẩu
              </>
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
