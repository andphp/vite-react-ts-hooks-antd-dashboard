import React, { useRef, Suspense, useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Tabs, Tooltip } from 'antd'

import _ from 'lodash'
import { useMemoizedFn, useCreation } from 'ahooks'

import { useOutlet, useNavigate, useLocation, generatePath, useParams, Params } from 'react-router-dom'
import { ArrowsAltOutlined, ShrinkOutlined, VerticalRightOutlined, VerticalLeftOutlined, ColumnWidthOutlined, RedoOutlined, SmallDashOutlined } from '@ant-design/icons'
import { PageLoading } from '@ant-design/pro-layout'
import { useGetCurrentMenus } from '@/https'
import { GetMenuListState, SetMenuListState } from '@/stores/atoms/menu'
import { useLocale } from '@/locales'

const { TabPane } = Tabs
const getTabPath = (tab: { location: { pathname: string }; params: Params<string> | undefined }) => generatePath(tab.location.pathname, tab.params)
const TabRoute = function(clickChangeMaximize: React.MouseEventHandler<HTMLElement> | undefined, showMaximize: any) {
  const ele = useOutlet()

  const location = useLocation()

  const params = useParams()

  const navigate = useNavigate()

  const tabList = useRef(new Map())
  const { formatMessage } = useLocale()

  const [reload, setReload] = useState(false)
  const initMenuList = (pathname: string, menuList: Menu.Tree | undefined) => {
    if (!menuList) return false
    menuList.forEach((m) => {
      if (m?.path == pathname) {
        SetMenuListState(pathname, m)
        return true
      }
      if (m?.children?.length) {
        return initMenuList(pathname, m.children)
      }
    })
    return false
  }

  // console.log('TabRoute', location.pathname)
  // 初始化菜单路由
  const { data: menuList } = useGetCurrentMenus()
  // 确保tab
  useCreation(() => {
    // 初始化菜单路由
    const getMenuListState = GetMenuListState(location.pathname)
    if (getMenuListState === null || getMenuListState === undefined) {
      initMenuList(location.pathname, menuList)
    }

    const tab = tabList.current.get(location.pathname)
    const currentPath = GetMenuListState(location.pathname)

    const newTab = {
      name: currentPath ? (currentPath.locale ? formatMessage({ id: currentPath.locale }) : currentPath.name) : location.pathname,
      key: location.pathname,
      page: ele,
      // access:routeConfig.access,
      location,
      params
    }

    const getFastTab = tabList.current.get('fastRouter')
    if (getFastTab !== null) {
      tabList.current.delete('fastRouter')
    }

    if (!currentPath) {
      if ((!tab) && location.pathname !== '/') {
        tabList.current.set(location.pathname, newTab)
      }
    } else {
      const topMenuPageTab = {
        name: '快捷导航',
        key: location.pathname,
        page: ele,
        // access:routeConfig.access,
        location,
        params
      }
      if (currentPath.path && currentPath.path.split('/').length - 1 === 1 && (!currentPath.type || currentPath.type === 'nav')) {
        tabList.current.set('fastRouter', topMenuPageTab)
      } else if ((!tab) && location.pathname !== '/') {
        tabList.current.set(location.pathname, newTab)
      }
    }
  }, [location])

  // 重新加载
  const uploadTab = () => {
    setTimeout(() => {
      setReload(false)
    })
    setReload(true)
  }

  // 关闭左边
  const closeLeftTab = () => {
    Array.from(tabList.current.keys()).findIndex((selectKey) => {
      if (selectKey !== location.pathname) {
        tabList.current.delete(selectKey)
        return false
      } else {
        return true
      }
    })
    selectTab(location.pathname)
  }

  // 关闭右边
  const closeRigthTab = () => {
    let isRigth = false
    Array.from(tabList.current.keys()).findIndex((selectKey) => {
      if (isRigth) {
        tabList.current.delete(selectKey)
      }
      if (selectKey === location.pathname) {
        isRigth = true
      }
      return false
    })
    selectTab(location.pathname)
  }

  // 关闭其他
  const closeOtherTab = () => {
    Array.from(tabList.current.keys()).findIndex((selectKey) => {
      if (selectKey !== location.pathname) {
        tabList.current.delete(selectKey)
      }
      return false
    })

    selectTab(location.pathname)
  }

  // 关闭所有
  const closeAllTab = () => {
    Array.from(tabList.current.keys()).findIndex((selectKey) => {
      tabList.current.delete(selectKey)
      return false
    })

    navigate('/' + location.pathname.split('/')[1], {
      replace: true
    })
  }

  // 关闭tab
  const closeTab = useMemoizedFn((selectKey) => {
    if (tabList.current.size >= 2) {
      tabList.current.delete(selectKey)
      const nextKey = _.last(Array.from(tabList.current.keys()))
      navigate(getTabPath(tabList.current.get(nextKey)), { replace: true })
    }
  })

  // 选择tab
  const selectTab = useMemoizedFn((selectKey) => {
    navigate(getTabPath(tabList.current.get(selectKey)), {
      replace: true
    })
  })

  const tabsDivId = useRef('antd-tabs-divid')
  const [showArrow, setShowArrow] = useState(false)

  // 右箭头点击事件
  const rightButton = () => {
    // eslint-disable-next-line
    const tabList = document?.getElementById(tabsDivId.current)?.children[0].children[1].children[0] as HTMLElement
    // eslint-disable-next-line
    const tabsNav = document?.getElementById(tabsDivId.current)?.children[0].children[1] as HTMLElement
    // 计算偏移量
    if (tabList.clientWidth > tabsNav.clientWidth) {
      // eslint-disable-next-line
      const translateX = Number(tabList.style.cssText.split('px')[0].split('(')[1]) - tabsNav.clientWidth
      if (Math.abs(translateX) < tabList.clientWidth - tabsNav.clientWidth) {
        // eslint-disable-next-line
        tabList.style.cssText = 'transform: translate(' + translateX + 'px, 0px);'
      } else {
        // eslint-disable-next-line
        tabList.style.cssText = 'transform: translate(' + -(tabList.clientWidth - tabsNav.clientWidth) + 'px, 0px);'
      }
    }
  }
  // 左箭头点击事件
  const leftButton = () => {
    // eslint-disable-next-line
    const tabList = document?.getElementById(tabsDivId.current)?.children[0].children[1].children[0] as HTMLElement
    // eslint-disable-next-line
    const tabsNav = document?.getElementById(tabsDivId.current)?.children[0].children[1] as HTMLElement
    if (tabList.clientWidth > tabsNav.clientWidth) {
      // eslint-disable-next-line
      const translateX = Number(tabList.style.cssText.split('px')[0].split('(')[1]) + tabsNav.clientWidth

      if (Math.abs(translateX) < tabList.clientWidth - tabsNav.clientWidth && translateX < 0) {
        // eslint-disable-next-line
        tabList.style.cssText = 'transform: translate(' + translateX + 'px, 0px);'
      } else {
        // eslint-disable-next-line
        tabList.style.cssText = 'transform: translate(' + 0 + 'px, 0px);'
      }
    }
  }

  // 更多操作
  const menu = (
    <Menu>
      <Menu.Item key={Math.random()}>
        <Button type='link' onClick={closeLeftTab} icon={<VerticalRightOutlined />}>
          {formatMessage({ id: 'gloabal.tips.tabs.closeLeftTab' })}
        </Button>
      </Menu.Item>
      <Menu.Item key={Math.random()}>
        <Button type='link' onClick={closeRigthTab} icon={<VerticalLeftOutlined />}>
          {formatMessage({ id: 'gloabal.tips.tabs.closeRigthTab' })}
        </Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key={Math.random()}>
        <Button type='link' onClick={closeOtherTab} icon={<SmallDashOutlined />}>
          {formatMessage({ id: 'gloabal.tips.tabs.closeOtherTab' })}
        </Button>
      </Menu.Item>
      <Menu.Item key={Math.random()}>
        <Button type='link' onClick={closeAllTab} icon={<ColumnWidthOutlined />}>
          {formatMessage({ id: 'gloabal.tips.tabs.closeAllTab' })}
        </Button>
      </Menu.Item>
    </Menu>
  )

  const operations = {
    left: <>{showArrow ? <Button type='link' icon={<VerticalRightOutlined />} onClick={leftButton} /> : ''}</>,
    right: (
      <>
        {showArrow ? <Button type='link' icon={<VerticalLeftOutlined />} onClick={rightButton} /> : ''}
        <Dropdown overlay={menu} placement='bottomLeft' arrow>
          <Button type='link' icon={<ColumnWidthOutlined />} />
        </Dropdown>
        <Tooltip placement='bottom' title={formatMessage({ id: 'gloabal.tips.tabs.reloadTab' })}>
          <Button type='link' onClick={uploadTab} icon={<RedoOutlined />} />
        </Tooltip>
        <Tooltip placement='bottomRight' title={showMaximize ? formatMessage({ id: 'gloabal.tips.tabs.tabMaximization' }) : formatMessage({ id: 'gloabal.tips.tabs.restore' })}>
          <Button style={{ marginRight: '8px' }} type='link' icon={showMaximize ? <ArrowsAltOutlined /> : <ShrinkOutlined />} onClick={clickChangeMaximize} />
        </Tooltip>
      </>
    )
  }

  useEffect(() => {
    // 所有tabs标签宽度
    // eslint-disable-next-line
    const tabListWidth = document?.getElementById(tabsDivId.current)?.children[0].children[1].children[0].clientWidth as number
    // tabs 可视区域宽度
    // eslint-disable-next-line
    const tabsNavWidth = document?.getElementById(tabsDivId.current)?.children[0].children[1].clientWidth as number
    // console.log('tabListWidth', tabListWidth)
    // console.log('tabsNavWidth', tabsNavWidth)
    if (tabListWidth - tabsNavWidth > 0) {
      setShowArrow(true)
    } else {
      setShowArrow(false)
    }
  })

  return (
    <Tabs id={tabsDivId.current} activeKey={location.pathname} onChange={(key) => selectTab(key)} tabBarExtraContent={operations} tabBarStyle={{ background: '#fff', margin: '0' }} tabPosition='top' animated tabBarGutter={0} hideAdd type='editable-card' onEdit={(targetKey) => closeTab(targetKey)}>
      {[...tabList.current.values()].map((item) => (
        <TabPane style={{ padding: '16px 0 0 16px' }} tab={item.name} key={item.key}>
          <Suspense fallback={<PageLoading />}>{reload ? <PageLoading /> : item.page}</Suspense>
        </TabPane>
      ))}
    </Tabs>
  )
}

export default TabRoute
