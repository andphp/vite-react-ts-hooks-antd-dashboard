import { message, notification } from 'antd'
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestTransformer } from 'axios'

import { createBrowserHistory } from 'history'
import qs from 'qs'
import { createContext, useContext } from 'react'
import { useMutation, useQuery } from 'react-query'
import { JsonToSnake } from './func'

import Storage from './storage'
import config from '@/configs'

enum ResultCode {
  SUCCESS,
  ERROR = 7,
  SYSTEM_ERROR = 100000,
  PARAMS_ERROR
}

const history = createBrowserHistory()
// const navigate = useNavigate()
// console.log('baseurl:', config.baseURL)
const axios = Axios.create({
  baseURL: String(config.baseURL),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  Storage.set('accessToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojk1MDEvYmFja2VuZC9sb2dpbiIsImlhdCI6MTY1NDgzOTk2MywiZXhwIjoxNjU0ODQzNTYzLCJuYmYiOjE2NTQ4Mzk5NjMsImp0aSI6Im11WnZlbHgyQ1NqZjJWeUkiLCJzdWIiOiIxIiwicHJ2IjoiMGMxNGNhMDdlMzVhYTlkMzFlZDJhZDA1YjI1ZmVlYmE5MDA1MWNkYSIsImlkIjoxLCJhY2NvdW50X25hbWUiOiJhZG1pbiJ9.Qe1BASgGarg8IBbFT7ljTe1CitDnvRLLr-rbLq-mJCxAU0QZ2F1r-eFyWlCniecxuR7k3xzRwDxsN37hu5I1cQ')
  const token = Storage.get('accessToken', false)
  if (token) {
    // config.headers = { Authorization: `Bearer ${token}` }
    config.headers = { Authorization: `Bearer ${token}` }
    // config.headers = { 'x-token': token }
  }

  // 每次请求带上时间戳 防刷处理
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      // @ts-ignore
      timestamp: Date.parse(new Date()) / 1000
    }
  }
  return config
}, (error: any) => {
  return Promise.reject(error)
})

// response interceptor
axios.interceptors.response.use(
  (response: { data: any; status: number; statusText: any }) => {
    const data = response.data
    // console.log('response:', response)
    if (response.status === 200) {
      switch (data.code) {
        case ResultCode.SUCCESS:
          return data

        case ResultCode.PARAMS_ERROR:
          if (typeof data?.data == 'string') {
            message.warning(data.data).then(() => {})
          }
          if (typeof data?.data == 'object') {
            const values: any[] = Object.values(data?.data)
            values.forEach((value) => {
              message.warning(value).then(() => {})
            })
          }
          return null

        default:
          const resultData = data?.data
          let resultMsg: string = data.msg
          if (resultData && Object.keys(resultData).length > 0) {
            resultMsg = JSON.stringify(resultData)
          }
          message.warning(resultMsg).then(() => {})
          return null
      }
    }
    // console.log('statusText', response.statusText)
    // notification.error({
    //   message: `请求错误 ${response.statusText}: ${response}`,
    //   description: data || response.statusText || 'Error'
    // })

    return Promise.reject(new Error(response.statusText || 'Error'))
  },
  (error: { response: { status: number; data: { msg: any; data: any } } }) => {
    // console.log('err:', error, error.response) // for debug
    if (error.response?.status) {
      switch (error.response.status) {
        // 403 token过期
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 403 | 401:
          Storage.remove('accessToken')
          notification.error({
            message: error.response.data?.msg || 'Error',
            description: error.response.data?.data || 'Error'
          })
          history.push('/login')
          setTimeout(() => window.location.reload(), 2000)
          break
        // 404请求不存在
        case 404:
          notification.error({
            message: `请求不存在`,
            description: error.response.data?.data || 'Error'
          })
          break
        case 406:
          notification.error({
            message: `请求参数有误`,
            description: error.response.data?.data || 'Error'
          })
          break
        default:
          notification.error({
            message: `请求错误`,
            description: error.response.data?.data || 'Error'
          })
      }
    }

    // throw new Error(error);
    return Promise.reject(error.response.data)
    // return null
  }
)

export const AxiosContext = createContext<AxiosInstance>(
  new Proxy(axios, {
    apply: () => {
      throw new Error('You must wrap your component in an AxiosProvider')
    },
    get: () => {
      throw new Error('You must wrap your component in an AxiosProvider')
    }
  })
)

export const useAxios = () => {
  return useContext(AxiosContext)
}

const transformPagination = (pagination: any) => {
  if (!pagination) return

  const current = pagination.current ? pagination.current : pagination.defaultCurrent
  const pageSize = pagination.pageSize ? pagination.pageSize : pagination.defaultPageSize

  // let offset = 0
  // if (current && pageSize) {
  //   offset = (current - 1) * pageSize
  // }

  return {
    page: current,
    pageSize
  }
}

// const transformFilters = (filters: any) => {
//   if (!filters) return
//   let result: any[] = []
//   for (const key in filters) {
//     if (!filters[key] || filters[key] === null) continue
//     result = [...result, [key + ':eq:' + filters[key]]]
//   }
//   return result
// }

// const transformSorter = (sorter: any) => {
//   if (!sorter) return
//
//   let result = ''
//   if (sorter.field && sorter.order) {
//     let order = 'desc'
//     if (sorter.order === 'ascend') order = 'asc'
//     result = sorter.field + ' ' + order
//   }
//
//   return result
// }

const transformParams = (obj: any) => {
  if (!obj) return {}
  return JsonToSnake(obj)
}

const useGetList = <T>(key: string, url: string, filters?: any, sorter?: any) => {
  const axios = useAxios()
  const params = filters || sorter ? transformParams(Object.assign(filters, sorter)) : {} // transformFilters(filters)

  const service = async () => {
    // console.log('--params: ', params)
    return await axios.get(`${url}`, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }).then((res) => {
      console.log('--res: ', res)
      return res.data as T | undefined
    }).catch((error) => {
      console.log('--error: ', error)
      return error
    })
  }
  return useQuery(key, () => service())
}

const useGetPageList = <T>(key: string, url: string, pagination?: any, filters?: any, sorter?: any) => {
  const axios = useAxios()

  const service = async () => {
    const page = { ...transformPagination(pagination) }
    const params = transformParams(Object.assign(page, filters, sorter))
    const transformRequest: AxiosRequestTransformer = (data, headers) => {}
    // console.log('--params: ', params)
    return await axios.get(`${url}`, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
      transformRequest
    })
  }
  return useQuery(key, () => service())
}

const useGetOne = <T>(key: string, url: string, params?: any) => {
  const axios = useAxios()

  const service = async () => {
    return await axios.get(`${url}`, params).then((res) => {
      return res.data as T | undefined
    })
  }
  return useQuery(key, () => service())
}

const useCreate = <T, U>(url: string) => {
  const axios = useAxios()
  return useMutation(async (params: T) => {
    return await axios.post(`${url}`, qs.stringify(params)).then((res) => {
      return res.data as U
    })
  })
}

const useUpdate = <T>(url: string) => {
  const axios = useAxios()
  return useMutation(async (item: T) => {
    return await axios.patch(`${url}`, item)
  })
}

const useDelete = <T>(url: string) => {
  const axios = useAxios()
  return useMutation(async (id: number) => {
    return await axios.delete(`${url}?id=${id}`)
  })
}

const useBatch = (url: string) => {
  const axios = useAxios()
  return useMutation(async (ids: number[]) => {
    return await axios.post(`${url}`, { idList: ids })
  })
}

export { useGetOne, useGetList, useGetPageList, useUpdate, useCreate, useDelete, useBatch }

export default axios
