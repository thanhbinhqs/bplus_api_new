import { 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  Eye, 
  UserCheck,
  UserX,
  RotateCcw,
  Copy
} from "lucide-react";
import { GenericContextMenu, type ContextMenuItem } from "./generic";
import type { User } from "../types/user";

interface UserContextMenuProps {
  user: User;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string, user: User) => void;
}

export function UserContextMenu({ user, position, onClose, onAction }: UserContextMenuProps) {
  
  const menuItems: ContextMenuItem[] = [
    {
      id: 'view',
      label: 'Xem chi tiết',
      icon: <Eye className="h-4 w-4" />
    },
    {
      id: 'edit',
      label: 'Chỉnh sửa',
      icon: <Edit className="h-4 w-4" />
    },
    {
      id: 'separator1',
      label: '',
      separator: true
    },
    {
      id: user.isActive ? 'deactivate' : 'activate',
      label: user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt',
      icon: user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />
    },
    {
      id: 'resetPassword',
      label: 'Đặt lại mật khẩu',
      icon: <RotateCcw className="h-4 w-4" />
    },
    {
      id: 'separator2',
      label: '',
      separator: true
    },
    {
      id: 'copyId',
      label: 'Sao chép ID',
      icon: <Copy className="h-4 w-4" />
    },
    {
      id: 'copyUsername',
      label: 'Sao chép Username',
      icon: <Copy className="h-4 w-4" />
    },
    {
      id: 'separator3',
      label: '',
      separator: true
    },
    {
      id: 'delete',
      label: 'Xóa người dùng',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true
    }
  ];

  return (
    <GenericContextMenu
      item={user}
      position={position}
      items={menuItems}
      onClose={onClose}
      onAction={onAction}
    />
  );
}
