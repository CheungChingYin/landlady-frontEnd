<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
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
                disabled="true"
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
            <a-form-item :label="$t('maindata.apartment.label.form.provinceId')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.provinceId')"
                v-decorator="['provinceId', {rules: [{ required: true, message: $t('maindata.apartment.provinceId.require') }], validateTrigger: ['change', 'blur']}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.cityId')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.cityId')"
                v-decorator="['cityId', {rules: [{ required: true, message: $t('maindata.apartment.cityId.require') }], validateTrigger: ['change', 'blur']}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.areaId')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.areaId')"
                v-decorator="['areaId', {rules: [{ required: true, message: $t('maindata.apartment.areaId.require') }], validateTrigger: ['change', 'blur']}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentAddress')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentAddress')"
                v-decorator="['apartmentAddress', {rules: [{ required: true, message: $t('maindata.apartment.apartmentAddress.require') }], validateTrigger: ['change', 'blur']}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentArea')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentArea')"
                v-decorator="['apartmentArea']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentHeight')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentHeight')"
                v-decorator="['apartmentHeight']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item :label="$t('maindata.apartment.label.form.apartmentCompletionDate')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.apartment.label.form.apartmentCompletionDate')"
                v-decorator="['apartmentCompletionDate']"
              ></a-input>
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
import { addData, editData, queryById } from '@/api/system/userApi'
import { notification } from 'ant-design-vue'
// import { getDictOption } from '@/api/system/dictItemApi'
import pick from 'lodash.pick'
export default {
  name: 'ApartmentForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      queryData: {},
      form: this.$form.createForm(this),
      isAddForm: false
    }
  },
  computed: {},
  methods: {
    loadData (id) {
      queryById(id).then(res => {
        if (res.code !== 200) {
          notification.error({
            message: '加载表单数据失败',
            description: '请联系管理员'
          })
          return
        }
        this.form.setFieldsValue(pick(res.result, ['name', 'email', 'phoneNumber', 'isFreeze']))
        this.queryData = res.result
      })
    },
    async initDict () {
      // 是否冻结
      // this.isFreezeOption = await getDictOption('yn')
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      const fieldArray = ['name', 'email', 'phoneNumber', 'isFreeze']
      if (this.isAddForm) {
        fieldArray.push('password')
        fieldArray.push('password2')
      }
      this.form.validateFields(fieldArray, (err, values) => {
        if (!err) {
          if (this.isAddForm) {
            addData(values).then(res => {
              if (res.code !== 200) {
                notification.error({
                  message: '保存失败',
                  description: res.message
                })
              } else {
                notification.success({
                  message: '保存成功'
                })
                // 保存成功，返回列表页
                this.routeBackHandler()
              }
            })
          } else {
            const data = Object.assign(this.queryData, values)
            editData(data).then(res => {
              if (res.code !== 200) {
                notification.error({
                  message: '保存失败',
                  description: res.message
                })
              } else {
                notification.success({
                  message: '保存成功'
                })
                this.loadData(res.result.id)
              }
            })
          }
        }
      })
    }
  },
  mounted () {
    this.initDict()
    let id = null
    if (this.$route.params) {
      id = this.$route.params.id
    }
    if (id == null) {
      this.isAddForm = true
      return
    }
    this.loadData(id)
  }
}
</script>
