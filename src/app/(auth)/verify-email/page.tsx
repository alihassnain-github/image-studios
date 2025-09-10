import OTPForm from '@/components/forms/opt-form';
import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Verify Email - Image Studios",
    description: "Verify your email address to complete your Image Studios account setup. Enter the verification code sent to your email.",
};

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Background with gradient */}
            <div
                className="flex-1 flex items-center justify-center p-4"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="w-full max-w-md">

                    {/* OTP Verification Form */}
                    <OTPForm />

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link
                            href="/"
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
