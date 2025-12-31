<template>
  <div class="orders">
    <div class="page-header">
      <h2>订单管理</h2>
    </div>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.order_no" placeholder="请输入订单号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="searchForm.user_phone" placeholder="请输入用户手机号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="配送中" :value="2" />
            <el-option label="已送达" :value="3" />
            <el-option label="已完成" :value="4" />
            <el-option label="已取消" :value="5" />
            <el-option label="已退款" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><Search /> 搜索</el-button>
          <el-button @click="handleReset"><Refresh /> 重置</el-button>
          <el-button type="success" @click="handleExport"><Download /> 导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 订单表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="ordersList"
        :row-key="row => row.order_id"
        :row-class-name="tableRowClassName"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="order_number" label="订单号" width="200" />
        <el-table-column prop="user" label="用户" width="120">
          <template #default="scope">{{ scope.row.user?.nickname || '-' }}</template>
        </el-table-column>
        <el-table-column prop="user" label="手机号" width="120">
          <template #default="scope">{{ scope.row.user?.phone_masked || '-' }}</template>
        </el-table-column>
        <el-table-column prop="total_amount" label="订单金额" width="100">
          <template #default="scope">¥{{ scope.row.total_amount }}</template>
        </el-table-column>
        <el-table-column prop="delivery_fee" label="配送费" width="80">
          <template #default="scope">¥{{ scope.row.delivery_fee }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <span v-if="scope.row" :style="getStatusStyle(scope.row.status)" class="status-badge">
              <i v-if="scope.row.status === 0" class="status-icon">⏳</i>
              <i v-else-if="scope.row.status === 1" class="status-icon">💰</i>
              <i v-else-if="scope.row.status === 2" class="status-icon">🚚</i>
              <i v-else-if="scope.row.status === 3" class="status-icon">📦</i>
              <i v-else-if="scope.row.status === 4" class="status-icon">✅</i>
              <i v-else-if="scope.row.status === 5" class="status-icon">❌</i>
              <i v-else-if="scope.row.status === 6" class="status-icon">↩️</i>
              <span style="margin-left: 4px;">{{ getStatusText(scope.row.status) }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryPerson" label="配送员" width="120">
          <template #default="scope">{{ scope.row.deliveryPerson?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180">
          <template #default="scope"><span v-if="scope.row">{{ formatDate(scope.row.create_time) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">详情</el-button>
            <el-button
              v-if="scope.row && scope.row.status === 1"
              type="warning"
              size="small"
              @click="handleAssignDelivery(scope.row)"
            >分配</el-button>
            <el-button
              v-if="scope.row && scope.row.status === 2"
              type="success"
              size="small"
              @click="handleComplete(scope.row)"
            >完成</el-button>
            <el-button
              v-if="scope.row && [0, 1].includes(scope.row.status)"
              type="danger"
              size="small"
              @click="handleCancel(scope.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
    
    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder.order_number }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <span :style="getStatusStyle(currentOrder.status)" class="status-badge">
            <i v-if="currentOrder.status === 0" class="status-icon">⏳</i>
            <i v-else-if="currentOrder.status === 1" class="status-icon">💰</i>
            <i v-else-if="currentOrder.status === 2" class="status-icon">🚚</i>
            <i v-else-if="currentOrder.status === 3" class="status-icon">📦</i>
            <i v-else-if="currentOrder.status === 4" class="status-icon">✅</i>
            <i v-else-if="currentOrder.status === 5" class="status-icon">❌</i>
            <i v-else-if="currentOrder.status === 6" class="status-icon">↩️</i>
            <span style="margin-left: 4px;">{{ getStatusText(currentOrder.status) }}</span>
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentOrder.user?.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentOrder.user?.phone_masked }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">
          {{ currentOrder.delivery_address }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentOrder.total_amount }}</el-descriptions-item>
        <el-descriptions-item label="配送费">¥{{ currentOrder.delivery_fee }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatDate(currentOrder.create_time) }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentOrder.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>商品列表</el-divider>

      <el-table :data="currentOrder.orderItems" border>
        <el-table-column prop="goods_name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column label="小计" width="100">
          <template #default="scope">¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    
    <!-- 分配配送员对话框 -->
    <el-dialog
      v-model="assignVisible"
      title="分配配送员"
      width="500px"
    >
      <el-select v-model="selectedDeliveryId" placeholder="请选择配送员" filterable>
        <el-option
          v-for="delivery in availableDeliveries"
          :key="delivery.delivery_id"
          :label="`${delivery.name} - ${delivery.phone}`"
          :value="delivery.delivery_id"
        />
      </el-select>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import axios from '../utils/request'

