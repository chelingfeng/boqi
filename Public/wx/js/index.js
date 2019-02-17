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
            $(".mask, .coupon_success, .open-qrcode").hide();
        });

       
        loadInitData();
        function loadInitData()
        {
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
        }

        var freeTime = 120;
        var time = freeTime;
        var code = '';

        setInterval(function () {
            if ($(".open-qrcode").css("display") != 'none' && typeof ($(".open-qrcode").css("display")) != 'undefined') {
                time = time - 1;
                if (time <= 0) {
                    time = freeTime;
                    getQr();
                }
                $(".open-qrcode .shuaxin span").html(time);
                if (code != '') {
                    $.ajax({
                        type: 'GET',
                        data: {code:code},
                        url: 'index.php?m=Home&c=Vip&a=getToken',
                        success: function (res) {
                            if (res.code == 0) {
                                if (res.data.result && res.data.result.status == 'success') {
                                    loadInitData();
                                    $("#cash_window, .mask").show();
                                    $(".open-qrcode").hide();
                                }
                            }
                        }
                    });
                }
            }
        }, 1000);

        $(".qrcode_img").click(function () {
            getQr();
            $(".mask, .open-qrcode").show();
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
                        time = freeTime;
                        code = res.data.qrcodeToken;
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
                        html += '<a href="index.php?m=Home&c=Vip&a=equity&id='+item.id+'" class="quanyi" data-no-cache="true" style="background:'+item.color+'">查看会员权益 ></a>';
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
                        html += '<div class="coupon-list" data-status="' + item.status + '" data-code="' + item.code + '">';
                        html += '<div class="left" style="background:' + item.color + ';">';
                        if (item.rate > 0) {
                            if (item.type == 'discount') {
                                if (item.rate % 10 == 0) {
                                    item.rate = item.rate / 10;
                                }
                                html += '<p class="money"><span>' + item.rate + '</span> 折</p>';
                            } else {
                                html += '<p class="money">¥ <span>' + item.rate + '</span></p>';
                            }
                            html += '<p><span>' + item.typeName + '</span></p>';
                        } else {
                            html += '<p class="type">' + item.typeName + '</p>';
                        }
                        html += '</div>';
                        html += '<div class="middle">';
                        html += '<p class="tt">' + item.title + '</p>';
                        if (item.condition_amount > 0) {
                            html += '<p class="condition_amount">满' + item.condition_amount + '可用</p>';
                        } else {
                            html += '<p class="condition_amount">&nbsp;</p>';
                        }
                        html += '<p class="time">' + item.start_time.substring(0, 10) + ' - ' + item.end_time.substring(0, 10) + '</p>';
                        html += '</div>';
                        html += '<div class="coupon_detail receive" data-id="' + item.id + '">立即领取</div>';
    
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

        var index_flag = 0;
        $(".coupon-list .zuanfa, .detail_card_bottom_friend").die("click").live('click', function () {
            var code = $(this).data('code');
            var callback = location.origin + '?m=Home&c=Vip&a=index&action=coupon_receive&openid={openid}&coupon_code=' + code;
            var data = {
                data: {
                    type: 'share',
                    title: config.title,
                    path: '/pages/index/index?callback=' + encodeURIComponent(callback),
                    imageUrl: location.origin + config.share_coupon,
                },
            };
            wx.miniProgram.postMessage(data);
            $(".invite-modal").show();
            index_flag = 1;
            setTimeout(function(){
                index_flag = 0;
            }, 1000)
            $(".mask, .coupon_detail_card").hide();
        });

        $(".coupon_detail_card .close").click(function(){
            $(".mask, .coupon_detail_card").hide();
        });

        $(".coupon-list").die("click").live('click', function () {
            if (index_flag > 0) return;
            var id = $(this).data('id');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { id: id },
                url: 'index.php?m=Home&c=Vip&a=findCoupon',
                success: function (res) {
                    if (res.code == 0) {
                        if (res.data.status == 'receive') {
                            $('.detail_card_ct').css('background', res.data.color);
                            $('.detail_card_ct_coupon_name').html(res.data.title);
                            $('.detail_card_remark').html(res.data.remark);
                            $('.detail_card_bottom_friend').attr('data-code', res.data.code);
                            $('.detail_card_bottom').show();
                            $('.coupon_use .code img').attr('src', res.data.qrcode);
                            if (res.data.is_friend == 1) {
                                $('#use_coupon').hide();
                                $('.detail_card_bottom_friend').show();
                            } else {
                                $('#use_coupon').show();
                                $('#use_coupon').attr('data-code', res.data.code);
                                $('.detail_card_bottom_friend').hide();
                            }
                            $(".mask, .coupon_detail_card").show();
                        }
                    }
                    $.hideIndicator();
                }
            });
            index_flag = 1;
            setTimeout(function () {
                index_flag = 0;
            }, 1000)
           
        });
        
        $("#use_coupon").click(function(){
            var code = $(this).data('code');
            $(".coupon_detail_card").hide();
            $(".coupon_use").show();
        });

        $(".coupon_use .btn").die("click").live('click', function () {
            loadData();
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
                        if (item.status != 'receive') {
                            item.color = '#cbcbcb';
                        }
                        html += '<div class="coupon-list" data-id="'+item.id+'" data-status="'+item.status+'" data-code="' + item.code +'">';
                            html += '<div class="left" style="background:'+item.color+';">';
                                if (item.rate > 0) {
                                    if (item.type == 'discount') {
                                        if (item.rate % 10 == 0) {
                                            item.rate = item.rate / 10;
                                        }
                                        html += '<p class="money"><span>'+item.rate+'</span> 折</p>';
                                    } else {
                                        html += '<p class="money">¥ <span>' + item.rate +'</span></p>';
                                    }
                                    html += '<p><span>' + item.typeName +'</span></p>';
                                } else {
                                    html += '<p class="type">'+item.typeName+'</p>';
                                }
                            html += '</div>';
                            html += '<div class="middle">';
                                html += '<p class="tt">'+item.title+'</p>';
                                if (item.condition_amount > 0) {
                                    html += '<p class="condition_amount">满'+item.condition_amount+'可用</p>';
                                } else {
                                    html += '<p class="condition_amount">&nbsp;</p>';
                                }
                                html += '<p class="time">'+item.start_time.substring(0, 10)+' - '+item.end_time.substring(0, 10)+'</p>';
                            html += '</div>';
                            if (status == 'receive') {
                                html += '<div class="coupon_detail" data-id="'+item.id+'">查看详情</div>';
                            } else if (status == 'used') {
                                html += '<img src="' + $("[name='coupon_img_used']").val()+'" class="coupon_img" />';
                            } else if (status == 'expired') { 
                                html += '<img src="' + $("[name='coupon_img_expired']").val() + '" class="coupon_img" />';
                            }
                            if (item.is_friend == 1 && status == 'receive') {
                                html += '<div class="zuanfa" data-code="'+item.code+'"><span class="iconfont icon-zhuanfa"></span> 可赠送</div>';
                            }
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

        var initialSlide = 0;
        $(".swiper-slide").each(function(index){
            var vip = JSON.parse($("[name='vip']").val());
            if ($(this).data('id') == vip.id) {
                initialSlide = index;
            }
        });

        function showBtn() {
            var user_vip_level = JSON.parse($("[name='user_vip_level']").val());
            var vip = JSON.parse($("[name='vip']").val());
            $(".ftitle span").html(vip.title + '会员');
            if (user_vip_level == null || vip.seq > user_vip_level.seq) {
                $(".equity-open").show();
            } else {
                $(".equity-open").hide();
            }
        }
        showBtn();

        $(".equity-open").click(function(){
            var vip = JSON.parse($("[name='vip']").val());
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: vip.id },
                url: 'index.php?m=Home&c=Vip&a=openVip',
                success: function (res) {
                    if (res.code == 0) {
                        if (res.data.amount == 0) {
                            $.alert('开通成功', '提示', function () {
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


        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            initialSlide: initialSlide,
            centeredSlides: true,
            spaceBetween: '2%',
            on: {
                slideChangeTransitionEnd: function () {
                    $("[name='vip']").val($(".swiper-slide").eq(this.activeIndex).data('data'));
                    showBtn();
                },
            },
        });
        
        $(".equity-detail .close").click(function(){
            $(".mask, .equity-detail").hide();
        });

        $(".equity").click(function(){
            var type = $(this).data('type');
            var vip = JSON.parse($("[name='vip']").val());
            var title = $(this).find('.equity-title').html();
            $(".equity-detail .tt").html(title);
            $(".equity-detail .equity-detail-remark").html(vip[type+'_remark']);
            $(".mask, .equity-detail").show();
        });
    });

    //充值页
    $(document).on("pageInit", "#page-vip-recharge", function (e, id, page) {
        $(".recharge-card-list").click(function(){
            var amount = $(this).data('amount');
            $("#amount").val(amount);
        });

        $("#recharge_action").click(function(){
            var amount = $("#amount").val();
            if (!isNaN(amount) != '' && amount != '' && amount > 0) {
                $.showIndicator()
                $.ajax({
                    type: 'POST',
                    data: { amount: amount },
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

    //菜单首页
    $(document).on("pageInit", "#page-menu-index", function (e, id, page) {
        // $("#picker").picker({
        //     formatValue: function (picker, value, displayValue) {
        //         return picker.cols[0].activeIndex;
        //     },
        //     toolbarTemplate: '<header class="bar bar-nav">\
        //   <button class="button button-link pull-right close-picker">确定</button>\
        //   <h1 class="title">切换门店</h1>\
        //   </header>',
        //     cols: [
        //         {
        //             textAlign: 'center',
        //             values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3'],
        //         }
        //     ],
        //     onClose: function (picker) {
                
        //     },
        //     onOpen: function () {
                
        //     }
        // });
        // $(".change-shop").click(function(){
        //     $("#picker").picker("open");
        // });
        $('.menu-content').css('height', 'calc(100% - ' + ($('.menu-content').offset().top) + 'px)')
        // var swiper = new Swiper('#menu-index-swiper-container', {
        //     loop: true,
        //     pagination: {
        //         el: '.swiper-pagination',
        //     },
        //     autoplay: {
        //         delay: 3000,
        //         stopOnLastSlide: false,
        //         disableOnInteraction: false,
        //     },
        // });

        $(".menu-menu-content p").click(function(){
            var index = $(".menu-menu-content p").index(this);
            var contentHeight = parseInt($('.menu-content').offset().top);
            var thisHeight = $('.menu-goods-content .content-block-title').eq(index).offset().top;
            $(".menu-menu-content p").removeClass('active');
            $(this).addClass('active');
            $(".menu-goods-content").scrollTop((thisHeight - contentHeight) - 20);
        });

        $('.menu-goods-content').scroll(function(){
            var height = $(window).height();
            var i = 0;
            $('.menu-goods-content .content-block-title').each(function(index){
                if (height > ($(this).offset().top + 100)) {
                    i = index;
                }
            });
            $(".menu-menu-content p").removeClass('active');
            $(".menu-menu-content p").eq(i).addClass('active');
        });

        $(".menu-goods-detail .close").click(function(){
            $('.menu-goods-detail, .mask').hide();
        });
    });

    //菜单确认页
    $(document).on("pageInit", "#page-menu-order", function (e, id, page) {
        var otherHeight = $('.menu-order-youhui').height() + $('.menu-order-bottom').height() + $('.menu-order-vip-title').height() + 15;
        $('.menu-order-goods-list').css('height', 'calc(100% - '+otherHeight+'px)');


    });


    $.init();
});