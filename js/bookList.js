var curPage = 1;
$(document).ready(function(){
    //首先获取searchword，如果没有searchword则推出该页面
    var searchWord = getCookie("searchWord");
    if (searchWord == null || searchWord == ""){
        location.href = "/bookWebsite/html/ground.html";
    }

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

    //进入购物车页面
    $("#trolley-part button").click(function(){
        location.href = "/bookWebsite/html/trolleyPage.html";
    });
});

//填充booklist
function fillBookList(datas){
    $("#book-list").empty();
    for(var i = 0 ; i < 12; i++){
        $("#book-list").append($('<div class="book-item">')
            .append($('<div class="item-img">')
                .append($('<img src="/bookWebsite/image/index/alpaca.jpg">')))
            .append($('<div class="item-info">')
                .append($('<p class="title">如何成为土豪</p>'))
                .append($('<p class="price">价格: <span class="current-price">66.66</span> 元</p>'))
                .append($('<hr>'))
                .append($('<ul class="info-list">')
                    .append($('<li>作者: <span class="author">刘家豪／吕泽华</span></li>'))
                    .append($('<li>出版社: <span class="press">北京邮电出版社</span></li>'))
                    .append($('<li>出版时间: <span class="date">2014-12-23</span></li>'))
                    .append($('<li>库存: 剩余<span class="book-num">11</span>本</li>'))
                    )
                )
            .append($('<div class="item-operation">')
                .append($('<button class="btn btn-default">加入购物车</button>')))
            );
    }
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

//进入booklist页面
function jumpBookList(searchWord){
    searchWord = $.trim(searchWord); //去除输入框中两边的空格

    $.cookie("searchWord", searchWord); //设置搜索的cookie

    location.href = "/bookWebsite/html/bookList.html";
}