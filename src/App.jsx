import React, { useState, useEffect, useRef } from 'react'; // added useRef
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Calendar, Edit3, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Modal from '@/components/ui/modal';
import CompleteButton from '@/components/ui/completebutton';
import XpStreakDisplay from '@/components/ui/xpstreakdisplay';
import BadgeDisplay from './components/ui/badgedisplay';
import Confetti from 'react-confetti';
import { useWindowSize } from './hooks/usewindowsize';
import RankBadge from './components/ui/rankbadge';
import DebugMenu from './components/ui/debugmenu';
import DaySelectorBar from './components/ui/dayselectorbar';

const COLORS = [
  {
    name: 'Work',
    color: 'bg-blue-500',
    light: 'bg-blue-400',
  },
  {
    name: 'Personal',
    color: 'bg-green-500',
    light: 'bg-green-400',
  },
  {
    name: 'Health',
    color: 'bg-red-500',
    light: 'bg-red-400',
  },
  {
    name: 'Learning',
    color: 'bg-purple-500',
    light: 'bg-purple-400',
  },
  {
    name: 'Social',
    color: 'bg-yellow-500',
    light: 'bg-yellow-400',
  },
  {
    name: 'Break',
    color: 'bg-gray-500',
    light: 'bg-gray-400',
  },
];

