// component/forum/forum.js-- 论坛-嵌套的js
var common = require('../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    full_name:'',
    abbr_name:'',
    time:'',
    address:'',
    details:'',
    guestlist:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.setNavigationBarTitle('论坛详情');
    this.getdetails(options.id);
  },
  getdetails: function (options){
    var _that = this;
    common.request('forum/api/getForumItem', { id: 1440859989}, function (res) {
      var datas = res.data;
      var time = datas.start_time + '至' + datas.end_time;

      //嘉宾列表
      var guestlist=[];
      for (var i = 0; i < datas.guest.length; i++) {
        var datalist = datas.guest[i];//获得每一个单独数组
        //添加（赋值）获得的数组到新定义的数组中
        guestlist.push({ 
          index: i, id: datalist.id, guest_name: datalist.guest_name, 
          attend_type: datalist.attend_type, company: datalist.company,
          guest_head_img:common.yuming+datalist.guest_head_img
        });
      };
      _that.setData({
        full_name: datas.full_name,
        abbr_name: datas.abbr_name,
        time: time,
        address: datas.address,
        details: datas.details,
        guestlist: guestlist,
      });
    }, function (err) {
      console.log(err)
    })
  },
  /*
    跳转嘉宾详情
   */
  detailsurl:function(e){
    var urlv = '/pages/forum/guest_details';
    wx.navigateTo({
      url: '' + urlv + '?id=' + e.currentTarget.dataset.id
    })
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})