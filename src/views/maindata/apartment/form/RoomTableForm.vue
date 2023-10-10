<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="memberLoading"
    >
      <template v-for="(item, i) in ['roomNumber']" :slot="item" slot-scope="text, record">
        <a-input
          :key="item"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          :placeholder="columns[i].title"
          @change="e => handleChange(e.target.value, record.key, item)"
        />
        <template v-else>{{ text }}</template>
      </template>
      <template v-for="(col, i) in ['roomArea']" :slot="col" slot-scope="text, record">
        <a-input-number
          :key="col"
          v-if="record.editable"
          size="large"
          :min="0"
          :value="text"
          :precision="2"
          @change="e => handleChange(e, record.key, col)"
          :formatter="value => `${value}m²`"
          :parser="value => value.replace('m²', '')"/>
        <template v-else>{{ text }}</template>
      </template>
      <template :slot="'roomStatus'" slot-scope="text, record">
        <a-select
          v-if="record.editable"
          placeholder="请选择"
          style="width: 80%"
          default-value="0"
          :value="record.roomStatus"
          @change="e => handleChange(e, record.key, 'roomStatus')"
          :options="roomStatusOption">
        </a-select>
        <template v-else>{{ record.roomStatus__dictText }}</template>
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
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
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
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
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

import { getDictOption } from '@/api/system/dictItemApi'
import { Ellipsis } from '@/components'

export default {
  name: 'RoomTableForm',
  components: {
    Ellipsis
  },
  props: {
    headId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      memberLoading: false,
      isMobile: false,
      roomStatusOption: [],
      // table
      columns: [
        {
          title: '房间编号',
          dataIndex: 'roomNumber',
          key: 'roomNumber',
          width: '20%',
          scopedSlots: { customRender: 'roomNumber' }
        },
        {
          title: '房间面积',
          dataIndex: 'roomArea',
          key: 'roomArea',
          width: '20%',
          scopedSlots: { customRender: 'roomArea' }
        },
        {
          title: '房间状态',
          dataIndex: 'roomStatus',
          key: 'roomStatus',
          width: '20%',
          scopedSlots: { customRender: 'roomStatus' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '30%',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '小明',
          workId: '001',
          editable: false,
          department: '行政部',
          roomNumber: '101',
          roomArea: 12.5,
          roomStatus: 0,
          roomStatus__dictText: '未出租',
          remark: 'aaaaa实打实大苏打111111111111111111111111111111111111111'
        },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部'
        }
      ]
    }
  },
  computed: {},
  methods: {
    async initDict () {
      // 查询表单区域选项
      this.roomStatusOption = await getDictOption('room_status')
      console.log(this.roomStatusOption)
    },
    newMember () {
      if (this.headId === '') {
        this.$message.error('请保存表单后后再进行新增操作')
        return
      }
      this.data.push({
        id: '',
        apartmentId: this.headId,
        roomNumber: '',
        roomArea: 0,
        roomStatus: 0,
        remark: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow (record) {
      this.memberLoading = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        this.memberLoading = false
        this.$message.error('请填写完整成员信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.find(item => item.key === key)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },
    toggle (key) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
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
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
