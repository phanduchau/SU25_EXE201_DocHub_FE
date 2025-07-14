import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser
} from '../apis/admin/userAdminApi';

import {
  searchVietQRPaymentRequests,
  confirmVietQRPayment,
  PaymentRequestSearchParams,
  AdminPaymentRequest,
} from '../apis/vietqr/adminVietQRApi';

import { toast } from 'react-toastify';

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
  Bell,
  AlertCircle,
  CheckCircleIcon,
  ClockIcon,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import Button from '../components/Button';
import CreateDoctorModal from '../components/CreateDoctorModal';
import EditUserModal from '../components/EditUserModal';
import UserDetailModal from '../components/UserDetailModal';
import { AdminUser } from '../types/index';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { doctors } from '../data/doctors';
import {
  getAllFeedbacks,
  getFeedbackStatistics,
  updateFeedbackStatus,
  deleteFeedback
} from '../apis/admin/adminFeedbackApi';

import { FeedbackDTO, FeedbackStatisticsDTO } from '../types/index';
import FeedbackDetailModal from '../components/FeedbackDetailModal';


interface RevenueData {
  month: string;
  revenue: number;
  appointments: number;
  percentage: number;
}
const Admin: React.FC = () => {
 const [activeTab, setActiveTab] = useState<
  'overview' | 'users' | 'doctors' | 'revenue' | 'vietqr' | 'feedback'
>('overview');
 const [searchTerm, setSearchTerm] = useState('');
  const [chartFilter, setChartFilter] = useState<'year' | 'month' | 'week'>('month');
  const [sortBy, setSortBy] = useState<'revenue' | 'appointments' | 'growth'>('revenue');
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const doctorList = userList.filter(user => user.roles.includes('Doctor'));
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageDoctors, setCurrentPageDoctors] = useState(1);
  const itemsPerPage = 3;
