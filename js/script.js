/*
 author：徐超，冯士兵，杨迪升
 */

$(function(){
    console.log('欢迎');
    var net = require('net');
    var HOST = '192.168.1.200';
    var PORT = 4196;

    //创建socket连接
    var client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });

    //添加socket连接的监听事件，有数据来就显示到界面上
    client.on('data', function(data) {
        //解析读取到的内容
        console.log('DATA: ' + data);
        //console.log( data.length)

        var datas = new Array();
        datas = data.toString().split("\t");
        if(data.length==35) {
            console.log('env info');
            var Hex = datas[2]
            var envorinment_temperature = datas[6]
            var body_temperature = datas[7]
            var heart_rate = datas[8]
            var place_x = datas[9]
            var place_y = datas[10]
            var place_z = datas[11]

            //将收集到的数据显示到界面上
            $('#bodyTemperature1').text(body_temperature);
            $('#heartBeat1').text(heart_rate);
            $('#temperature1').text(envorinment_temperature);
        }
        else if(data.length==25) {
            var jump_step = datas[5]
            var network_address = datas[8]
        }
        else if(data.length==21) {
            var remain_node_num = datas[6]
            var relate_node_num = datas[7]
        }
    });
});

function draw(id) {
    var canvas = document.getElementById(id);
    if (canvas == null)
        return false;
    var context = canvas.getContext("2d");
    context.fillStyle = "#EEEEFF";
    context.fillRect(0, 0, 400, 600);
    var n = 0;
    var dx = 150;
    var dy = 150;
    var s = 100;
    context.beginPath();
    context.fillStyle = 'rgb(100,255,100)';
    context.strokeStyle = 'rgb(0,0,100)';
    var x = Math.sin(0);
    var y = Math.cos(0);
    var dig = Math.PI / 15 * 11;
    for (var i = 0; i < 30; i++) {
        var x = Math.sin(i * dig);
        var y = Math.cos(i * dig);
        context.lineTo(dx + x * s, dy + y * s);
    }
    context.closePath();
    context.fill();
    context.stroke();
}
function drawLine(id,rgb,startx,endx,starty,endy) {
    var canvas = document.getElementById(id);
    if (canvas == null)
        return false;
    var context = canvas.getContext("2d");
    //context.beginPath();
    context.strokeStyle = rgb;
    context.fillStyle = rgb;
    context.lineWidth=10;
    //实验证明第一次lineTo的时候和moveTo功能一样
    context.lineTo(startx, endx);
    //之后的lineTo会以上次lineTo的节点为开始
    context.lineTo(starty, endy);
    //context.lineTo(200, 100);
   /* context.moveTo(200, 50);
    context.lineTo(100,50);*/
    context.stroke();
    context.fill();
}

drawLine("line1","rgb(255,0,0)",10,10,200,200);
drawLine("line2","rgb(0,255,0)",200,10,10,200);
drawLine("line3","rgb(0,0,255)",200,0,0,200);
drawLine("line4","rgb(255,255,0)",30,30,230,230);