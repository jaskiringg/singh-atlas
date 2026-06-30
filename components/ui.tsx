import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent-dim shadow-[0_0_24px_-6px] shadow-accent/40"
      : "border border-border text-muted hover:text-text hover:border-muted/50";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] text-muted ${className}`}>
      {children}
    </p>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-border" />;
}
