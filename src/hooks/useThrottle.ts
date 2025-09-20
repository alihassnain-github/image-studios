import { useRef } from "react";

export default function useThrottle(cb: () => void, limit: number) {
    const lastRun = useRef(Date.now());

    return function () {
        if (Date.now() - lastRun.current >= limit) {
            cb(); // Execute the callback
            lastRun.current = Date.now(); // Update last execution time
        }
    };
}