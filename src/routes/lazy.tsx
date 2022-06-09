import { lazy } from 'react'

export const DomesticOrderPage = lazy(() => import('@/pages/order/domestic/index'))
export const InternationalOrderPage = lazy(() => import('@/pages/order/international/index'))
export const MenuManagement = lazy(() => import('@/pages/menus'))
// export const MenuManagement = lazy(() => import('@/pages/system/authority/menuManagement'))
export const InterfaceManagement = lazy(() => import('@/pages/system/authority/interfaceManagement'))
