import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';
import Toaster from '@/components/ui/toaster';
import XpStreakDisplay from '@/components/ui/xpstreakdisplay';
import RankBadge from '@/components/ui/rankbadge';
import DebugMenu from '@/components/ui/debugmenu';
import DaySelectorBar from '@/components/ui/dayselectorbar';
import AgendaSidebar from '@/components/ui/agendasidebar';

import useFirebaseUser from '@/hooks/usefirebaseuser';
import useAuth from '@/hooks/useauth';
import useTaskHandlers from '@/hooks/usetaskhandlers';
import useWeekNav from '@/hooks/useweeknav';
import useClock from '@/hooks/useclock';
import useWindowSize from '@/hooks/usewindowsize';
import useConfetti from '@/hooks/useconfetti';
import useRankBadge from '@/hooks/userankbadge';
import { getLevelXpInfo, useLevelUp } from '@/hooks/levelxp';

import COLORS from '@/utils/colors';
import { formatTime, formatDate, generateTimeSlots } from '@/utils/time';

import TaskModal from './TaskModal';
import ScheduleGrid from './ScheduleGrid';
import AuthScreen from './AuthScreen';

function App() {
  // firebase
  const {
    user,
    xp,
    setXp,
    level,
    setLevel,
    tasks,
    setTasks,
    userDataLoaded,
    loadingUserData,
  } = useFirebaseUser();

  const { signUp, logIn, logOut } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date()); // day selector for 7-day window top bar
  const selectedDateString = selectedDate.toISOString().split('T')[0]; // formated select date for comparisons (YYYY-MM-DD)
  const [taskDate, setTaskDate] = useState(new Date(selectedDate)); // use the parent's selectedDate as the default for the new task date

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'Work',
    description: '',
    date: selectedDate.toISOString().split('T')[0],
  });

  const {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskCompletion,
    getTasksForTimeSlot,
  } = useTaskHandlers({
    tasks,
    setTasks,
    taskDate,
    selectedDateString,
    setXp,
    isAddingTask,
    setIsAddingTask,
    editingTask,
    setEditingTask,
    newTask,
    setNewTask,
  });

  useLevelUp(xp, level, setLevel); // custom util to handle level up logic

  const currentTime = useClock(); // custom hook to get current time for clock

  const { width, height } = useWindowSize(); // dimensions for confetti effect
  const showConfetti = useConfetti(level, userDataLoaded); // confetti effect on level up

  const currentTier = useRankBadge(level); // get user's rank badge based on level

  const { currentWeekStart, goToNextWeek, goToPreviousWeek } =
    useWeekNav(setSelectedDate); // week navigation hooks

  const timeSlots = generateTimeSlots(); // time slots for the schedule grid

  const getCategoryColor = (category) => {
    // task cateogory legend managing
    return COLORS.find((c) => c.name === category) || COLORS[0];
  };

  const [showCalendar, setShowCalendar] = useState(false); // controls calendar popover visibility

  const { xpToNextLevel, levelProgress } = getLevelXpInfo(xp, level); // get XP and level info for bottom display bar

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [theme, setTheme] = useState('original'); // state for alternative (dark, light) themes toggle

  if (loadingUserData) {
    //console.log('[Render] Still loading user data...');
    return <div>Loading user data...</div>;
  }

  if (!user) {
    console.log('[Render] No user found. Showing login.');
    return (
      <div className={`theme-${theme} min-h-screen`}>
        <AuthScreen
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPass={loginPass}
          setLoginPass={setLoginPass}
          logIn={logIn}
          signUp={signUp}
        />
      </div>
    );
  }

  return (
    <div className={`theme-${theme} min-h-screen`}>
      {/* Confetti effect on level up */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            key="confetti"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              overflow: 'hidden',
              zIndex: 1000, // ensure confetti is on top
            }}
          >
            <Confetti width={width} height={height} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
        <div className="flex">
          <AgendaSidebar
            tasks={tasks}
            currentWeekStart={currentWeekStart}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <HelmetProvider>
          <title>Productivity Scheduler - Organize Your Day</title>
          <meta
            name="description"
            content="A minimalistic productivity scheduler with color-coded blocks to help you organize your daily tasks and activities."
          />
        </HelmetProvider>
        <div className="container mx-auto px-4 py-6 pb-28">
          {/* Header with Clock */}
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center mb-8"
          >
            <div className="glass-effect rounded-2xl p-6 mb-4 mint-glow">
              <div className="digital-clock text-4xl md:text-6xl font-bold text-mint-300 mb-2">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-400 text-lg">
                {formatDate(currentTime)}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
              Productivity Scheduler
            </h1>
            <p className="text-gray-400">
              Organize your day with color-coded time blocks
            </p>
          </motion.div>

          {/* Add Task Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setIsAddingTask(true)}
              className="bg-mint-500 hover:bg-mint-600 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--text)',
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </div>

          {/* Modal Form */}
          <TaskModal
            isOpen={isAddingTask || editingTask}
            onClose={() => {
              setIsAddingTask(false);
              setEditingTask(null);
              setNewTask({
                title: '',
                startTime: '',
                endTime: '',
                category: 'Work',
                description: '',
              });
            }}
            editingTask={editingTask}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
            handleUpdateTask={handleUpdateTask}
            taskDate={taskDate}
            setTaskDate={setTaskDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />

          {/* Day/Week Selector Bar */}
          <div className="flex w-full items-center justify-between px-4">
            {/* Left Arrow */}
            <button
              onClick={goToPreviousWeek}
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--text)',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
              }}
            >
              ←
            </button>

            <div className="flex-1 mx-4">
              <DaySelectorBar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                currentWeekStart={currentWeekStart}
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNextWeek}
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--text)',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
              }}
            >
              →
            </button>
          </div>

          {/* Schedule Grid/Timetable */}
          <ScheduleGrid
            timeSlots={timeSlots}
            getTasksForTimeSlot={getTasksForTimeSlot}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            toggleTaskCompletion={toggleTaskCompletion}
            getCategoryColor={getCategoryColor}
          />

          {/* Task Color Category Legend */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="glass-effect rounded-2xl p-6 mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Color Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {COLORS.map((color) => (
                <div key={color.name} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${color.color}`}></div>
                  <span className="text-sm text-gray-300">{color.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sticky XP/Streak/Badge Display */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-gray-900 border-t border-gray-700 shadow-inner px-4 py-3">
          <div className="relative flex items-center justify-between w-full min-h-[72px]">
            {/* Left: Badge */}
            <div className="flex items-center h-full">
              <RankBadge tier={currentTier} userDataLoaded={userDataLoaded} />
            </div>

            {/* Center: XP & Streak */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full max-w-xl px-4">
              <XpStreakDisplay
                xp={xp}
                level={level}
                xpToNextLevel={xpToNextLevel}
                levelProgress={levelProgress}
              />
            </div>

            {/* Right: empty */}
            <div className="w-[64px] h-full" />
          </div>
        </div>

        {/* Debug Menu: for all sorts of things */}
        <DebugMenu
          addXP={(amount) => setXp((prev) => prev + amount)}
          resetProgress={() => {
            setXp(0);
            setLevel(1);
          }}
          theme={theme}
          setTheme={setTheme}
          logOut={logOut}
        />

        <Toaster />
      </div>
    </div>
  );
}

export default App;
