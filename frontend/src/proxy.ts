import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // `/management` is always the dedicated management sign-in gateway.
  if (pathname === '/management') {
    const response = NextResponse.next();
    response.cookies.delete('token');
    return response;
  }

  // If there's no token and they are trying to access protected routes, redirect to login
  if (!token) {
    if (pathname.startsWith('/management/')) {
      return NextResponse.redirect(new URL('/management', request.url));
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  let payload: any = null;
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      payload = JSON.parse(jsonPayload);
    }
  } catch {
    try {
      const parts = token.split('.');
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    } catch {
      payload = null;
    }
  }

  if (!payload) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('token');
    return response;
  }

  const rawRole = String(payload.role || "").trim().toUpperCase();

  // Do not trap users behind an expired token.
  if (payload.exp && Number(payload.exp) * 1000 <= Date.now()) {
    const destination = pathname.startsWith('/management') ? '/management' : '/auth';
    const response = pathname === destination
      ? NextResponse.next()
      : NextResponse.redirect(new URL(destination, request.url));
    response.cookies.delete('token');
    return response;
  }

  let allowedPath = "";
  if (rawRole.includes("SUPER")) {
    allowedPath = '/management/super-admin';
  } else if (rawRole.includes("ADMIN") || rawRole === "STAFF" || rawRole === "MANAGEMENT") {
    allowedPath = '/management/admin';
  } else if (rawRole.includes("ACCOUNT")) {
    allowedPath = '/management/accounts';
  } else if (rawRole.includes("SALE")) {
    allowedPath = '/management/sales';
  } else if (rawRole.includes("SUPPORT")) {
    allowedPath = '/management/support';
  } else if (rawRole.includes("PATIENT")) {
    allowedPath = '/patient';
  } else if (rawRole.includes("HOSPITAL")) {
    allowedPath = '/hospital';
  } else if (rawRole.includes("LAB")) {
    allowedPath = '/laboratory';
  } else if (rawRole.includes("PHARMACY") || rawRole.includes("PHARMACIST")) {
    allowedPath = '/pharmacy';
  } else if (rawRole.includes("CLINIC") || rawRole.includes("DOCTOR")) {
    allowedPath = '/clinic';
  }

  // If the user's role is not recognized, redirect to login
  if (!allowedPath) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('token');
    return response;
  }

  // Check if the user is trying to access a path that doesn't start with their allowed path
  if (pathname !== allowedPath && !pathname.startsWith(allowedPath + '/')) {
    const destination = `${allowedPath}/overview`;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/hospital/:path*',
    '/laboratory/:path*',
    '/clinic/:path*',
    '/pharmacy/:path*',
    '/management/:path*',
  ],
};
