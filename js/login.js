/*
 * @Author: your name
 * @Date: 2020-07-02 10:29:40
 * @LastEditTime: 2020-07-03 08:30:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /二期项目——京东商城/js/login.js
 */

// 登录方式切换
(function() {
    var btn = Array.prototype.slice.call(document.getElementsByClassName("nav")[0].getElementsByTagName("a")),
        content = document.getElementsByClassName("content")[0].children,
        index = 0;

    function func(num) {
        num = typeof num === "number" ? num : btn.indexOf(this);
        btn[index].className = "";
        content[index].style.display = "none";
        btn[num].className = "j-active";
        content[num].style.display = "";
        index = num;
    }

    for (var i = 0; i < btn.length; i++) {
        btn[i].onclick = func;
    }
    func(0);
})();

// 账号与密码验证
(function() {
    var user = document.getElementsByName("username")[0],
        pwd = document.getElementsByName("password")[0],
        arr = [user, pwd];

    function focus() {
        this.parentElement.className += " j-focus";
    }

    function blur() {
        var parent = this.parentElement,
            cName = parent.className.replace(/\sj-focus/g, "");
        parent.className = cName;
    }

    function input() {
        this.nextElementSibling.style.display = this.value ? "block" : "none";
    }

    function close() {
        this.previousElementSibling.value = "";
        this.style.display = "none";
    }

    for (var i = 0; i < arr.length; i++) {
        var now = arr[i];
        now.onfocus = focus;
        now.onblur = blur;
        now.oninput = input;
        now.nextElementSibling.onclick = close;
    }

    var msgEl = document.getElementById("j-message");

    function alertWarn(msg) {
        msgEl.innerText = msg;
        msgEl.parentElement.style.display = "block";
    }

    function submitFunc() {

    }

    function result() {
        var msg = [false, false];
        for (var i = 0; i < arr.length; i++) {
            var now = arr[i],
                parent = now.parentElement;
            if (!now.value) {
                parent.className += " j-warn";
            } else {
                parent.className = parent.className.replace(/\sj-warn/g, "");
                msg[i] = true;
            }
        }
        if (!msg[0] && !msg[1]) {
            alertWarn("请输入用户名和密码");
            user.focus();
        } else if (!msg[0]) {
            alertWarn("请输入用户名");
            user.focus();
        } else if (!msg[1]) {
            alertWarn("请输入密码");
            pwd.focus();
        } else {
            submitFunc();
            msgEl.parentElement.style.display = "none";
        }
    }

    document.getElementById("j-submit").onclick = result;
})();