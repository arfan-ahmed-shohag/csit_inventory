"use client";

import { toastId } from "@/components/shared/toastId";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/authService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export default function ResetPasswordForm() {
    const form = useForm();
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const { formState: { isSubmitting } } = form;

    const handleResetPassword = async (data: FieldValues) => {
        if (!token || !email) {
            toast.error("Invalid or missing reset token parameters", { id: toastId });
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords do not match!", { id: toastId });
            return;
        }

        toast.loading("Resetting password...", { id: toastId });
        try {
            const res = await resetPassword({
                email,
                token,
                newPassword: data.newPassword,
            });

            if (res.success) {
                toast.success(res.message || "Password reset successful!", { id: toastId });
                router.push("/login");
            } else {
                toast.error(res.errorMessage || res.message || "Failed to reset password", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.message || "An error occurred", { id: toastId });
        }
    };

    if (!token || !email) {
        return (
            <div className="text-center py-4 space-y-4">
                <p className="text-sm text-red-600 font-medium">
                    Invalid or missing password reset link parameters.
                </p>
                <Link href="/forgot-password" className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    Request a new reset link
                </Link>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(handleResetPassword)}>
            <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                    <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Set New Password</h2>
                <p className="text-sm text-slate-600">
                    Set a new password for <span className="font-semibold text-slate-900">{email}</span>
                </p>
            </div>

            <Controller
                name="newPassword"
                control={form.control}
                rules={{ required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="••••••••"
                            type="password"
                            value={field.value || ""}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="confirmPassword"
                control={form.control}
                rules={{ required: "Please confirm your new password" }}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="••••••••"
                            type="password"
                            value={field.value || ""}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer disabled:cursor-no-drop">
                {isSubmitting ? "Updating Password..." : "Reset Password"}
            </Button>
        </form>
    );
}
