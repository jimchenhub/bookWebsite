$(document).ready(function(){    
    //登陆注册的切换
    $("#log-sign-btn").click(function(){
        $("#log-form").animate({opacity : "0"}, "normal", "swing", function(){
            $("#sign-form").css({
                "display" : "block",
                "opacity" : "1"
            });
            $("#log-form").css("display","none");
        });
    });
    $("#sign-log-btn").click(function(){ 
        $("#sign-form").animate({opacity : "0"}, "normal", "swing", function(){
            $("#sign-form").css("display","none");
            $("#log-form").css({
                "display" : "block",
                "opacity" : "1"
            });
        });
    });

    //登陆处理
    $("#log-log-btn").click(function(){
        var email = $("#log-email").val();
        var password = $("#log-password").val();
        var emailGroup = $("#log-email").parents(".form-group");
        var passwordGroup = $("#log-password").parents(".form-group");

        //检查表格是否填写完整
        if (email == "" || email == null){
            emailGroup.addClass("has-error");
            $("#log-email").focus();
        }else if (password == "" || password == null){
            emailGroup.attr("class","form-group");

            passwordGroup.addClass("has-error");
            $("#log-password").focus();
        }else {
            emailGroup.attr("class","form-group");
            passwordGroup.attr("class","form-group");
            //开始进行登录
            $.post(
                '/bookWebsite/php/index/indexLog.php',
                {
                    email : email,
                    password : password
                },
                function (data) //回传函数
                {
                    //alert(data);
                    var datas = eval('(' + data + ')');
                    if (datas.res == "n"){
                        alert(datas.msg);
                    }else{
                        loginJump(datas.userId);
                    }
                }
            );
        }
    });

    //注册处理
    $("#sign-sign-btn").click(function(){
        var email = $("#sign-email").val();
        var name = $("#sign-name").val();
        var password = $("#sign-password").val();
        var passwordConfirm = $("#sign-password-confirm").val();

        var emailGroup = $("#sign-email").parents(".form-group");
        var nameGroup = $("#sign-name").parents(".form-group");
        var passwordGroup = $("#sign-password").parents(".form-group");
        var passwordConfirmGroup = $("#sign-password-confirm").parents(".form-group");

        //检查表格是否填写完整
        if (email == "" || email == null){
            emailGroup.addClass("has-error");
            $("#sign-email").focus();
        }else if (name == "" || name == null){
            emailGroup.attr("class","form-group");

            nameGroup.addClass("has-error");
            $("#sign-name").focus();
        }else if (password == "" || password == null){
            emailGroup.attr("class","form-group");
            nameGroup.attr("class","form-group");

            passwordGroup.addClass("has-error");
            $("#sign-password").focus();
        }else if (passwordConfirm == "" || passwordConfirm == null){
            emailGroup.attr("class","form-group");
            nameGroup.attr("class","form-group");
            passwordGroup.attr("class","form-group");

            passwordConfirmGroup.addClass("has-error");
            $("#sign-password-confirm").focus();
        }else if (password != passwordConfirm){
            emailGroup.attr("class","form-group");
            nameGroup.attr("class","form-group");
            passwordGroup.attr("class","form-group");

            passwordConfirmGroup.addClass("has-error");
            $("#sign-password-confirm").focus();
            alert("密码不统一");
        }else {
            emailGroup.attr("class","form-group");
            nameGroup.attr("class","form-group");
            passwordGroup.attr("class","form-group");
            passwordConfirmGroup.attr("class","form-group");
            //开始进行登录
            var passwordMd5 = hex_md5(password);
            $.post(
                '/bookWebsite/php/index/indexSign.php',
                {
                    email : email,
                    name : name,
                    password : passwordMd5
                },
                function (data) //回传函数
                {
                    //alert(data);
                    var datas = eval('(' + data + ')');
                    if (datas.res == "n"){
                        alert(datas.msg);
                    }else {
                        loginJump(datas.userId);
                    }
                }
            );
        }
    });    
});

//登录成功后跳转
function loginJump(userId){
    $.cookie("userId", userId, {expires:1});
    
    location.href = "/bookWebsite/html/ground.html";
}


