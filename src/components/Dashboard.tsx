import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from './NoteCard';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import type { Note } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const notesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notes'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Note[];
      setNotes(newNotes);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'all' && notesContainerRef.current) {
      notesContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleAddNote = async (content: string) => {
    if (!user) return;

    await addDoc(collection(db, 'notes'), {
      uid: user.uid,
      content,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'user'
    });
  };

  const handleDeleteNote = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    await updateDoc(doc(db, 'notes', id), {
      ...updates,
      updatedAt: new Date()
    });
  };

  const filteredNotes = notes.filter(note => {
    if (activeTab === 'all') return true;
    if (activeTab === 'calendar') {
      if (!note.task?.dueDate) return false;
      const noteDate = new Date(note.task.dueDate);
      return format(noteDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    }
    if (selectedTag) {
      return note.tags.includes(selectedTag);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        notes={notes}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'calendar' ? (
          <div className="h-full p-6">
            <Calendar
              notes={notes}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        ) : (
          <div 
            ref={notesContainerRef}
            className="h-full overflow-y-auto p-6 space-y-6"
          >
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 