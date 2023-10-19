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
        <a-row class="form-row" :gutter="[24, 8]">
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.assetsNumber')">
              <a-input
                size="large"
                type="text"
                v-decorator="['assetsNumber']"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.assetsName')">
              <a-input
                size="large"
                type="text"
                v-decorator="['assetsName', {rules: [{ required: true, message: $t('maindata.assets.assetsName.require') }], validateTrigger: ['change', 'blur']}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.assetsDesc')">
              <a-input
                size="large"
                type="text"
                v-decorator="['assetsDesc']"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.skuNumber')">
              <a-input
                size="large"
                type="text"
                v-decorator="['skuNumber']"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.unit')">
              <a-input
                size="large"
                type="text"
                v-decorator="['unit']"/>
            </a-form-item>
          </a-col>
          <a-col :span="24 / colCount">
            <a-form-item :label="$t('maindata.assets.label.form.isFreeze')">
              <a-select
                placeholder="请选择"
                :options="isFreezeOption"
                size="large"
                v-decorator="['isFreeze', {initialValue: 0,rules: [{ required: true, message: $t('user.isFreeze.required') }], validateTrigger: ['change', 'blur']}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('maindata.assets.label.form.remark')">
              <a-textarea
                :placeholder="$t('maindata.assets.label.form.remark')"
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Cascader } from 'ant-design-vue'
import { getDictOption } from '@/api/system/dictItemApi'

export default {
  name: 'AssetsForm',
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
      isFreezeOption: [],
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
      this.isFreezeOption = await getDictOption('yn')
    }
  },
  mounted () {
    this.initDict()
  }
}
</script>
