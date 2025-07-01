// src/components/VietQRManagement.tsx - Component riêng cho quản lý VietQR
import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Calendar,
  User,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from './Button';
import { 
  searchVietQRPaymentRequests,
  confirmVietQRPayment,
  getVietQRStats,
  exportVietQRData,
  getPendingPaymentsCount,
  PaymentRequestSearchParams,
  AdminPaymentRequest,
  ConfirmPaymentRequest,
  VietQRStats,
  AdminVietQRUtils
} from '../apis/vietqr/adminVietQRApi';

const VietQRManagement: React.FC = () => {
  // States
  const [requests, setRequests] = useState<AdminPaymentRequest[]>([]);
  const [stats, setStats] = useState<VietQRStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdminPaymentRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const [searchParams, setSearchParams] = useState<PaymentRequestSearchParams>({
    page: 1,
    pageSize: 10
  });

  // Load data on component mount and when search params change
  useEffect(() => {
    loadRequests();
    loadStats();
  }, [searchParams]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await searchVietQRPaymentRequests(searchParams);
      setRequests(data);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getVietQRStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ ...searchParams, page: 1 });
  };

  const handleConfirmPayment = async () => {
    if (!selectedRequest) return;

    try {
      setConfirming(true);
      await confirmVietQRPayment(selectedRequest.paymentRequestId, {
        notes: confirmNotes
      });
      
      // Refresh data
      await loadRequests();
      await loadStats();
      
      // Close modal
      setShowConfirmModal(false);
      setSelectedRequest(null);
      setConfirmNotes('');
      
      toast.success('Xác nhận thanh toán thành công!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setConfirming(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const blob = await exportVietQRData(searchParams);
      AdminVietQRUtils.downloadExportedData(blob, `vietqr-payments-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Xuất dữ liệu thành công!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string, isExpired: boolean) => {
    if (isExpired && status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <Clock className="w-3 h-3" />
          Hết hạn
        </span>
      );
    }

    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Chờ xử lý
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý thanh toán VietQR</h2>
          <p className="text-gray-600 mt-1">Xem và xác nhận các yêu cầu thanh toán qua chuyển khoản</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
            {exporting ? 'Đang xuất...' : 'Xuất CSV'}
          </Button>
          
          <Button
            onClick={loadRequests}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tổng yêu cầu</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmedRequests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todayRequests}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
                <p className="text-2xl font-bold text-green-600">
                  {AdminVietQRUtils.formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã chuyển khoản
              </label>
              <input
                type="text"
                placeholder="TVIP-xxx-xxx"
                value={searchParams.transferCode || ''}
                onChange={(e) => setSearchParams({ ...searchParams, transferCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={searchParams.status || ''}
                onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value as any })}
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
                value={searchParams.fromDate || ''}
                onChange={(e) => setSearchParams({ ...searchParams, fromDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={searchParams.toDate || ''}
                onChange={(e) => setSearchParams({ ...searchParams, toDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Tìm kiếm
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearchParams({ page: 1, pageSize: 10 })}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </form>
      </div>

      {/* Requests Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không có yêu cầu thanh toán nào</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
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
                        {AdminVietQRUtils.formatCurrency(request.amount)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status, request.isExpired)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {AdminVietQRUtils.formatVietnameseDate(request.createdAt)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </button>
                        
                        {request.status === 'Pending' && !request.isExpired && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowConfirmModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
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
      {selectedRequest && !showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Chi tiết yêu cầu thanh toán</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
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
                      <span className="ml-2 font-medium">{selectedRequest.userName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="ml-2">{selectedRequest.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ID:</span>
                      <span className="ml-2 font-mono text-sm">{selectedRequest.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Thông tin thanh toán</h3>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-blue-700">Gói dịch vụ:</span>
                      <span className="ml-2 font-medium">{selectedRequest.planName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Chu kỳ:</span>
                      <span className="ml-2">{selectedRequest.billingCycle}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Số tiền:</span>
                      <span className="ml-2 font-medium text-lg">{AdminVietQRUtils.formatCurrency(selectedRequest.amount)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Mã chuyển khoản:</span>
                      <span className="ml-2 font-mono font-medium">{selectedRequest.transferCode}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Thông tin tài khoản</h3>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-green-700">Ngân hàng:</span>
                      <span className="ml-2">{selectedRequest.bankAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-green-700">Số TK:</span>
                      <span className="ml-2 font-mono">{selectedRequest.bankAccount.accountNo}</span>
                    </div>
                    <div>
                      <span className="text-sm text-green-700">Chủ TK:</span>
                      <span className="ml-2">{selectedRequest.bankAccount.accountName}</span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Trạng thái</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      {getStatusBadge(selectedRequest.status, selectedRequest.isExpired)}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Ngày tạo:</span>
                      <span className="ml-2">{AdminVietQRUtils.formatVietnameseDate(selectedRequest.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Hết hạn:</span>
                      <span className="ml-2">{AdminVietQRUtils.formatVietnameseDate(selectedRequest.expiresAt)}</span>
                    </div>
                    {selectedRequest.confirmedAt && (
                      <>
                        <div>
                          <span className="text-sm text-gray-600">Xác nhận lúc:</span>
                          <span className="ml-2">{AdminVietQRUtils.formatVietnameseDate(selectedRequest.confirmedAt)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Xác nhận bởi:</span>
                          <span className="ml-2">{selectedRequest.confirmedByAdminName}</span>
                        </div>
                      </>
                    )}
                    {selectedRequest.notes && (
                      <div>
                        <span className="text-sm text-gray-600">Ghi chú:</span>
                        <div className="mt-1 p-2 bg-white rounded border text-sm">
                          {selectedRequest.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {selectedRequest.status === 'Pending' && !selectedRequest.isExpired && (
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Xác nhận thanh toán
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Payment Modal */}
      {showConfirmModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Xác nhận thanh toán</h2>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho yêu cầu này?
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Khách hàng:</span>
                    <span className="ml-2 font-medium">{selectedRequest.userName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mã CK:</span>
                    <span className="ml-2 font-mono">{selectedRequest.transferCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="ml-2 font-medium">{AdminVietQRUtils.formatCurrency(selectedRequest.amount)}</span>
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
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {confirming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Xác nhận
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmNotes('');
                  }}
                  disabled={confirming}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VietQRManagement;