import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import CustomCalendar from '../components/Calendar';

const appointmentsData = [
  {
    id: '1',
    doctorName: 'BS. Trần Đức Anh',
    doctorSpecialty: 'Khoa Thần kinh',
    doctorImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-06-10',
    time: '10:00',
    status: 'upcoming'
  },
  {
    id: '2',
    doctorName: 'BS. Lê Hoàng Việt',
    doctorSpecialty: 'Khoa nhi',
    doctorImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-06-15',
    time: '14:30',
    status: 'upcoming'
  },
  {
    id: '3',
    doctorName: 'BS. Bùi Thanh Hoàng',
    doctorSpecialty: 'Khoa da liễu',
    doctorImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-05-28',
    time: '09:00',
    status: 'completed'
  },
  {
    id: '4',
    doctorName: 'BS. Lê Quang Vinh',
    doctorSpecialty: 'Khoa thần kinh',
    doctorImage: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-05-20',
    time: '11:30',
    status: 'cancelled'
  },
];

const Appointments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const filteredAppointments = appointmentsData.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Theo dõi lịch trình của bạn</h1>
            <p className="text-gray-600">Quản lý và theo dõi các cuộc hẹn y tế của bạn</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 flex flex-col items-center">
              <div className="text-2xl font-bold text-teal-500">87</div>
              <div className="text-sm text-gray-600">Số cuộc hẹn hoàn thành</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-500">10</div>
              <div className="text-sm text-gray-600">Sự kiện trong tháng</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 flex flex-col items-center">
              <div className="text-2xl font-bold text-green-500">5</div>
              <div className="text-sm text-gray-600">Sự kiện hôm nay</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md font-medium ${
                      filter === 'all'
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-md font-medium ${
                      filter === 'upcoming'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Sắp tới
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-md font-medium ${
                      filter === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    onClick={() => setFilter('cancelled')}
                    className={`px-4 py-2 rounded-md font-medium ${
                      filter === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <img
                          src={appointment.doctorImage}
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                          <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">
                            {format(new Date(appointment.date), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">{appointment.time}</span>
                        </div>
                        
                        <div>
                          {appointment.status === 'upcoming' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full"></span>
                              Sắp tới
                            </span>
                          )}
                          {appointment.status === 'completed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
                              Hoàn thành
                            </span>
                          )}
                          {appointment.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
                              Đã hủy
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-auto">
                          {appointment.status === 'upcoming' && (
                            <>
                              <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-teal-600 hover:bg-teal-700">
                                Thay đổi
                              </button>
                              <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200">
                                Hủy
                              </button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                              <FileText className="h-3 w-3 mr-1" />
                              Xem kết quả
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredAppointments.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-2">Không có cuộc hẹn nào</p>
                    <button className="text-teal-600 font-medium hover:text-teal-800">
                      Đặt lịch ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <CustomCalendar 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            
            {selectedDate && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-900 mb-4">Lịch hẹn trong ngày</h3>
                <div className="space-y-4">
                  {appointmentsData
                    .filter(apt => format(new Date(apt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                    .map(apt => (
                      <div key={apt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <img
                            src={apt.doctorImage}
                            alt={apt.doctorName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-sm">{apt.doctorName}</p>
                            <p className="text-xs text-gray-500">{apt.time}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status === 'upcoming' ? 'Sắp tới' :
                           apt.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </span>
                      </div>
                    ))
                  }
                  
                  {appointmentsData
                    .filter(apt => format(new Date(apt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                    .length === 0 && (
                    <p className="text-center text-gray-500 text-sm">Không có cuộc hẹn nào trong ngày này</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;