const loading = ref(false)
const ordersList = ref([])
const availableDeliveries = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const operatingOrderId = ref(null) // 正在操作的订单ID

// 搜索表单
const searchForm = reactive({
  order_no: '',
  user_phone: '',
  status: '',
  dateRange: []
})

// 订单详情
const detailVisible = ref(false)
const currentOrder = ref({})

// 分配配送员
const assignVisible = ref(false)
const selectedDeliveryId = ref('')
const selectedOrder = ref(null)

// 获取订单列表
const fetchOrdersList = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      keyword: searchForm.order_no,
      start_date: searchForm.dateRange?.[0],
      end_date: searchForm.dateRange?.[1],
      _t: Date.now() // 添加时间戳避免浏览器缓存
    }
    // 只有当status有值时才添加到参数中
    if (searchForm.status !== undefined && searchForm.status !== '') {
      params.status = searchForm.status
    }
    console.log('========== 获取订单列表 ==========')
    console.log('请求参数:', params)

    const response = await axios.get('/api/admin/orders/list', { params })

    console.log('API响应完整数据:', JSON.stringify(response, null, 2))
    console.log('订单列表数据:', response.data?.list?.length, '条')

    if (response.data?.list && response.data.list.length > 0) {
      console.log('第一条订单完整数据:', JSON.stringify(response.data.list[0], null, 2))
      console.log('第一条订单状态值:', response.data.list[0].status, '类型:', typeof response.data.list[0].status)
    }

    // 强制重新赋值，确保Vue响应式更新
    ordersList.value = []
    await new Promise(resolve => setTimeout(resolve, 50)) // 强制Vue重新渲染

    // 确保status是数字类型
    ordersList.value = (response.data?.list || []).map(order => ({
      ...order,
      status: parseInt(order.status, 10) // 转换为数字
    }))

    console.log('处理后的订单列表，第一条状态:', ordersList.value[0]?.status, '类型:', typeof ordersList.value[0]?.status)

    total.value = response.data.pagination?.total || 0
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 获取可用配送员
const fetchAvailableDeliveries = async () => {
  try {
    const response = await axios.get('/api/admin/delivery/list', { params: { status: 1, limit: 100 } })
    availableDeliveries.value = response.data.list || []
  } catch (error) {
    console.error('获取配送员列表失败:', error)
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    0: 'info',     // 待支付 - 灰色
    1: 'success',  // 已支付 - 绿色
    2: 'warning',  // 配送中 - 橙色
    3: '',         // 已送达 - 蓝色
    4: 'success',  // 已完成 - 绿色
    5: 'danger',   // 已取消 - 红色
    6: 'warning'   // 已退款 - 橙色
  }
  return typeMap[status] || 'info'
}

// 获取状态样式
const getStatusStyle = (status) => {
  const styleMap = {
    0: 'background: #f4f4f5; color: #909399; border: 1px solid #d3d4d6;',      // 待支付
    1: 'background: #f0f9ff; color: #409eff; border: 1px solid #a0cfff;',      // 已支付
    2: 'background: #fef0e8; color: #e6a23c; border: 1px solid #f3d19e;',      // 配送中
    3: 'background: #ecf5ff; color: #67c23a; border: 1px solid #b3e19d;',      // 已送达
    4: 'background: #f0f9ff; color: #67c23a; border: 1px solid #b3e19d;',      // 已完成
    5: 'background: #fef0f0; color: #f56c6c; border: 1px solid #fab6b6;',      // 已取消
    6: 'background: #fdf6ec; color: #e6a23c; border: 1px solid #f3d19e;'       // 已退款
  }
  return styleMap[status] || 'background: #f4f4f5; color: #909399;'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    0: '待支付',
    1: '已支付',
    2: '配送中',
    3: '已送达',
    4: '已完成',
    5: '已取消',
    6: '已退款'
  }
  return textMap[status] || '未知'
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchOrdersList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'dateRange' ? [] : ''
  })
  currentPage.value = 1
  fetchOrdersList()
}

