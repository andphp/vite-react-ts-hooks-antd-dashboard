import { Space, Menu, Button } from 'antd'
import {QuestionCircleOutlined, FullscreenExitOutlined, FullscreenOutlined, LogoutOutlined} from '@ant-design/icons'
import React, { useState, useEffect } from 'react'

import Avatar from './AvatarDropdown'
import HeaderDropdown from '../HeaderDropdown'
import HeaderSearch from '../HeaderSearch'
// import "./index.less";
import classes from './index.module.less'
import { useRecoilValue } from 'recoil'
import { userState } from '@/stores/atoms/user'
import SelectLang from './SelectLang'

import screenfull from 'screenfull'

export type SiderTheme = 'light' | 'dark'

const GlobalHeaderRight: React.FC = () => {
  const user = useRecoilValue(userState)

  const { settings } = user
  let className = classes.right

  if ((settings.navTheme === 'dark' && settings.layout === 'top') || settings.layout === 'mix') {
    className = `${classes.right} ${classes.dark}`
  }
  const [screenfullState, updateScreenfullState] = useState(false)
  const screenfullToggle = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle()
    }
  }

  const escFunction = () => {
    updateScreenfullState(!screenfullState)
  }

  useEffect(() => {
    // 监听退出全屏事件 --- chrome 用 esc 退出全屏并不会触发 keyup 事件
    document.addEventListener('webkitfullscreenchange', escFunction, { passive: false }) /* Chrome, Safari and Opera */
    document.addEventListener('mozfullscreenchange', escFunction, { passive: false }) /* Firefox */
    document.addEventListener('fullscreenchange', escFunction, { passive: false }) /* Standard syntax */
    document.addEventListener('msfullscreenchange', escFunction, { passive: false }) /* IE / Edge */
    return () => {
      // 销毁时清除监听
      document.removeEventListener('webkitfullscreenchange', escFunction)
      document.removeEventListener('mozfullscreenchange', escFunction)
      document.removeEventListener('fullscreenchange', escFunction)
      document.removeEventListener('MSFullscreenChange', escFunction)
    }
  })
    const headerDropdownConfig = [
        {
            label: '文档',
            key: 'wendang1',
            onClick:() => {
                 window.open('/~docs')
            }
        },
        {
            label: 'Ant Design Pro 文档',
            key: 'wendang2',
            onClick:() => {
                window.open('https://pro.ant.design/docs/getting-started')
            }
        }
    ]
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${classes.action} ${classes.search}`}
        placeholder='菜单搜索'
        defaultValue='个人中心'
        options={[
          {
            label: <a href='next.ant.design'>Ant Design</a>,
            value: 'Ant Design'
          },
          {
            label: <a href='/'>个人中心</a>,
            value: '个人中心'
          },
          {
            label: <a href='https://prolayout.ant.design/'>Pro Layout</a>,
            value: 'Pro Layout'
          }
        ]}
        onSearch={(value) => {
          console.log('input', value)
        }}
      />
      <HeaderDropdown
        className={classes.action}
        overlay={
          <Menu items={headerDropdownConfig} />
        }
      >
        <span>
          <QuestionCircleOutlined />
        </span>
      </HeaderDropdown>

      <Button type='link' style={{ touchAction: 'none' }} icon={!screenfullState ? <FullscreenOutlined /> : <FullscreenExitOutlined />} onClick={screenfullToggle} />
      <SelectLang className={classes.action} />
      <Avatar />
    </Space>
  )
}
export default GlobalHeaderRight
