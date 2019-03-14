<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="确认执行后，任务将不可中断和回退。"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        label="任务ID"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        1
      </a-form-item>
      <a-form-item
        label="执行人"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        Alex [test@nio.com]
      </a-form-item>
      <a-form-item
        label="任务名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        触发批量处理车辆销售的定时任务
      </a-form-item>
      <a-form-item
        label="任务🎺"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        ￥ 5,000.00
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Step2',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    nextStep () {
      let _this = this
      _this.loading = true
      // 触发批量处理销售的任务
      this.$store.dispatch('saleList/batchSale')
        .then(res => {
          this.$message.success('success')
          setTimeout(function () {
            _this.$emit('nextStep')
          }, 1500)
        })
        .catch(err => {
          _this.loading = false
          this.$message.error(err)
        })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;
    :global {
      .ant-form-item-label,
      .ant-form-item-control {
        line-height: 22px;
      }
    }
  }
</style>
