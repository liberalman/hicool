<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="任务ID"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-select value="1" placeholder="1">
          <a-select-option value="1">1</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="执行人"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select defaultValue="alipay" style="width: 100px">
            <a-select-option value="alipay">Alex</a-select-option>
            <a-select-option value="wexinpay">Maya</a-select-option>
          </a-select>
          <a-input :style="{width: 'calc(100% - 100px)'}" value="test@nio.com"/>
        </a-input-group>
      </a-form-item>
      <a-form-item
        label="任务名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input value="触发批量处理车辆销售的定时任务" />
      </a-form-item>
      <a-form-item
        label="任务🎺"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input prefix="￥" value="5000" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  methods: {
    nextStep () {
      this.$emit('nextStep')
    }
  }
}
</script>

<style scoped>

</style>
