// pages/statics/statics.js
var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
var lineChart = null;
var startPos = null;
var pieChart = null;
var columnChart = null;
var ringChart = null;

//获取时间函数
var getTime = function(){
  var myDate = new Date();
  var y = myDate.getFullYear();
  var m = myDate.getMonth() + 1;
  var d = myDate.getDate();
  return [y,m,d]
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    toyear:"",
    tomonth:"",
    today:"",
    listData:[],
    xname:"xname",
    yname:"yname",
    title:"",
    maxname:"",
    maxnum:0,
    minname:"",
    minnum:0,
    avgnum:0,
    datasum:0,
    curname:"曲线图",
    curButname:"更换柱状图表",
    isLine:true,
    pipname:"饼图",
    isPip:true,
    pipButname: "更换环形图表",
    pieRingData:[],
    modalhidden:true,
    whichBut:"",
    modalInput:""
  },
  
  //设置最大值,最小值
  getMaxMin:function(){
    var min;
    var max;
    var list = this.data.listData;
    var i = 0;
    if (list.length % 2 == 0)             //偶数时取前两个值
    {
      i = 2;
      if (parseFloat(list[0].data) > parseFloat(list[1].data)){
        min = list[1];
        max = list[0];
      }else{
        min = list[0];
        max = list[1];
      }
    } else {                                           //奇数时取第一个值
      i = 1;
      min = list[0];
      max = list[0];
    }
    for (; i < list.length; i = i + 2)                           //成对比较余下的元素
    {
      if (parseFloat(list[i].data) > parseFloat(list[i+1].data)) {
        if (parseFloat(min.data) > parseFloat(list[i+1].data)){
          min = list[i+1];
        }
        if (parseFloat(max.data) < parseFloat(list[i].data)){
          max = list[i];
        }
      } else {
        if (parseFloat(min.data) > parseFloat(list[i].data)){
          min = list[i];
        }
        if (parseFloat(max.data) < parseFloat(list[i+1].data)){
          max = list[i+1];
        }
      }
    }
    return [min,max];
  },

  setMaxMin:function(){
    var xx = this.getMaxMin();
    this.setData({
      minname: xx[0].name,
      minnum: parseFloat(xx[0].data),
      maxname: xx[1].name,
      maxnum: parseFloat(xx[1].data)
    })
  },
  
  //设置平均值，总和
  getAverage:function(){
    var list = this.data.listData;
    var sum = 0;
    for (var i = 0;i < list.length;i++){
      sum += parseFloat(list[i].data);
    }
    this.setData({
      avgnum: (sum / list.length).toFixed(2),
      datasum:sum
    })
  },

  //得到饼图、环形图的数据
  setPieRingData: function () {
    var list = [];
    for (var ix = 0; ix < this.data.listData.length; ix++) {
      var obj = { "name": this.data.listData[ix].name, "data": parseFloat(this.data.listData[ix].data), "color": '#' + Math.floor(Math.random() * 0xffffff).toString(16) };
      list.push(obj);
    }
    this.setData({
      pieRingData: list
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面传参
    var stData = wx.getStorageSync("stdata");
    var xn = stData.xn;
    var yn = stData.yn;
    var ti = stData.ti;
    var ds = stData.ds;

    //设置时间
    var dates = getTime();
    
    
    this.setData({
      listData:ds,
      xname:xn,
      yname:yn,
      title:ti,
      toyear:dates[0],
      tomonth:dates[1],
      today:dates[2],
      curname:ti+'曲线图',
      pipname:ti+'饼图'
    })
    //设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.title,
    })

    //设置最大最小值
    this.setMaxMin();

    //设置平均值
    this.getAverage();

    this.setPieRingData();

    //显示折线，饼图
    this.showCurChart(options);
    
    this.showPipChart(options);

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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  //显示折线图
  showCurChart:function(e){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      series: [{
        name: this.data.xname,
        data: simulationData.data,
       
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: this.data.yname,
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  

  //显示饼图
  showPipChart:function(e){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var list = this.data.pieRingData;
    pieChart = new wxCharts({
      animation: false,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: list,
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
  },

  showRingChart:function(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var list = this.data.pieRingData;
    ringChart = new wxCharts({
      animation: false,
      canvasId: 'pieCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: this.data.avgnum,
        color: '#7cb5ec',
        fontSize: 16
      },
      subtitle: {
        name: '平均值',
        color: '#666666',
        fontSize: 16
      },
      series: list,
      disablePieStroke: true,
      width: windowWidth,
      height: 300,
      dataLabel: true,
      legend: true,
      background: '#f5f5f5',
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  },
   
  //显示柱状图表
  showColumnChart:function(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    columnChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'column',
      animation: false,
      categories: simulationData.categories,
      series: [{
        name: this.data.xname,
        data: simulationData.data
      }],
      yAxis: {
        title: this.data.yname
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
      enableScroll: true
    });
  },

  //互换折线，柱状图表
  changeColumn:function(){
    if(this.data.isLine){
      this.showColumnChart();
      this.setData({
        isLine:false,
        curButname: "更换折线图表",
      })
    }else{
      this.showCurChart();
      this.setData({
        isLine: true,
        curButname: "更换柱状图表",
      })
    }
  },

  //互换饼图，环形图表
  changeRing:function(){
    if (this.data.isPip) {
      this.showRingChart();
      this.setData({
        isPip: false,
        pipButname: "更换饼形图表",
      })
    } else {
      this.showPipChart();
      this.setData({
        isPip: true,
        pipButname: "更换环形图表",
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  /**
   * 折线图表示
   */
  touchHandler: function (e) {
    var curpie = e.target.dataset.curpie;
    if (curpie == "cur"){
      if (this.data.isLine) {
        lineChart.scrollStart(e);
      } else {
        columnChart.scrollStart(e);
      }
    } else if (curpie == "pie"){
      var piering = this.data.isPip ? pieChart : ringChart;
      var index = piering.getCurrentDataIndex(e);
      console.log(index);
      if (index > -1 && index < this.data.pieRingData.length){
        var prd = this.data.pieRingData;
        prd[index].color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
        this.setData({
          pieRingData:prd
        });
        var that = this;
        piering.updateData({
          series: that.data.pieRingData
        });
      }
    }
  },

  moveHandler: function (e) {
    if (this.data.isLine) {
      lineChart.scroll(e);
    }else{
      columnChart.scroll(e);
    }
  },

  touchEndHandler: function (e) {
    var that = this;
    if (this.data.isLine) {
      lineChart.scrollEnd(e);
      lineChart.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + that.data.yname + ':' + item.data
        }
      });
    } else{
      columnChart.scrollEnd(e);
    } 
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    var list = this.data.listData;
    for (var i = 0; i < list.length; i++) {
      categories.push(list[i].name);
      data.push(parseFloat(list[i].data));
    }
    return {
      categories: categories,
      data: data
    }
  },

  changeTitle:function(event){
     this.setData({
       whichBut:event.currentTarget.dataset.cur,
       modalhidden:false
     })

     console.log(this.data.whichBut)
  },

  modalCancel:function(e){
    this.setData({
      modalhidden: true
    })
  },
  
  modalConfirm:function(e){
    var intitle = this.data.modalInput;
    if(this.data.whichBut == "curname"){
      this.setData({
        curname:intitle,
        modalhidden: true
      })
    } else if (this.data.whichBut == "Xname"){
      this.setData({
        xname: intitle,
        modalhidden: true
      })
      if (this.data.isLine){
        this.showCurChart();
      }else{
        this.showColumnChart();
      }
    } else if (this.data.whichBut == "Yname") {
      this.setData({
        yname: intitle,
        modalhidden: true
      })
      if (this.data.isLine) {
        this.showCurChart();
      } else {
        this.showColumnChart();
      }
    } else if (this.data.whichBut == "Pipname") {
      this.setData({
        pipname: intitle,
        modalhidden: true
      })
    } else {

    }
  },

  InTitle:function(e){
     this.setData({
       modalInput:e.detail.value
     })
  },

  //保存数据
  saveData:function(){
    var datas = wx.getStorageSync("datas")||[];
    var das = {id:datas.length+1,year:this.data.toyear,month:this.data.tomonth,day:this.data.today,title:this.data.title,Xname:this.data.xname,Yname:this.data.yname,data:this.data.listData};
    datas.push(das);
    wx.setStorageSync("datas", datas);
    wx.showToast({
      title: '保存数据成功',
      icon:'success',
      duration:1500
    })
  },
  
  //返回上页的实现
  backPage:function(e){
    wx.navigateBack({
      
    })
  }
})