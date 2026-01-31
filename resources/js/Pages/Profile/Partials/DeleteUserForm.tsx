import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError';
import { Label } from '@/components/ui/label';
import Modal from '@/components/Modal';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Hapus Akun</CardTitle>
                <CardDescription>
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                    Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={confirmUserDeletion}>
                    Hapus Akun
                </Button>

                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Apakah Anda yakin ingin menghapus akun Anda?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                            Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                        </p>

                        <div className="mt-6 space-y-2">
                            <Label htmlFor="password" className="sr-only">Password</Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="block w-3/4"
                                placeholder="Password"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <Button variant="outline" onClick={closeModal} type="button">
                                Batal
                            </Button>

                            <Button variant="destructive" disabled={processing}>
                                Hapus Akun
                            </Button>
                        </div>
                    </form>
                </Modal>
            </CardContent>
        </Card>
    );
}
