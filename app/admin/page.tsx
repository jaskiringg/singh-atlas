import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { colorsToCssVars, getColors } from "@/lib/prototype-colors";

export const metadata: Metadata = {
  title: "Admin — Jaskirat Singh",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const cssVars = colorsToCssVars(getColors("dark"));

  return (
    <div style={cssVars}>
      <AdminDashboard />
    </div>
  );
}
