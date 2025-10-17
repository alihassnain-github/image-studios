"use client"

import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/types"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"
import { ClerkAPIError } from "@clerk/types"
import { toast } from "react-toastify"

export function useOAuthSignIn() {

    const { signIn } = useSignIn()

    const signInWith = async (strategy: OAuthStrategy) => {
        if (!signIn) return

        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            })
        } catch (err: unknown) {
            if (isClerkAPIResponseError(err)) {
                err.errors.forEach((clerkError: ClerkAPIError) => {
                    toast.error(clerkError.message);
                })
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }

    return { signInWith }
}
