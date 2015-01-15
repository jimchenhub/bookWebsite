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

$userId = $_POST["userId"];
$key = $_POST["searchWord"];
$type = $_POST["type"];
$page = $_POST["page"];

$size = count($key);

$limitBelow = ($page-1) *10;
$limitOver = $page *10;
$limitStr = "limit $limitBelow,$limitOver";

switch ($type)
{
case 0:
  $typeStr = "ORDER BY selling DESC";
  break;
case 1:
  $typeStr = "ORDER BY selling ASC";
  break;
case 2:
  $typeStr = "ORDER BY price DESC";
  break;
case 3:
  $typeStr = "ORDER BY price ASC";
  break;
case 4:
  $typeStr = "ORDER BY publishdate DESC";
  break;
case 5:
  $typeStr = "ORDER BY publishdate ASC";
  break;
default:
}

//模糊搜索字符串合并
$sql = "SELECT book.bno, book.bname, book_author.author, book.press, book.price, book.envelope, book.inventory, book.publishdate, book.selling
from book,book_author,book_keyword
where book.bno = book_author.bno
and book.bno = book_keyword.bno
and
(
book.bname like '%".$key[0]."%'
or book_author.author like '%".$key[0]."%'
or book_keyword.keyword like '%".$key[0]."%' 
or book.catalog like '%".$key[0]."%'
or book.press like '%".$key[0]."%'
)
"; 
for($i = 1; $i < $size; $i = $i + 1)
{
    $sql = $sql."UNION 
SELECT book.bno, book.bname, book_author.author, book.press, book.price, book.envelope, book.inventory, book.publishdate, book.selling
from book,book_author,book_keyword
where book.bno = book_author.bno
and book.bno = book_keyword.bno
and
(
book.bname like '%".$key[$i]."%'
or book_author.author like '%".$key[$i]."%'
or book_keyword.keyword like '%".$key[$i]."%' 
or book.catalog like '%".$key[$i]."%'
or book.press like '%".$key[$i]."%'
)
";
}
$sqlCount = $sql; //找出count的sql
$sql = $sql.$typeStr." ".$limitStr;

$resultCount = $mysqliObj->query($sqlCount);
if ($resultCount){
    $res["count"] = $resultCount->num_rows;
}else {
    $res["res"] = "n";
    $res["msg"] = "数据库连接失败";   
    echo json_encode($res);
    exit(); 
}

$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        $res["res"] = "y";
        $res["bookList"] = array();
        $num_rows = $result->num_rows;
        $counter = 0;
        while($counter < $num_rows){
            $row = $result->fetch_array();
            $newRow = array(
                    "bno" => $row[0],
                    "bname" => $row[1],
                    "author" => $row[2],
                    "press" => $row[3],
                    "price" => $row[4],
                    "envelope" => $row[5],
                    "inventory" => $row[6],
                    "date" => $row[7]
                    );
            $res["bookList"][$counter] = $newRow;
            $counter = $counter + 1; 
        }    
    }else {
        $res["res"] = "not found";
        $res["msg"] = "未找到符合条件的书目";
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "为查找到符合条件的书";
}

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>