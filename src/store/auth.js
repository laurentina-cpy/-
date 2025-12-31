import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    userInfo: JSON.parse(localStorage.getItem('admin_info') || '{}')
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:3000/api/admin/login', {
          username,
          password
        })
        
        if (response.data.code === 200) {
          this.token = response.data.data.token
          this.userInfo = response.data.data.admin
          localStorage.setItem('admin_token', this.token)
          localStorage.setItem('admin_info', JSON.stringify(this.userInfo))
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          router.push('/')
          return true
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    logout() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }
})