function getLevelXpInfo(xp, level) {
  // Cumulative XP to reach a level
  const getTotalXpForLevel = (lvl) => {
    let total = 0;
    for (let i = 1; i < lvl; i++) {
      total += 100 + (i - 1) * 20;
    }
    return total;
  };

  const xpForCurrentLevel = getTotalXpForLevel(level);
  const xpForNextLevel = getTotalXpForLevel(level + 1);

  const xpToNextLevel = xpForNextLevel - xp;
  const levelProgress =
    ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  const currentXpInLevel = xp - xpForCurrentLevel;

  return {
    xpToNextLevel,
    levelProgress: Math.max(0, Math.min(levelProgress, 100)),
    currentXpInLevel,
  };
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'Work',
    description: '',
  });
  const formRef = useRef(null); // create form reference

  // XP and Streak states
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  //const [lastCompletedDate, setLastCompletedDate] = useState(null);

  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  // rank badge states for tier and rank up animation
  const [currentTier, setCurrentTier] = useState('');
  //const [rankUp, setRankUp] = useState(false);

  // XP required to reach next level (e.g., Level 1: 100, Level 2: 120, etc.)
  const xpForLevel = (level) => 100 + (level - 1) * 20;

  // day selector state (for 7-day window topbar)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});

  // format selected date for comparison (YYYY-MM-DD)
  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // filter tasks for this date
  const tasksForSelectedDate = tasks[selectedDateString] || [];

  // load/save per-day task storage
  useEffect(() => {
    const saved = localStorage.getItem('tasksByDate');
    if (saved) setTasksByDate(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
  }, [tasksByDate]);

  // Update level based on current XP (100 XP per level)
  useEffect(() => {
    let newLevel = 1;
    let remainingXp = xp;

    while (remainingXp >= xpForLevel(newLevel)) {
      remainingXp -= xpForLevel(newLevel);
      newLevel++;
    }

    setLevel(newLevel);
    //setXpToNextLevel(xpForLevel(newLevel));
  }, [xp]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduler-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('scheduler-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // If opening form, scroll form into view (helps if scroll bar pushes form out of view)
  useEffect(() => {
    if ((isAddingTask || editingTask) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAddingTask, editingTask]);

  // confetti effect on level up
  const prevLevel = useRef(level);
  useEffect(() => {
    if (level > prevLevel.current) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);

      prevLevel.current = level; // Move this here so it updates BEFORE returning cleanup

      return () => clearTimeout(timer);
    }
    prevLevel.current = level; // Also keep this for the else case (optional)
  }, [level]);

  // badge/rank up effect
  {/*const rankTimeoutRef = useRef(null); // avoid stale state/timer not being timed out
  useEffect(() => {
    const badgeLevels = [
      { level: 'Bronze', threshold: 5 },
      { level: 'Silver', threshold: 15 },
      { level: 'Gold', threshold: 30 },
      { level: 'Platinum', threshold: 50 },
      { level: 'Diamond', threshold: 75 },
      { level: 'Scheduler Sage', threshold: 100 },
    ];

    const newTier = badgeLevels.reduce((acc, badge) => {
      return level >= badge.threshold ? badge.level : acc;
    }, '');

    if (newTier && newTier !== currentTier) {
      setCurrentTier(newTier);
      setRankUp(true);

      if (rankTimeoutRef.current) {
        clearTimeout(rankTimeoutRef.current);
      }

      rankTimeoutRef.current = setTimeout(() => {
        setRankUp(false);
        rankTimeoutRef.current = null;
      }, 2500);
    }

    return () => {
      if (rankTimeoutRef.current) {
        clearTimeout(rankTimeoutRef.current);
      }
    };
  }, [level]);*/}

  useEffect(() => {
    const badgeLevels = [
      { level: 'Bronze', threshold: 5 },
      { level: 'Silver', threshold: 15 },
      { level: 'Gold', threshold: 30 },
      { level: 'Platinum', threshold: 50 },
      { level: 'Diamond', threshold: 75 },
      { level: 'Scheduler Sage', threshold: 100 },
    ];

    const newTier = badgeLevels.reduce((acc, badge) => {
      return level >= badge.threshold ? badge.level : acc;
    }, '');

    if (newTier !== currentTier) {
      setCurrentTier(newTier);
    }
  }, [level]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.startTime || !newTask.endTime) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (newTask.startTime >= newTask.endTime) {
      toast({
        title: 'Invalid Time Range',
        description: 'End time must be after start time.',
        variant: 'destructive',
      });
      return;
    }

    const dateKey = selectedDateString; // <- Use your new selected day state
    const task = {
      id: Date.now(),
      ...newTask,
      date: dateKey,
      completed: false,
    };

    setTasks((prevTasks) => {
      const updatedTasksForDate = [...(prevTasks[dateKey] || []), task];
      return {
        ...prevTasks,
        [dateKey]: updatedTasksForDate,
      };
    });

    setNewTask({
      title: '',
      startTime: '',
      endTime: '',
      category: 'Work',
      description: '',
    });
    setIsAddingTask(false);
    toast({
      title: 'Task Added',
      description: 'Your task has been successfully scheduled!',
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setNewTask(task);
  };

  const handleUpdateTask = () => {
    const dateKey = selectedDateString;

    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[dateKey].map((task) =>
        task.id === editingTask ? { ...newTask, id: editingTask } : task
      );

      return {
        ...prevTasks,
        [dateKey]: updatedTasksForDate,
      };
    });

    setEditingTask(null);
    setNewTask({
      title: '',
      startTime: '',
      endTime: '',
      category: 'Work',
      description: '',
    });

    toast({
      title: 'Task Updated',
      description: 'Your task has been successfully updated!',
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const dateKey = selectedDateString;
      const updatedDateTasks = prevTasks[dateKey].filter((task) => task.id !== taskId);
      return {
        ...prevTasks,
        [dateKey]: updatedDateTasks,
      };
    });

    toast({
      title: 'Task Deleted',
      description: 'Task has been removed from your schedule.',
    });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) => {
      const dateKey = selectedDateString;
      const updatedDateTasks = prevTasks[dateKey].map((task) => {
        if (task.id === taskId) {
          const newCompletedState = !task.completed;

          if (newCompletedState && !task.completed) {
            setXp((prevXp) => prevXp + 20);
          } else if (!newCompletedState && task.completed) {
            setXp((prevXp) => Math.max(prevXp - 20, 0));
          }

          return { ...task, completed: newCompletedState };
        }
        return task;
      });

      return {
        ...prevTasks,
        [dateKey]: updatedDateTasks,
      };
    });
  };

  const getTasksForTimeSlot = (time) => {
    return tasksForSelectedDate.filter(
      (task) => task.startTime === time
    );
  };

  const getCategoryColor = (category) => {
    return COLORS.find((c) => c.name === category) || COLORS[0];
  };

  const timeSlots = generateTimeSlots();

  const completedCount = Object.values(tasks).flat().filter(task => task.completed).length; // count completed tasks

  const { xpToNextLevel, levelProgress } = getLevelXpInfo(xp, level); // get XP and level info for display bar

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
        <Helmet>
          <title>Productivity Scheduler - Organize Your Day</title>
          <meta
            name="description"
            content="A beautiful, minimalistic productivity scheduler with color-coded blocks to help you organize your daily tasks and activities."
          />
        </Helmet>
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

          {/* Day Selector Bar */}
          <DaySelectorBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />


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
            {/*
            <div className="flex items-center h-full">
              <BadgeDisplay
                completedCount={
                  process.env.NODE_ENV === 'development'
                    ? level
                    : tasks.filter((t) => t.completed).length
                }
              />
            </div>
            */}
            <div className="flex items-center h-full">
              <RankBadge tier={currentTier} />
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

        {/* Debug Menu for all sorts of things */}
        <DebugMenu
          addXP={(amount) => setXp((prev) => prev + amount)}
          resetProgress={() => {
            setXp(0);
            setLevel(1);
            setCurrentTier('');
            setBadges([]);
            localStorage.clear();
          }}
        />

        <Toaster />
      </div>
    </>
  );
}

export default App;
