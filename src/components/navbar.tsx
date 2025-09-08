"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import ProfileModal from "./profile-modal";
import Image from "next/image";

export default function Navbar() {

    const { user } = useUser()
    const { signOut } = useClerk()
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    return (
        <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50" >
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
                    🖼️ Image Studio
                </Link>
            </div>

            <div className="navbar-end gap-2">
                {!user ? (
                    <>
                        {/* Auth Buttons */}
                        <Link href="/login" className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link href="/signup" className="btn btn-primary btn-sm">
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <Image
                                        src={user.imageUrl || "/default-avatar.png"}
                                        alt={user.fullName || user.primaryEmailAddress?.emailAddress || "User"}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="mt-3 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-56"
                            >
                                <li>
                                    <p className="flex flex-col items-start gap-0">
                                        <span className={user.fullName ? "text-sm font-medium" : "text-xs"}>
                                            {user.fullName || user.primaryEmailAddress?.emailAddress}
                                        </span>
                                        {
                                            user.fullName && (
                                                <span className="text-xs text-muted-foreground">
                                                    {user.primaryEmailAddress?.emailAddress}
                                                </span>
                                            )
                                        }
                                    </p>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button onClick={() => setIsProfileModalOpen(true)}>
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => signOut()} className="text-error">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* Profile Modal */}
                        <ProfileModal
                            isOpen={isProfileModalOpen}
                            onClose={() => setIsProfileModalOpen(false)}
                        />
                    </>
                )}
            </div>
        </nav>
    )
}