import {useGetList, useGetOne} from '@/utils/request'

// 公共接口

export const useGetCurrentUser = () => {
    return useGetOne<User.CurrentUser>('CurrentUser', '/current/user')
}

export const useGetCurrentMenus = () => {
    const menus = useGetList<Menu.MenuTree>('CurrentMenuList', '/current/menu')
    console.log('=========menus', menus)
    return menus
}

