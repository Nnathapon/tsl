import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Auth error or no user:", error);
        navigate('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-gray-100">
        <span className="text-gray-500">Loading user data...</span>
      </div>
    );
  }

  return (
    <body className="flex flex-col h-screen w-screen bg-black text-gray-100">
      <header className="flex items-center justify-between bg-gray-900 px-6 py-4 shadow-md">
        <div className="text-lg font-medium">
          Welcome, {user?.user_metadata?.fullName || user?.email}
        </div>
        <div className="flex-grow mx-6">
          <input
            type="text"
            placeholder="Quick Search..."
            className="w-full max-w-md px-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-700" aria-label="Notifications">
            🔔
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700" aria-label="Messages">
            💬
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="p-6 flex-grow">
        <h2 className="text-2xl font-semibold">User Data</h2>
        {user ? (
          <div className="bg-gray-800 p-4 rounded-lg mt-6 text-gray-200">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email || '—'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Last Sign-In:</strong> {user.last_sign_in_at}</p>
            <div>
              <strong>name:</strong>{user?.user_metadata.fullName}
            </div>
          </div>
        ) : (
          <p>No user found.</p>
        )}
      </main>
    </body>
  );
}