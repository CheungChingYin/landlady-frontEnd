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
            <a-form-item :label="$t('maindata.room.label.form.roomNumber')">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('maindata.room.label.form.roomNumber')"
                v-decorator="['roomNumber']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="" v-show="false">
              <a-input
                size="large"
                type="text"
                v-decorator="['apartmentId']"/>
            </a-form-item>
            <a-form-item :label="$t('maindata.room.label.form.apartmentNumber')">
              <a-input
                size="large"
                type="text"
                style="width: 65%;margin-right: 5%"
                :placeholder="$t('maindata.room.label.form.apartmentNumber')"
                disabled
                v-decorator="['apartmentId_dictText']"/>
              <a-button type="primary" @click="openModal">选择</a-button>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item :label="$t('maindata.room.label.form.roomArea')">
              <a-input-number
                size="large"
                style="width: 100%"
                :min="0"
                :precision="2"
                :formatter="value => `${value}m²`"
                :parser="value => value.replace('m²', '')"
                :placeholder="$t('maindata.room.label.form.roomArea')"
                v-decorator="['roomArea', {initialValue: 0}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item :label="$t('maindata.room.label.form.roomStatus')">
              <a-select
                placeholder="请选择"
                :options="roomStatusOption"
                v-decorator="['roomStatus', {initialValue: 0}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-form-item :label="$t('maindata.room.label.form.remark')">
            <a-textarea
              :placeholder="$t('maindata.room.label.form.remark')"
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
  </page-header-wrapper>
</template>

<script>
import { getDictOption } from '@/api/system/dictItemApi'
import ApartmentSelectSearchModal from '@/views/maindata/apartment/modal/ApartmentSearchModal.vue'
import { getList as getApartmentList } from '@/api/maindata/ApartmentApi'

export default {
  name: 'RoomForm',
  components: {
    ApartmentSelectSearchModal,
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
        'apartmentNumber_dictText',
        'roomNumber',
        'roomArea',
        'roomStatus',
        'remark'
      ],
      roomStatusOption: [],
      getApartList: getApartmentList
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
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
