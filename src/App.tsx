import { localeConfig } from '@/configs/locale'
import { ConfigProvider } from 'antd'
import enUS from 'antd/es/locale/en_US'
import zhCN from 'antd/es/locale/zh_CN'
// import { createBrowserHistory } from 'history'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import React, { useEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import '@/styles/App.less'
import RenderRouter from './routes'
import { userState } from '@/stores/atoms/user'
// const history = createBrowserHistory()

const App: React.FC = () => {
  const [user, _] = useRecoilState(userState)
  const { locale } = user

  // const { data: currentUser } = useGetCurrentUser()

  useEffect(() => {
    if (locale.toLowerCase() === 'en-us') {
      moment.locale('en')
    } else if (locale.toLowerCase() === 'zh-cn') {
      moment.locale('zh')
    }
  }, [locale])

  const getAntdLocale = () => {
    if (locale.toLowerCase() === 'en-us') {
      return enUS
    } else if (locale.toLowerCase() === 'zh-cn') {
      return zhCN
    }
  }

  const getLocale = () => {
    const lang = localeConfig.find((item) => {
      return item.key === locale.toLowerCase()
    })

    return lang?.messages
  }

  return (
    <ConfigProvider locale={getAntdLocale()} componentSize='middle'>
      <IntlProvider locale={locale.split('-')[0]} messages={getLocale()}>
        <BrowserRouter>
          <RenderRouter />
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  )
}

export default App
