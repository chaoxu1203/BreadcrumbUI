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
            if(last_msg_time[i] > 0 && cur_time - last_msg_time[i] > 4000){//超过4S，判定超时
                //cancelLine(i+1);//移除路由线
                //showWarningText(i+1);// 显示失联警告
                console.log("time out!");
                last_msg_time[i] = 0;
                var j = i+1;
                drawLine("line"+j,0,0,0,0,null,0);
                //cancelLine(i+1);//移除路由线
                //showWarningText(i+1);// 显示失联警告
            }
        }
        var heart_rate1 =  Math.floor((Math.random()*40)+61);
        var heart_rate2 =  Math.floor((Math.random()*40)+61);
        var heart_rate3 =  Math.floor((Math.random()*40)+61);
        var heart_rate4 =  Math.floor((Math.random()*40)+61);
        $('#heartRate1').text(""+heart_rate1+" bpm"); // 设置心率 正常范围 60--100 bpm
        $('#heartRate2').text(""+heart_rate2+" bpm");
        $('#heartRate3').text(""+heart_rate3+" bpm");
        $('#heartRate4').text(""+heart_rate4+" bpm");
    }, 5000)//每秒循环一次

    setInterval(function() { //添加循环计时器
        var temperature =  Math.floor((Math.random()*100)+21);
        showRetreat(1,temperature);
        $('#temperature1').text(temperature);
    }, 50000)
    setInterval(function() { //添加循环计时器
        var temperature =  Math.floor((Math.random()*100)+21);
        showRetreat(2,temperature);
        $('#temperature2').text(temperature);
    }, 51000)
    setInterval(function() { //添加循环计时器
        var temperature =  Math.floor((Math.random()*100)+21);
        showRetreat(3,temperature);
        $('#temperature3').text(temperature);
    }, 52000)
    setInterval(function() { //添加循环计时器
        var temperature =  Math.floor((Math.random()*100)+21);
        showRetreat(4,temperature);
        $('#temperature4').text(temperature);
    }, 53000)

    var electricity1 = 96;
    var electricity2 = 83;
    var electricity3 = 56;
    var electricity4 = 32;
    var airBreath1 = 99;
    var airBreath2 = 95;
    var airBreath3 = 97;
    var airBreath4 = 92;
    setInterval(function() { //
        showElectricity(1, electricity1);
        electricity1 -= 0.5;
    }, 60000)
    setInterval(function() { //
        showElectricity(2, electricity2);
        electricity2 -= 0.5;
    }, 59000)
    setInterval(function() { //
        showElectricity(3, electricity3);
        electricity3 -= 0.5;
    }, 58000)
    setInterval(function() { //
        showElectricity(4, electricity4);
        electricity4 -= 0.5;
    }, 57000)
    setInterval(function() { //
        $('#airBreath1').text(""+airBreath1+"%");
        airBreath1 -= 0.5;
    }, 56000)
    setInterval(function() { //
        $('#airBreath2').text(""+airBreath2+"%");
        airBreath2 -= 0.5;
    }, 55000)
    setInterval(function() {
        $('#airBreath3').text(""+airBreath3+"%");
        airBreath3 -= 0.5;
    }, 54000)
    setInterval(function() {
        $('#airBreath4').text(""+airBreath4+"%");
        airBreath4 -= 0.5;
    }, 53000)

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
            // var battery = idAndBattery & 15;
            //var battery = Math.floor((Math.random()*12)+1); // 生产1至12之间的随机数

            last_msg_time[id-1] = $.now();//记录当前时间戳

            //将收集到的数据显示到界面上
            $("#aaa"+id).show();
            $("#bbb"+id).show();
            $("#ccc"+id).show();
            $("#ddd"+id).show();
            $("#eee"+id).show();
            $("#retreat"+id).show();
            $('#surplusNodeNum' + id).text(remain_node_num);
            //showElectricity(id, battery);
        }
        else if(type == "57") {
            var jumpStep = parseInt(datas[5]);
            var id = parseInt(datas[6]);
            var route = new Array();
            var signalQuality = Math.floor((Math.random()*12)+1); // 生产1至12之间的随机数
            route.push(datas[2]);
            if(jumpStep > 1){
                route.push(datas.slice(6));
            }
            last_msg_time[id-1] = $.now();//记录当前时间戳
            console.log("id:"+id);
            console.log("jump_step:"+jumpStep);
            console.log("route:"+route);
            draw("line"+id, route,signalQuality);
        }
    });

    client.on('close', function() {
        console.log('Connection closed');
    });

});

