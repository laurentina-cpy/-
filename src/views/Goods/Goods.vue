<template>
  <div class="goods">
    <div class="page-header">
      <h2>商品管理</h2>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleCreateGoods"><Plus /> 新增商品</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedGoods.length === 0"><Delete /> 批量删除</el-button>
    </div>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 180px">
            <el-option
              v-for="cat in categories"
              :key="cat.category_id"
              :label="cat.category_name"
              :value="cat.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><Search /> 搜索</el-button>
          <el-button @click="handleReset"><Refresh /> 重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 商品表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="goodsList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="goods_id" label="商品ID" width="120" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">{{ scope.row.category?.category_name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="shelf_status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-if="scope.row"
              :model-value="scope.row.shelf_status === 1"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="scope"><span v-if="scope.row">{{ formatDate(scope.row.create_time) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditGoods(scope.row)">
              <Edit style="margin-right: 4px" /> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteGoods(scope.row.goods_id)">
              <Delete style="margin-right: 4px" /> 删除
            </el-button>
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
    
    <!-- 商品表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增商品' : '编辑商品'"
      width="600px"
    >
      <el-form :model="goodsForm" :rules="rules" ref="goodsFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="goodsForm.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.category_id"
              :label="cat.category_name"
              :value="cat.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="goodsForm.price" :min="0" :step="0.01" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="goodsForm.stock" :min="0" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="goodsForm.description" type="textarea" placeholder="请输入商品描述" rows="4" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="goodsForm.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh, Edit } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import axios from '../../utils/request'

const loading = ref(false)
const goodsList = ref([])
const selectedGoods = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const categories = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

// 商品表单
const goodsForm = reactive({
  goods_id: '',
  name: '',
  category_id: '',
  price: 0,
  stock: 0,
  description: '',
  status: 1
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' }
  ]
}

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('create')
const goodsFormRef = ref()

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/admin/categories/list')
    categories.value = response.data?.list || []
    console.log('分类列表加载成功:', categories.value.length)
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取商品列表
const fetchGoodsList = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      keyword: searchForm.name,
      category_id: searchForm.category,
      shelf_status: searchForm.status
    }
    console.log('商品列表请求参数:', params)
    const response = await axios.get('/api/admin/goods/list', { params })
    console.log('商品列表响应:', response)
    console.log('响应的data字段:', response.data)
    console.log('data.list:', response.data?.list)
    console.log('data.pagination:', response.data?.pagination)

    if (response && response.data) {
      goodsList.value = response.data.list || []
      total.value = response.data.pagination?.total || 0
      console.log('商品列表加载成功,数量:', goodsList.value.length, '总数:', total.value)
    } else {
      console.error('响应数据格式错误:', response)
      goodsList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    goodsList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchGoodsList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  currentPage.value = 1
  fetchGoodsList()
}

// 分页
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchGoodsList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchGoodsList()
}

// 选择商品
const handleSelectionChange = (selection) => {
  selectedGoods.value = selection
}

// 新增商品
const handleCreateGoods = () => {
  dialogType.value = 'create'
  resetGoodsForm()
  dialogVisible.value = true
}

// 编辑商品
const handleEditGoods = (row) => {
  dialogType.value = 'edit'
  Object.assign(goodsForm, row)
  dialogVisible.value = true
}

// 删除商品
const handleDeleteGoods = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/api/admin/goods/delete/${id}`)
    ElMessage.success('删除成功')
    fetchGoodsList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedGoods.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedGoods.value.length}个商品吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const ids = selectedGoods.value.map(item => item.goods_id)
    await axios.delete('/api/admin/goods/batch', { data: { goods_ids: ids } })
    ElMessage.success('批量删除成功')
    fetchGoodsList()
    selectedGoods.value = []
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
    }
  }
}

// 更新状态
const handleStatusChange = async (row, newValue) => {
  const newStatus = newValue ? 1 : 0
  const oldStatus = row.shelf_status
  console.log('切换状态:', { goods_id: row.goods_id, oldStatus, newStatus })
  try {
    await axios.put(`/api/admin/goods/update/${row.goods_id}`, {
      shelf_status: newStatus
    })
    row.shelf_status = newStatus
    ElMessage.success('状态更新成功')
    console.log('状态更新成功,新状态:', newStatus)
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('状态更新失败: ' + (error.response?.data?.message || error.message))
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await goodsFormRef.value.validate()

    if (dialogType.value === 'create') {
      const data = {
        name: goodsForm.name,
        category_id: goodsForm.category_id,
        price: goodsForm.price,
        stock: goodsForm.stock,
        description: goodsForm.description,
        shelf_status: goodsForm.status
      }
      console.log('新增商品数据:', data)
      await axios.post('/api/admin/goods/create', data)
      ElMessage.success('新增成功')
    } else {
      const data = {
        name: goodsForm.name,
        category_id: goodsForm.category_id,
        price: goodsForm.price,
        stock: goodsForm.stock,
        description: goodsForm.description,
        shelf_status: goodsForm.status
      }
      console.log('更新商品数据:', data)
      await axios.put(`/api/admin/goods/update/${goodsForm.goods_id}`, data)
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    fetchGoodsList()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败: ' + (error.response?.data?.message || error.message))
  }
}

// 重置表单
const resetGoodsForm = () => {
  goodsForm.goods_id = ''
  goodsForm.name = ''
  goodsForm.category_id = ''
  goodsForm.price = 0
  goodsForm.stock = 0
  goodsForm.description = ''
  goodsForm.status = 1

  if (goodsFormRef.value) {
    goodsFormRef.value.resetFields()
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  console.log('商品页面mounted,开始加载数据...')
  fetchCategories()
  fetchGoodsList()
})
</script>

<style scoped>
.goods {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>