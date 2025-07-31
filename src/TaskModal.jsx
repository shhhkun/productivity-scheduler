import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import CalendarPicker from '@/components/ui/calendarpicker';
import COLORS from '@/utils/colors';

export default function TaskModal({
  isOpen,
  onClose,
  editingTask,
  newTask,
  setNewTask,
  handleAddTask,
  handleUpdateTask,
  taskDate,
  setTaskDate,
  showCalendar,
  setShowCalendar,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </>
    </Modal>
  );
}
