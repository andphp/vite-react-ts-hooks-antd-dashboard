import React, { FC, ReactNode, Suspense } from 'react'

import Welcome from '@/pages/dashboard/welcome'
import LoginPage from '@/pages/login'
import LayoutPage from '@/layouts'
import WrapperRouteComponent from './config'
import { Outlet, RouteObject, useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import NotFound from '@/pages/exception/404'
import NProgressWithNode from '@/components/nProgress'
import TopLevelMenuPage from '@/layouts/components/TopLevelMenuPage'
import * as Lazy from './lazy'

const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<Spin />}>{children}</Suspense>
}

const routeList: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        path: '/dashboard',
        element: <WrapperRouteComponent auth={true} path='/dashboard' children={<Outlet />}/>,
        children: [{
          path: 'welcome',
          element: <Welcome key='/dashboard/welcome' />
        }]
      },
      {
        path: '/toplevelmenupage',
        element: <TopLevelMenuPage frompath='/toplevelmenupage' />
      },
      {
        path: '/system',
        element: <WrapperRouteComponent auth={false} path='/system' children={<Outlet />} />,
        children: [
          {
            path: 'authority',
            element: <Outlet />,
            children: [
              {
                path: 'menu',
                element: lazyLoad(<Lazy.MenuManagement key='/system/authority/menu' />)
              }
            ] }
        ] },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

const RenderRouter: FC = () => {
  const element = useRoutes(routeList)

  return <NProgressWithNode element={element} path='/dashboard/welcome'/>
}

export default RenderRouter
