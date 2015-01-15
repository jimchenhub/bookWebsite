$(document).ready(function(){
    //获取购物车信息
    var userId = getCookie('userId');
    $.post(
        '/bookWebsite/php/trolleyPage.php',
        {
            userId : userId 
        },
        function (data) //回传函数
        {
            //alert(data);
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                fillPage(datas.data);
            }
        }
    );

});

//更新总价格
function updateSumMoney(){
    var sumMoney = 0.00;
    // $(".data-row .book-checkbox").each(function(index){
    //     if ($(this).attr("checked") == "checked"){
    //         var price = parseFloat($(this).parents(".data-row").find(".book-price").text().substr(1));
    //         var num = parseInt($(this).parents(".data-row").find(".num-input").val());
    //         sumMoney = sumMoney + price * num;
    //     }
    // });
    $(".data-row").each(function(index){
        var price = parseFloat($(this).find(".book-price").text().substr(1));
        var num = parseInt($(this).find(".num-input").val());
        sumMoney = sumMoney + price * num;
    });
    sumMoney = sumMoney.toFixed(2);
    $(".all-price").text("¥"+sumMoney);
}

function updateInventory(dataRow){
    var num = parseInt(dataRow.find(".num-input").val());
    var inventoryString = dataRow.find(".book-inventory-num").text();

    var inventory = parseInt(inventoryString.substring(1,inventoryString.length-1));

    var isFull = num > inventory ? "缺货" : "有货";
    dataRow.find(".book-inventory").text(isFull);
}

