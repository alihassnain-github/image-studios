'use client'

import { X } from 'lucide-react'
import { JSX } from 'react'

interface ToastProps {
    id: string
    message: string
    variant?: 'default' | 'success' | 'info' | 'danger' | 'warning'
    position?: string
    onClose: () => void
}

const variantClasses: Record<string, string> = {
    default: '',
    success: 'alert-success',
    info: 'alert-info',
    danger: 'alert-error',
    warning: 'alert-warning',
}

const variantIcons: Record<string, JSX.Element> = {
    default: <></>,
    success: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    info: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>,
    danger: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>,
}

const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
}

export function Toast({
    message,
    variant = 'default',
    position = 'bottom-left',
    onClose,
}: ToastProps) {
    return (
        <div
            className={`toast fixed z-50 ${positionClasses[position]}`}
        >
            <div className={`alert ${variantClasses[variant]} flex items-center gap-2`}>
                {variantIcons[variant]}
                <span>{message}</span>
                <button className="ml-2" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}
