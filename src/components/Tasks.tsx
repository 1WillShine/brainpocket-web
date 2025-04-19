import { useState } from 'react';
import { format } from 'date-fns';
import { Note } from '../types/note';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TasksProps {
  notes: Note[];
}

type SortOption = 'dueDate' | 'createdAt' | 'tags';

export default function Tasks({ notes }: TasksProps) {
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const tasks = notes
    .filter(note => note.task)
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return sortAsc
          ? new Date(a.task!.dueDate).getTime() - new Date(b.task!.dueDate).getTime()
          : new Date(b.task!.dueDate).getTime() - new Date(a.task!.dueDate).getTime();
      } else if (sortBy === 'createdAt') {
        return sortAsc
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        // Sort by tags
        const aTags = a.tags.join(',');
        const bTags = b.tags.join(',');
        return sortAsc
          ? aTags.localeCompare(bTags)
          : bTags.localeCompare(aTags);
      }
    });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleSort('dueDate')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
            sortBy === 'dueDate'
              ? 'bg-amber-400/20 text-amber-400'
              : 'bg-zinc-700 text-gray-400 hover:bg-zinc-600'
          }`}
        >
          Due Date
          {sortBy === 'dueDate' && (
            sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
        <button
          onClick={() => toggleSort('createdAt')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
            sortBy === 'createdAt'
              ? 'bg-amber-400/20 text-amber-400'
              : 'bg-zinc-700 text-gray-400 hover:bg-zinc-600'
          }`}
        >
          Created
          {sortBy === 'createdAt' && (
            sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
        <button
          onClick={() => toggleSort('tags')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
            sortBy === 'tags'
              ? 'bg-amber-400/20 text-amber-400'
              : 'bg-zinc-700 text-gray-400 hover:bg-zinc-600'
          }`}
        >
          Tags
          {sortBy === 'tags' && (
            sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(note => (
          <div key={note.id} className="bg-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{note.task!.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Due: {format(new Date(note.task!.dueDate), 'MMM d, yyyy h:mm a')}
                </p>
                {note.task!.description && (
                  <p className="text-sm text-gray-400 mt-2">{note.task!.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-xs font-mono bg-amber-400/10 text-amber-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  From note: {note.content.slice(0, 30)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 