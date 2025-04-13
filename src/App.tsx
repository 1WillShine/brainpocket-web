// src/App.tsx
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Login />;

  return <Dashboard user={user} />;
}

export default App;
