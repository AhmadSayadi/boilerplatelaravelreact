import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleFormValues, availablePermissions } from "../types";

interface RoleFormFieldsProps {
  form: UseFormReturn<RoleFormValues>;
}

export const RoleFormFields = ({ form }: RoleFormFieldsProps) => {
  return (
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

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Textarea placeholder="Masukkan deskripsi role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="permissions"
        render={() => (
          <FormItem className="md:col-span-2">
            <FormLabel>Permissions</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {availablePermissions.map((permission) => (
                <FormField
                  key={permission.value}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(permission.value)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, permission.value]);
                            } else {
                              field.onChange(
                                currentValue.filter((value) => value !== permission.value)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {permission.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
