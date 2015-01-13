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

//查询keyword
$bno = $_POST["bno"];
$bname = $_POST["bname"];
$sql = "SELECT bname, press, price, catalog, envelope, inventory, publishdate
FROM book
WHERE bno = '$bno'
AND bname = '$bname'
";
$result = $mysqliObj->query($sql);
//获取书本信息
if ($result){
    if ($result->num_rows > 0){
        $res["res"] = "y";
        $row = $result->fetch_array();
        $newBook = array(
            "bname" => $row[0],
            "press" => $row[1],
            "price" => $row[2],
            "catalog" => $row[3],
            "envelope" => $row[4],
            "inventory" => $row[5],
            "publishdate" => $row[6]
            );
        $res["book"] = $newBook;
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有找到这本书";
    }
}else {
    $res["res"] = "n";
    $res["msg"] = "数据库连接错误";
}

$sql = "SELECT author, seq
FROM book_author
WHERE bno = '$bno'
ORDER BY seq
";
$result = $mysqliObj->query($sql);
//获取作者信息
if ($result){
    if ($result->num_rows > 0){
        $res["res"] = "y";
        $counter = 0;
        while ($row = $result->fetch_array()){
            $author = array(
                "author" => $row[0],
                "seq" => $row[1]
                );
            $res["book"]["authorList"][$counter] = $author;
            $counter = $counter + 1;
        }
    }else {
        $res["res"] = "n";
        $res["msg"] = "没有找到作者";
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