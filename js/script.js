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

function draw(id,electricity,nodeArray) {
    switch (id) {
        case "line1": drawLine("line1","rgb(255,0,0)",10,10,150,150,nodeArray);
            $('#surplusElectricity1').val(electricity);
            break;
        case "line2": drawLine("line2","rgb(0,255,0)",150,10,10,150,nodeArray);
            $('#surplusElectricity2').val(electricity);
            break;
        case "line3": drawLine("line3","rgb(0,0,255)",150,10,10,150,nodeArray);
            $('#surplusElectricity3').val(electricity);
            break;
        case "line4": drawLine("line4","rgb(255,255,0)",10,10,150,150,nodeArray);
            $('#surplusElectricity4').val(electricity);
            break;
    }
}
function drawLine(id,rgb,startx,starty,endx,endy,nodeArray) {
    var canvas = document.getElementById(id);
    if (canvas == null)
        return false;
    var context = canvas.getContext("2d");
    //context.beginPath();
    context.strokeStyle = rgb;
    context.fillStyle = rgb;
    context.lineWidth=3;
    context.moveTo(startx, starty);
    //之后的lineTo会以上次lineTo的节点为开始
    var lineLength = Math.floor(Math.sqrt((endx-startx)*(endx-startx)+(endy-starty)*(endy-starty)));
    var fractionLength = Math.floor(lineLength / (nodeArray.length*2 + 1));
    var xFractionLength = Math.floor((endx-startx) / (nodeArray.length*2 + 1));
    var yFractionLength = Math.floor((endy-starty) / (nodeArray.length*2 + 1));
    context.lineTo(startx+xFractionLength, starty+yFractionLength);
    for (var i = 0; i < nodeArray.length; i++)
    {
        //context.rotate(45*Math.PI/180);
        context.strokeStyle = "rgb(0,255,255)";
        context.lineWidth=1;
        if(id === "line2" || id === "line3")
            context.strokeText(nodeArray[i], Number(startx+xFractionLength*(i*2+1.6)), Number(starty+yFractionLength*(i*2+1.6)));
        else if(id === "line1" || id === "line4")
            context.strokeText(nodeArray[i], Number(startx+xFractionLength*(i*2+1.4)), Number(starty+yFractionLength*(i*2+1.6)));
        context.strokeStyle = rgb;
        context.lineWidth=3;
        context.strokeRect(Number(startx+xFractionLength*(i*2+1)),Number(starty+yFractionLength*(i*2+1)),xFractionLength,yFractionLength);
        //context.beginPath();
        //context.rotate(-45*Math.PI/180);
        context.moveTo(Number(startx+xFractionLength*(i*2+2)), Number(starty+yFractionLength*(i*2+2)));
        context.lineTo(Number(startx+xFractionLength*(i*2+3)), Number(starty+yFractionLength*(i*2+3)));
    }
    context.lineTo(endx, endy);
    context.stroke();
    //context.fill();
}