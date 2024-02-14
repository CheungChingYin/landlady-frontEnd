<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="公寓信息">
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentNumber')">{{ apartmentData.apartmentNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentName')">{{ apartmentData.apartmentName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.locate')">{{ apartmentData.provinceId_dictText }} / {{ apartmentData.cityId_dictText }} / {{ apartmentData.areaId_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentAddress')">{{ apartmentData.apartmentAddress }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentArea')">{{ apartmentData.apartmentArea }} m²</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentHeight')">{{ apartmentData.apartmentHeight }} m</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.apartmentCompletionDate')">{{ apartmentData.apartmentCompletionDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.ownerName')">{{ apartmentData.ownerName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.ownerIdNumber')">{{ apartmentData.ownerIdNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.apartment.label.form.remark')">{{ apartmentData.remark }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">房间信息</div>
      <s-table
        style="margin-bottom: 24px"
        ref="roomTable"
        size="default"
        rowKey="id"
        :columns="roomColumns"
        :data="loadRoomData"
        :alert="false"
        showPagination="auto">
        <span slot="remark" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <div class="title">附件信息</div>
      <AttachmentTabDetail :head-id="this.$route.params.id"></AttachmentTabDetail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { notification } from 'ant-design-vue'
import { getList } from '@/api/maindata/ApartmentApi'
import { getList as getRoomList } from '@/api/maindata/RoomMainDataApi'
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
      apartmentData: {},
      roomColumns: [{
        title: '房间编号',
        dataIndex: 'roomNumber'
      },
        {
          title: '房间面积',
          dataIndex: 'roomArea'
        },
        {
          title: '房间状态',
          dataIndex: 'roomStatus_dictText'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        }],
      loadRoomData: parameter => {
        return getRoomList(parameter.pageNo, parameter.pageSize, { apartmentId: this.$route.params.id }).then(res => {
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
