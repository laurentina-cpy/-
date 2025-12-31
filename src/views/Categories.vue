<template>
  <div class="categories">
    <div class="page-header">
      <h2>分类管理</h2>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleCreate"><Plus /> 新增分类</el-button>
    </div>
    
    <!-- 分类表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="categoriesList"
        stripe
        border
        style="width: 100%"
        row-key="category_id"
      >
        <el-table-column prop="category_id" label="分类ID" width="100" />
        <el-table-column prop="category_name" label="分类名称" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="sort_order" label="排序" width="100" />
        <el-table-column prop="goods_count" label="商品数量" width="100" />
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <Edit style="margin-right: 4px" /> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.category_id)">
              <Delete style="margin-right: 4px" /> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分类表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增分类' : '编辑分类'"
      width="500px"
    >
      <el-form :model="categoryForm" :rules="rules" ref="categoryFormRef" label-width="100px">
        <el-form-item label="分类ID" prop="category_id" v-if="dialogType === 'edit'">
          <el-input v-model="categoryForm.category_id" />
        </el-form-item>
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="categoryForm.category_name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="categoryForm.description" type="textarea" placeholder="请输入分类描述" rows="4" />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="categoryForm.sort_order" :min="0" placeholder="请输入排序值" />
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import axios from '../utils/request'

const loading = ref(false)
const categoriesList = ref([])

// 分类表单
const categoryForm = reactive({
  category_id: '',
  category_name: '',
  description: '',
  sort_order: 0
})

// 表单规则
const rules = {
  category_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
}

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('create')
const categoryFormRef = ref()

// 获取分类列表
const fetchCategoriesList = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/admin/categories/list')
    const data = response.data.code === 200 ? response.data.data : response.data
    categoriesList.value = data.list || data.rows || []
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

// 新增分类
const handleCreate = () => {
  dialogType.value = 'create'
  resetCategoryForm()
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  dialogType.value = 'edit'
  categoryForm.category_id = row.category_id
  categoryForm.category_name = row.category_name
  categoryForm.description = row.description || ''
  categoryForm.sort_order = row.sort_order || 0
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/api/admin/categories/delete/${id}`)
    ElMessage.success('删除成功')
    fetchCategoriesList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
      ElMessage.error('删除分类失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await categoryFormRef.value.validate()

    if (dialogType.value === 'create') {
      await axios.post('/api/admin/categories/create', categoryForm)
      ElMessage.success('新增成功')
    } else {
      const updateData = {
        category_name: categoryForm.category_name,
        description: categoryForm.description,
        sort_order: categoryForm.sort_order
      }
      await axios.put(`/api/admin/categories/update/${categoryForm.category_id}`, updateData)
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    fetchCategoriesList()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败: ' + (error.response?.data?.message || error.message))
  }
}

// 重置表单
const resetCategoryForm = () => {
  categoryForm.category_id = ''
  categoryForm.category_name = ''
  categoryForm.description = ''
  categoryForm.sort_order = 0
  
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields()
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  fetchCategoriesList()
})
</script>

<style scoped>
.categories {
  width: 100%;
}
</style>
