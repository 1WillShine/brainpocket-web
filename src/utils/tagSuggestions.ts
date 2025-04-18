// This is a simple tag suggestion system that can be replaced with AI later
export function suggestTags(content: string): string[] {
  const commonKeywords = [
    // Task-related
    { keyword: "todo", tag: "task" },
    { keyword: "task", tag: "task" },
    { keyword: "deadline", tag: "task" },
    
    // Meetings & Events
    { keyword: "meeting", tag: "meeting" },
    { keyword: "call", tag: "meeting" },
    { keyword: "conference", tag: "meeting" },
    { keyword: "event", tag: "event" },
    
    // Ideas & Creativity
    { keyword: "idea", tag: "idea" },
    { keyword: "brainstorm", tag: "idea" },
    { keyword: "concept", tag: "idea" },
    { keyword: "creative", tag: "creative" },
    
    // Development
    { keyword: "bug", tag: "bug" },
    { keyword: "fix", tag: "bug" },
    { keyword: "feature", tag: "feature" },
    { keyword: "code", tag: "coding" },
    { keyword: "dev", tag: "coding" },
    { keyword: "test", tag: "testing" },
    
    // Learning & Research
    { keyword: "learn", tag: "learning" },
    { keyword: "study", tag: "learning" },
    { keyword: "research", tag: "research" },
    { keyword: "read", tag: "reading" },
    { keyword: "book", tag: "reading" },
    { keyword: "article", tag: "reading" },
    
    // Project Management
    { keyword: "project", tag: "project" },
    { keyword: "milestone", tag: "project" },
    { keyword: "planning", tag: "planning" },
    { keyword: "goal", tag: "goal" },
    
    // Personal
    { keyword: "reminder", tag: "reminder" },
    { keyword: "note", tag: "note" },
    { keyword: "important", tag: "important" },
    { keyword: "urgent", tag: "urgent" },
  ];

  const lowercaseContent = content.toLowerCase();
  const suggestedTags = new Set<string>();

  // Check for exact word matches using word boundaries
  commonKeywords.forEach(({ keyword, tag }) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowercaseContent)) {
      suggestedTags.add(tag);
    }
  });

  return Array.from(suggestedTags);
} 