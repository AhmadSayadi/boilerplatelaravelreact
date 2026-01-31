import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <DashboardLayout>
            <Head title="Profile" />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>
                            Manage your profile information and security settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                        
                        <Separator />

                        <UpdatePasswordForm className="max-w-xl" />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
