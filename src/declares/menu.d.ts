declare namespace Menu {
  export interface Item {
    /** 菜单id */
    id: number
    name: string
    level: number
    parentId: number
    allParentId: string
    /** 菜单路由 */
    path: string
    /** 是否隐藏 */
    hidden?: boolean
    /** 类型 page/outlink/nav.. */
    typeOf?: string
    redirect: string
    component: string
    title: string
    description: string
    /** 图标名称
     *
     * 子子菜单不需要图标
     */
    icon?: string
    keepAlive: number
    disable: number
    sort: number
    locale: string
    createdAt: string
    updatedAt: string
    domain: string
    key: number
  }

  export interface TreeItem extends Item {
    /** 子菜单 */
    children: TreeItem[],
    locale?: string,
    /** menu labels */
    label: {
      zh_CN: string
      en_US: string
    }
  }

  export type Tree = TreeItem[]


}
