import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-100 dark:border-green-900">
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 mb-4 tracking-tight">TSL Asset</h1>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            Streamline your real estate transactions.<br />
            Connect buyers, renters, and sellers with easy searches, secure payments, and direct communication.
          </p>
        </header>
        <nav className="mb-12 flex justify-center gap-8">
          <Link
            to="/login"
            className="px-8 py-3 bg-white dark:bg-gray-900 text-green-700 dark:text-green-300 border border-green-600 rounded-lg font-semibold shadow hover:bg-green-50 dark:hover:bg-gray-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white dark:bg-gray-900 text-green-700 dark:text-green-300 border border-green-600 rounded-lg font-semibold shadow hover:bg-green-50 dark:hover:bg-gray-700 transition"
          >
            Register
          </Link>
        </nav>
        <section>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-6 text-center">Why TSL Asset?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200 text-base">
            <li className="bg-green-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">Effortless property search</li>
            <li className="bg-green-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">Secure online payments</li>
            <li className="bg-green-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">Direct messaging between users</li>
            <li className="bg-green-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">Fast and transparent transactions</li>
          </ul>
        </section>
    </div>
  )
}

export default App
