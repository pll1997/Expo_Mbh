// pages/forum/forum.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var bar = 84 / 750 * res.windowWidth
        that.setData({
          clientHeight: res.windowHeight - bar
        });
      }
    });
  },
  swiperTab: function (e) {
    var that = this;
    // console.log(e.detail.current)
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
})