<?php
//引进配置文件
require_once("./config.ini.php");
$mysqliObj = new mysqli($dbhost,$dbuser,$dbpwd,$dbname);

$res = array();

if(mysqli_connect_errno()){
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
    //echo json_encode($res);
    exit();
}
$mysqliObj->query("set name $charName"); //设置字符集

//查询articles
$userId = $_POST["userId"];
$bno = $_POST["bno"];
$bname = $_POST["bname"];

$sql = "DELETE FROM trolley 
WHERE bno = '$bno'
AND uid = '$userId'
AND bname = '$bname'
"; //选择trolley中当前用户的书号、书名、数量、存货
$result = $mysqliObj->query($sql);
//print_r($result);

if ($result){
    $res["res"] = "y";
}else {
    $res["res"] = "n";
    $res["msg"] = "删除失败";
}
//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>