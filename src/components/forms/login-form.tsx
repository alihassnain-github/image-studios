'use client';

import { useState } from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSignIn } from "@clerk/nextjs";
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useOAuthSignIn } from '@/hooks/useOAuthSignIn';
import Link from 'next/link';

const FormSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(15, { message: "Password must not exceed 15 characters" })
})

export default function LoginForm() {

  const { signIn, setActive, isLoaded } = useSignIn();

  const { signInWith } = useOAuthSignIn()

  const { addToast } = useToast()

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  })

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    if (!isLoaded) return;

    try {
      const response = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId })
        router.push("/")
      }

    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        // Clerk gives you an array of ClerkAPIError objects
        err.errors.forEach((clerkError: ClerkAPIError) => {
          addToast({
            message: clerkError.message,
            variant: "danger",
          })
        })
      } else {
        // fallback for unexpected errors
        addToast({
          message: "Something went wrong. Please try again.",
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
            Sign in to your account
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="mb-6 flex gap-3" onClick={() => signInWith('oauth_google')}>
          <button className="btn btn-outline w-full gap-2 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="20" viewBox="0 0 20 20" width="20">
              <g clipPath="url(#clip0_98_45)">
                <path d="M19.9905 10.1871C19.9905 9.36773 19.9224 8.7698 19.7752 8.14972H10.1992V11.848H15.8201C15.7068 12.7671 15.0948 14.1512 13.7349 15.0813L13.7159 15.2051L16.7436 17.497L16.9534 17.5174C18.8798 15.779 19.9905 13.2211 19.9905 10.1871Z" fill="#4285F4" />
                <path d="M10.1992 19.9313C12.953 19.9313 15.2648 19.0454 16.9534 17.5174L13.7349 15.0813C12.8737 15.6682 11.7177 16.0779 10.1992 16.0779C7.50211 16.0779 5.21297 14.3395 4.39695 11.9366L4.27734 11.9466L1.12906 14.3273L1.08789 14.4391C2.76508 17.6945 6.21016 19.9313 10.1992 19.9313Z" fill="#34A853" />
                <path d="M4.39695 11.9366C4.18164 11.3166 4.05703 10.6521 4.05703 9.96565C4.05703 9.27908 4.18164 8.61473 4.38562 7.99466L4.37992 7.8626L1.19219 5.44366L1.08789 5.49214C0.396641 6.84305 0 8.36008 0 9.96565C0 11.5712 0.396641 13.0882 1.08789 14.4391L4.39695 11.9366Z" fill="#FBBC05" />
                <path d="M10.1992 3.85336C12.1144 3.85336 13.4062 4.66168 14.1429 5.33718L17.0213 2.59107C15.2535 0.985496 12.953 0 10.1992 0C6.21016 0 2.76508 2.23672 1.08789 5.49214L4.38563 7.99466C5.21297 5.59183 7.50211 3.85336 10.1992 3.85336Z" fill="#EB4335" />
              </g>
              <defs>
                <clipPath id="clip0_98_45">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
            Google
          </button>

          <button className="btn btn-outline w-full gap-2 flex-1" onClick={() => signInWith('oauth_github')}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Email and Password Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
            <div className="min-h-5 mt-1">
              {errors.email && (
                <p className="text-error text-sm">{errors.email.message as string}</p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-12"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="min-h-5 mt-1">
              {errors.password && (
                <p className="text-error text-sm">{errors.password.message as string}</p>
              )}
            </div>
          </div>
          <label className="label">
            <span className="label-text-alt link link-primary">Forgot password?</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ?
              (
                <>
                  <span className="loading loading-spinner"></span>
                  Loading
                </>
              ) : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="link link-primary font-medium">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
