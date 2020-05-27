// component/forum/forum.js-- 论坛-嵌套的js
var common = require('../../common/js/common.js');
var pageIndexv = 1, pageSizev = 9999, mSelectThemeIdv = 0;
var dateSelectedv = '', addressSelectedv = '',
  themeSelectedv = '', thmmeid = 0;
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
    date: '2016-09-01',
    dateList: [],
    dateSelected: '日期',
    addressList:[],
    addressSelected:'地址',
    themeList: [],
    themeSelected: '主题',
    listarry:{},
    thmmeid:0,
    nodate: false,
    nodatecentent:''
  },
  /**
   * 组件的方法列表--筛选
   */
  methods: {
    bindDateChange: function (e) {
      common.showToast('loading', '加载中...');
      var _that=this;
      if (e==undefined){
        //未有任何动作时
        var index = 0, val = undefined;
      }else{
        var index = (e.detail.value), val = e.currentTarget.dataset['item'];
      }
      switch (val) {
        case '日期':
          dateSelectedv = _that.data.dateList[index].start_time;
          _that.setData({
            dateSelected: dateSelectedv
          });
          if (dateSelectedv == '全部'){
            dateSelectedv = '';
          }
          break;
        case '地址':
          addressSelectedv = _that.data.addressList[index].type_addr;
          _that.setData({
            addressSelected: addressSelectedv
          });
          if (addressSelectedv == '全部') {
            addressSelectedv = '';
          }
          break;
        case '主题':
          themeSelectedv = _that.data.themeList[index].type_theme;
          thmmeid = _that.data.themeList[index].id;
          _that.setData({
            themeSelected: themeSelectedv,
            thmmeid: thmmeid
          });
          if (themeSelectedv == '全部') {
            themeSelectedv = '';
          }
          break;

        default:
          break;
      }
    
      var datas={
          pageIndex: pageIndexv, pageSize: pageSizev,
          type_time: dateSelectedv, type_addr: addressSelectedv,
          type_theme: themeSelectedv, thmmeid: _that.data.thmmeid
      };
     
      //下拉选择 -- ajax列表数据获取
      common.request('forum/Api/get_forum_list', datas, function (res) {
        var datas = res;
        var id = datas.data[0];
        var msg=datas.data.msg;
        if (datas.rtnCode != 0) {
          _that.setData({
            nodate: true,
            nodatecentent: datas.rtnMsg
          });
        } else {
          if (datas.rtnMsg =='处理成功'){
              var datalen = datas.data.length;//获取数组的长度
            if (datalen <= 0 || datalen == '' || datalen==null){
                _that.setData({
                  nodate: true,
                  nodatecentent:'暂时没有数据哟~'
                });
              }
              var listarry = [];//定义新的数组
              for (var i = 0; i < datalen; i++) {
                var datalist = datas.data[i];//获得每一个单独数组
                //添加（赋值）获得的数组到新定义的数组中
                listarry.push({ index: i, tltle: datalist.full_name, abstract: datalist.address, start_time: datalist.start_time, end_time: datalist.end_time, id: datalist.id });
              };
              wx.hideToast();
              _that.setData({
                listarry: listarry //赋值（给在data里面最先定义的空数组-里面赋值有内容的数组）
              });
            if (msg == '请求失败或数据不存在') {
              common.showToast('none','没有查找到你选择的数据哦');
            } 
          }else{
            common.showToast('none','查找失败,请刷新页面重试');
          }
        }
      }, function (err) {
        console.log(err)
      })
    },
    //日期-地址-主题
    get_forum_type:function(){
      var _that=this;
      common.request('forum/Api/get_forum_type', {}, function (res) {
        var datas = res;
          if (datas.rtnCode != 0) {}else{
          var datatimelen = datas.data.type_time.length,
            type_addrlen = datas.data.type_addr.length,
            type_themelen = datas.data.type_theme.length;
          var timearry = [],
            addressList = [],
            themeList = [];
          for (var i = 0; i < datatimelen; i++) {
            var datatime = datas.data.type_time[i];//获得每一个单独数组
            timearry.push({ index: i, start_time: datatime.start_time });
          }
          for (var a = 0; a < type_addrlen; a++) {
            var type_addra = datas.data.type_addr[a];//获得每一个单独数组
            addressList.push({ index: a, type_addr: type_addra.type_addr });
          }
          for (var b = 0; b < type_themelen; b++) { //主题
            var type_themeb = datas.data.type_theme[b].type_theme;
            themeList.push({ index: b, type_theme: type_themeb.theme, id: type_themeb.id, });
          }
          _that.setData({
            dateList: timearry,
            addressList: addressList,
            themeList: themeList
          });
        }
      }, function (err) {
        console.log(err)
      })
    },
    /*跳转详情*/
    detailsurl:function(e){
      var urlv = '/pages/forum/forum_details';
      wx.navigateTo({
        url: '' + urlv + '?id=' + e.currentTarget.dataset.id
      })
    },

    // 测试--()
    test:function(){
       common.requests('forum/wxweb/forum_list', { limit: 100 }, function (res) {
        // console.log('demo:' + JSON.stringify(res));
      }, function (err) {
        console.log('err---"'+err)
      });
    }

  },
  ready: function (e) {
    var _that=this;
    _that.bindDateChange();
    _that.get_forum_type();
    // _that.test();
   
  },
 
  
});