// 分页
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchOrdersList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchOrdersList()
}

// 查看详情
const handleViewDetail = (row) => {
  currentOrder.value = row
  detailVisible.value = true
}

// 分配配送员
const handleAssignDelivery = async (row) => {
  selectedOrder.value = row
  selectedDeliveryId.value = row.delivery_id || ''
  operatingOrderId.value = row.order_id // 标记正在操作的订单
  await fetchAvailableDeliveries()
  assignVisible.value = true
}

// 表格行样式
const tableRowClassName = ({ row }) => {
  if (row.order_id === operatingOrderId.value) {
    return 'highlight-row'
  }
  return ''
}

// 确认分配
const handleConfirmAssign = async () => {
  try {
    const orderId = selectedOrder.value.order_id;
    console.log('========== 开始分配配送员 ==========');
    console.log('订单ID:', orderId);
    console.log('订单编号:', selectedOrder.value.order_number);
    console.log('当前状态:', selectedOrder.value.status, '(应该是1-已支付)');
    console.log('目标状态: 2 (配送中)');
    console.log('配送员ID:', selectedDeliveryId.value);

    if (!orderId) {
      ElMessage.error('订单ID缺失，无法分配配送员');
      return;
    }

    console.log('--- 发送分配请求 ---');
    const response = await axios.patch(`/api/admin/orders/status/${orderId}`, {
      status: 2, // 配送中
      delivery_person_id: selectedDeliveryId.value
    })
    console.log('--- 分配响应 ---', response.data);

    ElMessage.success('分配成功，正在刷新订单列表...')
    assignVisible.value = false

    console.log('--- 开始刷新订单列表 ---');
    await fetchOrdersList()
    console.log('--- 订单列表刷新完成 ---');

    // 延迟后取消高亮
    setTimeout(() => {
      operatingOrderId.value = null
    }, 2000)

  } catch (error) {
    console.error('分配配送员失败:', error)
    ElMessage.error(error.response?.data?.message || '分配失败')
  }
}

// 完成订单
const handleComplete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要完成该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    const orderId = row.order_id;
    console.log('完成订单，订单ID:', orderId);

    if (!orderId) {
      ElMessage.error('订单ID缺失，无法完成订单');
      return;
    }

    console.log('发送完成订单请求...');
    const response = await axios.patch(`/api/admin/orders/status/${orderId}`, { status: 4 })
    console.log('完成订单响应:', response.data);

    ElMessage.success('订单已完成')

    console.log('开始刷新订单列表...');
    await fetchOrdersList()
    console.log('订单列表刷新完成');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('完成订单失败:', error)
      ElMessage.error(error.response?.data?.message || '操作失败')
    }
  }
}

// 取消订单
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const orderId = row.order_id;
    console.log('取消订单，订单ID:', orderId);

    if (!orderId) {
      ElMessage.error('订单ID缺失，无法取消订单');
      return;
    }

    await axios.patch(`/api/admin/orders/status/${orderId}`, { status: 5 })
    ElMessage.success('订单已取消')
    fetchOrdersList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error(error.response?.data?.message || '操作失败')
    }
  }
}

// 导出订单
const handleExport = async () => {
  try {
    console.log('开始导出订单，搜索条件:', searchForm)

    const params = {
      keyword: searchForm.order_no,
      status: searchForm.status,
      start_date: searchForm.dateRange?.[0],
      end_date: searchForm.dateRange?.[1]
    }

    console.log('发送导出请求，参数:', params)

    const response = await axios.get('/api/admin/orders/export', {
      params,
      responseType: 'blob'
    })

    console.log('导出响应状态:', response.status, '数据大小:', response.data?.size || 'unknown')

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `订单导出_${dayjs().format('YYYYMMDDHHmmss')}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    console.error('错误详情:', error.message, error.response)
    ElMessage.error('导出失败: ' + (error.message || '未知错误'))
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  fetchOrdersList()
})
</script>

<style scoped>
.orders {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 高亮正在操作的订单行 */
:deep(.highlight-row) {
  background-color: #ecf5ff !important;
  animation: highlight-pulse 1s ease-in-out;
}

@keyframes highlight-pulse {
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #ecf5ff;
  }
  100% {
    background-color: #fff;
  }
}

/* 状态标签样式 */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 14px;
  line-height: 1;
}
</style>
