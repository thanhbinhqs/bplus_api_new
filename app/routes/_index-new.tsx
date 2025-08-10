import { Link } from "react-router";
import { LayoutFull } from "../components/Layout";

export default function HomePage() {
  return (
    <LayoutFull>
      <div className="h-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Chào mừng đến với B+
            </h1>
            <p className="text-lg text-gray-600">
              Hệ thống quản lý với React Router v7 và TableDataLayout Components
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authentication */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🔐 Authentication</h2>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded font-medium hover:bg-gray-300 transition-colors text-center"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            </div>

            {/* Management Pages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">👥 User Management</h2>
              <div className="space-y-3">
                <Link
                  to="/users-management"
                  className="block w-full bg-purple-600 text-white py-2 px-4 rounded font-medium hover:bg-purple-700 transition-colors text-center"
                >
                  Users Management (Original)
                </Link>
                <Link
                  to="/users-management-v2"
                  className="block w-full bg-indigo-600 text-white py-2 px-4 rounded font-medium hover:bg-indigo-700 transition-colors text-center"
                >
                  Users Management v2 (TableDataLayout)
                </Link>
              </div>
            </div>

            {/* Table Demos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Table Components</h2>
              <div className="space-y-3">
                <Link
                  to="/simple-table-demo"
                  className="block w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition-colors text-center"
                >
                  Simple Table Demo
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full bg-orange-600 text-white py-2 px-4 rounded font-medium hover:bg-orange-700 transition-colors text-center"
                >
                  Dashboard (Auth Context Demo)
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">ℹ️ Thông tin</h2>
              <div className="text-sm space-y-2">
                <p><strong>Framework:</strong> React Router v7</p>
                <p><strong>UI:</strong> Tailwind CSS + shadcn/ui</p>
                <p><strong>State:</strong> Built-in hooks</p>
                <p><strong>Auth:</strong> Cookie-based authentication</p>
                <p><strong>Tables:</strong> Reusable TableDataLayout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutFull>
  );
}
