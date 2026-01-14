export function cleanStringAndDateValue(obj: Record<string, unknown>) {
    Object.keys(obj).forEach((key) => {
        const value = obj[key]
        if (typeof value === 'string') {
            obj[key] = ''
        } else if (value instanceof Date) {
            obj[key] = new Date('')
        }
    })
}
