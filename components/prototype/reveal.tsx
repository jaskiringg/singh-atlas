"use client";

type RevealProps = {
  id: string;
  dir?: "up" | "left" | "right";
  visible: boolean;
  sectionId: string;
  children: React.ReactNode;
};

export default function Reveal({ id, dir = "up", visible, sectionId, children }: RevealProps) {
  return (
    <div
      data-section-id={sectionId}
      data-reveal-id={id}
      className={`pt-reveal ${visible ? "pt-reveal--visible" : `pt-reveal--hidden pt-reveal--${dir}`}`}
    >
      {children}
    </div>
  );
}
