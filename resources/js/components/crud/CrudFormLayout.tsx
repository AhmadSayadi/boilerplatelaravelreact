import { useState, useEffect, ReactNode } from "react";
import { router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormSkeleton } from "./FormSkeleton";

export interface CrudFormLayoutProps {
  /** Page title for <Head> */
  title: string;
  /** Page heading */
  heading: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Card title */
  cardTitle?: string;
  /** Whether this is edit mode */
  isEdit?: boolean;
  /** Back navigation route */
  backRoute: string;
  /** Form submit route */
  submitRoute: string;
  /** HTTP method for submit (default: "post" for create, "put" for edit) */
  submitMethod?: "post" | "put";
  /** Form values to submit */
  formValues: Record<string, any>;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Set submitting state */
  setIsSubmitting: (value: boolean) => void;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
  /** Callback on success */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (errors: Record<string, string>) => void;
  /** Custom submit handler (overrides default) */
  onSubmit?: () => void;
  /** Number of skeleton fields to show while loading */
  skeletonFields?: number;
  /** Submit button label */
  submitLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Form content (children) */
  children: ReactNode;
}

export function CrudFormLayout({
  title,
  heading,
  subtitle,
  cardTitle,
  isEdit = false,
  backRoute,
  submitRoute,
  submitMethod,
  formValues,
  isSubmitting,
  setIsSubmitting,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  onSubmit,
  skeletonFields = 4,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  children,
}: CrudFormLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const method = submitMethod || (isEdit ? "put" : "post");
  const defaultSuccessMessage = isEdit ? "Data berhasil diperbarui" : "Data berhasil ditambahkan";
  const defaultErrorMessage = isEdit ? "Gagal memperbarui data" : "Gagal menambahkan data";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit();
      return;
    }

    setIsSubmitting(true);

    const options = {
      onSuccess: () => {
        toast.success(successMessage || defaultSuccessMessage);
        onSuccess?.();
      },
      onError: (errors: Record<string, string>) => {
        toast.error(errorMessage || defaultErrorMessage);
        onError?.(errors);
      },
      onFinish: () => setIsSubmitting(false),
    };

    if (method === "put") {
      router.put(submitRoute, formValues as any, options);
    } else {
      router.post(submitRoute, formValues as any, options);
    }
  };

  return (
    <DashboardLayout>
      <Head title={title} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.visit(backRoute)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{heading}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        {isLoading ? (
          <FormSkeleton fields={skeletonFields} showHeader={false} />
        ) : (
          <Card>
            {cardTitle && (
              <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
              </CardHeader>
            )}
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {children}
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.visit(backRoute)}
                    disabled={isSubmitting}
                  >
                    {cancelLabel}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {submitLabel}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
