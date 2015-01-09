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

//查询articles
$sql = "select * from user where email='".$_POST["email"]."'";
$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        $res["res"] = "n";
        $res["msg"] = "用户已存在";
    }
    else {
        $email = $_POST["email"];
        $sqlInsert = "insert into user(email,password) values('".$email."','".$_POST["password"]."')"; //插入用户表
        $insertResult = $mysqliObj->query($sqlInsert);
        //插入操作
        if ($insertResult){
            //如果插入成功
            $selResult = $mysqliObj->query("select uid from user where email='".$email."'"); //查找用户id
            if ($selResult){
                if ($selResult->num_rows > 0){
                    $selRow = $selResult->fetch_array();
                    $uid = $selRow[0];
                    $insertInfoResult = $mysqliObj->query("insert into user_info(uid,uname) values('".$uid."','".$_POST["name"]."')"); //插入用户信息表
                    //如果插入成功
                    if ($insertInfoResult){
                        $res["res"] = "y";
                        $res["userId"] = $uid;
                    }else {
                        $res["res"] = "n";
                        $res["msg"] = "注册失败";
                    }
                }else {
                    $res["res"] = "n";
                    $res["msg"] = "注册失败";
                }
            }else {
                $res["res"] = "n";
                $res["msg"] = "注册失败";
            }
        }
        else {
            $res["res"] = "n";
            $res["msg"] = "注册失败";
        }
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "注册失败";
}

//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>