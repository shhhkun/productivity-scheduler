import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

const COLORS = [
  { name: 'Work', color: 'bg-blue-500', light: 'bg-blue-400' },
  { name: 'Personal', color: 'bg-green-500', light: 'bg-green-400' },
  { name: 'Health', color: 'bg-red-500', light: 'bg-red-400' },
  { name: 'Learning', color: 'bg-purple-500', light: 'bg-purple-400' },
  { name: 'Social', color: 'bg-yellow-500', light: 'bg-yellow-400' },
  { name: 'Break', color: 'bg-gray-500', light: 'bg-gray-400' },
];

const AgendaSidebar = ({
  tasks,
  currentWeekStart,
  selectedDate,
  setSelectedDate,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    const dateStr = date.toISOString().split('T')[0];
    const tasksForDay = tasks?.[dateStr] || [];
    const incompleteCount = tasksForDay.filter(
      (task) => !task.completed
    ).length;

    return {
      day: format(date, 'EEE'),
      date: format(date, 'MM/dd'),
      dateObj: date,
      incompleteCount,
      tasksForDay,
      isSelected:
        format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
    };
  });

  // Helper: get color class by category name
  const getCategoryColor = (category) => {
    const cat = COLORS.find(
      (c) => c.name.toLowerCase() === category?.toLowerCase()
    );
    return cat ? cat.color : 'bg-gray-400'; // fallback color
  };

  return (
    <div
      className={`fixed top-4 left-4 w-[180px] rounded-xl
        border-2
        transition-colors duration-300 ease-in-out
        ${
          isOpen
            ? 'bg-[rgb(17,24,39)] border-[rgb(120,130,140)]'
            : 'bg-[rgb(167,243,208)] border-[rgb(167,243,208)]'
        }
        text-[rgb(200,200,210)]
        shadow-md p-2 flex flex-col z-50
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="agenda-list"
        className={`flex items-center w-full text-left
          rounded-md
          py-2 px-3
          font-semibold
          transition-colors duration-300 ease-in-out
          outline-none
          focus:outline-none focus:ring-0 focus:bg-transparent active:bg-transparent
          ${
            isOpen
              ? 'bg-[rgb(28,35,50)] text-[rgb(167,243,208)] hover:text-[rgb(140,220,190)]'
              : 'bg-[rgb(167,243,208)] text-[rgb(17,24,39)] hover:text-[rgb(50,80,70)]'
          }
          select-none
          `}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="ml-1">Agenda</span>
      </button>

      {isOpen && (
        <ul
          id="agenda-list"
          className="overflow-y-auto max-h-[calc(100vh-140px)] space-y-1 pl-1 mt-2"
        >
          {week.map((entry, idx) => (
            <li
              key={idx}
              onClick={() => setSelectedDate(entry.dateObj)}
              className={`rounded-xl px-2 py-1 cursor-pointer
    flex flex-col transition-colors duration-200
    ${
      entry.isSelected
        ? 'bg-[rgb(28,35,50)] text-[rgb(167,243,208)] font-semibold'
        : 'text-[rgb(180,180,190)] hover:bg-[rgb(60,65,75)]'
    }
  `}
            >
              <div className="flex justify-between items-center">
                <span>{entry.day}</span>
                <span className="flex items-center gap-2 text-[rgb(120,140,160)]">
                  {entry.date}
                  {entry.incompleteCount > 0 && (
                    <span
                      className="inline-block bg-red-600 text-white rounded-full px-2 text-xs font-bold select-none"
                      title={`${entry.incompleteCount} incomplete task${entry.incompleteCount > 1 ? 's' : ''}`}
                    >
                      {entry.incompleteCount}
                    </span>
                  )}
                </span>
              </div>

              {/* Render tasks under the date */}
              {entry.tasksForDay.length > 0 && (
                <ul className="mt-1 pl-4 max-h-20 overflow-y-auto text-xs text-[rgb(180,180,190)]">
                  {entry.tasksForDay
                    .filter((task) => !task.completed) // <- filter out completed tasks
                    .sort((a, b) => {
                      // parse "HH:mm" strings to minutes from midnight
                      const parseTimeToMinutes = (t) => {
                        const [h, m] = t.split(':').map(Number);
                        return h * 60 + m;
                      };
                      return (
                        parseTimeToMinutes(a.startTime) -
                        parseTimeToMinutes(b.startTime)
                      );
                    })

                    .map((task, taskIdx) => {
                      const colorClass = getCategoryColor(task.category);
                      let formattedTime = '';
                      if (task.startTime) {
                        // format "HH:mm" string to "hh:mm AM/PM"
                        const [hourStr, minuteStr] = task.startTime.split(':');
                        const hour = parseInt(hourStr, 10);
                        const minute = parseInt(minuteStr, 10);
                        const dateObj = new Date();
                        dateObj.setHours(hour, minute, 0, 0);
                        try {
                          formattedTime = format(dateObj, 'hh:mm a');
                        } catch {
                          formattedTime = task.startTime;
                        }
                      }

                      return (
                        <li
                          key={taskIdx}
                          className="mb-0.5 flex items-center gap-1"
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${colorClass}`}
                            title={task.category}
                          ></span>
                          <span>{task.title}</span>
                          {formattedTime && (
                            <span className="ml-auto text-[rgb(120,140,160)]">
                              {formattedTime}
                            </span>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgendaSidebar;
