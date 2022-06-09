import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'

import HeaderDropdown from '../HeaderDropdown'
import classes from './index.module.less'
import { useRecoilState } from 'recoil'
import { userState } from '@/atoms/user'
import Storage from '@/utils/storage'

export interface GlobalHeaderRightProps {
  menu?: boolean
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [user, setUser] = useRecoilState(userState)

  const { username, avatar } = user

  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = () => {
    // Note: There may be security issues, please note
    setUser({ ...user, logged: false })
    Storage.remove('accessToken')
    if (location.pathname !== '/login') {
      navigate('/login')
    }
  }

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event
      if (key === 'logout') {
        loginOut()
        return
      }
      navigate(`/account/${key}`)
    },
    [user, setUser]
  )

  const loading = (
    <span className={`account`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8
        }}
      />
    </span>
  )

  if (!user) {
    return loading
  }

  if (!username) {
    return loading
  }

  const menuHeaderDropdown = (
    <Menu className={'menu'} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key='userinfo'>
        <LogoutOutlined />
        个人信息
      </Menu.Item>
      <Menu.Item key='logout'>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${classes.action} ${classes.account}`}>
        <Avatar className={classes.avatar} src={avatar} alt='avatar' />
        <span className={`${classes.name} anticon`}>{username}</span>
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
