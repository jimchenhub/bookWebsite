$(document).ready(function(){
    //获取个人信息
    var userId = getCookie("userId");
    $.post(
        '/bookWebsite/php/userConfirmInfo.php',
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
                $("#info-username").text(datas.name);
                $("#info-address").text(datas.address);
                //设置用户等级decookie
                $.cookie("userGrade", datas.grade);
            }
        }
    );

    //获取购物清单
    $.post(
        '/bookWebsite/php/getTrolleyList.php',
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
                fillBookList(datas.data);
            }
        }
    );

    //返回购物车
    $("#back-to-trolley").click(function(){
        location.href = "/bookWebsite/html/trolleyPage.html";
    });

    //提交订单
    $("#submit-btn").click(function(){
        location.href = "/bookWebsite/html/payPage.html";
    });
});

function fillBookList (bookList) {
    var table = $("#book-list table");
    table.empty();

    table.append($('<tr class="thead">')
        .append($('<th>商品</th>'))
        .append($('<th>价格</th>'))
        .append($('<th>数量</th>'))
        .append($('<th>库存状态</th>'))
        );

    for (var i = 0; i < bookList.length; i++){
        var isFull = parseInt(bookList[i].num) > parseInt(bookList[i].inventory) ? "缺货" : "有货";
        table.append($('<tr class="data-row">')
            .append($('<td class="td-book"><img class="book-surface" src="/bookWebsite/image/book/'+bookList[i].envelope+'"><span class="book-name">'+bookList[i].bname+'</span></td>'))
            .append($('<td><span class="book-price">¥'+bookList[i].price+'</span></td>'))
            .append($('<td class="book-num">'+bookList[i].num+'</td>'))
            .append($('<td>'+isFull+'</td>'))
            );
    }

    //更新总价格
    var sumMoney = 0.00;
    $(".data-row").each(function(index){
        var price = parseFloat($(this).find(".book-price").text().substr(1));
        var num = parseInt($(this).find(".book-num").text());
        sumMoney = sumMoney + price * num;
    });
    sumMoney = sumMoney.toFixed(2);
    $(".goods-all-money").text("¥"+sumMoney);

    //设置应付金额
    var payMoney = getPayMoney(sumMoney);
    $(".all-money").text("¥"+sumMoney);
    $(".pay-money").text("¥"+payMoney);
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
