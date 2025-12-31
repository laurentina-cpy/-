<template>
  <div class="suppliers">
    <div class="page-header">
      <h2>供应商管理</h2>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleCreate"><Plus /> 新增供应商</el-button>
    </div>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="供应商名称">
          <el-input v-model="searchForm.name" placeholder="请输入供应商名称" clearable />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="searchForm.contact" placeholder="请输入联系方式" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><Search /> 搜索</el-button>
          <el-button @click="handleReset"><Refresh /> 重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 供应商表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="suppliersList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="supplier_id" label="供应商ID" width="100" />
        <el-table-column prop="name" label="供应商名称" width="200" />
        <el-table-column prop="contact" label="联系方式" width="150" />
        <el-table-column prop="license_number" label="许可证编号" width="180" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-if="scope.row"
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <Edit style="margin-right: 4px" /> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.supplier_id)">
              <Delete style="margin-right: 4px" /> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 供应商表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增供应商' : '编辑供应商'"
      width="600px"
    >
      <el-form :model="supplierForm" :rules="rules" ref="supplierFormRef" label-width="100px">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="supplierForm.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="supplierForm.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="许可证编号" prop="license_number">
          <el-input v-model="supplierForm.license_number" placeholder="请输入食品经营许可证编号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="supplierForm.address" type="textarea" placeholder="请输入地址" rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="supplierForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
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
import axios from '../utils/request'

const loading = ref(false)
const suppliersList = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  contact: ''
})

// 供应商表单
const supplierForm = reactive({
  supplier_id: '',
  name: '',
  contact: '',
  license_number: '',
  license_image: '',
  address: '',
  status: '1'
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ],
  license_number: [
    { required: true, message: '请输入许可证编号', trigger: 'blur' }
  ]
}

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('create')
const supplierFormRef = ref()

// 获取供应商列表
const fetchSuppliersList = async () => {
  try {
    loading.value = true
    const params = { ...searchForm }
    const response = await axios.get('/api/admin/suppliers/list', { params })
    const data = response.data.code === 200 ? response.data.data : response.data
    suppliersList.value = (data.list || []).map(item => ({
      ...item,
      status: String(item.status)
    }))
  } catch (error) {
    console.error('获取供应商列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchSuppliersList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  fetchSuppliersList()
}

// 新增供应商
const handleCreate = () => {
  dialogType.value = 'create'
  resetSupplierForm()
  dialogVisible.value = true
}

// 编辑供应商
const handleEdit = (row) => {
  dialogType.value = 'edit'
  supplierForm.supplier_id = row.supplier_id
  supplierForm.name = row.name
  supplierForm.contact = row.contact
  supplierForm.license_number = row.license_number
  supplierForm.license_image = row.license_image || ''
  supplierForm.address = row.address || ''
  supplierForm.status = String(row.status)
  dialogVisible.value = true
}

// 删除供应商
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该供应商吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/api/admin/suppliers/delete/${id}`)
    ElMessage.success('删除成功')
    fetchSuppliersList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除供应商失败:', error)
      ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 更新状态
const handleStatusChange = async (row) => {
  const oldStatus = row.status
  try {
    await axios.patch(`/api/admin/suppliers/status/${row.supplier_id}`, {
      status: row.status
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败: ' + (error.response?.data?.message || error.message))
    row.status = oldStatus === '1' ? '0' : '1'
    console.error('更新状态失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await supplierFormRef.value.validate()

    if (dialogType.value === 'create') {
      await axios.post('/api/admin/suppliers/create', supplierForm)
      ElMessage.success('新增成功')
    } else {
      const updateData = {
        name: supplierForm.name,
        contact: supplierForm.contact,
        license_number: supplierForm.license_number,
        license_image: supplierForm.license_image,
        address: supplierForm.address,
        status: supplierForm.status
      }
      await axios.put(`/api/admin/suppliers/update/${supplierForm.supplier_id}`, updateData)
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    fetchSuppliersList()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败: ' + (error.response?.data?.message || error.message))
  }
}

// 重置表单
const resetSupplierForm = () => {
  supplierForm.supplier_id = ''
  supplierForm.name = ''
  supplierForm.contact = ''
  supplierForm.license_number = ''
  supplierForm.license_image = ''
  supplierForm.address = ''
  supplierForm.status = '1'

  if (supplierFormRef.value) {
    supplierFormRef.value.resetFields()
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  fetchSuppliersList()
})
</script>

<style scoped>
.suppliers {
  width: 100%;
}
</style>
