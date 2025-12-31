<template>
  <div class="app-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <div class="logo">城小二管理系统</div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          router
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/goods">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/orders">
            <el-icon><Tickets /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/categories">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/suppliers">
            <el-icon><OfficeBuilding /></el-icon>
            <span>供应商管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon class="toggle-sidebar" @click="toggleSidebar"><Menu /></el-icon>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userInfo.avatar || ''">{{ userInfo.real_name?.[0] || 'A' }}</el-avatar>
                <span class="user-name">{{ userInfo.real_name }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRoute, useRouter } from 'vue-router'
import {
  House,
  Goods,
  User,
  Tickets,
  Folder,
  OfficeBuilding,
  Menu,
  ArrowDown
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const userInfo = computed(() => authStore.userInfo)
const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.aside {
  background-color: #001529;
  color: #fff;
  overflow-y: auto;
}

.logo {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu-vertical-demo {
  border-right: none;
  background-color: transparent;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item.is-active {
  background-color: #1890ff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.toggle-sidebar {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin: 0 8px;
}

.main-content {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>