// pages/user/use_details/User_Information/User_Information.js
var common = require('../../../../common/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useravatar: 'https://s2.ax1x.com/2019/07/01/Z817aq.png',
    // useravatar: '',
    sfstatus:'',
    themeSelected: '中国',
    index:44,
    sexindex:0,
    szindex:44,
    token:'',
    sexSelected:'请选择',
    companyname:'',
    addclass_isShow:'',
    titlename:'',
    chtext:'确定参会'
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _that=this;
    _that.ajaxlist();
    _that.ajaxuser();
    var tokenv = wx.getStorageSync('usertoken');
    _that.setData({
      // token: options.index
         token: tokenv 
    });
    //解密
    // var obj ='O4MkF757OT4DrcbqvDeCr8aNJEURjwq19hMXh0lWjghHgGABVvcuNA==';
    // console.log(common.decrypt(obj));
  },
  ajaxlist:function(e){
    var _that=this;
    //获取国家的接口
    wx.request({
      url: "https://www.bigdata-expo.cn/json/county_1.json",
      data: { },
      method: "GET",
      success: function (res) {
        // console.log(JSON.stringify(res));
        var arry=[];
        var datalen=res.data.length;
        for (var i = 0; i < datalen; i++) {
          var zh_name = res.data[i].zh_name;
          arry.push({ zh_name: zh_name});
        } 
        _that.setData({
          themeSelected: arry
        });
      },
      fail: function (e) {
        common.showToast('none', '' + e.responseText+'');
      }
    });
    // 性别选择
    var sex = [{ sex: '女'},{ sex: '男' }];
    _that.setData({ sexSelected: sex});
    return;
    //机构所在地--（获取省-市）
    wx.request({
      url: "https://www.bigdata-expo.cn/json/city.json",
      data: {},
      method: "GET",
      success: function (res) {
        // console.log(JSON.stringify(res));
        return;
        var arry = [];
        var datalen = res.data.length;
        
      },
      fail: function (e) {
        common.showToast('none', '' + e.responseText + '');
      }
    });
  },
  bindDateChange:function(e){
    this.setData({
      index: e.detail.value,
    });
  },
  bindszjg: function (e) {
    this.setData({
      szindex: e.detail.value,
    });
  },
  bindsex:function(e){
    this.setData({
      sexindex: e.detail.value
    });
  },
  /*
    获取用户信息
   */
  ajaxuser: function (e) {
    var _that = this;
    common.request('Usercenter/Api/profile', {}, function (data) {
      var jsonstr = JSON.stringify(data);
      // console.log('获取用户信息' + jsonstr);
      var user_img;
      if (user_img == '' || user_img == undefined || user_img == null) {
        user_img = 'https://s2.ax1x.com/2019/07/01/Z817aq.png';
      }
      // 国藉-nationality
      var ntVerificationv;
      var nationalityv=data.data.nationality;
      if (nationalityv == '' || nationalityv == null || nationalityv==undefined){
        ntVerificationv='请选择'
      }
      var fileavatar = data.data.fileavatar;
      var status=data.data.status;
      if (status== 1) {//嘉宾
        var chtext;
        if (status==2){
          chtext='确定参会';
        }else{
          chtext = '提交修改信息';
        }

        user_img = data.data.guest_head_img;
        _that.setData({
          companyname: '所在机构',
          addclass_isShow:true,
          titlename:'职务',
          realname: data.data.guest_name,
          sex: data.data.sex,
          nationality: nationalityv,
          pw_type: data.data.pw_type,
          idnumber: data.data.license_number,
          phone: data.data.phone,
          email: data.data.email,
          company: data.data.company,
          title: data.data.post,
          province: data.data.province + data.data.city,
          index: nationalityv,
          fool: data.data.diet_habit,
          chtext: chtext
        });
      } else if (status == 3) {//普通用户
        var chtext='提交';
        user_img = data.data.fileavatar;
        //普通用户
        _that.setData({
          nickname: data.data.nickname,
          realname: data.data.realname,
          nationality: nationalityv,
          pw_type: data.data.pw_type,
          idnumber: data.data.idnumber,
          company: data.data.company,
          title: data.data.title,
          index: nationalityv,
          companyname:'公司',
          addclass_isShow: false,
          titlename: '职位',
          chtext: chtext
        });
      }
      _that.setData({
        sfstatus: status
      });
      
    }, function (err) {
      console.log(err)
    });
  },
  /*
    提交
  */
  formSubmit: function (e) {
    var _that=this;
    console.log('form发生了submit事件：', e);
    // return;
    var item = e.detail.value;
    var usernamev = item.username,
        fileavatarv = _that.data.useravatar,//头像（图片）
        pw_typev = item.pw_type,//证件类型
        nicknamev = item.nickname, 
        realnamev = item.realname, 
        companyv = item.company,
        titlev = item.title, //职位
        en_titlev = item.en_title, 
        en_namev = item.en_name, 
        idnumberv = item.idnumber,//证件号码
        //nationalityv = _that.data.themeSelected[_that.data.index].zh_name;//nationality国藉
        nationalityv = _that.data.index,
        genderv = _that.data.sexSelected[_that.data.sexindex].sex,//性别（普通用户）
        sexv = _that.data.sexSelected[_that.data.sexindex].sex, //性别（嘉宾）
        phonev = item.phone,//手机号
        emailv = item.email, //邮箱
        // countryv = _that.data.szindex,//所在机构country：CN
        countryv = "CN",//嘉宾的国藉
        foolv = item.fool;//饮食要求
        

    console.log(phonev + "::" + foolv + "::" + genderv);
    var data = {
        username: usernamev, realname: usernamev, nationality: nationalityv, pw_type: pw_typev, company: companyv, title: titlev,
        idnumber: idnumberv, nickname: nicknamev, sex: sexv, country: countryv, fool: foolv
    };
    console.log('usernamev:' + usernamev + 'realname:' + usernamev + 'nationality:' + nationalityv);
    console.log('pw_type:' + pw_typev + 'companyv:' + companyv + 'titlev:' + titlev);
    console.log('idnumberv:' + idnumberv + 'nicknamev:' + nicknamev + 'sexv:' + sexv);
    console.log('countryv:' + countryv + 'foolv:' + foolv);


    // return;
    var url='';
    var status = _that.data.sfstatus;
    console.log('状态：' + status);
    if(status==3){//普通用户
      url = 'Member/Api/InfoUpdate';
    }else{
      //嘉宾
      if (status==2){//创建嘉宾信息
        url = 'usercenter/Api/new_guest';
      } else if (status == 1){//修改嘉宾信息
        url = 'usercenter/Api/editVerify';
      }
    }
    console.log('接口信息：'+url);
    // return;
    common.request(url, data, function (data) {
      console.log('demo---: ' + JSON.stringify(data));
        // wx.switchTab({
        //   url: "/pages/user/user",
        // });

    }, function (err) {
      console.log(err)
    })

  },
  //上传头像直接保存到接口了
  changeuserpicturev: function () {
    var _that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: RequestURL + '/ashx/user_userinfo_changeheadpicture.ashx?key=dPq9oWTc0PBr8Vxl&openid=' + useropenid + '&r=' + Math.random(),
            filePath: tempFilePaths[i],
            name: 'photo',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              console.log(res);
              // _that.setData({
              //   userheadpicture: JSON.parse(res.data).newfilename
              // })
              _that.onShow();//刷新onShow
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              console.log(res);
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
  },
  //上传头像直接保存到接口了
  changeuserpicture: function () {
    var _that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        var str = JSON.stringify(tempFilePaths);
        var str1 = str.replace('http://', '');
        //console.log('demo--'+str1);
        _that.setData({
          useravatar: tempFilePaths
        });
        var lsfp = tempFilePaths[0];
        console.log('图片本地地址：' + lsfp);
        //启动上传等待中...  
        common.showToast('loading', '正在上传中');
        var uploadImgCount = 0;
          var posturl = 'https://www.bigdata-expo.cn/attachment/Api/upload_json';
          wx.uploadFile({
            url: posturl,
            filePath: lsfp,
            name: 'file',
            formData: {
              'token': common.encrypt(_that.data.token)//token  需要加密
              // 'file': lsfp
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              console.log('成功进入后：' + JSON.stringify(res));
              var data = common.decrypt(res.data);
              res = JSON.parse(data);
              console.log('解密：---' + JSON.stringify(res));
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              console.log('加载失败：' + JSON.stringify(res));
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
      }
    });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.useravatar
    })
  },
  //点击图片选择手机相册或者电脑本地图片
  changeAvatar: function (e) {
    return;
    console.log('执行进入了');
    var _that = this
    wx.chooseImage({
      count: 1,// 默认9
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _that.setData({
          useravatar: tempFilePaths
        });
        var posturl = 'https://www.bigdata-expo.cn/attachment/Api/upload_json';
        console.log('执行进入了2' + posturl);
        //这里是上传操作
        wx.uploadFile({
          url: getApp().globalData.clientUrl + posturl, //里面填写你的上传图片服务器API接口的路径 
          filePath: tempFilePaths[0],//要上传文件资源的路径 String类型 
          name: 'avatar',//按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data"//记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function (res) {
            console.log('上传图片：-- '+JSON.stringify(res));
            // return;
            //当调用uploadFile成功之后，再次调用后台修改的操作，这样才真正做了修改头像
            if (res.statusCode = 200) {
              // var data = res.data
              // var statusCode = res.statusCode
              // console.log("返回值1" + data);
              // console.log("返回值2" + statusCode)
              //这里调用后台的修改操作， tempFilePaths[0],是上面uploadFile上传成功，然后赋值到修改这里。
              console.log('demo---:-'+tempFilePaths[0]);
          //  return;
              wx.request({
                url: getApp().globalData.clientUrl + '/update?avatar=' + tempFilePaths[0], //真正修改操作,填写你们修改的API
                header: {
                  'content-type': 'application/json',
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.code == 200) {
                    wx.showToast({
                      title: '修改成功',
                      icon: 'success',
                      duration: 2500
                    })

                    //wx.uploadFile自已有一个this，我们刚才上面定义的var _that = this 把this带进来
                    _that.setData({
                      useravatar: tempFilePaths[0]
                    });
                  }
                },
              })
            }
          }
        })
      }
    })
  },
})