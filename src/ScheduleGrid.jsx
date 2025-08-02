import { motion } from 'framer-motion';
import { Calendar, Edit3, Trash2 } from 'lucide-react';
import CompleteButton from '@/components/ui/completebutton';

export default function ScheduleGrid({
  timeSlots,
  getTasksForTimeSlot,
  handleEditTask,
  handleDeleteTask,
  toggleTaskCompletion,
  getCategoryColor,
}) {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar
          className="w-6 h-6"
          style={{
            color: 'var(--accent)',
          }}
        />
        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--text2)' }}
        >
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
              className="time-slot flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-[var(--hover2)] transition-all duration-200"
            >
              <div
                className="w-16 text-sm font-mono text-gray-400 flex-shrink-0"
                style={{ color: 'var(--text2)' }}
              >
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
                  <div
                    className="text-sm italic"
                    style={{ color: 'var(--text4)' }}
                  >
                    No tasks scheduled
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
