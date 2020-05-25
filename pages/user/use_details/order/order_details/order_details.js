// pages/user/use_details/order/order_details/order_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    _that.ajaxlist();
  },
  ajaxlist:function(){
    var _that=this;
    var arrylist=[
      {
        src: 'https://s2.ax1x.com/2019/10/15/KCmWDK.th.png', name:'2019数博会展会门票普通观众票众',
        price: '50', number:'2'
      },
      {
        src: 'https://s2.ax1x.com/2019/10/15/KCmWDK.th.png', name: '2019数博会展会门票普通观众票众',
        price: '50', number: '2'
      }
    ];
    _that.setData({
      arrylist: arrylist
    });
  }

  
})