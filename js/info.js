/*
author：徐超
 */

$(function(){

    var firefights = getInfos();//获取消防员信息

    //#f1,#f2,#f3的点击事件
    $('#f1,#f2,#f3,#f4').click(function(){
        $('#win').window('open');
        var index = parseInt($(this).attr("value")) - 1;
        var firefight = firefights[index];
        //将消防员信息显示到界面
        $('#name').text(firefight.name);
        $('#age').text(firefight.age);
        $('#no').text(firefight.no);
        $('#title').text(firefight.title);
        $('#photo').attr("src", firefight.photoSrc);
       // console.log("src:"+$('#photo').attr("src"));
    });

    //生成消防员信息
    function getInfos() {
        var firefight1 = {
           name : "张伟",
           age : 26,
            no : "No05120001",
            title : "班长",
            photoSrc : "./images/ff1.png"
        }
        var firefight2 = {
            name : "王磊",
            age : 24,
            no : "No05120002",
            title : "工兵",
            photoSrc : "./images/ff2.png"
        }
        var firefight3 = {
            name : "李军",
            age : 25,
            no : "No05120003",
            title : "工兵",
            photoSrc : "./images/ff3.png"
        }
        var firefight4 = {
            name : " 刘洋",
            age : 23,
            no : "No05120004",
            title : "工兵",
            photoSrc : "./images/ff4.png"
        }
        var firefights = [];
        firefights.push(firefight1);
        firefights.push(firefight2);
        firefights.push(firefight3);
        firefights.push(firefight4);
        return firefights;

    }

});

