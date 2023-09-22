<template>
  <a-modal
    :title="dialogTitle"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :rowData="rowData"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <DictForm
      ref="dictFormRef"
      :loading="loading"
      :rowData="rowData"/>
  </a-modal>
</template>

<script>
import DictForm from '@/views/system/dict/DictForm'
export default {
  components: { DictForm },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    rowData: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      dialogTitle: ''
    }
  },
  created () {},
  mounted () {}
}
</script>
