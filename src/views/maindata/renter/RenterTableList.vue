<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="身份证号码">
                <a-input v-model="queryParam.idNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="性别">
                  <a-select v-model="queryParam.gender" placeholder="请选择" default-value="" :options="genderOption"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="地址">
                  <a-input v-model="queryParam.address" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
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
        <span slot="isFreezeSlot" slot-scope="text, record">
          <a-badge v-if="record.isFreeze === 1" status="error" :text="text" />
          <a-badge v-else status="success" :text="text" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a @click="handleShowDetail(record)">查看</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确认是否删除？" ok-text="是" cancel-text="否" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getList, deleteData } from '@/api/maindata/RenterMainDataApi'
import { notification } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'

const columns = [
  {
    title: '姓名',
    width: '200px',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'gender_dictText'
  },
  {
    title: '民族',
    dataIndex: 'nation'
  },
  {
    title: '出生日期',
    width: 150,
    dataIndex: 'birthday'
  },
  {
    title: '地址',
    dataIndex: 'address',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '身份证号',
    dataIndex: 'idNumber'
  },
  {
    title: '身份证生效日期',
    dataIndex: 'effectiveDate'
  },
  {
    title: '身份证失效日期',
    dataIndex: 'expireDate'
  },
  {
    title: '备注',
    dataIndex: 'remark',
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
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'RenterTableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 性别选项
      genderOption: [],
      selectedRowKeys: [],
      selectedRows: [],
      areaOptions: [],
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
      }
    }
  },
  filters: {},
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    async initDict () {
      // 是否冻结选项
      this.genderOption = await getDictOption('sex')
    },
    handleAdd () {
      this.$router.push({ name: 'renterAdvancedForm' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'assetAdvancedForm', params: record })
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'assetsMainDataDetail', params: record })
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
    resetSearchForm () {
      this.queryParam = {
      }
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
