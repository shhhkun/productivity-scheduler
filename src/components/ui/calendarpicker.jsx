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
          caption: 'var(--test) font-medium mb-2', // no visible effect?
          head_row: 'var(--test)', // no visible effect?
          day: 'rounded-full w-9 h-9 hover:bg-[var(--hover2)]', // circle hover (of day) bg
          selected: 'bg-[var(--accent)] text-[var(--text)]',
          today: 'var(--accent)',
          /*nav_button_previous:
            'text-[var(--test)] hover:text-[rgb(110,231,183)]', // has no effect currently, '< >' nav controlled via .rdp-chevron in index.css
          nav_button_next:
            'text-[rgb(167,243,208)] hover:text-[rgb(110,231,183)]',*/
        }}
        style={{
          backgroundColor: 'var(--bg)',
        }}
      />
    </div>
  );
}
