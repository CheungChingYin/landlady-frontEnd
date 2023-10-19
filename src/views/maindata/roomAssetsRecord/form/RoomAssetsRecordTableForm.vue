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
        <template v-else>{{ roomStatusOption.find(item => item.value === record.roomStatus).label }}</template>
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

import { getDictOption } from '@/api/system/dictItemApi'
import { Ellipsis, STable } from '@/components'
import { deleteData, getList } from '@/api/maindata/RoomMainDataApi'

export default {
  name: 'RoomAssetsRecordTableForm',
  components: {
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
      roomStatusOption: [],
      // table
      columns: [
        {
          title: '房间编号',
          dataIndex: 'assetsName',
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
        // {
        //   key: '1',
        //   name: '小明',
        //   workId: '001',
        //   editable: false,
        //   department: '行政部',
        //   roomNumber: '101',
        //   roomArea: 12.5,
        //   roomStatus: 0,
        //   roomStatus__dictText: '未出租',
        //   remark: 'aaaaa实打实大苏打111111111111111111111111111111111111111'
        // }
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
      const dataLength = this.data.length
      this.data.push({
        key: dataLength === 0 ? '1' : (parseInt(this.data[dataLength - 1].key) + 1).toString(),
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
      const data = Object.assign({}, record, { apartmentId: this.headId })
      // 校验
      if (data.roomNumber === undefined || data.roomNumber === '') {
        this.$message.error('房间编号不能为空')
        return
      }
      if (this.checkRoomNumberIsExist(data.key, data.roomNumber)) {
        this.$message.error('房间编号已存在')
        return
      }
      this.memberLoading = true
      const target = this.data.find(item => item.key === record.key)
      target.isNew = false
      target.editable = false
      this.memberLoading = false
    },
    checkRoomNumberIsExist (key, roomNumber) {
      return this.data.find(item => item.roomNumber === roomNumber && item.key !== key) !== undefined
    },
    toggle (key) {
      const target = this.data.find(item => item.key === key)
      console.log('----targetOrigin----')
      console.log(target)
      target._originalData = { ...target }
      target.editable = !target.editable
      console.log('----targetNow----')
      console.log(target)
    },
    async loadData (id) {
      this.memberLoading = true
      const param = { apartmentId: id }
      await getList(1, 99999, param).then(res => {
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
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
