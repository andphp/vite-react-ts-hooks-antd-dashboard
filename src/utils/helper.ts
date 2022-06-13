import Storage from './storage'

export const Logged = () => {
    return Storage.get('accessToken') !== null ?? false
}

// 如果传入{key:false}时也会返回true，然后后续就会被删除，这不是我们想要的
export const isFalsy = (value: unknown) => (value === 0 ? false : !value)

export const isVoid = (value: unknown) =>
    value === undefined || value === null || value === ''

// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: { [key: string]: unknown }) => {
    const result = { ...object }
    Object.keys(result).forEach((key) => {
        // 这里涉及到泛型的知识，先不处理
        const value = result[key]

        // 排除0的情况
        if (isVoid(value)) {
            delete result[key]
        }
    })
    return result
}
