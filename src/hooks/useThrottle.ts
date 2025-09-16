import { useEffect, useRef, useState } from "react";

export default function useThrottle(value: any, delay: number) {

    const [throttledValue, setThrottledValue] = useState(value);

    const lastExecuted = useRef(Date.now());

    useEffect(() => {

        const handler = setTimeout(() => {

            const now = Date.now();

            const timeElapsed = now - lastExecuted.current;

            if (timeElapsed >= delay) {
                setThrottledValue(value);
                lastExecuted.current = now;
            }

        }, delay - (Date.now() - lastExecuted.current));

        return () => clearTimeout(handler);

    }, [value, delay]);

    return throttledValue;

}