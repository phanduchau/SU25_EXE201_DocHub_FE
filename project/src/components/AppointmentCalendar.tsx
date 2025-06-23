import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true }
];

interface AppointmentCalendarProps {
  onSelectDate?: (date: Date) => void;
  onSelectTime?: (time: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  onSelectDate,
  onSelectTime
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date && onSelectDate) {
      onSelectDate(date);
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    if (onSelectTime) {
      onSelectTime(time);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Đặt lịch khám</h3>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            locale={vi}
            minDate={new Date()}
            className="w-full"
            calendarClassName="border border-gray-200 rounded-lg shadow"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn thời gian - {selectedDate ? format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi }) : ''}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelection(slot.time)}
                  className={`flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedTime === slot.time
                      ? 'bg-teal-500 text-white'
                      : slot.available
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <Clock size={14} className="mr-1" />
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;