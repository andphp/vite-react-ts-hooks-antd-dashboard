import { useGetCurrentMenus } from '@/https'
import { useLocale } from '@/locales'
import { Divider, Row } from 'antd'
import React, { Fragment } from 'react'
import { RouteProps } from 'react-router-dom'
import SelectMenuCard from './SelectMenuCard'

export interface TopLevelMenuPageProps extends RouteProps {
  frompath: string
}
const TopLevelMenuPage: React.FC<TopLevelMenuPageProps> = ({ frompath }) => {
  const { formatMessage } = useLocale()
  const { data: menuList } = useGetCurrentMenus()
  const loopMenuItem = () => {
    if (!menuList) return []
    const currentMenu = menuList.filter((menu: Menu.Tree) => menu.path.toLowerCase() === frompath && menu?.children?.length)
    return currentMenu[0]?.children ?? []
  }
  const secondMenu: {
    path: string
    name: string
    locale?: string
    icon?: string
  }[] = []
  const tertiaryLoopMenuItem = loopMenuItem().map((menuItem) => {
    if (menuItem.children?.length) {
      return (
        <Fragment key={`SelectMenuCard` + menuItem.path}>
          <Divider orientation='left'>{menuItem.locale ? formatMessage({ id: menuItem.locale }) : menuItem.name}</Divider>
          <Row gutter={[24, { xs: 12, sm: 24 }]}>
            {menuItem.children.map((menuChildrenItem) => (
              <SelectMenuCard key={`SelectMenuCard` + menuChildrenItem.path} title={menuChildrenItem.locale ? formatMessage({ id: menuChildrenItem.locale }) : menuChildrenItem.name} path={menuChildrenItem.path} />
            ))}
          </Row>
        </Fragment>
      )
    }
    secondMenu.push(menuItem)
    return ''
  })

  const secondLoopMenuItem = (
    <Fragment key={`SelectMenuCardOther`}>
      <Row gutter={[24, { xs: 12, sm: 24 }]}>
        {secondMenu.map((menuItem) => {
          return <SelectMenuCard key={`SelectMenuCardOther` + menuItem.path} title={menuItem.locale ? formatMessage({ id: menuItem.locale }) : menuItem.name} path={menuItem.path} />
        })}
      </Row>
    </Fragment>
  )

  return (
    <>
      {tertiaryLoopMenuItem}
      {secondMenu.length ? <Divider orientation='left'>{formatMessage({ id: 'gloabal.topLevelMenu.divider.title.other' })}</Divider> : ''}
      {secondLoopMenuItem}
    </>
  )
}

export default TopLevelMenuPage
