"use client"

import { toastId } from "@/components/shared/toastId";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, FieldValues, useForm } from "react-hook-form"
import { toast } from "sonner";
import { ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

import { useUser } from "@/context/UserContext";

const DEMO_USERS = [
    {
        role: "Admin",
        email: "arfan.exprovia@gmail.com",
        password: "Arfan@13",
        icon: ShieldCheck,
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    },
    {
        role: "Teacher",
        email: "jamalpstu07@gmail.com",
        password: "SecurePassword123",
        icon: UserCheck,
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    {
        role: "Student",
        email: "2002027@cse.pstu.ac.bd",
        password: "studentpassword",
        icon: GraduationCap,
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
];

export default function LoginForm() {
    const form = useForm();
    const router = useRouter();
    const { refreshUser } = useUser();

    const { formState: { isSubmitting } } = form;

    const handleLogin = async (data: FieldValues) => {
        toast.loading("Signing In...", { id: toastId });
        const res = await loginUser(data);

        if (res.success) {
            if (refreshUser) {
                await refreshUser();
            }
            toast.success(res.message || "Login Successful", { id: toastId });
            router.push("/");
        } else {
            toast.error(res.errorMessage || "Login Failed Due to Unknown Error", { id: toastId });
        }
    }

    const handleDemoLogin = async (email: string, password: string) => {
        form.setValue("email", email);
        form.setValue("password", password);
        await handleLogin({ email, password });
    };

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(handleLogin)}>
            {/* Quick Demo Login Section */}
            <div className="pb-4 border-b border-slate-200 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
                    ⚡ Quick Demo Login (Click to Sign In)
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {DEMO_USERS.map((demo) => {
                        const Icon = demo.icon;
                        return (
                            <button
                                key={demo.role}
                                type="button"
                                onClick={() => handleDemoLogin(demo.email, demo.password)}
                                disabled={isSubmitting}
                                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 ${demo.badgeBg}`}
                            >
                                <Icon className="w-5 h-5 mb-1" />
                                <span>{demo.role}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Email Field */}
            <Controller
                name="email"
                control={form.control}
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

            {/* Password Field */}
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="••••••••"
                            autoComplete="off"
                            type="password"
                            value={field.value || ""}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <div className="flex justify-end">
                <Link href="/forgot-password" className="font-semibold underline text-indigo-600 hover:text-indigo-700 transition-colors text-sm">
                    Forgot Password?
                </Link>
            </div>

            {/* Sign In Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer disabled:cursor-no-drop">{isSubmitting ? "Signing In..." : "Sign In"}</Button>
        </form>
    )
}
