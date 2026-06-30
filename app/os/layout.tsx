import { AtlasShell } from "@/components/os/shell";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return <AtlasShell>{children}</AtlasShell>;
}
