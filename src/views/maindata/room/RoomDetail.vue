<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="房间信息">
        <a-descriptions-item :label="$t('maindata.room.label.form.roomNumber')">{{ apartmentData.roomNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.room.label.form.apartmentNumber')">{{ apartmentData.apartmentId_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.room.label.form.roomStatus')">{{ apartmentData.roomStatus_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.room.label.form.remark')">{{ apartmentData.remark }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">房间资产信息</div>
      <s-table
        style="margin-bottom: 24px"
        ref="roomTable"
        size="default"
        rowKey="id"
        :columns="roomColumns"
        :data="loadRoomAssetsListData"
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
import { getList } from '@/api/maindata/RoomMainDataApi'
import { getUnionList } from '@/api/maindata/RoomAssetsRecordApi'
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
      roomColumns: [
        {
          title: '资产编号',
          dataIndex: 'assetsNumber',
          key: 'assetsNumber',
          width: '20%'
        },
        {
          title: '资产名称',
          dataIndex: 'assetsName',
          key: 'assetsName',
          width: '10%'
        },
        {
          title: '数量',
          dataIndex: 'quantity'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit'
        },
        {
          title: '价格',
          dataIndex: 'price'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '20%',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      loadRoomAssetsListData: parameter => {
        return getUnionList(parameter.pageNo, parameter.pageSize, { roomId: this.$route.params.id }).then(res => {
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
