"use client";

import { toastId } from "@/components/shared/toastId";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/authService";
import Link from "next/link";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordForm() {
    const form = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [directResetLink, setDirectResetLink] = useState("");

    const { formState: { isSubmitting } } = form;

    const handleForgotPassword = async (data: FieldValues) => {
        toast.loading("Sending password reset link...", { id: toastId });
        try {
            const res = await forgotPassword(data.email);

            if (res.success) {
                toast.success(res.message || "Reset link sent!", { id: toastId });
                setSubmittedEmail(data.email);
                const link = res.data?.resetLink || res.resetLink;
                if (link) {
                    setDirectResetLink(link);
                }
                setIsSubmitted(true);
            } else {
                toast.error(res.errorMessage || res.message || "Failed to send reset link", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.message || "An unexpected error occurred", { id: toastId });
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-indigo-50 text-indigo-600">
                    <MailCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Check Your Email</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    We sent a password reset link to <span className="font-semibold text-slate-900">{submittedEmail}</span>. Please check your inbox and click the link to reset your password.
                </p>

                {directResetLink && (
                    <div className="pt-2">
                        <a
                            href={directResetLink}
                            className="inline-block px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg"
                        >
                            🔗 Click Here to Reset Password Now
                        </a>
                    </div>
                )}

                <div className="pt-3">
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(handleForgotPassword)}>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Forgot Password?</h2>
                <p className="text-sm text-slate-600">
                    Enter your email address below and we will send you instructions to reset your password.
                </p>
            </div>

            <Controller
                name="email"
                control={form.control}
                rules={{ required: "Email address is required" }}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="you@example.com"
                            autoComplete="off"
                            type="email"
                            value={field.value || ""}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer disabled:cursor-no-drop">
                {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </Button>

            <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sign In
                </Link>
            </div>
        </form>
    );
}
