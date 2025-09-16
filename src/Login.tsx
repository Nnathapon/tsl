import { useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    console.log("handleSubmit called, form:", form);
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    const {data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    console.log("🔍 Supabase signInWithPassword response:", { data, error });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess("Login successful!");
    setForm({ email: "", password: "" });
    navigate("/dashboard");
  }

  return (
  <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-green-100 dark:border-green-900">
      <h2 className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-6 text-center">
        Login to Your Account
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
          value={form.password}
          onChange={handleChange}
        />
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 dark:text-green-400 text-sm text-center">
            {success}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
      <div className="mt-8 text-center">
        <Link
          to="/register"
          className="text-green-700 dark:text-green-400 hover:underline font-medium"
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;