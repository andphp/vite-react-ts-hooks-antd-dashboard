import React, { useMemo } from 'react'
import { Table } from 'antd'

const About:React.FC = () => {
  const dataSource = useMemo(
    () => [
      {
        key: '1',
        name: '胡彦斌21312312312',
        age: 32,
        address: '西湖区湖底公园1号'
      },
      {
        key: '2',
        name: '胡彦祖12312',
        age: 4222,
        address: '西湖区湖底公园1号ddddd'
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
  return <Table dataSource={dataSource} columns={columns} />
}

export default About
