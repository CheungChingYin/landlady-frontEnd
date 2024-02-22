<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="房间读书信息">
        <a-descriptions-item :label="$t('maindata.reading.label.form.apartmentId_dictText')">{{ fromData.apartmentId_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.roomId_dictText')">{{ fromData.roomId_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.readingYear')">{{ fromData.readingYear }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.readingMonth')">{{ fromData.readingMonth }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.readingType')">{{ fromData.readingType_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.createBy_dictText')">{{ fromData.createBy_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.reading.label.form.remark')">{{ fromData.remark }}</a-descriptions-item>
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
import { getList } from '@/api/maindata/RoomReadingRecordApi'
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
      fromData: {}
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
        this.fromData = res.result.records[0]
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
</style>
