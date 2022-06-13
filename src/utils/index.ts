import {useState, useEffect, useRef, useMemo} from 'react'
import {URLSearchParamsInit, useSearchParams} from "react-router-dom";
import { cleanObject } from './helper'

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
  }, [])
}

// 返回用泛型来规范类型，debouncedValue 的类型需要跟着 value 的类型变化
export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  // 在value或delay变化时执行这个effect
  useEffect(() => {
    // effect中设置一个定时器，用来更新debounceValue的值
    const timeout = setTimeout(() => setDebouncedValue(value), delay)

    // 每次在上一次useEeffect执行完之后被执行，一般负责清理的作用
    // 返回的函数用来清除一些副作用
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

export const useArray = <T>(list: T[]) => {
  const [value, setValue] = useState(list)

  const add = (user: T) => setValue([...value, user])

  const removeIndex = (index: number) => {
    const list = [...value]
    list.splice(index, 1)
    setValue(list)
  }

  const clear = () => setValue([])

  return { value, setValue, clear, removeIndex, add }
}

// 希望在进入项目列表时加载显示项目列表，退出时显示原来的列表名称"React App"
export const useDocumentTitle = (
  title: string,
  keepOnUnmount = true
) => {
  // const oldTitle = document.title;

  // 使用useRef在初始化时把值保存起来，它就像一个容器，保持着这个值在整个组件的生命周期中都不会被改变
  const oldTitle = useRef(document.title).current

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        console.log('卸载时title', oldTitle)
        // 如果useEffect不指定依赖，oldTitle一直都是oldTitle==='React App'
        // 当加上oldTitle依赖时，这里的值就是最新的oldTitle==='项目列表'，那么就无法保留旧的oldTitle
        // 但是可以使用react自带的hook--useRef
        document.title = oldTitle
      }
    }
  }, [keepOnUnmount, oldTitle])
}

export const resetRoute = () => (window.location.href = window.location.origin)


// 返回页面url中，指定键的参数值
// 需要给初始值限制为{[key]:string}的类型
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams()
  return [
    // 每次返回一个新的对象会导致无限render，使用useMemo来解决
    // 只有在searchParams改变时才进行运算
    useMemo(
        () =>
            keys.reduce((prev: { [key in K]: string }, key: K) => {
              return { ...prev, [key]: searchParams.get(key) || '' }
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            }, {} as { [key in K]: string }),
        [searchParams]
    ),
    (param: Partial<{ [key in K]: unknown }>) => {
      // iterator遍历对象：https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
      // 读取现在url的参数，然后把它变成普通对象，加上传入的对象
      const obj = cleanObject({
        ...Object.fromEntries(searchParams),
        ...param
      }) as URLSearchParamsInit
      return setSearchParams(obj)
    }
  ] as const
}
