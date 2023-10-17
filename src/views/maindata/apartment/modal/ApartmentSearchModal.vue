<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="() => { $emit('ok') }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="公寓编号">
              <a-input v-model="queryParam.apartmentNumber" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="省市区县">
              <Cascader
                :options="areaOptions"
                :load-data="loadAreaData"
                placeholder="请选择省市区（县）"
                change-on-select
                @change="cascadeOnChange"
                v-model="queryParam.areaCascader"
              />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="公寓地址">
                <a-input v-model="queryParam.apartmentAddress" placeholder="请输入公寓地址"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"/>
    </a-spin>
  </a-modal>
</template>

<script>
import { Cascader, notification } from 'ant-design-vue'
import { STable } from '@/components'
import { getTreeDataOptionByCode, getTreeDataOptionById } from '@/api/system/categoryApi'

const columns = [
  {
    title: '公寓编号',
    dataIndex: 'apartmentNumber'
  },
  {
    title: '所属省份',
    dataIndex: 'provinceId_dictText'
  },
  {
    title: '所属城市',
    dataIndex: 'cityId_dictText'
  },
  {
    title: '所属区县',
    dataIndex: 'areaId_dictText'
  },
  {
    title: '公寓地址',
    dataIndex: 'apartmentAddress'
  }
]

  export default {
    name: 'ApartmentSelectSearchModal',
    components: { Cascader, STable },
    props: {
      getList: {
        type: Function,
        default: null,
        required: true
      }
    },
    data () {
      this.columns = columns
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
        title: '公寓选择',
        visible: false,
        // 高级搜索 展开/关闭
        advanced: false,
        visibleCheck: true,
        // 查询参数
        queryParam: {},
        areaOptions: [],
        loadAreaData: selectOption => {
          this.loadCategory(selectOption)
        },
        selectedRowKeys: [],
        selectedRows: [],
        confirmLoading: false,
        loadData: parameter => {
          const cascadeOption = this.queryParam.areaCascader
          if (cascadeOption) {
            // 移除查询条件中的级联数组，避免接口报错
            delete this.queryParam.areaCascader
            delete this.queryParam.provinceId
            delete this.queryParam.cityId
            delete this.queryParam.areaId
            if (cascadeOption[0]) {
              this.queryParam.provinceId = cascadeOption[0]
            }
            if (cascadeOption[1]) {
              this.queryParam.cityId = cascadeOption[1]
            }
            if (cascadeOption[2]) {
              this.queryParam.areaId = cascadeOption[2]
            }
          }
          return this.getList(parameter.pageNo, parameter.pageSize, this.queryParam).then(res => {
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
    },
    methods: {
      async initDict () {
        // 查询表单区域选项
        this.areaOptions = await getTreeDataOptionByCode('area_code')
      },
      // 关闭
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.queryParam = {}
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      /**
       * 加载级联数据
       * @param selectOption 级联数据对象
       * @returns {Promise<void>}
       */
      async loadCategory (selectOption) {
        const targetOption = selectOption[selectOption.length - 1]
        targetOption.loading = true
        targetOption.children = await getTreeDataOptionById(targetOption.value)
        this.areaOptions = [...this.areaOptions]
        targetOption.loading = false
      },
      open (params) {
        this.visible = true
        this.queryParam = Object.assign(this.queryParam, params)
        this.$nextTick(() => {
          this.$refs.table.loadData()
        })
        this.initDict()
      },
      cascadeOnChange (value) {},
      toggleAdvanced () {
        this.advanced = !this.advanced
      }
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  }
</script>
