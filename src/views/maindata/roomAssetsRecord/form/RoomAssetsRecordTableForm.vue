<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="memberLoading"
    >
      <template :slot="'quantity'" slot-scope="text, record">
        <a-input-number
          v-if="record.editable"
          size="large"
          :min="0"
          :value="text"
          :precision="0"
          @change="e => handleChange(e, record.key, 'quantity')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'price'" slot-scope="text, record">
        <a-input-number
          v-if="record.editable"
          size="large"
          :min="0"
          :value="text"
          :precision="2"
          @change="e => handleChange(e, record.key, 'price')"/>
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
    <assets-select-search-modal
      ref="assetsSelectSearchModal"
      :get-list="getAssetsList"
      @ok="assetsSelectModalOk"/>
  </div>
</template>

<script>

import { Ellipsis, STable } from '@/components'
import { deleteData, getUnionList } from '@/api/maindata/RoomAssetsRecordApi'
import { getList as getAssetsList } from '@/api/maindata/AssetsMainDataApi'
import AssetsSelectSearchModal from '@/views/maindata/assets/modal/AssetsSearchModal.vue'

export default {
  name: 'RoomAssetsRecordTableForm',
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
          title: '资产编号',
          dataIndex: 'assetsNumber',
          key: 'assetsNumber',
          width: '20%'
        },
        {
          title: '资产名称',
          dataIndex: 'assetsName',
          key: 'assetsName',
          width: '10%'
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          key: 'quantity',
          scopedSlots: { customRender: 'quantity' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' }
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
      getAssetsList: getAssetsList
    }
  },
  computed: {},
  methods: {
    async initDict () {},
    newMember () {
      if (this.headId === '') {
        this.$message.error('请保存表单后后再进行新增操作')
        return
      }
      this.$refs.assetsSelectSearchModal.open({ isFreeze: 0 })
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
      const data = Object.assign({}, record)
      // 校验
      if (this.checkAssetsIsExist(data.key, data.assetsId)) {
        this.$message.error('资产已存在')
        return
      }
      this.memberLoading = true
      const target = this.data.find(item => item.key === record.key)
      target.isNew = false
      target.editable = false
      this.memberLoading = false
    },
    checkAssetsIsExist (key, assetsId) {
      return this.data.find(item => item.assetsId === assetsId && item.key !== key) !== undefined
    },
    toggle (key) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    async loadData (id) {
      this.memberLoading = true
      await getUnionList(1, 99999, { roomId: id }).then(res => {
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
    assetsSelectModalOk () {
      const selectedRows = this.$refs.assetsSelectSearchModal.selectedRows
      if (selectedRows.length === 0) {
        this.$message.error('请选择一条数据')
        return
      }
      console.log(selectedRows)
      selectedRows.forEach(row => {
        const dataLength = this.data.length
        this.data.push({
          key: dataLength === 0 ? '1' : (parseInt(this.data[dataLength - 1].key) + 1).toString(),
          id: '',
          roomId: this.headId,
          assetsId: row.id,
          assetsNumber: row.assetsNumber,
          assetsName: row.assetsName,
          unit: row.unit,
          quantity: 0,
          price: 0,
          remark: '',
          editable: true,
          isNew: true
        })
      })
      this.$refs.assetsSelectSearchModal.close()
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
