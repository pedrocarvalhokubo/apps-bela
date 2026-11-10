"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UnifiedNav() {
  const path = usePathname();
  return <nav className="unified-nav" aria-label="Áreas de estudo">
    <Link href="/" aria-current={path === "/" ? "page" : undefined}>Estudos da Bela</Link>
    <a href="/obmep" aria-current={path.startsWith("/obmep") ? "page" : undefined}>OBMEP Mirim</a>
  </nav>;
}
