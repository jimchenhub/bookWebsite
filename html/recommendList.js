$(document).ready(function(){
    //获取最畅销的书籍
    $.post(
        '/bookWebsite/php/recommendList.php',
        {},
        function (data) //回传函数
        {
            var datas = eval('(' + data + ')');
            if (datas.res == "n"){
                alert(datas.msg);
            }else{
                fillRecommendList(datas.booklist);
            }
        }
    );

});

function fillRecommendList(booklist){

}
