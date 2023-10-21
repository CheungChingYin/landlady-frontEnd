<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="公寓编号">
                <a-input style="width: 65%;margin-right: 5%" v-model="queryParam.apartmentNumber" placeholder="" disabled/>
                <a-button type="primary" @click="openModal">选择</a-button>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="房间编号">
                <a-input v-model="queryParam.roomNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="房间状态">
                  <a-select
                    v-model="queryParam.roomStatus"
                    placeholder="请选择"
                    default-value=""
                    :options="roomStatusOption">
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
        <span slot="apartNumberSlot" slot-scope="text, record">
          <a @click="apartmentNumberEvent(record)">{{ text }}</a>
        </span>
        <span slot="roomStatusSlot" slot-scope="text, record">
          <a-badge v-if="record.roomStatus === 1" status="success" :text="text" />
          <a-badge v-else status="warning" :text="text" />
        </span>
        <span slot="remark" slot-scope="text">
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

import { getList, deleteData } from '@/api/maindata/RoomMainDataApi'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import { notification } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal'

const columns = [
  {
    title: '房间编号',
    dataIndex: 'roomNumber'
  },
  {
    title: '公寓编号',
    dataIndex: 'apartmentId_dictText',
    scopedSlots: { customRender: 'apartNumberSlot' }
  },
  {
    title: '房间面积',
    dataIndex: 'roomArea'
  },
  {
    title: '房间状态',
    dataIndex: 'roomStatus_dictText',
    scopedSlots: { customRender: 'roomStatusSlot' }
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
      queryParam: {
        apartmentNumber: ''
      },
      // 是否冻结选项
      roomStatusOption: [],
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
      this.roomStatusOption = await getDictOption('room_status')
    },
    handleAdd () {
      this.$router.push({ name: 'roomAdvancedForm' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'roomAdvancedForm', params: record })
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'roomDetail', params: record })
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
    openModal () {
      this.$refs.userSelectSearchModal.open({})
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
