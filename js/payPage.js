$(document).ready(function(){
    //填充页面
    var userId = getCookie("userId");
    //填充剩余钱数
    $.post(
        '/bookWebsite/php/getRemainMoney.php',
        {
            userId : userId
        },
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                $(".remain-money").text("¥"+datas.money);
            }
        }
    );
    //填充应付金额
    $.post(
        '/bookWebsite/php/getPayMoney.php',
        {
            userId : userId
        },
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                $(".pay-money").text("¥"+datas.money);
            }
        }
    );

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