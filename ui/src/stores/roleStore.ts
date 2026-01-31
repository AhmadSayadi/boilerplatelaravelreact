import { create } from 'zustand';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface RoleState {
  roles: Role[];
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  bulkDeleteRoles: (ids: string[]) => void;
  getRoleById: (id: string) => Role | undefined;
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_roles'],
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Can manage products and orders',
    permissions: ['create', 'read', 'update', 'delete'],
    status: 'Active',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic user access',
    permissions: ['read'],
    status: 'Active',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Editor',
    description: 'Can create and edit content',
    permissions: ['create', 'read', 'update'],
    status: 'Active',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read'],
    status: 'Inactive',
    createdAt: '2024-03-01',
  },
];

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: initialRoles,
  
  addRole: (roleData) => {
    const newRole: Role = {
      ...roleData,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
  },
  
  updateRole: (id, roleData) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, ...roleData } : role
      ),
    }));
  },
  
  deleteRole: (id) => {
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    }));
  },

  bulkDeleteRoles: (ids) => {
    set((state) => ({
      roles: state.roles.filter((role) => !ids.includes(role.id)),
    }));
  },
  
  getRoleById: (id) => {
    return get().roles.find((role) => role.id === id);
  },
}));
