// 字符串的下划线格式转驼峰格式，eg：hello_world => helloWorld
export const SnakeToCamelCase = (s: string) => {
    return s.replace(/_(\w)/g, (all, letter) => {
        return letter.toUpperCase()
    })
}

// 字符串的驼峰格式转下划线格式，eg：helloWorld => hello_world
export const CamelToSnakeCase = (s: string) => {
    return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}

// JSON对象的key值转换为驼峰式
export const JsonToCamel = (obj: any) => {
    if (obj instanceof Array) {
        obj.forEach((v, i) => {
            JsonToCamel(v)
        })
    } else if (obj instanceof Object) {
        Object.keys(obj).forEach((key) => {
            const newKey = SnakeToCamelCase(key)
            if (newKey !== key) {
                obj[newKey] = obj[key]
                delete obj[key]
            }
            JsonToCamel(obj[newKey])
        })
    }
    return obj
}

// JSON对象的key值转换为下划线格式
export const JsonToSnake = (obj: any) => {
    if (obj instanceof Array) {
        obj.forEach((v, i) => {
            JsonToSnake(v)
        })
    } else if (obj instanceof Object) {
        Object.keys(obj).forEach((key) => {
            const newKey = CamelToSnakeCase(key)
            if (newKey !== key) {
                obj[newKey] = obj[key]
                delete obj[key]
            }
            JsonToSnake(obj[newKey])
        })
    }
    return obj
}
