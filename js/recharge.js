$(document).ready(function(){
    $("#recharge-btn").click(function(){
        $("#myModal").modal('show');
        //只有点击确定按钮才真的删除
        $("#confirm-delete").click(function(){
            $('#myModal').modal('hide');
            //确定充值
            var userId = getCookie("userId");
            var money = parseFloat($("#money").val());
            var number = $("#number").val();
            var password = $("#password").val();
            $.post(
                '/bookWebsite/php/recharge.php',
                {
                    userId : userId,
                    money : money,
                    number : number,
                    password : password
                },
                function (data) //回传函数
                {
                    // alert(data);
                    var datas = eval('(' + data + ')');
                    if (datas.res == "n"){
                        alert(datas.msg);
                    }else{
                        alert("充值成功");
                        //跳转回到上一个页面
                        history.go(-1);
                    }
                }
            );
            
        });  
    });
});