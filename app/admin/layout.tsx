"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/industries", label: "Industries" },
  { href: "/admin/agencies", label: "Agencies" },
  { href: "/admin/requirements", label: "Requirements" },
  { href: "/admin/updates", label: "Regulatory Updates" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.replace("/admin/login");
    } else {
      setAuthed(true);
    }
    setChecking(false);
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (checking) return <div style={{ display: "flex", minHeight: "100vh" }}><aside style={{ width: 220, padding: 20 }}><div className="sk" style={{ width: 100, height: 20, marginBottom: 24 }} /><div className="sk" style={{ width: "100%", height: 14, marginBottom: 8 }} /><div className="sk" style={{ width: "80%", height: 14, marginBottom: 8 }} /><div className="sk" style={{ width: "90%", height: 14 }} /></aside><main style={{ flex: 1, padding: 40 }}><div className="sk" style={{ width: 200, height: 28, marginBottom: 24 }} /><div className="sk" style={{ width: "100%", height: 300 }} /></main></div>;
  if (!authed) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#fafafa", borderRight: "1px solid #eee", padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: "#2563eb" }}>⬡ Admin</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "10px 12px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
                  color: isActive ? "#2563eb" : "#444", background: isActive ? "#eef2ff" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => { sessionStorage.removeItem("admin_auth"); window.location.href = "/admin/login"; }}
          style={{ marginTop: 32, padding: "8px 12px", border: "none", background: "none", color: "#999", cursor: "pointer", fontSize: 13 }}
        >
          Sign Out
        </button>
      </aside>
      <main style={{ flex: 1, padding: 32, maxWidth: 960 }}>{children}</main>
    </div>
  );
}
