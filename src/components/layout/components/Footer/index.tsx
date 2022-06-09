import React from 'react'
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'

export default () => (
  <DefaultFooter
    copyright='2021 大雄出品'
    links={[
      {
        key: '大雄',
        title: '大雄',
        blankTarget: true,
        href: ''
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ychengcloud/react-antd-vite-admin',
        blankTarget: true
      },
      {
        key: 'vite-react-admin管理平台',
        title: 'vite-react-admin管理平台',
        blankTarget: true,
        href: ''
      }
    ]}
  />
)
