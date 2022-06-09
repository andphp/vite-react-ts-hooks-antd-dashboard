import React, { FC, Fragment, JSXElementConstructor, ReactElement, useEffect, useState } from 'react'
import nProgress from 'nprogress'
import { RouteProps } from 'react-router-dom'
export interface NProgressWithProps extends RouteProps {
  element: ReactElement<any, string | JSXElementConstructor<any>> | null
  path: string
}
const NProgressWithNode: FC<NProgressWithProps> = ({ element, path }) => {
  useState(nProgress.start())
  useEffect(() => {
    nProgress.done()
    return () => { nProgress.start() }
  })
  return <Fragment key={path}>{element}</Fragment>
}

export default NProgressWithNode
