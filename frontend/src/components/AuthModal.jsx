// src/components/AuthModal.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import axios from "axios";

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // ✅ FIX: correct useEffect placement
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setForm({ name: "", email: "", password: "", confirm: "" });
    }
  }, [isOpen, initialMode]);

  const set = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (mode === "login") {
        res = await axios.post("/api/users/login", {
          email: form.email,
          password: form.password,
        });
      } else {
        res = await axios.post("/api/users/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }

      const userData = { ...res.data.user, token: res.data.token };
      dispatch(setUser(userData));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setForm({ name: "", email: "", password: "", confirm: "" });
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full flex items-center justify-center text-[#8a7a6a] hover:bg-[#f0ebe3] transition z-10"
        >✕</button>

        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#b89d86,#d4b99a)" }} />

        <div className="flex border-b border-[#ede7de] shrink-0">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab) }
              className="flex-1 py-3.5 sm:py-4 text-sm font-medium capitalize transition-colors"
              style={{
                color: mode === tab ? "#1a1a1a" : "#8a7a6a",
                borderBottom: mode === tab ? "2px solid #b89d86" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {tab === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-5 sm:py-7 flex flex-col gap-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-[#8a7a6a] mb-1.5 uppercase tracking-wider">Full name</label>
              <input
                type="text" value={form.name} onChange={set("name")} placeholder="Jane Doe" required
                className="w-full px-4 py-3 rounded-xl border text-base text-[#1a1a1a] outline-none transition"
                style={{ borderColor: "#ddd6cc", background: "#faf8f5" }}
                onFocus={(e) => (e.target.style.borderColor = "#b89d86")}
                onBlur={(e)  => (e.target.style.borderColor = "#ddd6cc")}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#8a7a6a] mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required
              className="w-full px-4 py-3 rounded-xl border text-base text-[#1a1a1a] outline-none transition"
              style={{ borderColor: "#ddd6cc", background: "#faf8f5" }}
              onFocus={(e) => (e.target.style.borderColor = "#b89d86")}
              onBlur={(e)  => (e.target.style.borderColor = "#ddd6cc")}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8a7a6a] mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required
              className="w-full px-4 py-3 rounded-xl border text-base text-[#1a1a1a] outline-none transition"
              style={{ borderColor: "#ddd6cc", background: "#faf8f5" }}
              onFocus={(e) => (e.target.style.borderColor = "#b89d86")}
              onBlur={(e)  => (e.target.style.borderColor = "#ddd6cc")}
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-[#8a7a6a] mb-1.5 uppercase tracking-wider">Confirm password</label>
              <input
                type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl border text-base text-[#1a1a1a] outline-none transition"
                style={{ borderColor: "#ddd6cc", background: "#faf8f5" }}
                onFocus={(e) => (e.target.style.borderColor = "#b89d86")}
                onBlur={(e)  => (e.target.style.borderColor = "#ddd6cc")}
              />
            </div>
          )}

          {mode === "login" && (
            <div className="text-right">
              <button type="button" className="text-xs text-[#8a7a6a] hover:underline">Forgot password?</button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity"
            style={{ background: loading ? "#c9b5a3" : "#b89d86" }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className="flex items-center gap-3 my-1">
            <hr className="flex-1 border-[#ede7de]" />
            <span className="text-xs text-[#8a7a6a] whitespace-nowrap">or continue with</span>
            <hr className="flex-1 border-[#ede7de]" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[{ label: "Google", emoji: "G" }, { label: "Facebook", emoji: "f" }].map(({ label, emoji }) => (
              <button
                key={label} type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f3ee] transition"
                style={{ borderColor: "#ddd6cc" }}
              >
                <span className="font-bold text-base">{emoji}</span> {label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-[#8a7a6a] mt-1">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={switchMode} className="font-semibold text-[#b89d86] hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </div>,
    document.body
  );
}