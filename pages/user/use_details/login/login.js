// pages/user/use_details/login/login.js
var common= require('../../../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: "",
    userPwd: "",
    useryqm:"",
    hxstatus:0,
  },
  //获取用户输入的用户名
  userPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
   //获取用户输入的密码
  passWdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  //获取用户输入的嘉宾邀请码
  yqmInput: function (e) {
    this.setData({
      useryqm: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登陆',
    });
  },
  /*
    验证手机号
   */
  getVerificationCode: function (phonev) {
    var _that = this;
    var phone = phonev;
    //验证手机号
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(phone);
    if (flag) {
      //输入的手机号正确      
      return true;
    }else {
      return false;
    }
  },
  /*
    验证邮箱
   */
  checkEmail: function (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      //输入的邮箱号正确
      return true;
    } else {
      return false
    }
  },
  /*
    发送验证码
   */
  verify: function (typev) {
    var _that = this;
    var phone = _that.data.userPhone;
    // 判断文本框输入的是手机号还是邮箱
    var checkEmail = _that.checkEmail(phone);//邮箱
    var checkedphone = _that.getVerificationCode(phone);//手机号
    if (checkedphone == true || checkEmail == true) {
      var isValnum = '';
      if (checkedphone == true) { isValnum = 'phonecode'; }
      if (checkEmail == true) { isValnum = 'emailcode'; }
      // 发送验证码
      var usernamev = _that.data.userPhone;
      var postdata = { username: usernamev, type: isValnum };
      // console.log('传值：' + JSON.stringify(postdata));
      common.request('Member/Api/verify', postdata, function (data) {
        var jsonstr = JSON.stringify(data);
        // console.log('demo--' + jsonstr);
        if (data.rtnCode==1){
          common.showToast('none', '' + data.rtnMsg + '');
        } else if (data.rtnCode == 0){
          common.showToast('none', '' + data.data + '');
        }
      }, function (err) {
        console.log(err)
      });
      // 判断输入的账号是否正确
    } else if (checkedphone == false && checkEmail == false){
      common.showToast('none', '请填写正确的手机号或邮箱');
    }
  },
  submit: function (e) {
    var item = e.currentTarget.dataset['item'];
    var _that = this;
    var usernamev = _that.data.userPhone,
        passwordv = _that.data.userPwd,
        guestcodev = _that.data.useryqm;
    var checkEmail = _that.checkEmail(usernamev);//邮箱
    var checkedphone = _that.getVerificationCode(usernamev);//手机号
    var pwd_typev;
    if (checkedphone == true) { pwd_typev = 'phonecode'; }
    if (checkEmail == true) { pwd_typev = 'emailcode'; }
    var postdata = { username: usernamev, password: passwordv, pwd_type: pwd_typev };
    if (item == '注册') {
      var postdata = { username: usernamev, password: passwordv, pwd_type: pwd_typev, guestcode: guestcodev };
    }
    common.userlogin(postdata);
  },
  /*
      注册
  */
  register:function(e){

  },
  /*
    判断是否点击嘉宾注册按钮
   */
  jb_btn:function(e){
      var _that=this;
      _that.setData({
        hxstatus: !_that.data.hxstatus
      });
  },
})