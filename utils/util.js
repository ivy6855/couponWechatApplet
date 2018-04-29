import es6 from '../plugins/es6-promise'

const userStoragekey = 'fpa_user';

const consultantStoragekey = 'fpa_consultant';


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const rootDocment = 'https://minipro.decarvings.com/coupon-wechat/';//你的域名

const request = function (url, data, cb) {
  checkClientToken();
  var token = wx.getStorageSync(TOKEN_KEY);
  console.log("start request post")
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + token,
    },
    success: function (res) {
      if (res.statusCode == "401") {//token 过期重新获取
        console.log("token 过期。。。 401")
        setClientToken().then(function () {
          request(url, data, cb);
        });
        return false;
      }
      return typeof cb == "function" && cb(res.data);
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

const requestGet = function (url, data, cb) {
  checkClientToken();
  var token = wx.getStorageSync(TOKEN_KEY);
  console.log("start request get");
  console.log("data")
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: {
      "Authorization": "Bearer " + token,
    },
    success: function (res) {
      console.log("end request get,resive message bellow:")
      console.log(res)
      if (res.statusCode == "401") {//token 过期重新获取
        console.log("token 过期....")
        setClientToken().then(function () {
          requestGet(url, data, cb);
        });
        return false;
      }
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

const TOKEN_KEY = "client_token";
const TOKEN_EXPIRE_KEY = "client_expire";

const setClientToken = function (callback) {

  var param = {
    "grant_type": "client_credentials",
    "scope": "select",
    "client_id": "WF8FPEYZGJEQ",
    "client_secret": "GBK2YKLF6T0PCDBXG8PO0ACGTL2HSAOB"
  }
  return new es6.Promise(function (resolve, reject) {
    console.log("请求token start....")
    wx.request({
      url: rootDocment + 'oauth/token',
      data: param,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (resp) {
        console.log("resive token message");
        console.log(resp)
        wx.setStorageSync(TOKEN_KEY, resp.data.value);
        wx.setStorageSync(TOKEN_EXPIRE_KEY, resp.data.expiration);
        resolve();
      },
      fail: function () {
      }
    });
  })
}

const checkClientToken = function () {
  console.log("check token.....")
  var time = wx.getStorageSync(TOKEN_EXPIRE_KEY);
  var now = new Date().getTime();
  // debugger;
  if (!time || time < now) {
    return setClientToken();
  } else {
    return true;
  }
}

module.exports = {
  consultantStoragekey: consultantStoragekey,
  userStoragekey: userStoragekey,
  formatTime: formatTime,
  request: request,
  requestGet: requestGet,
  baseUrl: rootDocment,
  checkClientToken: checkClientToken
}
