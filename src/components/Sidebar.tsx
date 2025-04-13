interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'all', label: 'All Notes', icon: '•' },
    { id: 'tags', label: 'Tags', icon: '#' },
    { id: 'inbox', label: 'Inbox', icon: '○' },
  ];

  return (
    <div className="w-[260px] bg-black/95 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-medium text-amber-400">BrainPocket</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm flex items-center transition-colors ${
              activeTab === tab.id
                ? 'bg-white/10 text-amber-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-amber-300'
            }`}
          >
            <span className="mr-2 opacity-70">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
} 