<?php
//传入的东西：原封不动的bname长字符串等，已经在php内处理了多关键字的情况。
//这个php的主要动作是进行高级搜索
require_once("config.ini.php");
$mysqliObj = new mysqli($dbhost,$dbuser,$dbpwd,$dbname);
$res = array();
if(mysqli_connect_errno()){
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
    echo json_encode($res);
    exit();
}
$mysqliObj->query("set name $charName"); //设置字符集
// $mysqliObj->query("SET NAMES 'utf8'");
// $mysqliObj->query("SET CHARACTER_SET_CLIENT=utf8");
// $mysqliObj->query("SET CHARACTER_SET_RESULTS=utf8");

$bname   = $_POST["bname"];
$author = $_POST["author"];
$press  = $_POST["press"];
$price_l= $_POST["min_price"];
$price_r= $_POST["max_price"];
$time_l = $_POST["min_time"];
$time_r = $_POST["max_time"];
$type = $_POST["type"];
$page = $_POST["page"];

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
  break;
}


$sql = "SELECT book.bno, book.bname, book_author.author, book.press, book.price, book.envelope, book.inventory, book.publishdate, book.selling
        FROM book, book_keyword,book_author 
        where book.bno = book_author.bno 
        and book.bno = book_keyword.bno
        ";//根据表的名字查询表

    $flag = 0;
if ($bname!="")
{
    $flag = $flag + 1;
    $wh = "";
    if ($flag==1) {
        $wh = " and( " ;
    } else
    {
        $wh = " and ";
    }
    $adding = " book.bname like ".'"%'.$bname.'%" ';
    $sql = $sql.$wh.$adding;
}
if ($author!="")
{
    $flag = $flag + 1;
    $wh = "";
    if ($flag==1) {
        $wh = " and( " ;
    } else
    {
        $wh = " and ";
    }
    $adding = " book_author.author like ".'"%'.$author.'%" ';
    $sql = $sql.$wh.$adding;
}
if ($press!="")
{
    $flag = $flag + 1;
    $wh = "";
    if ($flag==1) {
        $wh = " and( " ;
    } else
    {
        $wh = " and ";
    }
    $adding = " book.press like ".'"%'.$press.'%" ';
    $sql = $sql.$wh.$adding;
}

if (($price_l!="") or ($price_r!=""))
{
    $flag = $flag + 1;
    $wh = "";
    if ($flag==1) {
        $wh = " and( " ;
    } else
    {
        $wh = " and ";
    }
    $l = $price_l;
    $r = $price_r;
    if ($price_l=="") $l = -1;
    if ($price_r=="") $r = 99999;
    $adding = "book.price between $l and $r ";
    $sql = $sql.$wh.$adding;
}

if (($time_l!="") or ($time_r!=""))
{
    $flag = $flag + 1;
    $wh = "";
    if ($flag==1) {
        $wh = " and( " ;
    } else
    {
        $wh = " and ";
    }
    $l = $time_l;
    $r = $time_r;
    if ($time_l == ""){
        $l = "1990-01-01";
    }
    if ($time_r == ""){
        $r = "2100-01-01";
    }
    $adding = "book.publishdate between '$l' and '$r' ";
    $sql = $sql.$wh.$adding;
}

if ($flag!=0)
{
    $sql = $sql.")";
}
$total_sql_count = $sql;
$sql = $sql.$typeStr." ".$limitStr;
// mb_convert_encoding($sql,"UTF-8","auto");
//echo $sql."<br>";

$resultCount = $mysqliObj->query($total_sql_count);
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
//var_dump($result);
//关闭数据库连接
$mysqliObj->close();
//返回数据
echo json_encode($res);
?>