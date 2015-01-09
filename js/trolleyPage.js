$(document).ready(function(){
    //获取购物车信息
    // $.post(
    //     '/bookWebsite/php/trolleyPage.php',
    //     {
    //         userId : userId 
    //     },
    //     function (data) //回传函数
    //     {
    //         //alert(data);
    //         var datas = eval('(' + data + ')');
    //         if (datas.res == "n"){
    //             alert(datas.msg);
    //         }else{
                fillPage();
    //         }
    //     }
    // );

    //全选按钮事件
    $("#all-choose-checkbox").click(function(){
        var aaaaaaaaa = $(this).attr("checked");
        if ($(this).attr("checked")){
            $(this).removeAttr("checked");
            $(".data-row .book-checkbox").removeAttr("checked");
        }else {
            $(this).attr("checked", true);
            $(".data-row .book-checkbox").attr("checked", true);
            $(this).prop("checked", true);
            $(".data-row .book-checkbox").prop("checked", true);
        }
        updateSumMoney();
    });

    //每个单独按钮的事件
    $(".data-row .book-checkbox").click(function(){
       if ($(this).attr("checked")){
            $(this).removeAttr("checked");
            $("#all-choose-checkbox").removeAttr("checked"); //取消全选按钮
        }else {
            $(this).attr("checked", true);
            $(this).prop("checked", true);
            //判断是否能够自动勾选上全选按钮
            var isAll = true;
            $(".data-row .book-checkbox").each(function(index){
                if ($(this).attr("checked") != "checked"){
                    isAll = false;
                }
            });
            if (isAll){
                $("#all-choose-checkbox").attr("checked", true);
                $("#all-choose-checkbox").prop("checked", true);
            }
        }
        updateSumMoney(); 
    });

    //修改书的数量的事件
    $(".num-input").change(function(){
        if (parseInt($(this).val()) < 1){
            $(this).val("1");
            alert("个数不可少于1个");
        }
        updateSumMoney();
    });

    //删除按钮的事件
    $(".book-delete").click(function(){
        var dataRow = $(this).parents(".data-row");
        $('#myModal').modal('show');
        //只有点击确定按钮才真的删除
        $("#confirm-delete").click(function(){
            $('#myModal').modal('hide');
            dataRow.remove();
            updateSumMoney(); 
        });  
    });

    //结算按钮事件
    $("#submit-btn").click(function(){
        location.href = "/bookWebsite/html/infoConfirm.html";
    });
});

//更新总价格
function updateSumMoney(){
    var sumMoney = 0.00;
    $(".data-row .book-checkbox").each(function(index){
        if ($(this).attr("checked") == "checked"){
            var price = parseFloat($(this).parents(".data-row").find(".book-price").text().substr(1));
            var num = parseInt($(this).parents(".data-row").find(".num-input").val());
            sumMoney = sumMoney + price * num;
        }
    });
    sumMoney = sumMoney.toFixed(2);
    $(".all-price").text("¥"+sumMoney);
}

//更新页面
function fillPage(){
    updateSumMoney();
}