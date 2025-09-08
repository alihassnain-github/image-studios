"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Lock, Camera, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { ClerkAPIError } from '@clerk/types';
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";

const profileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .nonempty({ message: "First name is required" })
        .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
        .string()
        .trim()
        .nonempty({ message: "Last name is required" })
        .min(2, { message: "Last name must be at least 2 characters" }),
});

const passwordSchema = z
    .object({
        currentPassword: z
            .string()
            .trim()
            .nonempty({ message: "Current password is required" }),
        newPassword: z
            .string()
            .trim()
            .nonempty({ message: "Password is required" })
            .min(8, { message: "Password must be at least 8 characters" })
            .max(15, { message: "Password must not exceed 15 characters" })
            .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
            .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain a number" }),
    })

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {

    const { user } = useUser()

    const { addToast } = useToast()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // if (!user) return;

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const handleProfileSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        try {
            await user.update({
                firstName: data.firstName,
                lastName: data.lastName,
            })

            if (selectedFile) {
                await user.setProfileImage({ file: selectedFile });
            }

            addToast({ message: "Profile updated successfully.", variant: "success" })

            await user.reload();
            setSelectedFile(null);
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
                    message: "Failed to update profile. Please try again.",
                    variant: "danger",
                })
            }
        }
    };

    const handlePasswordSubmit = async (data: PasswordFormData) => {
        if (!user) return;
        try {
            await user.updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                signOutOfOtherSessions: true,
            })

            addToast({ message: "Password updated successfully.", variant: "success" })

            passwordForm.reset();

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
                    message: "Failed to update password. Please try again.",
                    variant: "danger",
                })
            }
        }
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Profile Settings</h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center my-6">
                    <div role="tablist" className="tabs tabs-box tabs-sm">
                        <button
                            className={`tab w-32 ${activeTab === "profile" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <User className="h-4 w-4 mr-2" /> Profile
                        </button>
                        <button
                            className={`tab w-32 ${activeTab === "security" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("security")}
                        >
                            <Lock className="h-4 w-4 mr-2" /> Security
                        </button>
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <form
                        onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                        className="space-y-8"
                    >
                        {/* Avatar */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <Image
                                            src={selectedImage || user?.imageUrl || "/images/default-avatar.png"}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            width={128}
                                            height={128}
                                        />
                                    </div>
                                </div>
                                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-focus transition-colors">
                                    <Camera className="w-5 h-5 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-base-content/70">
                                Click the camera icon to upload a new image
                            </p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="form-control w-full">
                                <label className="label block">
                                    <span className="label-text font-medium text-sm">First Name</span>
                                </label>
                                <input
                                    type="text"
                                    {...profileForm.register("firstName")}
                                    className={`input input-bordered ${profileForm.formState.errors.firstName ? "input-error" : ""
                                        }`}
                                    placeholder="Enter your first name"
                                />
                                {profileForm.formState.errors.firstName && (
                                    <p className="text-error text-sm mt-1">
                                        {profileForm.formState.errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="form-control w-full">
                                <label className="label block">
                                    <span className="label-text font-medium text-sm">Last Name</span>
                                </label>
                                <input
                                    type="text"
                                    {...profileForm.register("lastName")}
                                    className={`input input-bordered ${profileForm.formState.errors.lastName ? "input-error" : ""
                                        }`}
                                    placeholder="Enter your last name"
                                />
                                {profileForm.formState.errors.lastName && (
                                    <p className="text-error text-sm mt-1">
                                        {profileForm.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="card-actions justify-end pt-4">
                            <button type="submit" className="btn btn-primary" disabled={passwordForm.formState.isSubmitting || profileForm.formState.isSubmitting}>
                                {profileForm.formState.isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Loading
                                    </>
                                ) : "Update Profile"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="space-y-8">
                        {/* Password Update */}
                        <div className="card bg-base-100 border border-base-300">
                            <div className="card-body">
                                <h4 className="card-title text-lg mb-4">Update Password</h4>
                                <form
                                    onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                                    className="space-y-4"
                                >

                                    <div className="form-control mb-6">
                                        <label className="label block">
                                            <span className="label-text font-medium text-sm">Current Password</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2">
                                            <input
                                                disabled={!user?.passwordEnabled}
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...passwordForm.register("currentPassword")}
                                                placeholder="Enter your current password"
                                                className="grow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </label>
                                        {passwordForm.formState.errors.currentPassword && (
                                            <p className="text-error text-sm mt-1">
                                                {passwordForm.formState.errors.currentPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label block">
                                            <span className="label-text font-medium text-sm">New Password</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2">
                                            <input
                                                disabled={!user?.passwordEnabled}
                                                type={showPassword ? "text" : "password"}
                                                {...passwordForm.register("newPassword")}
                                                placeholder="Enter your new password"
                                                className="grow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </label>
                                        {passwordForm.formState.errors.newPassword && (
                                            <p className="text-error text-sm mt-1">
                                                {passwordForm.formState.errors.newPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="card-actions justify-end pt-4">
                                        <button type="submit" disabled={passwordForm.formState.isSubmitting || profileForm.formState.isSubmitting || !user?.passwordEnabled} className="btn btn-primary">
                                            {passwordForm.formState.isSubmitting ? (
                                                <>
                                                    <span className="loading loading-spinner"></span>
                                                    Loading
                                                </>
                                            ) : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}