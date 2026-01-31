import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleFormValues, Permission } from "../Types";

interface RoleFormFieldsProps {
  form: UseFormReturn<RoleFormValues>;
  permissions: Record<string, Permission[]>;
}

export const RoleFormFields = ({ form, permissions }: RoleFormFieldsProps) => {
  const currentPermissions = form.watch("permissions") || [];
  const allPermissionIds = Object.values(permissions).flat().map((p) => p.id);

  const isAllSelected = allPermissionIds.length > 0 && allPermissionIds.every((id) => currentPermissions.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      form.setValue("permissions", allPermissionIds);
    } else {
      form.setValue("permissions", []);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Role</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="group_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan group name (opsional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Permissions</FormLabel>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Pilih Semua
            </label>
          </div>
        </div>
        
        {Object.entries(permissions).map(([group, groupPermissions]) => {
          const groupPermissionIds = groupPermissions.map((p) => p.id);
          const isGroupSelected = groupPermissionIds.every((id) => currentPermissions.includes(id));

          const handleSelectGroup = (checked: boolean) => {
            const current = form.getValues("permissions") || [];
            if (checked) {
              const newPermissions = [...new Set([...current, ...groupPermissionIds])];
              form.setValue("permissions", newPermissions);
            } else {
              const newPermissions = current.filter((id) => !groupPermissionIds.includes(id));
              form.setValue("permissions", newPermissions);
            }
          };

          return (
            <div key={group} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium capitalize">{group || 'General'}</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-group-${group}`}
                    checked={isGroupSelected}
                    onCheckedChange={(checked) => handleSelectGroup(checked as boolean)}
                  />
                  <label
                    htmlFor={`select-group-${group}`}
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Pilih Group
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {groupPermissions.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, permission.id]);
                              } else {
                                field.onChange(
                                  currentValue.filter((value) => value !== permission.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm">
                          {permission.display_name || permission.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
