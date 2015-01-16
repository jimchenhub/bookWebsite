$(document).ready(function(){
    //首先获取bno，如果没有bno则推出该页面
    var bno = getCookie("bno");
    if (bno == null || bno == ""){
        location.href = "/bookWebsite/html/ground.html";
    }
    var bname = getCookie("bname");
    if (bname == null || bname == ""){
        location.href = "/bookWebsite/html/ground.html";
    }

    // 如果正常存在搜索的内容，就进行搜索
    $.post(
        '/bookWebsite/php/book.php',
        {
            bno : bno,
            bname : bname
        },
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
               fillBookPage(datas.book);
            }
        }
    );

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

    //高级搜索按钮
    $("#specific-search-btn").click(function(){
        jumpBookListAdvance();
    });

    //加入购物车
    $("#add-to-trolley").click(function(){
        var bno = getCookie("bno");
        var userId = getCookie('userId');
        var bname = $(".info-name").text();
        var num = parseInt($(".info-num").val());
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
                    location.reload();
                }
            }
        );
    });

    //修改书的数量的事件
    $(".info-num").change(function(){
        if (parseInt($(this).val()) < 1){
            $(this).val("1");
            alert("个数不可少于1个");
        }
    });
});

//填充本页面的书本信息
function fillBookPage (book) {
    //设置书的封面
    $("#book-basic-info img").attr("src", "/bookWebsite/image/book/"+book.envelope);
    //设置书名
    $("#book-basic-info .info-name").text(book.bname);
    //设置作者
    var author = book.authorList[0].author;
    for (var i = 1 ; i < book.authorList.length ; i++){
        author = author+"，"+book.authorList[i].author;
    }
    $("#book-basic-info .info-author").text(author);
    //设置价格
    $("#book-basic-info .info-price").text("¥"+book.price);
    //设置出版社
    $("#book-basic-info .info-press").text(book.press);
    //设置出版时间
    $("#book-basic-info .info-date").text(book.publishdate);
    //设置库存
    $("#book-basic-info .info-product").text(book.inventory);
    //设置目录
    $("#book-catalog ul").append($(book.catalog));
}

//跳转到搜索结果页面
function jumpBookList(searchWord){
    searchWord = $.trim(searchWord); //去除输入框中两边的空格

    $.cookie("searchWord", searchWord); //设置搜索的cookie

    location.href = "/bookWebsite/html/bookList.html?advance=n";
}

//跳转到搜索结果页面（高级搜索）
function jumpBookListAdvance(){
    var name = $.trim($("#specific-name").val());
    var author = $.trim($("#specific-author").val());
    var press = $.trim($("#specific-press").val());
    var priceMin = $("#specific-price-min").val();
    var priceMax = $("#specific-price-max").val();

    var yearMin = $("#specific-date-year-min").val();
    var monthMin = $("#specific-date-month-min").val();
    var yearMax = $("#specific-date-year-max").val();
    var monthMax = $("#specific-date-month-max").val();
    
    location.href = "/bookWebsite/html/bookList.html?advance=y&name="+name+"&author="+author+"&press="+press+"&priceMin="+priceMin+"&priceMax="+priceMax+"&yearMin="+yearMin+"&monthMin="+monthMin+"&yearMax="+yearMax+"&monthMax="+monthMax;
}
