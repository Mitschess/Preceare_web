"use client";

import Link from "next/link";
import {
  Activity,
  Shield,
  Heart,
  BarChart3,
  ArrowRight,
  Zap,
  Users,
  Building2,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";


export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "glass shadow-lg py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              {<Heart className="w-5 h-5 text-white" />}
              {/* <Image src="/icon.png" alt="Logo PREECARE" width={100} height={100} className="object-contain p-1 rounded-xl" /> */}
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className={scrolled ? "text-[#0F172A]" : "text-white"}>PREE</span>
              <span className="text-[#0EA5E9]">CARE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Fitur", "Cara Kerja", "Tentang"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className={`text-sm font-medium transition-colors ${scrolled
                  ? "text-gray-600 hover:text-[#0EA5E9]"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${scrolled
                ? "text-gray-600 hover:text-[#0EA5E9]"
                : "text-white/80 hover:text-white"
                }`}
            >
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-primary text-sm !py-2 !px-5"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative gradient-hero min-h-[100vh] flex items-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#0EA5E9]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          {/* Grid dots pattern */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fadeIn mt-12 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                <Zap className="w-4 h-4 text-[#FCD34D]" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Screening</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6">
                Deteksi Dini{" "}
                <span className="bg-gradient-to-r from-[#38BDF8] to-[#34D399] bg-clip-text text-transparent">
                  Preeklamsia
                </span>{" "}
                dengan AI
              </h1>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                PREECARE mengintegrasikan perangkat medis, kecerdasan buatan, dan
                tenaga kesehatan untuk screening preeklamsia yang akurat dan cepat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="btn btn-primary !py-3 !px-8 text-base w-full sm:w-auto"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#cara-kerja"
                  className="btn btn-outline !border-white/30 !text-white hover:!bg-white/10 !py-3 !px-8 text-base w-full sm:w-auto text-center"
                >
                  Cara Kerja
                </a>
              </div>

              {/* Stats mini */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 max-w-md">
                {[
                  { value: "500+", label: "Pasien" },
                  { value: "98%", label: "Akurasi AI" },
                  { value: "<3s", label: "Response" },
                ].map((stat) => (
                  <div key={stat.label} className="border-l border-white/10 pl-4 first:border-none first:pl-0">
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual - device mockup */}
            <div className="hidden lg:block animate-slideInRight">
              <div className="relative">
                {/* Main card */}
                <div className="card-elevated p-8 rounded-3xl bg-white/95 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">Screening Result</div>
                      <div className="text-sm text-gray-500">Real-time AI Analysis</div>
                    </div>
                  </div>

                  {/* Mock chart bars */}
                  <div className="flex items-end gap-2 h-32 mb-6 px-2">
                    {[40, 55, 35, 70, 45, 60, 80, 50, 65, 75, 55, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md transition-all" style={{
                        height: `${h}%`,
                        background: h > 70 ? "linear-gradient(to top, #EF4444, #F87171)" :
                          h > 50 ? "linear-gradient(to top, #F59E0B, #FBBF24)" :
                            "linear-gradient(to top, #10B981, #34D399)",
                        animationDelay: `${i * 0.1}s`,
                      }} />
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Tekanan Darah</div>
                      <div className="text-2xl font-bold text-gray-900">128/84 <span className="text-sm text-gray-400 font-normal">mmHg</span></div>
                    </div>
                    <div className="badge risk-medium py-1 px-4 text-sm">
                      Risiko Sedang
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 card p-4 rounded-2xl animate-float shadow-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Confidence</div>
                      <div className="text-sm font-bold text-green-600">96.5%</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute -bottom-12 -left-10 card p-4 rounded-2xl animate-float shadow-lg bg-white" style={{ animationDelay: "1.5s" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protein Urin</div>
                      <div className="text-sm font-bold text-gray-900">
                        0.8 g/L <span className="text-xs font-extrabold text-[#0EA5E9] bg-sky-50 px-1.5 py-0.5 rounded ml-1 border border-sky-100">(+2 Positif)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <Star className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-sm font-medium text-[#0EA5E9]">Fitur Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solusi Lengkap untuk{" "}
              <span className="text-[#0EA5E9]">Skrining Preeklamsia</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Platform terintegrasi yang menghubungkan perangkat, AI, tenaga
              kesehatan, dan rumah sakit dalam satu ekosistem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Screening Otomatis",
                desc: "Data tekanan darah dan protein urin dikirim otomatis dari alat PREECARE ke sistem.",
                gradient: "gradient-card-blue",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: Zap,
                title: "AI Prediction",
                desc: "Klasifikasi risiko Low, Medium, dan High dalam waktu kurang dari 3 detik.",
                gradient: "gradient-card-purple",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: BarChart3,
                title: "Monitoring Real-time",
                desc: "Grafik tren tekanan darah dan protein urin selama ±8 bulan kehamilan.",
                gradient: "gradient-card-green",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: Users,
                title: "Multi-Role Dashboard",
                desc: "Dashboard khusus untuk pasien, nakes puskesmas, dokter RS, dan administrator.",
                gradient: "gradient-card-amber",
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600",
              },
              {
                icon: Building2,
                title: "Sistem Rujukan",
                desc: "Rujukan otomatis dari puskesmas ke rumah sakit untuk pasien risiko tinggi.",
                gradient: "gradient-card-red",
                iconBg: "bg-red-100",
                iconColor: "text-red-600",
              },
              {
                icon: Shield,
                title: "Keamanan Data",
                desc: "JWT Authentication, Role-based Access Control, dan HTTPS encryption.",
                gradient: "gradient-card-blue",
                iconBg: "bg-cyan-100",
                iconColor: "text-cyan-600",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`card p-6 ${feature.gradient} border-none animate-fadeIn delay-${(i + 1) * 100}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="cara-kerja" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja <span className="text-[#10B981]">PREECARE</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Proses skrining dari perangkat hingga hasil AI hanya dalam beberapa langkah sederhana.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Input Data", desc: "Data tekanan darah & protein urin dikirim dari alat PREECARE", color: "#0EA5E9" },
              { step: "02", title: "Faktor Risiko", desc: "Input riwayat kesehatan melalui LCD touchscreen perangkat", color: "#8B5CF6" },
              { step: "03", title: "AI Analisis", desc: "AI menganalisis semua data dan mengklasifikasikan risiko", color: "#10B981" },
              { step: "04", title: "Hasil & Rujukan", desc: "Hasil tampil di dashboard, rujukan otomatis jika risiko tinggi", color: "#F59E0B" },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
                    style={{ background: item.color }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-gray-300">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Meningkatkan Kualitas Screening Preeklamsia?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Bergabung dengan PREECARE dan manfaatkan teknologi AI untuk deteksi
            dini yang lebih akurat dan cepat.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-sm mx-auto sm:max-w-none">
            <Link href="/dashboard" className="btn btn-primary !bg-white !text-[#FFF] !py-3 !px-8 text-base hover:!bg-gray-50 !shadow-xl w-full sm:w-auto flex items-center justify-center gap-2">
              Akses Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn btn-outline !border-white/40 !text-white hover:!bg-white/10 !py-3 !px-8 text-base w-full sm:w-auto text-center">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  PREE<span className="text-[#0EA5E9]">CARE</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Sistem informasi skrining preeklamsia berbasis AI yang
                mengintegrasikan perangkat medis, tenaga kesehatan, dan rumah
                sakit untuk deteksi dini dan monitoring ibu hamil.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Navigasi</h4>
              <div className="space-y-3">
                {["Dashboard", "Login", "Fitur", "Cara Kerja"].map((link) => (
                  <a key={link} href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Teknologi</h4>
              <div className="space-y-3">
                {["Next.js 15", "Prisma ORM", "PostgreSQL", "Python FastAPI"].map((tech) => (
                  <span key={tech} className="block text-sm text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PREECARE Team. Develop by Mitschess. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
