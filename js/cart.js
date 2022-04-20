/*
 * @Author: your name
 * @Date: 2020-07-06 10:45:06
 * @LastEditTime: 2020-07-07 08:28:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /二期项目——京东商城/js/cart.js
 */
(function() {
    // 获取数据
    var cartData = localStorage.getItem("cartData");
    try {
        cartData = JSON.parse(cartData);
    } catch (err) {
        cartData = {};
    }

    $.ajax({
            url: "/cartData",
            type: "POST",
            data: JSON.stringify(cartData),
            success: function(data) {
                try {
                    var obj = JSON.parse(data),
                        $parent = $(".tbody");
                    for (var i = 0; i < obj.length; i++) {
                        obj[i].count = cartData[obj[i].id];
                        var clone = model.clone(true);
                        innerView(clone, obj[i]);
                        $parent.append(clone);
                    }
                    updateView();
                } catch (e) {

                }
            }
        })
        // 初始化视图函数
    var model = $('<div class="list-item">\
            <div class="sel"><input type="checkbox" class="j-prosel">\
                <div class="j-img"></div>\
            </div>\
            <div class="pro j-desc"></div>\
            <div class="price">￥<span class="j-price"></span></div>\
            <div class="count">\
                <input type="button" class="j-remBtn" value="-">\
                <input type="text" class="countbar j-count">\
                <input type="button" class="j-addBtn" value="+">\
            </div>\
            <div class="total">￥<span class="j-total"></span></div>\
            <div class="oper"><a href="" class="j-del">删除</a></div>\
        </div>');
    var dataStack = [],
        jQStack = [];

    function onlyNum(e) {
        this.value = this.value.replace(/\D/g, "");
    }

    function innerView(jQ, data) {
        jQ.find(".j-desc").text(data.desc).end()
            .find(".j-count").val(data.count).on("input", onlyNum).on("blur", function() {
                data.count = +this.value || 1;
                flashData(jQ, data);
                updateView();
            }).end()
            .find(".j-img").append($("<img>").attr("src", data.src)).end()
            .find(".j-total").text((data.count * data.price).toFixed(2)).end()
            .find(".j-price").text(data.price.toFixed(2)).end()
            .find(".j-addBtn").click(function() {
                data.count++;
                flashData(jQ, data);
            }).end()
            .find(".j-remBtn").click(function() {
                data.count = data.count - 1 > 1 ? data.count - 1 : 1;
                flashData(jQ, data);
            }).end()
            .find(".j-del").click(function() {
                removeItem(jQ, data);
                return false;
            }).end()
            .find(".j-prosel").on("change", function() {
                data.select = this.checked;
                updateView();
            }).end();
        jQ.find(".j-remBtn,.j-addBtn,.j-del").click(updateView);
        data.select = false;
        dataStack.push(data);
        jQStack.push(jQ);
    }

    function flashData(jQ, data) {
        jQ.find(".j-count").val(data.count).end()
            .find(".j-total").text((data.count * data.price).toFixed(2)).end()
            .find(".j-price").text(data.price.toFixed(2));
        cartData[data.id] = data.count;
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }

    var $selcount = $("#j-selcount"),
        $count = $("#j-count"),
        $total = $("#j-global"),
        $allSel = $(".j-all-btn"),
        $list = $(".wrap .list"),
        $empty = $(".wrap .empty");

    function updateView() {
        if (!dataStack.length) {
            $list.css("display", "none");
            $empty.css("display", "block");
        } else {
            $list.css("display", "block");
            $empty.css("display", "none");
        }
        var num = 0,
            total = 0;
        $allSel.prop("checked", true);
        for (var i = 0; i < dataStack.length; i++) {
            var now = dataStack[i];
            if (now.select) {
                num++;
                total += now.price * now.count;
            } else {
                $allSel.prop("checked", false);
            }
        }
        $count.text(dataStack.length);
        $total.text(total.toFixed(2));
        $selcount.text(num);
    }

    function removeItem(jQ, data) {
        jQ.remove();
        delete cartData[data.id];
        localStorage.setItem("cartData", JSON.stringify(cartData));
        dataStack.splice(dataStack.indexOf(data), 1);
        jQStack.splice(jQStack.indexOf(jQ), 1);
    }

    function selectAll(flag) {
        for (var i = 0; i < dataStack.length; i++) {
            dataStack[i].select = flag;
            jQStack[i].find(".j-prosel").prop("checked", flag);
        }
    }

    $allSel.on("change", function() {
        selectAll(this.checked);
        updateView();
    });

    $("#j-del-sel").click(function() {
        for (var i = dataStack.length - 1; i >= 0; i--) {
            if (dataStack[i].select) {
                removeItem(jQStack[i], dataStack[i]);
            }
        }
        updateView();
        return false;
    });

    var $fixed = $("#j-fixed"),
        docEl = document.documentElement;
    $(window).on("scroll", function() {
        if ($fixed.parent().offset().top + $fixed.height() > docEl.scrollTop + docEl.clientHeight) {
            $fixed.css({
                position: "fixed",
                left: "50%",
                bottom: "0",
                transform: "translateX(-50%)"
            });
        } else {
            $fixed.css({
                position: "",
                left: "",
                bottom: "",
                transform: ""
            });
        }
    })
})();