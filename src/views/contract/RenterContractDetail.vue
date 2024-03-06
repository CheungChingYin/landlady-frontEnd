<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button type="primary" style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions title="合同信息">
        <a-descriptions-item :label="$t('contract.label.form.contractNumber')">{{ contractData.contractNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.contractName')">{{ contractData.contractNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.contractStatus')">{{ contractData.contractStatus_dictText }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.apartmentName')">{{ contractData.apartmentName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.roomNumber')">{{ contractData.roomNumber }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.renterName')">{{ contractData.renterName }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.rentStartDate')">{{ contractData.rentStartDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.rentEndDate')">{{ contractData.rentEndDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('contract.label.form.receiptDate')">{{ contractData.receiptDate }}</a-descriptions-item>
        <a-descriptions-item :label="$t('maindata.room.label.form.remark')">{{ contractData.remark }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">合同收费项目</div>
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
import { getList } from '@/api/contract/ContractHeadApi'
import { getList as getContractFeeItemList } from '@/api/contract/ContractFeeItemApi'
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
      contractData: {},
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
          width: '10%',
          scopedSlots: { customRender: 'feeName' }
        },
        {
          title: '费用周期',
          dataIndex: 'feeCycle',
          key: 'feeCycle',
          scopedSlots: { customRender: 'feeCycle' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '10%',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          width: '20%',
          scopedSlots: { customRender: 'amount' }
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
        return getContractFeeItemList(parameter.pageNo, parameter.pageSize, { contractId: this.$route.params.id }).then(res => {
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
        this.contractData = res.result.records[0]
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
