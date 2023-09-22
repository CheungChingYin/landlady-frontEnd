<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="字典名称">
                <a-input v-model="queryParam.dictName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="字典编码">
                <a-input v-model="queryParam.dictCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="字典描述">
                  <a-input v-model="queryParam.description" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleShowDetail(record)">字典配置</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认是否删除？" ok-text="是" cancel-text="否" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
      <DictFormModal
        ref="dictModalRef"
        :visible="visible"
        :loading="confirmLoading"
        :rowData="rowData"
        @cancel="handleCancel"
        @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { getList, deleteData, addData, editData } from '@/api/system/dictApi'
import { notification } from 'ant-design-vue'
import DictFormModal from '@/views/system/dict/DictFormModal'

const columns = [
  {
    title: '字典名称',
    dataIndex: 'dictName'
  },
  {
    title: '字典编码',
    dataIndex: 'dictCode'
  },
  {
    title: '字典描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'UserTableList',
  components: {
    DictFormModal,
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      rowData: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getList(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
            return []
          }
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {},
  created () {},
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    async initDict () {},
    handleAdd () {
      this.visible = true
      this.rowData = null
      this.$refs.dictModalRef.dialogTitle = '新建字典'
    },
    handleEdit (record) {
      this.visible = true
      this.rowData = record
      this.$refs.dictModalRef.dialogTitle = '修改字典'
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'userFormDetail', params: record })
    },
    handleDelete (record) {
      deleteData(record.id).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
          } else {
            notification.success({
              message: '删除成功'
            })
          }
        this.$refs.table.loadData()
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.dictModalRef.$refs.dictFormRef.form
      // 清理表单数据
      form.resetFields()
    },
    handleOk () {
      const form = this.$refs.dictModalRef.$refs.dictFormRef.form
      form.validateFields((err, values) => {
        if (!err) {
          // 新增字典
          if (this.rowData == null) {
            addData(values).then(res => this.addOrUpdateResultHandler(res, true))
          } else {
            // 修改字典
            editData(values).then(res => this.addOrUpdateResultHandler(res, false))
          }
        }
      })
    },
    addOrUpdateResultHandler (res, isAdd) {
      const form = this.$refs.dictModalRef.$refs.dictFormRef.form
      const text = isAdd ? '保存' : '修改'
      if (res.code !== 200) {
        notification.error({
          message: text + '失败',
          description: res.message
        })
      } else {
        notification.success({
          message: text + '成功'
        })
        this.visible = false
        // 刷新列表
        this.$refs.table.loadData()
        // 清理表单数据
        form.resetFields()
      }
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
