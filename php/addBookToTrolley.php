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

//获取参数
$userId = $_POST["userId"];
$bno = $_POST["bno"];
$bname = $_POST["bname"];
$num = $_POST["num"];

$sqlSearch = "SELECT *
FROM trolley 
WHERE uid = '$userId'
AND bno = '$bno'
AND bname = '$bname'
";
$resultSearch = $mysqliObj->query($sqlSearch);

if($resultSearch){
    if ($resultSearch->num_rows > 0){
        //如果已经存在这本书 则可以直接修改书的数量
        $sql = "UPDATE trolley 
        SET num = num + $num
        WHERE uid = '$userId'
        AND bno = '$bno'
        AND bname = '$bname'
        "; //选择trolley中当前用户的书号、书名、数量、存货
        $result = $mysqliObj->query($sql);

        if ($result){
            $res["res"] = "y";
        }else {
            $res["res"] = "n";
            $res["msg"] = "添加失败";
        }
    }else {
        //不存在则增加这本书的记录
        $sql = "INSERT INTO trolley(uid, bno, bname, num)
        VALUES('$userId','$bno', '$bname', $num)
        "; //选择trolley中当前用户的书号、书名、数量、存货
        $result = $mysqliObj->query($sql);

        if ($result){
            $res["res"] = "y";
        }else {
            $res["res"] = "n";
            $res["msg"] = "添加失败";
        }
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "连接数据库失败";
}


//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>