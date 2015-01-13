<?php
//引进配置文件
require_once("./config.ini.php");
$mysqliObj = new mysqli($dbhost,$dbuser,$dbpwd,$dbname);

$res = array();

if(mysqli_connect_errno()){
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
    echo json_encode($res);
    exit();
}
$mysqliObj->query("set name $charName"); //设置字符集

//查询keyword
$sqlKey = "select DISTINCT(keyword) from book_keyword";
$resultKey = $mysqliObj->query($sqlKey);
//先获取keyword
$keyWord = array();
if ($resultKey){
    if ($resultKey->num_rows > 0){
        $res["res"] = "y";
        $counter = 0;
        while ($row = $resultKey->fetch_array()){
            $keyWord[$counter] = $row[0];
            $counter = $counter + 1;
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有找到关键词";
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
}
$res["keyWord"] = $keyWord;

//再根据关键词获取book
$res["bookList"] = array();
for($i = 0 ; $i < count($keyWord) ; $i = $i + 1){
    $key = $keyWord[$i];
    $sqlBook = "SELECT book.bno, book.bname, book.envelope, book.price
        FROM book, book_keyword
        WHERE book.bno = book_keyword.bno
        AND book_keyword.keyword = '$key'
        ORDER BY book.selling DESC
        LIMIT 0,5
        ";
    $resultBook = $mysqliObj->query($sqlBook);
    if ($resultBook){
        if ($resultBook->num_rows > 0){
            $res["res"] = "y";
            $counter = 0;
            while ($row = $resultBook->fetch_array()){
                $newRow = array(
                    "bno" => $row[0],
                    "name" => $row[1],
                    "envelope" => $row[2],
                    "price" => $row[3]
                    );
                $res["bookList"][$i][$counter] = $newRow;
                $counter = $counter + 1;
            }
        }else {
            $res["res"] = "n";
            $res["msg"] = "没有关键词对应的书";
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "数据库连接错误";
    }
}

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>