
$(function(){
    console.log('欢迎');
    var net = require('net');
    var HOST = '192.168.1.200';
    var PORT = 4196;

    var client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });

    client.on('data', function(data) {
        //data = "FD 1 0100 8 56 0 26 30 75 50 50 50 FD 1 0100 3 57 1 0100 FD 1 0100 4 55 1 0 0";
        //解析读取到的内容
        console.log('DATA: ' + data);
        console.log( data.length)
        //var gettype = Object.prototype.toString
        //console.log(gettype.call(data) );

        var datas = new Array();
        datas = data.toString().split("\t");
        if(data.length==35)
        {
            var Hex = datas[2]
            //console.log('Hex: ' +  Hex);
            var envorinment_temperature = datas[6]
            //console.log('envorinment_temperature: ' +  envorinment_temperature);//30
            var body_temperature = datas[7]
            //console.log('body_temperature: ' +  body_temperature);
            var heart_rate = datas[8]
            //console.log('heart_rate: ' +  heart_rate);
            var place_x = datas[9]
            //console.log('place_x: ' +  place_x);
            var place_y = datas[10]
            //console.log('place_y: ' +  place_y);
            var place_z = datas[11]
            //console.log('place_z: ' +  place_z);
        }
        if(data.length==25)
        {
            var jump_step = datas[5]
            //console.log('jump_step: ' +  jump_step);//1
            var network_address = datas[8]
            //console.log('network_address: ' +  network_address);//0100
        }
        if(data.length==21)
        {
            var remain_node_num = datas[6]
            //console.log('remain_node_num: ' +  remain_node_num);//0
            var relate_node_num = datas[7]
            //console.log('relate_node_num: ' +  relate_node_num);//0
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