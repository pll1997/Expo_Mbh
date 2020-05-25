// pages/user/use_details/use_erweima/use_erweima.js
var common = require('../../../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    erweima:'',
    jmerweima: false,
    jiabin: false,
    zhaq: false,
    zhaqarry:[{ type: 'null', value: '请选择验证方式'}],
    index:0,
    type: null,
    typev: null,
    tel_mailbox: '',
    tel_mailbox2:'',
    newzh:'',
    listbtntype:'',
    listbtntypeshow:'',
    zhaqlist:true,
    second:'60',
    second2: '60',
    send1:false,
    send2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.zhaq = '账号安全';
    var _that=this;
    var jiabinv = '',  zhaqv='', jmerweimav='';
    var opval = options.index;
    if (opval == '我的二维码'){
      jmerweimav = true;
      _that.ajaxuser();
    } else if (opval == '我是嘉宾'){
      jiabinv = true;
    } else if (opval == '账号安全') {
      zhaqv=true;
      _that.ajaxVerification();
    }
    common.setNavigationBarTitle(opval);
    _that.setData({
      jmerweima: jmerweimav,
      jiabin: jiabinv,
      zhaq: zhaqv
    });
    
  },
  /*
    获取二维码
   */
  ajaxuser: function (e) {
    var _that = this;
    common.request('Usercenter/Api/profile', {}, function (data) {
      var qrcodev = data.data.qrcode;
      _that.setData({
        erweima: data.data.qrcode,
        realname: data.data.realname,
        company: data.data.company,
        post: data.data.title
      });
    }, function (err) {
      console.log(err)
    });
  },
  /*
    提交 -- 账号安全（板块）
  */
  formSubmit: function (e) {
    var invite_codev = e.detail.value.yqm;
    common.request('usercenter/Api/become_guest', { invite_code: invite_codev}, function (data) {
      console.log(JSON.stringify(data));
      if (data.rtnMsg=='处理成功'){
        wx.switchTab({
          url: "/pages/user/user"
        });
      }else{
        common.showToast('none', data.rtnMsg);
      }
    }, function (err) {
      console.log(err)
    });
  },
  /* 
    账号与安全的-列表点击
  */
  bin_list:function(e){
    var item = e.currentTarget.dataset.item;
    var listbtntypeshowv;
    if (item =='phone'){
      listbtntypeshowv='手机号';
    } else if (item == 'email'){
      listbtntypeshowv = '邮箱';
    }
    this.setData({
      listbtntype: item,
      listbtntypeshow: listbtntypeshowv,
      zhaqlist: false
    });
  },
  /*
    获取验证方式
  */
  ajaxVerification:function(){
    var _that = this;
    common.request('usercenter/Api/GetApptype', {}, function (res) {
      var zhaqarry = _that.data.zhaqarry
      var type;
      var datalen=res.data.length;
      for (var i = 0; i < datalen;i++){
        var item = res.data[i];
        type = item.type;
        zhaqarry.push({ type: item.type, value: item.value});
      }
      _that.setData({
        zhaqarry: zhaqarry,
        type: type
      });
    }, function (err) {
      console.log(JSON.stringify(err))
    });
  },
  /* 
    选择验证方式
  */
  bindDateChange: function (e) {
    var _that = this;
    var val = e.detail.value;
    if (val==0){
        common.showToast('none','未选验证方式');
        _that.setData({
          type: null
        });
    }else{
      var type=_that.data.type,
          listbtntypeshowv;
      if (type == 'phone') {
        listbtntypeshowv = '手机号';
      } else if (type == 'email') {
        listbtntypeshowv = '邮箱';
      }
      _that.setData({
        index: val,
        typev: type,
        listbtntypeshow: listbtntypeshowv,
      });
    }
    
  },
  /*
    获取旧验证码
  */
  SendAppChangeCode:function(){
    var _that=this;
    var typev = _that.data.typev;
    if (typev == null || typev == '' ){
      common.showToast('none', '未选验证方式');
      return false;
    }else{
      common.request('usercenter/Api/SendAppChangeCode', { type: typev }, function (data) {
        if (data.rtnMsg = '处理成功') {
          common.showToast('none', '获取验证码成功');
          _that.countdown();
        } else {
          common.showToast('none', '' + JSON.stringify(data.rtnMsg) + '');
        }
      }, function (err) {
        console.log(JSON.stringify(err));
      })
    }
  },
  /*
    获取新的验证码
   */
  GetUserInput: function (e) {
    var _that = this;
    var typev = _that.data.typev;
    var OldCodev = _that.data.tel_mailbox;//第一个验证码
    var newmemberv = _that.data.newzh;//input框里面的账号-值
    // var type = _that.data.listbtntype;
    var type = _that.data.typev;
    var checkRes;
    if (typev == null || typev == '' || OldCodev == null || OldCodev == '' || OldCodev == undefined) {
      common.showToast('none', '前面的验证方式未验证');
      return;
    }

    //验证--手机号或邮箱是否正确输入
    if (type == 'phone') {
      checkRes = _that.vphone(newmemberv);
    } else if (type == 'email') {
      checkRes = _that.emailBlur(newmemberv);
    }
    if (!checkRes) {
      console.log("账号存在异常，终止提交！")
      return;
    }
    var data = { OldCode: OldCodev, newmember: newmemberv, type: type }
    common.request('usercenter/Api/GetUserInput', data, function (data) {
      if (data.rtnCode = 0) {
        common.showToast('none', '获取验证码成功');
        _that.countdown2();
      } else {
        common.showToast('none', '' + JSON.stringify(data.rtnMsg) + '');
      }
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  },
  /*
    获取更绑的账号
  */
  getj_yzm1:function(e){
    var val = e.detail.value;
    this.setData({
      tel_mailbox: val
    });
  },
  getj_yzm2: function (e) {
    var val = e.detail.value;
    this.setData({
      tel_mailbox2: val
    });
  },
  getj_newzh:function(e){
    var val = e.detail.value;
    this.setData({
      newzh: val
    });
  },
  
  /* 
    账号与安全：-  提交  
  */
  zhaq_sbmit:function(e){
    var _that=this;
    var codev = _that.data.tel_mailbox2;//第二个验证码
    var newmemberv = _that.data.newzh;//需要更绑的账号
    console.log('新验证码：-' + codev);
    console.log('需要更绑的账号-' + newmemberv);
    if (newmemberv == '' || newmemberv == null || newmemberv==undefined){
      common.showToast('none', '请仔细检查需更绑的手机号');
      return;
    }
    if (codev == '' || codev == null || codev == undefined) {
      common.showToast('none', '请输入需更换绑的账号验证码');
      return;
    }
    common.request('usercenter/Api/UpdateUserIF', { Code: codev, newmember: newmemberv}, function (data) {
      console.log('账号与安全：-  提交 :'+JSON.stringify(data));
      if (data.rtnCode = 0) {
        common.showToast('none', '更绑成功');
        //跳转个人中心界面
        wx.switchTab({
          url: "/pages/user/user"
        });
      } else {
        common.showToast('none', '' + JSON.stringify(data.rtnMsg) + '');
      }
    }, function (err) {
      console.log('err:'+JSON.stringify(err));
    })
  },
  /* 
    账号与安全：-  返回按钮
  */
  back:function(){
    this.setData({
      zhaqlist: true
    });
  },
  /**
   * 执行计时，60s后可以重新发送短信验证码-countdown()
   */
  countdown: function () {
    var nsecond = 60;
    var that = this;
    that.setData({
      send1: true
    })
    var appCount = setInterval(function () {
      nsecond -= 1;
      that.setData({
        second: nsecond
      })
      if (nsecond < 1) {
        clearInterval(appCount);
        //取消指定的setInterval函数将要执行的代码 
        that.setData({
          send1: false
        })
      }
      // console.log(nsecond);
    }, 1000);
  },
  countdown2: function () {
    var nsecond = 60;
    var that = this;
    that.setData({
      send2: true
    })
    var appCount = setInterval(function () {
      nsecond -= 1;
      that.setData({
        second2: nsecond
      })
      if (nsecond < 1) {
        clearInterval(appCount);
        //取消指定的setInterval函数将要执行的代码 
        that.setData({
          send2: false
        })
      }
    }, 1000);
  },
  /*
    验证手机号是否正确
  */
  vphone:function(e){
    var Del=e;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (Del.length == 0) {
      common.showToast('none','输入的手机号为空');
      return false;
    } else if (Del.length < 11) {
      common.showToast('none', '手机号长度有误！');
      return false;
    } else if (!myreg.test(Del)) {
      common.showToast('none', '手机号有误！');
      return false;
    } else {
      return true;
    }
  },
  emailBlur: function (e) {
    // const { email } = this.data;
    const { email } = e;
    const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (!email) {
      common.showToast('none', '邮箱不能为空');
      return false;
    } else if (!emailReg.test(email)) {
      common.showToast('none', '请输入正确的邮箱');
      return false;
    }else{
      return true;
    }
  },
})