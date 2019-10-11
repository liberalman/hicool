<template lang="html">
  <div class="" v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ ('http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
    </header>
    <div class="article-wrapper" style="margin: 2em auto;">
      <div class="content">
        <el-radio-group v-model="labelPosition" size="small">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
          <el-form :label-position="labelPosition" :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
            <el-form-item label="checking"
                v-for="(checkbox, index) in dynamicValidateForm.checklists"
                :label="'名' + index"
                :key="checkbox.key"
                :prop="'checklists.' + index + '.value'"
                :rules="{
                  required: true, message: '名不能为空', trigger: 'blur'
                }"
              >
                <el-input placeholder="请输入内容" v-model="checkbox.value" class="input-with-select"
                  style="margin-top: 1em;"
                >
                  <el-button slot="append" @click.prevent="removeCheckbox(index, checkbox.value)">删除</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="checked"
              v-for="(domain, index) in dynamicValidateForm.domains"
              :label="'选项' + index"
              :key="domain.key"
              :prop="'domains.' + index + '.value'"
              :rules="{
                required: true, message: '名称不能为空', trigger: 'blur'
              }"
            >
              <el-input placeholder="请输入内容" v-model="domain.value" class="input-with-select"
                style="margin-top: 1em;" disabled="true"
              >
                <el-button slot="append" @click.prevent="removeDomain(index, domain.value)">删除</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
              <el-button @click="addCheckbox">Add Checkbox</el-button>
              <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
    </div>
    <CopyRight />
  </div>
</template>

<script>

export default {
  components: {
    'CopyRight': () =>
      import('./components/CopyRight.vue'),
    'vNav': () =>
      import('./components/Nav.vue'),
  },
  data(){
    return {
      labelPosition: 'right',
      dynamicValidateForm: {
        domains: [],
        email: '',
        checklists: [
          { value: '钥匙|'},
          { value: '充电宝|手机壳充电宝、外接充电宝'},
          { value: 'gopro|Type-C接口线、2个TF卡、读卡器、防水套装'},
          { value: '证件|身份证、护照、港澳通行证、台湾通行证'},
          { value: '各种卡|储蓄卡、信用卡、公交卡、饭卡' },
          { value: '需打印|国外酒店住宿单、国外登机牌、国外火车票' },
          { value: '币钞|提前几周预约兑换外币' },
          { value: '相机|充电器、电池、快门线、闪光灯、离线闪引、滤镜、反光板、三脚架' },
          { value: '手持稳定器|充电线、三脚架' },
          { value: '衣服|' },
          { value: '鞋子|' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(index, value) {
      // var index = this.dynamicValidateForm.domains.indexOf(value)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
        this.dynamicValidateForm.checklists.push({
          value: value
        });
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
    },
    addCheckbox() {
      this.dynamicValidateForm.checklists.push({
        name: '',
        value: '',
        key: Date.now()
      });
    },
    removeCheckbox(index, value) {
      // var index = this.dynamicValidateForm.checklists.indexOf(value)
      if (index !== -1) {
        this.dynamicValidateForm.checklists.splice(index, 1)
        this.dynamicValidateForm.domains.push({
          value: value
        });
      }
    },
  },
}
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
