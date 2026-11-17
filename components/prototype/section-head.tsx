import { memo, type ReactNode } from "react";

type SectionHeadProps = {
  kicker: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

function SectionHead({ kicker, title, lede, align = "left", children }: SectionHeadProps) {
  return (
    <header className={align === "center" ? "pt-section-head pt-section-head--center" : "pt-section-head"}>
      <span className="pt-kicker">{kicker}</span>
      <h2 className="pt-h2 pt-section-head__title">{title}</h2>
      {lede ? <p className="pt-body pt-section-head__lede">{lede}</p> : null}
      {children}
    </header>
  );
}

export default memo(SectionHead);