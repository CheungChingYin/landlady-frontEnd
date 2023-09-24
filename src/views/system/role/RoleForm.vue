<template>
  <a-spin :spinning="loading">
    <a-form :form="form" v-bind="formLayout">
      <a-form-item label="" v-show="false">
        <a-input
          size="large"
          type="text"
          v-decorator="['id']"/>
      </a-form-item>
      <a-form-item label="角色名称">
        <a-input
          size="large"
          type="text"
          v-decorator="['name', {rules: [{ required: true, message: '请输入角色名称' }], validateTrigger: ['change', 'blur']}]"/>
      </a-form-item>
      <a-form-item label="角色编码">
        <a-input
          size="large"
          type="text"
          v-decorator="['roleCode', {rules: [{required: true, message: '请输入角色编码！'}, { validator: this.handleRoleCodeCheck }], validateTrigger: ['change', 'blur']}]"/>
      </a-form-item>
      <a-form-item label="角色描述">
        <a-textarea v-decorator="['description']"/>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
// import pick from 'lodash.pick'

// 表单字段
import pick from 'lodash.pick'

const fields = ['id', 'name', 'roleCode', 'description']

export default {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    rowData: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 rowData 发生改变时，为表单设置值
    this.$watch('rowData', () => {
      this.rowData && this.form.setFieldsValue(pick(this.rowData, fields))
    }, { deep: true, immediate: true })
  },
  methods: {
    handleRoleCodeCheck (rule, value, callback) {
      if (value !== '' && !/^[[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$/.test(value)) {
        callback(new Error('角色编码只能包含英文横杠和下划线，且不能以数字和横杠和下划线为开头或结尾'))
      } else {
        callback()
      }
    }
  }
}
</script>
