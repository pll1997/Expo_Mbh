// pages/observation/observation_details.js

var common=require('../../common/js/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [],
    listarry: {},
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.dates(options.data);
    this.date(options.index);
    
  },
  dates: function (res){
    var _that = this;
    var datas = res;
    var src = 'https://s1.ax1x.com/2020/03/24/8qnY4A.th.png';
    _that.setData({
      src: src,
      carouselList: datas.preview_pics,//请求轮播图
    });
    // common.setNavigationBarTitle('' + listarry[0].name+'');
  },
  date: function (index){
    var _that=this;
    common.request('/observation/api/getList', {}, function (res) {
      var datas = res;
      var datalen = datas.data.data.length;//获取数组的长度
      var listarry = [];//定义新的数组
      for (var i = 0; i < 1; i++) {
        var datalist = datas.data.data[index];//获得每一个单独数组
        listarry.push({
          index: i, id: datalist.id, name: datalist.name, address: datalist.address,
          preview_pics: datalist.preview_pics, latitude: datalist.latitude, longitude: datalist.longitude,
          base_info: datalist.base_info, route: datalist.route, major_commentator: datalist.major_commentator,
          assistant_commentator: datalist.assistant_commentator, exhibition_id: datalist.exhibition_id
        });

      }
      common.setNavigationBarTitle('' + listarry[0].name + '');
      var src ='https://s1.ax1x.com/2020/03/24/8qnY4A.th.png';
      _that.setData({
        listarry: listarry,
        src: src,
        carouselList: listarry[0].preview_pics,//请求轮播图
      });

    }, function (err) {
      console.log('错误：' + err)
    })
  },

  //点击了轮播图
  chomeCarouselClick: function (event) {
    var urlStr = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: 'test?id=1'
    })
  },
  
})