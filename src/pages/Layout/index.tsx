import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import LayoutSider from '@/components/LayoutSider'
import LayoutHeader from '@/components/LayoutHeader'
import React from 'react'

const { Content } = Layout

const Home:React.FC = () => {
  return (
    <Layout>
      <LayoutSider />
      <Layout style={{ marginLeft: 200 }}>
        <LayoutHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            backgroundColor: 'white',
            minHeight: `calc(100vh - 112px)`
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home
