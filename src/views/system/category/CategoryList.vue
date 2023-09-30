<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <div>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        :expandedRowKeys.sync="expandedRowKeys"
        @expand="handleExpand">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a @click="handleAddSub(record)">添加下级</a>
        </span>
      </s-table>
    </div>

    <CategoryModal ref="modalForm"/>
  </a-card>
</template>

<script>

import { STable } from '@/components'
import CategoryModal from '@/views/system/category/CategoryModal'
import { deleteData, getChildrenList, getList } from '@/api/system/categoryApi'
import { notification } from 'ant-design-vue'

export default {
  name: 'SysCategoryList',
  components: {
    CategoryModal,
    STable
  },
  data () {
    return {
      description: '分类字典管理页面',
      // 表头
      columns: [
        {
          title: '分类名称',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title: '分类编码',
          align: 'left',
          dataIndex: 'code'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      dictOptions: {},
      subExpandedKeys: [],
      queryParam: {},
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
          res.result.records = this.checkHasChild(res.result.records)
          return res.result
        })
      }
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleEdit (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    handleAdd () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    batchDel () {

    },
    handleDelete (record) {
      deleteData(record.id).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.$refs.table.loadData()
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleExpand (expanded, record) {
      // 展开
      if (expanded) {
        // 展开节点
        this.expandedRowKeys.push(record.id)
        getChildrenList({ 'pid': record.id }).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: '请求列表数据失败',
              description: '请求列表数据失败,请稍后重试'
            })
            return []
          }
          record.children = this.checkHasChild(res.result)
        })
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => item !== record.id)
      }
    },
    handleAddSub (record) {
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '添加下级'
      this.$refs.modalForm.disableSubmit = false
    },
    checkHasChild (list) {
      return list.map(item => {
        if (item.hasChild === '1') {
          item.children = []
        }
        return item
      })
    }
  }
}
</script>
