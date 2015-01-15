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

//查询
$userId = $_POST["userId"];
$sql1 = "select uname, address, grade from user_info where uid='".$userId."'";
$result1 = $mysqliObj->query($sql1);

if ($result1){
    if ($result1->num_rows > 0){
        $row =$result1->fetch_array();
        $name = $row[0];
        $address = $row[1];
        $grade = $row[2];

        $res["res"] = "y";
        $res["name"] = $name;
        $res["address"] = $address;
        $res["grade"] = $grade;
        
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