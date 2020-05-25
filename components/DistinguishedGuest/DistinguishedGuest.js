// component/forum/forum.js-- 论坛-(嘉宾)-嵌套的js
var common = require('../../common/js/common.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    listarry: {},
    listarryShow:{},
    hiddenName: false,
    inputValue:'',
    nodate: false,
    nodatecentent: ''
  },
  ready: function (e) {
    var _that=this;
    _that.getajaxlist('加载中...');
  },
  /**
   * 组件的方法列表--用于单独写方法调用-如：绑定点击按钮
   */
  methods: {
    /*搜索框文本内容显示 按下键盘执行(可用于即时搜索)*/
    search: function (event) {
      if (event.detail.value == null || event.detail.value == '') {
        this.icon_delete();
      }
      this.setData({
        inputValue: event.detail.value
      })
    },
    /*
      获取接口数据-列表 
    */
    getajaxlist: function (loding) {
      common.showToast('loading', loding);
      var _that = this;
      var pagev=1,limitv=10;
      common.request('guest/api/invitGuestLst', { page: pagev, limit: limitv }, function (res) {
        var datas = res;
        if (datas.rtnCode != 0) {
          _that.setData({
            nodate: true,
            nodatecentent: datas.rtnMsg
          });
        } else {
          var datalen = datas.data.length;//获取数组的长度
          var listarry = [];//定义新的数组
          for (var i = 0; i < datalen; i++) {
            var datalist = datas.data[i];//获得每一个单独数组
            listarry.push({ index: i, id: datalist.id, guest_name: datalist.guest_name, post: datalist.post, company: datalist.company, guest_head_img: common.yuming + datalist.guest_head_img});
          }
          _that.setData({
            listarry: listarry,
            listarryShow: listarry,
            hiddenName:true
          });
          wx.hideToast();
        }
      }, function (err) {
        console.log('错误：' + err)
      })
    },/**
     * 搜索执行按钮---按下搜索键执行
     */
    bindconfirm: function (e) {
      common.showToast('loading','加载中...');
      var _that = this;
      var value = e.detail.value,
        listarry = _that.data.listarry,
        listarryShow = _that.data.listarry,
        newlists = new Array();

      // console.log('demo--'+listarry);

      if (value == "") {
        _that.setData({
          listarry: listarry
        })
      } else {
        for (var i = 0; i < listarry.length; i++) {
          var datalist = listarry[i];//获得每一个单独数组
          if (datalist.guest_name.indexOf(value) >= 0 || datalist.post.indexOf(value) >= 0 || datalist.company.indexOf(value) >= 0) {
            newlists.push(datalist); //添加搜索到的物品名称
          }
        }
        if (newlists.length <= 0) {
          common.showToast('none','未查找到相关内容');
        }else{
          wx.hideToast();
        }
        _that.setData({
          listarryShow: newlists
        });
      }
    },
    /*
      搜索按钮的删除icon
     */
    icon_delete: function () {
      var _that = this;
      var listarry = _that.data.listarryShow;
      if (listarry.length<=0){
        _that.setData({
          hiddenName: false
        });
      };
      _that.getajaxlist();
      _that.setData({
        inputValue: ''
      });
    },
    /* 点击跳转详情 */
    detailsurl:function(e){
      var urlv = '/pages/forum/guest_details';
      wx.navigateTo({
        url: '' + urlv + '?id=' + e.currentTarget.dataset.id
      })
    }
  },
});

