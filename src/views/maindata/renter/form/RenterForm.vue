<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form :form="form">
      <a-form-item label="" v-show="false">
        <a-input
          size="large"
          type="text"
          v-decorator="['id']"/>
      </a-form-item>
      <a-row class="form-row" :gutter="[24, 8]">
        <a-col :span="8">
          <a-form-item :label="$t('maindata.renter.label.form.frontAttachmentId')">
            <a-upload
              name="file"
              :headers="headers"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/api/ocr/idCardFrontOCR"
              :before-upload="beforeUpload"
              @change="handleChange">
              <img :src="frontImageUrl" alt="avatar" class="idCardPic" />
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('maindata.renter.label.form.reverseAttachmentId')">
            <a-upload
              name="file"
              :headers="headers"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/api/ocr/idCardReverseOCR"
              :before-upload="beforeUpload"
              @change="handleChange">
              <img :src="reverseImageUrl" alt="avatar" class="idCardPic" />
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="[24, 8]">
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.name')">
            <a-input
              size="large"
              type="text"
              v-decorator="['name', {rules: [{required: true, message: $t('maindata.renter.label.form.require')}], validateTrigger: ['change', 'blur']}]"/>
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.gender')">
            <a-radio-group
              :options="sexOption"
              v-decorator="['gender', {rules: [{required: true, message: $t('maindata.renter.label.form.gender.require')}], validateTrigger: ['change', 'blur']}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.nation')">
            <a-input
              size="large"
              type="text"
              v-decorator="['nation', {rules: [{required: true, message: $t('maindata.renter.label.form.nation.require')}], validateTrigger: ['change', 'blur']}]"/>
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.birthday')">
            <a-date-picker
              size="large"
              style="width: 100%"
              :disabled-date="disabledDate"
              :placeholder="$t('maindata.renter.label.form.birthday')"
              v-decorator="['birthday', {rules: [{required: true, message: $t('maindata.renter.label.form.birthday.require')}], validateTrigger: ['change', 'blur']}]"
            ></a-date-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="[24, 8]">
        <a-col :span="24">
          <a-form-item :label="$t('maindata.renter.label.form.address')">
            <a-input
              size="large"
              type="text"
              v-decorator="['address', {rules: [{required: true, message: $t('maindata.renter.label.form.address.require')}], validateTrigger: ['change', 'blur']}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="[24, 8]">
        <a-col :span="24">
          <a-form-item :label="$t('maindata.renter.label.form.idNumber')">
            <a-input
              size="large"
              type="text"
              v-decorator="['idNumber', {rules: [{required: true, message: $t('maindata.renter.label.form.idNumber.require')}], validateTrigger: ['change', 'blur']}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="[24, 8]">
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.signOffice')">
            <a-input
              size="large"
              type="text"
              v-decorator="['signOffice']"/>
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.effectiveDate')">
            <a-date-picker
              size="large"
              style="width: 100%"
              :disabled-date="disabledDate"
              :placeholder="$t('maindata.renter.label.form.effectiveDate')"
              v-decorator="['effectiveDate', {rules: [{required: true, message: $t('maindata.renter.label.form.effectiveDate.require')}], validateTrigger: ['change', 'blur']}]"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.expireDate')">
            <a-date-picker
              size="large"
              style="width: 100%"
              :disabled-date="disabledDate"
              :placeholder="$t('maindata.renter.label.form.expireDate')"
              v-decorator="['expireDate', {rules: [{required: true, message: $t('maindata.renter.label.form.expireDate.require')}], validateTrigger: ['change', 'blur']}]"
            ></a-date-picker>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import { Cascader } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment/moment'

export default {
  name: 'RenterForm',
  components: {
    Cascader
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    colCount: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      sexOption: [],
      frontImageUrl: '/idCardSampleFront.png',
      reverseImageUrl: '/idCardSampleReverse.png',
      headers: {
        'Authorization': storage.get(ACCESS_TOKEN)
      },
      fields: [
        'id',
        'assetsNumber',
        'assetsName',
        'assetsDesc',
        'skuNumber',
        'unit',
        'isFreeze',
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
      this.sexOption = await getDictOption('sex')
    },
    handleChange (info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        // this.imageUrl = imageUrl
        this.loading = false
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      return isJpgOrPng
    },
    disabledDate (current) {
      // 日期不能大于当前时间
      return current && current > moment().endOf('day')
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 400px;
  height: 200px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.idCardPic {
  width: 400px;
  height: 200px;
}
</style>
