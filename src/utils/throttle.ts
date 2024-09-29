export function advancedThrottle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastExecTime = 0;
    let lastArgs: Parameters<T> | null = null;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;
        const currentTime = Date.now();

        // 清除之前的延遲執行
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        // 如果距離上次執行已經超過延遲時間，立即執行
        if (currentTime - lastExecTime >= delay) {
            func.apply(context, args);
            lastExecTime = currentTime;
        } else {
            // 否則，設置一個延遲執行
            lastArgs = args;
            timeoutId = setTimeout(() => {
                if (lastArgs) {
                    func.apply(context, lastArgs);
                    lastExecTime = Date.now();
                    lastArgs = null;
                }
            }, delay - (currentTime - lastExecTime));
        }
    };
}


