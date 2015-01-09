$(document).ready(function(){
    //去充值
    $("#recharge-btn").click(function(){
        location.href = "/bookWebsite/html/recharge.html";
    });    

    //付款
    $("#pay-btn").click(function(){
        var remainMoney = parseFloat($(".remain-money").text().substr(1));
        var payMoney = parseFloat($(".pay-money").text().substr(1));

        if (remainMoney < payMoney){
            alert("余额不足，可以去充值来完成付款");
        }else {
            //进行购买

            //购买完成 跳转到购物广场首页
            location.href = "/bookWebsite/html/ground.html";
        }
    });
});