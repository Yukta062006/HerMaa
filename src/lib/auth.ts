export interface User {
  name: string;
  email: string;
  age?: number;
  language?: string;
  userId?: string;
  password?: string;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("hermaa_user");
  return data ? JSON.parse(data) : null;
}

export function setUser(user: User) {
  localStorage.setItem("hermaa_user", JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem("hermaa_user");
  localStorage.removeItem("hermaa_token");
}

export function isLoggedIn(): boolean {
  return !!getUser() && !!localStorage.getItem("hermaa_token");
}

// Registered users store
interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  age?: number;
  language?: string;
}

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("hermaa_registered_users");
  return data ? JSON.parse(data) : [];
}

export function registerUser(user: RegisteredUser): boolean {
  const users = getRegisteredUsers();
  if (users.find((u) => u.email === user.email)) return false; // Already exists
  users.push(user);
  localStorage.setItem("hermaa_registered_users", JSON.stringify(users));
  return true;
}

export function validateLogin(email: string, password: string): RegisteredUser | null {
  const users = getRegisteredUsers();
  return users.find((u) => u.email === email && u.password === password) || null;
}

export function userExists(email: string): boolean {
  return getRegisteredUsers().some((u) => u.email === email);
}
