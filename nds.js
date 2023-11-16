//检测有无重流
Isattack(); //实现函数

function Isattack() {
  $.ajax({
    url: 'http://localhost:5000/Isattack',
    type: 'GET',
    success: function (response) {
      let x = response['data']  //返回json文件中的{"data":xxx} xxx为ture or false
      if (x = true) {
      } else {
        var hh2 = document.getElementById("danger")
        hh2.style.visibility = "hidden"
        var hh = document.getElementById("safe")
        hh.style.visibility = "visible"
        var mk = document.getElementById("yn")
        mk.innerHTML = "未检测到重流"

      }

    },
    error: function (error) {
      console.error('Error sending data:', error);
    }

  });
}



//获取重流数据
function dataAttack() {
  $.ajax({
    url: 'http://localhost:5000/Attack',
    type: 'GET',
    success: function (response) {
      let list = []
      list = response['data'] //返回json文件中的{"data":xxx} int 有几条重流
      hu(list)
    },
    error: function (error) {
      // Handle any error that occurred during the request
      console.error('Error sending data:', error);
    }
  });
}


//获取折线图数据
function dataAd() {
  $.ajax({
    url: 'http://localhost:5000/dataAd',
    type: 'GET',
    success: function (response) {
      ndata = response["data"]  //返回json文件中的{"data":xxx} xxx 为一个列表 里面有7个数，是周一到周日的数据，
      option.series[0].data = ndata
      myChart.setOption(option);
      
    },
    error: function (error) {
      console.error('Error sending data:', error);
    }
  });
}

//发送流表信息
function sendmes() {
  $.ajax({
    url: 'http://localhost:5000/sendmes',
    type: 'POST',
    data:{flow_message :$("#flowinf").value },
    dataType:"JSON",
    success: function (response) {
      alert("修改成功！")
    },
    error: function (error) {
      alert("修改失败！")
    },
  });
}

//获取重流信息表
function getReflow_information() {
  var num = document.getElementById("reflownum")
  mes = num.value
  $.ajax({
    url: 'http://localhost:5000/getReflow_information',
    type: 'POST',
    data:{mes:$("#reflownum").val()},
    dataType: "JSON",
    success: function (response) {
      // Handle the response from the server
      console.log('Data sent successfully:', response);
      datas = response.datas
      var htmlStr = "";
      for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        htmlStr += "<tr>";
        htmlStr += "<td>" + i + "</td>";
        htmlStr += "<td>" + data.portnum + "</td>";
        htmlStr += "<td>" + data.status + "</td>";
        htmlStr += "<td>" + data.operation + "</td>";
        htmlStr += "<td>" + "<div class='switch-btn' style='position: relative;left: 40%;'>" +
          "<input type='checkbox' class='hidden-checkbox' name='' value=''>" +
          "<span class='switch-area'></span>" +
          "<span class='switch-toggle'></span>" +
          "</div>" + "<td>";

        htmlStr += "</tr>";
      }
      document.getElementById('pgt').innerHTML = htmlStr;

    },
    error: function (error) {
      console.error('Error sending data:', error);
    }
  });
}

//仪表盘
cvs = document.getElementById("dashboard")
var cp = cvs.getContext("2d");
hu()
dataAttack();
text()


function hu() {
  cp.moveTo(110, 150)
  cp.arc(105, 150, 5, 0, Math.PI)
  cp.arc(200, 150, 100, Math.PI, Math.PI * 2)
  cp.moveTo(110, 150)
  cp.arc(200, 150, 90, Math.PI, Math.PI * 2)
  cp.arc(295, 150, 5, Math.PI, 0, true)
  cp.stroke()
}

function tu(degree) {

  let all = degree / 1000 * 180 * 2
  if (all > 300) {
    cp.fillStyle = "red"
  } else {
    cp.fillStyle = "green"
  }
  for (let i = 0; i <= all; i++) {
    // cp.beginPath()
    // cp.arc(105,150,5,0,Math.PI*2)

    // cp.closePath()
    let res = {}
    res.x = 200 - 95 * Math.cos(i / 2 * Math.PI / 180)
    res.y = 150 - 95 * Math.sin(i / 2 * Math.PI / 180)
    cp.beginPath()
    cp.arc(res.x, res.y, 5, 0, Math.PI * 2)
    cp.closePath()
    cp.fill()
  }
  cp.font = "25px sans-serif"
  cp.fillText(degree, 200 - 95 * Math.cos(all / 2 * Math.PI / 180), 135 - 95 * Math.sin(all / 2 * Math.PI / 180))
}

