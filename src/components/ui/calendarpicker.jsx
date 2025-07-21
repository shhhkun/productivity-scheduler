import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function CalendarPicker({ selectedDate, onSelectDate }) {
  return (
    <div className="p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-md z-50 flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        weekStartsOn={0}
        classNames={{
          caption: 'text-gray-100 font-medium mb-2',
          head_row: 'text-gray-400',
          day: 'rounded-full w-9 h-9 hover:bg-gray-800',
          selected: 'bg-[rgb(167,243,208)] text-[rgb(17,24,39)]',
          today: 'text-mint-300',
          nav_button_previous:
            'text-[rgb(167,243,208)] hover:text-[rgb(110,231,183)]',
          nav_button_next:
            'text-[rgb(167,243,208)] hover:text-[rgb(110,231,183)]',
        }}
      />
    </div>
  );
}
