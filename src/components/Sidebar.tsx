"use client"

import { FileText, Tag, Inbox } from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: "all", label: "All Notes", icon: FileText },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "inbox", label: "Inbox", icon: Inbox },
  ]

  return (
    <div className="w-[260px] bg-black/95 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-medium text-amber-400">BrainPocket</h1>
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
