'use client';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { ClerkAPIError } from '@clerk/types';
import { useToast } from "@/contexts/ToastContext";

const FormSchema = z.object({
    otp: z
        .string()
        .trim()
        .nonempty({ message: "OTP is required" })
        .length(6, { message: "OTP must be exactly 6 digits" })
        .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
})

export default function OTPForm() {

    const { addToast } = useToast()

    const router = useRouter()
    const { signUp, setActive, isLoaded } = useSignUp()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        if (!isLoaded) return;

        try {
            const verification = await signUp.attemptEmailAddressVerification({
                code: data.otp,
            })

            if (verification.status === "complete") {
                await setActive({ session: verification.createdSessionId })
                router.push("/")
            }

        } catch (err: unknown) {
            if (isClerkAPIResponseError(err)) {
                err.errors.forEach((clerkError: ClerkAPIError) => {
                    addToast({
                        message: clerkError.message,
                        variant: "danger",
                    })
                })
            } else {
                addToast({
                    message: "OTP verification failed. Please try again.",
                    variant: "danger",
                })
            }
        }
    }

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">

                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        🖼️ Image Studio
                    </h1>
                    <p className="text-muted-foreground">
                        Verify your email
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        We've sent a 6-digit code to your email address
                    </p>
                </div>

                {/* OTP Verification Form */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Enter OTP Code</span>
                        </label>
                        <input
                            {...register("otp")}
                            type="text"
                            placeholder="123456"
                            className="input input-bordered w-full text-center text-2xl font-mono tracking-widest"
                            maxLength={6}
                        />
                        <div className="min-h-5 mt-1">
                            {errors.otp && (
                                <p className="text-error text-sm">{errors.otp.message as string}</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Verifying...
                            </>
                        ) : "Verify Email"}
                    </button>
                </form>

                {/* Resend and Back Links */}
                <div className="text-center mt-6 space-y-3">
                    <div>
                        <span className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button className="link link-primary font-medium">
                                Resend
                            </button>
                        </span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">
                            <button
                                onClick={() => router.back()}
                                className="link link-primary font-medium"
                            >
                                Go back
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
