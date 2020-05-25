// pages/ContentPage/details/all_icon_list/demo.js
var common = require('../../../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls: common.localhost + 'usercenter/wxweb/index?source = 小程序'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }, 
  postMessage: function (e) {
    var _that = this;
    console.log(e);
    return;
    // 拿到H5传的数据。返回看看有没有成功-source
    var dataval = e.detail.data[0].dataval;
    var source = e.detail.data[0].source;
    console.log('---------');
    console.log(source);
    console.log('---------');
    wx.setStorageSync('usersource', '' + source + '');
    wx.setStorageSync('dataval', '' + dataval + '');// wx.getStorageSync('dataval');
    _that.setData({
      dataval: dataval
    });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  
})