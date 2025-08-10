import { TrendingUp, Users, UserCheck, UserX, BarChart3 } from 'lucide-react';

interface AnalyticsStats {
  totalUsers: number;
  filteredUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: Record<string, number>;
}

interface AnalyticsPanelProps {
  stats: AnalyticsStats | null;
  className?: string;
  showTrends?: boolean;
}

export function AnalyticsPanel({ stats, className = "", showTrends = true }: AnalyticsPanelProps) {
  if (!stats) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const activePercentage = stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0;
  const filteredPercentage = stats.totalUsers > 0 ? (stats.filteredUsers / stats.totalUsers) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Thống kê tổng quan</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Tổng số</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Sau lọc</p>
                <p className="text-2xl font-bold text-purple-600">{stats.filteredUsers}</p>
                <p className="text-xs text-purple-700">{filteredPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-xs text-green-700">{activePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-900">Không hoạt động</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</p>
                <p className="text-xs text-red-700">{(100 - activePercentage).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Phân bổ vai trò</h3>
          <div className="space-y-3">
            {Object.entries(stats.roleDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([role, count]) => {
                const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                const maxCount = Math.max(...Object.values(stats.roleDistribution));
                const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 w-20">{role}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Tỷ lệ trạng thái</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-l-full transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="text-green-600 font-medium">{activePercentage.toFixed(1)}%</span>
              {' '} hoạt động
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        {showTrends && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin nhanh</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Vai trò phổ biến nhất: {Object.entries(stats.roleDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}</p>
              <p>• Tỷ lệ người dùng hoạt động: {activePercentage.toFixed(1)}%</p>
              <p>• Tổng số vai trò: {Object.keys(stats.roleDistribution).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
