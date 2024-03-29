<template>
  <a-spin :spinning="loading">
    <page-header-wrapper content="">
      <a-card class="card" title="合同信息" :bordered="false">
        <ContractForm ref="contractForm" :showSubmit="false" />
      </a-card>
      <a-card class="card" title="" :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="合同收费项目">
            <FeeItemTableForm ref="feeItemTableForm" :head-id="id"></FeeItemTableForm>
          </a-tab-pane>
          <a-tab-pane key="2" tab="附件" force-render>
            <attachment-tab-form ref="attachmentTabForm" :head-id="id"></attachment-tab-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <ContractSignModal
        ref="contractSignModal"
        :parent-load-data="loadData"
        :head-id="id" />

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
import { getList, saveOrUpdateComplexData } from '@/api/contract/ContractHeadApi'
import pick from 'lodash.pick'
import AttachmentTabForm from '@/views/system/attachment/AttachmentTabForm.vue'
import RoomAssetsRecordTableForm from '@/views/maindata/roomAssetsRecord/form/RoomAssetsRecordTableForm.vue'
import ContractForm from '@/views/contract/form/ContractForm.vue'
import FeeItemTableForm from '@/views/maindata/feeItem/form/FeeItemTableForm.vue'
import moment from 'moment/moment'
import ContractSignModal from '@/views/contract/form/ContractSignModal.vue'

export default {
  name: 'ContractAdvancedForm',
  components: {
    ContractSignModal,
    FeeItemTableForm,
    ContractForm,
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
      contractSignVisible: false
    }
  },
  methods: {
    // 最终全页面提交
    validate () {
      const headForm = this.$refs.contractForm.form
      headForm.validateFields((err, values) => {
        if (!err) {
          const saveData = Object.assign({}, values)
          saveData.contractFeeItemList = this.$refs.feeItemTableForm.data
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
              // 合同签订按钮是否展示
              this.contractSignVisible = res.result.contractStatus === 0
              this.$refs.contractForm.form.setFieldsValue(pick(res.result, this.$refs.contractForm.fields))
              this.$refs.feeItemTableForm.loadData(res.result.id)
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
          this.$refs.contractForm.form.setFieldsValue(pick(record, this.$refs.contractForm.fields))
          this.$refs.feeItemTableForm.loadData(record.id)
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
