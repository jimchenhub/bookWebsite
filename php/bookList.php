<?php
// //引进配置文件
// require_once("./config.ini.php");
// $mysqliObj = new mysqli($dbhost,$dbuser,$dbpwd,$dbname);

// $res = array();

// if(mysqli_connect_errno()){
//     $res["res"] = "n";
//     $res["msg"] = "数据库连接错误";
//     echo json_encode($res);
//     exit();
// }
// $mysqliObj->query("set name $charName"); //设置字符集

// //查询articles
// $keyWord = $_POST["keyWord"];
// $sql = "select *
// from book,book_author,book_keyword
// where book.bno = book_author.bno
// and book.bno = book_keyword.bno
// and
// (
// book.bname like "%哈%利%"
// or book.catalog like "%哈%利%"
// or book.press like "%哈%利%"
// or book_author.author like "%哈%利%"
// or book_keyword.keyword like "%哈%利%"
// )
// ;
// ";
// $result = $mysqliObj->query($sql);

// if ($result){
//     if ($result->num_rows > 0){
//         $row =$result->fetch_array();
//         $uid = $row[0];
//         $password = $row[2];

//         if (md5($_POST["password"]) == $password){
//             $res["res"] = "y";
//             $res["userId"] = $uid;
//         }else {
//             $res["res"] = "n";
//             $res["msg"] = "密码错误";
//         }
//     }else {
//         $res["res"] = "n";
//         $res["msg"] = "没有这个用户";
//     }
// }else {
//     $res["res"] = "n";
//     $res["msg"] = "登录失败";
// }

// //关闭数据库连接
// $mysqliObj->close();

// //返回数据
// echo json_encode($res);
?>