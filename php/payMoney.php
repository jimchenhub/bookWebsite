<?php
ini_set('date.timezone','Asia/Shanghai'); //设置时区
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
$payMoney = $_POST["payMoney"];

$sql = "SELECT bno, bname, num
FROM trolley
WHERE uid = '$userId'
";

$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        //获取到购物车的信息
        $counter = 0;
        while ($row = $result->fetch_array()){
            $bno[$counter] = $row[0];
            $bname[$counter] = $row[1];
            $num[$counter] = $row[2];
            $counter = $counter + 1;
        }
        //获取到listno的值
        $listno;
        $resultListNo = $mysqliObj->query("SELECT listno FROM book_record ORDER BY listno DESC LIMIT 0,1");
        if ($resultListNo){
            if ($resultListNo->num_rows > 0){
                $rowListNo = $resultListNo->fetch_array();
                $listno = $rowListNo[0] + 1;
            }else {
                //如果没有信息
                $listno = 1;
            }
        }else {
            $res["res"] = "n";
            $res["msg"] = "数据库连接错误";
        }

        //接下来进行扣除款项 添加购书记录
        $sql1 = "UPDATE user_info SET money = money - $payMoney WHERE uid = '$userId' "; //扣钱
        $sqlBookList = array();
        for($i = 0 ; $i < $counter ; $i = $i +1){
            $oneBno = $bno[$i];
            $oneBname = $bname[$i];
            $oneNum = $num[$i];
            $sqlBookList[$i] = "INSERT INTO booklist(`listno`, `bno`, `bname`, `num`) VALUES($listno, $oneBno, '$oneBname', $oneNum)";
        }

        $date = date("y-m-d",time());
        $sql2 = "INSERT INTO book_record(`date`, `uid`, `money`, `listno`) VALUES('$date', '$userId', '$payMoney', '$listno')"; //添加购书记录
        $sql3 = "DELETE FROM trolley WHERE uid = '$userId'";  // 清空购物车
        $sqlSelling = array();
        for($i = 0 ; $i < $counter ; $i = $i +1){
            $oneBno = $bno[$i];
            $oneBname = $bname[$i];
            $oneNum = $num[$i];
            $sqlSelling[$i] = "UPDATE book SET selling = selling + $oneNum , inventory = inventory - $oneNum WHERE bno = $oneBno AND bname = '$oneBname'"; //添加书的销量,减少书的库存
        }

        $mysqliObj->query("BEGIN"); //事务开始

        $result1 = $mysqliObj->query($sql1);
        $resultBookList = array();
        for ($i = 0; $i < $counter; $i = $i + 1){
            $resultBookList[$i] = $mysqliObj->query($sqlBookList[$i]);
        }
        $result2 = $mysqliObj->query($sql2);
        $result3 = $mysqliObj->query($sql3);
        $resultSelling = array();
        for ($i = 0; $i < $counter; $i = $i + 1){
            $resultSelling[$i] = $mysqliObj->query($sqlSelling[$i]);
        }

        //是否全部执行正确
        $isAllOk = true;
        for ($i = 0; $i < $counter; $i = $i + 1){
            if (!$resultBookList[$i])
                $isAllOk = false;
            if (!$resultSelling[$i])
                $isAllOk = false;
        }

        //根据执行结果判断操作是否成功
        if ($result1 && $result2 && $result3 && $isAllOk){
            $mysqliObj->query("COMMIT");
            $res["res"] = "y";
        }else {
            $mysqliObj->query("ROLLBACK");
            $res["res"] = "n";
            $res["msg"] = "执行失败";
        }
        //结束事务操作
        $mysqliObj->query("END");

    }else {
        $res["res"] = "n";
        $res["msg"] = "购物车中没有货物";
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