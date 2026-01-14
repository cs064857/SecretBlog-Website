export function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    return (...args: TArgs) => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export function throttle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delay: number) {
    let lastCall = 0
    return (...args: TArgs) => {
        const now = Date.now()
        if (now - lastCall >= delay) {
            lastCall = now
            fn(...args)
        }
    }
}
