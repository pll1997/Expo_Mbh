// pages/forum/guest_details.js--- 嘉宾详情
var common = require('../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guest_name:'',
    company:'',
    post:'',
    guest_head_img:'',
    guestlist: [],
    hiddetishi: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ajaxdata(options.id);
    common.setNavigationBarTitle('嘉宾详情');
  },
  ajaxdata:function(id){
    var _that=this;
    common.request('guest/api/Guestinfo', { id: id }, function (res) {
      res = res.data;
      var guestlist = [];
      var ishiddetishi;
      if (res.guest_meeting.length == 0 || res.guest_meeting.length==null){
        ishiddetishi = false
      }
      else{
        ishiddetishi = true
      }
      for (var i = 0; i < res.guest_meeting.length; i++) {
        var datalist = res.guest_meeting[i];//获得每一个单独数组
        //添加（赋值）获得的数组到新定义的数组中
        guestlist.push({
          index: i,full_name: datalist.full_name,
          time: datalist.start_time + '-' + datalist.end_time, attend_type: datalist.attend_type,
          address: datalist.address + datalist.address_small
        });
      };

      _that.setData({
        guest_name: res.guest_name,
        company: res.company,
        post: res.post,
        guest_head_img: common.yuming +res.guest_head_img,
        guestlist: guestlist,
        hiddetishi: ishiddetishi
      });
    })
  }
  
})