$(document).ready(function(){
    $("#recharge-btn").click(function(){
        $("#myModal").modal('show');
        //只有点击确定按钮才真的删除
        $("#confirm-delete").click(function(){
            $('#myModal').modal('hide');
            //确定充值

            //跳转回到上一个页面
            history.go(-1);
        });  
    });
});