"use client";

import { useState } from "react";
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
  { role: "Pasien", email: "pasien@preecare.id", password: "demo123" },
  { role: "Nakes", email: "nakes@preecare.id", password: "demo123" },
  { role: "Dokter RS", email: "dokter@preecare.id", password: "demo123" },
  { role: "Admin", email: "admin@preecare.id", password: "demo123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );

    if (account) {
      // Store role in localStorage for demo
      localStorage.setItem("preecare_role", account.role);
      localStorage.setItem("preecare_email", account.email);
      localStorage.setItem("preecare_name", account.role === "Pasien" ? "Siti Aminah" : account.role === "Nakes" ? "Bidan Ratna" : account.role === "Dokter RS" ? "Dr. Tsamara" : "Admin PREECARE");

      if (account.role === "Pasien") router.push("/dashboard/pasien");
      else if (account.role === "Nakes") router.push("/dashboard/nakes");
      else if (account.role === "Dokter RS") router.push("/dashboard/dokter");
      else router.push("/dashboard/admin");
    } else {
      setError("Email atau password salah. Gunakan akun demo di bawah.");
    }
    setLoading(false);
  };

  const quickLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div className="relative text-center px-12 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">PREECARE</h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            AI-Based Preeclampsia Screening Information System
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: "500+", label: "Pasien" },
              { value: "98%", label: "Akurasi" },
              { value: "24/7", label: "Monitoring" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              PREE<span className="text-[#0EA5E9]">CARE</span>
            </span>
          </div>

          <div className="card p-8 rounded-3xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Selamat Datang 👋</h2>
              <p className="text-gray-500 text-sm mt-2">
                Masuk ke dashboard PREECARE Anda
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 animate-scaleIn">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@preecare.id"
                    className="input !pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input !pl-11 !pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full !py-3 text-base disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Masuk
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Akun Demo</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    onClick={() => quickLogin(account)}
                    className="btn btn-ghost !text-xs !py-2 !px-3 !rounded-lg border border-gray-200 hover:border-[#0EA5E9] hover:!text-[#0EA5E9]"
                  >
                    {account.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/" className="text-[#0EA5E9] hover:underline">
              ← Kembali ke Halaman Utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
