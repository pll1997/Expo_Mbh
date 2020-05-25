// pages/user/use_details/my_cart/my_cart.js
var common=require('../../../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    hasList: false,          // 列表是否有数据
    checkAll: true,
    maxchecked:false,
    totalCount: 0,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    var _that=this;
    _that.setData({
      hasList: true,
    });
    _that.ajaxlist();
  },
  /*
    获取Ajax数据
   */
  ajaxlist:function(){
    var _that=this;
    var uid = wx.getStorageSync('uid');
    common.request('usercenter/api/Cart', { uid: uid}, function (res, object) {
      if (res.rtnCode==0){
        var datalen = res.data.list.length;
        if (datalen < 1 || datalen == '' || datalen == null || datalen == undefined) {
          //无数据
          _that.setData({
            // show: false
          });
        } else {
          for (var i = 0; i < res.data.list.length;i++){
            res.data.list[i].checked = true;
            for (var j = 0; j < res.data.list[i].list.length;j++){
              res.data.list[i].list[j].checked = true;
              res.data.list[i].list[j].index = j;
              }
          }
          // res.data.list[1].list[0].price=0.3;
          _that.setData({
            list: res.data.list
          })
          _that.calculateTotalV();
          // console.log(_that.data.list)
        }
      }else{
        common.showToast('none', res.rtnMsg);
      }
    }, function (err) {
      console.log(JSON.stringify(err))
    });
  },
  

  /**
   * 用户点击商品减1
   */
  subtracttap: function (e) {
    var index1 = e.target.dataset.index1;
    var index2 = e.target.dataset.index2;
    var list = this.data.list;
    var count = list[index1].list[index2].num;
    if (count <= 1) {
      return;
    } else {
      list[index1].list[index2].num--;
      this.setData({
        list: list
      });
      this.calculateTotalV();
    }
  },

  /**
   * 用户点击商品加1
   */
  addtap: function (e) {
    var index1 = e.target.dataset.index1;
    var index2 = e.target.dataset.index2;
    var list = this.data.list;
    var count = list[index1].list[index2].num;
    list[index1].list[index2].num++;
    this.setData({
      list: list
    });
    this.calculateTotalV();
  },

  
  /*
    删除
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.list;
    list.splice(index, 1);              // 删除购物车列表里这个商品
    this.setData({
      list: list
    });
    if (!list.length) {                  // 如果购物车为空
      this.setData({
        hasList: false              // 修改标识为false，显示购物车为空页面
      });
    } else {                              // 如果不为空
      this.calculateTotalV();           // 重新计算总价格
    }
  },
  
 

  /**
   * 计算商品总数
   */
  calculateTotalV: function () {
    var list = this.data.list;
    var totalCount = 0;
    var totalPrice = 0;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].list.length; j++){
          var good = list[i].list[j];
          if (good.checked) {
            totalCount += good.num;
            totalPrice += good.num * good.price;
          }
      }
    }
    totalPrice = Number(totalPrice.toFixed(2));
    this.setData({
      totalCount: totalCount, //已选择几件商品
      totalPrice: totalPrice //总价
    })
  },

  /*
    单选-icon
   */
  chose: function (e) {
    const index1 = e.currentTarget.dataset.index1;
    const index2 = e.currentTarget.dataset.index2;
    let carts = this.data.list;
    carts[index1].list[index2].checked;
    const selected = carts[index1].list[index2].checked;
    carts[index1].list[index2].checked = !selected;
    var bol=true;
    for (var j = 0; j < carts[index1].list.length; j++) {
      var good = carts[index1].list[j];
      if (good.checked==false){
         bol=false;
      }
    }
    carts[index1].checked = bol;
    this.setData({
      list: carts
    });
    var bol2=true;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].checked == false) {
        bol2=false
      }
    }
    this.setData({
      checkAll: bol2
    })
    this.calculateTotalV();
  },


  /**
   * 小标题板块的选择
   */
  maxselect:function(e){
    var _that=this;
    var index=e.target.dataset.index;
     var list = _that.data.list; 
    const selected = list[index].checked;
    list[index].checked = !selected;
    for (var j = 0; j < list[index].list.length; j++) {
      list[index].list[j].checked = !selected;
    }
    _that.setData({
      list: list,
    });
    var bol2=true;
    for(var i=0;i<list.length;i++){
      if (list[i].checked == false){
        bol2=false
      }
    }
    _that.setData({
      checkAll: bol2,
    })
    _that.calculateTotalV();
  },

  
  /**
   * 用户点击全选
   */
  selectalltap: function (e) {
    var checkAll = this.data.checkAll;
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      list[i].checked = !checkAll;
      for (var j = 0; j < list[i].list.length; j++) {
        list[i].list[j].checked = !checkAll;
      }
    }
    
    this.setData({
      checkAll:!checkAll,
      list: list
    });
    this.calculateTotalV();
  },

})