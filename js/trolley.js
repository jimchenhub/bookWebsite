$(document).ready(function(){
    //获取trolley信息
    var userId = getCookie("userId");

    $.post(
        '/bookWebsite/php/trolley.php',
        {
            userId : userId
        },
        function (data) //回传函数
        {
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                updateTrolley(datas.num);
            }
        }
    );

    //进入购物车页面
    $("#trolley-part button").click(function(){
        location.href = "/bookWebsite/html/trolleyPage.html";
    });
});

function updateTrolley(num){
    //更新购物车上的数量
    $("#trolley-part .badge").text(num);
}
