import React, {FC, useCallback, useEffect, useMemo, useState} from 'react'
import style from "@/pages/menu/style.module.less";
import {Button, Empty, Menu, Select, Space} from "antd";
import {useGetCurrentMenus, useGetDomainList} from "@/https";
import Icon from "@/components/icon";
import MenuEdit from "@/pages/menu/components/MenuEdit";
import ActionEdit from "@/pages/menu/components/ActionEdit";


const MenuManager: FC = () => {
    const [selectedMenu, setSelectedMenu] = useState<Menu.Item | null>(null)

    // 域列表
    const { data: domainList } = useGetDomainList()
    const [domainListData, setDomainListData] = useState<Domain.ResultDomain[]>([])
    useEffect(() => {
        if (domainList) {
            setDomainListData(domainList)
        }
    }, [domainList])

    // 菜单列表
    const { data: menus } = useGetCurrentMenus()
    const [menuTreeData, setMenuTreeData] = useState<Menu.Tree | []>([])
    const [menuListData, setMenuListData] = useState<Menu.Item[] | []>([])
    useEffect(() => {
        setMenuTreeData(menus || [])
        const menuList = menus ? generateList(menus, []) : []
        setMenuListData(menuList)
    }, [menus])
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

    const handleChange = (value: string) => {
        console.log(`selected ${value}`)
    }
    const renderOption = domainListData.map((item) => {
        return {
            label: item.title,
            value: item.domain,
            key: item.id,
        }
    })

    const [hasUnSaveMenu, setHasUnSaveMenu] = useState(false)
    const [hasUnSaveAction, setHasUnSaveAction] = useState(false)
    const [isAdd, setIsAdd] = useState(true)

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
        async ({ key }:{key:string}, showTip = true) => {
            await checkUnSave(showTip)
            const menuData = menuListData.find((item) => String(item.id) === key)
            setSelectedMenu(menuData || null)
            setIsAdd(false)
        },
        [checkUnSave, menuListData]
    )


    const loopMenu = (nodes: Menu.TreeItem[]):Antd.Menu[] =>
    {
       return nodes.map((item: Menu.TreeItem):Antd.Menu => {
            const { id, icon, title, name, children } = item
            return (children?.length > 0) ? {
                key: String(id),
                label: name,
                title: title,
                icon:<Icon type={`icon-${icon}`}/>,
                children: loopMenu(children)
            } : {
                key: String(id),
                label: name,
                title: title,
                icon:<Icon type={`icon-${icon}`}/>
            }
        })
    }

    const menuItems = useMemo(() => {
        const menuTree = menuTreeData || []
        return loopMenu(menuTree)
    }, [menuTreeData, selectedMenu,loopMenu]);


    const handleMenuSubmit = useCallback(
        async (menu: Menu.TreeItem) => {
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

    return (
        <div className={style.menuRoot}>
            <div className={style.menu}>
                <Space className={style.menuTop}>
                    <Button
                        type='primary'
                        onClick={async () => {
                            setSelectedMenu(null)
                            await checkUnSave()
                            setIsAdd(true)
                            }
                        }
                    >
                        添加应用
                    </Button>
                    <Button
                        disabled={!selectedMenu}
                        type='primary'
                        onClick={async () => {
                            await checkUnSave()
                            setIsAdd(true)
                         }
                        }
                    >
                        添加子级
                    </Button>
                </Space>
                <Select style={{ margin: '8px' }} onChange={handleChange} value={"administration"} options={renderOption} />
                <div className={style.menuContent}>
                    {menuTreeData?.length ? (
                        <Menu
                            mode='inline'
                            selectable
                            selectedKeys={[String(selectedMenu?.id)]}
                            onClick={(info) => handleClick(info)}
                            items={menuItems}
                        />
                    ) : (
                        <Empty style={{ marginTop: 58 }} description='暂无数据' />
                    )}
                </div>
            </div>
            <MenuEdit
                isAdd={isAdd}
                key={selectedMenu?.id}
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
