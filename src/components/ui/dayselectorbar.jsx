import { format, addDays } from 'date-fns';

export default function DaySelectorBar({ selectedDate, setSelectedDate, currentWeekStart }) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

    return (
        <div className="flex justify-between px-2 py-2 rounded-full mb-2 shadow-sm"
            style={{
                backgroundColor: 'var(--bg)'
            }}
        >
            {days.map((day, idx) => {
                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                return (
                    <button
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`flex-1 text-center py-2 mx-1 rounded-full transition-all text-sm font-medium
                            ${isSelected
                                ? ''
                                : 'hover:bg-[var(--hover2)]'}
                        `}
                        style={{
                            backgroundColor: isSelected ? 'var(--button-bg)' : 'transparent',
                            color: isSelected ? 'var(--text)' : 'var(--text2)',
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
