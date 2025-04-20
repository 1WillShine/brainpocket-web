"use client"

import { /*FileText,*/ Tag,/* Bot,*/ Search, Calendar as CalendarIcon, Home, MessageSquare, CheckSquare } from "lucide-react"
import { useState, useEffect } from "react"
import Fuse from "fuse.js"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  notes: Array<{
    content: string
    tags: string[]
    id: string
    createdAt: Date
  }>
  onSearch: (searchResults: any[]) => void
  onNoteSelect: (notes: any[]) => void
}

export default function Sidebar({ activeTab, onTabChange, notes, onSearch  /*,onNoteSelect */}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [fuse, setFuse] = useState<Fuse<any> | null>(null)

  useEffect(() => {
    // Initialize Fuse.js with notes
    const options = {
      keys: ["content"],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    }
    setFuse(new Fuse(notes, options))
  }, [notes])

  useEffect(() => {
    if (fuse && searchQuery) {
      const results = fuse.search(searchQuery)
      onSearch(results.map(result => result.item))
    } else {
      onSearch([])
    }
  }, [searchQuery, fuse, onSearch])

  const tabs = [
    { id: "all", label: "All Notes", icon: Home },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "ai", label: "Ask AI", icon: MessageSquare },
  ]

  return (
    <div className="w-[260px] bg-black/95 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-medium text-amber-400 mb-4">BrainPocket</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 bg-black/30 text-white rounded-lg border border-white/10 focus:border-amber-400/50 focus:outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm flex items-center transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/10 text-amber-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-amber-300'
              }`}
            >
              <Icon size={16} className="mr-3 opacity-70" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
