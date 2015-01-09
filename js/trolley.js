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
});

function updateTrolley(num){
    //更新购物车上的数量
    $("#trolley-part .badge").text(num);
}

//获取cookie值
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        //return unescape(arr[2]); 
        return decodeURIComponent(arr[2]); 
    }else{ 
        return null; 
    }
}