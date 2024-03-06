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
            v-decorator="['contractId']"/>
          <a-input
            size="large"
            type="text"
            v-decorator="['apartmentId']"/>
          <a-input
            size="large"
            type="text"
            v-decorator="['roomId']"/>
          <a-input
            size="large"
            type="text"
            v-decorator="['userId']"/>
          <a-input
            size="large"
            type="text"
            v-decorator="['renterId']"/>
        </a-form-item>
        <a-row class="form-row" :gutter="16">
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderNumber')">
              <a-input
                size="large"
                type="text"
                disabled=""
                :placeholder="$t('order.label.form.orderNumber')"
                v-decorator="['orderNumber', {}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.contractNumber')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                disabled=""
                :placeholder="$t('order.label.form.contractNumber')"
                v-decorator="['contractNumber', {rules: [{required: true, message: $t('order.label.form.contractNumber.required')}]}]"
              ></a-input>
              <a-button type="primary" @click="openContractSelectModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.apartmentName')">
              <a-input
                size="large"
                type="text"
                disabled=""
                :placeholder="$t('order.label.form.apartmentName')"
                v-decorator="['apartmentName', {rules: [{required: true, message: $t('order.label.form.apartmentName.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.roomNumber')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('order.label.form.roomNumber')"
                disabled=""
                v-decorator="['roomNumber',{rules: [{required: true, message: $t('order.label.form.roomNumber.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.renterName')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('order.label.form.renterName')"
                disabled=""
                v-decorator="['renterName',{rules: [{required: true, message: $t('order.label.form.renterName.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderStatus')">
              <a-select
                placeholder="请选择"
                size="large"
                :options="orderStatusOption"
                v-decorator="['orderStatus', {rules: [{required: true, message: $t('order.label.form.orderStatus.required')}], initialValue: 0}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderType')">
              <a-select
                placeholder="请选择"
                size="large"
                :options="orderTypeOption"
                @change="orderTypeChangeEvent"
                v-decorator="['orderType', {rules: [{required: true, message: $t('order.label.form.orderType.required')}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderYear')">
              <a-input-number
                size="large"
                :min="1900"
                :max="2100"
                style="width: 100%"
                :precision="0"
                @change="currentYearChange"
                :placeholder="$t('order.label.form.orderYear')"
                v-decorator="['orderYear', {rules: [{required: true, message: $t('order.label.form.orderYear.required')}], initialValue: currentYear}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderMonth')">
              <a-input-number
                size="large"
                :min="1"
                :max="12"
                :precision="0"
                style="width: 100%"
                @change="currentMonthChange"
                :placeholder="$t('order.label.form.orderMonth')"
                v-decorator="['orderMonth', {rules: [{required: true, message: $t('order.label.form.orderMonth.required')}], initialValue: currentMonth}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('order.label.form.orderAmount')">
              <a-input-number
                size="large"
                :min="0"
                :precision="2"
                style="width: 100%"
                :placeholder="$t('order.label.form.orderAmount')"
                disabled=""
                v-decorator="['orderAmount', {rules: [{required: true, message: $t('order.label.form.orderMonth.required')}], initialValue: 0}]"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.room.label.form.remark')">
            <a-textarea
              :placeholder="$t('order.label.form.remark')"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
    <ContractSelectSearchModal
      ref="contractSelectSearchModal"
      @ok="contractSelectModalOk"
      :get-list="getContractList" />
  </page-header-wrapper>
</template>

<script>
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal.vue'
import RoomSelectSearchModal from '@/views/maindata/apartment/modal/RoomSearchModal.vue'
import RenterMainDataSelectSearchModal from '@/views/maindata/renter/modal/RenterMainDataSearchModal.vue'
import ContractSelectSearchModal from '@/views/contract/modal/ContractSearchModal.vue'
import { getList as getContractList } from '@/api/contract/ContractHeadApi'

export default {
  name: 'OrderForm',
  components: {
    ContractSelectSearchModal,
    RenterMainDataSelectSearchModal,
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
        'contractId',
        'apartmentId',
        'roomId',
        'userId',
        'renterId',
        'orderNumber',
        'contractNumber',
        'apartmentName',
        'roomNumber',
        'renterName',
        'orderStatus',
        'orderType',
        'orderYear',
        'orderMonth',
        'orderAmount',
        'remark'
      ],
      orderStatusOption: [],
      orderTypeOption: [],
      getContractList: getContractList,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    }
  },
  computed: {},
  created () {
    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    async initDict () {
      this.orderStatusOption = await getDictOption('order_status')
      this.orderTypeOption = await getDictOption('order_type')
    },
    openContractSelectModal () {
      this.$refs.contractSelectSearchModal.open({ 'contractStatus': 1 })
    },
    contractSelectModalOk () {
      const selectedRows = this.$refs.contractSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.contractId = selectedRows[0].id
      params.contractNumber = selectedRows[0].contractNumber
      params.apartmentId = selectedRows[0].apartmentId
      params.apartmentName = selectedRows[0].apartmentName
      params.roomId = selectedRows[0].roomId
      params.roomNumber = selectedRows[0].roomNumber
      params.renterId = selectedRows[0].renterId
      params.renterName = selectedRows[0].renterName
      params.userId = selectedRows[0].userId
      this.form.setFieldsValue(params)
      this.$emit('contractChange', params)
      this.$refs.contractSelectSearchModal.close()
    },
    orderTypeChangeEvent (value) {
      this.$emit('selectChange', value, 'orderType')
    },
    currentYearChange (value) {
      this.$emit('selectChange', value, 'orderYear')
    },
    currentMonthChange (value) {
      this.$emit('selectChange', value, 'orderMonth')
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
