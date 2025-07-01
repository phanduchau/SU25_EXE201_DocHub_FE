import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, FileText } from 'lucide-react';
import CustomCalendar from '../components/Calendar';
import { getAppointmentsByUserId, cancelAppointment } from '../apis/booking/appointmentApi';
import { useAuthContext } from '../contexts/AuthContext';
import AppointmentActionsModal from '../components/AppointmentActionsModal';
import { toast } from 'react-toastify';
import CancelAppointmentModal from '../components/CancelAppointmentModal';

interface Appointment {
  appointmentId: string;
  doctorName: string;
  imageDoctor: string | null;
  appointmentDate: string;
  appointmentTime: string;
  specialization: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const Appointments: React.FC = () => {
  const { user } = useAuthContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentIdToCancel, setAppointmentIdToCancel] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.sub) return;

      try {
        const raw = await getAppointmentsByUserId(user.sub);

        const mapped = raw.map((item: any): Appointment => {
          return {
            appointmentId: item.appointmentId,
            doctorName: item.doctorName || 'Không rõ',
            specialization: item.specialization || '',
            imageDoctor: item.doctorImageUrl || '',
            appointmentDate: item.appointmentDate,
            appointmentTime: format(new Date(item.appointmentDate), 'HH:mm'),
            status: item.status,
          };
        });

        setAppointments(mapped);
      } catch (error) {
        console.error('Lỗi khi tải cuộc hẹn:', error);
      }
    };

    fetchAppointments();
  }, [user]);

  const appointmentsToday = appointments.filter(
    apt => format(new Date(apt.appointmentDate), 'yyyy-MM-dd') === format(selectedDate!, 'yyyy-MM-dd')
  );

  const renderStatusBadge = (status: Appointment['status']) => {
    const badgeMap = {
      pending: { color: 'yellow', text: 'Chờ xác nhận' },
      confirmed: { color: 'blue', text: 'Đã xác nhận' },
      completed: { color: 'green', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
    };
    const { color, text } = badgeMap[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        <span className={`w-1.5 h-1.5 mr-1.5 bg-${color}-500 rounded-full`}></span>
        {text}
      </span>
    );
  };

  const filteredAppointments = appointments.filter((apt) =>
    filter === 'all' ? true : apt.status === filter
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Theo dõi lịch trình của bạn</h1>
            <p className="text-gray-600">Quản lý và theo dõi các cuộc hẹn y tế của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((key) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-4 py-2 rounded-md font-medium ${filter === key
                        ? `bg-${key === 'pending' ? 'yellow' : key === 'confirmed' ? 'blue' : key}-100 text-${key === 'pending' ? 'yellow' : key === 'confirmed' ? 'blue' : key}-700`
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {{
                        all: 'Tất cả',
                        pending: 'Chờ xác nhận',
                        confirmed: 'Đã xác nhận',
                        completed: 'Đã hoàn thành',
                        cancelled: 'Đã hủy',
                      }[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {paginatedAppointments.map((apt) => {
                  const daysDiff =
                    (new Date(apt.appointmentDate).getTime() -
                      new Date().setHours(0, 0, 0, 0)) /
                    (1000 * 60 * 60 * 24);

                  const canCancel = daysDiff >= 3;

                  return (
                    <div
                      key={apt.appointmentId}
                      onClick={() => apt.status === 'confirmed' && setSelectedAppointment(apt)}
                      className="p-4 hover:bg-gray-100 cursor-pointer transition rounded-md"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <img
                            src={apt.imageDoctor || 'https://via.placeholder.com/150'}
                            alt={apt.doctorName}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{apt.doctorName}</h3>
                            <p className="text-sm text-gray-600">{apt.specialization}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-700">
                              {format(new Date(apt.appointmentDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-700">{apt.appointmentTime}</span>
                          </div>
                          {renderStatusBadge(apt.status)}
                          <div className="flex space-x-2 ml-auto">
                            {apt.status === 'confirmed' && (
                              canCancel ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAppointmentIdToCancel(apt.appointmentId);
                                    setCancelModalOpen(true);
                                  }}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  Hủy
                                </button>
                              ) : (
                                <button
                                  disabled
                                  title="Không thể hủy vì cuộc hẹn đã gần kề (dưới 3 ngày)"
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                                >
                                  Hủy
                                </button>
                              )
                            )}
                            {apt.status === 'completed' && (
                              <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                                <FileText className="h-3 w-3 mr-1" /> Xem kết quả
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredAppointments.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-2">Không có cuộc hẹn nào</p>
                  </div>
                )}
              </div>
            </div>
            {totalPages > 1 && (
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
            )}
          </div>

          <div className="md:col-span-1">
            <CustomCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {selectedDate && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-900 mb-4">Lịch hẹn trong ngày</h3>
                <div className="space-y-4">
                  {appointmentsToday.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">Không có cuộc hẹn nào trong ngày này</p>
                  ) : (
                    appointmentsToday.map((apt) => (
                      <div key={apt.appointmentId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <img
                            src={apt.imageDoctor || 'https://via.placeholder.com/150'}
                            alt={apt.doctorName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-sm">{apt.doctorName}</p>
                            <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                          </div>
                        </div>
                        {renderStatusBadge(apt.status)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <AppointmentActionsModal
          appointmentId={selectedAppointment.appointmentId}
          doctorName={selectedAppointment.doctorName}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      <CancelAppointmentModal
  open={cancelModalOpen}
  onClose={() => {
    setCancelModalOpen(false);
    setAppointmentIdToCancel(null);
  }}
  onConfirm={async (reason) => {
    if (!appointmentIdToCancel) return;
    try {
      await cancelAppointment(appointmentIdToCancel, reason);
      toast.success('Đã hủy cuộc hẹn');
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentIdToCancel
            ? { ...a, status: 'cancelled' }
            : a
        )
      );
    } catch (error) {
      toast.error('Lỗi khi hủy cuộc hẹn');
      console.error(error);
    } finally {
      setCancelModalOpen(false);
      setAppointmentIdToCancel(null);
    }
  }}
  cancelBy="patient"
/>
    </div>
  );
};

export default Appointments;
