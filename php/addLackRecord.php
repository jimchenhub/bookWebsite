<?php
ini_set('date.timezone','Asia/Shanghai'); //设置时区
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
$bnoList = $_POST["bno"];
$bnameList = $_POST["bname"];
$numList = $_POST["num"];
$date = date("y-m-d",time());

//一个一个执行缺书记录
$mysqliObj->query("BEGIN"); //开始事务
for ($i = 0 ; $i < count($bnoList); $i = $i + 1){
    $bno = $bnoList[$i];
    $bname = $bnameList[$i];
    $num = $numList[$i];

    //缺书记录
    $sqlSearch = "SELECT *
    FROM lack_record
    WHERE bno = $bno
    AND bname = '$bname'
    ";
    $resultSearch = $mysqliObj->query($sqlSearch);

    if($resultSearch){
        if ($resultSearch->num_rows > 0){
            //如果已经存在这本书 则可以直接修改书的数量
            $sql = "UPDATE lack_record 
            SET num = num + $num
            WHERE bno = $bno
            AND bname = '$bname'
            "; 
            $result = $mysqliObj->query($sql);

            if (!$result){
                $res["res"] = "n";
                $res["msg"] = "添加失败";
                $mysqliObj->query("ROLLBACK");
            }
        }else {
            //不存在则增加这本书的记录
            $sql = "INSERT INTO lack_record(bno, bname, num, date)
            VALUES($bno, '$bname', $num, '$date')
            ";
            $result = $mysqliObj->query($sql);

            if (!$result){
                $res["res"] = "n";
                $res["msg"] = "添加失败";
                $mysqliObj->query("ROLLBACK");
            }
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "连接数据库失败";
        $mysqliObj->query("ROLLBACK");
    }

    //用户缺书记录
    $sqlUserLack = "SELECT *
    FROM user_lack
    WHERE uid = $userId
    AND bno = $bno
    AND bname = '$bname'
    ";
    $resultUserLack = $mysqliObj->query($sqlUserLack);

    if($resultUserLack){
        if ($resultUserLack->num_rows > 0){
            //如果已经存在这本书 则可以直接修改书的数量
            $sql = "UPDATE user_lack 
            SET num = num + $num
            WHERE uid = $userId
            AND bno = $bno
            AND bname = '$bname'
            "; 
            $result = $mysqliObj->query($sql);

            if (!$result){
                $res["res"] = "n";
                $res["msg"] = "添加失败";
                $mysqliObj->query("ROLLBACK");
            }
        }else {
            //不存在则增加这本书的记录
            $sql = "INSERT INTO user_lack(uid, bno, bname, num, date)
            VALUES($userId, $bno, '$bname', $num, '$date')
            ";
            $result = $mysqliObj->query($sql);

            if (!$result){
                $res["res"] = "n";
                $res["msg"] = "添加失败";
                $mysqliObj->query("ROLLBACK");
            }
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "连接数据库失败";
        $mysqliObj->query("ROLLBACK");
    }

    //添加记录之后还需要删除这些书
    $sqlDelete = "DELETE FROM trolley 
            WHERE bno = $bno
            AND uid = $userId
            AND bname = '$bname'
            ";
    $resultDelete = $mysqliObj->query($sqlDelete);

    if($resultDelete){
        $res["res"] = "y";
        $mysqliObj->query("COMMIT");
    }else {
        $res["res"] = "n";
        $res["msg"] = "连接数据库失败";
        $mysqliObj->query("ROLLBACK");
    }
}
$mysqliObj->query("END"); //结束事务


//关闭数据库连接
$mysqliObj->close();

//返回数据
echo json_encode($res);
?>