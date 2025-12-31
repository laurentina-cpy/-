import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表板' }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('../views/Goods/Goods.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users/Users.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/Categories.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('../views/Suppliers.vue'),
        meta: { title: '供应商管理' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue'),
        meta: { title: '订单管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('admin_token')
  
  if (requiresAuth && !token) {
    next('/login')
  } else {
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 城小二管理员系统`
    } else {
      document.title = '城小二管理员系统'
    }
    next()
  }
})

export default router