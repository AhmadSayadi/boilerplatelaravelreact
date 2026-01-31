export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface RoleFormValues {
  name: string;
  description: string;
  permissions: string[];
  status: 'Active' | 'Inactive';
}

export const availablePermissions = [
  { value: 'create', label: 'Create' },
  { value: 'read', label: 'Read' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'manage_roles', label: 'Manage Roles' },
];
