// 用于获取接口数据--（封装方法） --star
var CryptoJS = require("crypto-js");
/*
 * 获取动态加密的key
 *
 */
function getCryptKey(requestData) {
  var device = requestData;
  //进行key的升序
  var key = new Array();
  for (var k in device) {
    if ("sign" == k || "params" == k) continue;
    key.push(k);
  }
  key = key.sort();
  var str = "";
  for (var i = 0; i < key.length; i++) {
    str += device[key[i]];
  }
  var md5 = CryptoJS.MD5(str).toString();
  return md5.substring(8, 16);
}
/**
 * 数据签名
 *
 *
 */
function sign(data) {
  //进行key的升序
  var key = new Array();
  for (var k in data) {
    if ("sign" == k) continue;
    key.push(k);
  }
  key = key.sort();
  var str = "";
  for (var i = 0; i < key.length; i++) {
    str += data[key[i]];
  }
  var md5 = CryptoJS.MD5(str).toString();
  return md5;
};


var key = "bigexpos";
var token = wx.getStorageSync('usertoken') || '';

// var yuming = 'https://www.bigdata-expo.cn/';
// var yuming = 'https://www.chinadatavalley.net/';
// var yuming = 'https://bigexp.fefry.com/';

var yuming = 'http://demo.52api.net/';
// var localhost = 'http://www.tp6sbh.com/';
var localhost = 'http://www.expombh.com/';


