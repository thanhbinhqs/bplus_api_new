import { useEffect, useRef, type ReactNode } from "react";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
}

interface GenericContextMenuProps<T = any> {
  item: T;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  onAction: (actionId: string, item: T) => void;
  className?: string;
}

export function GenericContextMenu<T>({ 
  item, 
  position, 
  items, 
  onClose, 
  onAction,
  className = "" 
}: GenericContextMenuProps<T>) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu would go off screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust horizontal position
      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      // Adjust vertical position
      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${Math.max(10, adjustedX)}px`;
      menuRef.current.style.top = `${Math.max(10, adjustedY)}px`;
    }
  }, [position]);

  const handleItemClick = (menuItem: ContextMenuItem) => {
    if (menuItem.disabled) return;
    onAction(menuItem.id, item);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48 ${className}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {items.map((menuItem, index) => (
        <div key={menuItem.id}>
          {menuItem.separator && index > 0 && (
            <div className="border-t border-gray-100 my-1" />
          )}
          <button
            onClick={() => handleItemClick(menuItem)}
            disabled={menuItem.disabled}
            className={`
              w-full px-4 py-2 text-left text-sm flex items-center space-x-3
              transition-colors duration-150
              ${menuItem.disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : menuItem.danger
                  ? 'text-red-700 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }
              ${menuItem.className || ''}
            `}
          >
            {menuItem.icon && (
              <span className="flex-shrink-0">
                {menuItem.icon}
              </span>
            )}
            <span className="flex-1">{menuItem.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
