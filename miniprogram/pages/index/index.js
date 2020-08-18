//index.js
const app = getApp()
const date = new Date()
var weekday=new Array(7)
weekday[0]="星期日"
weekday[1]="星期一"
weekday[2]="星期二"
weekday[3]="星期三"
weekday[4]="星期四"
weekday[5]="星期五"
weekday[6]="星期六"
Page({
  data: {
    loading:true,
    img: '/images/111.jpg',
    // img: '/images/222.jpg',
    text: '',
    ifAlbum:'',
    date:(date.getMonth() + 1).toString() + '月' + date.getDate().toString() + '日' + ' ' + weekday[date.getDay()]
  },
  onLoad: function() {
    this.getData()
  },
  onShow:function(){
    wx.getSetting({
      success:(res)=>{
        if(res.authSetting['scope.writePhotosAlbum']){
          this.setData({
            ifAlbum:true
          })
        }else{
          this.setData({
            ifAlbum:false
          })
        }
      }
    })
  },
  createImg:function(){
    // 生命周期函数--监听页面初次渲染完成
    var ctx = wx.createCanvasContext('canvas')
    // 设置背景
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 300, 355)
    // 日期
    ctx.setFontSize(18)
    ctx.setFillStyle("#000000")
    textHandle(this.data.date, 10, 30, 170, 20);
    // 文字
    ctx.setFontSize(14)
    ctx.setFillStyle("#000000")
    textHandle(this.data.text, 10, 250, 270, 18);
    // 图片
    ctx.drawImage(this.data.img, 25, 50, 250, 162);
   
    /**
     * @function textHandle 绘制文本的换行处理
     * @param text 在画布上输出的文本
     * @param numX 绘制文本的左上角x坐标位置
     * @param numY 绘制文本的左上角y坐标位置
     * @param textWidth 文本宽度
     * @param lineHeight 文本的行高
     */
    function textHandle(text, numX, numY, textWidth, lineHeight) {
      var chr = text.split(""); // 将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < textWidth) {
          temp += chr[a];
        }else {
          a--; // 添加a--，防止字符丢失
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      // 如果数组长度大于2 则截取前两个
      if (row.length > 6) {
        var rowCut = row.slice(0, 6);
        var rowPart = rowCut[5];
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < textWidth-10) {
            test += rowPart[a];
          }else {
            break;
          }
        }
        empty.push(test);
        var group = empty[0] + "..."; // 这里只显示两行，超出的用...展示
        rowCut.splice(5, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], numX, numY + b * lineHeight);
      }
    }
    // 完成
    ctx.draw()
  },
  getData: function () {
    const that = this;
    this.setData({
      loading:true
    })
    this.hideLoading()
    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      data: {},
      success: function(res) {
        if(res.result.data==''){
          that.getData()
        }else{
          that.setData({
            text:res.result.data
          })
          that.createImg()
        }
      },
      fail: console.error
    })
  },
  hideLoading:function(){
    const that = this
    setTimeout(()=>{
      that.setData({
        loading:false
      })
    },2000)
  },
  saveImage() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success(res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
          },
          fail(res){
            wx.showToast({
              title: '保存失败，请允许保存相册权限',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  saveText() {
    wx.setClipboardData({
      data: '舔狗日记' + '\n' + this.data.date + '\n\n' + this.data.text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '如何当一只优秀的舔狗？当然要坚持写日记啦！！！',
      path: '/pages/index/index'
    }
  },
})