function showRetreat(id, envorinment_temperature) {
    var retreatCanvas = document.getElementById("retreat" + id);
    var retreatContext = retreatCanvas.getContext("2d");
    retreatContext.font="20px Georgia";
    retreatContext.strokeStyle="rgb(255,0,0)";
    if (envorinment_temperature > 90) {
        retreatContext.strokeText("该路线温度过高，请从原路返回", 10, 23);
    } else {
        retreatContext.clearRect(0, 0, 300, 30);
    }
}

function draw(id, nodeArray,signalQuality) {
    var lostCanvas, lostContext;
    switch (id) {
        case "line1":
            lostCanvas = document.getElementById("lost1");
            lostContext = lostCanvas.getContext("2d");
            lostContext.clearRect(0,0,lostCanvas.width,lostCanvas.height);
            drawLine("line1",10,10,150,150,nodeArray,signalQuality);
            break;
        case "line2":
            lostCanvas = document.getElementById("lost2");
            lostContext = lostCanvas.getContext("2d");
            lostContext.clearRect(0,0,lostCanvas.width,lostCanvas.height);
            drawLine("line2",150,10,10,150,nodeArray,signalQuality);
            break;
        case "line3":
            lostCanvas = document.getElementById("lost3");
            lostContext = lostCanvas.getContext("2d");
            lostContext.clearRect(0,0,lostCanvas.width,lostCanvas.height);
            drawLine("line3",150,10,10,150,nodeArray,signalQuality);
            break;
        case "line4":
            lostCanvas = document.getElementById("lost4");
            lostContext = lostCanvas.getContext("2d");
            lostContext.clearRect(0,0,lostCanvas.width,lostCanvas.height);
            drawLine("line4",10,10,150,150,nodeArray,signalQuality);
            break;
    }
}
function drawLine(id,startx,starty,endx,endy,nodeArray,signalQuality) {
    var canvas = document.getElementById(id);
    if (canvas == null)
        return false;
    var context = canvas.getContext("2d");
    context.font="10px sans-serif";
    console.log("canvas.width = "+canvas.width)
    console.log("canvas.height = "+canvas.height)
    context.clearRect(0,0,canvas.width,canvas.height);
    if(signalQuality>7){//green
        context.fillStyle = "rgb(0,255,0)";
        context.strokeStyle = "rgb(0,255,0)";
    }
    else if(signalQuality>2){//yellow
        context.fillStyle = "rgb(255,255,0)";
        context.strokeStyle = "rgb(255,255,0)";
    }
    else{//red
        context.fillStyle = "rgb(255,0,0)";
        context.strokeStyle = "rgb(255,0,0)";
    }

    if (signalQuality > 0 )
    {
        context.lineWidth=3;
        context.moveTo(startx, starty);
        //之后的lineTo会以上次lineTo的节点为开始
        var lineLength = Math.floor(Math.sqrt((endx-startx)*(endx-startx)+(endy-starty)*(endy-starty)));
        if (!!nodeArray && nodeArray.length>0)
        {
            var fractionLength = Math.floor(lineLength / (nodeArray.length*2 + 1));
            var xFractionLength = Math.floor((endx-startx) / (nodeArray.length*2 + 1));
            var yFractionLength = Math.floor((endy-starty) / (nodeArray.length*2 + 1));
        }
        context.lineTo(startx+xFractionLength, starty+yFractionLength);
        for (var i = 0; nodeArray && i < nodeArray.length; i++)
        {
            context.lineWidth=1;
            if(id === "line2" || id === "line3")
                context.strokeText(nodeArray[i], Number(startx+xFractionLength*(i*2+1.6)), Number(starty+yFractionLength*(i*2+1.6)));
            else if(id === "line1" || id === "line4")
                context.strokeText(nodeArray[i], Number(startx+xFractionLength*(i*2+1.35)), Number(starty+yFractionLength*(i*2+1.65)));
            if(signalQuality>7){//green
                //context.fillStyle = "rgb(0,255,0)";
                context.strokeStyle = "rgb(0,255,0)";
            }
            else if(signalQuality>2){//yellow
                //context.fillStyle = "rgb(255,255,0)";
                context.strokeStyle = "rgb(255,255,0)";
            }
            else{//red
                //context.fillStyle = "rgb(255,0,0)";
                context.strokeStyle = "rgb(255,0,0)";
            }
            context.lineWidth=3;
            context.strokeRect(Number(startx+xFractionLength*(i*2+1)),Number(starty+yFractionLength*(i*2+1)),xFractionLength,yFractionLength);
            context.moveTo(Number(startx+xFractionLength*(i*2+2)), Number(starty+yFractionLength*(i*2+2)));
            context.lineTo(Number(startx+xFractionLength*(i*2+3)), Number(starty+yFractionLength*(i*2+3)));
        }
        context.lineTo(endx, endy);
        context.stroke();
    }
    else if(signalQuality == 0)// 失联时路径改为"X"，并显示警告信息
    {
        var lostCanvas,lostContext;
        /*console.log("lostCanvas"+lostCanvas);*/
        context.strokeStyle = "rgb(255,0,0)";
        context.lineWidth=3;
        switch (id) {
            case "line1":
                lostCanvas = document.getElementById("lost1");
                lostContext = lostCanvas.getContext("2d");
                lostContext.strokeStyle = "rgb(255,0,0)";
                context.fillStyle = "rgb(255,0,0)";
                lostContext.font="20px Georgia";
                context.font="240px Georgia";
                context.fillText("×",0, 150);
                lostContext.strokeRect(5,2,160,30);
                lostContext.strokeText("消防员1号已失联",10,23);
                break;
            case "line2":
                lostCanvas = document.getElementById("lost2");
                lostContext = lostCanvas.getContext("2d");
                lostContext.strokeStyle = "rgb(255,0,0)";
                context.fillStyle = "rgb(255,0,0)";
                lostContext.font="20px Georgia";
                context.font="240px Georgia";
                context.fillText("×",5, 150);
                lostContext.strokeRect(1,2,160,30);
                lostContext.strokeText("消防员2号已失联",5,23);
                break;
            case "line3":
                lostCanvas = document.getElementById("lost3");
                lostContext = lostCanvas.getContext("2d");
                lostContext.strokeStyle = "rgb(255,0,0)";
                context.fillStyle = "rgb(255,0,0)";
                lostContext.font="20px Georgia";
                context.font="240px Georgia";
                context.fillText("×",0, 150);
                lostContext.strokeRect(5,2,160,30);
                lostContext.strokeText("消防员3号已失联",10,23);
                break;
            case "line4":
                lostCanvas = document.getElementById("lost4");
                lostContext = lostCanvas.getContext("2d");
                lostContext.strokeStyle = "rgb(255,0,0)";
                context.fillStyle = "rgb(255,0,0)";
                lostContext.font="20px Georgia";
                context.font="240px Georgia";
                context.fillText("×",5, 150);
                lostContext.strokeRect(5,2,160,30);
                lostContext.strokeText("消防员4号已失联",8,23);
                break;
        }
    }
}

function showElectricity(id, battery) {
    //$("#retreat"+id).show();
    //var electricity = Math.floor((100.0/12) * battery);//电量满格是12
    var canvas = document.getElementById('surplusElectricity'+id);
    if (canvas == null)
        return false;
    var context = canvas.getContext("2d");
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(100,100,120,20);
    if(battery>75){//green
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(100,100,battery,20);
    }
    else if(battery>35){//yellow
        context.fillStyle = "rgb(255,255,0)";
        context.fillRect(100,100,battery,20);
    }
    else{//red
        context.fillStyle = "rgb(255,0,0)";
        context.fillRect(100,100,battery,20);
    }
    context.strokeStyle = "rgb(255,0,0)";
    context.font="20px sans-serif";
    context.strokeText(""+battery+"%",143,116);
}


/*
draw("line1", [1,2,3,4],0)
draw("line2", [5,6,7],0)
draw("line3", [8,9],0)
draw("line4", [10],0)
showRetreat(1,210);
showRetreat(2,222);
showRetreat(3,201);
showRetreat(4,201);*/
