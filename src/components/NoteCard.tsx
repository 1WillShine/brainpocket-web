import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import type { Note } from "../types/note"
import { Trash2, CheckSquare } from 'lucide-react';
import TaskModal from './TaskModal';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  user: any;
}

export default function NoteCard({ note, onDelete, onUpdate  /*, user */}: NoteCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const taskDeleteModalRef = useRef<HTMLDivElement>(null);

  const { id, content, tags, createdAt, type = "user", task } = note;
  const isUser = type === "user";

  const handleTaskSave = (task: NonNullable<Note['task']>) => {
    onUpdate(id, { task });
  };

  const handleTaskDelete = () => {
    onUpdate(id, { task: null });
    setShowTaskDeleteConfirm(false);
  };

  const handleTaskClick = () => {
    if (task) {
      setShowTaskDeleteConfirm(true);
    } else {
      setIsTaskModalOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(false);
      }
      if (taskDeleteModalRef.current && !taskDeleteModalRef.current.contains(event.target as Node)) {
        setShowTaskDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div 
        className={`group relative w-full max-w-xl mx-auto px-4 flex ${isUser ? "justify-end" : "justify-start"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Controls */}
        {isHovered && !showDeleteConfirm && (
          <div className="absolute -left-1 top-2 flex flex-col gap-1 z-20">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
            </button>
            <button
              onClick={handleTaskClick}
              className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${
                task ? 'text-amber-400 hover:text-amber-300' : 'text-gray-400 hover:text-amber-400'
              }`}
            >
              <CheckSquare size={16} />
            </button>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div ref={deleteModalRef} className="absolute -left-1 top-2 bg-white rounded-lg shadow-lg p-3 z-30 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Delete this note?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDelete(id);
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Note Bubble */}
        <div className={`rounded-2xl px-4 py-3 shadow ${isUser ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}>
          <p className="text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">{content}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2 border-t pt-2 border-white/10">
            {tags.length > 0 && (
              <>
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-md text-xs font-mono ${
                      isUser ? "bg-amber-400/10 text-amber-400" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </>
            )}
            {task && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <CheckSquare size={12} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            <span className="text-xs text-gray-400 font-mono ml-auto">
              {format(createdAt, "HH:mm · MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <TaskModal
        note={note}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
      />

      {/* Delete Task Confirmation Modal */}
      {showTaskDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={taskDeleteModalRef} className="bg-zinc-800 p-6 rounded-xl w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Task
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTaskDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

