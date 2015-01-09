var canvas=document.getElementById('header-triangle');
var context=canvas.getContext('2d');

context.moveTo(60, 3);
context.lineTo(52, 10);
context.lineTo(68, 10);
context.closePath();
        
context.fillStyle = '#fafafa';
context.fill();

context.lineWidth = 1;
context.strokeStyle = '#fafafa';
context.stroke();

$(document).ready(function(){
    //设置三角形的位置
    var width = $(".header-list-item").width();
    var leftValue = parseInt($(".header-list-item.active").attr("id").split("-")[1]) * width;
    $("#header-triangle").css("margin-left", leftValue);

    //点击header中的每个主题时候的页面跳转
    $(".header-list-item").click(function(){
        //点击的时候进行页面的跳转
        var type = $(this).attr("id");
        if (type == "type-0"){
            location.href = "/bookWebsite/html/ground.html";
        }else if (type == "type-1"){
            location.href = "/bookWebsite/html/homePage.html";
        }
    });
});