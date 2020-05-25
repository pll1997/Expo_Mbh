var common = require('../../../../../common/js/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    listdata: [
      {
        index: '0', oddNumbers: '155910911710000000147730', Paymentstatus: '支付状态',
        src: 'https://s2.ax1x.com/2019/10/15/KCmWDK.th.png',
        name: '快捷购票', UnitPrice: '0.01', Number: '1', znumber: '1', Total: '0.01'
      },
      {
        index: '1', oddNumbers: '155910911710000000147730', Paymentstatus: '支付状态',
        src: 'https://s2.ax1x.com/2019/10/15/KCmWDK.th.png',
        name: '快捷购票', UnitPrice: '0.01', Number: '1', znumber: '1', Total: '0.01'
      },
      {
        index: '2', oddNumbers: '155910911710000000147730', Paymentstatus: '支付状态',
        src: 'https://s2.ax1x.com/2019/10/15/KCmWDK.th.png',
        name: '快捷购票', UnitPrice: '0.01', Number: '1', znumber: '1', Total: '0.01'
      }
    ],
    list: "",
    rist: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    common.setNavigationBarTitle('购票信息');
    var uid = wx.getStorageSync('uid');
    // 支付信息 已支付
    _that.get_OrderList(1,4)

    // 票务信息
    common.request('/platform/api/memberticket', { uid: uid }, function (data, object) {
      for (var i = 0; i < data.data.list.length;i++){
        data.data.list[i].src ="https://s2.ax1x.com/2019/10/15/KCmWDK.th.png";
      }
      for (var i = 0; i < data.data.rist.length; i++) {
        data.data.rist[i].src = "https://s2.ax1x.com/2019/10/15/KCmWDK.th.png";
      }
      _that.setData({
        list: data.data.list,
        rist: data.data.rist,
      })
    })
  },

  get_OrderList(page, pay_status){
    var uid = wx.getStorageSync('uid');
    console.log(uid)
    var postData = {
      uid: uid,
      pay_status: pay_status,
      page: page,
      limit: 10,
    }
    common.request('/usercenter/api/OrderList', postData, function (data, object) {
      console.log(data)
    });
  },
  
  // 跳转到票务信息详情
  ticket_details(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/use_details/order/order_details/Ticket_details?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var bar = 84 / 750 * res.windowWidth
        that.setData({
          clientHeight: res.windowHeight - bar
        });
      }
    });
  },
  swiperTab: function(e) {
    var that = this;
    // console.log(e.detail.current)
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
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