<template>
  <a-spin :spinning="loading">
    <page-header-wrapper content="">
      <a-card class="card" title="公寓管理" :bordered="false">
        <ApartmentForm ref="apartmentForm" :showSubmit="false" />
      </a-card>
      <a-card class="card" title="" :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="房间主数据">
            <room-table-form ref="roomTableForm" :head-id="id"></room-table-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="附件" force-render>
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
import { queryById, saveOrUpdateComplexData } from '@/api/maindata/ApartmentApi'
import pick from 'lodash.pick'
import moment from 'moment'
import AttachmentTabForm from '@/views/system/attachment/AttachmentTabForm.vue'

export default {
  name: 'ApartmentAdvancedForm',
  components: {
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
      const headForm = this.$refs.apartmentForm.form
      headForm.validateFields((err, values) => {
        if (!err) {
          const locate = this.$refs.apartmentForm.locate
          // 省市区检验
          if (locate.length !== 3) {
            this.$message.error('省市区(县)范围必须要选到区')
            return
          }
          const saveData = Object.assign({}, values)
          saveData.provinceId = locate[0]
          saveData.cityId = locate[1]
          saveData.areaId = locate[2]
          if (values.apartmentCompletionDate !== undefined && values.apartmentCompletionDate != null && values.apartmentCompletionDate instanceof moment) {
            saveData.apartmentCompletionDate = values.apartmentCompletionDate.format('YYYY-MM-DD')
          }
          saveData.roomMainDataList = this.$refs.roomTableForm.data
          saveData.attachmentList = this.$refs.attachmentTabForm.data
          this.loading = true
          // 房间编号已存在检查
          const roomNumbers = saveData.roomMainDataList.map(item => item.roomNumber)
          if (new Set(roomNumbers).size !== roomNumbers.length) {
            this.$message.error('房间编号已存在')
            this.loading = false
            return
          }
          saveOrUpdateComplexData(saveData).then(res => {
            if (res.code !== 200) {
              this.$message.error(res.message)
            } else {
              this.$message.success('保存成功')
              // 保存成功后，更新表单数据
              this.id = res.result.id
              this.$refs.apartmentForm.form.setFieldsValue(pick(res.result, this.$refs.apartmentForm.fields))
              this.$refs.apartmentForm.locate = [res.result.provinceId, res.result.cityId, res.result.areaId]
              this.$refs.roomTableForm.loadData(res.result.id)
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
          this.$refs.apartmentForm.form.setFieldsValue(pick(res.result, this.$refs.apartmentForm.fields))
          this.$refs.apartmentForm.locate = [res.result.provinceId, res.result.cityId, res.result.areaId]
          this.$refs.roomTableForm.loadData(res.result.id)
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
