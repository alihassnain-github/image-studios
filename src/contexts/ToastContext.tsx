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

const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
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
            {Object.keys(positionClasses).map((position) => (
                <div key={position} className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2`}>
                    {toasts.filter((toast) => toast.position === position).map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </div>
            ))}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
