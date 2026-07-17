import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If there's no token and they are trying to access protected routes, redirect to login
  if (!token) {
    if (pathname === '/management') {
      // Allow access to the management login page
      return NextResponse.next();
    }
    if (pathname.startsWith('/management/')) {
      // Redirect unauthenticated management routes to management login
      return NextResponse.redirect(new URL('/management', request.url));
    }
    // All other protected routes redirect to main auth page
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If there IS a token, but they are trying to access a login page
  // We will handle this after decoding the token to see their role.

  try {
    // Decode token payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    const rawRole = payload.role?.toUpperCase() || "";

    let allowedPath = "";
    let isManagementRole = false;

    if (rawRole.includes("SUPER")) {
      allowedPath = '/management/super-admin';
      isManagementRole = true;
    } else if (rawRole.includes("ADMIN")) {
      allowedPath = '/management/admin';
      isManagementRole = true;
    } else if (rawRole.includes("ACCOUNT")) {
      allowedPath = '/management/accounts';
      isManagementRole = true;
    } else if (rawRole.includes("SALE")) {
      allowedPath = '/management/sales';
      isManagementRole = true;
    } else if (rawRole.includes("SUPPORT")) {
      allowedPath = '/management/support';
      isManagementRole = true;
    } else if (rawRole.includes("PATIENT")) {
      allowedPath = '/patient';
    } else if (rawRole.includes("HOSPITAL")) {
      allowedPath = '/hospital';
    } else if (rawRole.includes("LAB")) {
      allowedPath = '/laboratory';
    } else if (rawRole.includes("CLINIC") || rawRole.includes("DOCTOR")) {
      allowedPath = '/clinic';
    }

    // If the user's role is not recognized, redirect to login
    if (!allowedPath) {
      const response = NextResponse.redirect(new URL('/auth', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Special case: If user is on the /management login page
    if (pathname === '/management') {
      if (isManagementRole) {
        // Redirect to their management dashboard
        return NextResponse.redirect(new URL(`${allowedPath}/overview`, request.url));
      } else {
        // The dedicated management login remains accessible from any portal.
        return NextResponse.next();
      }
    }

    // Check if the user is trying to access a path that doesn't start with their allowed path
    if (pathname !== allowedPath && !pathname.startsWith(allowedPath + '/')) {
      // User is accessing another role's dashboard (or login page), redirect them to their own
      
      const destination = allowedPath === '/patient' 
        ? `${allowedPath}/overview` 
        : allowedPath.startsWith('/management') 
          ? `${allowedPath}/overview`
          : `${allowedPath}/overview`; // Most dashboards have /overview as default
          
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    // Token is invalid or malformed
    if (pathname === '/management') {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    // Apply middleware to all protected dashboard routes
    '/patient/:path*',
    '/hospital/:path*',
    '/laboratory/:path*',
    '/clinic/:path*',
    '/management/:path*',
  ],
};
