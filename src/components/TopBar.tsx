"use client"

import { LogOut } from "lucide-react"

export default function TopBar() {
  const handleSignOut = () => {
    // Implement your sign out logic here
    console.log("Sign out clicked")
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-xl font-semibold text-gray-800">BrainPocket</h1>

        <button
          onClick={handleSignOut}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">Sign Out</span>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}