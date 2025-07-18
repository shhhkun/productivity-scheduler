import React from 'react';
import { format, addDays } from 'date-fns';

export default function DaySelectorBar({ selectedDate, setSelectedDate }) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    return (
        <div className="flex justify-between px-2 py-2 bg-gray-900 rounded-full mb-2 shadow-sm">
            {days.map((day, idx) => {
                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                return (
                    <button
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`flex-1 text-center py-2 mx-1 rounded-full transition-all text-sm font-medium
                            ${isSelected 
                                ? '' 
                                : 'hover:bg-gray-800'}
                        `}
                        style={{
                            backgroundColor: isSelected ? 'rgb(167, 243, 208)' : 'transparent',
                            color: isSelected ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)',
                        }}
                    >
                        <div>{format(day, 'EEE')}</div>
                        <div>{format(day, 'd')}</div>
                    </button>
                );
            })}
        </div>
    );
}
