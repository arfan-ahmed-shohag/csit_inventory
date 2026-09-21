import ResetPasswordForm from "@/components/modules/auth/resetPassword/ResetPasswordForm";
import Image from "next/image";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 transition-colors flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="mb-6 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-400 to-blue-400 rounded-full blur-lg opacity-30"></div>
                            <Image
                                width={70}
                                height={70}
                                src="https://res.cloudinary.com/dwduymu1l/image/upload/v1769187917/Patuakhali_Science_and_Technology_University_logo_rv2zwu.png"
                                alt="Patuakhali_Science_and_Technology_University"
                                className="relative mx-auto h-16 w-16"
                            />
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-6 sm:p-8">
                    <Suspense fallback={<div className="text-center text-sm py-4">Loading reset form...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
