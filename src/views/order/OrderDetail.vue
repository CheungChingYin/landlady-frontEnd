<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="订单信息">
        <a-descriptions-item :label="$t('order.label.form.orderNumber')">{{ orderData.orderNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.contractNumber')">{{ orderData.contractNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.apartmentName')">{{ orderData.apartmentName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.roomNumber')">{{ orderData.roomNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.renterName')">{{ orderData.renterName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.orderAmount')">{{ orderData.orderAmount }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.orderYear')">{{ orderData.orderYear }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.orderMonth')">{{ orderData.orderMonth }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.orderType')">{{ orderData.orderType_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.orderStatus')">{{ orderData.orderStatus_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('order.label.form.remark')">{{ orderData.remark }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">订单收费项目</div>
      <s-table
        style="margin-bottom: 24px"
        ref="contractFeeItemTable"
        size="default"
        rowKey="id"
        :columns="roomColumns"
        :data="loadContractFeeItemListData"
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
import { getList } from '@/api/order/OrderHeadApi'
import { getList as getOrderItemList } from '@/api/order/OrderItemApi'
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
      orderData: {},
      roomColumns: [
        {
          title: '费用编码',
          dataIndex: 'feeCode_dictText',
          key: 'feeCode',
          width: '20%',
          scopedSlots: { customRender: 'feeCode_dictText' }
        },
        {
          title: '费用名称',
          dataIndex: 'feeName',
          key: 'feeName',
          width: '',
          scopedSlots: { customRender: 'feeName' }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          width: '10%',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '上期读数',
          dataIndex: 'beforeReading',
          key: 'beforeReading',
          width: '10%',
          scopedSlots: { customRender: 'beforeReading' }
        },
        {
          title: '当期读数',
          dataIndex: 'currentReading',
          key: 'currentReading',
          width: '10%',
          scopedSlots: { customRender: 'currentReading' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '20%',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      loadContractFeeItemListData: parameter => {
        return getOrderItemList(parameter.pageNo, parameter.pageSize, { contractId: this.$route.params.id }).then(res => {
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
        this.orderData = res.result.records[0]
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
