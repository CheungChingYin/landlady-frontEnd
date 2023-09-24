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
    <RoleForm
      ref="roleFormRef"
      :loading="loading"
      :rowData="rowData"/>
  </a-modal>
</template>

<script>
import RoleForm from '@/views/system/role/RoleForm'
export default {
  components: { RoleForm },
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
