import { Link } from "react-router";
import { LayoutContainer } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Activity,
  TestTube,
  Home
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng số Users",
      value: "300",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Hoạt động hôm nay",
      value: "24",
      change: "+5%",
      changeType: "positive" as const,
      icon: Activity
    },
    {
      title: "API Calls",
      value: "1,234",
      change: "+23%",
      changeType: "positive" as const,
      icon: BarChart3
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "0%",
      changeType: "neutral" as const,
      icon: Settings
    }
  ];

  const quickActions = [
    {
      title: "Quản lý Users",
      description: "Xem, tìm kiếm và quản lý người dùng",
      href: "/users-management",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Test API",
      description: "Kiểm tra và test các endpoint API",
      href: "/api-test",
      icon: TestTube,
      color: "bg-green-500"
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
            const Icon = stat.icon;
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
                      <Icon className="h-6 w-6 text-gray-600" />
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
                  action: "Tạo user mới",
                  user: "Admin",
                  time: "2 phút trước",
                  details: "Đã tạo user 'nguyenvana' với role User"
                },
                {
                  action: "API Test",
                  user: "Tester",
                  time: "15 phút trước",
                  details: "Đã test thành công Users API với 300 records"
                },
                {
                  action: "Login",
                  user: "Admin",
                  time: "1 giờ trước",
                  details: "Đăng nhập thành công từ IP 192.168.1.1"
                },
                {
                  action: "System Update",
                  user: "System",
                  time: "3 giờ trước",
                  details: "Cập nhật mock data với 300 users"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Home className="h-4 w-4" />
                <span className="text-sm">Trang chủ</span>
              </Link>
              <Link to="/users-management" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Users className="h-4 w-4" />
                <span className="text-sm">Users</span>
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
