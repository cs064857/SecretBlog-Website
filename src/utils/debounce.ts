export function debounce(fn: Function, delay: number) {
    let timeoutId: number | undefined;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export function throttle(fn: Function, delay: number) {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}
