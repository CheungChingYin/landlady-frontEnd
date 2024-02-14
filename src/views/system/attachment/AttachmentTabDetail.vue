<template>
  <div>
    <s-table
      style="margin-bottom: 24px"
      ref="attachmentTable"
      size="default"
      rowKey="id"
      :columns="attachmentColumns"
      :data="loadAttachmentData"
      :alert="false"
      showPagination="auto">
      <template :slot="'attachmentDesc'" slot-scope="text">
        <ellipsis :length="20" tooltip>
          {{ text }}
        </ellipsis>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a v-if="record.id !== ''" @click="downloadFile(record)">下载</a>
        <a-divider type="vertical"/>
        <a v-if="record.id !== ''" @click="previewFile(record)">预览</a>
      </template>
    </s-table>
  </div>
</template>

<script>

import { Ellipsis, STable } from '@/components'
import {
  download,
  getList as getAttachmentList,
  getPreviewFileUrl
} from '@/api/system/attachmentApi'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { notification } from 'ant-design-vue'

export default {
  name: 'AttachmentTabDetail',
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
      attachmentColumns: [
        {
        title: '附件名称',
        dataIndex: 'attachmentName'
        },
        {
          title: '附件大小',
          dataIndex: 'attachmentSize',
          key: 'attachmentSize'
        },
        {
          title: '附件描述',
          dataIndex: 'attachmentDesc',
          scopedSlots: { customRender: 'attachmentDesc' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }],
      loadAttachmentData: parameter => {
        return getAttachmentList(parameter.pageNo, parameter.pageSize, { sourceId: this.headId }).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
            return []
          }
          return res.result
        })
      }
    }
  },
  computed: {},
  methods: {
    async initDict () {
    },
    previewFile (record) {
      const previewUrl = getPreviewFileUrl(record)
      window.open(previewUrl)
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
