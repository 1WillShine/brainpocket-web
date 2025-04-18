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
} from "firebase/firestore"
import Sidebar from "../components/Sidebar"
import NoteCard from "../components/NoteCard"
import TagFilter from "../components/TagFilter"
import { suggestTags } from "../utils/tagSuggestions"

type Note = {
  id: string
  content: string
  tags: string[]
  createdAt: Date
  type?: "user" | "ai"
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
    }))
    setNotes(
      fetchedNotes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    )
  }

  useEffect(() => {
    fetchNotes()
  }, [])

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveNote()
    }
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filteredNotes = notes.filter(
    (note) =>
      selectedTags.length === 0 ||
      selectedTags.some((tag) => note.tags.includes(tag))
  )

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'all') {
          setSelectedTags([]);
        }
      }} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen pl-[260px]">
        {/* Header */}
        <div className="h-14 bg-black/30 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 z-10">
          <h2 className="text-sm font-medium text-amber-400">
            Welcome, {user.displayName}
          </h2>
          <button
            onClick={() => auth.signOut()}
            className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Notes Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {activeTab === "tags" && (
              <TagFilter
                availableTags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
            )}

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-xl max-w-[80%] ${
                  note.type === "user"
                    ? "bg-zinc-800 self-end ml-auto"
                    : "bg-zinc-700 self-start"
                }`}
              >
                <NoteCard note={note} onDelete={deleteNote} />
              </div>
            ))}

            <div ref={notesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="w-full bg-zinc-900 pb-6 pt-4 border-t border-white/10">
          <div className="max-w-2xl mx-auto px-4">
            {/* Tag input */}
            <input
              type="text"
              className="w-full mb-2 px-3 py-2 text-sm border border-white/10 rounded-md bg-black/20 text-white focus:outline-none focus:border-amber-400/50 placeholder:text-gray-500"
              placeholder="Add tags (comma separated)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
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
      </div>
    </div>
  )
}



