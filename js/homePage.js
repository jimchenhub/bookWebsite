var password;
$(document).ready(function(){
    var userId = getCookie('userId');

    //获取用户信息
    getUserInfo(userId);

    //获取订单信息
    getOrderInfo(userId);

    //切换内容
    $("#info-btn").click(function(){
        $("#info-btn").addClass("active");
        $("#info-part").css("display","block");
        $("#order-btn").removeClass("active");
        $("#order-part").css("display","none");

        //更新内容
        getUserInfo(userId);
    });
    $("#order-btn").click(function(){
        $("#order-btn").addClass("active");
        $("#order-part").css("display","block");
        $("#info-btn").removeClass("active");
        $("#info-part").css("display","none");

        //更新内容
        getOrderInfo(userId);
    });

    //提交点击事件
    $("#submit-btn").click(function(){
        //如果地址为空，则需要提醒
        if ($("#info-name").val() == ""){
            alert("姓名不能为空");
            return;
        }else if ($("#info-address").val() == ""){
            alert("你确定不填写收货地址吗？");
        }
        var newPassword = password;
        //如果原密码不为空, 说明用户希望修改密码
        if ($("#info-password").val() != ""){
            //检查原密码和新密码
            if (hex_md5($("#info-password").val()) != password){
                alert("原密码错误");
                return;
            }else if ($("#info-new-password").val() == ""){
                alert("新密码不能为空");
                return;
            }else if ($("#info-new-password").val() != $("#info-new-password-confirm").val()){
                alert("新密码不一致");
                return;
            }else {
                newPassword = hex_md5($("#info-new-password").val());
            }
        }
        
        //修改信息
        $.post(
            '/bookWebsite/php/homePage/userInfoUpdate.php',
            {
                userId : userId,
                userName : $("#info-name").val(),
                password : newPassword,
                address : $("#info-address").val()
            },
            function (data) //回传函数
            {
                // alert(data);
                var datas = eval('(' + data + ')');
                if (datas.res == "n"){
                    alert(datas.msg);
                }else{
                    location.reload();
                }
            }
        );

    });

});

//获取用户信息
function getUserInfo(userId){
    $.post(
        '/bookWebsite/php/homePage/userInfo.php',
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
               fillUserInfoList(datas);
            }
        }
    );
}

//获取订单信息
function getOrderInfo(userId){
    $.post(
        '/bookWebsite/php/homePage/orderInfo.php',
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
               fillOrderList(datas.order);
            }
        }
    );
}

//填充用户信息
function fillUserInfoList(data){
    //设置内容
    $("#info-name").val(data.name);
    $("#info-address").val(data.address);
    password = data.password;
}

//填充订单信息
function fillOrderList(orderList){
    var table = $("#order-part table");
    table.empty();

    table.append($('<tr>')
        .append($('<th>订单信息</th>'))
        .append($('<th>订单金额</th>'))
        .append($('<th>订单时间</th>'))
        .append($('<th>订单状态</th>'))
        );

    for (var i = 0 ; i < orderList.length ; i++){
        var order = eval('(' + orderList[i] + ')');
        if (table.find("tr#order-"+order.rno).length > 0){
            //如果存在了就直接加在后面
            var orderRow = table.find("tr#order-"+order.rno);
            orderRow.find(".order-information")
            .append($('<img class="book-surface" src="/bookWebsite/image/book/'+order.envelope+'"><span> &Chi;'+order.num+'</span>'));
        }else {
            //如果还没有这个订单就需要创建这个新的订单
            var isDone = order.isDone == "0" ? "未完成" : "已完成"; 
            table.append($('<tr class="order-row" id="order-'+order.rno+'">')
                .append($('<td class="order-information">')
                    .append($('<img class="book-surface" src="/bookWebsite/image/book/'+order.envelope+'"><span> &Chi;'+order.num+'</span>')))
                .append($('<td><span class="order-money">¥'+order.money+'</span></td>'))
                .append($('<td><span class="order-time">'+order.date+'</span></td>'))
                .append($('<td><span>'+isDone+'</span></td>'))
                );
        }
    }
}



