export interface Permission {
  id: number;
  name: string;
  display_name: string;
  group_name?: string;
  guard_name: string;
}

export interface Role {
  id: number;
  name: string;
  group_name?: string;
  guard_name: string;
  permissions: Permission[];
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface RoleFormValues {
  name: string;
  group_name?: string;
  permissions: number[]; // IDs
  status: 'Active' | 'Inactive';
}
