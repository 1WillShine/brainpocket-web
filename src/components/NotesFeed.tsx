import NoteCard from "./NoteCard"
import type { Note } from "../types"

interface NotesFeedProps {
  notes: Note[];
  onDelete: (id: string) => Promise<void>;
}

export default function NotesFeed({ notes, onDelete }: NotesFeedProps) {
  return (
    <div className="space-y-8">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}
