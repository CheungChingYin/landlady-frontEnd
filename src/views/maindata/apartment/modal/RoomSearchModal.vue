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
            <a-form-item label="房间编号">
              <a-input v-model="queryParam.apartmentNumber" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="房间编号">
              <a-input v-model="queryParam.roomNumber" placeholder="请输入房间编号"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
          </template>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
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
    title: '房间编号',
    dataIndex: 'roomNumber'
  },
  {
    title: '房间面积',
    dataIndex: 'roomArea'
  }
]

  export default {
    name: 'RoomSelectSearchModal',
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
        title: '房间选择',
        visible: false,
        // 高级搜索 展开/关闭
        advanced: false,
        visibleCheck: true,
        // 查询参数
        queryParam: {},
        loadAreaData: selectOption => {
          this.loadCategory(selectOption)
        },
        selectedRowKeys: [],
        selectedRows: [],
        confirmLoading: false,
        loadData: parameter => {
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
      async initDict () {
      },
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
      /**
       * 加载级联数据
       * @param selectOption 级联数据对象
       * @returns {Promise<void>}
       */
      async loadCategory (selectOption) {
        const targetOption = selectOption[selectOption.length - 1]
        targetOption.loading = true
        targetOption.loading = false
      },
      open (params) {
        this.visible = true
        this.queryParam = Object.assign(this.queryParam, params)
        this.$nextTick(() => {
          this.$refs.table.loadData()
        })
        this.initDict()
      },
      cascadeOnChange (value) {},
      toggleAdvanced () {
        this.advanced = !this.advanced
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
