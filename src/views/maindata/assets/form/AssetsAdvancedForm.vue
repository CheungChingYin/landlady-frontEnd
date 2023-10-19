<template>
  <a-spin :spinning="loading">
    <page-header-wrapper content="">
      <a-card class="card" title="资产数据" :bordered="false">
        <AssetsForm ref="assetsForm" :showSubmit="false" :col-count="3" />
      </a-card>
      <a-card class="card" title="" :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="附件信息">
            <attachment-tab-form ref="attachmentTabForm" :head-id="id"></attachment-tab-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar :is-mobile="isMobile">
        <a-button type="primary" @click="validate" :loading="loading">保存</a-button>
        <a-button style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
      </footer-tool-bar>
    </page-header-wrapper>
  </a-spin>
</template>

<script>
import ApartmentForm from '@/views/maindata/apartment/form/ApartmentForm'
import FooterToolBar from '@/components/FooterToolbar'
import RoomTableForm from '@/views/maindata/room/form/RoomTableForm'
import { queryById, saveOrUpdateComplexData } from '@/api/maindata/AssetsMainDataApi'
import pick from 'lodash.pick'
import AttachmentTabForm from '@/views/system/attachment/AttachmentTabForm.vue'
import AssetsForm from '@/views/maindata/assets/form/AssetsForm.vue'

export default {
  name: 'ApartmentAdvancedForm',
  components: {
    AssetsForm,
    AttachmentTabForm,
    RoomTableForm,
    FooterToolBar,
    ApartmentForm
  },
  data () {
    return {
      loading: false,
      memberLoading: false,
      isMobile: false,
      id: ''
    }
  },
  methods: {
    // 最终全页面提交
    validate () {
      const headForm = this.$refs.assetsForm.form
      headForm.validateFields((err, values) => {
        if (!err) {
          const saveData = Object.assign({}, values)
          saveData.attachmentList = this.$refs.attachmentTabForm.data
          this.loading = true
          saveOrUpdateComplexData(saveData).then(res => {
            if (res.code !== 200) {
              this.$message.error(res.message)
            } else {
              this.$message.success('保存成功')
              // 保存成功后，更新表单数据
              this.id = res.result.id
              this.$refs.assetsForm.form.setFieldsValue(pick(res.result, this.$refs.assetsForm.fields))
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
      queryById(this.id).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.$refs.assetsForm.form.setFieldsValue(pick(res.result, this.$refs.assetsForm.fields))
          this.$refs.attachmentTabForm.loadData(res.result.id)
        }
      })
    },
    routeBackHandler () {
      this.$router.back()
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
