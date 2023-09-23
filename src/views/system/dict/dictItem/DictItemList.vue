<template>
  <a-card :bordered="false">
    <!-- 抽屉 -->
    <a-drawer
      title="字典列表"
      :width="screenWidth"
      @close="onClose"
      :visible="visible"
    >
      <div
        :style="{
          padding:'10px',
          border: '1px solid #e9e9e9',
          background: '#fff',
        }">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" :form="queryForm">
            <a-row :gutter="10">
              <a-col :md="8" :sm="12">
                <a-form-item label="名称">
                  <a-input style="width: 120px;" placeholder="请输入名称" v-model="queryParam.itemText"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="9" :sm="24">
                <a-form-item label="状态" style="width: 170px" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select
                    placeholder="请选择"
                    v-model="queryParam.status"
                    :options="statusOption">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="7" :sm="24">
                <span style="float: left;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery">搜索</a-button>
                  <a-button type="primary" @click="searchReset" style="margin-left: 8px">重置</a-button>
                </span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="2" :sm="24">
                <a-button style="margin-bottom: 10px" type="primary" @click="handleAdd">新增</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <s-table
            ref="itemTable"
            rowKey="id"
            size="middle"
            :columns="columns"
            :data="loadData"
            showPagination="auto"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
      </div>
    </a-drawer>
    <!-- 字典数据 -->
    <DictItemModal
      ref="modalForm"
      @ok="modalFormOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import pick from 'lodash.pick'
import DictItemModal from '@/views/system/dict/dictItem/DictItemModal'
import { getDictOption, getList, deleteData } from '@/api/system/dictItemApi'
import { notification } from 'ant-design-vue'

export default {
  name: 'DictItemList',
  components: { DictItemModal, STable },
  data () {
    return {
      columns: [
        {
          title: '名称',
          align: 'center',
          dataIndex: 'itemText'
        },
        {
          title: '数据值',
          align: 'center',
          dataIndex: 'itemValue'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {},
      title: '操作',
      visible: false,
      itemFormVisible: false,
      screenWidth: 800,
      model: {},
      dictId: '',
      status: 1,
      statusOption: [],
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
      },
      queryForm: this.$form.createForm(this),
      validatorRules: {
        itemText: { rules: [{ required: true, message: '请输入名称!' }] },
        itemValue: { rules: [{ required: true, message: '请输入数据值!' }] }
      },
      loadData: parameter => {
        // 装载字典id
        this.queryParam.dictId = this.dictId
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
      }
    }
  },
  created () {
    // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
    this.resetScreenSize()
  },
  methods: {
    async initDict () {
      // 是否冻结
      this.statusOption = await getDictOption('yn')
    },
    add (dictId) {
      this.dictId = dictId
      this.edit({})
    },
    edit (record) {
      if (record && record.id) {
        this.dictId = record.id
      }
      this.initDict()
      this.queryParam = {}
      this.queryForm.resetFields()
      this.model = Object.assign({}, record)
      this.model.dictId = this.dictId
      this.model.status = this.status
      this.visible = true
      this.$nextTick(() => {
        this.$refs.itemTable.loadData()
        this.queryForm.setFieldsValue(pick(this.model, 'itemText', 'itemValue'))
      })
    },
    // 添加字典数据
    handleAdd () {
      this.$refs.modalForm.add(this.dictId)
      this.$refs.modalForm.title = '新增'
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.queryForm.resetFields()
      this.dataSource = []
    },
    // 抽屉的宽度随着屏幕大小来改变
    resetScreenSize () {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 600) {
        this.screenWidth = screenWidth
      } else {
        this.screenWidth = 600
      }
    },
    // 增加样式方法返回值
    getRowClassname (record) {
      if (record.status === 0) {
        return 'data-rule-invalid'
      }
    },
    searchQuery () {
      this.$refs.itemTable.loadData()
    },
    searchReset () {
      this.queryParam = {}
      this.queryForm.resetFields()
    },
    modalFormOk () {},
    handleEdit (record) {
      this.$refs.modalForm.edit(record)
    },
    handleDelete (id) {
      deleteData(id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          // 刷新列表
          this.$refs.itemTable.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .data-rule-invalid {
  background: #f4f4f4;
  color: #bababa;
}
</style>
