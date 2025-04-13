// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

type SavedItem = {
  id: string;
  content: string;
};
type Props = {
  user: any; // for now, use 'any' to avoid deeper typing
};


export default function Dashboard({ user }: Props) {
  const [input, setInput] = useState("");
  const [items, setItems] = useState<SavedItem[]>([]);

  const saveNote = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "savedItems"), {
      uid: user.uid,
      content: input,
      createdAt: new Date(),
    });

    setInput("");
    fetchNotes();
  };

  const fetchNotes = async () => {
    const q = query(collection(db, "savedItems"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const notes: SavedItem[] = snapshot.docs.map(doc => ({
      id: doc.id,
      content: doc.data().content,
    }));
    setItems(notes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const signOut = () => auth.signOut();

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.displayName}</h1>
        <button onClick={signOut} className="text-red-500 underline">Sign out</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Save a thought, tip, or ChatGPT insight..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={saveNote} className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>

      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="p-3 bg-gray-100 rounded shadow-sm">
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
