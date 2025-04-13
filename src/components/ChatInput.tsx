"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"

interface ChatInputProps {
  onSubmit: (content: string) => void
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput("")
      // Reset height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new note..."
        className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none max-h-[200px] min-h-[56px]"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="absolute right-3 bottom-3 rounded-full bg-black text-white p-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        <ArrowUp size={16} />
      </button>
    </form>
  )
}