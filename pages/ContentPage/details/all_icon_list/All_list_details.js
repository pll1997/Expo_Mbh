// pages/ContentPage/vr/vr_list/vr_list.js
var common = require('../../../../common/js/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls:'',
    dataval:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.showLoading('加载中...');
    var _that=this;
    var val = options.index;
    var id = options.id;
    _that.url(val,id);
  },
  url:function(obj,id){
    var _that=this;
    var urlv,tlte='数博会';
    var source='小程序';
    //var https ='https://www.bigdata-expo.cn/';
    // var https = common.yuming;
    var https =common.localhost;
    var localhost = common.localhost;
    switch (obj) {
      case '0':
        urlv = https +'platform/ticket/ttype?type=1';
        tlte='订票';
        break;
      case '1':
        urlv = 'https://gz.bigdata-expo.cn:8090/vr/mbh2019/html/';
        tlte = '逛展会';
        break;
      case '2':
        urlv = https +'html/traffic/traffic.html?v=1.2';
        tlte = '交通指南';
        break;
      case '3':
        urlv = https +'html/hotels/hotels.html?v=1.2';
        tlte = '酒店及周边';
        break;
      case '4':
        urlv = https +'exhibitor/wxweb/production';
        tlte = '展商列表';
        break;
      case '5':
        urlv = 'https://gz.bigdata-expo.cn:8090/';
        tlte = '贵州风采';
        break;
      case '6':
        urlv = https +'exhibitor/wxweb/product_recommend?v=1.1';
        tlte = '展品';
        break;
      case '7':
        urlv = https +'exhibitor/wxweb/recommend';
        tlte = '展商';
        break;
      case '8':
        urlv = https +'wxweb/venuereco';
        tlte = '展位图';
        break;
      case '观摩点':
        urlv = https + 'wxweb/observation/' + id+'';
        tlte = '观摩点详情';
        break;
      case '登陆':
        urlv = https + 'usercenter/wxweb/login';
        tlte = '登陆'; 
        break;
      case '个人信息':
        urlv = https + 'usercenter/wxweb/verify';
        tlte = '个人信息';
        break;
      case '账号安全':
        urlv = https + 'usercenter/wxweb/account_security';
        tlte = '账号安全';
        break;
      case '我的二维码':
        urlv = https + 'usercenter/wxweb/qr';
        tlte = '我的二维码';
        break;
      case '我是嘉宾':
        urlv = https + 'usercenter/wxweb/become_guest';
        tlte = '我是嘉宾';
        break;
      case '我的行程':
        urlv = https + 'usercenter/wxweb/login';//-此版权暂时隐藏
        tlte = '我的行程';
        break;
      case '参会记录':
        urlv = https + 'usercenter/wxweb/meetting';
        tlte = '参会记录';
        break;
      case '购票信息':
        _that.setData({
          dataval: _that.data.dataval
        });;
        urlv = https +'usercenter/wxweb/order';
        tlte = '购票信息';
        break;
      case '我的购物车':
        urlv = https + '/usercenter/wxweb/cart';
        tlte = '我的购物车';
        break;
      case '航班管家':
        urlv = 'https://h5.133.cn/hangban/vue/dynamic/query?from=groupmessage';
        tlte = '航班管家';
        break;
      case '论坛列表':
        urlv = https + 'forum/wxweb/item?id=' + id + '&source=' + source+'';
        tlte = '论坛列表';
        break;
      case '参会须知':
        urlv = https+'usercenter/wxweb/chxz';
        break;
      default:
        //url跳转
        // urlv = common.https + 'usercenter/wxweb/index';
        let url = '/pages/user/user',
          queryIndex = '已登陆';
          wx.switchTab({
            url: '' + url + '?index=' + queryIndex + ''
          });
        break;
    } 
    _that.setData({
      urls: urlv +'?source=小程序'
    });
    wx.setNavigationBarTitle({
      title: tlte,
    });
    wx.hideToast();
  },
  /* 拿到H5传的数据。返回看看有没有成功*/
  postMessage: function (e) {
    var _that=this;
    wx.setStorageSync('usersource', '' + e.detail.data[0].source + '');


    var dataval = e.detail.data[0].dataval;
    var realname = dataval[0].realname;
    var fileavatar = dataval[0].fileavatar;
    
    //本地储存数据
    wx.setStorageSync('userdataval', '' + dataval + '');
    wx.setStorageSync('userrealname', '' + realname + '');
    wx.setStorageSync('userfileavatar', '' + fileavatar + '');
   
    // 获取存储数据-demo
    // wx.getStorageSync('dataval');
   
  },
  /*
    网络不给力
   */
  bindloadError: function (e) {
    common.showToast('none', '网络不给力,请稍后重试!');
  },
  /**
   * 成功加载
   */
  bindloadEvent: function (e) {
    setTimeout(function () {
      wx.hideLoading();
    }, 1500);
  },
});
