import axios from 'axios'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, ROLE_CODE_STR, ROLE_LIST, USER_INFO } from '@/store/mutation-types'
import router from '@/router'
import { Modal } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      if (token) {
        Modal.destroyAll()
        storage.remove(ACCESS_TOKEN)
        storage.remove(USER_INFO)
        storage.remove(ROLE_LIST)
        storage.remove(ROLE_CODE_STR)
        notification.error({
          message: '登录状态已过期',
          description: data.message
        })
        router.push({ name: 'login' })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[ACCESS_TOKEN] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  // 附件下载拦截
  if (response.config && response.config.responseType === 'blob') {
    const blob = new Blob([response.data], { type: 'application/octet-stream;charset=utf-8' })
    const filename = decodeURI(response.headers['filename'])
    if ('download' in document.createElement('a')) {
      const downloadElement = document.createElement('a')
      let href = ''
      if (window.URL) {
        href = window.URL.createObjectURL(blob)
      } else {
        href = window.webkitURL.createObjectURL(blob)
      }
      downloadElement.href = href
      downloadElement.download = filename
      document.body.appendChild(downloadElement)
      downloadElement.click()
      if (window.URL) {
        window.URL.revokeObjectURL(href)
      } else {
        window.webkitURL.revokeObjectURL(href)
      }
      document.body.removeChild(downloadElement)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
    return
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
