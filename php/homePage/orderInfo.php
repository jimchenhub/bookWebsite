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
$sql = "SELECT book.bname, book.envelope, booklist.num, book_record.money, book_record.date, book_record.isDone, book_record.rno
FROM book, book_record, booklist
WHERE book.bno = booklist.bno
AND book_record.listno = booklist.listno
AND book_record.uid = $userId
ORDER BY book_record.date DESC
";
$result = $mysqliObj->query($sql);

if ($result){
    if ($result->num_rows > 0){
        $res["res"] = "y";
        $res["order"] = array();
        $i = 0;
        while ($row = $result->fetch_array()){
            $name = $row[0];
            $envelope = $row[1];
            $num = $row[2];
            $money = $row[3];
            $date = $row[4];
            $isDone = $row[5];
            $recordNo = $row[6];

            $newRow = array(
                "rno" => $recordNo,
                "name" => $name,
                "envelope" => $envelope,
                "num" => $num,
                "money" => $money,
                "date" => $date,
                "isDone" => $isDone
                );
            $res["order"][$i] = json_encode($newRow);
            $i = $i + 1;
        }
        
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有记录";
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