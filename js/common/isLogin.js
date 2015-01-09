$(document).ready(function(){
    //检查是否登录了
    var userId = getCookie('userId');
    if (userId == null){
        location.href = "/bookWebsite/index.html";
    }
});

function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        // return unescape(arr[2]); 
        return decodeURIComponent(arr[2]); 
    }else{
        return null; 
    } 
}