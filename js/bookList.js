var curPage = 1;
var itemSum;
$(document).ready(function(){
    //首先获取searchword，如果没有searchword则推出该页面
    var searchWord = getCookie("searchWord");
    if (searchWord == null || searchWord == ""){
        location.href = "/bookWebsite/html/ground.html";
    }

    // 如果正常存在搜索的内容，就进行搜索
    fillPage(0);

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

    // //点击热门搜索
    // $("#recommend-part li").click(function(){
    //     var keyWord = $(this).text();
    //     jumpBookList(keyWord);
    // });

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

    //上一页
    $(".previous").click(function(){
        if ($(this).hasClass("disabled")){
            return;
        }
        curPage--;
        var id = $("#conditions ul li.active").attr("id");
        if (id == "sort-selling"){
            fillPage(0);
        }else if (id == "sort-price"){
            fillPage(3);
        }else if (id == "sort-date"){
            fillPage(4);
        }

        $("html,body").animate({scrollTop : "0"}, "normal", "swing");
    });

    //下一页
    $(".next").click(function(){
        if ($(this).hasClass("disabled")){
            return;
        }
        curPage++;
        var id = $("#conditions ul li.active").attr("id");
        if (id == "sort-selling"){
            fillPage(0);
        }else if (id == "sort-price"){
            fillPage(3);
        }else if (id == "sort-date"){
            fillPage(4);
        }

        $("html,body").animate({scrollTop : "0"}, "normal", "swing");
    });
});

//填充页面
function fillPage(type){
    var searchWord = getCookie("searchWord");
    var searchWordArray = new Array();

    var reg = /\s+/g;    
    var newSearchWord=searchWord.replace(reg," ");

    searchWordArray = newSearchWord.split(" ");

    var userId = getCookie("userId");
    $.post(
        '/bookWebsite/php/fuzzySearch.php',
        {
            searchWord : searchWordArray,
            type : type,
            userId : userId,
            page : curPage

        },
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else if (datas.res == "not found"){
                itemSum = 0;
                //设置关键字
                $("#serach-word").text("“"+searchWord+"”未找到满足条件的书目");
                //显示没有找到书
                $("#book-list").empty();
                $("#pager").css("display","none");
                $("#conditions").css("display","none");
            }else {
                itemSum = datas.count;
                //设置关键字
                $("#serach-word").text("“"+searchWord+"”找到"+itemSum+"本书");
                //填充书目表
                fillBookList(datas.bookList);
            }
        }
    );
}

//填充booklist
function fillBookList(datas){
    $("#book-list").empty();
    for(var i = 0 ; i < datas.length; i++){
        if ($("#book-"+datas[i].bno+"-"+datas[i].bname).length > 0){
            var item = $("#book-list").find("#book-"+datas[i].bno+"-"+datas[i].bname);
            var author = item.find(".author");
            author.text(author.text()+" "+datas[i].author);
        }else {
            $("#book-list").append($('<div class="book-item" id="book-'+datas[i].bno+'-'+datas[i].bname+'">')
                .append($('<div class="item-img">')
                    .append($('<img class="book-surface" src="/bookWebsite/image/book/'+datas[i].envelope+'">')))
                .append($('<div class="item-info">')
                    .append($('<p class="title">'+datas[i].bname+'</p>'))
                    .append($('<p class="price">价格: <span class="current-price">'+datas[i].price+'</span> 元</p>'))
                    .append($('<hr>'))
                    .append($('<ul class="info-list">')
                        .append($('<li>作者: <span class="author">'+datas[i].author+'</span></li>'))
                        .append($('<li>出版社: <span class="press">'+datas[i].press+'</span></li>'))
                        .append($('<li>出版时间: <span class="date">'+datas[i].date+'</span></li>'))
                        .append($('<li>库存: 剩余<span class="book-num">'+datas[i].inventory+'</span>本</li>'))
                        )
                    )
                .append($('<div class="item-operation">')
                    .append($('<button class="btn btn-default add-to-trolley-btn">加入购物车</button>')))
                );    
        }
    }
    //设置页码
    $(".page-num").text(curPage);

    //设置上一页和下一页
    if (curPage == 1){
        $("#pager .previous").attr("disabled", true);
        $("#pager .previous").addClass("disabled");
    }else {
        $("#pager .previous").attr("disabled", false);
        $("#pager .previous").removeClass("disabled");
    }
    if (curPage == Math.ceil(itemSum/10)){
        $("#pager .next").attr("disabled", true);
        $("#pager .next").addClass("disabled");
    }else {
        $("#pager .next").attr("disabled", false);
        $("#pager .next").removeClass("disabled");
    }

    /*=====填充完页面之后的事件注册====*/
    //点击书的封面进入书的具体页面
    $(".book-surface").click(function(){
        var item = $(this).parents(".book-item");
        var id = item.attr("id");
        var bno = id.split("-")[1];
        var name = id.split("-")[2];
        jumpBook(bno, name);
    });

    //点击加入购物车
    $(".add-to-trolley-btn").click(function(){
        var item = $(this).parents(".book-item");
        var id = item.attr("id");
        var bno = id.split("-")[1];
        var bname = id.split("-")[2];
        var userId = getCookie('userId');
        var num = 1;
        $.post(
            '/bookWebsite/php/addBookToTrolley.php',
            {
                userId : userId,
                bno : bno,
                bname : bname,
                num : num
            },
            function (data) //回传函数
            {
                // alert(data);
                var datas = eval('(' + data + ')');
                if (datas.res == "n"){
                    alert(datas.msg);
                }else{
                    //添加成功
                    var num = parseInt($(".badge").text());
                    $(".badge").text(num+1);
                }
            }
        );
    });

    //选择按某条件排序
    $("#conditions ul li").click(function(){
        //先回到第一页
        curPage = 1;

        var id = $(this).attr("id");

        if (id == "sort-selling"){
            fillPage(0);
        }else if (id == "sort-price"){
            fillPage(3);
        }else if (id == "sort-date"){
            fillPage(4);
        }

        //设置active属性
        $("#conditions ul li.active").removeClass("active");
        $(this).addClass("active");
    });

}

//进入booklist页面
function jumpBookList(searchWord){
    searchWord = $.trim(searchWord); //去除输入框中两边的空格

    $.cookie("searchWord", searchWord); //设置搜索的cookie

    location.href = "/bookWebsite/html/bookList.html";
}

//跳转到书本信息页面
function jumpBook(bno, name){
    $.cookie("bno", bno);
    $.cookie("bname", name);

    location.href = "/bookWebsite/html/book.html";
}