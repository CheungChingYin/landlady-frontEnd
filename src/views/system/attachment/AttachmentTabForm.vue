<template>
  <div>
    <a-row :gutter="[8, 8]">
      <a-col :md="8" :sm="24">
        <a-upload
          name="file"
          :multiple="true"
          action="/api/sys/file/upload"
          :showUploadList="false"
          :headers="headers"
          :before-upload="beforeUpload"
          @change="handleUploadChange">
          <a-tooltip v-if="this.headId === ''">
            <template slot="title">
              请保存表单后再进行上传附件操作
            </template>
            <a-button disabled>
              <a-icon type="upload"/>
              上传
            </a-button>
          </a-tooltip>
          <a-button v-else>
            <a-icon type="upload"/>
            上传
          </a-button>
        </a-upload>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col>
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :loading="memberLoading"
        >
          <template v-for="(item, i) in ['attachmentName']" :slot="item" slot-scope="text, record">
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
          <template :slot="'attachmentDesc'" slot-scope="text, record">
            <a-textarea
              v-if="record.editable"
              @change="e => handleChange(e.target.value, record.key, 'attachmentDesc')"
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
              <a v-if="record.id !== ''" @click="downloadFile(record)">下载</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import { Ellipsis, STable } from '@/components'
import { deleteData, download, getList } from '@/api/system/attachmentApi'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'AttachmentTabForm',
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
      headers: {
        'Authorization': storage.get(ACCESS_TOKEN)
      },
      // table
      columns: [
        {
          title: '附件名称',
          dataIndex: 'attachmentName',
          key: 'attachmentName',
          width: '20%'
          // scopedSlots: { customRender: 'attachmentName' }
        },
        {
          title: '附件大小',
          dataIndex: 'attachmentSize',
          key: 'attachmentSize',
          width: '20%',
          scopedSlots: { customRender: 'attachmentSize' }
        },
        {
          title: '附件描述',
          dataIndex: 'attachmentDesc',
          key: 'attachmentDesc',
          width: '30%',
          scopedSlots: { customRender: 'attachmentDesc' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: []
    }
  },
  computed: {},
  methods: {
    async initDict () {
    },
    newMember (record) {
      const dataLength = this.data.length
      const data = Object.assign({
        key: dataLength === 0 ? '1' : (parseInt(this.data[dataLength - 1].key) + 1).toString(),
        id: '',
        sourceId: this.headId,
        editable: false,
        isNew: false
      }, record)
      this.data.push(data)
    },
    remove (record) {
      const newData = this.data.filter(item => item.key !== record.key)
      if (record.id && record.id !== '') {
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
      const data = Object.assign({}, record, { sourceId: this.headId })
      // 校验
      if (data.attachmentName === undefined || data.attachmentName === '') {
        this.$message.error('附件名称不能为空')
        return
      }
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
      const param = { sourceId: id }
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
    },
    beforeUpload (file) {
      if (this.headId === '') {
        this.$message.error('请先保存后再进行上传附件')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isLt2M
    },
    handleUploadChange (info) {
      console.log(info)
      if (info.file.response) {
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.message)
          return
        }
        this.newMember(info.file.response.result)
      }
    },
    downloadFile (record) {
      download(record.id)
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
