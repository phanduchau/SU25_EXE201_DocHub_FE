import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selectedDate: propSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(propSelectedDate || null);

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(prev => addDays(prev, -7))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-900">
          {format(currentDate, dateFormat, { locale: vi })}
        </span>
        <button
          onClick={() => setCurrentDate(prev => addDays(prev, 7))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-500 text-sm">
          {format(addDays(startDate, i), dateFormat, { locale: vi })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isToday = isSameDay(day, new Date());

      days.push(
        <button
          key={i}
          onClick={() => onDateClick(day)}
          className={`
            p-2 rounded-lg text-center transition-colors
            ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'}
            ${isToday && !isSelected ? 'bg-teal-50 text-teal-600' : ''}
          `}
        >
          <span className="text-sm">{format(day, 'd')}</span>
        </button>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{days}</div>;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;