import React, {FC} from 'react'
import {Navigate, RouteProps} from 'react-router-dom'
import {Logged} from '@/utils'


const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {

  return Logged() ? (
      <div>{children}</div>
  ) : <Navigate to="/login" />
}

export default PrivateRoute
