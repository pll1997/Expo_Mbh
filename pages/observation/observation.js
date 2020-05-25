// pages/observation/observation.js
var common= require ('../../common/js/common.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    listarry:{},
    listarryShow: {},
    nodate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getajaxlist();
  },
  /*搜索框文本内容显示 按下键盘执行(可用于即时搜索)*/
  search: function (event){
    if (event.detail.value == null || event.detail.value==''){
      this.icon_delete();
    }
    this.setData({
      inputValue: event.detail.value
    })
  },
   /**
     * 搜索执行按钮---按下搜索键执行
     */
  bindconfirm: function (e){
    var _that = this;
    var value = e.detail.value,
      listarry = _that.data.listarry,
      listarryShow = _that.data.listarry,
      newlists = new Array();
    console.log('demmo:--' + value);

    if (value == "") {
      _that.setData({
        listarry: listarry
      })
    } else {
      for (var i = 0; i < listarry.length; i++) {
        var datalist = listarry[i];//获得每一个单独数组
        if (datalist.tltle.indexOf(value) >= 0 || datalist.abstract.indexOf(value) >= 0) {
          newlists.push(datalist); //添加搜索到的物品名称
        }
      }
      if (newlists.length<=0){
        common.showToast('none','未查找到相关内容');
      }
      _that.setData({
        listarryShow: newlists
      })
    }
  },
  /*
    搜索按钮的删除icon
   */
  icon_delete: function () {
    var _that = this;
    _that.getajaxlist();
    _that.setData({
      inputValue: ''
    })
  },
  /*
    获取接口数据-列表 */
  getajaxlist:function(){
    common.showToast('loading','加载中...');
    var _that=this;
    common.request('/observation/api/getList', { limit:0},function(res){
      var datas = res;
      if (datas.rtnCode!=0){
        _that.setData({
          nodate: true,
          nodatecentent: datas.rtnMsg
        });
      }else{
        var datalen = datas.data.data.length;//获取数组的长度
        var listarry=[];//定义新的数组
        for (var i = 0; i<datalen;i++ ) { 
          var datalist = datas.data.data[i];//获得每一个单独数组
          listarry.push({
            index: i, id: datalist.id, name: datalist.name, address: datalist.address,
            preview_pics: datalist.preview_pics, latitude: datalist.latitude, longitude: datalist.longitude,
            base_info: datalist.base_info, route: datalist.route, major_commentator: datalist.major_commentator,
            assistant_commentator: datalist.assistant_commentator, exhibition_id: datalist.exhibition_id
          });
          
        }
        _that.setData({
          listarry: listarry,
          listarryShow: listarry
        });

        wx.hideToast();
      }
    },function(err){
      console.log('错误：'+err)
    })
  },
  btn_details:function(e){
    var idv = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    // console.log('获得相应数组：--' + JSON.stringify(this.data.listarryShow[index]));
    var data = JSON.stringify(this.data.listarryShow[index]);
    //点击列表跳转详情
    var urlv = '/pages/observation/observation_details';
    wx.navigateTo({
      url: '' + urlv + '?data=' + data + '&index=' + index+''
    })
  }
})