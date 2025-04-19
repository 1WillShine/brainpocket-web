export interface Task {
  title: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | null
  description?: string
  completed: boolean
}

export interface Note {
  id: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt?: Date
  task?: Task | null
  type?: "user" | "ai"
}
