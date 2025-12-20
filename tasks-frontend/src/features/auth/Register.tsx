import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import googleLogo from "../../assets/logos/google.svg";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(form);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 text-center">Create Account</h1>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Get started with TaskFlow
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg  bg-gray-900  text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
          }}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <img
            src={googleLogo}
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-slate-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900  hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;