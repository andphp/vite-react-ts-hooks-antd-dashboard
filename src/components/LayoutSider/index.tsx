import { useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import React from 'react'

const { Sider } = Layout

const MySider:React.FC = () => {
  const navigate = useNavigate()
  return (
    <Sider className={styles.container}>
      <div className={styles.logo} />
      <Menu
        mode='inline'
        defaultSelectedKeys={['/home']}
        onClick={({ key }) => navigate(key)}
        items={[
          { key: '/home', icon: <UserOutlined />, title: 'Home' },
          { key: '/about', icon: <VideoCameraOutlined />, title: 'Dashboard' }
        ]}
      />

    </Sider>
  )
}

export default MySider
