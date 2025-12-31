<template>
  <div class="goods-container">
    <el-card>
      <template #header>
        <div class="goods-header">
          <span>商品管理</span>
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </div>
      </template>
      
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category_id" placeholder="请选择分类">
            <el-option label="全部分类" value="" />
            <el-option v-for="category in categories" :key="category.category_id" :label="category.category_name" :value="category.category_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="searchForm.shelf_status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="已上架" :value="1" />
            <el-option label="已下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 商品列表 -->
      <el-table :data="goodsList" stripe style="width: 100%">
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">¥{{ scope.row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="category.category_name" label="分类" width="150" />
        <el-table-column prop="supplier.name" label="供应商" width="150" />
        <el-table-column prop="shelf_status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.shelf_status === 1 ? 'success' : 'warning'">
              {{ scope.row.shelf_status === 1 ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="small" @click="handleShelf(scope.row)">
              {{ scope.row.shelf_status === 1 ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%">
      <!-- 商品表单 -->
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '../../utils/request'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  category_id: '',
  shelf_status: ''
})

// 商品列表
const goodsList = ref([])
const categories = ref([])
const suppliers = ref([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const editForm = reactive({})

// 加载分类数据
const loadCategories = async () => {
  try {
    console.log('开始加载分类数据...')
    const response = await request.get('/api/admin/categories/list', {
      params: { limit: 1000 }
    })
    console.log('分类响应:', response)
    categories.value = response.data.list || []
    console.log('分类加载成功,数量:', categories.value.length)
  } catch (error) {
    console.error('加载分类失败:', error)
    categories.value = []
  }
}

// 加载供应商数据
const loadSuppliers = async () => {
  try {
    console.log('开始加载供应商数据...')
    const response = await request.get('/api/admin/suppliers/list', {
      params: { limit: 1000 }
    })
    console.log('供应商响应:', response)
    suppliers.value = response.data.list || []
    console.log('供应商加载成功,数量:', suppliers.value.length)
  } catch (error) {
    console.error('加载供应商失败:', error)
    suppliers.value = []
  }
}

// 加载商品列表
const loadGoodsList = async () => {
  try {
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      keyword: searchForm.keyword,
      category_id: searchForm.category_id,
      shelf_status: searchForm.shelf_status
    }

    console.log('请求商品列表,参数:', params)
    const response = await request.get('/api/admin/goods/list', { params })
    console.log('商品列表响应:', response)

    if (response && response.data) {
      goodsList.value = response.data.list || []
      pagination.total = response.data.pagination?.total || 0
      console.log('商品列表加载成功,数量:', goodsList.value.length)
    } else {
      console.error('响应数据格式错误:', response)
      goodsList.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    goodsList.value = []
    pagination.total = 0
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadGoodsList()
}

// 重置
const resetForm = () => {
  Object.assign(searchForm, {
    keyword: '',
    category_id: '',
    shelf_status: ''
  })
  pagination.currentPage = 1
  loadGoodsList()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadGoodsList()
}

// 页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadGoodsList()
}

// 添加商品
const handleAdd = () => {
  dialogTitle.value = '添加商品'
  Object.assign(editForm, {})
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row) => {
  dialogTitle.value = '编辑商品'
  Object.assign(editForm, row)
  dialogVisible.value = true
}

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/api/admin/goods/delete/${row.goods_id}`)
      ElMessage.success('删除成功')
      loadGoodsList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {
    // 取消删除
  })
}

// 上架/下架
const handleShelf = (row) => {
  const newStatus = row.shelf_status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'
  
  ElMessageBox.confirm(`确定要${actionText}该商品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await request.patch('/api/admin/goods/batch-shelf', {
        goods_ids: [row.goods_id],
        shelf_status: newStatus
      })
      ElMessage.success(`${actionText}成功`)
      loadGoodsList()
    } catch (error) {
      console.error(`${actionText}失败:', error)`)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 初始化
onMounted(() => {
  console.log('Goods页面mounted,开始加载数据...')
  loadCategories()
  loadSuppliers()
  loadGoodsList()
})
</script>

<style scoped>
.goods-container {
  height: 100%;
}

.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>