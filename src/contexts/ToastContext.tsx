'use client'

import { Toast } from '@/components/toast'
import { createContext, useContext, useState, ReactNode } from 'react'

type ToastVariant = 'default' | 'success' | 'info' | 'danger' | 'warning'
type ToastPosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'

interface Toast {
    id: string
    message: string
    variant?: ToastVariant
    duration?: number
    position?: ToastPosition
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = crypto.randomUUID()
        const newToast: Toast = {
            id,
            variant: 'default',
            duration: 5000,
            position: 'bottom-left',
            ...toast,
        }
        setToasts((prev) => [...prev, newToast])

        // Auto remove after duration
        setTimeout(() => removeToast(id), newToast.duration)
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Render all toasts */}
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
