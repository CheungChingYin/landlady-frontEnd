<template>

  <a-modal
    :title="title"
    width="90%"
    style="height: 900px"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="() => { $emit('ok') }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin tip="合同生成中..." :spinning="loading">
      <div class="table-page-search-wrapper">
        <iframe
          :src="iframeSrc"
          width="100%"
          height="800px"
          frameborder="0"
          scrolling="auto"></iframe>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { generateContractPdf } from '@/api/contract/ContractHeadApi'
  import { getPreviewFileUrlByUrl } from '@/api/system/attachmentApi'

  export default {
    name: 'ContractSignModal',
    components: { },
    props: {
      headId: {
        type: String,
        default: null,
        required: true
      }
    },
    data () {
      return {
        title: '合同签订',
        visible: false,
        // 高级搜索 展开/关闭
        advanced: false,
        visibleCheck: true,
        // 查询参数
        queryParam: {},
        areaOptions: [],
        selectedRowKeys: [],
        selectedRows: [],
        loading: false,
        confirmLoading: false,
        draftContractAttachment: {},
        signContractAttachment: {},
        iframeSrc: ''
      }
    },
    created () {
    },
    methods: {
      async initDict () {
      },
      // 关闭
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.queryParam = {}
      },
      open (params) {
        if (this.headId === null) {
          this.$message.error('请先保存合同信息')
          this.close()
          return
        }
        this.visible = true
        this.loading = true
        const generateContractParams = {
          id: this.headId
        }
        this.previewContract(generateContractParams)
      },
      previewContract (params) {
        generateContractPdf(params).then(res => {
          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            this.draftContractAttachment = res.result
            this.iframeSrc = getPreviewFileUrlByUrl(this.draftContractAttachment)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      cascadeOnChange (value) {},
      toggleAdvanced () {
        this.advanced = !this.advanced
      }
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  }
</script>
