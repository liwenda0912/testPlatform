<template>
  <div class="border">
  <el-text tag="b" size="large" id="text_">{{text}}</el-text>
  <div id="login_">
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
    >
      <el-form-item label="Account" prop="account">
        <el-input v-model="ruleForm.account" type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Verification code" prop="code">
        <div id = "verification-code">
          <el-input v-model.number="ruleForm.code" class="item_code" />
          <img :src="'http://127.0.0.1:8090/captcha'"  @click="refreshCaptcha" style="cursor:pointer;" class="item_code" id="kaptcha" />
        </div>
      </el-form-item>
      <el-form-item id="button_">
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          login
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import router from "@/router";
import { KaptCha, login, loginUserMessage} from "@/api/login";
import {getCookieRefresh, setCookie} from "@/cookies";
import {jsonStringSwitch} from "@/utils/handleData";
import {getDecryptData, getSecretData} from "@/utils/crypto";

const ruleFormRef = ref<FormInstance>()
const text_=ref("测试平台")
const text = ref(text_)
let captchaUrl="  http://127.0.0.1:8090/captcha"

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the Verification code'))
  }
  setTimeout(() => {
        callback()
  }, 1000)
}


const ruleForm = reactive({
  account: '',
  password: '',
  code: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  account:
        [{required: true, trigger: "blur",message: "请输入手机号码"},
        {pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur"}],
  password: [{required: true, trigger: "blur",message: "请输入密码"}],
  code: [{validator: checkAge, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      login({
        username:ruleForm.account,
        password:ruleForm.password,
        code:ruleForm.code,
      }).then((res:any)=>{
        if (res.code === 200) {
          let dataTokens = jsonStringSwitch("Json",getDecryptData(res.data))
          setCookie(dataTokens.token, dataTokens.refresh_token)
          loginUserMessage(getSecretData(getCookieRefresh()))

          router.push("/index")
          setCookie(dataTokens.token, dataTokens.refresh_token)

        }
      })
    } else {
      console.log('error submit!')
    }
  })
}
const refreshCaptcha=() => {
  // 获取图片元素
  const imgElement: HTMLImageElement | null = document.getElementById("kaptcha") as HTMLImageElement;

  if (imgElement) {
    // 通过添加时间戳来避免浏览器缓存
    const timestamp: number = new Date().getTime();
    imgElement.src = `http://127.0.0.1:8090/captcha?${timestamp}`;
  } else {
    console.error("Image element not found");
  }
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style scoped>
#login_ {
  background-color: silver;
  width: 270px;
  height: 200px;
  padding: 30px;
  box-shadow: #1a1a1a 1px 1px 1px 1px;
  border-radius: 10px;
}

#button_ {
  text-align: center;
}
#text_{
  font-size: 30px;
  display: block;
  margin-bottom: 20px;
}
button{
  margin: 0 auto;
}
.border{
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);

}
#verification-code {
  display: flex;
  justify-content: space-around;
}
#verification-code .item_code {
  width: 108px !important;
}
</style>