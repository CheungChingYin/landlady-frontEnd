<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="资产信息">
        <a-descriptions-item :label="$t('maindata.assets.label.form.assetsNumber')">{{ apartmentData.assetsNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.assetsName')">{{ apartmentData.assetsName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.assetsDesc')">{{ apartmentData.assetsDesc }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.skuNumber')">{{ apartmentData.skuNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.unit')">{{ apartmentData.unit }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.isFreeze')">{{ apartmentData.isFreeze_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.assets.label.form.remark')">{{ apartmentData.remark }}</a-descriptions-item>
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
import { getList } from '@/api/maindata/AssetsMainDataApi'
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
      apartmentData: {}
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
        this.apartmentData = res.result.records[0]
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
