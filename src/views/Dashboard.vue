<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>仪表板</h2>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalUsers || 0 }}</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-icon users"><User /></div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalGoods || 0 }}</div>
            <div class="stat-label">总商品数</div>
          </div>
          <div class="stat-icon goods"><Goods /></div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalOrders || 0 }}</div>
            <div class="stat-label">总订单数</div>
          </div>
          <div class="stat-icon orders"><Document /></div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-number">¥{{ stats.totalRevenue || 0 }}</div>
            <div class="stat-label">总销售额</div>
          </div>
          <div class="stat-icon revenue"><Money /></div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-container">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>销售趋势</span>
          </div>
        </template>
        <div id="salesChart" class="chart"></div>
      </el-card>
      
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>热门商品</span>
          </div>
        </template>
        <div id="hotGoodsChart" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { User, Goods, Document, Money } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from '../utils/request'

const stats = ref({})
const salesChart = ref(null)
const hotGoodsChart = ref(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/stats')
    const data = response.data || {}
    stats.value = {
      totalUsers: data.users?.total_users || 0,
      totalGoods: data.goods?.total_goods || 0,
      totalOrders: data.orders?.total_orders || 0,
      totalRevenue: data.orders?.total_amount || 0
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取销售趋势
const fetchSalesTrend = async () => {
  try {
    console.log('开始获取销售趋势...')
    const response = await axios.get('/api/admin/dashboard/sales-trend')
    console.log('销售趋势响应:', response)
    console.log('销售趋势数据:', response.data)
    initSalesChart(response.data || [])
  } catch (error) {
    console.error('获取销售趋势失败:', error)
    initSalesChart([])
  }
}

// 获取热门商品
const fetchHotGoods = async () => {
  try {
    console.log('开始获取热门商品...')
    const response = await axios.get('/api/admin/dashboard/hot-goods')
    console.log('热门商品响应:', response)
    console.log('热门商品数据:', response.data)
    initHotGoodsChart(response.data || [])
  } catch (error) {
    console.error('获取热门商品失败:', error)
    initHotGoodsChart([])
  }
}

// 初始化销售图表
const initSalesChart = (data) => {
  const chartDom = document.getElementById('salesChart')
  if (!chartDom || !data || data.length === 0) {
    console.log('销售图表数据为空或DOM不存在')
    return
  }
  if (salesChart.value) {
    salesChart.value.dispose()
  }
  salesChart.value = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ¥{c}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}/${date.getDate()}`
      })
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: data.map(item => parseFloat(item.amount || 0)),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        lineStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  salesChart.value.setOption(option)
}

// 初始化热门商品图表
const initHotGoodsChart = (data) => {
  const chartDom = document.getElementById('hotGoodsChart')
  if (!chartDom || !data || data.length === 0) {
    console.log('热门商品图表数据为空或DOM不存在')
    return
  }
  if (hotGoodsChart.value) {
    hotGoodsChart.value.dispose()
  }
  hotGoodsChart.value = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}件'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 12
      }
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: data.map(item => item.sales_count || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#67C23A' },
            { offset: 1, color: '#85CE61' }
          ])
        }
      }
    ]
  }

  hotGoodsChart.value.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  salesChart.value?.resize()
  hotGoodsChart.value?.resize()
}

onMounted(() => {
  console.log('Dashboard mounted')
  // 使用 setTimeout 确保 DOM 已渲染
  setTimeout(() => {
    fetchStats()
    fetchSalesTrend()
    fetchHotGoods()
  }, 100)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart.value?.dispose()
  hotGoodsChart.value?.dispose()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.users {
  background-color: #409EFF;
}

.stat-icon.goods {
  background-color: #67C23A;
}

.stat-icon.orders {
  background-color: #E6A23C;
}

.stat-icon.revenue {
  background-color: #F56C6C;
}

.charts-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>