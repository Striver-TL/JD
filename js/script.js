/*
 * @Author: Teng Long
 * @Date: 2020-06-18 15:13:36
 * @LastEditTime: 2020-07-10 08:35:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /二期项目——京东商城/js/script.js
 */
$(function() {
    var addCart = (function() {
        var $el = document.getElementsByClassName("cart-link-count")[0],
            cartData = getData();
        flashView();

        function flashView() {
            var num = 0;
            for (var key in cartData) {
                ++num;
            }
            $el.innerHTML = num;
        }

        function getData() {
            var data = localStorage.getItem("cartData");
            try {
                data = JSON.parse(data);
                return typeof data === "object" && !(data instanceof Array) ? data : {};
            } catch (e) {
                return {};
            }
        }
        return function(id) {
            cartData = getData();
            console.log(cartData);
            cartData[id] ? cartData[id]++ : cartData[id] = 1;
            flashView();
            localStorage.setItem("cartData", JSON.stringify(cartData));
        }
    })();
    //可能用到的
    var docEl = document.documentElement;
    /**
     * 
     * @param {jQuery} $parent 包含被设置了block-loading类名的元素的jQuery对象 
     * @param {String||Element||jQuery} selector 要插入图片的子选择器 
     * @param {*} finish 当图片都加载完毕时执行的函数
     */

    function blockLoading($parent, selector, finish, args) {
        var num = 0,
            $img = $parent.find(selector),
            arr = [];

        function func() {
            if (++num === $img.length) {
                for (var i = 0; i < arr.length; i++) {
                    $img.eq(i).append(arr[i]);
                }
                $parent.removeClass("block-loading");
                if (typeof finish === "function") {
                    finish.apply(finish, args instanceof Array ? args : []);
                }
            }
        }
        setTimeout(function() {
            for (var i = 0; i < $img.length; i++) {
                var item = $('<img src="' + $img.eq(i).attr("data-src") + '">').on("load", func).on("error", func);
                $img.eq(i).removeAttr("data-src");
                arr.push(item[0]);
            }
        }, 50);
    }


    /**
     * 
     * @param {jQuery} $el 需要参照的包含指定位置元素的jQuery对象
     * @param {Function} func 当滚动到指定元素位置时执行的函数
     */
    var lazyLoading = (function() {
        var $els = $(),
            funcStack = [],
            timer = null;

        function wrap() {
            clearTimeout(timer);
            for (var i = 0; i < $els.length; i++) {
                var elY = $els.eq(i).offset().top,
                    docY = docEl.scrollTop || document.body.scrollTop;
                if (docEl.clientHeight + docY > elY && docY < elY + $els.eq(i).height()) {
                    funcStack[i]();
                    funcStack.splice(i, 1);
                    Array.prototype.splice.call($els, i, 1);
                }
            }
            timer = setTimeout(wrap, 50);
        }
        wrap();
        return function($el, func) {
            Array.prototype.push.call($els, $el[0]);
            funcStack.push(func);
        }
    })();
    /**
     * 
     * @param {Object} option 传入选项对象包含参数：func 延迟已过执行的函数 timeLong 延迟时长 delay 经过多长时间在设置延时
     */
    function delayFunc(option) {
        var status = false,
            timer, timer1;

        function wrap() {
            var parm = arguments;
            if (status) {
                return false;
            }
            wrap.status = true;
            timer = wrap.timer = setTimeout(function() {
                clearTimeout(timer);
                status = true;
                option.func.apply(option, parm);
                timer1 = wrap.timer1 = setTimeout(function() {
                    clearTimeout(timer1);
                    status = false;
                    wrap.status = false;
                }, option.timeLong)
            }, option.delay ? option.delay : 0);
            return true;
        }
        return wrap;
    }
    //  网站位置

    (function() {
        var view = document.getElementById("j-place-view"),
            $content = $(".site-place .top-son");
        $content.parent().on("mouseenter", function() {
            $content.show();
        });
        $content.on("click", "#j-place-btn a", function() {
            view.innerText = this.innerText;
            $content.hide();
            return false;
        });
    })();

    //  网站顶部内容区显示

    (function() {
        var showStack = [
            // 网站位置块内容结构
            '<div><ul class="f-clear" id="j-place-btn"><li><a href="">北京</a></li><li><a href="">上海</a></li><li><a href="">天津</a></li><li><a href="">重庆</a></li><li><a href="">河北</a></li><li><a href="">山西</a></li><li><a href="">河南</a></li><li><a href="">辽宁</a></li><li><a href="">吉林</a></li><li><a href="">黑龙江</a></li><li><a href="">内蒙古</a></li><li><a href="">江苏</a></li><li><a href="">山东</a></li><li><a href="">安徽</a></li><li><a href="">浙江</a></li><li><a href="">福建</a></li><li><a href="">湖北</a></li><li><a href="">湖南</a></li><li><a href="">广东</a></li><li><a href="">广西</a></li><li><a href="">江西</a></li><li><a href="">四川</a></li><li><a href="">贵州</a></li><li><a href="">海南</a></li><li><a href="">云南</a></li><li><a href="">西藏</a></li><li><a href="">陕西</a></li><li><a href="">甘肃</a></li><li><a href="">青海</a></li><li><a href="">宁夏</a></li><li><a href="">新疆</a></li><li><a href="">港澳</a></li><li><a href="">台湾</a></li><li><a href="">钓鱼岛</a></li><li><a href="">海外</a></li></div>',
            // 我的京东块内容结构
            '<div class="minejd-son-con f-clear"><span><a href="">待处理订单</a></span><span><a href="">消息</a></span><span><a href="">返修退换货</a></span><span><a href="">我的问答</a></span><span><a href="">降价商品</a></span><span><a href="">我的关注</a></span></div><div class="minejd-son-con f-clear"><span><a href="">我的京豆</a></span><span><a href="">我的优惠券</a></span><span><a href="">我的白条</a></span><span><a href="">我的理财</a></span></div>',
            // 企业采购块内容结构
            '<div class="qiye-son-con f-clear"><span><a href="">企业购</a></span><span><a href="">商用场景馆</a></span><span><a href="">工业品</a></span><span><a href="">礼品卡</a></span><span><a href="">丰客多商城</a></span></div>',
            //  客户服务块内容结构
            '<div class="client-son-con f-clear"><p class="son-title">客户</p><span><a href="">帮助中心</a></span><span><a href="">售后服务</a></span><span><a href="">在线客服</a></span><span><a href="">意见建议</a></span><span><a href="">电话客服</a></span><span><a href="">客服邮箱</a></span><span><a href="">金融咨询</a></span><span><a href="">全球售客服</a></span></div><div class="client-son-con f-clear"><p class="son-title">商户</p><span><a href="">合作招商</a></span><span><a href="">成长中心</a></span><span><a href="">商家后台</a></span><span><a href="">京麦工作室</a></span><span><a href="">商家帮助</a></span><span><a href="">规则平台</a></span></div>',
            // 网站导航内容块结构
            '<div class="sitenav-son-con f-left"><p class="son-title">特色主题</p><span><a href="">新品首发</a></span><span><a href="">京东金融</a></span><span><a href="">全球售</a></span><span><a href="">国际站</a></span><span><a href="">京东会员</a></span><span><a href="">京东预售</a></span><span><a href="">台湾售</a></span><span><a href="">俄语站</a></span><span><a href="">装机大师</a></span><span><a href="">0元评测</a></span><span><a href="">港澳售</a></span><span><a href="">优惠券</a></span><span><a href="">秒杀</a></span><span><a href="">闪购</a></span><span><a href="">印尼站</a></span><span><a href="">京东金融科技</a></span><span><a href="">陪伴计划</a></span><span><a href="">山海招商</a></span><span><a href="">拍拍二手</a></span><span><a href="">买什么</a></span></div><div class="sitenav-son-con f-left"><p class="son-title">行业频道</p><span><a href="">手机</a></span><span><a href="">智能数码</a></span><span><a href="">玩3C</a></span><span><a href="">电脑办公</a></span><span><a href="">家用电器</a></span><span><a href="">京鱼座智能</a></span><span><a href="">京东服饰</a></span><span><a href="">京东生鲜</a></span><span><a href="">家装城</a></span><span><a href="">母婴</a></span><span><a href="">食品</a></span><span><a href="">农资频道</a></span><span><a href="">整车</a></span><span><a href="">图书</a></span><span><a href="">劳动防护</a></span></div><div class="sitenav-son-con f-left"><p class="son-title">生活服务</p><span><a href="">京东众筹</a></span><span><a href="">白条</a></span><span><a href="">京东金融App</a></span><span><a href="">京东小金库</a></span><span><a href="">理财</a></span><span><a href="">话费</a></span><span><a href="">水电煤</a></span><span><a href="">彩票</a></span><span><a href="">旅行</a></span><span><a href="">机票酒店</a></span><span><a href="">电影票</a></span><span><a href="">京东到家</a></span><span><a href="">游戏</a></span><span><a href="">拍拍回收</a></span></div><div class="sitenav-son-con f-left"><p class="son-title">更多精选</p><span><a href="">合作招商</a></span><span><a href="">京东通信</a></span><span><a href="">京东E卡</a></span><span><a href="">企业采购</a></span><span><a href="">服务市场</a></span><span><a href="">办公生活馆</a></span><span><a href="">校园加盟</a></span><span><a href="">京东社区</a></span><span><a href="">游戏社区</a></span><span><a href="">知识产权维权</a></span></div>'
        ];
        var $parent = $(".top-parent");
        $parent.one("mouseenter", function() {
            var data = showStack[$parent.index(this)];
            if (data) {
                var $this = $(this);
                $this.find(".top-son").append(data);
                $this.find(".top-loading").remove();
            }
        });
    })();

    // 网页logo
    (function() {
        var $logo = $(".logo"),
            $jd = $logo.find(".logo-jd"),
            $joy = $logo.find(".logo-joy"),
            src = $joy.find("img").attr("src");
        // timer用于储存延迟淡出计时器标记
        // timer1用于储存已经显示时长定时器标记
        // timer2用于储存延迟执行淡入计时器标记
        var timer = null,
            timer1 = null,
            timer2 = null,
            num = 0;
        $logo.hover(function() {
            // 清除延迟淡出计时器避免悬停状态淡出
            clearTimeout(timer);
            // 设置延迟300毫秒后执行
            // 300毫秒内鼠标移出不执行
            timer2 = setTimeout(function() {
                var $img = $joy.show().find("img");
                $jd.hide();
                if ($img.attr("src") !== src) {
                    $img.attr("src", src);
                };
                // 如果不存在累加定时器
                // 创建累加定时器
                if (!timer1) {
                    timer1 = setInterval(function() {
                        num += 100;
                    }, 100);
                }
            }, 500);
        }, function() {
            // 取消悬停执行的代码
            clearTimeout(timer2);
            timer2 = null;
            // 执行淡出函数
            fadeOut();
        });

        // logo淡出函数

        function fadeOut() {
            // 当动画完成后执行
            timer = setTimeout(function() {
                // 动画没有播放跳出函数
                if (!timer1) {
                    return false;
                }
                $jd.fadeIn("slow");
                $joy.fadeOut("slow", function() {
                    $joy.find("img").removeAttr("src");
                });
                // 清除记录动画已播时间计时器
                clearInterval(timer1);
                timer1 = null;
                num = 0;
            }, (3500 - num > 0 ? 3500 - num : 0) + 1000);
        }
        $logo.trigger("mouseenter");
        fadeOut();
    })();

    function HoverTimer(option) {
        this.$el = option.$el;
        this.func = option.func;
        this.index = 0;
        this.timeLong = option.timeLong;
        var _this = this;
        this.$el.hover(function() {
            _this.removeTimer();
        }, function() {
            _this.setTimer();
        });
    }

    HoverTimer.prototype.setTimer = function() {
        if (!this.timer) {
            var _this = this;
            this.timer = setInterval(function() {
                _this.func();
            }, this.timeLong);
        }
    };
    HoverTimer.prototype.removeTimer = function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
    (function() {
        var data = [{
            text: "九块九包邮",
            href: ""
        }, {
            text: "满199减100",
            href: ""
        }, {
            text: "购机享优惠",
            href: ""
        }];
        var dynaLink = new HoverTimer({
            $el: $("#dyna-link"),
            func: function() {
                var obj = data[this.index];
                this.$el
                    .attr("href", obj.href)
                    .text(obj.text);
                this.index = (this.index + 1) % data.length;
            },
            timeLong: 3000
        });
        dynaLink.func();
        dynaLink.setTimer();
    }());

    // 搜索框
    (function() {
        var $seachbar = $(".seachbar"),
            $input = $seachbar.find("input"),
            $holder = $seachbar.find(".seachbar-placeholder");
        var valStack = ["华为平板电脑", "女士T恤", "外星人笔记本", "oppo手机", "九阳豆浆机", "苏泊尔电磁炉", "烧烤炉", "九牧马桶", "卷纸"];
        valStack.sort(function() {
            return Math.random() - 0.5;
        });
        var index = 0,
            timer = null;

        function change() {
            $holder.text(valStack[index]);
            index = (index + 1) % valStack.length;
        }

        $input.on("focus", function() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            $holder.css("color", "#ccc");
        }).on("blur", function() {
            if (!timer) {
                timer = setInterval(change, 5000);
            }
            $holder.css("color", "");
        }).on("keydown", function(event) {
            if (event.keyCode === 13) {
                $input.val($holder.hide().text());
            }
        }).on("input", function() {
            this.value ? $holder.hide() : $holder.show();
        });
        change();
        timer = setInterval(change, 5000);
    })();

    // category部分
    (function() {
        var $window = $(window);
        var $category = $(".category"),
            $content = $(".category-content"),
            $li = $(".category>ul>li"),
            num = 0;
        $li.one("mouseenter", function() {
            $.ajax({
                url: "/categoryData",
                type: "POST",
                data: $li.index(this).toString(),
                success: function(data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = null;
                    }
                    if (data) {
                        var finish = 0,
                            imgArr = data.match(/<img[^>]+>/g),
                            item = $content.eq(this.data);
                        for (var i = 0; i < imgArr.length; i++) {
                            $(imgArr[i]).on("load", function() {
                                if (++finish === imgArr.length) {
                                    var $fragment = $(document.createDocumentFragment());
                                    $fragment.append($(data));
                                    item.append($fragment)
                                    item.find(".category-loading").remove();
                                }
                            })
                        }
                    }
                }
            })
        });

        $li
            .on("mouseenter", toFollow)
            .on("mouseenter", function() {
                $window.on("scroll", toFollow);
            })
            .on("mouseleave", function() {
                $window.off("scroll", toFollow);
            });

        function toFollow() {
            num = (docEl.scrollTop || document.body.scrollTop) - $category.offset().top;
            if (num < 0) {
                num = 0;
            }
            $content.css("top", num + "px");
        }

    })();

    // 主轮播图部分
    var $slideshow = $(".slideshow");
    blockLoading($slideshow, "a", function() {
        createSlideshow({
            $stop: $slideshow,
            $content: $(".slideshow li"),
            $btn: $(".slideshow-btn span"),
            $sideBtn: $(".slideshow button"),
            longer: 3000
        });
    });
    blockLoading($(".side-slideshow"), "a", function() {
        createSlideshow({
            $stop: $(".side-slideshow a"),
            $content: $(".side-slideshow div:not(.slideshow-sidebtn)"),
            $sideBtn: $(".side-slideshow .slideshow-sidebtn button"),
            longer: 9000
        });
    });

    function createSlideshow(option) {
        var obj = new HoverTimer({
            $el: option.$stop,
            func: toNext,
            timeLong: option.longer
        });

        function wrap(index) {
            var num = obj.index;
            if (option.$btn) {
                option.$btn.eq(num).removeClass("show").end().eq(index).addClass("show");
            }
            option.$content.eq(num).fadeOut(300).end().eq(obj.index = index).fadeIn(300);
        }
        var toFade = delayFunc({
            func: wrap,
            timeLong: 300
        });
        toFade(0);
        obj.setTimer();
        if (typeof option.$btn === "object") {
            option.$btn.on("mouseenter", function() {
                var _index = option.$btn.index(this);
                if (obj.index !== _index) {
                    wrap(_index);
                }
            });
        }
        $(option.$sideBtn[0]).click(function() {
            toFade(obj.index > 0 ? obj.index - 1 : option.$content.length - 1);
        });

        $(option.$sideBtn[1]).click(toNext);

        function toNext() {
            toFade((obj.index + 1) % option.$content.length);
        }
    }

    (function() {
        var data = null,
            timeReg = /^(?=\d$)/;
        // 秒杀计时部分
        (function() {
            var hourEl = document.getElementById("j-hour"),
                minuteEl = document.getElementById("j-minute"),
                secondEl = document.getElementById("j-second");

            var hour, minute, second;

            function getNowKill() {
                var endArr = [0, 8, 14, 20, 24],
                    date = new Date(),
                    hour = date.getHours();
                for (var i = 0; i < endArr.length - 1; i++) {
                    if (hour >= endArr[i] && hour < endArr[i + 1]) {
                        hour = endArr[i];
                        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endArr[i + 1], 0, 0).getTime();
                    }
                }
                $.ajax({
                    type: "POST",
                    url: "/seckillData",
                    data: endArr.indexOf(hour).toString(),
                    success: function(d) {
                        data = JSON.parse(d);
                        flashEle();
                        lazyLoading($parent, innerView);
                    }
                });
                document.getElementById("j-now").innerText = (hour + "").replace(timeReg, "0") + ":00";
                return endTime;
            }
            var endTime = getNowKill();
            flashTime();
            setInterval(flashTime, 100);

            function flashTime() {
                var resTime = endTime - (new Date().getTime()),
                    timeReg = /^(?=\d$)/;
                if (resTime > 0) {
                    var s = (parseInt(resTime / 1000) % 60).toString(),
                        m = (parseInt(resTime / 60000) % 60).toString(),
                        h = (parseInt(resTime / 3600000) % 24).toString();
                    if (s !== second) {
                        second = s;
                        secondEl.innerText = s.replace(timeReg, "0");
                        if (m !== minute) {
                            minute = m;
                            minuteEl.innerText = m.replace(timeReg, "0");
                            if (h !== hour) {
                                hour = h;
                                hourEl.innerText = h.replace(timeReg, "0");
                            }
                        }
                    }
                } else {
                    endTime = getNowKill();
                }
            }
        })();
        // 秒杀内容部分
        var $li = $(".seckill-content li"),
            $parent = $(".seckill-content ul"),
            width = $parent.width(),
            max = 0,
            index = 0,
            before = $(),
            after = $(),
            model = $(".seckill-content li:eq(0)");

        function flashEle() {
            $(".main-seckill").addClass("block-loading");
            before.remove();
            after.remove();
            var $fragment = $(document.createDocumentFragment());
            for (var i = 0; i < data.length; i++) {
                if (i >= $li.length) {
                    var $clone = model.clone(true);
                    $clone.find(".img").attr("data-src", data[i].src);
                    $fragment.append($clone);
                } else {
                    $li.eq(i).find(".img").attr("data-src", data[i].src);
                    $li.eq(i).find(".msg,.img,.price-new,.price-old").text("");
                }
            }
            $parent.append($fragment);
            $li = $(".seckill-content li");
        }

        function innerView() {
            blockLoading($(".main-seckill"), ".img", function() {
                for (var i = 0; i < $li.length; i++) {
                    var $a = $li.eq(i),
                        obj = data[i];
                    $a.find("a").attr("href", obj.href);
                    $a.find(".msg").text(obj.message);
                    $a.find(".price-new").text(obj.newPrice.toFixed(2));
                    $a.find(".price-old").text(obj.oldPrice.toFixed(2));
                }
                max = Math.ceil($li.length / 4);
                before = $li.filter(":lt(4)").clone(true);
                after = $li.filter(":gt(" + -(5 - data.length) + ")").clone(true);
                $parent.append(before);
                $parent.prepend(after);
            });
        }
        var $sideBtn = $(".main-seckill .slideshow-sidebtn button");
        $($sideBtn[0]).click(function() {
            if (toMove.status) {
                return false;
            }
            index = index > 0 ? index - 1 : max - 1;
            goBack(-1);
            toMove();
        });

        $($sideBtn[1]).click(function() {
            if (toMove.status) {
                return false;
            }
            index = (index + 1) % max;
            goBack(1);
            toMove();
        });

        function goBack(num) {
            var parent = $parent[0];
            if (index === 0 && num === 1) {
                parent.style.transition = "none";
                parent.style.left = "0";
            } else if (index === max - 1 && num === -1) {
                parent.style.transition = "none";
                parent.style.left = -(max + 1) * width + "px";
            }
        }

        var toMove = delayFunc({
            func: function() {
                $parent.css({
                    transition: "",
                    left: -(index + 1) * width + "px"
                });
            },
            delay: 100,
            timeLong: 600
        });
    })();

    // 秒杀侧边
    (function() {
        var $side = $(".seckill-side>div:first"),
            $btn = $(".seckill-btn span"),
            index = 0;
        var wrap = delayFunc({
            func: function(num) {
                $btn.eq(index).removeClass("active");
                $btn.eq(num).addClass("active");
                $side.css("transform", "translate(-" + (num + 1) * 200 + "px)");
                index = num;
                $side.css("transition", "");
            },
            delay: 100,
            timelonger: 500
        });
        $btn.hover(function() {
            wrap($btn.index($(this)));
        }, function() {
            clearTimeout(wrap.timer);
        });
        setInterval(function() {
            if (index === $btn.length - 1) {
                $side.css("transition", "none").css("transform", "translate(0)");
            }
            wrap((index + 1) % $btn.length)
        }, 3000);
        wrap(0);
    })();

    // 特价部分
    (function() {
        var _wrap = ".main-feature",
            _content = ".spec-content",
            _img = ".spec-img",
            _actClass = "active",
            _load = "unload";
        var specData = [],
            content = $(_content),
            clone = content.clone(true),
            $a = $(_wrap).find(".spec-nav li");
        lazyLoading($(_wrap), function() {
            $a.one("mouseenter", function() {
                var _this = this;
                $.ajax({
                    url: "/specialData",
                    type: "POST",
                    data: $a.index(_this).toString(),
                    success: function(data) {
                        var index = $(_this).index();
                        specData[this.data] = JSON.parse(data);
                        for (var i = content.length; i <= index; i++) {
                            clone.clone(true).insertAfter(content.filter(":last"));
                            content = $(_content);
                        }
                        reset(index);
                        var nowContent = $(_content).eq(index);
                        nowContent.addClass(_load);
                        if (index > 0) {
                            setTimeout(function() {
                                blockLoading(nowContent, _img, function() {
                                    nowContent.removeClass(_load);
                                });
                            }, 100);
                        } else {
                            blockLoading($(_wrap), _img, function() {
                                nowContent.removeClass(_load);
                            });
                        }
                        $a.eq(index).mouseenter(function() {
                            $a.removeClass(_actClass)
                                .eq(index).addClass(_actClass);
                            $(_content).hide().eq(index).show();
                        }).mouseenter();
                    }
                });
            }).eq(0).trigger("mouseenter");
            blockLoading($(_wrap), ".ifl-img");
        });

        function reset(num) {
            var data = specData[num],
                clone = $(_content).eq(num),
                $link = clone.find("a");
            for (var j = 0; j < data.length; j++) {
                var $now = $link.eq(j),
                    now = data[j];
                $now
                    .attr("href", now.href)
                    .find(_img)
                    .attr("data-src", now.src)
                    .end()
                    .find(".spec-msg")
                    .text(now.msg)
                    .end()
                    .find(".p-new")
                    .text(now.newPrice)
                    .end()
                    .find(".p-old")
                    .text(now.oldPrice);
                if (now.emMsg) {
                    $now.find(".spec-emmsg").text(now.emMsg);
                }
            }
            $link.find(".spec-emmsg:empty").remove();
        }
    })();

    // 发现好货部分
    (function() {
        var $parent = $(".main-find");
        lazyLoading($parent, function() {
            blockLoading($parent, ".find-img", function() {
                var $content = $(".find-content"),
                    $ul = $content.find("ul"),
                    ul = $ul[0],
                    $btn = $content.find(".find-btn"),
                    lWidth = $btn.parent().width() - $btn.width(),
                    bWidth = $btn.width() / 2,
                    width = $ul.width() - $ul.find("li:eq(0)").outerWidth(true) * 5,
                    longer = 15,
                    speed = 0.5,
                    flag = false;
                $content.hover(function() {
                    flag = true;
                }, function() {
                    flag = false;
                })
                $ul.find("li:lt(5)").clone(true).appendTo($ul);
                var obj = new HoverTimer({
                    $el: $content,
                    timeLong: 5,
                    func: function() {
                        longer = longer <= -width + speed ? 0 : longer - speed;
                        ul.style.left = longer + "px";
                        $btn.css("left", -longer / width * lWidth);
                    }
                });

                function moveFunc(e) {
                    var x = e.clientX - $content.offset().left - bWidth,
                        ratio = x / lWidth;
                    if (x <= 0 || x >= lWidth) {
                        return false;
                    }
                    $btn.css("left", x + "px");
                    longer = -(ratio * width);
                    ul.style.left = longer + "px";
                    return false;
                }
                var fn = obj.setTimer;

                function reset() {
                    $(document)
                        .off("mousemove", moveFunc)
                        .off("mouseup");
                    $content.removeClass("active");
                    obj.setTimer = fn;
                }
                $btn.on("mousedown", function() {
                    obj.removeTimer();
                    obj.setTimer = new Function();
                    $content.addClass("active");
                    $btn.on("mouseup", function() {
                        reset();
                        return false;
                    });
                    $(document)
                        .on("mousemove", moveFunc)
                        .on("mouseup", function() {
                            reset();
                            if (!flag) {
                                obj.setTimer();
                            }
                        });
                });
                obj.setTimer();
            });
        });
    })();
    (function() {
        // 特色优选
        var $wrap = $(".main-feaselect"),
            funcStack = [];
        lazyLoading($wrap, func);

        function func() {
            for (var i = 0; i < funcStack.length; i++) {
                var now = funcStack[i];
                if (typeof now === "function") {
                    now();
                }
            }
        }
        //新品首发部分
        funcStack.push(function() {
            var tagArr = [
                '<a href=""><div class="new-link"><div class="sel-img" data-src="./images/6250131aeadb5c7f.jpg"></div></div><div class="new-name"><span>三星 Galaxy Z Flip（SM-F7000） 超感官灵动折叠屏 8GB+256GB 潘多拉紫</span></div><div class="new-desc"><span>三星折叠屏手机</span></div><div class="new-price"><span>11999.00起</span></div></a>',
                '<a href=""><div class="new-link"><div class="sel-img" data-src="./images/06c3af00f8a958a4.jpg"></div></div><div class="new-name"><span>完美日记（PERFECT DIARY）探险家十二色眼影盘 08 小狗 粉质细腻易上色 持妆不飞粉 新手日常百搭 14g</span></div><div class="new-desc"><span>来这里发现更多新品</span></div><div class="new-price"><span>119.90起</span></div></a>',
                '<a href=""><div class="new-link"><div class="sel-img" data-src="./images/3c9de3d64c7709c4.jpg"></div></div><div class="new-name"><span>兰芝（LANEIGE）紫米礼盒（雪纱丝柔隔离30ml+隔离10ml*3+紫米美妆蛋+人形立牌）</span></div><div class="new-desc"><span>来这里发现更多新品</span></div><div class="new-price"><span>265.00起</span></div></a>',
                '<a href=""><div class="new-link"><div href="" class="sel-img" data-src="./images/1174fcdfb10d21a7.jpg"></div></div><div class="new-name "><span>搜狗Sogou AI智能录音笔S1 多语言翻译机 终身免费转写 录音转文字8麦拾音 高清降噪 64G+云存储 灰色</span></div><div class="new-desc "><span>来这里发现更多新品</span></div><div class="new-price "><span>2698.00起</span></div></a>'
            ];
            var $ul = $(".sli-content ul").empty(),
                $li = $();
            for (var i = 0; i < tagArr.length; i++) {
                var now = $("<li>").html(tagArr[i]);
                $ul.append(now);
                Array.prototype.push.call($li, now[0]);
            }
            blockLoading($(".sel-new"), ".sel-img", function() {
                $ul.empty();
                var index = 0,
                    $btn = $(".sel-new .slideshow-sidebtn button");
                $($btn[0]).on("click", toPrev);
                $($btn[1]).on("click", toNext);
                var next = delayFunc({
                    timeLong: 700,
                    func: function(num) {
                        if (num === -1) {
                            index = index - 1 >= 0 ? index - 1 : $li.length - 1;
                            $ul.find("li:last").remove();
                            $li.eq(index - 2 >= 0 ? index - 2 : $li.length - 2 + index).clone(true).prependTo($ul);
                        } else if (num === 1) {
                            index = (index + 1) % $li.length;
                            $ul.find("li:first").remove();
                            $li.eq(index + 2 < $li.length ? index + 2 : (index + 2) % $li.length).clone(true).appendTo($ul);
                        } else {
                            return false;
                        }
                    },
                    delay: 100
                });
                reset();
                setInterval(toNext, 3000);

                function toNext() {
                    if (next.stauts) {
                        return false;
                    }
                    next(1);
                }

                function toPrev() {
                    if (next.status) {
                        return false;
                    }
                    next(-1);
                }

                function reset() {
                    var center = $li.eq(0).clone(true);
                    $ul
                        .append($li.eq($li.length - 2).clone(true))
                        .append($li.eq($li.length - 1).clone(true))
                        .append(center)
                        .append($li.eq(1).clone(true))
                        .append($li.eq(2).clone(true));
                }
            });
        });

        // 排行榜部分
        funcStack.push((function() {
            return function() {
                var $btn = $(".sen-nav li"),
                    $parent = $(".sen-list"),
                    $content = $parent.find("ul").remove(),
                    $allUl = $();
                var conData = [];
                $btn.one("mouseenter", show);
                $btn.on("mouseenter", function() {
                    var index = $btn.index(this),
                        now = $allUl.eq(index);
                    $btn.removeClass("j-active");
                    if (!now.filter(":visible").length) {
                        $allUl.not().hide().eq(index).show();
                    }
                    $(this).addClass("j-active");
                }).eq(0).trigger("mouseenter");

                function show() {
                    $.ajax({
                        type: "POST",
                        url: "/senData",
                        data: $btn.index(this).toString(),
                        success: function(data) {
                            conData[this.data] = JSON.parse(data);
                            for (var i = $allUl.length; i <= this.data; i++) {
                                Array.prototype.push.call($allUl, $content.clone(true).hide().appendTo($parent)[0]);
                            }
                            innerView(+this.data);
                            var $ul = $allUl.eq(this.data);
                            $ul
                                .parent()
                                .addClass("unload")
                                .end()
                                .show();
                            blockLoading($ul, ".sen-img", function() {
                                $(".sel-sen").removeClass("block-loading");
                                $ul.parent().removeClass("unload");
                            });
                        }
                    });
                }

                function innerView(num) {
                    var data = conData[num],
                        $ul = $allUl.eq(num),
                        $li = $ul.find("li");
                    for (var i = 0; i < $li.length; i++) {
                        var obj = data[i],
                            now = $li.eq(i);
                        now
                            .find("a")
                            .attr("href", obj.href)
                            .end()
                            .find(".sen-img")
                            .attr("data-src", obj.src)
                            .end()
                            .find(".sen-desc")
                            .text(obj.desc);
                    }
                }
            };
        })());

        // 逛好店部分
        funcStack.push(function() {
            var $div = $(".sel-pla"),
                $content = $div.find(".pla-content");
            $content.html('<a href=" "><span class="pla-img" data-src="./images/dbe080c29fb0aeff.jpg"></span><span class="pla-desc">华为京东自营官方旗舰店</span><span><em class="pla-red">自营</em><em class="pla-blue">潮流3C</em></span><span class="pla-atten">3804.3万人关注</span></a><a href=" "><span class="pla-img" data-src="./images/5f841e61938d8184.jpg"></span><span class="pla-desc">君乐宝京东自营旗舰店</span><span><em class="pla-red">自营</em><em class="pla-blue">育儿心经</em></span><span class="pla-atten">240.0万人关注</span></a>');
            blockLoading($div, ".pla-img");
        });

        //领劵中心部分
        funcStack.push(function() {
            var $div = $(".sel-hold"),
                $content = $div.find(".hold-content");
            $content.html('<a href=""><span class="hold-img" data-src="./images/a207e9209b702c29.jpg"></span><span class="hold-price">300</span><span class="hold-msg">满2880元可用</span><span class="hold-desc" title="仅可购买京东自营荣耀手机部分商品">仅可购买京东自营荣耀手机部分商品</span><span class="hold-more">更多好券<i class="iconfont"></i></span></a><a href=""><span class="hold-img" data-src="./images/8f78feb28f3d7955.jpg"></span><span class="hold-price">5</span><span class="hold-msg">满99元可用</span><span class="hold-desc" title="仅可购买食品饮料部分商品">仅可购买食品饮料部分商品</span><span class="hold-more">更多好券<i class="iconfont"></i></span></a><a href=""><span class="hold-img" data-src="./images/2b0a808a4510de1b.jpg"></span><span class="hold-price">100</span><span class="hold-msg">满880元可用</span><span class="hold-desc" title="仅可购买京东自营手机部分商品">仅可购买京东自营手机部分商品</span><span class="hold-more">更多好券<i class="iconfont"></i></span></a>')
            blockLoading($div, ".hold-img");
        });
    })();
    // 频道广场部分
    (function() {
        var $wrap = $(".main-square");
        lazyLoading($wrap, function() {
            blockLoading($wrap, ".squ-img");
        });
    })();
    // 为你推荐部分
    (function() {
        var $wrap = $(".main-recom"),
            $parent = $(".rec-parent"),
            $btn = $(".rec-nav a");
        lazyLoading($wrap, function() {
            var $content = $(".rec-content"),
                $list = $(".rec-list").remove(),
                nowData,
                nowContent;
            $content.remove();
            var data = [];

            function oneFunc() {
                var $this = $(this);
                $.ajax({
                    type: "POST",
                    url: "/productData",
                    data: $btn.index(this).toString(),
                    success: function(d) {
                        data[this.data] = JSON.parse(d).sort(function() {
                            return Math.random() - 0.5;
                        });
                        clickFunc.call($this[0]);
                        $this.click(clickFunc);
                        flashData(function() {
                            $wrap.removeClass("block-loading");
                        });
                    }
                });
            }

            function clickFunc() {
                var $this = $(this),
                    index = $btn.index(this);
                window.scrollTo(0, $wrap.offset().top);
                if ($this.hasClass("j-active")) {
                    return false;
                }
                var $window = $(window);
                $window.off("scroll", scrollFunc);
                nowData = data[index] ? data[index] : [];
                nowContent = $(".rec-content").hide().eq(index).show();
                $btn.removeClass("j-active");
                $this.addClass("j-active");
                $window.on("scroll", scrollFunc);
            }
            for (var i = 0; i < $btn.length; i++) {
                $content.clone(true).hide().appendTo($parent);
            }
            $btn.one("click", oneFunc);
            $btn.eq(0).trigger("click");

            function flashData() {
                innerView($list.clone(true).appendTo(nowContent), nowData.splice(0, 15), arguments[0]);
            }

            var $recMore = $(".rec-more-loading").hide();

            function scrollFunc() {
                if ((docEl.scrollTop || document.body.scrollTop) + docEl.clientHeight >= $wrap.offset().top + $wrap.innerHeight()) {
                    $(this).off("scroll", scrollFunc);
                    var data = nowData.splice(0, 15);
                    if (data.length < 15) {
                        return false;
                    }
                    $recMore.show();
                    setTimeout(function() {
                        innerView($list.clone(true).appendTo(nowContent), data, function() {
                            $(this).on("scroll", scrollFunc);
                            $recMore.hide();
                        });
                    }, 150);
                }
            }
        });

        function btnClick(e) {
            addCart(this.jdProId);
            e.stopPropagation();
            return false;
        }

        function noLink(e) {
            if (e.target === $(this).find(".rec-btn")[0]) {
                e.preventDefault();
                return false;
            }
        }

        function innerView(jQ, data, func) {
            if (!data || data.length < 15) {
                return false;
            }
            jQ.children().each(function() {
                var $this = $(this),
                    index = $this.index(),
                    now = data[index],
                    price = now.price.toFixed(2).split(".");
                $this
                    .on("click", noLink)
                    .attr("href", now.href)
                    .attr("title", now.desc)
                    .find(".rec-desc")
                    .children()
                    .text(now.desc)
                    .end()
                    .end()
                    .find(".rec-img")
                    .attr("data-src", now.src)
                    .end()
                    .find(".rec-big")
                    .text(price[0] + ".")
                    .end()
                    .find(".rec-small")
                    .text(price[1]);
                $this
                    .find(".rec-btn")
                    .prop("jdProId", now.id)
                    .on("click", btnClick);
                if (now.self) {
                    $this.find(".rec-desc").addClass("rec-self");
                }
                if (now.fullCunt) {
                    $this.find(".rec-price").addClass("rec-fullcunt");
                }
                if (now.roll) {
                    $this.find(".rec-price").addClass("rec-roll");
                }
                if (now.global) {
                    $this.find(".rec-desc").addClass("rec-global");
                }
                if (now.plus) {
                    $this
                        .find(".rec-price")
                        .append($('<span></span>').addClass("rec-plus").text(now.plus.toFixed(2)));
                }
            });
            blockLoading(jQ, ".rec-img", typeof func === "function" ? func : undefined);
        }
    })();

    var createScroll = (function() {
        var $elStack = [];
        $(window).on("scroll", function() {
            var top = (docEl.scrollTop || document.body.scrollTop);
            for (var i = 0; i < $elStack.length; i++) {
                var now = $elStack[i],
                    y = now.$el.offset().top;
                if (!now.status && top > y) {
                    now.func1();
                    now.status = true;
                } else if (now.status && top <= y) {
                    now.func2();
                    now.status = false;
                }
            }
        });
        return function($el, func1, func2) {
            $elStack.push({
                $el: $el,
                func1: func1,
                func2: func2,
                status: false
            });
        }
    })();

    // 楼层导航
    (function() {
        var $floor = $(".main-floor"),
            $back = $("#floor-top").hide(),
            $btn = $floor.find("li:nth-child(-n+4) a"),
            $content = $(".main-seckill, .main-feature, .main-square, .main-recom");
        $back.click(function() {
            $(docEl).animate({
                scrollTop: 0
            }, 500);
            return false;
        });
        $btn.click(function(e) {
            $(docEl).animate({
                scrollTop: $content.eq($btn.index(this)).offset().top - 70
            }, 500);
            e.stopPropagation();
            return false;
        });
        (function() {
            var $head = $(".header-seachbar"),
                $seachbar = $(".seachbar"),
                $fixed = $(".fixed-seachbar .container"),
                $top = $(".main-seckill");
            createScroll($top, function() {
                $seachbar.appendTo($fixed.parent().addClass("fixed-show").end());
                $floor.css({
                    position: "fixed",
                    top: "70px"
                });
                $back.show();
            }, function() {
                $seachbar.appendTo($head);
                $fixed.parent().removeClass("fixed-show");
                $floor[0].style = "";
                $back.hide();
            });
        })();
        (function() {
            var $nav = $(".rec-nav").eq(0),
                $list = $nav.find("ul"),
                $fixed = $(".rec-fixed-nav .container");
            createScroll($nav, function() {
                $fixed
                    .append($list)
                    .parent()
                    .addClass("rec-fixed-show");
                $floor.css("top", "135px");
            }, function() {
                $fixed.parent().removeClass("rec-fixed-show");
                $nav.append($list);
                $floor.css("top", "70px");
            });
        })();

        function place() {
            var top = (docEl.scrollTop || document.body.scrollTop);
            for (var i = $content.length - 1; i >= 0; i--) {
                if (top >= $content.eq(i).offset().top - 70) {
                    $btn
                        .removeClass("j-placeshow")
                        .eq(i)
                        .addClass("j-placeshow");
                    return false;
                }
            }
            $btn.removeClass("j-placeshow");
        }
        $(window).on("scroll", place);
    })();
});