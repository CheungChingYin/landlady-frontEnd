<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :form="form">
        <a-form-item label="" v-show="false">
          <a-input
            size="large"
            type="text"
            v-decorator="['id']"/>
        </a-form-item>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentNumber')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentNumber')"
                disabled
                v-decorator="['apartmentNumber']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentName')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentName')"
                v-decorator="['apartmentName', {rules: [{ required: true, message: $t('maindata.apartment.apartmentName.require') }], validateTrigger: ['change', 'blur']}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.locate')">
              <Cascader
                :options="areaOptions"
                :load-data="loadAreaData"
                placeholder="请选择省市区（县）"
                change-on-select
                @change="cascadeOnChange"
                v-model="locate"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.apartment.label.form.apartmentAddress')">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('maindata.apartment.label.form.apartmentAddress')"
              v-decorator="['apartmentAddress', {rules: [{ required: true, message: $t('maindata.apartment.apartmentAddress.require') }], validateTrigger: ['change', 'blur']}]"
            ></a-input>
          </a-form-item>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentArea')">
              <a-input-number
                size="large"
                style="width: 100%"
                :min="0"
                :precision="2"
                :formatter="value => `${value}m²`"
                :parser="value => value.replace('m²', '')"
                :placeholder="$t('maindata.apartment.label.form.apartmentArea')"
                v-decorator="['apartmentArea', {initialValue: 0}]"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentHeight')">
              <a-input-number
                size="large"
                style="width: 100%"
                :min="0"
                :precision="2"
                :formatter="value => `${value}m`"
                :parser="value => value.replace('m', '')"
                :placeholder="$t('maindata.apartment.label.form.apartmentHeight')"
                v-decorator="['apartmentHeight', {initialValue: 0}]"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentCompletionDate')">
              <a-date-picker
                size="large"
                style="width: 100%"
                :disabled-date="disabledDate"
                :placeholder="$t('maindata.apartment.label.form.apartmentCompletionDate')"
                v-decorator="['apartmentCompletionDate']"
              ></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.ownerName')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.ownerName')"
                v-decorator="['ownerName']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.ownerIdNumber')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.ownerIdNumber')"
                v-decorator="['ownerIdNumber']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.apartment.label.form.remark')">
            <a-textarea
              :placeholder="$t('maindata.apartment.label.form.remark')"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Cascader } from 'ant-design-vue'
import { getTreeDataOptionByCode, getTreeDataOptionById } from '@/api/system/categoryApi'
import moment from 'moment'

export default {
  name: 'ApartmentForm',
  components: {
    Cascader
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      areaOptions: [],
      loadAreaData: selectOption => {
        this.loadCategory(selectOption)
      },
      locate: [],
      fields: [
        'id',
        'apartmentNumber',
        'apartmentName',
        'apartmentAddress',
        'apartmentArea',
        'apartmentHeight',
        'apartmentCompletionDate',
        'ownerName',
        'ownerIdNumber',
        'remark'
      ]
    }
  },
  computed: {},
  created () {
    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    async initDict () {
      // 查询表单区域选项
      this.areaOptions = await getTreeDataOptionByCode('area_code')
      console.log(this.locate.length)
      console.log(this.locate)
      // 编辑的时候加载省市区
      if (this.locate.length === 3) {
        // 省份对象
        const provinceObject = this.areaOptions.find(item => item.value === this.locate[0])
        if (provinceObject) {
          // 添加城市数据
          provinceObject.children = await getTreeDataOptionById(this.locate[0])
          // 城市对象
          const cityObject = provinceObject.children.find(item => item.value === this.locate[1])
          if (cityObject) {
            // 添加区县数据
            cityObject.children = await getTreeDataOptionById(this.locate[1])
            this.areaOptions = [...this.areaOptions]
          }
        }
      }
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
    cascadeOnChange (value) {
      console.log(value)
    },
    disabledDate (current) {
      // 竣工日期不能大于当前时间
      return current && current > moment().endOf('day')
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
