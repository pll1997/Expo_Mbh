


Page({

  /**
   * 页面的初始数据
   */
  data: {
    rotateList: [
      { index: 0, src: 'https://s2.ax1x.com/2019/06/18/VLED2V.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLEB80.th.png', selecticon:false },
      { index: 1, src: 'https://s2.ax1x.com/2019/06/18/VLEqVH.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLEHqe.th.png', selecticon: false},
      { index: 2, src: 'https://s2.ax1x.com/2019/06/18/VLE7rD.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLEOIA.th.png', selecticon: false},
      { index: 3, src: 'https://s2.ax1x.com/2019/06/18/VLELad.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLEjPI.th.png', selecticon: false},
      { index: 4, src: 'https://s2.ax1x.com/2019/06/18/VLExRP.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLEzxf.th.png', selecticon: false},
      { index: 5, src: 'https://s2.ax1x.com/2019/06/18/VLEvGt.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLVpM8.th.png', selecticon: false},
      { index: 6, src: 'https://s2.ax1x.com/2019/06/18/VLV9sS.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLViZQ.th.png', selecticon: false},
      { index: 7, src: 'https://s2.ax1x.com/2019/06/18/VLVFaj.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLVkIs.th.png', selecticon: false},
      { index: 8, src: 'https://s2.ax1x.com/2019/06/18/VLVEin.th.png', selectSrc: 'https://s2.ax1x.com/2019/06/18/VLVZR0.th.png', selecticon: false}
    ],
  },
  onLoad(options) {
    var _that = this;
   
  },
  onShow(){
    var _that = this;
    _that.select_icon();
  },

  
  /* 
    icon点击事件
  */
  btnicon: function (e) {
    var _that = this;
    var queryIndex = e.currentTarget.dataset['index'];
    _that.select_icon();
    //显示点中样式
    var selecticon = 'rotateList[' + queryIndex + '].selecticon';
    _that.setData({
      [selecticon]: true,
    });
    // 被点击时传递的参数
    var queryIndex = e.currentTarget.dataset['index'];
    //url跳转
    var urlv = '/pages/ContentPage/details/all_icon_list/All_list_details';
    wx.navigateTo({
      url: '' + urlv + '?index=' + queryIndex + ''
    });
  },
  /**
   * 选中样式的icon 
  */
  select_icon: function (select){
    var _that = this;
    var rotateList = _that.data.rotateList;
    for (var i = 0; i < _that.data.rotateList.length; i++) {
      var x = 'rotateList[' + i + '].selecticon'
      _that.setData({
        [x]: false,
      });
    }
  },
})