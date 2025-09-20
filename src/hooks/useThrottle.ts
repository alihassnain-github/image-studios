import { useCallback, useRef } from "react";

export default function useThrottle(func: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastExecutedRef = useRef<number>(0);

    const throttledFunc = useCallback((...args: any[]) => {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutedRef.current;

        // If enough time has passed since last execution, execute immediately
        if (timeSinceLastExecution >= delay) {
            func(...args);
            lastExecutedRef.current = now;
        }
        // Otherwise, schedule execution for the remaining time
        else if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                func(...args);
                lastExecutedRef.current = Date.now();
                timeoutRef.current = null;
            }, delay - timeSinceLastExecution);
        }
    }, [func, delay]);

    return throttledFunc;
}