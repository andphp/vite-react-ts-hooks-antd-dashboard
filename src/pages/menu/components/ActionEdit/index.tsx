import React, { useCallback, useEffect, useState } from 'react'
import {Button, Empty, Form, Input, Space} from 'antd'
import styles from './../../style.module.less'
import { Content } from 'antd/lib/layout/layout'

interface childProps {
  isAdd: boolean
  selectedMenu: any
  onSubmit: Function
  onValuesChange: (changedValues: any, values: any) => void
}

const ActionEdit:React.FC<childProps>  = (props) => {
  const [form] = Form.useForm()
  // @ts-ignore
  const { isAdd, selectedMenu, onSubmit, onValuesChange } = props
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    (values:any) => {
      setLoading(true)
      onSubmit(values).finally(() => {
        setLoading(false)
      })
    },
    [onSubmit]
  )

  useEffect(() => {
    form.resetFields()

    if (!selectedMenu) return

    form.setFieldsValue({ actions: selectedMenu?.actions })
  }, [selectedMenu, form])

  return (
    <Form
      className={styles.pane}
      name={`action-form`}
      form={form}
      onFinish={handleSubmit}
      onValuesChange={onValuesChange}
    >
      <h3 className={styles.title}>功能列表</h3>
      <Content className={styles.content}>
        {isAdd ? (
          <Empty style={{ marginTop: 50 }} description='请选择或保存新增菜单' />
        ) : (
          <Form.List name='actions'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => {
                  return (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                      <Form.Item
                        label='菜单名称'
                        name='name'
                        rules={[{ required: true, message: '请输入菜单名称' }]}
                      >
                        <Input placeholder='请输入菜单名称' />
                      </Form.Item>
                    </Space>
                  )
                })}
                <Form.Item
                  label='菜单名称'
                  name='name'
                  rules={[{ required: true, message: '请输入菜单名称' }]}
                >
                  <Input placeholder='请输入菜单名称' />
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
      </Content>
      <Space className={styles.footerAction}>
        <Button loading={loading} disabled={isAdd} type='primary' htmlType='submit'>
                    保存
        </Button>
      </Space>
    </Form>
  )
}

export default ActionEdit
