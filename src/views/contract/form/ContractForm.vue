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
                :placeholder="$t('contract.label.form.renterName')"
                v-decorator="['renterName',{rules: [{required: true, message: $t('contract.label.form.renterName.required')}]}]"
              ></a-input>
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
              <a-input
                size="large"
                type="text"
                :placeholder="$t('contract.label.form.contractStatus')"
                v-decorator="['renterName', {rules: [{required: true, message: $t('contract.label.form.contractStatus.required')}]}]"
              ></a-input>
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
      ref="userSelectSearchModal"
      @ok="apartmentSelectModalOk"
      :get-list="getApartList"
    ></ApartmentSelectSearchModal>
    <RoomSelectSearchModal
      ref="roomSelectSearchModal"
      @ok="roomSelectModalOk"
      :get-list="getRoomList"></RoomSelectSearchModal>
  </page-header-wrapper>
</template>

<script>
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal.vue'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'
import RoomSelectSearchModal from '@/views/maindata/apartment/modal/RoomSearchModal.vue'
import { getList as getRoomList } from '@/api/maindata/RoomMainDataApi'

export default {
  name: 'ContractForm',
  components: {
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
      roomStatusOption: [],
      getApartList: getApartmentList,
      getRoomList: getRoomList
    }
  },
  computed: {},
  created () {
    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    async initDict () {
      this.roomStatusOption = await getDictOption('room_status')
    },
    openModal () {
      this.$refs.userSelectSearchModal.open({})
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
    apartmentSelectModalOk () {
      const selectedRows = this.$refs.userSelectSearchModal.selectedRows
      if (selectedRows.length !== 1) {
        this.$message.error('请选择一条数据')
        return
      }
      const params = {}
      params.apartmentId = selectedRows[0].id
      params.apartmentName = selectedRows[0].apartmentNumber
      this.form.setFieldsValue(params)
      this.$refs.userSelectSearchModal.close()
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
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
