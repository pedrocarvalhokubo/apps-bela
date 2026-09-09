"use client";
import { usePathname } from "next/navigation";
export default function UnifiedNav() {
  const path = usePathname();
  return <nav className="unified-nav" aria-label="Áreas de estudo">
    <a href="/" aria-current={path === "/" ? "page" : undefined}>Estudos da Bela</a>
    <a href="/obmep" aria-current={path.startsWith("/obmep") ? "page" : undefined}>OBMEP Mirim</a>
  </nav>;
}
