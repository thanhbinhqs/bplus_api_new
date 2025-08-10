import { Link, useLocation } from "react-router";
import { Button } from "../ui";
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  TestTube,
  ChevronDown,
  Shield,
  UserCheck,
  LayoutDashboard
} from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  user?: {
    fullName: string;
    username: string;
    role: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Test API', href: '/api-test', icon: TestTube },
  ];

  const dashboardItems = [
    { name: 'Quản lý Users', href: '/users-management', icon: Users },
    { name: 'Quản lý Roles', href: '/roles-management', icon: UserCheck },
    { name: 'Quản lý Permissions', href: '/permissions-management', icon: Shield },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isDashboardActive = () => {
    return dashboardItems.some(item => isActive(item.href));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-menu')) {
        setIsDashboardDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsMobileUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    // Clear session/cookies
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B+</span>
              </div>
              <span className="text-xl font-bold text-gray-900">B Plus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Dashboard Dropdown */}
            <div className="relative dropdown-menu">
              <button
                onClick={() => setIsDashboardDropdownOpen(!isDashboardDropdownOpen)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                  isDashboardActive()
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDashboardDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {dashboardItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsDashboardDropdownOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Dropdown */}
                <div className="relative dropdown-menu">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                      </div>
                      
                      <button
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Cài đặt</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-60"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-64 bg-white shadow-lg h-full flex flex-col">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation Items */}
              <div className="mt-12 space-y-1 px-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Dashboard Section */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-base font-medium text-gray-900 mb-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {dashboardItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive(item.href)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile User Menu with Backdrop */}
        {isMobileUserMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileUserMenuOpen(false)}
            />
            
            {/* User Menu Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 md:hidden">
              <div className="p-4">
                {/* Handle bar */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.fullName}</div>
                    <div className="text-sm text-gray-500">{user?.username}</div>
                    <div className="text-xs text-gray-400">{user?.role}</div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Cài đặt</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setIsMobileUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>

                {/* Close button */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setIsMobileUserMenuOpen(false)}
                    className="w-full px-4 py-2 text-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
