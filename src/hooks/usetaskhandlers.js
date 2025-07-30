import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTaskHandlers = ({
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
}) => {
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

    const dateKey = taskDate.toISOString().split('T')[0];

    const task = {
      ...newTask,
      id: uuidv4(), // generate unique ID for the task
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
      const updatedDateTasks = prevTasks[dateKey].filter(
        (task) => task.id !== taskId
      );
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

  // filter tasks for this date
  const tasksForSelectedDate = tasks[selectedDateString] || [];

  const getTasksForTimeSlot = (time) => {
    const slotHour = parseInt(time.split(':')[0], 10);

    return tasksForSelectedDate.filter((task) => {
      const startHour = parseInt(task.startTime.split(':')[0], 10);
      const endHour = parseInt(task.endTime.split(':')[0], 10);

      return slotHour >= startHour && slotHour < endHour;
    });
  };

  return {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskCompletion,
    getTasksForTimeSlot,
  };
};

export default useTaskHandlers;
