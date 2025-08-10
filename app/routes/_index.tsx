import { Link } from "react-router";
import { LayoutFull } from "../components/Layout";

export default function HomePage() {
  return (
    <LayoutFull>
      <div className="h-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-auto">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Chào mừng đến với B+
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Hệ thống quản lý với React Router v7
          </p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Đăng ký tài khoản
            </Link>
            <Link
              to="/users-management"
              className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              👥 Quản lý người dùng
            </Link>
            <Link
              to="/api-test"
              className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🧪 Test Mock API
            </Link>
          </div>
        </div>
      </div>
    </LayoutFull>
  );
}
