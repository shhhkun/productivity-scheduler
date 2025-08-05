import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function CalendarPicker({ selectedDate, onSelectDate }) {
  return (
    <div className="p-2 rounded-xl shadow-md z-50 flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        weekStartsOn={0}
        classNames={{
          day: 'rounded-full w-9 h-9 hover:bg-[var(--hover2)]', // circle hover (of day) bg
          selected: 'bg-[var(--accent)] text-[var(--text)]', // text overridden by css (need fix)
        }}
      />
    </div>
  );
}
