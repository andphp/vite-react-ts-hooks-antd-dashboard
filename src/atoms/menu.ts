import { createStorage } from '@/utils/storage'
import { atom } from 'recoil'

export const menuListState = atom({
    key: 'menuListState',
    default: []
})

export const MenuListState = createStorage({ prefixKey: 'menuListState', storage: sessionStorage })

export const SetMenuListState = (path: string, data: any) => {
    return MenuListState.set(path, data)
}

export const GetMenuListState = (path: string) => {
    return MenuListState.get(path)
}

export const DelMenuList = () => {
    return MenuListState.remove('*')
}
