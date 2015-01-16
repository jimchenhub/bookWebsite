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
                $(".pay-money").text("¥"+getPayMoney(datas.money));
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
            var grade = getCookie("userGrade");
            if (grade == "3"){
                //可以透支300元
                if (remainMoney+300 > payMoney){
                    payIt(userId, payMoney);
                }else {
                    alert("透支额度不够，可以去充值来完成付款");
                }
            }else if (grade == "4"){
                //可以透支1000元
                if (remainMoney+1000 > payMoney){
                    payIt(userId, payMoney);
                }else {
                    alert("透支额度不够，可以去充值来完成付款");
                }
            }else if (grade == "5"){
                //无限透支
                payIt(userId, payMoney);
            }else {
                alert("余额不足，可以去充值来完成付款");
            }
        }else {
            payIt(userId, payMoney);
        }
    });
});

//付款
function payIt(userId, payMoney){
    //进行购买
    $.post(
        '/bookWebsite/php/payMoney.php',
        {
            userId : userId,
            payMoney : payMoney
        },
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                alert("付款成功");
                //购买完成 跳转到购物广场首页
                location.href = "/bookWebsite/html/ground.html";
            }
        }
    );            
}

//根据用户等级调整价格
function getPayMoney(sum){
    var grade = getCookie("userGrade");

    var payMoney;
    switch(grade){
        case "1" :
            payMoney = sum * 0.9;
            break;
        case "2" :
            payMoney = sum * 0.85;
            break;
        case "3" :
            payMoney = sum * 0.85;
            break;
        case "4" :
            payMoney = sum * 0.8;
            break;
        case "5" :
            payMoney = sum * 0.75;
            break;
        default : 
            payMoney = sum;
            break;
    }

    return payMoney;
}