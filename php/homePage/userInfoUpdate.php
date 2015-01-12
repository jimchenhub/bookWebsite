<?php
//引进配置文件
require_once("../config.ini.php");
$mysqliObj = new mysqli($dbhost,$dbuser,$dbpwd,$dbname);

$res = array();

if(mysqli_connect_errno()){
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
    echo json_encode($res);
    exit();
}
$mysqliObj->query("set name $charName"); //设置字符集

//查询
$userId = $_POST["userId"];
$name = $_POST["userName"];
$password = $_POST["password"];
$address = $_POST["address"];

$sql1 = "UPDATE `user_info` 
SET `uname` = '$name', `address` = '$address' 
WHERE uid = '$userId'";
$sql2 = "UPDATE user 
set `password` = '$password' 
where `uid` = '$userId'";

$mysqliObj->query("BEGIN");
$result1 = $mysqliObj->query($sql1);
$result2 = $mysqliObj->query($sql2);

if ($result1 && $result2){
    $mysqliObj->query("COMMIT");
    $res["res"] = "y";
}else {
    //如果
    $mysqliObj->query("ROLLBACK");
    $res["res"] = "n";
    $res["msg"] = "更新失败";
}

$mysqliObj->query("END");

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>