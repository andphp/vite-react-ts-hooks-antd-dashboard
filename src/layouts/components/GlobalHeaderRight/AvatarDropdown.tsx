import React, {useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import {LogoutOutlined} from '@ant-design/icons'
import {Avatar, Menu, Spin} from 'antd'

import HeaderDropdown from '../HeaderDropdown'
import classes from './index.module.less'
import {useRecoilState} from 'recoil'
import {userState} from '@/stores/atoms/user'
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
    (event: { key: any }) => {
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

    const menuHeaderConfig = [
        {
            label: '个人信息',
            key: 'userinfo',
            icon: <LogoutOutlined />
        },
        {
            label: '退出登录',
            key: 'logout',
            icon: <LogoutOutlined />
        }
    ]


    const menuHeaderDropdown = (
    <Menu className={'menu'} selectedKeys={[]} onClick={onMenuClick} items={menuHeaderConfig} />
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
