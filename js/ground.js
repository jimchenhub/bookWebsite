$(document).ready(function(){
    //填充页面
    $.post(
        '/bookWebsite/php/ground.php',
        {},
        function (data) //回传函数
        {
            // alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                fillPage(datas);
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
});

function fillPage(datas){
    $("#catagory-list").empty();
    for (var i = 0 ; i < datas.keyWord.length; i++){
        var keyWord = datas.keyWord[i]; //关键词
        var bookList = datas.bookList[i]; //书表

        $("#catagory-list").append($('<h2>'+keyWord+'</h2>'))
        var bigBookName = bookList[0].name.length > 18 ? bookList[0].name.substring(0,18)+"..." : bookList[0].name;
        var content = $('<div id="type-'+i+'" class="catagory-type">')
            .append($('<div class="book book-lg" id="book-'+bookList[0].bno+'-'+bookList[0].name+'">')
                .append($('<img src="/bookWebsite/image/book/'+bookList[0].envelope+'">'))
                .append($('<p>《'+bigBookName+'》</p>'))
                .append($('<p class="book-price">¥'+bookList[0].price+'元</p>')));
        for (var counter = 1; counter < bookList.length; counter++){
            var smallBookName = bookList[counter].name.length > 10 ? bookList[counter].name.substring(0,8)+"..." : bookList[counter].name;
            content.append($('<div class="book book-sm" id="book-'+bookList[counter].bno+'-'+bookList[counter].name+'">')
                .append($('<img src="/bookWebsite/image/book/'+bookList[counter].envelope+'">'))
                .append($('<p>《'+smallBookName+'》</p>'))
                .append($('<p class="book-price">¥'+bookList[counter].price+'元</p>')));
        }
        $("#catagory-list").append(content);
    }

    //点击图片或名字进入book页面事件
    $("#catagory-list img, #catagory-list p").click(function(){
        var id = $(this).parents(".book").attr("id");
        var bno = id.split("-")[1];
        var name = id.split("-")[2];
        jumpBook(bno, name);
    });
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

//跳转到书本信息页面
function jumpBook(bno, name){
    $.cookie("bno", bno);
    $.cookie("bname", name);

    location.href = "/bookWebsite/html/book.html";
}
