import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

const AgendaSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const today = new Date();

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MM/dd'),
    };
  });

  return (
    <div
      className={`fixed top-4 left-4 w-[180px] rounded-xl
        border-2
        transition-colors duration-300 ease-in-out
        ${
          isOpen
            ? 'bg-[rgb(17,24,39)] border-[rgb(120,130,140)]'
            : 'bg-[rgb(230,245,240)] border-[rgb(167,243,208)]'
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
              className="rounded-md px-2 py-1 cursor-pointer
                hover:bg-[rgb(60,65,75)]
                text-[rgb(180,180,190)]
                flex justify-between
                transition-colors duration-200"
            >
              <span>{entry.day}</span>
              <span className="text-[rgb(120,140,160)]">{entry.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgendaSidebar;
