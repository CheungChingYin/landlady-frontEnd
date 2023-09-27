<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="" v-show="false">
          <a-input
            size="large"
            type="text"
            v-decorator="['id']"/>
        </a-form-item>
        <a-form-item label="父级节点">
          <a-tree-select
            ref="treeSelect"
            :tree-data="treeData"
            placeholder="请选择父级节点"
            :load-data="onLoadData"
            v-decorator="['pid']"/>
        </a-form-item>
        <a-form-item label="类型名称">
          <a-input
            size="large"
            type="text"
            v-decorator="['name', {rules: [{required: true, message: '请输入类型名称！'}], validateTrigger: ['change', 'blur']}]"/>
        </a-form-item>
        <a-form-item label="类型编码">
          <a-input
            size="large"
            type="text"
            v-decorator="['code', {rules: [{required: true, message: '请输入类型编码！'}], validateTrigger: ['change', 'blur']}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'

export default {
  name: 'CategoryModal',
  components: {
    STable
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
      title: '操作',
      width: 800,
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      expandedRowKeys: [],
      pidField: 'pid',
      subExpandedKeys: []

    }
  },
  created () {
  },
  computed: {
    disabled () {
      return !!this.model.id
    }
  },
  methods: {
    add () {
      this.edit({})
    },
    edit (record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleOk () {
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
        } else {
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>
