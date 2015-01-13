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

//查询购物车内容
$userId = $_POST["userId"];
$sql = "SELECT book.bno, book.bname, book.inventory, book.price, trolley.num, book.envelope 
            from trolley, book 
            where uid = '$userId'
            and book.bno = trolley.bno
            and book.bname = trolley.bname
            "; //选择trolley中当前用户的书号、书名、数量、存货
$result = $mysqliObj->query($sql);

$num_rows = $result->num_rows;
$counter = 0;
if ($result){
    $res["res"] = "y";
    $res["data"] = array();
    while($counter < $num_rows){
        $row = $result->fetch_array();
        $newRow = array(
                "bno" => $row[0],
                "bname" => $row[1],
                "inventory" => $row[2],
                "price" => $row[3],
                "num" => $row[4],
                "envelope" => $row[5]
                );
        $res["data"][$counter] = $newRow;
        $counter = $counter + 1;
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