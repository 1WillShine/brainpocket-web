import { useState } from 'react';
import { Note } from '../types/note';
import { X } from 'lucide-react';

interface TaskModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: NonNullable<Note['task']>) => void;
  isFromCalendar?: boolean;
}

export default function TaskModal({ note, isOpen, onClose, onSave, isFromCalendar = false }: TaskModalProps) {
  const [title, setTitle] = useState(isFromCalendar ? '' : (note.task?.title || note.content.slice(0, 50) + '...'));
  const [dueDate, setDueDate] = useState(note.task?.dueDate || '');
  const [description, setDescription] = useState(note.task?.description || '');
  const [isAllDay, setIsAllDay] = useState(!note.task?.dueDate?.includes('T'));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If it's an all-day task, set the time to midnight
    const finalDueDate = isAllDay 
      ? dueDate.split('T')[0] + 'T00:00'
      : dueDate;

    onSave({
      title,
      dueDate: finalDueDate,
      description,
      priority: null,
      completed: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">Create Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-amber-400/20 focus:border-amber-400/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="allDay"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="rounded border-gray-400 text-amber-400 focus:ring-amber-400"
              />
              <label htmlFor="allDay" className="text-sm text-gray-400">
                All-day task
              </label>
            </div>
            <input
              type={isAllDay ? "date" : "datetime-local"}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-amber-400/20 focus:border-amber-400/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-amber-400/20 focus:border-amber-400/50 focus:outline-none min-h-[100px] resize-none"
              placeholder="Add any additional details about this task..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition-colors"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 