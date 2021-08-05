<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      :validate-on-rule-change="false"
      v-show="loginType == 0"
    >
      <h3 class="title">威克后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <div class="operator-box">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>

        <div>
          <el-button type="text" @click="loginTypeChange(1)"
            >验证码登录</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="loginTypeChange(2)"
            >游客登录</el-button
          >
        </div>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <el-form
      ref="loginByPhoneForm"
      :model="loginByPhoneForm"
      :rules="loginByPhoneRules"
      class="login-form"
      :validate-on-rule-change="false"
      v-show="loginType == 1"
    >
      <h3 class="title">威克后台管理系统</h3>
      <el-form-item prop="phonenumber">
        <el-input
          v-model="loginByPhoneForm.phonenumber"
          type="text"
          auto-complete="off"
          placeholder="手机号码"
          prefix-icon="el-icon-mobile"
          @keyup.enter.native="loginByPhoneHandler"
        >
          <template slot="append">
            <el-button
              @click="sendSmsHandler"
              :disabled="sendText == '发送验证码' ? false : true"
              >{{ sendText }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginByPhoneForm.code"
          auto-complete="off"
          placeholder="验证码"
          prefix-icon="el-icon-chat-round"
          @keyup.enter.native="loginByPhoneHandler"
        >
        </el-input>
      </el-form-item>
      <div class="operator-box">
        <div></div>
        <div>
          <el-button type="text" @click="loginTypeChange(0)"
            >账号登录</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="loginTypeChange(2)"
            >游客登录</el-button
          >
        </div>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="loginByPhoneHandler"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <el-form
      ref="loginVisitor"
      :model="loginVisitor"
      :rules="loginVisitorRules"
      class="login-form"
      :validate-on-rule-change="false"
      v-show="loginType == 2"
    >
      <h3 class="title">威克后台管理系统</h3>
      <el-form-item prop="phonenumber">
        <el-input
          v-model="loginVisitor.phonenumber"
          type="text"
          auto-complete="off"
          placeholder="手机号码"
          prefix-icon="el-icon-mobile"
          @keyup.enter.native="loginVisitorHandler"
        >
          <template slot="append">
            <el-button
              @click="sendLoginSmsHandler"
              :disabled="sendVisiteText == '发送验证码' ? false : true"
              >{{ sendVisiteText }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginVisitor.code"
          auto-complete="off"
          placeholder="验证码"
          prefix-icon="el-icon-chat-round"
          @keyup.enter.native="loginVisitorHandler"
        >
        </el-input>
      </el-form-item>
      <div class="operator-box">
        <div></div>
        <div>
          <el-button type="text" @click="loginTypeChange(0)"
            >账号登录</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="loginTypeChange(1)"
            >验证码登录</el-button
          >
        </div>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="loginVisitorHandler"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        >Copyright © 2018-{{ new Date().getFullYear() }} csvic.com All Rights
        Reserved.</span
      >
    </div>
  </div>
</template>

<script>
import { getCodeImg, sendSms, loginByPhone, sendSmsVisitor } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginByPhoneForm: {
        phonenumber: "",
        code: ""
      },
      loginVisitor: {
        phonenumber: ""
      },
      loginType: 0, // 0: 账号密码登录，1: 验证码登录, 2: 游客登录
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loginByPhoneRules: {
        phonenumber: [
          { required: true, trigger: "blur", message: "手机号码不能为空" }
        ],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
      },
      loginVisitorRules: {
        phonenumber: [
          { required: true, trigger: "blur", message: "手机号码不能为空" }
        ],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      sendText: "发送验证码",
      sendVisiteText: "发送验证码",
      timeId: null
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    // 发送验证码
    sendSmsHandler() {
      if (!this.loginByPhoneForm.phonenumber) {
        this.$message.error("请输入手机号码");
        return;
      }
      sendSms({
        phonenumber: this.loginByPhoneForm.phonenumber,
        loginSystem: "1"
      }).then(res => {
        if (res.code == 200) {
          this.$refs.loginByPhoneForm.clearValidate();
          this.$notify({
            type: "success",
            title: "成功提示",
            message: "发送验证码成功!"
          });
          this.sendText = "60s";
          this.timeId = setInterval(() => {
            this.sendText = this.sendText.split("s")[0] - 1 + "s";
            if (this.sendText.split("s")[0] <= 0) {
              clearInterval(this.timeId);
              this.sendText = "发送验证码";
            }
          }, 1000);
        }
      });
    },
    sendLoginSmsHandler() {
      if (!this.loginVisitor.phonenumber) {
        this.$message.error("请输入手机号码");
        return;
      }
      sendSmsVisitor(this.loginVisitor.phonenumber).then(res => {
        if (res.code == 200) {
          this.$refs.loginVisitor.clearValidate();
          this.$notify({
            type: "success",
            title: "成功提示",
            message: "发送验证码成功!"
          });
          this.sendVisiteText = "60s";
          this.timeId = setInterval(() => {
            this.sendVisiteText = this.sendVisiteText.split("s")[0] - 1 + "s";
            if (this.sendVisiteText.split("s")[0] <= 0) {
              clearInterval(this.timeId);
              this.sendVisiteText = "发送验证码";
            }
          }, 1000);
        }
      });
    },
    loginTypeChange(val) {
      this.loginType = val;
      setTimeout(() => {
        this.$refs.loginByPhoneForm.clearValidate();
        this.$refs.loginForm.clearValidate();
        this.$refs.loginVisitor.clearValidate();
      }, 0);
    },
    async loginByPhoneHandler() {
      this.$refs.loginByPhoneForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("loginByPhone", this.loginByPhoneForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    // 游客登录
    loginVisitorHandler() {
      this.$refs.loginVisitor.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("loginVisitor", this.loginVisitor)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  margin-right: 10%;
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.operator-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
