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
            v-decorator="['pid']"
            :disabled="!isAddForm"/>
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
import { addData, editData, getChildrenList, getRootList, queryById } from '@/api/system/categoryApi'
import { TreeSelect, notification } from 'ant-design-vue'
import pick from 'lodash.pick'

const fields = ['id', 'name', 'code', 'pid']

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
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
      isAddForm: false
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
  },
  computed: {
    disabled () {
      return !!this.model.id
    }
  },
  methods: {
    add (record) {
      this.isAddForm = true
      this.visible = true
      if (record === undefined || record == null) {
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
      } else {
        // 渲染父级目录数据
        queryById(record.id).then(res => {
          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            const data = []
            data.push(res.result)
            this.treeData = data
          }
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({ pid: record.id })
        })
      }
    },
    edit (record) {
      this.isAddForm = false
      queryById(record.id).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          // 不是顶级目录
          if (res.result.pid !== '0') {
            // 父节点数据渲染
            queryById(res.result.pid).then(res => {
              if (res.code !== 200) {
                this.$message.error(res.message)
              } else {
                const data = []
                data.push(res.result)
                this.treeData = data
              }
            })
          }
          this.form.setFieldsValue(pick(res.result, fields))
        }
      })
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.form.resetFields()
    },
    handleOk () {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let request = null
          if (this.isAddForm) {
            request = addData(values)
          } else {
            request = editData(values)
          }
          request.then(res => {
            if (res.code !== 200) {
              this.$message.error(res.message)
            } else {
              this.$message.success(res.message)
              // 刷新列表页数据
              this.$parent.$parent.$refs.table.loadData()
              this.$parent.$parent.expandedRowKeys = []
              // 关闭弹窗
              this.close()
            }
          })
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
