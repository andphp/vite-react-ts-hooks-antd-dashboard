import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Input, Popconfirm, Space, Tabs } from 'antd'
import styles from './../../style.module.less'
import { Content } from 'antd/lib/layout/layout'

const WITH_SYSTEMS = true

function TabPane(props: { tab: string }) {
  return null
}

interface childProps {
  isAdd: boolean
  selectedMenu: any
  onSubmit: Function
  onValuesChange: (changedValues: any, values: any) => void
}

const MenuEdit:React.FC<childProps> = (props) => {
  // @ts-ignore
  const { isAdd, selectedMenu, onSubmit, onValuesChange } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [addTabKey, setAddTabKey] = useState('1')

  const hasSelectedMenu = selectedMenu && Object.keys(selectedMenu).length
  const isAddTop = isAdd && !hasSelectedMenu
  const isAddSub = isAdd && hasSelectedMenu
  const title = (() => {
    if (isAddTop) return WITH_SYSTEMS ? '添加应用' : '添加顶级'

    return isAddSub ? '添加菜单' : '修改菜单'
  })()

  // 表单回显
  useEffect(() => {
    form.resetFields()
    let initialValues = { ...selectedMenu, order: selectedMenu?.id }
    if (isAddTop) initialValues = { target: 'qiankun' }
    if (isAddSub) {
      initialValues = {
        target: 'menu',
        parentId: selectedMenu.id,
        systemId: selectedMenu.systemId
      }
    }

    form.setFieldsValue(initialValues)
  }, [form, isAdd, isAddTop, isAddSub, selectedMenu])

  async function branchSaveMenu(params: { menus: any; parentId: any }) {
    const { menus, parentId } = params
    const { systemId } = menus[0]
    const menuIds = menus.map((menu: { id: any }) => menu.id)
    const result = await onSubmit({
      systemId,
      menuIds,
      parentId
    })

    if (result) {
      setLoading(false)
      form.resetFields()
    }
  }

  async function saveMenu(params: any) {
    const { systemId, parentId, ...rest } = params
    const result = await onSubmit({
      systemId,
      parentId,
      ...rest
    })

    if (result) {
      setLoading(false)
      form.resetFields()
    }
  }

  function saveRole() {
    form.validateFields().then(async (values: any) => {
      const { systemId, parentId, ...rest } = values
      if (isAddTop) {
        await saveMenu({
          systemId,
          ...rest
        })
      } else if (isAddSub) {
        await saveMenu({
          systemId,
          parentId,
          ...rest
        })
      } else {
        await saveMenu({
          systemId,
          parentId,
          ...rest
        })
      }
    })
  }

  function updateMenu() {
    form.validateFields().then(async (values: any) => {
      const { systemId, parentId, ...rest } = values
      if (isAddTop) {
        await saveMenu({
          systemId,
          ...rest
        })
      } else if (isAddSub) {
        await saveMenu({
          systemId,
          parentId,
          ...rest
        })
      } else {
        await saveMenu({
          systemId,
          parentId,
          ...rest
        })
      }
    })
  }

  const handleSubmit = useCallback(
    async (values: any) => {
      if (loading) return
      console.log('values', values)
    },
    [addTabKey, branchSaveMenu, isAdd, isAddSub, isAddTop, loading, onSubmit, saveMenu, saveRole, updateMenu]
  )

  const handleDelete = useCallback(async () => {
    console.log('handleDelete')
  }, [])

  return (
    <Form
      className={styles.pane}
      name={`menu-form`}
      form={form}
      onFinish={(info) => handleSubmit(info)}
      onValuesChange={onValuesChange}
      initialValues={{ enabled: true }}
    >
      <h3 className={styles.title}>{title}</h3>
      <Content className={styles.content}>
        {isAddSub ? (
          <Tabs activeKey={addTabKey} onChange={(key) => setAddTabKey(key)}>
            <TabPane key='1' tab='单个添加' />
            <TabPane key='2' tab='批量添加' />
          </Tabs>
        ) : null}
        <Form.Item
          label='菜单名称'
          name='name'
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder='请输入菜单名称' />
        </Form.Item>
        <Form.Item>
          <Button type='primary'>
              提交
          </Button>
        </Form.Item>
      </Content>
      <Space className={styles.footerAction}>
        {!isAdd ? (
          <Popconfirm title={`您确定删除「${selectedMenu?.title}」？`} onConfirm={handleDelete}>
            <Button loading={loading} danger>
                删除
            </Button>
          </Popconfirm>
        ) : null}
        <Button loading={loading} type='primary' htmlType='submit'>
          保存
        </Button>
      </Space>
    </Form>
  )
}
export default MenuEdit
