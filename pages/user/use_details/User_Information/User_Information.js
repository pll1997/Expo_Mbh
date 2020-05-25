// pages/user/use_details/User_Information/User_Information.js
var common = require('../../../../common/js/common.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    useravatar: 'https://s1.ax1x.com/2020/03/24/8qnY4A.th.png',
    defaultimg:'https://s1.ax1x.com/2020/03/24/8qnY4A.th.png',
    path: '',
    guest_head_img:'',
    sfstatus: '',
    _sfstatus:false,
    themeSelected: '中国',
    nationality:'CN',
    index: 44,
    sexindex: 0,
    szindex: 44,
    token: '',
    sexSelected: '请选择',
    companyname: '',
    addclass_isShow: '',
    titlename: '',
    zjhm:'',
    chtext: '确定参会',
    disabled:false,
    disableds: false,
    setNavigationBarTitle:'',
    pw_type: '身份证'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    _that.ajaxlist();
    _that.ajaxuser();
    var tokenv = wx.getStorageSync('usertoken');
    _that.setData({
      // token: options.index
      token: tokenv
    });
    
  },
  ajaxlist: function(e) {
    var _that = this;
    //获取国家的接口
    wx.request({
      url: common.yuming+"json/county_1.json",
      data: {},
      method: "GET",
      success: function(res) {
        _that.setData({
          themeSelected: res.data
        });
      },
      fail: function(e) {
        common.showToast('none', '' + e.responseText + '');
      }
    });
    // 性别选择
    var sex = [{sex: '女'}, {sex: '男'}];
    _that.setData({
      sexSelected: sex
    });
    return;
    //机构所在地--（获取省-市）--和国藉用一个接口 所以这个暂时无用
    wx.request({
      url: "https://www.bigdata-expo.cn/json/city.json",
      data: {},
      method: "GET",
      success: function(res) {
        // console.log(JSON.stringify(res));
        return;
        var arry = [];
        var datalen = res.data.length;

      },
      fail: function(e) {
        common.showToast('none', '' + e.responseText + '');
      }
    });
  },
  bindDateChange: function(e) {
    var pw_typev;
    switch (this.data.themeSelected[parseInt(e.detail.value)].code) {
      case 'CN':
        pw_typev = '身份证';
        break;
      case 'HK':
      case 'MO':
        pw_typev = '通行证';
        break;
      default:
        pw_typev = '护照';
        break;
    }
    this.setData({
      index: e.detail.value,
      nationality: this.data.themeSelected[parseInt(e.detail.value)].code,
      pw_type: pw_typev
    });
  },
  bindszjg: function(e) {
    this.setData({
      szindex: e.detail.value,
    });
  },
  bindsex: function(e) {
    this.setData({
      sexindex: e.detail.value
    });
    
  },
  /*
    测试方法--（用于测试）
   */
  test: function () {
    var _that = this;
  },

  /*
    获取用户信息
   */
  ajaxuser: function(e) {
    var _that = this;
    var yuming = common.yuming;
    common.request('Usercenter/Api/profile', {}, function(data) {
      var jsonstr = JSON.stringify(data);
      // console.log('获取用户信息' + jsonstr);
      // return;
      var user_img;
      // 国藉-nationality
      var ntVerificationv;
      var nationalityv = data.data.nationality; var country = data.data.country;
      if (nationalityv == '' || nationalityv == null || nationalityv == undefined) {
        ntVerificationv = '请选择'
      }
      /*把国藉的编码转换成正常的文字-如 "zh_name": "阿富汗", "en_name": "Afghanistan", "code": "AF"
          把code， 转为.._name;
        */
      var themeSelected = _that.data.themeSelected;
      for (var i = 0; i < themeSelected.length; i++) {
        var themeSelectedval = themeSelected[i].code;
        if (themeSelectedval == nationalityv || themeSelectedval == country) {
          _that.setData({
            index: i,
            szindex: i
          });
        }
      }
      // 用户头像
      var fileavatar = data.data.fileavatar;
      var status = data.data.status;// status=1/2  跳转嘉宾确认界面
      var is_guest = data.data.is_guest;//is_guest=1 是嘉宾--其它都是普通用户

      if (status == 3 || status == 2) {
        switch (fileavatar) {
          case '':
          case null:
          case undefined:
            user_img = _that.data.defaultimg;
            break
          default:
            if (fileavatar == '[object Object]') {
              user_img = _that.data.defaultimg;
            } else {
              user_img = data.data.fileavatar;
            }
            break;
        }
      }
      if (status == 1 || status == 2){ 
        //嘉宾
        var chtext;
        if (status == 2) {
          chtext = '确定参会';
        } else {
          chtext = '提交并确认参会';
        }
        var is_join = data.data.is_join;//is_join==1已经确定参会
        if (status == 1){
          switch (data.data.guest_head_img) {
            case '':
            case null:
            case undefined:
              user_img = _that.data.defaultimg;
              break
            default:
              user_img = yuming + data.data.guest_head_img;
              break;
          }
        }
        var pw_typev;
        switch (nationalityv){
          case 'CN':
            pw_typev='身份证';
          break;
          case 'HK':
          case 'MO':
            pw_typev = '通行证';
            break;
          default:
            pw_typev = '护照';
          break;

        }
        
        _that.setData({
          companyname: '所在机构',
          addclass_isShow: true,
          titlename: '职务',
          zjhm: '证件号码',
          useravatar: user_img,
          realname: data.data.realname,//guest_name
          sex: data.data.sex,
          nationality: nationalityv,
          pw_type: pw_typev,
          idnumber: data.data.license_number,
          phone: data.data.phone,
          email: data.data.email,
          company: data.data.company,
          title: data.data.title,
          country: country+data.data.province + data.data.city,
          index: _that.data.index,
          fool: data.data.diet_habit,
          chtext: chtext,
          setNavigationBarTitle: '嘉宾信息确认',
          disableds:true
        });
      } else if (status == 3 ) { 
        //普通用户
        var chtext = '提交';
        _that.setData({
          useravatar: user_img,//头像
          nickname: data.data.nickname,
          realname: data.data.realname,
          idnumber: data.data.license_number,
          company: data.data.company,
          title: data.data.title,
          index: _that.data.index,
          phone: data.data.phone,
          email: data.data.email,
          companyname: '公司',
          addclass_isShow: false,
          titlename: '职位',
          zjhm:'身份证号码',
          chtext: chtext,
          disabled:true,
          setNavigationBarTitle:'个人信息'
        });
      }
      var _sfstatus=false;
      if (is_join == 1 && status == 1) {
         _sfstatus=true;
      }
      common.setNavigationBarTitle(_that.data.setNavigationBarTitle);
      _that.setData({
        sfstatus: status,
        _sfstatus: _sfstatus,
        guest_head_img: _that.data.useravatar
      });
    }, function(err) {
      console.log(err)
    });
  },
  
  /*
    提交
  */
  formSubmit: function(e) {
    var _that = this;
    // _that.test();
    // return;
    var item = e.detail.value;
    var url = '';
    var status = _that.data.sfstatus;
    // 判断头像是否为空
    var path = _that.data.path;
    var useravatar = _that.data.useravatar;
    var head_img;
    
    if (status == 1 || status == 2) {
      if (path == '' || path == null || path == undefined) {
        common.showModals('必须上传头像');
        return false;
      } 
      else if (useravatar == '[object Object]' || useravatar == '' || useravatar == null || useravatar == undefined){
        head_img='';
      } else if (path !='' || path != null || path != undefined){
        head_img = path;
      }
      else {
        head_img = useravatar;
      }
    } else {
      if (path == '' || path == null || path == undefined) {
        if (useravatar == '[object Object]' || useravatar == '' || useravatar == null || useravatar==undefined) {
          head_img = '';
        } else {
          head_img = useravatar;
        }
      } else {
        head_img = path;
      }

    }
   
    
    //验证表单
    var checkRes = checkNullForm(e, _that.data.sfstatus);
    // console.log("调用工具结果：", checkRes)
    if (!checkRes) {
      console.log("表单存在异常，终止提交！")
      return;
    }
    
   
    var usernamev = item.username,
      pw_typev = item.pw_type, //证件类型
      nicknamev = item.nickname,
      realnamev = item.realname,
      companyv = item.company,
      titlev = item.title, //职位
      en_titlev = item.en_title,
      en_namev = item.en_name,
      nationalityv=_that.data.nationality,
      idnumberv = item.idnumber, //证件号码
      genderv = _that.data.sexSelected[_that.data.sexindex].sex, //性别（普通用户）
      sexv = _that.data.sexSelected[_that.data.sexindex].sex, //性别（嘉宾）
      phonev = item.phone, //手机号
      emailv = item.email, //邮箱
      countryv = _that.data.themeSelected[_that.data.szindex].code, //机构所在地
      foolv = item.fool; //饮食要求

    
    //普通用户
    if (status == 3) { 
      url = 'Member/Api/InfoUpdate';
      var data = {
        fileavatar: head_img,
        username: usernamev,
        realname: usernamev,
        nickname: nicknamev,
        idnumber: idnumberv,
        company: companyv,
        title: titlev,
      };
    } else {
      //嘉宾
      if (status == 2) { //创建嘉宾信息
        url = 'usercenter/Api/new_guest';
      } else if (status == 1) { //修改嘉宾信息
        url = 'usercenter/Api/editVerify';
      }
      

      //嘉宾修改的所以参数为必传，包括头像
      var data = {
        guest_head_img: head_img,
        guest_name: usernamev,
        nationality: nationalityv,
        pw_type: pw_typev,
        license_number: idnumberv,
        phone: phonev,
        email: emailv,
        company: companyv,
        post: titlev,
        country: countryv,
        diet_habit: foolv,
        sex: sexv,
        province: '',//机构所在地的省
        city: '',//机构所在地的市
      };
    }
    

    // console.log('demo-' + url + JSON.stringify(data));
    // return;
    common.request(url, data, function(data) {
      switch (data.rtnCode){
          case 0:
            if (status == 3) { //普通用户-修改信息
              var txt;
              switch (data.rtnCode) {
                case 0:
                  txt = '修改成功';
                  break;
                default:
                  txt = '' + data.rtnMsg + '';
                  break;
              }
              common.showToast('none', txt);
            } else {
              var chtext = '修改参会信息';
              if (data.rtnCode == 0 || data.rtnMsg == '处理成功') {
                _that.setData({
                  chtext: chtext,
                  _sfstatus: true
                });
              }
              else if (data.rtnCode == 105 || data.rtnCode == 118) {

              }
              else if (data.rtnCode == 106) {

              }
            }
            return;
            //成功后返回个人中心界面
            wx.switchTab({
              url: "/pages/user/user",
            });
          break;
          default:
          common.showToast('none', '' + data.rtnMsg + '');
          break;
      }
    }, function(err) {
      console.log(err)
    })

  },
  /*
    取消参会
  */
  quxiaoch:function(e){
    common.request('usercenter/Api/quit', {}, function (data) {
      common.showToast('none','取消参会成功');
      //url跳转
      wx.switchTab({
        url: "/pages/user/user",
      });
    }, function (err) {
      common.showToast('none', JSON.stringify(err));
    })
  },
  //上传头像直接保存到接口了
  changeuserpicture: function() {
    var _that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        _that.setData({
          useravatar: tempFilePaths
        });
        var lsfp = tempFilePaths[0];
        //启动上传等待中...  
        common.showToast('loading', '头像正在上传中');
        var uploadImgCount = 0;
        var posturl = 'attachment/Api/upload_json';
        common.upload(posturl, lsfp, {
          token: _that.data.token
        }, function(res) {
          // wx.hideToast();
          _that.setData({
            path: res.data.path
          });
          }, function (error) {
            wx.hideToast();
            common.showModal('错误提示','上传图片失败');
        });
      }
    });
  },
});
//验证表单是否有值为空
function checkNullForm(e, sfstatus) {
  // console.log("已传入参数（如下），开始执行检测...", e)
  var formData = e.detail.value   // 声明变量，值为表单内容
  var hint = "";    // 声明提示语
  // 循环遍历表单内容
  for (var item in formData) {
    // 打桩 - 查看表单信息
    // console.log(item, "：", e.detail.value[item])
    switch (sfstatus){
      case 3:
        // 如下 ，根据自己表单的结构来增删提示语注意，indexOf中全部是小写
        if (e.detail.value[item] == "" | e.detail.value[item] == 'undefined') {
          break;  // 跳出循环
        }
      break;
      default:
        // 跳出选填选项选填选项
        if (item == 'fool') {	// 将选填选项放入括号内
          continue;
        }
        // 如下 ，根据自己表单的结构来增删提示语注意，indexOf中全部是小写
        if (e.detail.value[item] == "" | e.detail.value[item] == 'undefined') {
          // 根据提示语给出提示
          item.toLowerCase();
          if (item.indexOf("nickname") >= 0) {
            hint = "请填写昵称";
          } else if (item.indexOf("username") >= 0) {
            hint = "请填写姓名";
          } else if (item.indexOf("sex") >= 0) {
            hint = "请选择性别";
          } else if (item.indexOf("nationality") >= 0) {
            hint = "请选择国藉";
          } else if (item.indexOf("pw_type") >= 0) {
            hint = "请填写证件类型";
          } else if (item.indexOf("idnumber") >= 0) {
            hint = "请填写证件号码";
          } else if (item.indexOf("phone") >= 0) {
            hint = "请填写手机号";
          } else if (item.indexOf("email") >= 0) {
            hint = "请填写邮箱";
          } else if (item.indexOf("company") >= 0) {
            hint = "请填写公司或机构名称";
          } else if (item.indexOf("country") >= 0) {
            hint = "请选择机构所在地";
          } else if (item.indexOf("title") >= 0) {
            hint = "请填写职务";
          } else if (item.indexOf("") >= 0) {
            hint = "请检查是否全部填写";
          } else {
            hint = "请填写" + item;   // 生成提示语
          }
          break;  // 跳出循环
        }
      break
    }
    
  }
  
  // console.log('hint--:'+hint);
  // 判断，如果存在提示语，则提示用户端，存在漏填选项
  if (hint !== "") {
    wx.showModal({
      content: hint,
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#000000',
    })
    return false; // 未通过验证,返回false
  } else {
    // 反之，表单填写正常，返回true，执行后续操作
    return true;  // 通过验证，返回true
    console.log("通过检测，执行业务...")
  }
}