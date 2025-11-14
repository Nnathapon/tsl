import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { supabase } from "./supabaseClient";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!form.agree) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    // Supabase registration
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          fullName: form.name,
          phone: form.phone,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess("Registration successful! Please check your email to verify your account.");
    setForm({ name: "", email: "", phone: "", password: "", agree: false });
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-green-100 dark:border-green-900">
      <h2 className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-6 text-center">
        Create Your Account
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-300 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 pl-10 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-300 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 pl-10 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-300 w-5 h-5" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full px-4 py-3 pl-10 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-300 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 pl-10 border border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-green-100 text-lg"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <label className="flex items-center space-x-2 text-gray-900 dark:text-green-100 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="accent-green-600"
          />
          <span>
            I agree to the{" "}
            <a
              href="/terms"
              className="underline text-green-700 dark:text-green-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline text-green-700 dark:text-green-400"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-red-600 dark:text-red-400 text-2xl font-bold text-center my-4">
            {success}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>
      </form>
      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="text-green-700 dark:text-green-400 hover:underline font-medium"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Register;