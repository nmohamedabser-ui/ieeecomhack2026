
import { SummaryReport, User } from "../types";

const REPORTS_KEY = 'exec_comm_reports';
const USERS_KEY = 'exec_comm_users';
const SESSION_KEY = 'exec_comm_session';

export const saveReport = (report: SummaryReport) => {
  const user = getCurrentUser();
  if (!user) return;
  
  const reportWithUser = { ...report, userId: user.id };
  const existing = getAllReports();
  const updated = [reportWithUser, ...existing];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
};

export const getReports = (): SummaryReport[] => {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getAllReports();
  // In a real DB, we'd query by userId. Here we filter.
  return all.filter((r: any) => r.userId === user.id);
};

const getAllReports = () => {
  const data = localStorage.getItem(REPORTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteReport = (id: string) => {
  const existing = getAllReports();
  const filtered = existing.filter((r: any) => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
};

// User & Auth logic
export const registerUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setSession(user);
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const setSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};
