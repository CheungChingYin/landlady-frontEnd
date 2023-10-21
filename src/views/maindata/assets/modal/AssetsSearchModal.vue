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
            <a-form-item label="资产编号">
              <a-input v-model="queryParam.assetsNumber" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="资产名称">
              <a-input v-model="queryParam.assetsName" placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="资产描述">
                <a-input v-model="queryParam.assetsDesc" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="SKU编号">
                <a-input v-model="queryParam.skuNumber" placeholder=""/>
              </a-form-item>
            </a-col>
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
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto">
        <template :slot="'longText'" slot-scope="text">
          <ellipsis :length="20" tooltip>
            {{ text }}
          </ellipsis>
        </template>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { notification } from 'ant-design-vue'
import { Ellipsis, STable } from '@/components'

const columns = [
  {
    title: '资产编号',
    dataIndex: 'assetsNumber'
  },
  {
    title: '资产名称',
    dataIndex: 'assetsName'
  },
  {
    title: '资产描述',
    dataIndex: 'assetsDesc',
    scopedSlots: { customRender: 'longText' }
  },
  {
    title: 'SKU编号',
    dataIndex: 'skuNumber'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  }
]

  export default {
    name: 'AssetsSelectSearchModal',
    components: { Ellipsis, STable },
    props: {
      getList: {
        type: Function,
        default: null,
        required: true
      }
    },
    data () {
      this.columns = columns
      return {
        title: '资产选择',
        visible: false,
        // 高级搜索 展开/关闭
        advanced: false,
        visibleCheck: true,
        // 查询参数
        queryParam: {},
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
      async initDict () {},
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
