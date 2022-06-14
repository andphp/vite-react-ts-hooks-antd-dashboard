import React, { FC } from 'react'
import { RouteProps } from 'react-router'
import PrivateRoute from './pravateRoute'
import TopLevelMenuPage from '@/layouts/components/TopLevelMenuPage'

export interface WrapperRouteProps extends RouteProps {
  /** authorization？ */
  auth?: boolean
  path: string
  page?: boolean
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, path, page, children }) => {
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>
  }
  if (path.split('/').length - 1 === 1 && !page && location.pathname === path) {
    return <TopLevelMenuPage frompath={path} />
  }
  return <>{children}</>
}

export default WrapperRouteComponent
