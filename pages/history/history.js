// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  
  lookData:function(e){
    var inx = e.currentTarget.dataset.id;
    var ls = this.data.list;
    wx.setStorageSync("single", ls[parseInt(inx)]);
    wx.switchTab({
      url: '../index/index',
    });
  },

  delData:function(e){
    var that = this;
    wx.showModal({
      title: '警告',
      content: '确定删除该条数据吗？',
      success:function(res){
        if(res.confirm){
          var inx = e.currentTarget.dataset.id;
          var ls = that.data.list;
          ls.splice(inx, 1);
          that.setData({
            list: ls
          })
          wx.setStorageSync("datas", ls);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var datas = wx.getStorageSync("datas") || [];
    this.setData({
      list: datas
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})