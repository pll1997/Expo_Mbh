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
    var list1 ='2018 年“民博会”已经进入第十三个年头，本届民博会以“展示文旅精品，助力脱贫攻坚”为主题，由中共贵州省委宣传部、贵州省工业和信息化厅、贵阳市人民政府联合主办，定于11 月23日-25日在贵阳国际会议展览中心举行。';
    _that.setData({
      list1: list1
    });
    
  }
  
})