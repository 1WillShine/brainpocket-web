"use client"
import { useEffect, useState, useRef, KeyboardEvent } from "react"
import { auth, db } from "../firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import Sidebar from "../components/Sidebar"
import NoteCard from "../components/NoteCard"
import TagFilter from "../components/TagFilter"
import { suggestTags } from "../utils/tagSuggestions"
import AIAssistant from "../components/Aiassistant"
import TaskModal from "../components/TaskModal"
import Calendar from "../components/Calendar"
import Tasks from '../components/Tasks'
import { Download, FileText, FileJson, FileType } from 'lucide-react';
import html2pdf from 'html2pdf.js';

type Note = {
  id: string
  content: string
  tags: string[]
  createdAt: Date
  type?: "user" | "ai"
  task?: {
    title: string
    dueDate: string
    priority: 'low' | 'medium' | 'high' | null
    completed: boolean
  } | null
}

type Props = {
  user: any
}


export default function Dashboard({ user }: Props) {
  const [input, setInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const notesEndRef = useRef<HTMLDivElement>(null)
  const [searchResults, setSearchResults] = useState<Note[]>([])
  const [selectedNotes, setSelectedNotes] = useState<any[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const scrollToBottom = () => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const saveNote = async () => {
    if (!input.trim()) return

    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    await addDoc(collection(db, "savedItems"), {
      uid: user.uid,
      content: input,
      tags,
      createdAt: new Date(),
      type: "user",
      task: null
    })

    setInput("")
    setTagInput("")
    setSuggestedTags([])
    await fetchNotes()
    scrollToBottom()
  }

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "savedItems", id))
    await fetchNotes()
  }

  const fetchNotes = async () => {
    const q = query(collection(db, "savedItems"), where("uid", "==", user.uid))
    const snapshot = await getDocs(q)
    const fetchedNotes: Note[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      content: doc.data().content,
      tags: doc.data().tags || [],
      createdAt: doc.data().createdAt.toDate(),
      type: doc.data().type || "user",
      task: doc.data().task || null
    }))
    setNotes(fetchedNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
  }

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])
  
  useEffect(() => {
    if (activeTab === 'all') {
      setTimeout(() => {
        notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [activeTab, notes]);

  const handleInputChange = (value: string) => {
    setInput(value)
    const suggestions = suggestTags(value)
    setSuggestedTags(suggestions)

    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        saveNote();
      }
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filteredNotes = searchResults.length > 0 
    ? searchResults 
    : notes.filter(
        (note) =>
          selectedTags.length === 0 ||
          selectedTags.some((tag) => note.tags.includes(tag))
      )

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  const handleNoteSelect = (notes: any[]) => {
    setSelectedNotes(notes)
    setIsTaskModalOpen(true)
  }
  

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const noteRef = doc(db, "savedItems", id);
    await updateDoc(noteRef, updates);
    await fetchNotes();
  }

  const exportAsMarkdown = () => {
    const markdown = notes.map(note => {
      const taskInfo = note.task ? `\n- Task: ${note.task.title} (Due: ${new Date(note.task.dueDate).toLocaleDateString()})` : '';
      return `# ${note.content}\n\nTags: ${note.tags.join(', ')}${taskInfo}\n\n---\n\n`;
    }).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainpocket-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = notes.map(note => {
      const taskInfo = note.task ? `<p>Task: ${note.task.title} (Due: ${new Date(note.task.dueDate).toLocaleDateString()})</p>` : '';
      return `<div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
        <h2>${note.content}</h2>
        <p>Tags: ${note.tags.join(', ')}</p>
        ${taskInfo}
      </div>`;
    }).join('');

    const opt = {
      margin: 1,
      filename: 'brainpocket-notes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(notes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainpocket-notes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'all') {
            setSelectedTags([]);
          }
        }}
        notes={notes}
        onSearch={setSearchResults}
        onNoteSelect={handleNoteSelect}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen pl-[260px]">
        {/* Header */}
        <div className="h-14 bg-black/30 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 z-10">
          <h2 className="text-xl font-medium text-amber-400">
            Welcome, {user.displayName}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors">
                <Download size={16} />
                Export
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 rounded-lg shadow-lg py-1 hidden group-hover:block">
                <button
                  onClick={exportAsMarkdown}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-amber-400 hover:bg-zinc-700 flex items-center gap-2"
                >
                  <FileText size={16} />
                  Export as Markdown
                </button>
                <button
                  onClick={exportAsPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-amber-400 hover:bg-zinc-700 flex items-center gap-2"
                >
                  <FileType size={16} />
                  Export as PDF
                </button>
                <button
                  onClick={exportAsJSON}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-amber-400 hover:bg-zinc-700 flex items-center gap-2"
                >
                  <FileJson size={16} />
                  Backup as JSON
                </button>
              </div>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Notes Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeTab === "tags" && (
              <TagFilter
                availableTags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
            )}

            {activeTab === "ai" ? (
              <div className="bg-zinc-800 rounded-xl p-6">
                <AIAssistant notes={notes} />
              </div>
            ) : activeTab === "calendar" ? (
              <div className="bg-zinc-800 rounded-xl p-6">
                <Calendar notes={notes} selectedDate={new Date()} 
                 onDateSelect={(date: Date) => {
                  notes.filter(note =>
                    new Date(note.createdAt).toDateString() === date.toDateString()
                  )}}
                 onNoteSelect={handleNoteSelect} />
              </div>
            ) : activeTab === "tasks" ? (
              <div className="bg-zinc-800 rounded-xl p-6">
                <Tasks notes={notes} />
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl max-w-[80%] ${
                    note.type === "user"
                      ? "bg-zinc-800 self-end ml-auto"
                      : "bg-zinc-700 self-start"
                  }`}
                >
                  <NoteCard note={note} onDelete={deleteNote} onUpdate={updateNote} user={user} />
                </div>
              ))
            )}

            <div ref={notesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        {activeTab !== "ai" && activeTab !== "calendar" && (
          <div className="w-full bg-zinc-900 pb-6 pt-4 border-t border-white/10">
            <div className="max-w-2xl mx-auto px-4">
              {/* Tag input */}
              <input
                type="text"
                className="w-full mb-2 px-3 py-2 text-sm border border-white/10 rounded-md bg-black/20 text-white focus:outline-none focus:border-amber-400/50 placeholder:text-gray-500"
                placeholder="Add tags (comma separated)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {/* Textarea + send */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className="w-full p-4 pr-20 text-white resize-none bg-zinc-800 focus:outline-none rounded-xl min-h-[56px] max-h-[200px] text-sm placeholder:text-gray-500"
                  placeholder="Write your note here..."
                  rows={1}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={saveNote}
                  disabled={!input.trim()}
                  className="absolute right-2 bottom-2 p-2 bg-amber-400 text-black rounded-full hover:bg-amber-300 transition-colors disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                  </svg>
                </button>
              </div>

              {/* Suggested tags */}
              {suggestedTags.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  Suggested tags:{" "}
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setTagInput((prev) =>
                          prev ? `${prev}, ${tag}` : tag
                        )
                      }
                      className="text-amber-400 hover:text-amber-300 mr-2"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {selectedNotes.length > 0 && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setSelectedNotes([])
          }}
          note={selectedNotes[0]}
          onSave={(task) => {
            if (selectedNotes[0]) {
              updateNote(selectedNotes[0].id, { task })
            }
          }}
        />
      )}
    </div>
  )
}



