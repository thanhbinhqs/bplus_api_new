import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useSubmit } from "react-router";
import { toast } from "sonner";
import type { BaseFilters, BaseActionData } from "../components/layout";

// Helper functions
const saveUserSettings = (key: string, settings: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(settings));
  }
};

const loadUserSettings = (key: string): any => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const settings = localStorage.getItem(key);
    return settings ? JSON.parse(settings) : null;
  }
  return null;
};

interface UseTableDataLayoutProps {
  filters: BaseFilters;
  actionData?: BaseActionData;
  settingsKey: string;
  clearFilterParams?: string[];
}

export function useTableDataLayout<T extends { id: string }>({
  filters,
  actionData,
  settingsKey,
  clearFilterParams = ['search', 'sortBy', 'sortOrder']
}: UseTableDataLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Column settings
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnStickyState, setColumnStickyState] = useState<Record<string, 'left' | 'right' | 'none'>>({});
  
  const settingsHydratedRef = useRef(false);

  // Context menu and modals state
  const [contextMenu, setContextMenu] = useState<{
    selectedItem: T;
    position: { x: number; y: number };
  } | null>(null);
  
  const [modals, setModals] = useState<Record<string, T | null>>({});

  // Hydrate settings from localStorage
  useEffect(() => {
    const savedSettings = loadUserSettings(settingsKey);
    if (savedSettings) {
      setColumnVisibility(savedSettings.columnVisibility || {});
      setColumnStickyState(savedSettings.columnStickyState || {});
    }
    settingsHydratedRef.current = true;
  }, [settingsKey]);

  // Save settings
  useEffect(() => {
    if (!settingsHydratedRef.current) return;
    saveUserSettings(settingsKey, { columnVisibility, columnStickyState });
  }, [columnVisibility, columnStickyState, settingsKey]);

  // Update applied filters when filters change
  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

  // Show action messages
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message);
      } else {
        toast.error(actionData.message);
      }
    }
  }, [actionData]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  // Handlers
  const updateFilters = useCallback((newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    clearFilterParams.forEach(key => {
      params.delete(key);
    });
    
    // Set new filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== 'all' && value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          params.set(key, String(value));
        } else if (value !== false) {
          params.set(key, String(value));
        }
      }
    });
    
    params.set('page', '1');
    setAppliedFilters(newFilters);
    setSearchParams(params);
  }, [searchParams, setSearchParams, clearFilterParams]);

  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortOrder', direction);
    params.set('page', '1');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleColumnVisibilityChange = useCallback((columnKey: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnKey]: visible }));
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumnVisibility({});
  }, []);

  const handleColumnStickyChange = useCallback((columnKey: string, sticky: 'left' | 'right' | 'none') => {
    setColumnStickyState(prev => ({ ...prev, [columnKey]: sticky }));
  }, []);

  const handleRowContextMenu = useCallback((item: T, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      selectedItem: item,
      position: { x: event.clientX, y: event.clientY }
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleContextAction = useCallback((actionType: string, item: T) => {
    switch (actionType) {
      case 'copyId':
        navigator.clipboard.writeText(item.id);
        toast.success('Đã copy ID');
        break;
      default:
        // Handle other actions or let parent handle them
        break;
    }
    closeContextMenu();
  }, [closeContextMenu]);

  const openModal = useCallback((modalType: string, item: T | null) => {
    setModals(prev => ({ ...prev, [modalType]: item }));
  }, []);

  const closeModal = useCallback((modalType: string) => {
    setModals(prev => ({ ...prev, [modalType]: null }));
  }, []);

  const submitAction = useCallback((actionType: string, item: T, extraData?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('action', actionType);
    formData.append('itemId', item.id);
    
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    submit(formData, { method: 'post' });
  }, [submit]);

  // Check if there are active filters
  const hasActiveFilters = Object.entries(appliedFilters).some(([key, value]) => {
    if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
    if (key === 'search') return value !== '';
    if (typeof value === 'string' && (value === 'all' || value === '')) return false;
    if (typeof value === 'boolean' && value === true) return false;
    return true;
  });

  return {
    // State
    isMobile,
    sidebarCollapsed,
    setSidebarCollapsed,
    appliedFilters,
    columnVisibility,
    columnStickyState,
    contextMenu,
    modals,
    hasActiveFilters,
    
    // Handlers
    updateFilters,
    handleSearch,
    handleSort,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnStickyChange,
    handleRowContextMenu,
    closeContextMenu,
    handleContextAction,
    openModal,
    closeModal,
    submitAction
  };
}
