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
      <AttachmentTabDetail :head-id="this.$route.params.id"></AttachmentTabDetail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { notification } from 'ant-design-vue'
import { getList } from '@/api/maindata/RenterMainDataApi'
import AttachmentTabDetail from '@/views/system/attachment/AttachmentTabDetail.vue'

export default {
  components: {
    AttachmentTabDetail,
    Ellipsis,
    STable
  },
  data () {
    return {
      id: '',
      frontImageUrl: '',
      reverseImageUrl: '',
      renterData: {}
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