//更新页面
function fillPage(data){
    //如果购物车里面没有东西 就直接显示没有东西
    if (data.length == 0){
        alert("购物车为空");
        location.href = "/bookWebsite/html/ground.html";
        return;
    }

    var tBody = $("#trolley-list table tbody");
    tBody.empty();

    tBody.append($('<tr>')
        //.append($('<th><input type="checkbox" name="all-choose" id="all-choose-checkbox" value="all-choose" checked> 全选</th>'))
        .append($('<th>商品</th>'))
        .append($('<th>价格</th>'))
        .append($('<th>货存</th>'))
        .append($('<th>数量</th>'))
        .append($('<th>操作</th>'))
        );
    for (var i = 0 ; i < data.length; i++){
        var oneBook = eval('(' + data[i] + ')');
        // 是否有货
        var isFull = parseInt(oneBook.num) > parseInt(oneBook.inventory) ? "缺货" : "有货";
        
        tBody.append($('<tr class="data-row" id="book-'+oneBook.bno+'-'+oneBook.bname+'">')
            //.append($('<td><span><input type="checkbox" name="book1" id="book1-checkbox" class="book-checkbox" checked></span></td>'))
            .append($('<td><img class="book-surface" src="/bookWebsite/image/book/'+oneBook.envelope+'"><span class="book-name">'+oneBook.bname+'</span></td>'))
            .append($('<td><span class="book-price">¥'+oneBook.price+'</span></td>'))
            .append($('<td><span class="book-inventory">'+isFull+'</span><span class="book-inventory-num">('+oneBook.inventory+')</span></td>'))
            .append($('<td><span class="num-td"><input class="num-input" type="number" value="'+oneBook.num+'"></span></td>'))
            .append($('<td><span><a class="book-delete" data-toggle="modal">删除</a></span></td>'))
            );
    }

    tBody.append($('<tr class="submit-row">')
        .append($('<td colspan="5">')
            .append($('<button class="btn btn-primary" id="submit-btn">结算</button>'))
            .append($('<p>总价: <span class="all-price"></span></p>')))
        );

    updateSumMoney();

    // //全选按钮事件
    // $("#all-choose-checkbox").click(function(){
    //     var aaaaaaaaa = $(this).attr("checked");
    //     if ($(this).attr("checked")){
    //         $(this).removeAttr("checked");
    //         $(".data-row .book-checkbox").removeAttr("checked");
    //     }else {
    //         $(this).attr("checked", true);
    //         $(".data-row .book-checkbox").attr("checked", true);
    //         $(this).prop("checked", true);
    //         $(".data-row .book-checkbox").prop("checked", true);
    //     }
    //     updateSumMoney();
    // });

    // //每个单独按钮的事件
    // $(".data-row .book-checkbox").click(function(){
    //    if ($(this).attr("checked")){
    //         $(this).removeAttr("checked");
    //         $("#all-choose-checkbox").removeAttr("checked"); //取消全选按钮
    //     }else {
    //         $(this).attr("checked", true);
    //         $(this).prop("checked", true);
    //         //判断是否能够自动勾选上全选按钮
    //         var isAll = true;
    //         $(".data-row .book-checkbox").each(function(index){
    //             if ($(this).attr("checked") != "checked"){
    //                 isAll = false;
    //             }
    //         });
    //         if (isAll){
    //             $("#all-choose-checkbox").attr("checked", true);
    //             $("#all-choose-checkbox").prop("checked", true);
    //         }
    //     }
    //     updateSumMoney(); 
    // });

    //修改书的数量的事件
    $(".num-input").change(function(){
        if (parseInt($(this).val()) < 1){
            $(this).val("1");
            alert("个数不可少于1个");
        }else {
            var dataRow = $(this).parents(".data-row");
            var id = dataRow.attr("id");
            var userId = getCookie('userId');
            var bno = id.split("-")[1];
            var bname = id.split("-")[2];
            var num = parseInt(dataRow.find(".num-input").val());

            //修改个数
            $.post(
                '/bookWebsite/php/trolleyUpdateNum.php',
                {
                    userId : userId,
                    bno : bno,
                    bname : bname,
                    num : num
                },
                function (data) //回传函数
                {
                    //alert(data);
                    var datas = eval('(' + data + ')');
                    if (datas.res == "n"){
                        alert(datas.msg);
                    }else{
                        updateSumMoney();
                        updateInventory(dataRow); //修改是否有货
                    }
                }
            ); 
        }
    });

    //删除按钮的事件
    $(".book-delete").click(function(){
        var dataRow = $(this).parents(".data-row");
        $('#myModal').modal('show');
        //只有点击确定按钮才真的删除
        $("#confirm-delete").click(function(){
            $('#myModal').modal('hide');

            //确定在数据库中删除这本书
            var id = dataRow.attr("id");
            var userId = getCookie('userId');
            var bno = id.split("-")[1];
            var bname = id.split("-")[2];

            $.post(
                '/bookWebsite/php/itemDelete.php',
                {
                    userId : userId,
                    bno : bno,
                    bname : bname
                },
                function (data) //回传函数
                {
                    //alert(data);
                    var datas = eval('(' + data + ')');
                    if (datas.res == "n"){
                        alert(datas.msg);
                    }else{
                        dataRow.remove();
                        updateSumMoney(); 
                    }
                }
            );
        });  
    });

    //结算按钮事件
    $("#submit-btn").click(function(){  
        //先确定是否有缺货，有缺货就需要记录缺货记录
        $("#lack-list").empty();

        var hasLack = false;
        $(".data-row").each(function(index){
            var isFull = $(this).find(".book-inventory").text();
            if (isFull == "缺货"){
                hasLack = true;
                //添加lack book
                var id = $(this).attr("id");
                $("#lack-list").append($('<div class="lack-book" id="lack-'+id+'">')
                    .append($('<div class="col-xs-1">')
                        .append($('<input type="checkbox" class="book-checkbox" checked="checked">')))
                    .append($('<div class="col-xs-8">')
                        .append($('<img class="book-surface" src="'+$(this).find(".book-surface").attr("src")+'">'))
                        .append($('<span class="book-name">'+$(this).find(".book-name").text()+'</span>')))
                    .append($('<div class="col-xs-3">')
                        .append($('<span class="book-num">&Chi;'+$(this).find(".num-input").val()+'</span>')))
                    );
                }
        });

        //如果有缺货
        if (hasLack){
            $("#lackModal").modal("show");

            /*注册两个按钮的事件*/
            //勾选订购
            $("#some-lack-btn").click(function(){
                var bnoList = new Array();
                var bnameList = new Array();
                var numList = new Array();

                var counter = 0;

                var allChoose = true;

                $(".lack-book").each(function(index){
                    var checked = $(this).find(".book-checkbox")[0].checked;
                    if (checked){
                        bnoList[counter] = $(this).attr("id").split("-")[2];
                        bnameList[counter] = $(this).attr("id").split("-")[3];
                        numList[counter] = parseInt($(this).find(".book-num").text().substr(1));
                        counter++;
                    }else {
                        allChoose = false;
                    }
                });

                var userId = getCookie("userId");
                $.post(
                    '/bookWebsite/php/addLackRecord.php',
                    {
                        userId : userId,
                        bno : bnoList,
                        bname : bnameList,
                        num : numList
                    },
                    function (data) //回传函数
                    {
                        //alert(data);
                        var datas = eval('(' + data + ')');
                        if (datas.res == "n"){
                            alert(datas.msg);
                        }else{
                            $("#lackModal").modal("hide");
                            //如果全部删除了就可以直接进入下一个页面，否则就还需要对缺货的记录进行处理
                            if (allChoose){
                                location.href = "/bookWebsite/html/infoConfirm.html";
                            }else {
                                location.reload();
                            }
                            
                        }
                    }
                );
            });

            //全部订购
            $("#some-lack-btn").click(function(){
                var bnoList = new Array();
                var bnameList = new Array();
                var numList = new Array();

                var counter = 0;

                $(".lack-book").each(function(index){
                    bnoList[counter] = $(this).attr("id").split("-")[2];
                    bnameList[counter] = $(this).attr("id").split("-")[3];
                    numList[counter] = parseInt($(this).find(".book-num").text().substr(1));
                    counter++;
                });

                var userId = getCookie("userId");
                $.post(
                    '/bookWebsite/php/addLackRecord.php',
                    {
                        userId : userId,
                        bno : bnoList,
                        bname : bnameList,
                        num : numList
                    },
                    function (data) //回传函数
                    {
                        //alert(data);
                        var datas = eval('(' + data + ')');
                        if (datas.res == "n"){
                            alert(datas.msg);
                        }else{
                            $("#lackModal").modal("hide");
                            //直接进入下一个页面
                            location.href = "/bookWebsite/html/infoConfirm.html";
                        }
                    }
                );

            });
        }else{
            //正常进入结算页面
            location.href = "/bookWebsite/html/infoConfirm.html";    
        }
    });
}