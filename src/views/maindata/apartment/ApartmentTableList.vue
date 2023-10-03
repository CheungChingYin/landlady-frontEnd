<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="公寓编号">
                <a-input v-model="queryParam.apartmentNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="公寓名称">
                <a-input v-model="queryParam.apartmentName" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所有权人名称">
                  <a-input v-model="queryParam.ownerName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="所有权人身份证号">
                  <a-input v-model="queryParam.ownerName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="省市区（县）">
                  <Cascader
                    :options="areaOptions"
                    :load-data="loadAreaData"
                    placeholder="请选择省市区（县）"
                    change-on-select
                    @change="cascadeOnChange"
                    v-model="queryParam.areaCascader"
                  />
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
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { getList, deleteData } from '@/api/maindata/ApartmentApi'
import { notification, Cascader } from 'ant-design-vue'
import { getTreeDataOptionByCode, getTreeDataOptionById } from '@/api/system/categoryApi'

const columns = [
  {
    title: '公寓编号',
    dataIndex: 'apartmentNumber'
  },
  {
    title: '公寓名称',
    dataIndex: 'apartmentName'
  },
  {
    title: '省份',
    dataIndex: 'provinceId_dictText'
  },
  {
    title: '城市',
    dataIndex: 'cityId_dictText'
  },
  {
    title: '区县',
    dataIndex: 'areaId_dictText'
  },
  {
    title: '公寓地址',
    dataIndex: 'apartmentAddress',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '占地面积',
    dataIndex: 'apartmentArea'
  },
  {
    title: '房屋高度',
    dataIndex: 'apartmentHeight'
  },
  {
    title: '房屋竣工日期',
    width: '150px',
    dataIndex: 'apartmentCompletionDate'
  },
  {
    title: '所有权人名称',
    dataIndex: 'ownerName'
  },
  {
    title: '所有权人身份证号码',
    dataIndex: 'ownerIdNumber'
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
  name: 'ApartmentTableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    Cascader
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
      // 是否冻结选项
      isFreezeOption: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(this.queryParam.areaCascader)
        if (this.queryParam.areaCascader) {
          const cascadeOption = this.queryParam.areaCascader
          // 移除查询条件中的级联数组，避免接口报错
          delete this.queryParam.areaCascader
          if (cascadeOption[0]) {
            this.queryParam.provinceId = cascadeOption[0]
          }
          if (cascadeOption[1]) {
            this.queryParam.cityId = cascadeOption[1]
          }
          if (cascadeOption[2]) {
            this.queryParam.areaId = cascadeOption[2]
          }
        }
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
      selectedRows: [],
      areaOptions: [],
      loadAreaData: selectOption => {
        this.loadCategory(selectOption)
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
      // 查询表单区域选项
      this.areaOptions = await getTreeDataOptionByCode('area_code')
    },
    /**
     * 加载级联数据
     * @param selectOption 级联数据对象
     * @returns {Promise<void>}
     */
    async loadCategory (selectOption) {
      const targetOption = selectOption[selectOption.length - 1]
      targetOption.loading = true
      targetOption.children = await getTreeDataOptionById(targetOption.value)
      this.areaOptions = [...this.areaOptions]
      targetOption.loading = false
    },
    handleAdd () {
      this.$router.push({ name: 'userForm' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'userForm', params: record })
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
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    cascadeOnChange (value) {
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
