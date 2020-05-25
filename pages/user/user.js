// pages/user/user.js
var common = require('../../common/js/common.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    urls: common.localhost + 'usercenter/wxweb/index?source=小程序',//本地网址可调用
    listarry:[
      { index: 0, src: 'https://s1.ax1x.com/2020/05/07/YZjnRx.png', tlttext: '参会须知', show: true },
      { index: 1, src: 'https://s2.ax1x.com/2019/07/02/ZGDJW4.th.png', tlttext: '账号安全', show: true},
      { index: 2, src: 'https://s2.ax1x.com/2019/07/02/ZGfO8x.th.png', tlttext: '我的二维码', show: true },
      { index: 3, src: 'https://s2.ax1x.com/2019/07/02/ZGh9VH.th.png', tlttext: '我是嘉宾', show: true },
      { index: 4, src: 'https://s2.ax1x.com/2019/07/02/ZGhPIA.th.png', tlttext: '我的行程', show: false },
      { index: 5, src: 'https://s2.ax1x.com/2019/07/02/ZGfzrD.th.png', tlttext: '参会记录', show: false },
      { index: 6, src: 'https://s2.ax1x.com/2019/07/02/ZGhSqe.th.png', tlttext: '购票信息', show: true },
      { index: 7, src: 'https://s2.ax1x.com/2019/07/02/ZGfLP1.th.png', tlttext: '我的购物车', show: true },
      { index: 8, src: 'https://s2.ax1x.com/2019/07/02/ZGfX26.th.png', tlttext: '航班管家', show: true,margin:5 },
      { index: 9, src: 'https://s2.ax1x.com/2019/07/02/ZGfxKO.th.png', tlttext: '我要留言', show: true  },
      { index: 10, src: 'https://s2.ax1x.com/2019/07/02/ZGfjxK.th.png', tlttext: '关于我们', show: true },
    ],
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username:'登陆',
    user_img:'https://s1.ax1x.com/2020/03/26/GSMTMD.th.png',
    defaultimg:'https://s1.ax1x.com/2020/03/26/GSMTMD.th.png',
    status:'',
    sign_outVisible: false,
    usershow: true,
    usersourceNo: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },
  onReady: function () {
    var _that = this;
    setTimeout(() => {
      _that.Sign_out();
    }, 1800000);//定时3小时，清除登陆数据，需重新登陆-(1800000)
  },
  onShow(options) {
    var _that = this;
    _that.ajaxuser_h5();

    return;
    if (wx.getStorageSync('usertoken') == '' || wx.getStorageSync('usertoken') == null || wx.getStorageSync('usertoken')==undefined){
      _that.setData({
        username: '登陆',
        user_img: _that.data.defaultimg,
      });
    }else{
      _that.ajaxuser();
      _that.setData({
        sign_outVisible: true
      });
    }
  },
  /*
    获取用户信息
   */
  ajaxuser:function(e){
    var _that=this;
    var userheader = wx.getStorageSync('userheader');
    var usercookies = wx.getStorageSync('usercookies');
    common.request('Usercenter/Api/profile', {}, function (data, object) {
      var jsonstr = JSON.stringify(data);
      if (data.rtnMsg =='处理成功'){
          var user_img;
          var status = data.data.status;
          var username;
              username = data.data.nickname;
          if (status == 1) {//嘉宾
            user_img = data.data.guest_head_img;
            if (data.data.nickname == '' || data.data.nickname == null || data.data.nickname == undefined) {
              if (data.data.guest_name == '' || data.data.guest_name == null | data.data.guest_name==undefined){
                username = data.data.username
              }else{
                username = data.data.guest_name
              }
            }
          } else if (status == 3 || status == 2) {//普通用户
            user_img = data.data.fileavatar;
            if (data.data.nickname == '' || data.data.nickname == null || data.data.nickname==undefined){
              username = data.data.username
            }
          }
          switch (user_img) {
            case '':
            case null:
            case undefined:
              user_img = _that.data.defaultimg;
              break
            default:
                if (status == 1){
                  user_img = common.yuming + user_img;
                }
              if (data.data.fileavatar == '[object Object]') {
                  user_img = _that.data.defaultimg;
                } else {
                  user_img = user_img;
                }
                
              break;
          }
          var fileavatar = data.data.fileavatar;
          _that.setData({
            username: username,
            user_img: user_img,
            status: status,
          });
        }else{
          common.showToast('none','获取信息有误 请重新登陆获取');
        }
     }, function (err) {
       console.log(JSON.stringify(err))
    });
  },
  //从h5网页端传来的用户数据
  ajaxuser_h5:function(){
    var _that=this;
    var usersource = wx.getStorageSync('usersource');
    var userrealname = wx.getStorageSync('userrealname');
    var userfileavatar = wx.getStorageSync('userfileavatar');
    
    // if (usersource == '网页退出登陆') {} 
    if (usersource == '小程序') {
      _that.setData({
        // usershow: false,
        usersourceNo:true,
        username: userrealname,
        user_img: common.localhost + userfileavatar,
        sign_outVisible: true
      });
    }else{
      _that.setData({
        usershow: true,
        username: '登陆',
        user_img: _that.data.defaultimg,
        usersourceNo:false
      });
    }
    
  },
  /*
    退出登陆
    （需要定时清除数据（登陆过后一定时间内，清除登陆凭证数据））
  */
  Sign_out:function(e){
    var _that=this;
    //清除本地数据--token
    wx.removeStorage({
      key: 'usersource',//usersource-公众号返回的登陆成功凭证 //usertoken--小程序的用户token
      success(res) {
        _that.onShow();
        common.showToast('none','退出登陆成功');
        _that.setData({
          sign_outVisible: false
        });
      },
      fail(err){
        common.showToast('none', '' + JSON.stringify(err)+'');
      }
    });
  },
 
 
  /*
    点击登陆跳转的方法
   */
  bindgetuserinfo: function (e) {
    this.user();
    return;

    var urlv,queryIndex;
    var token = wx.getStorageSync('usertoken');
    if (token == '' || token == null || token == undefined){
        urlv = '/pages/user/use_details/login/login';
        queryIndex = '登陆';
    }else{
	  //修改个人信息
      urlv = '/pages/user/use_details/User_Information/User_Information';
      queryIndex = token;
    }
    wx.navigateTo({
      url: '' + urlv + '?index=' + queryIndex + ''
    });
  },

  /* 跳转网页*/
  user:function(e){
    var queryIndex;
    var urlv;
    if (this.data.usersourceNo==true){
      queryIndex = '个人信息';
    }else{
      queryIndex = '登陆';
    }
    var urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
    wx.navigateTo({
      url: '' + urlv + '?index=' + queryIndex + ''
    });
  },
  /* 
      列表点击事件-跳转到h5的
  */
  bin_list:function(e){
    var tokenNull=true;
    if (this.data.usersourceNo==false) {
      tokenNull = false;
    }
    var queryIndex = e.currentTarget.dataset['item'];
    var urlv, index ='index';
    urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
    switch (queryIndex){
      case '参会须知':
        break;
      case '我要留言':
        urlv = '/pages/user/use_details/user_wyly/user_wyly';
        tokenNull = true;
        break;
      case '关于我们':
        urlv = '/pages/user/use_details/About_us/About_us';
        tokenNull = true;
        break;
      case '账号安全':
        break;
      case '我的二维码':
        break;
      case '我是嘉宾':
        break;
      case '参会记录':
        break;
      case '购票信息':
        break;
      case '我的购物车':
        break;
      case '航班管家': 
         tokenNull = true;
        break;
    }
    
    if (tokenNull==false){
      common.showToast('none', '请先登陆后查看');
      return;
    }
    wx.navigateTo({
      url: '' + urlv + '?index=' + queryIndex + ''
    });
  },
  /* 
      列表点击事件-（跳转小程序原生）
  */
  bin_listv: function (e) {
    var token = wx.getStorageSync('usertoken');
    var tokenNull = true;
    if (token == '' || token == null || token == undefined) {
      // tokenNull=false;
    }
    var queryIndex = e.currentTarget.dataset['item'];
    var urlv, index = 'index';
    switch (queryIndex) {
      case '参会须知':
        urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
        break;
      case '我要留言':
        urlv = '/pages/user/use_details/user_wyly/user_wyly';
        tokenNull = true;
        break;
      case '关于我们':
        urlv = '/pages/user/use_details/About_us/About_us';
        tokenNull = true;
        break;
      case '账号安全':
        urlv = '/pages/user/use_details/use_erweima/use_erweima';
        break;
      case '我的二维码':
        urlv = '/pages/user/use_details/use_erweima/use_erweima';
        break;
      case '我是嘉宾':
        var status = this.data.status;
        if (status == 3) {
          urlv = '/pages/user/use_details/use_erweima/use_erweima';
          index = 'jiabin';
        } else if (status == 2) {
          urlv = '/pages/user/use_details/User_Information/User_Information';
        } else if (status == 1) {
          common.showToast('none', '你已是嘉宾，无需重复激活');
        }
        break;
      case '参会记录':
        common.showToast('none', '未有相应的操作');
        break;
      case '购票信息':
        // urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
        urlv = '/pages/user/use_details/order/order_list/order_list';
        break;
      case '我的购物车':
        // urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
        urlv = '/pages/user/use_details/my_cart/my_cart';
        break;
      case '航班管家':
        urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
        tokenNull = true;
        break;
    }

    if (tokenNull == false) {
      common.showToast('none', '请先登陆后查看');
      return;
    }
    wx.navigateTo({
      url: '' + urlv + '?index=' + queryIndex + ''
    });
  },

})