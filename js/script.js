
$(function(){

    $('.stats').append('hello electron');

    console.log('欢迎');
    var net = require('net');
    var HOST = '192.168.1.200';
    var PORT = 4196;

    var client = new net.Socket();
    console.log('客户端创建成功');
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });

    client.on('data', function(data) {
        console.log('DATA: ' + data);
        // 完全关闭连接
        //client.destroy();
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