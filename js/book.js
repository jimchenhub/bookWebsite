$(document).ready(function(){
    //首先获取searchword，如果没有searchword则推出该页面
    

    // 如果正常存在搜索的内容，就进行搜索
    // $.post(
    //     '/bookWebsite/php/search.php',
    //     {
    //         searchWord : searchWord
    //     },
    //     function (data) //回传函数
    //     {
    //         // alert(data);
    //         var datas = eval('(' + data + ')');
    //         if (datas.res == "n"){
    //             alert(datas.msg);
    //         }else{
    //            fillBookList(datas);
    //         }
    //     }
    // );

    //点击搜索进入booklist页面
    $("#input-btn").click(function(){
        var keyWord = $("#search-input").val();
        if ($.trim(keyWord) == ""){
            alert("还未填写内容");
            $("#search-input").focus();
        }else {
            jumpBookList(keyWord);
        }
    });
    
    //点击热门搜索
    $("#recommend-part li").click(function(){
        var keyWord = $(this).text();
        jumpBookList(keyWord);
    });

    //点击高级搜索出现更多输入框
    $("#specific-search").click(function(){
        if (parseInt($("#specific-search-part").height()) == 0){
            $("#specific-search-part").animate({
                height : "300px"
            }, "normal", "swing");
            $(this).text("关闭高级搜索");
        }else {
            $("#specific-search-part").animate({
                height : "0px"
            }, "normal", "swing");
            $(this).text("高级搜索");
        }
    });

    
});

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

//进入booklist页面
function jumpBookList(searchWord){
    searchWord = $.trim(searchWord); //去除输入框中两边的空格

    $.cookie("searchWord", searchWord); //设置搜索的cookie

    location.href = "/bookWebsite/html/bookList.html";
}