"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SidebarActiveHighlighter() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (!pathname) return;
    const path = pathname.toLowerCase();
    
    // Determine active group
    const activeGroup = 
      path.includes("/management/super-admin") ? "superAdmin" : 
      path.includes("/management/sales") ? "sales" : 
      path.includes("/management/accounts") ? "accounts" : 
      path.includes("/management/admin") ? "admin" : 
      path.includes("/management/support") ? "support" : 
      path.startsWith("/hospital") ? "hospital" : 
      path.startsWith("/clinic") ? "clinic" : 
      path.startsWith("/laboratory") ? "laboratory" : "patient";

    // Show only the active group, hide others
    const allGroups = document.querySelectorAll('.nav-group');
    allGroups.forEach(group => {
      if (group.classList.contains(`nav-group-${activeGroup}`)) {
        group.classList.remove('hidden');
      } else {
        group.classList.add('hidden');
      }
    });
    
    // Handle Sidebar Links active state within the visible group
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (pathname === href || pathname.startsWith(href + '/'))) {
        link.classList.add('bg-brand/10', 'text-brand');
        link.classList.remove('text-muted-foreground', 'hover:bg-muted', 'hover:text-foreground');
      } else {
        link.classList.remove('bg-brand/10', 'text-brand');
        link.classList.add('text-muted-foreground', 'hover:bg-muted', 'hover:text-foreground');
      }
    });

    // Handle Title Updates
    const titleEl = document.getElementById('sidebar-group-title');
    if (titleEl) {
      const title = 
        path.includes("/management/super-admin") ? "Super Admin Dashboard" : 
        path.includes("/management/sales") ? "Sales Dashboard" : 
        path.includes("/management/accounts") ? "Accounts Dashboard" : 
        path.includes("/management/admin") ? "Admin Dashboard" : 
        path.includes("/management/support") ? "Support Dashboard" : 
        path.startsWith("/hospital") ? "Hospital Dashboard" : 
        path.startsWith("/clinic") ? "Clinic Dashboard" : 
        path.startsWith("/laboratory") ? "Laboratory Dashboard" : "Patient Dashboard";
      titleEl.textContent = title;
    }
  }, [pathname]);
  
  return null;
}
