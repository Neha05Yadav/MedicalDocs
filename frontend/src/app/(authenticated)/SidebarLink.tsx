"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({ href, title, icon: Icon }: { href: string, title: string, icon: React.FC<{className?: string}> }) {
  const pathname = usePathname() || "";
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? "bg-brand/10 text-brand" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } nav-link`}
    >
       <Icon className="size-4 shrink-0" />
       <span className="title-span">{title}</span>
    </Link>
  );
}
