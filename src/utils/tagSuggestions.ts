// This is a simple tag suggestion system that can be replaced with AI later
export function suggestTags(content: string): string[] {
  const commonKeywords = [
    { keyword: "todo", tag: "task" },
    { keyword: "meeting", tag: "meeting" },
    { keyword: "idea", tag: "idea" },
    { keyword: "bug", tag: "bug" },
    { keyword: "fix", tag: "bug" },
    { keyword: "learn", tag: "learning" },
    { keyword: "study", tag: "learning" },
    { keyword: "read", tag: "reading" },
    { keyword: "book", tag: "reading" },
    { keyword: "project", tag: "project" },
  ];

  const lowercaseContent = content.toLowerCase();
  const suggestedTags = new Set<string>();

  commonKeywords.forEach(({ keyword, tag }) => {
    if (lowercaseContent.includes(keyword)) {
      suggestedTags.add(tag);
    }
  });

  return Array.from(suggestedTags);
} 