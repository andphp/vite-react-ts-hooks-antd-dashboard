import { Card, Col } from 'antd'
import React from 'react'
import { RouteProps, useNavigate } from 'react-router-dom'
import styles from './index.module.less'

export interface SelectMenuCardProps extends RouteProps {
  path: string
  title: string
}
const SelectMenuCard: React.FC<SelectMenuCardProps> = ({ path, title }) => {
  const navigate = useNavigate()
  return (
    <Col xs={24} sm={12} md={6}>
      <Card onClick={() => navigate(path, { replace: true })} className={styles.siteCardBorderLessWrapper} title={title}>
        <p>{path}</p>
      </Card>
    </Col>
  )
}

export default SelectMenuCard
