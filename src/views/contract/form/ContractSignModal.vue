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
          width="100%"
          height="800px"
          ref="previewContractIframe"
          frameborder="0"
          scrolling="auto"></iframe>
      </div>
      <div class="table-page-search-wrapper">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="11">
            甲方签名:
          </a-col>
          <a-col :span="11">
            乙方签名:
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" type="flex" justify="space-around" align="middle">
          <a-col :span="11" style="border: 1px solid black">
            <vue-esign ref="firstSignRef" :isCrop="true" />
          </a-col>
          <a-col :span="11" style="border: 1px solid black">
            <vue-esign ref="secondSignRef" :isCrop="true" />
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" type="flex" justify="space-around" align="middle">
          <a-col :span="11">
            <a-button type="danger" @click="() => { this.$refs.firstSignRef.reset() }">清空甲方签名</a-button>
          </a-col>
          <a-col :span="11">
            <a-button type="danger" @click="() => { this.$refs.secondSignRef.reset() }">清空乙方签名</a-button>
          </a-col>
        </a-row>
      </div>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="previewSignContract" :loading="confirmLoading">
        预览签名后合同
      </a-button>
      <a-popconfirm title="确认是否签约？确认后将对当前预览的合同生成合同文件" ok-text="是" cancel-text="否" @confirm="contractSign">
        <a-button key="submit" type="primary" :loading="confirmLoading">
          合同签约
        </a-button>
      </a-popconfirm>
    </template></a-modal>
</template>

<script>
import { contractSign, generateContractPdf } from '@/api/contract/ContractHeadApi'
  import { getPreviewFileUrlByUrl } from '@/api/system/attachmentApi'
  import vueEsign from 'vue-esign'

  export default {
    name: 'ContractSignModal',
    components: { vueEsign },
    props: {
      headId: {
        type: String,
        default: null,
        required: true
      },
      parentLoadData: {
        type: Function,
        default: () => {}
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
        firstSignData: null,
        secondSignData: null,
        draftContractAttachment: {},
        signContractAttachment: {}
      }
    },
    created () {
    },
    methods: {
      async initDict () {
      },
      setIframeSrc (url) {
        this.$refs.previewContractIframe.contentWindow.location.replace(url)
      },
      // 关闭
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.queryParam = {}
        this.iframeSrc = ''
        this.$refs.firstSignRef.reset()
        this.$refs.secondSignRef.reset()
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
            this.setIframeSrc(getPreviewFileUrlByUrl(this.draftContractAttachment))
          }
        }).finally(() => {
          this.loading = false
        })
      },
      async previewSignContract () {
        await this.$refs.firstSignRef.generate().then(res => {
          this.firstSignData = res
        }).catch(() => {
          this.$message.error('甲方未签名')
        })
        await this.$refs.secondSignRef.generate().then(res => {
          this.secondSignData = res
        }).catch(() => {
          this.$message.error('乙方未签名')
        })
        this.loading = true
        const params = {
          id: this.headId,
          attachmentList: [
            {
            attachmentType: 'firstPartySign',
            attachmentUrl: '',
            pictureBase64: this.firstSignData
            },
            {
              attachmentType: 'secondPartySign',
              attachmentUrl: '',
              pictureBase64: this.secondSignData
            }
          ]
        }
        generateContractPdf(params).then(res => {
          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            this.signContractAttachment = res.result
            this.$nextTick(() => {
              this.setIframeSrc(getPreviewFileUrlByUrl(this.signContractAttachment))
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },
      contractSign () {
        this.confirmLoading = true
        if (this.signContractAttachment == null) {
          this.$message.error('请先预览签名后合同')
          this.confirmLoading = false
          return
        }
        const params = {
          id: this.headId,
          attachmentList: []
        }
        params.attachmentList.push(this.signContractAttachment)
        contractSign(params).then(res => {
          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            this.$message.success('合同签约成功')
            this.close()
            this.parentLoadData()
          }
        }).finally(() => {
          this.confirmLoading = false
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
