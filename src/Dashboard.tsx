import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, type User } from "@supabase/supabase-js";
import { Building2, User as UserIcon, LogOut } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <span className="text-gray-400">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-20 p-12 bg-gray-800/90 text-white rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, {user?.user_metadata?.full_name || 'User'} 👋
        </h1>
        <div className="flex flex-col gap-4">
          <button
            className="flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition transform hover:scale-105 bg-green-600 hover:bg-green-700 shadow"
            onClick={() => navigate('/myprofile')}
          >
            <UserIcon className="w-6 h-6" />
            <span>My Profile</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition transform hover:scale-105 bg-blue-600 hover:bg-blue-700 shadow"
            onClick={() => navigate('/addbuilding')}
          >
            <Building2 className="w-6 h-6" />
            <span>Add Building</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition transform hover:scale-105 bg-red-600 hover:bg-red-700 shadow"
            onClick={handleSignOut}
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
  );
}