//des加密
function encrypt(message, inkey, iniv) {
  if (null == inkey || inkey == "") {
    inkey = key;
  }0
  if                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                (null == iniv || iniv == "") {
    iniv = inkey;
  }
  var keyHex = CryptoJS.enc.Utf8.parse(inkey);
  var ivHex = CryptoJS.enc.Utf8.parse(iniv);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.CBC,
    iv: ivHex,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
//DES 解密
function decrypt(ciphertext, inkey, iniv) {
  if (null == inkey || inkey == "") {
    inkey = key;
  }
  if (null == iniv || iniv == "") {
    iniv = inkey;
  }
  var keyHex = CryptoJS.enc.Utf8.parse(inkey);
  var ivHex = CryptoJS.enc.Utf8.parse(iniv);
  // direct decrypt ciphertext
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.CBC,
    iv: ivHex,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}



//封装的ajax请求（里面有加密及解密）
function request(url, data, success, error) {
  const requetsData = new RequestData();
  const dynamicPass = getCryptKey(requetsData);
  // console.log(token);
  // console.log(wx.getStorageInfoSync("token"))
  wx.request({
    url: yuming + url,
    data: {
      params: requetsData.getData(data, dynamicPass)
    },
    method: "POST",
    success: function(res) {
      if (res.statusCode > 299) {
        error != null ? error("服务器请求错误") : console.error("服务器请求错误");
        return;
      }
      // 解密接口
      var data = decrypt(res.data);
      var rst = JSON.parse(data);
      if (0 == rst.rtnCode && rst.data) {
        var content = decrypt(rst.data, dynamicPass);
        rst.data = JSON.parse(content);
      }
      let object = res;
      //返回接口信息
      success != null ? success(rst, object) : console.log(rst, object);
    },
    fail: function(e) {
      //log(e.responseText);
      //返回错误信息
      error != null ? error(e.responseText) : console.error(e.responseText);
    }
  })
}
//封装的ajax请求（不用解密款）
function requests(url, data, success, error){
  wx.request({
    url: yuming + url,
    data: {},
    method: "POST",
    success: function (res) {
      if (res.statusCode > 299) {
        error != null ? error("服务器请求错误") : console.error("服务器请求错误");
        return;
      }
      success != null ? success(res) : console.log(res);
    },
    fail: function (e) {
      console.log('fail----:'+e.responseText);
      error != null ? error(e.responseText) : console.error(e.responseText);
    }
  })
}

// 获取封装接口数据方法-其它页面调用-示列：
function demogeturl() {
  common.request('/observation/api/getList', {}, function(data) {
    console.log(data);
  }, function(err) {
    console.log(err)
  })
}
//封装头像上传
function upload(url, file, data, success, error) {
  const requetsData = new RequestData();
  const dynamicPass = getCryptKey(requetsData);
  // console.log(data);
  wx.uploadFile({
    url: yuming + url,
    formData: {
      params: requetsData.getData(data, dynamicPass)
    },
    filePath: file,
    name: 'file',
    method: "POST",
    success: function(res) {
      if (res.statusCode > 299) {
        error != null ? error("服务器请求错误") : console.error("服务器请求错误");
        return;
      }
      var data = decrypt(res.data);
      res = JSON.parse(data);
      if (0 == res.rtnCode && res.data) {
        var content = decrypt(res.data, dynamicPass);
        res.data = JSON.parse(content);
      }
      // console.log(res);
      success != null ? success(res) : console.log(res);
    },
    fail: function(e) {
      //log(e.responseText);
      error != null ? error(e.responseText) : console.error(e.responseText);
    }
  })
}
// 用户登陆--需获得-token--用token判断用户是否登陆
function userlogin(postdata) {
  request('/Member/Api/autologin', postdata, function (data, object) {
    var jsonstrv = JSON.stringify(data);
    var jsonstr = data;
    if (jsonstr.rtnMsg == '处理成功') { //获得token-登陆成功
      var tokenv = jsonstr.data.token;
      var expire = jsonstr.data.expire;
      var Uid = jsonstr.data.uid;
      var header = object.header;
      var cookies = object.cookies;
      token = tokenv;
      wx.setStorageSync('userheader', '' + header + '');
      wx.setStorageSync('usercookies', '' + cookies + '');
      wx.setStorageSync('usertoken', '' + tokenv + '');
      wx.setStorageSync('uid', '' + Uid + '');
      wx.getStorage({
        key: "usertoken",
        success: function(res) {
          token = res.data;
        },
      });
      //url跳转
      var urlv = '/pages/user/user',
        queryIndex = 1;
      wx.switchTab({
        url: '' + urlv + '?index=' + queryIndex + ''
      });
    } else {
      showToast('none', '' + jsonstr.rtnMsg + '');
    }
    return true;
  }, function(err) {
    console.log(err)
  });
}


//弹出提示内容 -- 会自动关闭
function showToast(icon, txt) {
  wx.showToast({
    title: txt,
    icon: icon, //loading,none
    duration: 1500,
    success: function (ress) { }
  })
}
//中间弹框显示-用于加载中，提示等--不会自动关闭
function showLoading(title) {
  wx.showLoading({
    title: title,
  });
}
//有确定按钮的弹框
function showModal(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: function (res) { }
  })
}
//可自定义修改弹框
function showModals(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    confirmText: '确定',
    confirmColor: '#000000',
  })
}
// 小程序-顶部标题
function setNavigationBarTitle(tlte){
  wx.setNavigationBarTitle({
    title: tlte,
  });
}












class RequestData {
  constructor() {
    this.timestamp = (new Date()).valueOf();
    this.meid = "webtest001";
    this.version = "1.0";
    this.platform = "w";
    this.token = token;
    this.lang = "zh-cn";
  }
  getData(data, dynamicPass) {
    data = data == null ? {} : data;
    this.params = encrypt(JSON.stringify(data), dynamicPass, dynamicPass); //动态加密
    this.sign = sign(this);
    return encrypt(JSON.stringify(this)); //固定加密
  }
}

//所有上面定义的方法函数或变量，皆全部在这里再次声明才可正常调用
module.exports = {
  request: request,
  requests: requests,
  showToast: showToast,
  showLoading: showLoading,
  userlogin: userlogin,
  decrypt: decrypt,
  encrypt: encrypt,
  upload: upload,
  showModal: showModal,
  showModals: showModals, 
  yuming: yuming,
  localhost:localhost,
  setNavigationBarTitle:setNavigationBarTitle,
 
}