// src/pages/LoginPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminLogin, setToken } from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      setToken(data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#0F172A] text-white">
      <div className="w-full max-w-md bg-[#020617]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/40 mb-3">
            <span className="text-xl">🏠</span>
          </div>
          <h1 className="text-2xl font-semibold">VPF Admin Panel</h1>
          <p className="text-xs text-white/60 mt-1">
            Sign in to manage properties & listings.
          </p>
        </div>
        {error && (
          <div className="mb-4 text-xs text-red-300 border border-red-400/40 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-white/70">
              Username
            </label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-sm outline-none focus:border-yellow-400/70"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="block text-xs font-medium text-white/70">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-sm outline-none focus:border-yellow-400/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-semibold mt-2 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
