//index.js

Page({
  data: {
    title:"",
    YName:"",
    XName:"",
    listData:[
      { "name": "项目","data":0},
      { "name": "项目","data":0},
      { "name": "项目","data":0}
    ]
  },
  
  changeItem:function(e){
    var index = e.target.dataset.indexs;
    var list = this.data.listData;
    list[index] = {"name":e.detail.value,"data":this.data.listData[index].data};
    this.setData({
      listData:list
    })
  },
  
  changeNum:function(e){
    var index = e.target.dataset.indexs;
    var list = this.data.listData;
    list[index] = { "name": this.data.listData[index].name, "data":e.detail.value};
    this.setData({
      listData: list
    })
  },

  delData:function(e){
    var that = this;
    wx.showModal({
      title: '警告',
      content: '确定删除该条数据吗？',
      success: function (res) {
        if (res.confirm) {
          var inx = e.currentTarget.dataset.indexs;
          var ls = that.data.listData;
          ls.splice(inx, 1);
          that.setData({
            listData: ls
          })
        }
      }
    })
  },

  formSubmit:function(e){
    if (this.data.listData.length <= 0) {
      wx.showToast({
        title: "没有数据存在",
        icon: "success",
        duration: 1500
      })
      return;
    }
    var xname = e.detail.value.XName;
    var yname = e.detail.value.YName;
    var title = e.detail.value.title;
    var stData = {ti:title,xn:xname,yn:yname,ds:this.data.listData};
    wx.setStorageSync("stdata",stData);
    wx.navigateTo({
      url: '../statics/statics'
    })
  },

  formReset:function(){
    var list = [
      { "name": "项目", "data": 0 },
      { "name": "项目", "data": 0 },
      { "name": "项目", "data": 0 }
    ];
    var that = this;
    wx.showModal({
      title: '警告',
      content: '所有填写数据均会消失，是否重置？',
      success:function(res){
        if (res.confirm){
          that.setData({
            listData: list,
            YName: "",
            XName: "",
            title: ""
          })   
        }
      }
    })    
  },

  addLine:function(){
    var that = this;
    var obj = {"name":"项目","data":0};
    that.data.listData.push(obj);
    that.setData({
      listData:that.data.listData
    });
  },

  removeLine:function(){
    var that = this;
    if (that.data.listData.length <= 0){
      wx.showToast({
        title:"没有数据存在",
        icon:"success",
        duration:1500
      })
      return;
    }
    that.data.listData.pop();
    that.setData({
      listData:that.data.listData
    });
  },

  onLoad: function () {
    var stData = {
      ti: "", xn: "", yn: "", ds: [{ "name": "项目", "data": 0 },{ "name": "项目", "data": 0 },
        { "name": "项目", "data": 0 }]};
    wx.setStorageSync("stdata",stData);
    wx.setStorageSync("single",null);
  },

  onShow:function(){
    var ds = wx.getStorageSync("single");
    if (ds != null) {
      //读取数据
      var t = ds.title;
      var xn = ds.Xname;
      var yn = ds.Yname;
      var da = ds.data;
      this.setData({
        title:t,
        XName:xn,
        YName:yn,
        listData:da
      })

      //清除缓存中的数据
      ds = null;
      wx.setStorageSync("single", ds);
    }
  }
})