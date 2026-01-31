import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useCallback } from 'react';

export const usePermission = () => {
  const { auth } = usePage<PageProps>().props;

  const hasPermission = useCallback((permission: string | string[]) => {
    // If user is super-admin (usually checks a role, but if permissions include all, it works)
    // Or if we have a specific super-admin check.
    // For now, relying on the permissions list passed from backend.
    
    if (!auth.permissions) return false;

    if (Array.isArray(permission)) {
      return permission.some((p) => auth.permissions.includes(p));
    }

    return auth.permissions.includes(permission);
  }, [auth.permissions]);

  const hasAllPermissions = useCallback((permissions: string[]) => {
    if (!auth.permissions) return false;
    return permissions.every((p) => auth.permissions.includes(p));
  }, [auth.permissions]);

  return { hasPermission, hasAllPermissions, permissions: auth.permissions };
};
