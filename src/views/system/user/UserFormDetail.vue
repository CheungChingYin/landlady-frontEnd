<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="用户信息">
        <a-descriptions-item :label="$t('user.label.form.name')">{{ queryData.name }}</a-descriptions-item>
        <a-descriptions-item :label="$t('user.label.form.email')">{{ queryData.email }}</a-descriptions-item>
        <a-descriptions-item :label="$t('user.label.form.phoneNumber')">{{ queryData.phoneNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('user.label.form.isFreeze')">{{ queryData.isFreeze == undefined ? '':dictMap.yn[queryData.isFreeze] }}</a-descriptions-item>
        <a-descriptions-item :label="$t('user.label.form.createTime')">{{ queryData.createTime }}</a-descriptions-item>
        <a-descriptions-item :label="$t('user.label.form.updateTime')">{{ queryData.updateTime }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { queryById } from '@/api/system/userApi'
import { notification } from 'ant-design-vue'
import { getDictItemMap } from '@/api/system/dictItemApi'

export default {
  components: {
    STable
  },
  data () {
    return {
      queryData: {},
      dictMap: {}
    }
  },
  methods: {
    async loadData (id) {
      await queryById(id).then(res => {
        if (res.code !== 200) {
          notification.error({
            message: '加载表单数据失败',
            description: '请联系管理员'
          })
          return
        }
        this.queryData = res.result
      })
    },
    async initDict () {
      this.dictMap.yn = await getDictItemMap('yn')
      console.log(this.dictMap)
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
    this.initDict()
    let id = null
    if (this.$route.params) {
      id = this.$route.params.id
    }
    if (id == null) {
      notification.error({
        message: '信息加载异常'
      })
    } else {
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
