export interface Note {
    id: string;
    content: string;
    tags: string[];
    createdAt: Date;
    type?: "user" | "ai";
  }
  