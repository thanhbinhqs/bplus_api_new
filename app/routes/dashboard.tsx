import { Link, useLoaderData } from "react-router";
import { LayoutContainer } from "../components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "../components/ui";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Activity,
  TestTube,
  Home,
  Package
} from "lucide-react";
import { withAuth, type AuthContext } from "../lib/authMiddleware";

export async function loader({ request }: { request: Request }) {
  return withAuth(request, async (authContext: AuthContext) => {
    // Bây giờ bạn có auth context với menu items attached
    const stats = [
      {
        title: "Tổng số Users",
        value: "300",
        change: "+12%",
        changeType: "positive" as const,
        icon: "Users"
      },
      {
        title: "Tổng số Sản phẩm",
        value: "150",
        change: "+8%",
        changeType: "positive" as const,
        icon: "Package"
      },
      {
        title: "API Calls",
        value: "1,234",
        change: "+23%",
        changeType: "positive" as const,
        icon: "BarChart3"
      },
      {
        title: "System Health",
        value: "99.9%",
        change: "0%",
        changeType: "neutral" as const,
        icon: "Settings"
      }
    ];

    return {
      authContext,
      stats
    };
  });
}

export default function DashboardPage() {
  const { authContext, stats } = useLoaderData<typeof loader>();
  
  // Hiển thị menu items từ auth context
  console.log("User menu items:", authContext.menuItems);
  console.log("User permissions:", authContext.userPermissions);

  const quickActions = [
    {
      title: "Quản lý Users",
      description: "Xem, tìm kiếm và quản lý người dùng (Original)",
      href: "/users-management",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Users Management v2",
      description: "Demo TableDataLayout với full features",
      href: "/users-management-v2",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Quản lý Sản phẩm",
      description: "Quản lý sản phẩm với TableDataLayout",
      href: "/products-management",
      icon: Package,
      color: "bg-indigo-500"
    },
    {
      title: "Test API",
      description: "Kiểm tra và test các endpoint API",
      href: "/api-test",
      icon: TestTube,
      color: "bg-orange-500"
    },
    {
      title: "Cài đặt",
      description: "Cấu hình hệ thống và preferences",
      href: "/settings",
      icon: Settings,
      color: "bg-gray-500"
    }
  ];

  return (
    <LayoutContainer user={{ fullName: "Admin User", username: "admin", role: "Administrator" }}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Chào mừng trở lại! Đây là tổng quan về hệ thống của bạn.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            // Map icon name to actual component
            const getIcon = (iconName: string) => {
              switch (iconName) {
                case "Users": return Users;
                case "Package": return Package;
                case "Activity": return Activity;
                case "BarChart3": return BarChart3;
                case "Settings": return Settings;
                default: return Users;
              }
            };
            const IconComponent = getIcon(stat.icon);
            
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-xs ${
                        stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'neutral' ? 'text-gray-600' :
                        'text-red-600'
                      }`}>
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <Link to={action.href}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các thao tác và sự kiện mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Tạo sản phẩm mới",
                  user: "Admin",
                  time: "5 phút trước",
                  details: "Đã thêm sản phẩm 'iPhone 15 Pro Max' vào danh mục Điện tử"
                },
                {
                  action: "Cập nhật tồn kho",
                  user: "Manager",
                  time: "10 phút trước",
                  details: "Đã cập nhật tồn kho cho 15 sản phẩm"
                },
                {
                  action: "Tạo user mới",
                  user: "Admin",
                  time: "15 phút trước",
                  details: "Đã tạo user 'nguyenvana' với role User"
                },
                {
                  action: "Login",
                  user: "Admin",
                  time: "1 giờ trước",
                  details: "Đăng nhập thành công từ IP 192.168.1.1"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">Bởi: {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation nhanh */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Home className="h-4 w-4" />
                <span className="text-sm">Trang chủ</span>
              </Link>
              <Link to="/users-management" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Users className="h-4 w-4" />
                <span className="text-sm">Users</span>
              </Link>
              <Link to="/products-management" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Package className="h-4 w-4" />
                <span className="text-sm">Sản phẩm</span>
              </Link>
              <Link to="/api-test" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <TestTube className="h-4 w-4" />
                <span className="text-sm">API Test</span>
              </Link>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </LayoutContainer>
  );
}
