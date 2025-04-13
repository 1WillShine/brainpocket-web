// src/pages/Login.jsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">BrainPocket 🧠</h1>
      <button
        onClick={signIn}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
