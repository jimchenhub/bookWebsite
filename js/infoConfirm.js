$(document).ready(function(){
    //返回购物车
    $("#back-to-trolley").click(function(){
        location.href = "/bookWebsite/html/trolleyPage.html";
    });

    //提交订单
    $("#submit-btn").click(function(){
        location.href = "/bookWebsite/html/payPage.html";
    });
});