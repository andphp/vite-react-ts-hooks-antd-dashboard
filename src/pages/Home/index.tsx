import { useMemo } from 'react'
import { Table } from 'antd'
import React from 'react'

const Home:React.FC = () => {
  const dataSource = useMemo(
    () => [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
      }
    ],
    []
  )
  const columns = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address'
      }
    ],
    []
  )
  return (
    <Table dataSource={dataSource} columns={columns} />
  )
}

export default Home
