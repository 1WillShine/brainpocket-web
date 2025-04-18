// src/pages/Login.jsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900">
      <h1 className="text-3xl font-bold mb-6 text-amber-400">BrainPocket 📙</h1>
      <button
        onClick={signIn}
        className="bg-zinc-800 text-amber-400 px-6 py-2 rounded-lg shadow border border-amber-400/30 hover:bg-zinc-700 hover:border-amber-400/50 transition-all"
      >
        Sign in with Google
      </button>
    </div>
  );
}
