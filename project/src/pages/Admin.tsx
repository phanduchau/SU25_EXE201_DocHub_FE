import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Home,
  Heart,
  Star,
  Package,
  Inbox,
  ShoppingCart,
  FileText,
  Settings,
  User,
  Clock,
  ChevronDown,
  Bell
} from 'lucide-react';
import Button from '../components/Button';
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
}
interface AdminDoctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  patients: number;
  revenue: number;
  rating: number;
}
interface RevenueData {
  month: string;
  revenue: number;
  appointments: number;
  percentage: number;
}
const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'doctors' | 'revenue'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [chartFilter, setChartFilter] = useState<'year' | 'month' | 'week'>('month');
  const [sortBy, setSortBy] = useState<'revenue' | 'appointments' | 'growth'>('revenue');
  // Mock data
  const users: AdminUser[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'patient',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-10'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'patient',
      status: 'active',
      joinDate: '2024-02-20',
      lastLogin: '2024-03-09'
    },
    {
      id: '3',
      name: 'BS. Lê Văn C',
      email: 'levanc@example.com',
      role: 'doctor',
      status: 'active',
      joinDate: '2024-01-01',
      lastLogin: '2024-03-10'
    }
  ];
  const doctors: AdminDoctor[] = [
    {
      id: '1',
      name: 'BS. Trần Đức Anh',
      specialty: 'Khoa Thần kinh',
      email: 'tranducanh@example.com',
      phone: '0123456789',
      status: 'active',
      patients: 150,
      revenue: 45000000,
      rating: 4.9
    },
    {
      id: '2',
      name: 'BS. Lê Hoàng Việt',
      specialty: 'Khoa nhi',
      email: 'lehoangviet@example.com',
      phone: '0987654321',
      status: 'active',
      patients: 120,
      revenue: 38000000,
      rating: 4.8
    },
    {
      id: '3',
      name: 'BS. Bùi Thanh Hoàng',
      specialty: 'Khoa da liễu',
      email: 'buithanhhoang@example.com',
      phone: '0456789123',
      status: 'pending',
      patients: 0,
      revenue: 0,
      rating: 0
    }
  ];
  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 12000000, appointments: 240, percentage: 20 },
    { month: 'Feb', revenue: 15000000, appointments: 300, percentage: 30 },
    { month: 'Mar', revenue: 18000000, appointments: 360, percentage: 40 },
    { month: 'Apr', revenue: 22000000, appointments: 440, percentage: 50 },
    { month: 'May', revenue: 25000000, appointments: 500, percentage: 60 },
    { month: 'Jun', revenue: 28000000, appointments: 560, percentage: 70 },
    { month: 'Jul', revenue: 32000000, appointments: 640, percentage: 80 },
    { month: 'Aug', revenue: 29000000, appointments: 580, percentage: 65 },
    { month: 'Sep', revenue: 31000000, appointments: 620, percentage: 75 },
    { month: 'Oct', revenue: 35000000, appointments: 700, percentage: 85 },
    { month: 'Nov', revenue: 33000000, appointments: 660, percentage: 78 },
    { month: 'Dec', revenue: 38000000, appointments: 760, percentage: 90 }
  ];
  const stats = {
    totalUsers: 40689,
    totalOrders: 10293,
    totalSales: 89000,
    totalPending: 2040,
    userGrowth: 8.5,
    orderGrowth: 1.3,
    salesGrowth: -4.3,
    pendingGrowth: 1.8
  };
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, active: true },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'doctors', label: 'Bác sĩ', icon: Stethoscope },
    { id: 'revenue', label: 'Doanh thu', icon: BarChart3 }
  ];
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stats.userGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">Tăng so với hôm qua</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Lịch hẹn đã đặt</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stats.orderGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">Tăng từ tuần trước</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                <span className="text-sm text-red-600 font-medium">{Math.abs(stats.salesGrowth)}%</span>
                <span className="text-sm text-gray-500 ml-1">Giảm so với hôm qua</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">  Lịch hẹn đang chờ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPending.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stats.pendingGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">Tăng so với hôm qua</span>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Sales Details Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Details</h3>
          <div className="flex items-center space-x-4">
            <select
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value as 'year' | 'month' | 'week')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'revenue' | 'appointments' | 'growth')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="appointments">Sort by Appointments</option>
              <option value="growth">Sort by Growth</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Options
            </button>
          </div>
        </div>
        
        <div className="relative h-80">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
            <span>100%</span>
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span>0%</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 20, 40, 60, 80, 100].map((line) => (
                <div
                  key={line}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${100 - line}%` }}
                />
              ))}
            </div>
            
            {/* Chart line */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Area under curve */}
              <path
                d={`M 0 ${320 - (revenueData[0].percentage * 3.2)} ${revenueData.map((item, index) => 
                  `L ${(index * (100 / (revenueData.length - 1)))}% ${320 - (item.percentage * 3.2)}`
                ).join(' ')} L 100% 320 L 0 320 Z`}
                fill="url(#gradient)"
              />
              
              {/* Main line */}
              <polyline
                points={revenueData.map((item, index) => 
                  `${(index * (100 / (revenueData.length - 1)))}%,${320 - (item.percentage * 3.2)}`
                ).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {/* Data points */}
              {revenueData.map((item, index) => (
                <g key={index}>
                  <circle
                    cx={`${(index * (100 / (revenueData.length - 1)))}%`}
                    cy={320 - (item.percentage * 3.2)}
                    r="4"
                    fill="#3B82F6"
                    className="drop-shadow-sm"
                  />
                  {/* Tooltip on hover */}
                  {index === 6 && (
                    <g>
                      <rect
                        x={`${(index * (100 / (revenueData.length - 1))) - 5}%`}
                        y={320 - (item.percentage * 3.2) - 35}
                        width="60"
                        height="25"
                        fill="#1E40AF"
                        rx="4"
                        className="drop-shadow-lg"
                      />
                      <text
                        x={`${(index * (100 / (revenueData.length - 1)))}%`}
                        y={320 - (item.percentage * 3.2) - 18}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="600"
                      >
                        ${item.revenue / 1000}K
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 pt-4">
              {revenueData.map((item, index) => (
                <span key={index} className="text-center">
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <Button variant="primary" className="mt-4 md:mt-0">
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị' : 
                       user.role === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' :
                       user.status === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const renderDoctors = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Quản lý bác sĩ</h2>
        <Button variant="primary" className="mt-4 md:mt-0">
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm bác sĩ
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc theo chuyên khoa
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên khoa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                      <div className="text-sm text-gray-500">{doctor.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      doctor.status === 'active' ? 'bg-green-100 text-green-800' :
                      doctor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status === 'active' ? 'Hoạt động' :
                       doctor.status === 'pending' ? 'Chờ duyệt' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.patients}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(doctor.revenue / 1000000).toFixed(1)}M VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.rating > 0 ? `${doctor.rating}/5` : 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const renderRevenue = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quản lý doanh thu</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Biểu đồ doanh thu</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Cột
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Đường
              </Button>
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between space-x-4">
            {revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full">
                  <div 
                    className="bg-blue-500 w-full rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 250}px` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {(item.revenue / 1000000).toFixed(0)}M
                  </div>
                </div>
                <span className="text-sm text-gray-600 mt-2 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Thống kê tổng quan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Doanh thu tháng này</span>
                <span className="font-semibold text-green-600">28M VNĐ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tăng trưởng</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lịch hẹn tháng này</span>
                <span className="font-semibold">560</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trung bình/lịch hẹn</span>
                <span className="font-semibold">50K VNĐ</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Top bác sĩ</h3>
            <div className="space-y-3">
              {doctors.filter(d => d.status === 'active').slice(0, 3).map((doctor, index) => (
                <div key={doctor.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {(doctor.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'doctors' && renderDoctors()}
          {activeTab === 'revenue' && renderRevenue()}
        </main>
      </div>
    </div>
  );
};
export default Admin;