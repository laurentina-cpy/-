<template>
  <el-container class="admin-layout">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <h1>城小二管理系统</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        @select="handleMenuSelect"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="isCollapse"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <template #title>仪表板</template>
        </el-menu-item>
        <el-sub-menu index="goods">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/goods">商品列表</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon><Collection /></el-icon>
          <template #title>分类管理</template>
        </el-menu-item>
        <el-menu-item index="/suppliers">
          <el-icon><OfficeBuilding /></el-icon>
          <template #title>供应商管理</template>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="isCollapse = !isCollapse"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon><User /></el-icon>
              {{ userInfo.real_name || userInfo.username }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store'
import {
  House, Goods, User, Collection, OfficeBuilding, Document,
  ArrowDown, Menu
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>


<style scoped>
.admin-layout {
  height: 100vh;
}

.aside {
  background-color: #304156;
  overflow: hidden;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;
}

.logo h1 {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.el-menu-vertical-demo {
  height: calc(100vh - 60px);
  border-right: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>