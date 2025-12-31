<template>
  <div class="users">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名/手机号">
          <el-input v-model="searchForm.keyword" placeholder="请输入用户名或手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><Search /> 搜索</el-button>
          <el-button @click="handleReset"><Refresh /> 重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 用户表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="usersList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="user_id" label="用户ID" width="180" />
        <el-table-column prop="nickname" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="phone_masked" label="脱敏手机号" width="130" />
        <el-table-column prop="register_time" label="注册时间" width="180">
          <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录" width="180">
          <template #default="scope">{{ formatDate(scope.row.last_login_time) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-switch
              v-if="scope.row"
              :model-value="scope.row.status === 1"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="total_orders" label="订单数" width="100" />
        <el-table-column prop="total_amount" label="消费金额" width="120">
          <template #default="scope">¥{{ scope.row.total_amount || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewOrders(scope.row)">订单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情弹窗 -->
      <el-dialog
        v-model="ordersDialogVisible"
        :title="`${currentUserName} 的订单`"
        width="80%"
        @close="ordersDialogVisible = false"
      >
        <el-table
          v-loading="ordersLoading"
          :data="ordersList"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column prop="order_id" label="订单ID" width="180" />
          <el-table-column prop="total_amount" label="订单金额" width="120">
            <template #default="scope">¥{{ scope.row.total_amount || 0 }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              {{ getOrderStatusText(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="delivery_address" label="配送地址" show-overflow-tooltip />
          <el-table-column prop="create_time" label="下单时间" width="180">
            <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            layout="total, prev, pager, next"
            :total="ordersTotal"
            :current-page="1"
            :page-size="10"
          />
        </div>
      </el-dialog>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import axios from '../../utils/request'

const loading = ref(false)
const usersList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const ordersDialogVisible = ref(false)
const ordersLoading = ref(false)
const ordersList = ref([])
const ordersTotal = ref(0)
const currentUserId = ref('')
const currentUserName = ref('')

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 获取用户列表
const fetchUsersList = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    // 只在有值时才添加参数
    if (searchForm.keyword && searchForm.keyword.trim()) {
      params.keyword = searchForm.keyword
    }
    if (searchForm.status !== '' && searchForm.status !== undefined) {
      params.status = searchForm.status
    }

    console.log('用户列表请求参数:', params)
    const res = await axios.get('/api/admin/users/list', { params })
    console.log('用户列表响应:', res)
    console.log('响应数据:', res.data)

    // 兼容不同的数据格式
    // 格式1: {code: 200, data: {list: [...], pagination: {...}}}
    // 格式2: {list: [...], pagination: {...}}
    const data = res.data.code === 200 ? res.data.data : res.data
    usersList.value = data.list || data.rows || []
    const pagination = data.pagination || {}
    total.value = pagination.total || data.count || 0
    console.log('解析后 - 用户列表长度:', usersList.value.length, '总数:', total.value)
    console.log('第一条数据:', usersList.value[0])
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsersList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  currentPage.value = 1
  fetchUsersList()
}

// 分页
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchUsersList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsersList()
}

// 更新状态
const handleStatusChange = async (row, newValue) => {
  const newStatus = newValue ? 1 : 0
  const oldStatus = row.status
  console.log('切换用户状态:', { user_id: row.user_id, oldStatus, newStatus })
  try {
    await axios.patch(`/api/admin/users/status/${row.user_id}`, {
      status: newStatus
    })
    row.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败: ' + (error.response?.data?.message || error.message))
    console.error('更新状态失败:', error)
  }
}

// 查看订单
const handleViewOrders = (row) => {
  currentUserId.value = row.user_id
  currentUserName.value = row.nickname
  ordersDialogVisible.value = true
  fetchUserOrders()
}

// 获取用户订单
const fetchUserOrders = async () => {
  try {
    ordersLoading.value = true
    const res = await axios.get(`/api/admin/users/${currentUserId.value}/orders`, {
      params: { page: 1, limit: 10 }
    })

    const data = res.data.code === 200 ? res.data.data : res.data
    ordersList.value = data.list || data.rows || []
    ordersTotal.value = data.pagination?.total || data.count || 0
  } catch (error) {
    console.error('获取用户订单失败:', error)
    ElMessage.error('获取用户订单失败: ' + (error.response?.data?.message || error.message))
  } finally {
    ordersLoading.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '待接单',
    2: '配送中',
    3: '已完成',
    4: '已取消'
  }
  return statusMap[status] || '未知'
}

onMounted(() => {
  fetchUsersList()
})
</script>

<style scoped>
.users {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>