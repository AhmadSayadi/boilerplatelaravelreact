import { ReactNode } from "react";
import { router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export interface DetailField {
  /** Field label */
  label: string;
  /** Field value (string, ReactNode, or undefined) */
  value: ReactNode;
}

export interface CrudShowLayoutProps {
  /** Page title for <Head> */
  title: string;
  /** Page heading */
  heading: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Card title */
  cardTitle?: string;
  /** Back navigation route */
  backRoute: string;
  /** Edit route (if edit button should be shown) */
  editRoute?: string;
  /** Whether edit button is visible */
  canEdit?: boolean;
  /** Detail fields to display */
  fields?: DetailField[];
  /** Custom content (alternative to fields) */
  children?: ReactNode;
  /** Additional header buttons */
  headerExtra?: ReactNode;
}

export function CrudShowLayout({
  title,
  heading,
  subtitle,
  cardTitle = "Detail Informasi",
  backRoute,
  editRoute,
  canEdit = true,
  fields,
  children,
  headerExtra,
}: CrudShowLayoutProps) {
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
          <div className="ml-auto flex items-center gap-2">
            {headerExtra}
            {canEdit && editRoute && (
              <Button onClick={() => router.visit(editRoute)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {field.label}
                    </h3>
                    <div className="text-lg">
                      {field.value ?? "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              children
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
