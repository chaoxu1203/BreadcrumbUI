
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