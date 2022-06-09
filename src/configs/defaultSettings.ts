import { Settings as LayoutSettings } from '@ant-design/pro-layout'

const Settings: LayoutSettings & {
  pwa?: boolean
  logo?: string
} = {
  navTheme: 'dark',
  // 拂晓蓝 dark light
  primaryColor: '#1890ff',
  layout: 'mix', // side , top, mix
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'antd-dashboard',
  pwa: false,
  iconfontUrl: '',
  splitMenus: true
}

export default Settings
