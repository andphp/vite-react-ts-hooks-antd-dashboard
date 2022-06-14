import React, {FC} from 'react'
import {Navigate, RouteProps} from 'react-router-dom'
import {Logged} from '@/utils/helper'


const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
  // console.log("PrivateRoute", props)
  return Logged() ? (
      <div>{children}</div>
  ) : <Navigate to="/login" />
}

export default PrivateRoute
