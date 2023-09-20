<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          :label="$t('user.label.form.name')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            size="large"
            type="text"
            :placeholder="$t('user.register.name.placeholder')"
            v-decorator="['name', {rules: [{ required: true, message: $t('user.name.required') }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item
          :label="$t('user.label.form.email')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            size="large"
            type="text"
            :placeholder="$t('user.register.email.placeholder')"
            v-decorator="['email', {rules: [{ required: true, type: 'email', message: $t('user.email.required') }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item
          :label="$t('user.label.form.phoneNumber')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            size="large"
            :placeholder="$t('user.login.mobile.placeholder')"
            v-decorator="['phoneNumber', {rules: [{ required: true, message: $t('user.phone-number.required'), pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]">
            <a-select slot="addonBefore" size="large" defaultValue="+86">
              <a-select-option value="+86">+86</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item
          :label="$t('user.label.form.password')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-show="isAddForm">
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
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-show="isAddForm">
          <a-input-password
            size="large"
            :placeholder="$t('user.register.confirm-password.placeholder')"
            v-decorator="['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          :label="$t('user.label.form.isFreeze')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            placeholder="请选择"
            :options="isFreezeOption"
            v-decorator="['isFreeze', {initialValue: '0',rules: [{ required: true, message: $t('user.isFreeze.required') }], validateTrigger: ['change', 'blur']}]"></a-select>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">{{ $t('form.basic-form.form.save') }}</a-button>
          <a-button style="margin-left: 8px" @click="routeBackHandler" >{{ $t('form.basic-form.form.return') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { scorePassword } from '@/utils/util'
import { checkPhoneNumberExist } from '@/api/login'
import { addData, editData, queryById } from '@/api/system/userApi'
import { notification } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import pick from 'lodash.pick'

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
  name: 'UserForm',
  data () {
    return {
      state: {
        level: 0,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      queryData: {},
      form: this.$form.createForm(this),
      isAddForm: false,
      // 是否冻结选项
      isFreezeOption: []
    }
  },
  computed: {
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
    loadData (id) {
      queryById(id).then(res => {
        if (res.code !== 200) {
          notification.error({
            message: '加载表单数据失败',
            description: '请联系管理员'
          })
          return
        }
        this.form.setFieldsValue(pick(res.result, ['name', 'email', 'phoneNumber', 'isFreeze']))
        this.queryData = res.result
      })
    },
    async initDict () {
      // 是否冻结
      this.isFreezeOption = await getDictOption('yn')
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
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },
    /**
     * 检查手机号是否存在
     * @param rule
     * @param value
     * @param callback
     * @returns {Promise<void>}
     */
    async handlePhoneCheck (rule, value, callback) {
      const pattern = /^1[3456789]\d{9}$/
      if (this.isAddForm && pattern.test(value)) {
        // 请求后端检查手机号是否存在
        await checkPhoneNumberExist(value)
          .then((res) => {
            // 手机号存在
            if (res.result.isExist) {
              callback(new Error(this.$t('user.phoneNumber.exist')))
            }
          })
      }
      callback()
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
    routeBackHandler () {
      this.$router.back()
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      const fieldArray = ['name', 'email', 'phoneNumber']
      if (this.isAddForm) {
        fieldArray.push('password')
        fieldArray.push('password2')
      }
      this.form.validateFields(fieldArray, (err, values) => {
        if (!err) {
          if (this.isAddForm) {
            addData(values).then(res => {
              if (res.code !== 200) {
                notification.error({
                  message: '保存失败',
                  description: res.message
                })
              } else {
                notification.success({
                  message: '保存成功'
                })
                // 保存成功，返回列表页
                this.routeBackHandler()
              }
            })
          } else {
            const data = Object.assign(this.queryData, values)
            editData(data).then(res => {
              if (res.code !== 200) {
                notification.error({
                  message: '保存失败',
                  description: res.message
                })
              } else {
                notification.success({
                  message: '保存成功'
                })
                this.loadData(res.result.id)
              }
            })
          }
        }
      })
    }
  },
  mounted () {
    this.initDict()
    let id = null
    if (this.$route.params) {
      id = this.$route.params.id
    }
    if (id == null) {
      this.isAddForm = true
      return
    }
    this.loadData(id)
  }
}
</script>
