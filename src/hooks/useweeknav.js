import { useState } from 'react';
import { addDays, subDays } from 'date-fns';

export default function useWeekNav() {
  // point at first day of the 7-day window
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // week navigation handlers
  const goToNextWeek = () => {
    const nextWeek = addDays(currentWeekStart, 7);
    setCurrentWeekStart(nextWeek);
    setSelectedDate(nextWeek);
  };

  const goToPreviousWeek = () => {
    const prevWeek = subDays(currentWeekStart, 7);
    setCurrentWeekStart(prevWeek);
    setSelectedDate(prevWeek);
  };

  return {
    currentWeekStart,
    goToNextWeek,
    goToPreviousWeek,
  }
}
