import SignupForm from '@/components/forms/signup-form';
import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sign Up - Image Studios",
  description: "Create your free Image Studios account to download and save millions of high-quality stock photos and videos. Join thousands of creators today.",
};

export default function SignupPage() {
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

          {/* Signup Form */}
          <SignupForm />

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
