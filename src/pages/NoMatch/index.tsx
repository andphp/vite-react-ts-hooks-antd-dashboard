import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'
import React from 'react'

const NoMatch:React.FC = () => {
  const navigate = useNavigate()
  return (
    <Result
      status='404'
      title='404'
      subTitle='页面不存在'
      extra={
        <Button type='primary' onClick={() => navigate('/')}>
          去首页
        </Button>
      }
    />
  )
}

export default NoMatch
