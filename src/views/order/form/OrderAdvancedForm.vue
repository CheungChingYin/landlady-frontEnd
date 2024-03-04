<template>
  <a-spin :spinning="loading">
    <page-header-wrapper content="">
      <a-card class="card" title="订单信息" :bordered="false">
        <OrderForm ref="orderForm" :showSubmit="false" @selectChange="selectChange" @contractChange="contractChange" />
      </a-card>
      <a-card class="card" title="" :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="订单费用项">
            <OrderItemTableForm ref="orderItemTableForm" :head-id="id" :headFormParams="headFormParams"></OrderItemTableForm>
          </a-tab-pane>
          <a-tab-pane key="2" tab="附件" force-render>
            <attachment-tab-form ref="attachmentTabForm" :head-id="id"></attachment-tab-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar :is-mobile="isMobile">
        <a-button type="primary" @click="validate" :loading="loading">保存</a-button>
        <a-button style="margin-left: 8px" type="primary" v-if="contractSignVisible" @click="contractSign">合同签订</a-button>
        <a-button style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
      </footer-tool-bar>
    </page-header-wrapper>
  </a-spin>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { getList, saveOrUpdateComplexData } from '@/api/order/OrderHeadApi'
import pick from 'lodash.pick'
import AttachmentTabForm from '@/views/system/attachment/AttachmentTabForm.vue'
import RoomAssetsRecordTableForm from '@/views/maindata/roomAssetsRecord/form/RoomAssetsRecordTableForm.vue'
import OrderForm from '@/views/order/form/OrderForm.vue'
import OrderItemTableForm from '@/views/order/orderItem/form/OrderItemTableForm.vue'
import moment from 'moment/moment'
import ContractSignModal from '@/views/contract/form/ContractSignModal.vue'

export default {
  name: 'OrderAdvancedForm',
  components: {
    ContractSignModal,
    OrderItemTableForm,
    OrderForm,
    RoomAssetsRecordTableForm,
    AttachmentTabForm,
    FooterToolBar
  },
  data () {
    return {
      loading: false,
      memberLoading: false,
      isMobile: false,
      id: '',
      contractSignVisible: false,
      headFormParams: {}
    }
  },
  methods: {
    // 最终全页面提交
    validate () {
      const headForm = this.$refs.orderForm.form
      headForm.validateFields((err, values) => {
        if (!err) {
          const saveData = Object.assign({}, values)
          saveData.orderItemList = this.$refs.orderItemTableForm.data
          saveData.attachmentList = this.$refs.attachmentTabForm.data
          if (values.rentStartDate !== undefined && values.rentStartDate != null && values.rentStartDate instanceof moment) {
            saveData.rentStartDate = values.rentStartDate.format('YYYY-MM-DD')
          }
          if (values.rentEndDate !== undefined && values.rentEndDate != null && values.rentEndDate instanceof moment) {
            saveData.rentEndDate = values.rentEndDate.format('YYYY-MM-DD')
          }
          this.loading = true
          saveOrUpdateComplexData(saveData).then(res => {
            if (res.code !== 200) {
              this.$message.error(res.message)
            } else {
              this.$message.success('保存成功')
              // 保存成功后，更新表单数据
              this.id = res.result.id
              this.$refs.orderForm.form.setFieldsValue(pick(res.result, this.$refs.orderForm.fields))
              this.$refs.orderItemTableForm.loadData(res.result.id)
              this.$refs.attachmentTabForm.loadData(res.result.id)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },
    loadData () {
      if (this.id == null || this.id === '') {
        return
      }
      getList(1, 1, { id: this.id }).then(res => {
        const record = res.result.records[0]
        if (res.code !== 200 || record == null) {
          this.$message.error(res.message)
        } else {
          this.$refs.orderForm.form.setFieldsValue(pick(record, this.$refs.orderForm.fields))
          this.$refs.orderItemTableForm.loadData(record.id)
          this.$refs.attachmentTabForm.loadData(record.id)
          if (record.contractStatus === 0) {
            this.contractSignVisible = true
          } else {
            this.contractSignVisible = false
          }
        }
      })
    },
    routeBackHandler () {
      this.$router.back()
    },
    contractSign () {
      this.$refs.contractSignModal.open()
    },
    selectChange (value, label) {
      // 由于直接获得表单值的时候，会取到修改前的值，故需要手动获取
      const headForm = this.$refs.orderForm.form.getFieldsValue()
      headForm[label] = value
      this.headFormParams = headForm
      // 变更了订单类型后清空订单费用项
      this.$refs.orderItemTableForm.data = []
    },
    contractChange (params) {
      this.headFormParams = this.$refs.orderForm.form.getFieldsValue()
      // 变更了所选的合同后，清空订单费用项
      this.$refs.orderItemTableForm.data = []
    }
  },
  mounted () {
    if (this.$route.params) {
      this.id = this.$route.params.id
    }
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    :deep(.antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content) {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
