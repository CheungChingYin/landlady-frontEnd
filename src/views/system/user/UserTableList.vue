<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phoneNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="邮箱">
                  <a-input v-model="queryParam.email" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="是否冻结">
                  <a-select v-model="queryParam.isFreeze" placeholder="请选择" default-value="" :options="isFreezeOption">
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="primary" icon="key" @click="handleResetPassword">重置密码</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="isFreezeStatus" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleShowDetail(record)">查看</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认是否删除？" ok-text="是" cancel-text="否" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal
      title="重置密码"
      :visible="resetPasswordModalVisible"
      :confirm-loading="resetPasswordConfirmLoading"
      @cancel="handleCancel"
      @ok="handleResetPasswordSubmit">
      <a-form :form="resetPasswordForm">
        <a-form-item
          :label="$t('user.label.form.password')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-popover
            placement="rightTop"
            :trigger="['focus']"
            :getPopupContainer="(trigger) => trigger.parentElement"
            v-model="state.passwordLevelChecked">
            <template slot="content">
              <div :style="{ width: '240px' }">
                <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
                <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                <div style="margin-top: 10px;">
                  <span>{{ $t('user.register.password.popover-message') }}
                  </span>
                </div>
              </div>
            </template>
            <a-input-password
              size="large"
              @click="handlePasswordInputClick"
              :placeholder="$t('user.register.password.placeholder')"
              v-decorator="['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
            ></a-input-password>
          </a-popover>
        </a-form-item>
        <a-form-item
          :label="$t('user.label.form.passwordConfirm')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input-password
            size="large"
            :placeholder="$t('user.register.confirm-password.placeholder')"
            v-decorator="['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { getDictOption } from '@/api/system/dictItemApi'
import { getList, deleteData, resetPassword } from '@/api/system/userApi'
import { notification } from 'ant-design-vue'
import { scorePassword } from '@/utils/util'

const columns = [
  {
    title: '昵称',
    dataIndex: 'name'
  },
  {
    title: '电话号码',
    dataIndex: 'phoneNumber'
  },
  {
    title: '邮箱地址',
    dataIndex: 'email'
  },
  {
    title: '是否冻结',
    dataIndex: 'isFreeze_dictText',
    scopedSlots: { customRender: 'isFreezeStatus' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const isFreezeStatusMap = {
  '否': {
    status: 'success',
    text: '未冻结'
  },
  '是': {
    status: 'error',
    text: '已冻结'
  }
}

const levelNames = {
  0: 'user.password.strength.short',
  1: 'user.password.strength.low',
  2: 'user.password.strength.medium',
  3: 'user.password.strength.strong'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'UserTableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 是否冻结选项
      isFreezeOption: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getList(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
            return []
          }
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      resetPasswordModalVisible: false,
      resetPasswordConfirmLoading: false,
      resetPasswordForm: this.$form.createForm(this),
      state: {
        level: 0,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      }
    }
  },
  filters: {
    statusFilter (type) {
      return isFreezeStatusMap[type].text
    },
    statusTypeFilter (type) {
      return isFreezeStatusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    async initDict () {
      // 是否冻结
      this.isFreezeOption = await getDictOption('yn')
    },
    handleAdd () {
      this.$router.push({ name: 'userForm' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'userForm', params: record })
    },
    handleShowDetail (record) {
      this.$router.push({ name: 'userFormDetail', params: record })
    },
    handleDelete (record) {
      deleteData(record.id).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
          } else {
            notification.success({
              message: '删除成功'
            })
          }
        this.$refs.table.loadData()
      })
    },
    handleResetPassword () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.resetPasswordModalVisible = true
    },
    /**
     * 移动端不进行密码检查
     */
    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    handleCancel () {
      this.resetPasswordModalVisible = false
      // 清理表单数据
      this.resetPasswordForm.resetFields()
    },
    /**
     * 密码等级计算
     * @param rule 规则
     * @param value 密码
     * @param callback 回调
     * @returns {*}
     */
    handlePasswordLevel (rule, value, callback) {
      if (!value) {
        return callback()
      }
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.state.level = 1
        }
        if (scorePassword(value) >= 60) {
          this.state.level = 2
        }
        if (scorePassword(value) >= 80) {
          this.state.level = 3
        }
      } else {
        this.state.level = 0
        callback(new Error(this.$t('user.password.strength.msg')))
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33

      callback()
    },
    /**
     * 密码检查
     * @param rule 规则
     * @param value 密码
     * @param callback 回调函数
     */
    handlePasswordCheck (rule, value, callback) {
      const password = this.resetPasswordForm.getFieldValue('password')
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },
    handleResetPasswordSubmit () {
      this.resetPasswordForm.validateFields((errors, values) => {
        const selectRow = this.selectedRows[0]
        if (!errors) {
          // 提交按钮loading
          this.resetPasswordConfirmLoading = true
          const data = Object.assign({}, values, selectRow)
          resetPassword(data).then(res => {
            if (res.code !== 200) {
              notification.error({
                message: '重置密码失败',
                description: res.message
              })
            } else {
              notification.success({
                message: '重置密码成功'
              })
              this.resetPasswordModalVisible = false
            }
            // 取消提交按钮loading
            this.resetPasswordConfirmLoading = false
          })
        }
      })
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
