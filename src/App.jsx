import { useState, useEffect, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Edit3, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Modal from '@/components/ui/modal';
import CompleteButton from '@/components/ui/completebutton';
import XpStreakDisplay from '@/components/ui/xpstreakdisplay';
import Confetti from 'react-confetti';
import { useWindowSize } from './hooks/usewindowsize';
import RankBadge from './components/ui/rankbadge';
import DebugMenu from './components/ui/debugmenu';
import DaySelectorBar from './components/ui/dayselectorbar';
import CalendarPicker from './components/ui/calendarpicker';
import AgendaSidebar from './components/ui/agendasidebar';

import useFirebaseUser from './hooks/usefirebaseuser';
import useAuth from './hooks/useauth';
import useTaskHandlers from './hooks/usetaskhandlers';
import useWeekNav from './hooks/useweeknav';
import useClock from './hooks/useclock';
import useConfetti from './hooks/useconfetti';
import useRankBadge from './hooks/userankbadge'; 
import COLORS from './utils/colors';
import { getLevelXpInfo, useLevelUp } from './utils/levelxp';
import { formatTime, formatDate, generateTimeSlots } from './utils/time';

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

  // day selector state (for 7-day window topbar)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // format selected date for comparison (YYYY-MM-DD)
  const selectedDateString = selectedDate.toISOString().split('T')[0];

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

  const { currentWeekStart, goToNextWeek, goToPreviousWeek } = useWeekNav(); // week navigation hooks

  const timeSlots = generateTimeSlots(); // time slots for the schedule grid

  const getCategoryColor = (category) => { // task cateogory legend managing
    return COLORS.find((c) => c.name === category) || COLORS[0];
  };

  const [taskDate, setTaskDate] = useState(new Date(selectedDate)); // use the parent's selectedDate as the default for the new task date
  const [showCalendar, setShowCalendar] = useState(false); // controls calendar popover visibility

  const { xpToNextLevel, levelProgress } = getLevelXpInfo(xp, level); // get XP and level info for bottom display bar

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // XP and Streak states [NOT YET IMPLEMENTED LOGIC]
  const [streak, setStreak] = useState(0); // update firestore fetch to include streak later

  if (loadingUserData) {
    //console.log('[Render] Still loading user data...');
    return <div>Loading user data...</div>;
  }

  if (!user) {
    console.log('[Render] No user found. Showing login.');
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-100 p-4">
        <h2 className="text-2xl mb-4">Sign In</h2>

        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Email"
          className="mb-2 p-2 rounded bg-gray-800 border border-gray-600 text-gray-100 w-64"
        />
        <input
          type="password"
          value={loginPass}
          onChange={(e) => setLoginPass(e.target.value)}
          placeholder="Password"
          className="mb-4 p-2 rounded bg-gray-800 border border-gray-600 text-gray-100 w-64"
        />

        <div className="flex flex-col items-center gap-1 w-64">
          {/* Sign In button - prominent */}
          <button
            onClick={() => logIn(loginEmail, loginPass)}
            style={{
              backgroundColor: 'rgb(167, 243, 208)', // mint background
              color: 'rgb(17, 24, 39)', // dark blue text
              borderRadius: '8px', // rounded corners
              //width: '256px',
              padding: '12px 24px',
              fontWeight: '600', // semibold font
              border: 'none',
              cursor: 'pointer',
              minWidth: '120px', // ensures button won't be too small
              marginBottom: '12px',
            }}
          >
            Sign In
          </button>

          {/* Sign Up button */}
          <button
            onClick={() => signUp(loginEmail, loginPass)}
            className="text-gray-400 underline text-sm hover:text-gray-200"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '64',
              padding: 0,
            }}
            aria-label="Create a new account"
          >
            Create an account
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
          {/*<div className="text-gray-300 mb-2">Welcome, {user.email}</div>*/}

          <title>Productivity Scheduler - Organize Your Day</title>
          <meta
            name="description"
            content="A beautiful, minimalistic productivity scheduler with color-coded blocks to help you organize your daily tasks and activities."
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
                backgroundColor: 'rgb(167, 243, 208)',
                color: 'rgb(17, 24, 39)',
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </div>

          {/* Modal Form */}
          <Modal
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
          >
            <>
              <h3
                className="text-xl font-semibold mb-4 text-mint-300"
                style={{ color: 'rgb(167, 243, 208)' }}
              >
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>

              {/* Calendar Date Picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Date
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalendar((prev) => !prev)}
                  className="w-full flex items-center justify-between bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 hover:border-[rgb(167,243,208)] transition-all"
                >
                  <span>{taskDate.toDateString()}</span>

                  {/* calendar icon using SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[rgb(167,243,208)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H3.5A1.5 1.5 0 002 5.5v11A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0016.5 4H15V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM3.5 6h13a.5.5 0 01.5.5V8H3V6.5a.5.5 0 01.5-.5zm0 3h13v7.5a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {showCalendar && (
                  <div className="mt-2">
                    <CalendarPicker
                      selectedDate={taskDate}
                      onSelectDate={(date) => {
                        setTaskDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-mint-500 focus:outline-none"
                    placeholder="Enter task title..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-mint-500 focus:outline-none"
                  >
                    {COLORS.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-mint-500 focus:outline-none"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newTask.endTime}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-mint-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-mint-500 focus:outline-none"
                  rows="3"
                  placeholder="Add task description..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="bg-mint-500 hover:bg-mint-600 text-gray-900 font-semibold px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgb(167, 243, 208)',
                    color: 'rgb(17, 24, 39)',
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
                <Button
                  onClick={() => {
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
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          </Modal>

          {/* Day/Week Selector Bar */}
          <div className="flex w-full items-center justify-between px-4">
            {/* Left Arrow */}
            <button
              onClick={goToPreviousWeek}
              style={{
                backgroundColor: 'rgb(167, 243, 208)',
                color: 'rgb(17, 24, 39)',
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
                backgroundColor: 'rgb(167, 243, 208)',
                color: 'rgb(17, 24, 39)',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
              }}
            >
              →
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar
                className="w-6 h-6 text-mint-300"
                style={{
                  color: 'rgb(167, 243, 208)',
                }}
              />
              <h2 className="text-2xl font-semibold text-gray-100">
                Today's Schedule
              </h2>
            </div>

            <div className="space-y-2">
              {timeSlots.map((time, index) => {
                const tasksInSlot = getTasksForTimeSlot(time);
                return (
                  <motion.div
                    key={time}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.02,
                    }}
                    className="time-slot flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <div className="w-16 text-sm font-mono text-gray-400 flex-shrink-0">
                      {time}
                    </div>

                    <div className="flex-1 min-h-[40px] flex items-center gap-2">
                      {tasksInSlot.length > 0 ? (
                        tasksInSlot.map((task) => {
                          const categoryColor = getCategoryColor(task.category);
                          return (
                            <motion.div
                              key={task.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              whileHover={{ scale: 1.02 }}
                              className={`
                                schedule-block
                                ${categoryColor.color}
                                ${task.completed ? 'opacity-70 saturate-50' : ''}
                                rounded-lg p-3 flex-1 min-w-0 relative group
                                transition-all duration-300
                              `}
                            >
                              <div className="flex items-center justify-between">
                                {/* New completion button (left of content) */}
                                <div className="mr-3">
                                  <CompleteButton
                                    completed={task.completed}
                                    onToggle={() =>
                                      toggleTaskCompletion(task.id)
                                    }
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4
                                    className={`font-semibold truncate ${task.completed ? 'opacity-50 line-through' : 'text-white'}`}
                                  >
                                    {task.title}
                                  </h4>
                                  <p
                                    className={`text-xs ${task.completed ? 'opacity-50' : 'text-white/80'}`}
                                  >
                                    {task.startTime} - {task.endTime}
                                  </p>
                                  {task.description && (
                                    <p
                                      className={`text-xs mt-1 truncate ${task.completed ? 'opacity-50' : 'text-white/70'}`}
                                    >
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="p-1 hover:bg-white/20 rounded"
                                  >
                                    <Edit3 className="w-3 h-3 text-white" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1 hover:bg-white/20 rounded"
                                  >
                                    <Trash2 className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-gray-500 text-sm italic">
                          No tasks scheduled
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Color Legend */}
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
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <XpStreakDisplay
                xp={xp}
                level={level}
                xpToNextLevel={xpToNextLevel}
                levelProgress={levelProgress}
                streak={streak}
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
            setCurrentTier('');
            setBadges([]);
            localStorage.clear();
          }}
          logOut={logOut}
        />

        <Toaster />
      </div>
    </>
  );
}

export default App;
