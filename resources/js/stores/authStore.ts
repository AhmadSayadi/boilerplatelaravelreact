import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string, name: string) => { success: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; error?: string };
}

// Hardcoded users
const hardcodedUsers = [
  { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Administrator', role: 'Admin' },
  { id: '2', email: 'user@example.com', password: 'user123', name: 'User', role: 'User' },
  { id: '3', email: 'manager@example.com', password: 'manager123', name: 'Manager', role: 'Manager' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const user = hardcodedUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return { success: true };
        }

        return { success: false, error: 'Email atau password salah' };
      },

      register: (email: string, password: string, name: string) => {
        const existingUser = hardcodedUsers.find((u) => u.email === email);
        
        if (existingUser) {
          return { success: false, error: 'Email sudah terdaftar' };
        }

        // In a real app, this would save to database
        const newUser = {
          id: String(hardcodedUsers.length + 1),
          email,
          name,
          role: 'User',
        };

        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      resetPassword: (email: string) => {
        const user = hardcodedUsers.find((u) => u.email === email);
        
        if (user) {
          return { success: true };
        }

        return { success: false, error: 'Email tidak ditemukan' };
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
