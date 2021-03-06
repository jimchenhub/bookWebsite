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

//查询articles
$userId = $_POST["userId"];
$sql = "select Count(num) from trolley where uid = '".$userId."';"; //选择trolley中当前用户的商品数
$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        $row =$result->fetch_array();
        $num = $row[0];

        $res["res"] = "y";
        $res["num"] = $num;
    }else {
        $res["res"] = "n";
        $res["msg"] = "获取购物车信息失败";
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "获取购物车信息失败";
}

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>