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
          <tree-select
            ref="treeSelect"
            :replaceFields="replaceFields"
            :tree-data="treeData"
            placeholder="请选择父级节点"
            :load-data="onLoadData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
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
import { getChildrenList, getRootList } from '@/api/system/categoryApi'
import { TreeSelect, notification } from 'ant-design-vue'

export default {
  name: 'CategoryModal',
  components: {
    STable,
    TreeSelect
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
      subExpandedKeys: [],
      treeData: [],
      form: this.$form.createForm(this),
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' }
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
      getRootList({}).then(res => {
        if (res.code !== 200) {
          notification.error({
            message: '请求列表数据失败',
            description: '请求列表数据失败,请稍后重试'
          })
          return []
        }
        this.treeData = this.checkIsLeaf(res.result)
      })
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
    },
    checkIsLeaf (list) {
      return list.map(item => {
        item.pId = item.pid
        if (item.hasChild !== '1') {
          item.isLeaf = true
        }
        return item
      })
    },
    onLoadData (treeNode) {
      return new Promise(resolve => {
        const record = treeNode.dataRef
        getChildrenList({ 'pid': record.id }).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
            return []
          }
          this.addChildren(record.id, res.result, this.treeData)
          this.treeData = [...this.treeData]
          console.log(this.treeData)
          resolve()
        })
      })
    },
    addChildren (pid, children, treeArray) {
      if (treeArray && treeArray.length > 0) {
        for (const item of treeArray) {
          if (item.id === pid) {
            if (!children || children.length === 0) {
              item.isLeaf = true
            } else {
              item.children = children
            }
            break
          } else {
            this.addChildren(pid, children, item.children)
          }
        }
      }
    }
  }
}
</script>
