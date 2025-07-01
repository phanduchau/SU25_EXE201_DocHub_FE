// src/pages/PaymentHistory.tsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Calendar,
  CreditCard,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { 
  getVietQRPaymentHistory,
  PaymentHistory,
  PaymentRequestStatus,
  TransactionRecord,
  VietQRUtils
} from '../apis/vietqr/vietqrApi';

const PaymentHistoryPage: React.FC = () => {
  const { user } = useAuthContext();
  const [history, setHistory] = useState<PaymentHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'requests' | 'transactions'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequestStatus | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadPaymentHistory();
    }
  }, [user]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getVietQRPaymentHistory();
      setHistory(data);
    } catch (error: any) {
      console.error('Error loading payment history:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải lịch sử thanh toán');
      toast.error(error.message || 'Có lỗi xảy ra khi tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isExpired?: boolean) => {
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
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Đã hủy
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

  const filteredRequests = history?.paymentRequests?.filter(request => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesDate = !dateFilter || request.createdAt.startsWith(dateFilter);
    return matchesStatus && matchesDate;
  }) || [];

  const filteredTransactions = history?.transactions?.filter(transaction => {
    const matchesDate = !dateFilter || transaction.transactionDate.startsWith(dateFilter);
    return matchesDate;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải lịch sử thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadPaymentHistory}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lịch sử thanh toán
            </h1>
            <p className="text-gray-600">
              Xem các giao dịch và yêu cầu thanh toán của bạn
            </p>
          </div>
          
          <Button onClick={loadPaymentHistory} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'requests'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Yêu cầu thanh toán ({filteredRequests.length})
                </div>
              </button>
              <button
                onClick={() => setSelectedTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'transactions'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Giao dịch thành công ({filteredTransactions.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4">
              {selectedTab === 'requests' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">Tất cả</option>
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="Expired">Hết hạn</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('');
                    setDateFilter('');
                  }}
                  className="text-sm"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'requests' ? (
              <div>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có yêu cầu thanh toán nào
                    </h3>
                    <p className="text-gray-500">
                      Các yêu cầu thanh toán của bạn sẽ hiển thị ở đây
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.paymentRequestId}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {request.planName}
                              </h4>
                              {getStatusBadge(request.status, request.isExpired)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Mã GD:</span>
                                <span className="ml-1 font-mono">{request.transferCode}</span>
                              </div>
                              <div>
                                <span className="font-medium">Số tiền:</span>
                                <span className="ml-1 font-medium text-teal-600">
                                  {VietQRUtils.formatVietnamCurrency(request.amount)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Chu kỳ:</span>
                                <span className="ml-1">
                                  {request.billingCycle === 'Yearly' ? 'Hàng năm' : 'Hàng tháng'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Tạo lúc: {VietQRUtils.formatVietnameseDate(request.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có giao dịch thành công nào
                    </h3>
                    <p className="text-gray-500">
                      Các giao dịch đã hoàn thành sẽ hiển thị ở đây
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.transactionId}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {transaction.planName}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                Thành công
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Mã GD:</span>
                                <span className="ml-1 font-mono">{transaction.transferCode}</span>
                              </div>
                              <div>
                                <span className="font-medium">Số tiền:</span>
                                <span className="ml-1 font-medium text-green-600">
                                  {VietQRUtils.formatVietnamCurrency(transaction.amount)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Xử lý bởi:</span>
                                <span className="ml-1">{transaction.processedByAdminName}</span>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Hoàn thành: {VietQRUtils.formatVietnameseDate(transaction.transactionDate)}
                            </div>
                            
                            {transaction.notes && (
                              <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                <span className="font-medium">Ghi chú:</span> {transaction.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => setSelectedTransaction(transaction)}
                              className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Request Detail Modal */}
        {selectedRequest && (
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

                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Trạng thái:</span>
                    {getStatusBadge(selectedRequest.status, selectedRequest.isExpired)}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Gói dịch vụ:</span>
                        <div className="font-medium">{selectedRequest.planName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Chu kỳ:</span>
                        <div className="font-medium">
                          {selectedRequest.billingCycle === 'Yearly' ? 'Hàng năm' : 'Hàng tháng'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Số tiền:</span>
                        <div className="font-medium text-lg text-teal-600">
                          {VietQRUtils.formatVietnamCurrency(selectedRequest.amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Mã chuyển khoản:</span>
                        <div className="font-mono font-medium">{selectedRequest.transferCode}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-3">Thời gian</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Tạo lúc:</span>
                        <span className="font-medium">{VietQRUtils.formatVietnameseDate(selectedRequest.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Hết hạn:</span>
                        <span className="font-medium">{VietQRUtils.formatVietnameseDate(selectedRequest.expiresAt)}</span>
                      </div>
                      {selectedRequest.isExpired && (
                        <div className="text-orange-600 text-xs">
                          Yêu cầu này đã hết hạn
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
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
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Chi tiết giao dịch</h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Success Status */}
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-medium text-green-700">Giao dịch thành công</span>
                  </div>

                  {/* Transaction Info */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-3">Thông tin giao dịch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">ID giao dịch:</span>
                        <div className="font-mono font-medium">{selectedTransaction.transactionId}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Mã chuyển khoản:</span>
                        <div className="font-mono font-medium">{selectedTransaction.transferCode}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Gói dịch vụ:</span>
                        <div className="font-medium">{selectedTransaction.planName}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Chu kỳ:</span>
                        <div className="font-medium">
                          {selectedTransaction.billingCycle === 'Yearly' ? 'Hàng năm' : 'Hàng tháng'}
                        </div>
                      </div>
                      <div>
                        <span className="text-green-700">Số tiền:</span>
                        <div className="font-medium text-lg text-green-600">
                          {VietQRUtils.formatVietnamCurrency(selectedTransaction.amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-green-700">Xử lý bởi:</span>
                        <div className="font-medium">{selectedTransaction.processedByAdminName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Thời gian xử lý</h3>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hoàn thành lúc:</span>
                        <span className="font-medium">{VietQRUtils.formatVietnameseDate(selectedTransaction.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedTransaction.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Ghi chú</h3>
                      <p className="text-blue-800 text-sm">{selectedTransaction.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTransaction(null)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;