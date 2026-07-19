"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("preecare_role");
    if (role === "Pasien") router.replace("/dashboard/pasien");
    else if (role === "Dokter RS") router.replace("/dashboard/dokter");
    else if (role === "Admin") router.replace("/dashboard/admin");
    else router.replace("/dashboard/nakes");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-[#0EA5E9]/30 border-t-[#0EA5E9] rounded-full animate-spin" />
    </div>
  );
}
