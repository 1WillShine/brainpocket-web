import { format } from "date-fns";
import { useState } from "react";
import type { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { id, content, tags, createdAt, type = "user" } = note;
  const isUser = type === "user";

  return (
    <div 
      className={`group relative w-full max-w-2xl mx-auto px-4 flex ${isUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete Button */}
      {isHovered && !showDeleteConfirm && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="absolute -left-1 top-2 p-2 rounded-lg hover:bg-black/5 transition-colors z-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 hover:text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute -left-1 top-2 bg-white rounded-lg shadow-lg p-3 z-30 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Delete this note?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await onDelete(id);
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

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 border-t pt-2 border-white/10">
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
            <span className="text-xs text-gray-400 font-mono ml-auto">
              {format(createdAt, "HH:mm · MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

