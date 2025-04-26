<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="公寓编号">
                <a-input style="width: 65%; margin-right: 5%" v-model="queryParam.apartmentId" v-show="false" />
                <a-input style="width: 65%; margin-right: 5%" v-model="queryParam.apartmentNumber" disabled="" />
                <a-button type="primary" @click="openApartSelectModel">选择</a-button>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="房间编号">
                <a-input
                  style="width: 65%; margin-right: 5%"
                  v-model="queryParam.roomId"
                  placeholder=""
                  v-show="false"
                />
                <a-input
                  style="width: 65%; margin-right: 5%"
                  v-model="queryParam.roomNumber"
                  placeholder=""
                  disabled=""
                />
                <a-button type="primary" @click="openRoomSelectModel">选择</a-button>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="读数类型">
                  <a-select
                    v-model="queryParam.readingType"
                    placeholder="请选择"
                    default-value=""
                    :options="readingTypeOption"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="读数年份">
                  <a-input v-model="queryParam.readingYear" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="读数月份">
                  <a-input v-model="queryParam.readingMonth" placeholder="" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button icon="download" @click="downloadExcelTemplate">下载导入Excel模板</a-button>
        <a-upload
          name="file"
          :multiple="true"
          action="/api/maindata/roomReadingRecord/importRoomReadingRecordExcel"
          :showUploadList="false"
          :headers="headers"
          accept=".xlsx"
          @change="handleUploadChange"
        >
          <a-button icon="upload">导入房间读数Excel数据</a-button>
        </a-upload>
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
        <span slot="remark" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleShowDetail(record)">查看</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认是否删除？" ok-text="是" cancel-text="否" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
      <ApartmentSelectSearchModal
        ref="apartmentSelectModalRef"
        @ok="apartmentSelectModalOk"
        :get-list="getApartList"
      ></ApartmentSelectSearchModal>
      <RoomSelectSearchModal ref="roomSelectSearchModal" @ok="roomSelectModalOk" :get-list="getRoomList" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import { getList, deleteData, downloadRoomReadingRecordExcelTemplate } from '@/api/maindata/RoomReadingRecordApi'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import { notification } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal'
import RoomSelectSearchModal from '@/views/maindata/apartment/modal/RoomSearchModal.vue'
import { getList as getRoomList } from '@/api/maindata/RoomMainDataApi'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const columns = [
  {
    title: '公寓编号',
    dataIndex: 'apartmentId_dictText'
  },
  {
    title: '房间编号',
    dataIndex: 'roomId_dictText'
  },
  {
    title: '读数类型',
    dataIndex: 'readingType_dictText'
  },
  {
    title: '读数年份',
    dataIndex: 'readingYear'
  },
  {
    title: '读数月份',
    dataIndex: 'readingMonth'
  },
  {
    title: '读数',
    dataIndex: 'reading'
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
    title: '记录人',
    dataIndex: 'createBy_dictText',
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
  name: 'RoomReadingRecordTableList',
  components: {
    RoomSelectSearchModal,
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
        apartmentNumber: '',
        roomNumber: ''
      },
      // 读数类型选项
      readingTypeOption: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getList(parameter.pageNo, parameter.pageSize, this.queryParam).then((res) => {
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
      getApartList: getApartmentList,
      getRoomList: getRoomList,
      headers: {
        Authorization: storage.get(ACCESS_TOKEN)
      }
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
    async initDict () {
      this.readingTypeOption = await getDictOption('reading_type')
    },
    handleAdd () {
      this.$router.push({ name: 'roomReadingRecordAdvancedForm' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'roomReadingRecordAdvancedForm', params: record })
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'roomReadingRecordDetail', params: record })
    },
    handleDelete (record) {
      deleteData(record.id).then((res) => {
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
    cascadeOnChange (value) {},
    openApartSelectModel () {
      this.$refs.apartmentSelectModalRef.open()
    },
    apartmentSelectModalOk () {
      const selectedRows = this.$refs.apartmentSelectModalRef.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      this.queryParam.apartmentId = selectedRows[0].id
      this.queryParam.apartmentNumber = selectedRows[0].apartmentNumber
      console.log(this.queryParam)
      this.$refs.apartmentSelectModalRef.close()
    },
    openRoomSelectModel () {
      this.$refs.roomSelectSearchModal.open({ apartmentId: this.queryParam.apartmentId })
    },
    roomSelectModalOk () {
      const selectedRows = this.$refs.roomSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      this.queryParam.roomId = selectedRows[0].id
      this.queryParam.roomNumber = selectedRows[0].roomNumber
      this.$refs.roomSelectSearchModal.close()
    },
    downloadExcelTemplate () {
      downloadRoomReadingRecordExcelTemplate()
    },
    handleUploadChange (info) {
      if (info.file.response) {
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.message)
        } else {
          this.$message.success('导入成功')
          this.$refs.table.loadData()
        }
      }
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
