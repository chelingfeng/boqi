$(function () {
    'use strict';

    $(document).on("pageInit", "", function(e, id, page) {
        $(".qidai").die("click").live('click', function () {
    		$.alert('该功能即将开放!', '提示');
    	});
    });

    //会员首页
    $(document).on("pageInit", "#page-vip-index", function (e, id, page) {

        if ($_GET['action'] == 'coupon_receive') {
            var code = $_GET['coupon_code'];
            $.ajax({
                type: 'GET',
                data: {code:code},
                async:false,
                url: 'index.php?m=Home&c=Vip&a=receiveFriendCoupon',
                success: function (res) {
                    if (res.code == 0) {
                        $(".mask, .coupon_success").show();
                    }
                }
            });
        }

        $(".close").click(function () {
            $(".mask, .coupon_success").hide();
        });

        $.ajax({
            type: 'GET',
            data: {},
            url: 'index.php?m=Home&c=Vip&a=user',
            success: function (res) {
                if (res.code == 0) {
                    $("#balance").html(res.data.balance);
                    $("#profit").html(res.data.profit);
                    $("#integral").html(res.data.integral);
                    $("#couponNum").html(res.data.couponNum);
                }
            }
        });

        var timeFlag = 0;
        var freeTime = 60;
        var time = freeTime;

        setInterval(function () {
            if (timeFlag == 1) {
                time = time - 1;
                if (time <= 0) {
                    time = freeTime;
                    getQr();
                }
                $(".open-qrcode .shuaxin span").html(time);
            }
        }, 1000);

        $(".qrcode_img").click(function () {
            getQr();
            $(".mask, .open-qrcode").show();
        });

        $(".open-qrcode .close").click(function () {
            timeFlag = 0;
            $(".mask, .open-qrcode").hide();
        });

        $(".shuaxin").click(function(){
            getQr();
        });
        
        function getQr()
        {
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { },
                url: 'index.php?m=Home&c=Vip&a=getQrcode',
                success: function (res) {
                    if (res.code == 0) {
                        timeFlag = 1;
                        time = freeTime;
                        $('.open-qrcode .barcode').attr('src', res.data.code1);
                        $('.open-qrcode .qr').attr('src', res.data.code2);
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        }

        $(".no-vip").click(function () {
            $.alert('开通会员后查看权益', '提示');
        });
        $(".recharge").click(function(){
            $.prompt('请输入充值金额?', '提示', function (value) {
                if (!isNaN(value) != '' && value != '' && value > 0) {
                    $.showIndicator()
                    $.ajax({
                        type: 'POST',
                        data: {amount:value},
                        url: 'index.php?m=Home&c=Vip&a=addOrder',
                        success: function (res) {
                            if (res.code == 0) {
                                pay(res.data.id);
                            } else {
                                $.alert(res.msg, '提示');
                            }
                            $.hideIndicator();
                        }
                    });
                } else {
                    $.alert('金额必须为大小0的数字')
                }
            });
            $(".modal-text-input").attr('type', 'number');
            $(".modal-text-input").focus();
        });
    });

    //会员卡片列表页
    $(document).on("pageInit", "#page-vip-card", function (e, id, page) {
        var user = null;
        $.showIndicator()
        $.ajax({
            type:'POST',
            data:{},
            url:'index.php?m=Home&c=Vip&a=getCard',
            success:function(res){
                var html = '';
                user = res.data.user;
                if (res.data.card.length > 0) {
                    res.data.card.forEach(function (item) {
                        html += '<div class="card-list" style="background:url(' + item.background + ') 0 0 no-repeat;background-size:100% 100%;">';
                        html += '<p class="quanyi" style="background:'+item.color+'">查看会员权益 ></p>';
                        if (typeof (res.data.user.vip_level) != 'undefined' && item.id == res.data.user.vip_level.id) {
                            html += '<p class="bottom-left">'+item.title+'</p>';
                        } else {
                            html += '<p class="bottom-left">尚未开通</p>';
                        }
                        html += '<img src="' + res.data.user.avatar + '" class="headimg" />';
                        html += '<span class="name">' + res.data.user.nickname + '</span>';
                        // html += '<span class="vip-level">' + item.title + '</span>';
                        if (typeof (res.data.user.vip_level) != 'undefined' && item.id == res.data.user.vip_level.id) {
                            html += "<a class='button open' onclick='' data-open='1' data-data='" + JSON.stringify(item) +"' style='background:"+item.color+"'>继续充值</a>";
                        } else {
                            html += "<a class='button open' onclick='' data-open='0' data-data='" + JSON.stringify(item) + "' style='background:" + item.color + "'>马上开通</a>";
                        }
                        html += '</div>';
                    });
                }
                
                $(".page .content").html(html);
                if (html == '') {
                    $('.empty').show();
                }
                $.hideIndicator();
            }
        })

        $(".open-vip .vip_open").click(function(){
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: $(".open-vip [name='id']").val()},
                url: 'index.php?m=Home&c=Vip&a=openVip',
                success: function (res) {
                    if (res.code == 0) {
                        if (res.data.amount == 0) {
                            $.alert('开通成功', '提示', function(){
                                window.location.href = $("[name='callback']").val();
                            });
                        } else {
                            pay(res.data.id, $("[name='callback']").val());
                        }
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            })
        });

        $("#page-vip-card .open").die("click").live('click', function() {
            if (user.mobile == '') {
                $.alert('请先完善个人信息', '提示', function () {
                    $.router.load('index.php?m=Home&c=Vip&a=message');
                });
                return;
            }
            var data = JSON.parse($(this).data('data'));
            $(".open-vip [name='id']").val(data.id);
            $(".open-vip .card-list").css('background', 'url('+data.background+') 0 0 no-repeat')
            $(".open-vip .card-list").css('background-size', '100% 100%');
            $(".open-vip .name").html(user.nickname);
            $(".open-vip .headimg").attr('src', user.avatar);
            $(".open-vip .quanyi").css('background', data.color);
            $(".open-vip .open").css('background', data.color);
            if ($(this).data('open') == '1') {
                $(".open-vip .open").hide();
                $(".open-vip .bottom-left").html(data.title);
                $(".open-vip .vip_title").html('欢迎充值' + data.title);
            } else {
                $(".open-vip .open").show();
                $(".open-vip .bottom-left").html('尚未开通');
                $(".open-vip .vip_title").html('欢迎开通' + data.title);
            }
            if (data.amount == 0) {
                $(".open-vip .vip_amount").html('免费');
                $(".open-vip .vip_open").html('马上开通');
            } else {
                $(".open-vip .vip_amount").html((data.amount / 100).toFixed(2));
                $(".open-vip .vip_open").html('确定支付');
            }
            var give = JSON.parse(data.give);
            if (give.balance.amount > 0) {
                $(".open-vip .vip_zs").html('充值赠送' + give.balance.amount);
            }
            $(".mask, .open-vip").show();
        });

        $(".open-vip .close").click(function(){
            $(".mask, .open-vip").hide();
        });
    });

    //会员信息页
    $(document).on("pageInit", "#page-vip-message", function (e, id, page) {
        $.showIndicator()
        $.ajax({
            type: 'GET',
            data: {},
            url: 'index.php?m=Home&c=Vip&a=getMessage',
            success: function (res) {
                $("[name='mobile']").val(res.data.mobile);
                if (res.data.mobile) {
                    $("[name='mobile']").attr('disabled', 'disabled');
                } else {
                    $("[name='mobile']").removeAttr('disabled');
                }
                $("[name='name']").val(res.data.name);
                $("[name='address']").val(res.data.address);
                $.hideIndicator();
            }
        })

        $("#submit").click(function(){
            var data = {};
            data.name = $("[name='name']").val();
            data.mobile = $("[name='mobile']").val();
            data.address = $("[name='address']").val();
            if (data.mobile == '') {
                $.alert('手机号不能为空', '提示');
                return false;
            } else {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(data.mobile)) {
                    $.alert('手机号格式不正确', '提示');
                    return false;
                }
            }
            if (data.name == '') {
                $.alert('姓名不能为空', '提示');
                return false;
            }
            if (data.address == '') {
                // $.alert('联系地址不能为空', '提示');
                // return false;
            }
            $.showIndicator();
            $.ajax({
                type: 'POST',
                data: data,
                url: 'index.php?m=Home&c=Vip&a=message',
                success: function (res) {
                    if (res.code == 0) {
                        $.alert('保存成功', '提示', function(){
                            history.go(-1);
                            $("[name='mobile']").attr('disabled', 'disabled');
                        })
                    } else {
                        $.alert(res.msg, '提示')
                    }
                    $.hideIndicator();
                }
            })
        });
    });


    $(document).on("pageInit", "#page-vip-coupon-receive", function (e, id, page) {

        $(".close").click(function(){
            $(".mask, .coupon_success").hide();
        });

        $(".receive").die("click").live('click', function () {
            var id = $(this).attr('data-id');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: {id:id},
                url: 'index.php?m=Home&c=Vip&a=receive',
                success: function (res) {
                    if (res.code == 0) {
                        loadData();
                        $(".mask, .coupon_success").show();
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });
        loadData();
        function loadData()
        {
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { },
                url: 'index.php?m=Home&c=Vip&a=getCouponBatch',
                success: function (res) {
                    var html = '';

                    res.data.forEach(function (item) {
                        html += '<div class="coupon-list">';
                        html += '<div class="left">';
                        var style = item.condition_amount == 0 ? 'style="margin-top:15px"' : '';
                        if (item.type == 'discount') {
                            if (item.rate % 10 == 0) {
                                item.rate = item.rate / 10;
                            }
                            html += '<p class="money" ' + style + '><span>' + item.rate + '折</span></p>';
                        } else {
                            html += '<p class="money" ' + style + '>¥<span>' + item.rate + '</span></p>';
                        }
                        if (item.condition_amount > 0) {
                            html += '<p class="message">满' + item.condition_amount + '可用</p>';
                        }
                        html += '</div>';
                        html += '<div class="middle">';
                        html += '<p class="tt">有效期</p>';
                        html += '<p class="time">' + item.start_time.substring(0, 10) + ' - ' + item.end_time.substring(0, 10) + '</p>';
                        if (item.type == 'discount') {
                            html += '<span class="type">折扣券</span>';
                        }
                        if (item.type == 'minus') {
                            html += '<span class="type">优惠券</span>';
                        }
                        html += '</div>';
                        html += '<div class="right receive" data-id="'+item.id+'">';
                        html += '<p>立</p>';
                        html += '<p>即</p>';
                        html += '<p>领</p>';
                        html += '<p>取</p>';
                        html += '</div>';
                        html += '</div>';
                    });

                    if (html == '') {
                        $(".empty").show();
                    } else {
                        $(".empty").hide();
                    }

                    $(".datalist").html(html);
                    $.hideIndicator();
                }
            });
        }
        
    });

    //会员优惠券列表页
    $(document).on("pageInit", "#page-vip-coupon", function (e, id, page) {
        $("#type a").click(function(){
            $("#type a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        $("#status a").click(function () {
            $("#status a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        $(".invite-modal__btn").click(function(){
            $(".invite-modal").hide();
        });

        loadData();
        
        $(".use_coupon").die("click").live('click', function () {
            if ($(this).data('type') == 'my') {
                var code = $(this).data('code');
                $(".coupon_use .code").html(code);
                $(".mask, .coupon_use").show();
            } else {
                var code = $(this).data('code');
                var callback = location.origin + '?m=Home&c=Vip&a=index&action=coupon_receive&openid={openid}&coupon_code=' + code;
                var data = {
                    data:{
                        type: 'share',
                        title: config.title,
                        path: '/pages/index/index?callback=' + encodeURIComponent(callback),
                        imageUrl: location.origin+config.share_coupon,
                    },
                };
                wx.miniProgram.postMessage(data);
                $(".invite-modal").show();
            }
        });

        $(".coupon_use .btn").die("click").live('click', function () {
            $(".mask, .coupon_use").hide();
        });

        function loadData() {
            var type = $('#type .active').data('type');
            var status = $('#status .active').data('status');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { type:type, status:status},
                url: 'index.php?m=Home&c=Vip&a=getCoupon',
                success: function (res) {
                    var html = '';

                    res.data.forEach(function(item){
                        html += '<div class="coupon-list">';
                            html += '<div class="left">';
                                var style = item.condition_amount == 0 ? 'style="margin-top:15px"' : ''; 
                                if (item.type == 'discount') {
                                    if (item.rate % 10 == 0) {
                                        item.rate = item.rate / 10;
                                    }
                                    html += '<p class="money" ' + style +'><span>'+item.rate+'折</span></p>';
                                } else {
                                    html += '<p class="money" ' + style +'>¥<span>' + item.rate +'</span></p>';
                                }
                                if (item.condition_amount > 0) {
                                    html += '<p class="message">满'+item.condition_amount+'可用</p>';
                                }
                            html += '</div>';
                            html += '<div class="middle">';
                                html += '<p class="tt">有效期</p>';
                                html += '<p class="time">' + item.start_time.substring(0, 10) +' - '+ item.end_time.substring(0, 10)+'</p>';
                                if (item.type == 'discount') {
                                    html += '<span class="type">折扣券</span>';
                                }
                                if (item.type == 'minus') {
                                    html += '<span class="type">优惠券</span>';
                                }
                            html += '</div>';
                            if (item.status == 'receive') {
                                html += '<div class="right use_coupon" data-type="'+type+'" data-code="'+item.code+'">';
                            } else {
                                html += '<div class="right">';
                            }
                            if (type == 'my') {
                                html += '<p>立</p>';
                                html += '<p>即</p>';
                                html += '<p>使</p>';
                                html += '<p>用</p>';
                            } else {
                                html += '<p>立</p>';
                                html += '<p>即</p>';
                                html += '<p>分</p>';
                                html += '<p>享</p>';
                            }
                               
                            html += '</div>';
                        html += '</div>';
                    });
                    
                    if (html == '') {
                        $(".empty").show();
                    } else {
                        $(".empty").hide();
                    }

                    if (status == 'receive') {
                        $('.datalist').removeClass('none');
                    } else {
                        $('.datalist').addClass('none');
                    }

                    $(".datalist").html(html);
                    $.hideIndicator();
                }
            });
        }
    });

    //会员账单页
    $(document).on("pageInit", "#page-vip-bills", function (e, id, page) {

        $("#type a").click(function () {
            $("#type a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        loadData();

        function loadData() {
            var type = $('#type .active').data('type');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { type: type},
                url: 'index.php?m=Home&c=Vip&a=getBills',
                success: function (res) {
                    var html = '';

                    res.data.forEach(function (item) {
                        html += '<div class="qianbao-title content-block-title">'+item.time1+'</div>';
                        html += '<div class="list-block media-list qianbao-list">';
                            html += '<ul>';
                                html += '<li>';
                                html += '<a class="item-content">';
                                        html += '<div class="item-media">';
                                            html += '<span class="iconfont icon-qianbao qianbao"></span>';
                                        html += '</div>';
                                        html += '<div class="item-inner">';
                                            html += '<div class="item-title-row">';
                                                html += '<div class="item-title">'+item.title+'</div>';
                                                if (item.type == 'inflow') {
                                                    html += '<div class="item-after">+' + item.amount + '</div>';
                                                } else {
                                                    html += '<div class="item-after">-' + item.amount + '</div>';
                                                }
                                            html += '</div>';
                                            html += '<div class="item-title-row srow">';
                                                html += '<div class="item-text">'+item.time2+'</div>';
                                                html += '<div class="item-text"><span class="balance">余额：' + item.balance +' </span><span class="yuan">元</span></div>';
                                            html += '</div>';
                                        html += '</div>';
                                html += '</a>';
                            html += '</li>';
                        html += '</ul>';
                        html += '</div>';
                    });

                    if (html == '') {
                        $(".empty").show();
                    } else {
                        $(".empty").hide();
                    }

                    $(".datalist").html(html);
                    $.hideIndicator();
                }
            });
        }
    });

    //会员权限页面
    $(document).on("pageInit", "#page-vip-equity", function (e, id, page) {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: '2%',
        });
    });

    //我的活动
    $(document).on("pageInit", "#page-activity-my", function (e, id, page) {
        $("#type a").click(function () {
            $("#type a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        $("#status a").click(function () {
            $("#status a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        loadData();

        function loadData() {
            var type = $('#type .active').data('type');
            var status = $('#status .active').data('status');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { type: type, status: status },
                url: 'index.php?m=Home&c=Activity&a=getMyActivity',
                success: function (res) {
                    var html = '';

                    if (html == '') {
                        $(".empty").show();
                    } else {
                        $(".empty").hide();
                    }

                    $(".datalist").html(html);
                    $.hideIndicator();
                }
            });
        }
    });


    $.init();
});