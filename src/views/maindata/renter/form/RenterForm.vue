<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form :form="form">
      <a-form-item label="" v-show="false">
        <a-input
          size="large"
          type="text"
          v-decorator="['id']"/>
        <a-input
          size="large"
          type="text"
          v-decorator="['userId', {rules: [{required: true, message: $t('maindata.renter.label.form.userId_dictText.require')}], validateTrigger: ['change', 'blur']}]"/>
        <a-input
          size="large"
          type="text"
          v-decorator="['frontAttachmentId']"/>
        <a-input
          size="large"
          type="text"
          v-decorator="['reverseAttachmentId']"/>
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
              @change="handleChangeFront">
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
          <a-form-item :label="$t('maindata.renter.label.form.userName')">
            <a-input
              size="large"
              type="text"
              style="width: 65%;margin-right: 5%"
              :placeholder="$t('maindata.renter.label.form.userName')"
              disabled
              v-decorator="['userId_dictText', {rules: [{required: true, message: $t('maindata.renter.label.form.userId_dictText.require')}], validateTrigger: ['change', 'blur']}]"/>
            <a-button type="primary" @click="openModal">选择</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24 / colCount">
          <a-form-item :label="$t('maindata.renter.label.form.name')">
            <a-input
              size="large"
              type="text"
              v-decorator="['name', {rules: [{required: true, message: $t('maindata.renter.label.form.name.require')}], validateTrigger: ['change', 'blur']}]"/>
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
      <a-row>
        <a-col :span="24">
          <a-form-item :label="$t('maindata.renter.label.form.remark')">
            <a-textarea
              rows="4"
              :placeholder="$t('maindata.renter.label.form.remark')"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div>
      <UserSelectSearchModal
        ref="userSelectSearchModal"
        @ok="modalFormOk"
        :getList="getUserListNotInRenterMainData"/>
    </div>
  </a-card>
</template>

<script>
import { Cascader } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment/moment'
import UserSelectSearchModal from '@/views/system/user/UserSelectSearchModal.vue'
import { getUserListNotInRenterMainData } from '@/api/maindata/RenterMainDataApi'

export default {
  name: 'RenterForm',
  components: {
    UserSelectSearchModal,
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
        'Authorization': storage.get(ACCESS_TOKEN),
        'needAttachment': 'true'
      },
      fields: [
        'id',
        'userId',
        'userId_dictText',
        'name',
        'gender',
        'nation',
        'birthday',
        'address',
        'idNumber',
        'signOffice',
        'effectiveDate',
        'expireDate',
        'remark',
        'frontAttachmentId',
        'reverseAttachmentId'
      ],
      getUserListNotInRenterMainData: getUserListNotInRenterMainData
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
    handleChangeFront (info) {
      // 上传后回调
      if (info.file.status === 'done') {
        const response = info.file.response
        if (response.code !== 200) {
          this.$message.error(response.message)
          return
        }
        // 附件ID
        const attachmentId = response.result.attachment.id
        response.result.frontAttachmentId = attachmentId
        // 赋值
        this.form.setFieldsValue(response.result)
        // 身份证正面图像预览
        this.frontImageUrl = '/api/sys/file/download/' + attachmentId
      }
    },
    handleChange (info) {
      // 上传后回调
      if (info.file.status === 'done') {
        const response = info.file.response
        if (response.code !== 200) {
          this.$message.error(response.message)
          return
        }
        // 性别转换
        if (response.result.gender !== undefined && response.result.gender !== '') {
          for (const item of this.sexOption) {
            if (response.result.gender === item.label) {
              response.result.gender = item.value
              break
            }
          }
        }
        // 附件ID
        const attachmentId = response.result.attachment.id
        response.result.reverseAttachmentId = attachmentId
        // 赋值
        this.form.setFieldsValue(response.result)
        // 身份证反面图像预览
        this.reverseImageUrl = '/api/sys/file/download/' + attachmentId
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
    },
    openModal () {
      this.$refs.userSelectSearchModal.open({})
    },
    modalFormOk () {
      const selectedRows = this.$refs.userSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.userId = selectedRows[0].id
      params.userId_dictText = selectedRows[0].name
      this.form.setFieldsValue(params)
      this.$refs.userSelectSearchModal.close()
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
