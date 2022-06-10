import React, { FC } from 'react'

import Welcome from '@/pages/dashboard/welcome'
import LoginPage from '@/pages/login'
import LayoutPage from '@/layouts'
import WrapperRouteComponent from './config'
import { RouteObject, useRoutes } from 'react-router-dom'
// import {Spin} from 'antd'
import NotFound from '@/pages/exception/404'
import NProgressWithNode from '@/components/nProgress'

// const lazyLoad = (children: ReactNode): ReactNode => {
//   return <Suspense fallback={<Spin />}>{children}</Suspense>
// }

const routeList: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        path: '/dashboard',
        element: <WrapperRouteComponent auth={true} path='/dashboard' children={<LayoutPage />}/>,
        children: [{
          path: 'welcome',
          element: <Welcome key='/dashboard/welcome' />
        }]
      },
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
