/*
 * @Author: your name
 * @Date: 2020-07-03 15:25:13
 * @LastEditTime: 2020-07-06 11:34:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /二期项目——京东商城/js/register.js
 */


(function() {
    var _doc = document,
        wrap = _doc.getElementById("j-wrap"),
        input = _doc.getElementById("j-phone"),
        holder = _doc.getElementById("j-holder"),
        close = _doc.getElementById("j-close"),
        msg = _doc.getElementById("j-msg");
    input.onfocus = function() {
        wrap.className += " j-focus";
        holder.style.display = "none";
        var parent = msg.parentNode;
        if (!this.value) {
            parent.style.display = "block";
            parent.className = parent.className.replace(/\s+((j-warn)|(j-right))/g, "");
            msg.innerText = "验证完成后，你可以使用该手机登录或找回密码";
        }
    }

    input.onblur = function() {
        wrap.className = wrap.className.replace(/\s+j-focus/g, "");
        msg.parentNode.style.display = "none";
        close.style.display = "none";
        if (!input.value) {
            holder.style.display = "block";
        } else {
            result();
        }
    }

    input.oninput = function() {
        var parent = msg.parentNode;
        if (this.value) {
            close.style.display = "block";
            parent.style.display = "none";
        } else {
            close.style.display = "none";
            parent.style.display = "block";
            parent.className = parent.className.replace(/\s+((j-warn)|(j-right))/g, "");
            msg.innerText = "验证完成后，你可以使用该手机登录或找回密码";

        }
    }

    close.onclick = function() {
        this.style.display = "none";
        input.value = "";
    }

    function result(e) {
        var reg = /^0?(13|15|17|18|14|16)[0-9]{9}$/,
            parent = msg.parentNode;
        parent.className = parent.className.replace(/\s+((j-warn)|(j-right))+/g, "");
        parent.style.display = "block";
        if (!input.value) {
            parent.className += " j-warn";
            msg.innerText = "请输入手机号";
        } else if (!reg.test(input.value)) {
            parent.className += " j-warn";
            msg.innerText = "格式错误";
        } else {
            parent.className += " j-right";
            msg.innerText = "";
        }
        (window.event || e).preventDefault();
    }

    _doc.getElementById("j-nextBtn").onclick = result;
})();