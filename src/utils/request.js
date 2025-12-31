import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import mockData from './mock'

// 是否启用模拟数据（开发环境使用）
const ENABLE_MOCK = false  // 关闭模拟数据
const service = axios.create({
  baseURL: 'http://localhost:3000/',  // 替换为实际API地址
  timeout: 10000
})


// 模拟数据请求拦截器
const mockRequest = (config) => {
  const url = config.url.split('?')[0] // 移除查询参数
  const mockConfig = mockData[url]
  
  if (mockConfig && ENABLE_MOCK) {
    // 模拟网络延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockConfig.response, status: 200 })
      }, 300)
    })
  }
  return null
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 禁用缓存 - 添加更多缓存控制头
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    config.headers['Pragma'] = 'no-cache'
    config.headers['Expires'] = '0'

    // 如果是GET请求，添加随机参数防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _timestamp: Date.now()
      }
    }

    // 如果启用模拟数据，直接返回模拟响应
    if (ENABLE_MOCK) {
      const mockResponse = mockRequest(config)
      if (mockResponse) {
        return mockResponse
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // Blob 类型直接返回，不做处理
    if (response.config.responseType === 'blob') {
      return response
    }

    const res = response.data

    // 统一处理错误
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      // 处理未登录
      if (res.code === 401) {
        router.push('/login')
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    ElMessage.error('网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default service