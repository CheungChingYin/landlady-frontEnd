<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="() => { $emit('ok') }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="queryParam.phoneNumber" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"/>
    </a-spin>
  </a-modal>
</template>

<script>
import { notification } from 'ant-design-vue'
import { STable } from '@/components'

const columns = [
  {
    title: '昵称',
    dataIndex: 'name'
  },
  {
    title: '电话号码',
    dataIndex: 'phoneNumber'
  },
  {
    title: '邮箱地址',
    dataIndex: 'email'
  }
]

  export default {
    name: 'UserSelectSearchModal',
    components: { STable },
    props: {
      getList: {
        type: Function,
        default: null,
        required: true
      }
    },
    data () {
      this.columns = columns
      this.formLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
      return {
        title: '操作',
        visible: false,
        visibleCheck: true,
        // 查询参数
        queryParam: {},
        roleId: '',
        selectedRowKeys: [],
        selectedRows: [],
        confirmLoading: false,
        loadData: parameter => {
          this.queryParam.roleId = this.roleId
          return this.getList(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
            if (res.code !== 200) {
              notification.error({
                message: '请求列表数据失败',
                description: '请求列表数据失败,请稍后重试'
              })
              return []
            }
            return res.result
          })
        }
      }
    },
    created () {
    },
    methods: {
      // 关闭
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.queryParam = {}
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      open (record) {
        this.visible = true
        this.roleId = record.roleId
        console.log(this.roleId)
        this.$nextTick(() => {
          this.$refs.table.loadData()
        })
      }
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  }
</script>
