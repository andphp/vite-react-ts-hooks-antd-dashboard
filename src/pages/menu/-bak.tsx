import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, Empty, Space, Button, Select } from 'antd'
import style from './style.module.less'
import theme from '@/theme.module.less'
import { useGetCurrentMenus, useGetDomainList } from '@/https'
import confirm from '@/components/confirm'
import Icon from '@/components/icon'
import MenuEdit from './components/MenuEdit'
import ActionEdit from './components/ActionEdit'

const MenuManager: React.FC = () => {
  const { Option } = Select
  const { data: menus } = useGetCurrentMenus()
  const [menuTreeData, setMenuTreeData] = useState<Menu.Tree[] | []>([])
  const [menuListData, setMenuListData] = useState<Menu.Item[] | []>([])
  const [selectedMenu, setSelectedMenu] = useState<Menu.Item | null>(null)
  const [hasUnSaveMenu, setHasUnSaveMenu] = useState(false)
  const [hasUnSaveAction, setHasUnSaveAction] = useState(false)
  const [isAdd, setIsAdd] = useState(true)
  const WITH_SYSTEMS = true

  const { data: domainList } = useGetDomainList()
  const [domainListData, setDomainListData] = useState<any[]>([])

  // 将树形节点改为一维数组
  const generateList = (data: any, dataList: any[]) => {
    for (const node of data) {
      const newNode = { ...node }
      delete newNode?.children
      dataList.push(newNode)
      if (node?.children) {
        generateList(node.children, dataList)
      }
    }

    return dataList
  }
  useEffect(() => {
    // const menuList = generateList(menus, [])
    setMenuTreeData(menus || [])
    const menuList = menus ? generateList(menus, []) : []
    setMenuListData(menuList)
  }, [menus])

  useEffect(() => {
    if (domainList) {
      setDomainListData(domainList)
    }
  }, [domainList])

  const checkUnSave = useCallback(
    async (showTip = true) => {
      if (showTip && hasUnSaveMenu) await confirm('菜单有未保存数据，是否放弃？')
      setHasUnSaveMenu(false)

      if (showTip && hasUnSaveAction) await confirm('功能列表有未保存数据，是否放弃？')
      setHasUnSaveAction(false)
    },
    [hasUnSaveMenu, hasUnSaveAction]
  )

  const handleClick = useCallback(
    async ({ key }, showTip = true) => {
      await checkUnSave(showTip)
      const menuData = menuListData.find((item) => item.id == key)
      setSelectedMenu(menuData || null)
      setIsAdd(false)
    },
    [checkUnSave, menuListData]
  )

  const [menuItems] = useMemo(() => {
    const menuTree = menuTreeData || []
    const loop = (nodes: Menu.Tree[]) =>
      nodes.map((item: Menu.Tree) => {
        const { id, icon, title, children } = item

        if (children?.length) {
          return (
            <Menu.SubMenu
              key={id}
              title={
                <span
                  onClick={async (e) => {
                    e.stopPropagation()
                    await handleClick({ key: id })
                  }}
                >
                  {title}
                </span>
              }
              icon={<Icon type={`icon-${icon}`}/>}
              className={selectedMenu?.id == id ? `${theme.antPrefix}-menu-item-selected` : ''}
              data-menu={item}
            >
              {loop(children)}
            </Menu.SubMenu>
          )
        }
        return (
          <Menu.Item key={id} icon={<Icon type={`icon-${icon}`}/>} data-menu={item}>
            {title}
          </Menu.Item>
        )
      })

    return [loop(menuTree), menuTree]
    // eslint-disable-next-line
    }, [menuTreeData, selectedMenu, hasUnSaveMenu]);

  const handleMenuSubmit = useCallback(
    async (menu: Menu.Tree) => {
      const { id, title, icon, children } = menu
      const menuList = menuListData.map((item) => {
        if (item.id == id) {
          return { ...item, title, icon, children }
        }
        return item
      })
      setMenuListData(menuList)
      setHasUnSaveMenu(true)
    },
    [menuListData, setMenuListData, setHasUnSaveMenu]
  )
  const handleActionSubmit = useCallback(async () => {
    setHasUnSaveAction(true)
  }, [])
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  const renderOption = (arr: any[], domain: string, title: string) => arr ? arr.map((item, index) => {
    return (<Option key={item[domain]} value={ typeof (item[domain]) === 'number' ? item[domain].toString() : item[domain]}>{item[title]}</Option>)
  }) : null

  return (
    <div className={style.menuRoot}>
      <div className={style.menu}>
        <Space className={style.menuTop}>
          <Button
            type='primary'
            onClick={async () => {
              await checkUnSave()
              setIsAdd(true)
              setSelectedMenu(null)
            }}
          >
            {WITH_SYSTEMS ? '添加应用' : '添加顶级'}
          </Button>
          <Button
            disabled={!selectedMenu}
            type='primary'
            onClick={async () => {
              await checkUnSave()
              setIsAdd(true)
            }}
          >
                  添加子级
          </Button>
        </Space>
        <Select style={{ margin: '8px' }} onChange={handleChange}>
          {renderOption(domainListData, 'domain', 'title')}
        </Select>
        <div className={style.menuContent}>
          {menuTreeData?.length ? (
            <Menu
              mode='inline'
              selectable
              selectedKeys={[String(selectedMenu?.id)]}
              onClick={(info) => handleClick(info)}
            >
              {menuItems}
            </Menu>
          ) : (
            <Empty style={{ marginTop: 58 }} description='暂无数据' />
          )}
        </div>
      </div>
      <MenuEdit
        isAdd={isAdd}
        id={selectedMenu?.id}
        selectedMenu={selectedMenu}
        onSubmit={handleMenuSubmit}
        onValuesChange={() => setHasUnSaveMenu(true)}
      />
      <ActionEdit
        isAdd={isAdd}
        selectedMenu={selectedMenu}
        onValuesChange={() => setHasUnSaveAction(true)}
        onSubmit={handleActionSubmit}
      />
    </div>
  )
}

export default MenuManager
