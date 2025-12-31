import { defineStore } from 'pinia'
import axios from '../utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('adminToken') || '',
    userInfo: JSON.parse(localStorage.getItem('adminUserInfo')) || {}
  }),
  
  actions: {
    // 登录
    async login(username, password) {
      try {
        const response = await axios.post('/api/admin/login', { username, password })
        if (response.code === 200) {
          this.token = response.data.token
          this.userInfo = response.data.admin
          localStorage.setItem('adminToken', response.data.token)
          localStorage.setItem('adminUserInfo', JSON.stringify(response.data.admin))
          return true
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      }
    },
    
    // 登出
    logout() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUserInfo')
    },
    
    // 获取用户信息
    async getInfo() {
      try {
        const response = await axios.get('/api/admin/info')
        if (response.code === 200) {
          this.userInfo = response.data
          localStorage.setItem('adminUserInfo', JSON.stringify(response.data))
          return response.data
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
  }
})

export default useUserStore