function text() {
  cp.textAlign = "center"
  cp.textBaseline = "bottom"
  cp.font = "20px sans-serif"
  cp.fillText("防护中", 200, 160)
  cp.font = "15px sans-serif"
  cp.fillStyle = "rgba(0,0,0)"
  cp.textAlign = "right"
  cp.textBaseline = "middle"
  cp.fillText("0", 90, 150)
  cp.beginPath()
  cp.moveTo(99, 150)
  cp.lineTo(93, 150)
  cp.stroke()
  cp.closePath()
  cp.textAlign = "left"
  cp.beginPath()
  cp.moveTo(301, 150)
  cp.lineTo(306, 150)
  cp.stroke()
  cp.closePath()
  cp.fillText("防护上限", 310, 145)
  cp.fillText("1000条", 310, 165)
  cp.textAlign = "right"
  cp.fillText("清洗阈值", 150, 30)
  cp.fillText("333条", 150, 45)

  let x = 200 - 100 * Math.cos(60 * Math.PI / 180)
  let y = 150 - 100 * Math.sin(60 * Math.PI / 180)
  cp.beginPath()
  cp.moveTo(x - 1, y - 1)
  cp.lineTo(x - 6, y - 6)
  cp.closePath()
  cp.stroke()
}



//折线图（自制）

/* canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext('2d');
border()
list = [20, 40, 20, 40, 50, 100, 200]
line(list)

//画出图表
function border() {
  ctx.beginPath();
  ctx.moveTo(40, 20)
  ctx.lineTo(40, 270)
  ctx.lineTo(560, 270)

  ctx.strokeStyle = "rgba(100,100,255)"
  ctx.lineWidth = 2
  ctx.stroke();
  ctx.closePath()

  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.textAlign = "right"
  ctx.textBaseline = "middle"
  ctx.font = "13px sans-serif"

  for (let i = 0; i <= 4; i++) {
    if (i !== 4) {
      ctx.moveTo(40, i * 60 + 30)
      ctx.lineTo(560, i * 60 + 30)
    }

    ctx.fillText((4 - i) * 50, 35, i * 60 + 30)
  }
  ctx.setLineDash([10, 10])
  ctx.strokeStyle = "gray"
  ctx.stroke()
  ctx.closePath()
  ctx.beginPath()
  var chartData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  ctx.textAlign = "center"

  for (var i = 0; i <= 6; i++) {
    ctx.fillText(chartData[i], i * 75 + 80, 285)
  }



  ctx.stroke();
  ctx.closePath();

}

//画出折线
function line(list) {
  ctx.beginPath()
  ctx.strokeStyle = "rgba(0,0,0)"
  for (let i = 0; i < 7; i++) {
    if (i === 0) {
      ctx.moveTo(i * 75 + 80, 270 - list[i] * 6 / 5)
    } else {
      ctx.lineTo(i * 75 + 80, 270 - list[i] * 6 / 5)
    }
    ctx.fillText(list[i], i * 75 + 80, 260 - list[i] * 6 / 5)

  }
  ctx.setLineDash([])
  ctx.stroke()
  ctx.closePath()


  for (let i = 0; i < 7; i++) {
    ctx.beginPath()
    ctx.arc(i * 75 + 80, 270 - list[i] * 6 / 5 , 3, 0 ,Math.PI*2)
    ctx.fillStyle = 'rgba(0,200,255)'
    ctx.fill()
    ctx.closePath()
  }

} */

//折线图（echart）
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('attack'));
// 指定图表的配置项和数据
var option = {
  title: {
    text: '重流数据概览'
  },
  tooltip: {},
  legend: {
    data: ['数量']
  },
  xAxis: {
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  yAxis: {},
  series: [{
    name: '数量',
    type: 'line',
    data: [],
    smooth: true
  }]
};

dataAd();
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

