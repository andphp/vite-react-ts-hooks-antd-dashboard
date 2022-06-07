import React from 'react'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const LayoutHeader:React.FC = () => {
  return (
    <div className={styles.container}>
      Header
      <div>
        <span style={{ marginRight: 12 }}>19192069</span>
        <Avatar
          style={{ backgroundColor: '#87d068' }}
          icon={<UserOutlined />}
        />
      </div>
    </div>
  )
}

export default LayoutHeader
