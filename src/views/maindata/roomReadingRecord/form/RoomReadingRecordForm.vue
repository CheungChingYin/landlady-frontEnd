<template>
  <page-header-wrapper :title="false">
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
            v-decorator="['apartmentId']"/>
          <a-input
            size="large"
            type="text"
            v-decorator="['roomId']"/>/>
        </a-form-item>
        <a-row class="form-row" :gutter="16">
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.apartmentId_dictText')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                disabled=""
                :placeholder="$t('maindata.reading.label.form.apartmentId_dictText')"
                v-decorator="['apartmentId_dictText', {rules: [{required: true, message: $t('maindata.reading.label.form.apartmentId_dictText.require')}]}]"
              ></a-input>
              <a-button type="primary" @click="openModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.roomId_dictText')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                :placeholder="$t('maindata.reading.label.form.roomId_dictText')"
                disabled=""
                v-decorator="['roomId_dictText',{rules: [{required: true, message: $t('maindata.reading.label.form.roomId_dictText.required')}]}]"
              ></a-input>
              <a-button type="primary" @click="openRoomSelectModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.readingYear')">
              <a-input-number
                size="large"
                style="width: 80%"
                :min="1900"
                :max="2100"
                :precision="0"
                :placeholder="$t('maindata.reading.label.form.readingYear')"
                v-decorator="['readingYear', {initialValue: currentYear, rules: [{required: true, message: $t('maindata.reading.label.form.readingYear.required')}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.readingMonth')">
              <a-input-number
                size="large"
                style="width: 80%"
                :min="1"
                :max="12"
                :precision="0"
                :placeholder="$t('maindata.reading.label.form.readingMonth')"
                v-decorator="['readingMonth', {initialValue: currentMonth, rules: [{required: true, message: $t('maindata.reading.label.form.readingMonth.required')}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.readingType')">
              <a-select
                placeholder="请选择"
                :options="readingTypeOption"
                v-decorator="['readingType',{rules: [{required: true, message: $t('maindata.reading.label.form.readingType.required')}]} ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.reading')">
              <a-input-number
                size="large"
                style="width: 80%"
                :min="0"
                :precision="2"
                :placeholder="$t('maindata.reading.label.form.reading')"
                v-decorator="['reading', { rules: [{required: true, message: $t('maindata.reading.label.form.reading.required')}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.reading.label.form.createBy_dictText')">
              <a-input
                size="large"
                type="text"
                style="width: 80%"
                disabled=""
                :placeholder="$t('maindata.reading.label.form.createBy_dictText')"
                v-decorator="['createBy_dictText', {initialValue: currentUser.name}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.reading.label.form.remark')">
            <a-textarea
              :placeholder="$t('maindata.reading.label.form.remark')"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
    <ApartmentSelectSearchModal
      ref="userSelectSearchModal"
      @ok="apartmentSelectModalOk"
      :get-list="getApartList"/>
    <RoomSelectSearchModal
      ref="roomSelectSearchModal"
      @ok="roomSelectModalOk"
      :get-list="getRoomList"/>
  </page-header-wrapper>
</template>

<script>
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal.vue'
import { getList as getRoomList } from '@/api/maindata/RoomMainDataApi'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import RoomSelectSearchModal from '@/views/maindata/apartment/modal/RoomSearchModal.vue'

export default {
  name: 'RoomReadingRecordForm',
  components: {
    RoomSelectSearchModal,
    ApartmentSelectSearchModal
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
      fields: [
        'id',
        'apartmentId',
        'roomId',
        'apartmentId_dictText',
        'roomId_dictText',
        'readingYear',
        'readingMonth',
        'readingType',
        'reading',
        'createBy_dictText',
        'remark'
      ],
      readingTypeOption: [],
      getApartList: getApartmentList,
      getRoomList: getRoomList,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentUser: storage.get(USER_INFO)
    }
  },
  computed: {},
  created () {
    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    async initDict () {
      this.readingTypeOption = await getDictOption('reading_type')
    },
    openModal () {
      this.$refs.userSelectSearchModal.open({})
    },
    apartmentSelectModalOk () {
      const selectedRows = this.$refs.userSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.apartmentId = selectedRows[0].id
      params.apartmentId_dictText = selectedRows[0].apartmentNumber
      this.form.setFieldsValue(params)
      this.$refs.userSelectSearchModal.close()
    },
    /**
     * 房间选择模态框打开
     */
    openRoomSelectModal () {
      const apartmentId = this.form.getFieldValue('apartmentId')
      if (apartmentId == null || apartmentId === '') {
        this.$message.error('请先选择公寓')
        return
      }
      this.$refs.roomSelectSearchModal.open({ apartmentId: apartmentId, roomStatus: 0 })
    },
    roomSelectModalOk () {
      const selectedRows = this.$refs.roomSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.roomId = selectedRows[0].id
      params.roomId_dictText = selectedRows[0].roomNumber
      this.form.setFieldsValue(params)
      this.$refs.roomSelectSearchModal.close()
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
