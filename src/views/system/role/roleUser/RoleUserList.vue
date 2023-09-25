<template>
  <a-card :bordered="false">
    <!-- 抽屉 -->
    <a-drawer
      title="角色授权用户列表"
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
                <a-form-item label="姓名">
                  <a-input style="width: 120px;" placeholder="请输入姓名" v-model="queryParam.name"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="9" :sm="24">
                <a-form-item label="手机号" style="width: 170px" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input style="width: 120px;" placeholder="请输入手机号" v-model="queryParam.phoneNumber"></a-input>
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
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
        <UserSelectSearchModal
          ref="userSelectSearchModal"
          @ok="modalFormOk"
          :getList="getUnAuthorizedUserListByRoleId"/>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import DictItemModal from '@/views/system/dict/dictItem/DictItemModal'
import {
  getUserListByRoleId,
  getUnAuthorizedUserListByRoleId,
  deleteRoleUserRelation,
  addRoleUserRelation
} from '@/api/system/roleApi'
import { notification } from 'ant-design-vue'
import UserSelectSearchModal from '@/views/system/user/UserSelectSearchModal'

export default {
  name: 'DictItemList',
  components: { UserSelectSearchModal, DictItemModal, STable },
  data () {
    return {
      columns: [
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phoneNumber'
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
      screenWidth: 800,
      model: {},
      roleId: '',
      getUnAuthorizedUserListByRoleId: getUnAuthorizedUserListByRoleId,
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
        this.queryParam.roleId = this.roleId
        return getUserListByRoleId(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
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
    async initDict () {},
    open (record) {
      if (record && record.id) {
        this.roleId = record.id
      }
      this.initDict()
      this.queryParam = {}
      this.queryForm.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.itemTable.loadData()
        // this.queryForm.setFieldsValue(pick(this.model, 'itemText', 'itemValue'))
      })
    },
    // 添加角色用户授权
    handleAdd () {
      const record = { roleId: this.roleId }
      this.$refs.userSelectSearchModal.open(record)
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
    modalFormOk () {
      const rows = this.$refs.userSelectSearchModal.selectedRows
      const dataList = []
      rows.forEach(row => {
        const data = {}
        data.roleId = this.roleId
        data.userId = row.id
        dataList.push(data)
      })
      addRoleUserRelation(dataList, this.roleId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          // 刷新列表
          this.$refs.itemTable.loadData()
          // 关闭弹窗
          this.$refs.userSelectSearchModal.close()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDelete (record) {
      deleteRoleUserRelation(record.userRoleId).then(res => {
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
