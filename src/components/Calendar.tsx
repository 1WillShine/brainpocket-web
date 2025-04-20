import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { Note } from '../types/note';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
/*import TaskModal from './TaskModal';*/

interface CalendarProps {
  notes: Note[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onNoteSelect: (notes: Note[]) => void;
}

export default function Calendar({ notes, selectedDate, onDateSelect, onNoteSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState<Note[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Note | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Note | null>(null);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const tasksByDate = notes.reduce((acc, note) => {
    if (note.task?.dueDate) {
      const date = new Date(note.task.dueDate);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(note);
    }
    return acc;
  }, {} as Record<string, Note[]>);

  const isUrgent = (date: Date) => {
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24 && diffInHours > 0;
  };

  const getTaskCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksByDate[dateKey]?.length || 0;
  };

  const getUrgentTaskCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksByDate[dateKey]?.filter(note => isUrgent(new Date(note.task!.dueDate)))?.length || 0;
  };

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const tasks = tasksByDate[dateKey] || [];
    setSelectedTasks(tasks);
    setShowTaskModal(true);
    onDateSelect(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleTaskClick = (note: Note) => {
    setSelectedTask(note);
    setEditedDescription(note.task?.description || "");
    setEditedDueDate(note.task?.dueDate || "");
    setShowTaskDetails(true);
    setShowTaskModal(false);
  };

  const handleTaskUpdate = () => {
    if (selectedTask) {
      const updatedTask = {
        ...selectedTask.task!,
        description: editedDescription,
        dueDate: editedDueDate
      };
      onNoteSelect([{ ...selectedTask, task: updatedTask }]);
      setShowTaskDetails(false);
      setShowTaskModal(false);
    }
  };

  /*const handleDeleteClick = (note: Note) => {
    setTaskToDelete(note);
    setShowDeleteConfirm(true);
  };*/

  const confirmDelete = () => {
    if (taskToDelete) {
      onNoteSelect([{ ...taskToDelete, task: null }]);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-6 w-[90%] h-[calc(90vh-8rem)] max-w-[90%] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-medium text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 h-[calc(100%-4rem)]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-gray-400 py-2">
            {day}
          </div>
        ))}

        {days.map(day => {
          const taskCount = getTaskCount(day);
          const urgentTaskCount = getUrgentTaskCount(day);
          const hasTasks = taskCount > 0;
          const hasUrgentTasks = urgentTaskCount > 0;

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-2 rounded-lg text-sm transition-colors min-h-[80px]
                ${isSameMonth(day, currentMonth) ? 'text-white' : 'text-gray-600'}
                ${isToday(day) ? 'bg-amber-400/20' : ''}
                ${isSameDay(day, selectedDate) ? 'bg-amber-400/30' : ''}
                ${hasTasks ? 'hover:bg-amber-400/10' : 'hover:bg-zinc-700'}
              `}
            >
              {format(day, 'd')}
              {hasTasks && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${hasUrgentTasks ? 'bg-red-500' : 'bg-amber-400'}
                  `} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Task Details Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>

            <div className="space-y-4">
              {selectedTasks.map(note => (
                <div 
                  key={note.id} 
                  className="p-4 bg-zinc-700 rounded-lg group relative"
                >
                  <button
                    onClick={() => handleTaskClick(note)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Plus size={16} />
                  </button>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{note.task!.title}</h3>
                      {note.task!.description && (
                        <p className="text-sm text-gray-400 mt-1">{note.task!.description}</p>
                      )}
                    </div>
                    {!note.task!.dueDate.includes('T00:00') && (
                      <span className="text-sm text-gray-400">
                        {format(new Date(note.task!.dueDate), 'h:mm a')}
                      </span>
                    )}
                  </div>
                  {isUrgent(new Date(note.task!.dueDate)) && (
                    <div className="mt-2 text-xs text-red-400">
                      Due within 24 hours
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Details View */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowTaskDetails(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              {selectedTask.task!.title}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-amber-400/20 focus:border-amber-400/50 focus:outline-none min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-amber-400/20 focus:border-amber-400/50 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowTaskDetails(false);
                    setShowTaskModal(false);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTaskUpdate}
                  className="px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Task
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 