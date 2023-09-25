<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form ref="form" :form="form" v-bind="formLayout">
        <a-form-item v-show="false">
          <a-input
            size="large"
            type="text"
            v-decorator="['id']"/>
        </a-form-item>
        <a-form-item v-show="false">
          <a-input
            size="large"
            type="text"
            v-decorator="['dictId']"/>
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            size="large"
            type="text"
            v-decorator="['itemText', {rules: [{ required: true, message: '请输入名称' }], validateTrigger: ['change', 'blur']}]"/>
        </a-form-item>
        <a-form-item label="数据值">
          <a-input
            size="large"
            type="text"
            v-decorator="['itemValue', {rules: [{ required: true, message: '请输入数据值' }], validateTrigger: ['change', 'blur']}]"/>
        </a-form-item>
        <a-form-item label="字典描述">
          <a-textarea v-decorator="['description']"/>
        </a-form-item>
        <a-form-item label="排序值">
          <a-input-number
            v-decorator="['sortOrder', {rules: [{ required: true, message: '请输入排序值' }], validateTrigger: ['change', 'blur']}]" />
          值越小越靠前
        </a-form-item>
        <a-form-item
          label="是否启用">
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" v-decorator="['status', {initialValue:true, valuePropName:'checked'}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addData, editData, queryById } from '@/api/system/dictItemApi'
import pick from 'lodash.pick'

const fields = ['id', 'dictId', 'itemText', 'itemValue', 'description', 'sortOrder', 'status']

  export default {
    name: 'DictItemModal',
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
        title: '操作',
        form: this.$form.createForm(this),
        visible: false,
        visibleCheck: true,
        model: {},
        dictId: '',
        status: 1,
        confirmLoading: false
      }
    },
    created () {
    },
    methods: {
      add (dictId) {
        this.dictId = dictId
        // 初始化默认值
        this.edit({ sortOrder: 1, status: 1 })
      },
      edit (record) {
        const that = this
        if (record.id) {
          this.dictId = record.dictId
          queryById(record.id).then(res => {
            if (res.code !== 200) {
              that.$message.error(res.message)
            } else {
              this.model = res.result
              this.model.status = (this.model.status === 1)
              this.form.setFieldsValue(pick(this.model, fields))
            }
          })
        }
        this.visible = true
      },
      // 确定
      handleOk () {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            if (values.status) {
              values.status = 1
            } else {
              values.status = 0
            }
            that.confirmLoading = true
            values.dictId = this.dictId
            let obj
            if (!this.model.id) {
              obj = addData(values)
            } else {
              obj = editData(values)
            }
            obj.then((res) => {
              if (res.code === 200) {
                that.$message.success(res.message)
                // 刷新列表
                that.$parent.$parent.$refs.itemTable.loadData()
                that.close()
              } else {
                that.$message.error(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          } else {
            return false
          }
        })
      },
      // 关闭
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.form.resetFields()
      }
    }
  }
</script>
