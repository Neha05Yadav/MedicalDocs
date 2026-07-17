export function authHeaders(json = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
