import NoteCard from "./NoteCard"
import type { Note } from "../types/note"

interface NotesFeedProps {
  notes: Note[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  user: any
}

export default function NotesFeed({ notes, onDelete, onUpdate, user}: NotesFeedProps) {
  return (
    <div className="space-y-8">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onUpdate={onUpdate}
          user={user}
        
        />
      ))}
    </div>
  );
}

