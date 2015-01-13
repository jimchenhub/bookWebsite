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

//获取参数
$userId = $_POST["userId"];
$money = $_POST["money"];
$number = $_POST["number"];
$password = $_POST["password"];
$sql = "SELECT password
FROM card
WHERE money = $money
AND number = '$number'
AND isuse = '0'
";
$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        $row = $result->fetch_array();
        $cardPassword = $row[0];
        if ($password = $cardPassword){
            //给这个用户充值
            $mysqliObj->query("BEGIN");
            $sqlRecharge = "UPDATE user_info
            SET money = money + $money,
            sumrecharge = sumrecharge + $money
            WHERE uid = '$userId'
            ";
            $sqlUse = "UPDATE card
            SET isuse = '1'
            WHERE money = $money
            AND number = '$number'
            ";

            $resultRecharge = $mysqliObj->query($sqlRecharge);
            $resultUse = $mysqliObj->query($sqlUse);
            if ($resultRecharge && $resultUse){
                $mysqliObj->query("COMMIT");
                $res["res"] = "y";
            }else {
                $mysqliObj->query("ROLLBACK");
                $res["res"] = "n";
                $res["msg"] = "为充值成功";
            }
            $mysqliObj->query("END");
        }else {
            $res["res"] = "n";
            $res["msg"] = "密码不正确";
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有找到这张卡";
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