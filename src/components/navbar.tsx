"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {

    const { user } = useUser()

    const { signOut } = useClerk()

    return (
        <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50" >
            <div className="navbar-start">
                <a href="/" className="btn btn-ghost text-xl font-bold text-primary">
                    🖼️ Image Studio
                </a>
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
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    src={user.imageUrl || "/default-avatar.png"}
                                    alt={user.fullName || user.primaryEmailAddress?.emailAddress || "User"}
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li className="px-2 py-1">
                                <span className="text-sm font-medium">
                                    {user.fullName || user.primaryEmailAddress?.emailAddress}
                                </span>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <button onClick={() => signOut()} className="text-error">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}