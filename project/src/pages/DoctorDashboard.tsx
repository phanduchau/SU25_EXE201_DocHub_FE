import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  User,
  Star,
  MessageSquare,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react';
import Button from '../components/Button';
import { useAuthContext } from '../contexts/AuthContext';
import { getDoctorProfile, updateDoctorProfile, getDoctorProfileByUserId } from '../apis/doctors/doctorApi';
import { toast } from 'react-toastify';
import { getAppointmentsByDoctorId, confirmAppointment, cancelAppointment } from '../apis/booking/appointmentApi';
import PatientDetailsModal from '../components/PatientDetailsModal';
import { useNavigate } from 'react-router-dom';

interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
  completedAppointments: number;
  pendingAppointments: number;
}

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
}

interface DoctorProfile {
  doctorId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userImageUrl: string | null;
  specialization: string;
  yearsOfExperience: number;
  bio: string;
  hospitalName: string;
  rating: number | null;
  isActive: boolean;
}


const DoctorDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'profile' | 'schedule'>('overview');
  const [stats, setStats] = useState<DoctorStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  // Mock data for demonstration
  const mockStats: DoctorStats = {
    totalPatients: 245,
    todayAppointments: 8,
    monthlyRevenue: 15000000,
    averageRating: 4.8,
    completedAppointments: 180,
    pendingAppointments: 12
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.sub) return;
        setLoading(true);
        const profileData = await getDoctorProfileByUserId(user.sub);
        setProfile(profileData);

        const apiAppointments = await getAppointmentsByDoctorId(profileData.doctorId.toString());
        const transformedAppointments = apiAppointments.map((item: any): Appointment => {
          const dateObj = new Date(item.appointmentDate);
          const date = dateObj.toLocaleDateString('vi-VN');
          const time = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

          return {
            id: item.appointmentId.toString(),
            patientName: item.userName,
            patientEmail: item.userEmail,
            date,
            time,
            status: item.status?.toLowerCase() || 'pending',
            symptoms: item.symptoms || ''
          };
        });

        setAppointments(transformedAppointments);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        toast.error('Không thể tải thông tin hồ sơ bác sĩ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);



  const handleAppointmentStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      if (newStatus === 'confirmed') {
        await confirmAppointment(appointmentId);
      } else if (newStatus === 'cancelled') {
        await cancelAppointment(appointmentId);
      }

      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
        )
      );
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };


  const handleProfileUpdate = async () => {
    if (!profile) return;
    try {
      const payload = {
        specialization: profile.specialization,
        yearsOfExperience: profile.yearsOfExperience,
        bio: profile.bio,
        hospitalName: profile.hospitalName,
        isActive: true
      };
      await updateDoctorProfile(profile.doctorId.toString(), payload);
      setIsEditingProfile(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng bệnh nhân</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn gần đây</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.date} - {appointment.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quản lý lịch hẹn</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Lịch
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Thời gian
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày & Giờ
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
              {appointments
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (appointment.status === 'confirmed') {
                        setSelectedPatient(appointment);
                      } else {
                        toast.info('Bạn cần xác nhận lịch hẹn trước khi xem chi tiết bệnh nhân.');
                      }
                    }}
                  >

                    {/* Bệnh nhân */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                      </div>
                    </td>

                    {/* Ngày & Giờ */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAppointmentStatusUpdate(appointment.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAppointmentStatusUpdate(appointment.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleAppointmentStatusUpdate(appointment.id, 'completed')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center py-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!profile) return null;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
          {!isEditingProfile ? (
            <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
              <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                <X className="h-4 w-4 mr-2" /> Hủy
              </Button>
              <Button variant="primary" onClick={handleProfileUpdate}>
                <Save className="h-4 w-4 mr-2" /> Lưu
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={profile.userImageUrl || ''}
                alt={profile.userName}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{profile.userName}</h3>
                <p className="text-gray-600">{profile.specialization}</p>
                <p className="text-gray-600">{profile.hospitalName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={profile.userName}
                  onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.userEmail}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={profile.userPhone}
                  onChange={(e) => setProfile({ ...profile, userPhone: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh viện/Phòng khám</label>
                <input
                  type="text"
                  value={profile.hospitalName}
                  onChange={(e) => setProfile({ ...profile, hospitalName: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm (năm)</label>
                <input
                  type="number"
                  value={profile.yearsOfExperience}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Tabs */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="px-4 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-sm text-gray-600 mt-1">Chào mừng, {user?.name}</p>
        </div>
        <nav className="flex flex-col space-y-1 px-4 py-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'overview'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'appointments'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Lịch hẹn
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'profile'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Hồ sơ
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'schedule'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Lịch làm việc
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tính năng lịch làm việc đang được phát triển</p>
          </div>
        )}
      </div>
      {selectedPatient && (
        <PatientDetailsModal
          patientName={selectedPatient.patientName}
          patientEmail={selectedPatient.patientEmail}
          symptoms={selectedPatient.symptoms}
          onClose={() => setSelectedPatient(null)}
          onChat={() => {
            setSelectedPatient(null);
            navigate(`/chat/${selectedPatient.id}`);
          }}
          onVideoCall={() => {
            setSelectedPatient(null);
            navigate(`/video-call/${selectedPatient.id}`);
          }}
        />
      )}
    </div>
  );

};

export default DoctorDashboard;