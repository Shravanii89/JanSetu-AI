// JanSetu AI - Authentication Helpers
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jansetu_auth_token");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("jansetu_auth_token", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jansetu_auth_token");
  }
}
