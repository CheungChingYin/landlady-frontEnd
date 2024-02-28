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
      <template :slot="'unit'" slot-scope="text, record">
        <a-input
          :key="unit"
          v-if="record.editable"
          :value="text"
          :placeholder="单位"
          @change="e => handleChange(e.target.value, record.key, 'unit')"/>
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
      <template :slot="'feeCycle'" slot-scope="text, record">
        <a-select
          v-if="record.editable"
          placeholder="请选择"
          style="width: 80%"
          default-value="0"
          :value="record.feeCycle"
          @change="e => handleChange(e, record.key, 'feeCycle')"
          :options="feeCycleOption">
        </a-select>
        <template v-else>{{ feeCycleOption.find(item => item.value === record.feeCycle).label }}</template>
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
    <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">
      新增
    </a-button>
  </div>
</template>

<script>

import { Ellipsis, STable } from '@/components'
import { deleteData, getList } from '@/api/contract/ContractFeeItemApi'
import AssetsSelectSearchModal from '@/views/maindata/assets/modal/AssetsSearchModal.vue'
import { getDictOption } from '@/api/system/dictItemApi'

export default {
  name: 'FeeItemTableForm',
  components: {
    AssetsSelectSearchModal,
    STable,
    Ellipsis
  },
  props: {
    headId: {
      type: String,
      default: '',
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
          width: '10%',
          scopedSlots: { customRender: 'feeName' }
        },
        {
          title: '费用周期',
          dataIndex: 'feeCycle',
          key: 'feeCycle',
          scopedSlots: { customRender: 'feeCycle' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '10%',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          width: '20%',
          scopedSlots: { customRender: 'amount' }
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
      feeCodeOption: []
    }
  },
  computed: {},
  methods: {
    async initDict () {
      this.feeCycleOption = await getDictOption('fee_cycle')
      this.feeCodeOption = await getDictOption('fee_code')
    },
    newMember () {
      const dataLength = this.data.length
      this.data.push({
        key: dataLength === 0 ? '1' : (parseInt(this.data[dataLength - 1].key) + 1).toString(),
        id: '',
        contractId: this.headId,
        feeCode: '',
        feeName: '',
        feeCycle: '',
        amount: '',
        unit: '',
        remark: '',
        editable: true,
        isNew: true
      })
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
      await getList(1, 99999, { contractId: id }).then(res => {
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
        // 如果费用编码不是其他，则费用名称为字典项
        if (column === 'feeCode' && value !== 999) {
          target.feeName = this.feeCodeOption.find(item => item.value === value).label
        }
        target[column] = value
        this.data = newData
      }
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
