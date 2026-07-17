"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./dashboard-theme.module.css";

export function SidebarLink({ href, title, icon: Icon }: { href: string, title: string, icon: React.FC<{className?: string}> }) {
  const pathname = usePathname() || "";
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""} nav-link`}
    >
       <Icon className="size-4 shrink-0" />
       <span className="title-span">{title}</span>
    </Link>
  );
}
