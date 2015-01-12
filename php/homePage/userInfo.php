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
$sql1 = "select uname, address from user_info where uid='".$userId."'";
$result1 = $mysqliObj->query($sql1);
$sql2 = "select password from user where uid='".$userId."'";
$result2 = $mysqliObj->query($sql2);

if ($result1 && $result2){
    if ($result1->num_rows > 0){
        $row =$result1->fetch_array();
        $name = $row[0];
        $address = $row[1];
        $password = $row[2];
            
        $res["res"] = "y";
        $res["name"] = $name;
        $res["address"] = $address;
        
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有这个用户";
    }
    if ($result2->num_rows > 0){
        $row =$result2->fetch_array();
        $password = $row[0];
            
        $res["password"] = $password;
        
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有这个用户";
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
}

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>