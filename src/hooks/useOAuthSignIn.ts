"use client"

import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/types"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"
import { ClerkAPIError } from "@clerk/types"
import { useToast } from "@/contexts/ToastContext"

export function useOAuthSignIn() {

    const { signIn } = useSignIn()
    const { addToast } = useToast()

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
                    addToast({
                        message: clerkError.message,
                        variant: "danger",
                    })
                })
            } else {
                addToast({
                    message: "Something went wrong. Please try again.",
                    variant: "danger",
                })
            }
        }
    }

    return { signInWith }
}
