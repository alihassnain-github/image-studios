"use client";

import Link from "next/link";

export default function Navbar() {

    return (
        <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50" >
            <div className="navbar-start">
                <a href="/" className="btn btn-ghost text-xl font-bold text-primary">
                    🖼️ Image Studio
                </a>
            </div>

            <div className="navbar-end gap-2">
                {/* Auth Buttons */}
                <button className="btn btn-ghost btn-sm">
                    <Link href="/login">Login</Link>
                </button>
                <button className="btn btn-primary btn-sm">
                    <Link href="/signup">Sign Up</Link>
                </button>
            </div>
        </nav >
    )
}