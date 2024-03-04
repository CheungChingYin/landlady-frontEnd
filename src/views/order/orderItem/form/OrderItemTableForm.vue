<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="memberLoading"
    >
      <template :slot="'feeName'" slot-scope="text, record">
        <a-input
          :key="feeName"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          :placeholder="费用名称"
          @change="e => handleChange(e.target.value, record.key, 'feeName')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'feeCode'" slot-scope="text, record">
        <a-select
          v-if="record.editable"
          placeholder="请选择"
          style="width: 80%"
          default-value="0"
          :value="record.feeCode"
          @change="e => handleChange(e, record.key, 'feeCode')"
          :options="feeCodeOption">
        </a-select>
        <template v-else>{{ feeCodeOption.find(item => item.value === record.feeCode).label }}</template>
      </template>
      <template :slot="'amount'" slot-scope="text, record">
        <a-input-number
          v-if="record.editable"
          size="large"
          style="width: 100%"
          :min="0"
          :value="text"
          :precision="2"
          @change="e => handleChange(e, record.key, 'amount')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'beforeReading'" slot-scope="text, record">
        <a-input-number
          v-if="record.editable"
          size="large"
          style="width: 100%"
          :min="0"
          :value="text"
          :precision="2"
          @change="e => handleChange(e, record.key, 'beforeReading')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'currentReading'" slot-scope="text, record">
        <a-input-number
          v-if="record.editable"
          size="large"
          style="width: 100%"
          :min="0"
          :value="text"
          :precision="2"
          @change="e => handleChange(e, record.key, 'currentReading')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'remark'" slot-scope="text, record">
        <a-textarea
          v-if="record.editable"
          @change="e => handleChange(e.target.value, record.key, 'remark')"
          :value="text"/>
        <template v-else>
          <ellipsis :length="20" tooltip>
            {{ text }}
          </ellipsis>
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <template v-if="record.editable">
          <span v-if="record.isNew">
            <a @click="saveRow(record)">添加</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="saveRow(record)">保存</a>
            <a-divider type="vertical"/>
            <a @click="cancel(record.key)">取消</a>
          </span>
        </template>
        <span v-else>
          <a @click="toggle(record.key)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="addItem">
      新增
    </a-button>

    <ContractFeeItemSelectSearchModal
      ref="contractFeeItemSelectSearchModal"
      @ok="handleContractFeeItemOk"
      :contract-id="headId"
      :getList="getContractFeeItemList"/>
  </div>
</template>

<script>

import { Ellipsis, STable } from '@/components'
import { getList as getContractFeeItemList } from '@/api/contract/ContractFeeItemApi'
import { calculateFeeAmount, getList, deleteData } from '@/api/order/OrderItemApi'
import AssetsSelectSearchModal from '@/views/maindata/assets/modal/AssetsSearchModal.vue'
import { getDictOption } from '@/api/system/dictItemApi'
import ContractFeeItemSelectSearchModal from '@/views/maindata/feeItem/modal/ContractFeeItemSearchModal.vue'

export default {
  name: 'ContractItemTableForm',
  components: {
    ContractFeeItemSelectSearchModal,
    AssetsSelectSearchModal,
    STable,
    Ellipsis
  },
  props: {
    headId: {
      type: String,
      default: '',
      required: true
    },
    headFormParams: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      memberLoading: false,
      isMobile: false,
      // table
      columns: [
        {
          title: '费用编码',
          dataIndex: 'feeCode',
          key: 'feeCode',
          width: '20%',
          scopedSlots: { customRender: 'feeCode' }
        },
        {
          title: '费用名称',
          dataIndex: 'feeName',
          key: 'feeName',
          width: '',
          scopedSlots: { customRender: 'feeName' }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          width: '10%',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '上期读数',
          dataIndex: 'beforeReading',
          key: 'beforeReading',
          width: '10%',
          scopedSlots: { customRender: 'beforeReading' }
        },
        {
          title: '当期读数',
          dataIndex: 'currentReading',
          key: 'currentReading',
          width: '10%',
          scopedSlots: { customRender: 'currentReading' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '20%',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      feeCycleOption: [],
      feeCodeOption: [],
      getContractFeeItemList: getContractFeeItemList
    }
  },
  computed: {},
  methods: {
    async initDict () {
      this.feeCycleOption = await getDictOption('fee_cycle')
      this.feeCodeOption = await getDictOption('fee_code')
    },
    addItem () {
      if (this.headFormParams.contractId === undefined || this.headFormParams.contractId === '') {
        this.$message.error('请先选择合同')
        return
      }
      if (this.headFormParams.orderType === undefined || this.headFormParams.orderType === '') {
        this.$message.error('请先选择订单类型')
        return
      }
      if (this.headFormParams.orderType === 999) {
        this.newMember({})
      } else {
        const params = { 'contractId': this.headFormParams.contractId }
        this.$refs.contractFeeItemSelectSearchModal.open(params)
      }
    },
    newMember (record) {
      const dataLength = this.data.length
      let rowData = {
        key: dataLength === 0 ? '1' : (parseInt(this.data[dataLength - 1].key) + 1).toString(),
        id: '',
        orderId: this.headId,
        contractFeeItemId: '',
        beforeReadingId: '',
        currentReadingId: '',
        feeCode: '',
        feeName: '',
        amount: '',
        beforeReading: '',
        currentReading: '',
        remark: '',
        editable: true,
        isNew: true
      }
      if (record) {
        rowData = Object.assign(rowData, record)
      }
      this.data.push(rowData)
    },
    remove (record) {
      const newData = this.data.filter(item => item.key !== record.key)
      if (record.id !== '') {
        deleteData(record.id).then(res => {
          if (res.code !== 200) {
            this.$message.error(res.message)
            return
          }
          this.$message.success(res.message)
        })
      }
      this.data = newData
    },
    saveRow (record) {
      this.memberLoading = true
      const target = this.data.find(item => item.key === record.key)
      target.isNew = false
      target.editable = false
      this.memberLoading = false
    },
    toggle (key) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    async loadData (id) {
      this.memberLoading = true
      await getList(1, 99999, { orderId: id }).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        const recordList = res.result.records
        let key = 0
        // 设置为编辑数据
        recordList.forEach(item => {
          item.key = key++
          item.editable = false
        })
        this.data = recordList
      })
      this.memberLoading = false
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).find(item => item.key === key)
    },
    cancel (key) {
      const target = this.data.find(item => item.key === key)
      Object.keys(target).forEach(key => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handleContractFeeItemOk () {
      const selectedRows = this.$refs.contractFeeItemSelectSearchModal.selectedRows
      if (selectedRows.length === 0) {
        this.$message.error('请选择费用项')
        return
      }
      selectedRows.forEach(item => {
        item.roomId = this.headFormParams.roomId
        item.contractFeeItemId = item.id
        item.orderYear = this.headFormParams.orderYear
        item.orderMonth = this.headFormParams.orderMonth
      })
      calculateFeeAmount(selectedRows).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        res.result.forEach(item => {
          item.editable = false
          this.newMember(item)
        })
      })
      this.$refs.contractFeeItemSelectSearchModal.close()
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
