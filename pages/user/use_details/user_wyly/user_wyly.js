// pages/user/use_details/user_wyly/user_wyly.js
var common = require('../../../../common/js/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈意见',
    });
  },
  Submission:function(){
    common.showToast('none', '反馈成功');
    console.log('这个功能暂时没有接口 待定功能');
    wx.navigateBack({  //返回上一页
      delta: 1
    })
  },
})