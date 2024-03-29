<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="合同编号">
                <a-input style="width: 65%;margin-right: 5%" v-model="queryParam.contractNumber"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称">
                <a-input v-model="queryParam.contractName" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="租赁人名称">
                  <a-input v-model="queryParam.renterName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="公寓名称">
                  <a-input v-model="queryParam.apartmentName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="房间名称">
                  <a-input v-model="queryParam.roomNumber" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="合同状态">
                  <a-select
                    v-model="queryParam.contractStatus"
                    placeholder="请选择"
                    default-value=""
                    :options="contractStatusOption">
                  </a-select>
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
        <span slot="apartNumberSlot" slot-scope="text, record">
          <a @click="apartmentNumberEvent(record)">{{ text }}</a>
        </span>
        <span slot="contractStatusSlot" slot-scope="text, record">
          <a-badge v-if="record.contractStatus === 0" status="default" :text="text"/>
          <a-badge v-else-if="record.contractStatus === 1" status="success" :text="text"/>
          <a-badge v-else status="error" :text="text"/>
        </span>
        <span slot="remark" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleShowDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
      <ApartmentSelectSearchModal
        ref="userSelectSearchModal"
        @ok="apartmentSelectModalOk"
        :get-list="getApartList"
      ></ApartmentSelectSearchModal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import { getListForRenter, deleteData } from '@/api/contract/ContractHeadApi'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import { notification } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal'

const columns = [
  {
    title: '合同编号',
    dataIndex: 'contractNumber'
  },
  {
    title: '合同名称',
    dataIndex: 'contractName'
  },
  {
    title: '公寓名称',
    dataIndex: 'apartmentName'
  },
  {
    title: '房间名称',
    dataIndex: 'roomNumber'
  },
  {
    title: '租户名字',
    dataIndex: 'renterName'
  },
  {
    title: '租赁开始时间',
    dataIndex: 'rentStartDate'
  },
  {
    title: '租赁结束时间',
    dataIndex: 'rentEndDate'
  },
  {
    title: '每月收款日',
    dataIndex: 'receiptDate'
  },
  {
    title: '合同状态',
    dataIndex: 'contractStatus_dictText',
    scopedSlots: { customRender: 'contractStatusSlot' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   sorter: true
  // },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'RenterContractTableList',
  components: {
    ApartmentSelectSearchModal,
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
      currentUser: {},
      // 合同状态选项
      contractStatusOption: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getListForRenter(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
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
      getApartList: getApartmentList
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
      this.contractStatusOption = await getDictOption('contract_status')
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'renterContractDetail', params: record })
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
    apartmentNumberEvent (record) {
      this.$router.push({ name: 'apartmentFormDetail', params: { id: record.apartmentId } })
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
    },
    apartmentSelectModalOk () {
      const selectedRows = this.$refs.userSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      this.queryParam.apartmentId = selectedRows[0].id
      this.queryParam.apartmentNumber = selectedRows[0].apartmentNumber
      console.log(this.queryParam)
      this.$refs.userSelectSearchModal.close()
    },
    openRenterModal () {
      this.$refs.userSelectSearchModal.open({})
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
