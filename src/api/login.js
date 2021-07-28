import request from "@/utils/request";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: "/login",
    method: "post",
    data: data
  });
}

// 验证码登录
export function loginByPhone(phonenumber, code) {
  const data = {
    phonenumber,
    code
  };
  return request({
    url: "/login",
    method: "post",
    data: data
  });
}

// 游客登陆
export function loginByVisitor(phonenumber) {
  const data = {
    phonenumber
  };
  return request({
    url: "/login",
    method: "post",
    data: data
  });
}

// 发送验证码
export function sendSms(phoneNumbers) {
  return request({
    url: `/captchaSms/${phoneNumbers}`,
    method: "get"
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get"
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    method: "get"
  });
}
