// pages/user/use_details/About_us/About_us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    var val = options.index;
    wx.setNavigationBarTitle({
      title: val,
    });

    _that.shuju();
  },
  shuju:function(){
    var _that=this;
    var list1 ='中国国际大数据产业博览会(简称数博会)，作为全球首个大数据主题博览会，2017年正式升格为国家级博览会，现已成长为全球大数据发展的风向标和业界最具国际性、权威性的平台';
    _that.setData({
      list1: list1
    });
    
  }
  
})