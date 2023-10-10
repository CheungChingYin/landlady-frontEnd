<template>
  <page-header-wrapper content="">
    <a-card class="card" title="公寓管理" :bordered="false">
      <ApartmentForm ref="apartForm" :showSubmit="false" />
    </a-card>
    <a-card class="card" title="" :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="房间主数据">
          <room-table-form ref="roomTableForm" :head-id="id"></room-table-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="附件" force-render>
          Content of Tab Pane 2
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile">
      <a-button type="primary" @click="validate" :loading="loading">保存</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import ApartmentForm from '@/views/maindata/apartment/form/ApartmentForm'
import FooterToolBar from '@/components/FooterToolbar'
import RoomTableForm from '@/views/maindata/apartment/form/RoomTableForm'
import { queryById } from '@/api/maindata/ApartmentApi'

export default {
  name: 'ApartmentAdvancedForm',
  components: {
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
      const { $refs: { repository, task }, $notification } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        task.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm, taskForm]).then(values => {
        $notification['error']({
          message: 'Received values of form:',
          description: JSON.stringify(values)
        })
      }).catch(() => {
        const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
        const tmp = { ...errors }
        this.errorList(tmp)
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
          this.$refs.apartForm.form.setFieldsValue(res.result)
          this.$refs.apartForm.locate = [res.result.provinceId, res.result.cityId, res.result.areaId]
        }
      })
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
