/*
 author：徐超，冯士兵，杨迪升
 */

$(function(){
    console.log('欢迎');
    var net = require('net');
    var HOST = '192.168.1.200';
    var PORT = 4196;
    var last_msg_time = [0, 0 ,0, 0];

    setInterval(function() { //添加循环计时器
        for(var i=0; i<last_msg_time.length; i++){
            var cur_time = $.now();
            if(last_msg_time[i] > 0 && cur_time - last_msg_time[i] > 10000){//超过10S，判定超时
                console.log("time out!");
                last_msg_time[i] = 0;
                cancelLine(i+1);//移除路由线
                showWarningText(i+1);// 显示失联警告
            }
        }
    }, 1000)//每秒循环一次

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
        var type = datas[4].toString()
        var Hex = datas[2].toString()
        console.log("type:"+type);

        if(type == "56") {
            console.log('env info');
            var envorinment_temperature = datas[6]
            var body_temperature = datas[7]
            var heart_rate = datas[8]
            var relate_node_num = datas[9]
            var remain_node_num = datas[10]
            var idAndBattery = parseInt(datas[11]);
            var id = idAndBattery >> 4;
            var battery = idAndBattery & 15;

            last_msg_time[id-1] = $.now();//记录当前时间戳

            //将收集到的数据显示到界面上
            console.log("id:"+id);
            console.log("battery:"+battery);
            $('#bodyTemperature' + id).text(body_temperature);
            $('#heartBeat'+ id).text(heart_rate);
            $('#temperature' + id).text(envorinment_temperature);
            $('#surplusNodeNum' + id).text(remain_node_num);
            showElectricity(id, battery);
        }
        else if(type == "57") {
            var jumpStep = parseInt(datas[5]);
            var id = parseInt(datas[6]);
            var route = new Array();
            route.push(datas[2]);
            if(jumpStep > 1){
                route.push(datas.slice(6));
            }
            last_msg_time[id-1] = $.now();//记录当前时间戳
            console.log("id:"+id);
            console.log("jump_step:"+jumpStep);
            console.log("route:"+route);
            draw("line"+id, route)
        }
    });

    client.on('close', function() {
        console.log('Connection closed');
    });

    function showElectricity(id, battery) {
        //var electricity = Math.floor((100.0/12) * battery);//电量满格是12
        $('#surplusElectricity' + id).val(battery);// electricity : 1-100
        if(battery>7){//green
        }
        else if(battery>3){//yellow
        }
        else{//red
        }
    }

    function showWarningText(id) {//id:1-4
        //console.log("showWarningText:"+id);
    }

    function cancelLine(id) {
        //console.log("cancelLine:"+id);
    }

});

function draw(id, nodeArray) {
    switch (id) {
        case "line1": drawLine("line1","rgb(255,0,0)",10,10,150,150,nodeArray);
            break;
        case "line2": drawLine("line2","rgb(0,255,0)",150,10,10,150,nodeArray);
            break;
        case "line3": drawLine("line3","rgb(0,0,255)",150,10,10,150,nodeArray);
            break;
        case "line4": drawLine("line4","rgb(255,255,0)",10,10,150,150,nodeArray);
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
