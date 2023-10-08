<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="公寓信息" />
        <a-step title="附件" />
      </a-steps>
      <div class="content">
        <ApartmentAdvancedForm v-if="currentTab === 0" @nextStep="nextStep"/>
        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import ApartmentAdvancedForm from '@/views/maindata/apartment/stepForm/ApartmentAdvancedForm'

export default {
  name: 'ApartmentStepForm',
  components: {
    ApartmentAdvancedForm
  },
  data () {
    return {
      currentTab: 0,
      // form
      form: null
    }
  },
  methods: {

    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
