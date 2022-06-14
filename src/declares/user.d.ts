declare namespace User {
  import { Device } from '@/models'
  import { PureSettings } from '@ant-design/pro-layout/lib/defaultSettings'

  export type Locale = 'zh-cn' | 'en-us'

  /** user's role */
  export type Role = 'guest' | 'admin'

  export interface Item {
    username: string
    role: Role
    accountName: string
    activeColor: string
    avatar: string
    baseColor: string
    departmentID: number
    email: string
    emailVerifiedAt: string
    fullName: string
    id: number
    lastIP: string
    lastLoginAt: string
    lastToken: string
    nickName: string
    phone: string
    roleID: number
    sideMode: string
  }

  export interface CurrentUser extends Item{
    /** menu list for init tagsView */
    menuList: Menu.Tree[]
    /** login status */
    logged: boolean
    /** user's device */
    device: Device
    /** menu collapsed status */
    collapsed: boolean
    /** notification count */
    noticeCount: number
    /** user's language */
    locale: Locale
    /** Is first time to view the site ? */
    newUser: boolean

    settings: PureSettings
  }

}
