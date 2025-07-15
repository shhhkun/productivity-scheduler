import React, { useState, useEffect, useRef } from 'react'; // added useRef
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Calendar, Edit3, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Modal from '@/components/ui/modal';
import CompleteButton from './components/ui/completebutton';

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

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState([]);
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

    const task = {
      id: Date.now(),
      ...newTask,
      date: new Date().toISOString().split('T')[0],
      completed: false, // checkbox field/state variable
    };

    setTasks((prev) => [...prev, task]);
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
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask
          ? {
              ...newTask,
              id: editingTask,
            }
          : task
      )
    );
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
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed from your schedule.',
    });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksForTimeSlot = (time) => {
    return tasks.filter((task) => {
      const taskStart = task.startTime;
      const taskEnd = task.endTime;
      return time >= taskStart && time < taskEnd;
    });
  };

  const getCategoryColor = (category) => {
    return COLORS.find((c) => c.name === category) || COLORS[0];
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Helmet>
        <title>Productivity Scheduler - Organize Your Day</title>
        <meta
          name="description"
          content="A beautiful, minimalistic productivity scheduler with color-coded blocks to help you organize your daily tasks and activities."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
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
                            whileHover={{
                              scale: 1.02,
                            }}
                            className={`schedule-block ${categoryColor.color} rounded-lg p-3 flex-1 min-w-0 relative group`}
                          >
                            <div className="flex items-center justify-between">
                              {/* New completion button (left of content) */}
                              <div className="mr-3">
                                <CompleteButton
                                  completed={task.completed}
                                  onToggle={() => toggleTaskCompletion(task.id)}
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
      <Toaster />
    </div>
  );
}

export default App;
