import React, { useEffect, useState } from 'react'
// import MenuEdit from './MenuEdit'
// import ActionEdit from './ActionEdit'
import { Input, Tree } from 'antd'
import type { DataNode } from 'antd/lib/tree'
import { useGetCurrentMenus } from '@/https'

const MenuManager: React.FC = (props) => {
  const { Search } = Input

  const [treeData, setTreeData] = useState<Menu.MenuTreeList>([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const { data: menuList } = useGetCurrentMenus()
  const loop = (data: Menu.MenuTreeList): DataNode[] =>
    data.map(item => {
      const strTitle = String(item.title)
      const index = strTitle.indexOf(searchValue)
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.slice(index + searchValue.length)
      const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.title}</span>
            )
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) }
      }

      return {
        title,
        key: item.key
      }
    })

  const onExpand = (newExpandedKeys: string[] | any) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info)
  }

  const onCheck = (checkedKeys: React.Key[] | any, info: any) => {
    console.log('onCheck', checkedKeys, info)
  }
  // 将树形节点改为一维数组
  const generateList = (data: any, dataList: any[]) => {
    for (const node of data) {
      const { key, title, children } = node
      dataList.push({ key, title })
      if (children) {
        generateList(children, dataList)
      }
    }
    return dataList
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const dataList: any[] = generateList(treeData, [])
    const newExpandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
    setExpandedKeys(newExpandedKeys as React.Key[])
    setSearchValue(value)
    setAutoExpandParent(true)
  }

  const getParentKey = (key: React.Key, tree: Menu.MenuTreeList): React.Key => {
    let parentKey: React.Key

    for (const node of tree) {
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey!
  }
  // 获取树形节点数据
  const getList = () => {
    setTreeData(menuList || [])
    // handleTree(res.data)
  }
  useEffect(() => {
    getList()
  }, [])

  return (
    <div style={{ width: '20%', marginLeft: 10 }}>
      <Search style={{ marginBottom: 8 }} placeholder='搜索' onChange={onChange}/>
      <Tree
        // checkable
        onSelect={onSelect}
        onCheck={onCheck}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(treeData)}
      />
    </div>
  )
}

export default MenuManager
