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
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.contractNumber')">
              <a-input
                size="large"
                type="text"
                disabled=""
                :placeholder="$t('contract.label.form.contractNumber')"
                v-decorator="['apartmentName', {}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.contractName')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('contract.label.form.contractName')"
                v-decorator="['contractName', {rules: [{required: true, message: $t('contract.label.form.contractName.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.apartmentName')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                disabled=""
                :placeholder="$t('contract.label.form.apartmentName')"
                v-decorator="['apartmentName', {rules: [{required: true, message: $t('contract.label.form.apartmentName.required')}]}]"
              ></a-input>
              <a-button type="primary" @click="openModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.roomNumber')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                :placeholder="$t('contract.label.form.roomNumber')"
                disabled=""
                v-decorator="['roomNumber',{rules: [{required: true, message: $t('contract.label.form.roomNumber.required')}]}]"
              ></a-input>
              <a-button type="primary" @click="openRoomSelectModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.renterName')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                :placeholder="$t('contract.label.form.renterName')"
                disabled=""
                v-decorator="['renterName',{rules: [{required: true, message: $t('contract.label.form.renterName.required')}]}]"
              ></a-input>
              <a-button type="primary" @click="openRenterSelectModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.rentStartDate')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('contract.label.form.rentStartDate')"
                v-decorator="['rentStartDate', {rules: [{required: true, message: $t('contract.label.form.rentStartDate.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.rentEndDate')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('contract.label.form.rentEndDate')"
                v-decorator="['rentEndDate', {rules: [{required: true, message: $t('contract.label.form.rentEndDate.required')}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('contract.label.form.contractStatus')">
              <a-select
                placeholder="请选择"
                :options="contractStatusOption"
                v-decorator="['contractStatus', {rules: [{required: true, message: $t('contract.label.form.contractStatus.required')}], initialValue: 0}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.room.label.form.remark')">
            <a-textarea
              :placeholder="$t('contract.label.form.remark')"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
    <ApartmentSelectSearchModal
      ref="apaetmentSelectSearchModal"
      @ok="apartmentSelectModalOk"
      :get-list="getApartList"/>

    <RoomSelectSearchModal
      ref="roomSelectSearchModal"
      @ok="roomSelectModalOk"
      :get-list="getRoomList"/>

    <RenterMainDataSelectSearchModal
      ref="renterMainDataSelectSearchModal"
      @ok="renterSelectModalOk"
      :get-list="getRenterList"/> >
  </page-header-wrapper>
</template>

<script>
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal.vue'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import RoomSelectSearchModal from '@/views/maindata/apartment/modal/RoomSearchModal.vue'
import { getList as getRoomList } from '@/api/maindata/RoomMainDataApi'
import { getList as getRenterList } from '@/api/maindata/RenterMainDataApi'
import RenterMainDataSelectSearchModal from '@/views/maindata/renter/modal/RenterMainDataSearchModal.vue'

export default {
  name: 'ContractForm',
  components: {
    RenterMainDataSelectSearchModal,
    RoomSelectSearchModal,
    ApartmentSelectSearchModal
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
      fields: [
        'id',
        'apartmentId',
        'roomId',
        'userId',
        'renterId',
        'contractNumber',
        'contractName',
        'apartmentName',
        'roomNumber',
        'renterName',
        'rentStartDate',
        'rentEndDate',
        'receiptDate',
        'contractStatus',
        'remark'
      ],
      contractStatusOption: [],
      getApartList: getApartmentList,
      getRoomList: getRoomList,
      getRenterList: getRenterList
    }
  },
  computed: {},
  created () {
    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    async initDict () {
      this.contractStatusOption = await getDictOption('contract_status')
    },
    openModal () {
      this.$refs.apaetmentSelectSearchModal.open({})
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
      this.$refs.roomSelectSearchModal.open({ apartmentId: apartmentId })
    },
    openRenterSelectModal () {
      this.$refs.renterMainDataSelectSearchModal.open({})
    },
    apartmentSelectModalOk () {
      const selectedRows = this.$refs.apaetmentSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.apartmentId = selectedRows[0].id
      params.apartmentName = selectedRows[0].apartmentNumber
      this.form.setFieldsValue(params)
      this.$refs.apaetmentSelectSearchModal.close()
    },
    /**
     * 房间选择模态框确认
     */
    roomSelectModalOk () {
      const selectedRows = this.$refs.roomSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.roomId = selectedRows[0].id
      params.roomNumber = selectedRows[0].roomNumber
      this.form.setFieldsValue(params)
      this.$refs.roomSelectSearchModal.close()
    },
    renterSelectModalOk () {
      const selectedRows = this.$refs.renterMainDataSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.renterId = selectedRows[0].id
      params.userId = selectedRows[0].userId
      params.renterName = selectedRows[0].name
      this.form.setFieldsValue(params)
      this.$refs.renterMainDataSelectSearchModal.close()
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