const [vietQRRequests, setVietQRRequests] = useState<AdminPaymentRequest[]>([]);
const [loadingVietQR, setLoadingVietQR] = useState(false);
const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<AdminPaymentRequest | null>(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [confirmNotes, setConfirmNotes] = useState('');
const [confirming, setConfirming] = useState(false);
const [vietQRSearchParams, setVietQRSearchParams] = useState<PaymentRequestSearchParams>({
  page: 1,
  pageSize: 10,
});
const [feedbackList, setFeedbackList] = useState<FeedbackDTO[]>([]);
const [loadingFeedback, setLoadingFeedback] = useState(false);
const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDTO | null>(null);
const [currentPageFeedback, setCurrentPageFeedback] = useState(1);
const itemsPerPageFeedback = 10;
const [showFeedbackDetail, setShowFeedbackDetail] = useState(false);
const [feedbackStats, setFeedbackStats] = useState<FeedbackStatisticsDTO | null>(null);

const fetchFeedbacks = async () => {
  setLoadingFeedback(true);
  try {
    const data = await getAllFeedbacks();
    setFeedbackList(data);
    const stats = await getFeedbackStatistics();
    setFeedbackStats(stats);
  } catch (error) {
    console.error(error);
    toast.error('Không thể tải dữ liệu feedback');
  } finally {
    setLoadingFeedback(false);
  }
};

useEffect(() => {
  if (activeTab === 'feedback') {
    fetchFeedbacks();
  }
}, [activeTab]);

const handleUpdateStatus = async (id: number, newStatus: string) => {
  try {
    await updateFeedbackStatus(id, {
      status: newStatus,
      adminNotes: 'Updated by admin',
    });
    toast.success('Cập nhật trạng thái thành công!');
    setShowFeedbackDetail(false);
    fetchFeedbacks();
  } catch (e: any) {
    console.error(e);
    toast.error('Cập nhật trạng thái thất bại!');
  }
};

const handleDeleteFeedback = async (id: number) => {
  if (!window.confirm('Bạn có chắc muốn xóa feedback này?')) return;
  try {
    await deleteFeedback(id);
    toast.success('Xóa feedback thành công!');
    fetchFeedbacks();
  } catch (e: any) {
    console.error(e);
    toast.error('Xóa feedback thất bại!');
  }
};



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      if (data) setUserList(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

useEffect(() => {
  if (activeTab === 'vietqr') {
    loadVietQRRequests();
  }
}, [activeTab, vietQRSearchParams]);

  const fetchAndUpdateUser = async (id: string) => {
    await fetchUsers();
    const updatedUser = await getUserById(id);
    setSelectedUser(updatedUser);
  };

  const handleViewUser = async (id: string) => {
    const user = await getUserById(id);
    if (user) setSelectedUser(user);
  };

  const handleDeleteUser = async (id: string) => {
    const confirm = window.confirm('Bạn có chắc muốn xoá người dùng này?');
    if (confirm) {
      const result = await deleteUser(id);
      if (result) setUserList(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleUpdateUser = async (id: string) => {
    const user = await getUserById(id);
    if (user) {
      setSelectedUser(user);
      setShowEditModal(true);
    }
  };

const loadVietQRRequests = async () => {
  try {
    setLoadingVietQR(true);
    const data = await searchVietQRPaymentRequests(vietQRSearchParams);
    setVietQRRequests(data);
  } catch (error: any) {
    console.error('Error loading VietQR requests:', error);
    toast.error(error.message || 'Không thể tải danh sách yêu cầu thanh toán');
  } finally {
    setLoadingVietQR(false);
  }
};

const handleVietQRSearch = (e: React.FormEvent) => {
  e.preventDefault();
  setVietQRSearchParams({ ...vietQRSearchParams, page: 1 });
};

const handleConfirmPayment = async () => {
  if (!selectedPaymentRequest) return;

  try {
    setConfirming(true);
    await confirmVietQRPayment(selectedPaymentRequest.paymentRequestId, {
      notes: confirmNotes,
    });

    await loadVietQRRequests();

    setShowConfirmModal(false);
    setSelectedPaymentRequest(null);
    setConfirmNotes('');

    toast.success('Xác nhận thanh toán thành công!');
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    toast.error(error.message || 'Có lỗi xảy ra khi xác nhận thanh toán');
  } finally {
    setConfirming(false);
  }
};

const getStatusBadge = (status: string, isExpired: boolean) => {
  if (isExpired && status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <ClockIcon className="w-3 h-3" />
        Hết hạn
      </span>
    );
  }

  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <ClockIcon className="w-3 h-3" />
          Chờ xử lý
        </span>
      );
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircleIcon className="w-3 h-3" />
          Đã xác nhận
        </span>
      );
    case 'Expired':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <AlertCircle className="w-3 h-3" />
          Hết hạn
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN');
};



  const filteredUsers = userList.filter(user => user.roles.includes('Customer'));
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice((currentPageUsers - 1) * itemsPerPage, currentPageUsers * itemsPerPage);

  const filteredDoctors = userList.filter(user => user.roles.includes('Doctor'));
  const totalPagesDoctors = Math.ceil(filteredDoctors.length / itemsPerPage);
  const displayedDoctors = filteredDoctors.slice((currentPageDoctors - 1) * itemsPerPage, currentPageDoctors * itemsPerPage);


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
    { id: 'revenue', label: 'Doanh thu', icon: BarChart3 },
  { id: 'vietqr', label: 'Thanh toán VietQR', icon: CreditCard },
  { id: 'feedback', label: 'Feedback', icon: Star },
  ];
  
  const renderOverview = () => (

    <div className="space-y-6">

      {/* Nút tạo tài khoản bác sĩ */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Tạo tài khoản bác sĩ
        </button>
      </div>

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
      {/* Modal hiển thị khi bấm nút */}
      {showCreateModal && <CreateDoctorModal onClose={() => setShowCreateModal(false)} />}
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
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {displayedUsers
                .filter((user) => user.roles.includes('Customer'))
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.roles[0] === 'Admin' ? 'Quản trị' :
                        user.roles[0] === 'Doctor' ? 'Bác sĩ' :
                          user.roles[0] === 'Customer' ? 'Bệnh nhân' : 'Không rõ'}
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleUpdateUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
          <div className="flex justify-end items-center space-x-2 px-6 py-4">
            <button
              disabled={currentPageUsers === 1}
              onClick={() => setCurrentPageUsers(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-sm">Trang {currentPageUsers} / {totalPagesUsers}</span>
            <button
              disabled={currentPageUsers === totalPagesUsers}
              onClick={() => setCurrentPageUsers(prev => Math.min(prev + 1, totalPagesUsers))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Quản lý bác sĩ</h2>
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedDoctors
                .filter(user => user.roles.includes('Doctor'))
                .map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {doctor.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewUser(doctor.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleUpdateUser(doctor.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(doctor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
          <div className="flex justify-end items-center space-x-2 px-6 py-4">
            <button
              disabled={currentPageDoctors === 1}
              onClick={() => setCurrentPageDoctors(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-sm">Trang {currentPageDoctors} / {totalPagesDoctors}</span>
            <button
              disabled={currentPageDoctors === totalPagesDoctors}
              onClick={() => setCurrentPageDoctors(prev => Math.min(prev + 1, totalPagesDoctors))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>


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
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
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

  const renderVietQR = () => (
  <div className="space-y-6">
  {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý thanh toán VietQR</h2>
          <p className="text-gray-600 mt-1">Xem và xác nhận các yêu cầu thanh toán qua chuyển khoản</p>
        </div>
        <button
          onClick={loadVietQRRequests}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>
  {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <form onSubmit={handleVietQRSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã chuyển khoản
              </label>
              <input
                type="text"
                placeholder="TVIP-xxx-xxx"
                value={vietQRSearchParams.transferCode || ''}
                onChange={(e) => setVietQRSearchParams({ ...vietQRSearchParams, transferCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={vietQRSearchParams.status || ''}
                onChange={(e) => setVietQRSearchParams({ ...vietQRSearchParams, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="Expired">Hết hạn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={vietQRSearchParams.fromDate || ''}
                onChange={(e) => setVietQRSearchParams({ ...vietQRSearchParams, fromDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={vietQRSearchParams.toDate || ''}
                onChange={(e) => setVietQRSearchParams({ ...vietQRSearchParams, toDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
            
            <button
              type="button"
              onClick={() => {
                setVietQRSearchParams({ page: 1, pageSize: 10 });
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </form>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã chuyển khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingVietQR ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Đang tải...</p>
                  </td>
                </tr>
              ) : vietQRRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không có yêu cầu thanh toán nào</p>
                  </td>
                </tr>
              ) : (
                vietQRRequests.map((request) => (
                  <tr key={request.paymentRequestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {request.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.planName}</div>
                      <div className="text-sm text-gray-500">{request.billingCycle}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {request.transferCode}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(request.amount)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status, request.isExpired)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPaymentRequest(request)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </button>
                        
                        {request.status === 'Pending' && !request.isExpired && (
                          <button
                            onClick={() => {
                              setSelectedPaymentRequest(request);
                              setShowConfirmModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Xác nhận
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Request Detail Modal */}
      {selectedPaymentRequest && !showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Chi tiết yêu cầu thanh toán</h2>
                <button
                  onClick={() => setSelectedPaymentRequest(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Tên:</span>
                      <span className="ml-2 font-medium">{selectedPaymentRequest.userName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="ml-2">{selectedPaymentRequest.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ID:</span>
                      <span className="ml-2 font-mono text-sm">{selectedPaymentRequest.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Thông tin thanh toán</h3>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-blue-700">Gói dịch vụ:</span>
                      <span className="ml-2 font-medium">{selectedPaymentRequest.planName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Chu kỳ:</span>
                      <span className="ml-2">{selectedPaymentRequest.billingCycle}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Số tiền:</span>
                      <span className="ml-2 font-medium text-lg">{formatAmount(selectedPaymentRequest.amount)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Mã chuyển khoản:</span>
                      <span className="ml-2 font-mono font-medium">{selectedPaymentRequest.transferCode}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Thông tin tài khoản</h3>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-green-700">Ngân hàng:</span>
                      <span className="ml-2">{selectedPaymentRequest.bankAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-green-700">Số TK:</span>
                      <span className="ml-2 font-mono">{selectedPaymentRequest.bankAccount.accountNo}</span>
                    </div>
                    <div>
                      <span className="text-sm text-green-700">Chủ TK:</span>
                      <span className="ml-2">{selectedPaymentRequest.bankAccount.accountName}</span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Trạng thái</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      {getStatusBadge(selectedPaymentRequest.status, selectedPaymentRequest.isExpired)}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Ngày tạo:</span>
                      <span className="ml-2">{formatDate(selectedPaymentRequest.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Hết hạn:</span>
                      <span className="ml-2">{formatDate(selectedPaymentRequest.expiresAt)}</span>
                    </div>
                    {selectedPaymentRequest.confirmedAt && (
                      <>
                        <div>
                          <span className="text-sm text-gray-600">Xác nhận lúc:</span>
                          <span className="ml-2">{formatDate(selectedPaymentRequest.confirmedAt)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Xác nhận bởi:</span>
                          <span className="ml-2">{selectedPaymentRequest.confirmedByAdminName}</span>
                        </div>
                      </>
                    )}
                    {selectedPaymentRequest.notes && (
                      <div>
                        <span className="text-sm text-gray-600">Ghi chú:</span>
                        <div className="mt-1 p-2 bg-white rounded border text-sm">
                          {selectedPaymentRequest.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {selectedPaymentRequest.status === 'Pending' && !selectedPaymentRequest.isExpired && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Xác nhận thanh toán
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedPaymentRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Payment Modal */}
      {showConfirmModal && selectedPaymentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Xác nhận thanh toán</h2>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho yêu cầu này?
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Khách hàng:</span>
                    <span className="ml-2 font-medium">{selectedPaymentRequest.userName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mã CK:</span>
                    <span className="ml-2 font-mono">{selectedPaymentRequest.transferCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="ml-2 font-medium">{formatAmount(selectedPaymentRequest.amount)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={confirmNotes}
                    onChange={(e) => setConfirmNotes(e.target.value)}
                    placeholder="Nhập ghi chú về việc xác nhận thanh toán..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {confirming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Xác nhận
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmNotes('');
                  }}
                  disabled={confirming}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </div> 
  );

const totalPagesFeedback = Math.ceil(feedbackList.length / itemsPerPageFeedback);
const displayedFeedbacks = feedbackList.slice(
  (currentPageFeedback - 1) * itemsPerPageFeedback,
  currentPageFeedback * itemsPerPageFeedback
);

  const renderFeedbacks = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Quản lý Feedback</h2>

    {feedbackStats && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Tổng Feedback</p>
          <p className="text-2xl font-bold">{feedbackStats.totalFeedbacks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Điểm TB</p>
          <p className="text-2xl font-bold">{feedbackStats.averageRating}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Phân bố điểm</p>
          <p className="text-sm">
            {Object.entries(feedbackStats.byRating).map(([rate, count]) => (
              <span key={rate} className="inline-block mr-3">
                <span className="font-semibold">{rate}⭐</span>: {count}
              </span>
            ))}
          </p>
        </div>
      </div>
    )}

    <div className="bg-white rounded-xl shadow-sm border overflow-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Người dùng
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Bác sĩ
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Nội dung
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Điểm
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Ngày
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
          Trạng thái
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
          Hành động
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {loadingFeedback ? (
        <tr>
          <td colSpan={7} className="text-center py-6">Đang tải...</td>
        </tr>
      ) : feedbackList.length === 0 ? (
        <tr>
          <td colSpan={7} className="text-center py-6">Chưa có feedback</td>
        </tr>
      ) : (
        displayedFeedbacks.map(item => (
          <tr key={item.feedbackId} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm text-gray-700">{item.name}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{item.doctorId}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{item.content}</td>
            <td className="px-4 py-3 text-sm font-medium text-yellow-600">{item.rating}⭐</td>
            <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
            <td className="px-4 py-3">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                item.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setSelectedFeedback(item);
                    setShowFeedbackDetail(true);
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </button>
                <button
                  onClick={() => handleDeleteFeedback(item.feedbackId)}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
  <div className="flex justify-end items-center space-x-2 px-4 py-4">
  <button
    disabled={currentPageFeedback === 1}
    onClick={() => setCurrentPageFeedback(prev => Math.max(prev - 1, 1))}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Trang trước
  </button>
  <span className="text-sm">
    Trang {currentPageFeedback} / {totalPagesFeedback}
  </span>
  <button
    disabled={currentPageFeedback === totalPagesFeedback || totalPagesFeedback === 0}
    onClick={() => setCurrentPageFeedback(prev => Math.min(prev + 1, totalPagesFeedback))}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Trang sau
  </button>
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
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
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
          {activeTab === 'vietqr' && renderVietQR()}
          {activeTab === 'feedback' && renderFeedbacks()}
        </main>
        {/* Modal hiển thị chi tiết người dùng */}
        {selectedUser && !showEditModal && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
        {selectedUser && showEditModal && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setShowEditModal(false)}
            onUpdateSuccess={() => fetchAndUpdateUser(selectedUser.id)}
          />
        )}

{showFeedbackDetail && selectedFeedback && (
  <FeedbackDetailModal
    feedback={selectedFeedback}
    onClose={() => setShowFeedbackDetail(false)}
    onToggleStatus={handleUpdateStatus}
  />
)}



      </div>
    </div>
  );
};
export default Admin;