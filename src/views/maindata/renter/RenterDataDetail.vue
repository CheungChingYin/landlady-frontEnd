<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="租户信息">
        <a-descriptions-item :label="$t('maindata.renter.label.form.frontAttachmentId')" :span="2">
          <img :src="frontImageUrl" alt="avatar" class="idCardPic" />
        </a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.reverseAttachmentId')" :span="2">
          <img :src="reverseImageUrl" alt="avatar" class="idCardPic" />
        </a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.gender')">{{ renterData.gender_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.nation')">{{ renterData.nation }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.birthday')">{{ renterData.birthday }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.address')" :span="2">{{ renterData.address }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.idNumber')" :span="2">{{ renterData.idNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.signOffice')">{{ renterData.signOffice }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.effectiveDate')">{{ renterData.effectiveDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.expireDate')">{{ renterData.expireDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.renter.label.form.remark')">{{ renterData.remark }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">附件信息</div>
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
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { notification } from 'ant-design-vue'
import { getList } from '@/api/maindata/RenterMainDataApi'
import { download, getList as getAttachmentList } from '@/api/system/attachmentApi'

export default {
  components: {
    Ellipsis,
    STable
  },
  data () {
    return {
      id: '',
      frontImageUrl: '',
      reverseImageUrl: '',
      renterData: {},
      attachmentColumns: [{
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
        return getAttachmentList(parameter.pageNo, parameter.pageSize, { sourceId: this.$route.params.id }).then(res => {
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
  methods: {
    async loadData (id) {
      await getList(1, 1, { id: id }).then(res => {
        if (res.code !== 200) {
          notification.error({
            message: '加载表单数据失败',
            description: '请联系管理员'
          })
          return
        }
        this.renterData = res.result.records[0]
        console.log(this.renterData)
        this.frontImageUrl = '/api/sys/file/download/' + this.renterData.frontAttachmentId
        this.reverseImageUrl = '/api/sys/file/download/' + this.renterData.reverseAttachmentId
      })
    },
    downloadFile (record) {
      download(record.id)
    },
    routeBackHandler () {
      this.$router.back()
    }
  },
  filters: {
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  mounted () {
    let id = null
    if (this.$route.params) {
      id = this.$route.params.id
    }
    if (id == null) {
      notification.error({
        message: '信息加载异常'
      })
    } else {
      this.id = this.$route.params.id
      this.loadData(this.$route.params.id)
    }
  }

}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .idCardPic {
    width: 400px;
    height: 200px;
  }
</style>
