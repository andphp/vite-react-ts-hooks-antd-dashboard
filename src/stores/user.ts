import { getGlobalState } from './index'

export const initialState: User.CurrentUser = {
    ...getGlobalState(),
    noticeCount: 0,
    locale: (localStorage.getItem('locale')! || navigator.languages?.[0] || navigator.language || 'en-us') as User.Locale,
    newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
    logged: false,
    menuList: [],
    username: localStorage.getItem('username') || '游客',
    role: (localStorage.getItem('role') || 'guest') as User.Role,
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    accountName: '',
    activeColor: '',
    baseColor: '',
    departmentID: 0,
    email: '',
    emailVerifiedAt: '',
    fullName: '',
    id: 0,
    lastIP: '',
    lastLoginAt: '',
    lastToken: '',
    nickName: '',
    phone: '',
    roleID: 0,
    sideMode: ''
}
