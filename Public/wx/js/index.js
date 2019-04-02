$(function () {
    'use strict';

    $(document).on("pageInit", "", function(e, id, page) {
        $(".qidai").die("click").live('click', function () {
    		$.alert('该功能即将开放!', '提示');
        });
        
        $('textarea, input, select').on('blur', function () {
            setTimeout(function () {
                window.scrollTo(0, 0)
            }, 100)
        })

        var overscroll = function (el) {
            el.addEventListener('touchstart', function () {
                var top = el.scrollTop
                    , totalScroll = el.scrollHeight
                    , currentScroll = top + el.offsetHeight;
                //If we're at the top or the bottom of the containers
                //scroll, push up or down one pixel.
                //
                //this prevents the scroll from "passing through" to
                //the body.
                if (top === 0) {
                    el.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    el.scrollTop = top - 1;
                }
            });
            el.addEventListener('touchmove', function (evt) {
                //if the content is actually scrollable, i.e. the content is long enough
                //that scrolling can occur
                if (el.offsetHeight < el.scrollHeight)
                    evt._isScroller = true;
            });
        }
        overscroll(document.querySelector('.scroll'));
        document.body.addEventListener('touchmove', function (evt) {
            //In this case, the default behavior is scrolling the body, which
            //would result in an overflow.  Since we don't want that, we preventDefault.
            if (!evt._isScroller) {
                evt.preventDefault();
            }
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
            async: false,
            url: 'index.php?m=Home&c=Vip&a=getMessage',
            success: function (res) {
                $("[name='mobile']").val(res.data.mobile);
                if (res.data.mobile) {
                    $("[name='mobile']").attr('disabled', 'disabled');
                } else {
                    $("[name='mobile']").removeAttr('disabled');
                }
                $("[name='name']").val(res.data.name);
                $(".vip-message-avatar").attr('src', res.data.avatar);
                $(".vip-message-nickname").html(res.data.nickname);
                if (res.data.vip_level_id != '0') {
                    $(".vip-message-level").html(res.data.vip_level.title);
                } else {
                    $(".vip-message-level").html('');
                }
                $("[name='address']").val(res.data.address);
                $("[name='sex']").val(res.data.sex);
                $("[name='birthday']").val(res.data.birthday);
                if (res.data.birthday) {
                    $("#birthday").calendar({
                        value: [res.data.birthday]
                    });
                } else {
                    $("#birthday").calendar({});
                }
                $.hideIndicator();
            }
        })

        $("#sex").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择性别</h1>\
  </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: ['其他', '男', '女']
                }
            ]
        });

        $("#submit").click(function(){
            var data = {};
            data.name = $("[name='name']").val();
            data.mobile = $("[name='mobile']").val();
            data.address = $("[name='address']").val();
            data.sex = $("[name='sex']").val();
            data.birthday = $("[name='birthday']").val();
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
            if (data.sex == '') {
                $.alert('请选择性别', '提示');
                return false;
            }
            if (data.birthday == '') {
                $.alert('请选择生日', '提示');
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
            var type = $(this).attr('data-type');
            $(".activity-bottom").hide();
            $(".activity-bottom.activity_"+type).show();
            loadData();
        });

        $("#status a").click(function () {
            $("#status a").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        loadData();

        $(document).on('click', '.use_action', function () {
            var type = $(this).data('type');
            var id = $(this).data('id');
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: {type:type, id:id},
                url: 'index.php?m=Home&c=Activity&a=getActivityCouponQrcode',
                success: function (res) {
                    if (res.code == 0) {
                        $('.coupon_use .code img').attr('src', res.data.qrcode);
                        $(".mask, .coupon_use").show();
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });

        $(".coupon_use .btn").click(function () {
            $(".mask, .coupon_use").hide();
        });

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
                    res.data.forEach(function(item, index){
                        html += '<div class="list-block media-list activity-list">';
                            html += '<ul>';
                                html += '<li>';
                                    html += '<div class="item-content">';
                                    html += '<div class="item-media">';
                                        if (item.activity.type == 'cut') {
                                            html += '<a class="list-block media-list activity-list" data-no-cache="true" href="index.php?m=Home&c=Activity&a=cutDetail&id=' + item.activity.id +'"><img src="'+item.activity.thumb+'" style="height:5rem; width: 5rem;"></a>';
                                        } else if (item.activity.type == 'groupon') {
                                            html += '<a class="list-block media-list activity-list" data-no-cache="true" href="index.php?m=Home&c=Activity&a=grouponDetail&id=' + item.activity.id + '"><img src="' + item.activity.thumb + '" style="height:5rem; width: 5rem;"></a>';
                                        } else {
                                            html += '<img src="' + item.activity.thumb + '" style="height:5rem; width: 5rem;">';
                                        }
                                    html += '</div>';
                                    html += '<div class="item-inner">';
                                        html += '<div class="item-title-row cut">';
                                        html += '<div class="item-title">'+item.activity.title+'</div>';
                                        html += '</div>';
                                        if (item.activity.type == 'groupon') {
                                            html += '<div class="remark"><span>' + item.activity.rule.member_num +'人团</span></div>';
                                        } else {
                                            html += '<div class="remark">&nbsp;</div>';
                                        }
                                        html += '<div class="money">¥' + (item.price / 100) + ' <s>¥' + (item.activity.original_price / 100) + '</s></div>';
                                        
                                        if (item.status == 'ongoing' && item.order_id > 0 && item.activity.type != 'groupon') { 
                                            html += '<div class="status_btn active" onclick="pay('+item.order_id+')">去支付</div>';
                                        } else if (item.status == 'closed') {
                                            html += '<div class="status_btn">已结束</div>';
                                        } else if (item.status == 'success') {
                                            if (item.is_use == 1) {
                                                html += '<div class="status_btn">已使用</div>';
                                            } else {
                                                html += '<div class="status_btn active use_action" data-type="'+item.activity.type+'" data-id="'+item.id+'">去使用</div>';
                                            }
                                        } else {
                                            if (item.activity.type == 'cut') {
                                                html += '<a class="status_btn active" data-no-cache="true" href="index.php?m=Home&c=Activity&a=cutDetail&id=' + item.activity.id + '">查看</a>';
                                            } else if (item.activity.type == 'groupon') {
                                                html += '<a class="status_btn active" data-no-cache="true" href="index.php?m=Home&c=Activity&a=grouponDetail&id=' + item.activity.id + '">查看</a>';
                                            }
                                        }
                                    html += '</div>';
                                    html += '</div>';
                                html += '</li>';
                            html += '</ul>';
                        html += '</div>';
                    })
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
        var buycarId = 'buycar'+$("[name='shop_id']").val();
        var shop = JSON.parse($("[name='shop']").val());
        if ($.fn.cookie(buycarId) == null) {
            $.fn.cookie(buycarId, '[]', { expires: 365 }); 
        }
        var shops = JSON.parse($("[name='shops']").val());
        var shopTitles = [];
        shops.forEach(function(item, index){
            shopTitles[index] = item.title;
        });

        showBuyCarNumber();

        function showDetail(id){
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: 'index.php?m=Home&c=Menu&a=findGoods',
                success: function (res) {
                    if (res.code == 0) {
                        $(".menu-goods-detail .price-price").html('¥' + res.data.price);
                        $(".menu-goods-detail [name='goods_id']").val(res.data.id);
                        $(".menu-goods-detail [name='goods_title']").val(res.data.title);
                        $(".menu-goods-detail [name='goods_carousel']").val(res.data.carousel[0]);
                        $(".menu-goods-detail [name='goods_price']").val(res.data.price * 100);
                        $('.menu-goods-detail-img').attr('src', res.data.carousel[0]);
                        var guige = '';
                        res.data.options.forEach(function (item, index) {
                            guige += '<div class="menu-goods-detail-guige">';
                            guige += '<div class="menu-goods-detail-guige-tt">' + item.key + '</div>';
                            item.val.forEach(function (item, index) {
                                if (index == 0) {
                                    guige += '<div class="menu-goods-detail-guige-list active">' + item + '</div>';
                                } else {
                                    guige += '<div class="menu-goods-detail-guige-list">' + item + '</div>';
                                }
                            });
                            guige += '<div class="both"></div>';
                            guige += '</div>';
                        })
                        if (res.data.tuijian.length == 0) {
                            $(".menu-goods-detail .close").css('bottom', '-3rem');
                            $(".menu-goods-detail-tuijian-list").html('');
                        } else {
                            var tuijian = '';
                            res.data.tuijian.forEach(function (item, index) {
                                tuijian += '<img src="' + item.carousel[0] + '" data-id="' + item.id + '"/>';
                            })
                            $(".menu-goods-detail-tuijian-list").html(tuijian);
                            $(".menu-goods-detail .close").css('bottom', '-7.5rem');
                        }
                        $(".menu-goods-detail .menu-goods-detail-guige-content").html(guige);
                        $('.mask,.menu-goods-detail').show();
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        }

        $(document).on('click', '.menu-goods-detail-guige-list', function(){
            $(this).parent().find('.menu-goods-detail-guige-list').removeClass('active');
            $(this).addClass('active');
        })

        //商品详情
        $(".menu-goods-content li").click(function(){
            var id = $(this).attr('data-id');
            showDetail(id);
        });

        //推荐
        $(document).on('click', ".menu-goods-detail-tuijian-list img", function () {
            var id = $(this).attr('data-id');
            showDetail(id);
        });

        $("#change-shop-id").picker({
            formatValue: function (picker, value, displayValue) {
                return picker.cols[0].activeIndex;
            },
            toolbarTemplate: '<header class="bar bar-nav">\
          <button class="button button-link pull-right close-picker">确定</button>\
          <h1 class="title">切换门店</h1>\
          </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: shopTitles,
                }
            ],
            onClose: function () {
                location.replace('index.php?m=Home&c=Menu&a=index&id=' + shops[$("#change-shop-id").val()].id);
            }
        });
        $(".change-shop").click(function(){
            $("#change-shop-id").picker("open");
        });
        var swiper = new Swiper('#menu-index-swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
        });

        $(".ok-ok").click(function(){
            var goods_id = $(".menu-goods-detail [name='goods_id']").val();
            var options = [];
            var buycar = JSON.parse($.fn.cookie(buycarId));
            $(".menu-goods-detail-guige .active").each(function(index){
                options[index] = $(this).html();
            });
            var flag = 1;
            buycar.forEach(function(item, index){
                if (item.id == goods_id && item.options.join(',') == options.join(',')) {
                    item.number = item.number + 1;
                    flag = 0;
                }
            });
            if (flag == 1) {
                buycar.push({
                    id: $(".menu-goods-detail [name='goods_id']").val(),
                    title: $(".menu-goods-detail [name='goods_title']").val(),
                    carousel: $(".menu-goods-detail [name='goods_carousel']").val(),
                    number: 1,
                    options: options,
                    price: parseInt($(".menu-goods-detail [name='goods_price']").val()),
                });
            }
            $.fn.cookie(buycarId, JSON.stringify(buycar), { expires: 365 }); 
            $(".menu-goods-detail,.mask").hide();
            showBuyCarNumber();
            console.log(buycar);
        });

        function showBuyCarNumber()
        {
            var buycar = JSON.parse($.fn.cookie(buycarId));
            var number = 0;
            var price  = 0;
            buycar.forEach(function (item, index) {
                number += item.number;
                price += item.price * item.number
            });
            $('.menu-car-gouwuche .point').html(number);
            $('.menu-car-money').html('¥' + (price / 100).toFixed(2));
        }

        //下单
        $(".menu-car-btn").click(function(){
            //判断是否可以下单
            if (shop.status != 'normal') {
                $.alert('店铺已关闭，暂时无法下单', '提示');
                return;
            }
            var buycar = JSON.parse($.fn.cookie(buycarId));
            if (buycar.length > 0) {
                $.router.load("index.php?m=Home&c=Menu&a=order&id=" + $("[name='shop_id']").val() + '&table_number_id=' + $("[name='table_number_id']").val(), true)
            }
        });

        //显示购物车详情
        $(".menu-car-gouwuche").click(function() {
            $('.new_mask, .menu-car-detail').toggle();
            if($('.menu-car-gouwuche .point').html() != 0) {
                showCarDetail();   
            }
        });

        $(".new_mask").click(function(){
            $('.new_mask, .menu-car-detail').hide();
        });

        //减
        $(document).on('click', '.jian', function(){
            var buycar = JSON.parse($.fn.cookie(buycarId));
            var index = $(this).parent().parent().attr('data-index');
            buycar[index].number = buycar[index].number - 1;
            if (buycar[index].number <= 0 ) {
                buycar.splice(index, index + 1);
            }
            $.fn.cookie(buycarId, JSON.stringify(buycar), { expires: 365 }); 
            showCarDetail();
        })

        $(document).on('click', '.jia', function () {
            var buycar = JSON.parse($.fn.cookie(buycarId));
            var index = $(this).parent().parent().attr('data-index');
            buycar[index].number = buycar[index].number + 1;
            $.fn.cookie(buycarId, JSON.stringify(buycar), { expires: 365 });
            showCarDetail();
        })

        function showCarDetail()
        {
            showBuyCarNumber();
            var html = '';
            var buycar = JSON.parse($.fn.cookie(buycarId));
            buycar.forEach(function (item, index) {
                html += '<div class="menu-car-detail-list" data-index='+index+'>';
                    html += '<div class="menu-car-detail-list-left">';
                        html += '<p class="tt">'+item.title+'</p>';
                        html += '<p class="ftt">'+item.options.join('+')+'</p>';
                    html += '</div>';
                    html += '<div class="menu-car-detail-list-m">¥'+(item.price * item.number / 100).toFixed(2)+'</div>';
                    html += '<div class="menu-car-detail-list-right">';
                        html += '<span class="iconfont icon-jian jian"></span>';
                        html += '<span class="number">'+item.number+'</span>';
                        html += '<span class="iconfont icon-jia jia"></span>';
                    html += '</div>';
                    html += '<div class="both"></div>';
                html += '</div>';
            });
            $(".menu-car-detail-list").remove();
            $('.menu-car-detail').append(html);
        }

        //清空购物车
        $(".menu-car-detail-title .right").click(function(){
            $.confirm('确定要清空购物车吗?', '提示', function () {
                $.fn.cookie(buycarId, '[]', { expires: 365 }); 
                showBuyCarNumber();
                $(".menu-car-detail-list").remove();
                $('.new_mask, .menu-car-detail').hide();
            });
        });

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

        $("#submit_order").click(function(){
            $(".menu-order-pay, .mask").show();
        });

        $(".menu-order-pay .close").click(function(){
            $(".menu-order-pay, .mask").hide();
        });

        $(".menu-order-pay-list.balance").click(function(){
            var userBalance = $('.menu-order-pay-list-p2 b').html();
            var amount = $('.mm2 span').html();
            if (parseFloat(userBalance) < parseFloat(amount)) {
                $.alert('余额不足', '提示');
                return;
            }
            addOrder('balance');
        });

        $(".menu-order-pay-list.wechat").click(function () {
            addOrder('wechat');
        });

        $(".menu-order-confirm-btn").click(function(){
            var people_number = $("[name='people_number']").val();
            var table_number = $("[name='table_number']").val();
            if (people_number == '') {
                $.alert('请选择就餐人数', '提示');
                return;
            }
            if (table_number == '') {
                $.alert('请选择餐桌', '提示');
                return;
            }
            $(".table_number").html(table_number);
            $(".people_number").html(people_number+'就餐');
            $(".menu-order-confirm, .mask").hide();
        });

        $(".detail-message").click(function(){
            $(".menu-order-confirm, .mask").show();
        });

        function addOrder(payment)
        {
            var people_number = $("[name='people_number']").val();
            var table_number = $("[name='table_number']").val();
            var shopId = $("[name='shop_id']").val();
            $.confirm('确定支付吗?', '提示', function () {
                $.showIndicator()
                $.ajax({
                    type: 'POST',
                    data: { payment: payment, shopId: shopId, people_number: people_number, table_number: table_number},
                    async: false,
                    url: 'index.php?m=Home&c=Menu&a=addOrder',
                    success: function (res) {
                        if (res.code == 0) {
                            if (payment == 'balance') {
                                location.href = 'index.php?m=Home&c=Menu&a=paySuccess&id='+res.data.id;
                            } else if (payment == 'wechat') {
                                pay(res.data.id, location.origin +'/index.php?m=Home&c=Menu&a=paySuccess&id='+res.data.id);
                            }
                        } else {
                            $.alert(res.msg, '提示', function (){
                                location.href = 'index.php?m=Home&c=Menu&a=index&id=' + shopId
                            });
                        }
                        $.hideIndicator();
                    }
                });
            });
        }

    });

    $(document).on("pageInit", "#page-order-index", function (e, id, page) {
        getData();
        $("#type .button").click(function(){
            $("#type .button").removeClass('active');
            $(this).addClass('active');
            getData();
        });
        $("#status .button").click(function () {
            $("#status .button").removeClass('active');
            $(this).addClass('active');
            getData();
        });
        function getData()
        {
            var type = $("#type .active").attr('data-type');
            var status = $("#status .active").attr('data-status');
            $.showIndicator()
            $.ajax({
                type: 'GET',
                data: { type: type, status: status },
                async: false,
                url: 'index.php?m=Home&c=Menu&a=getOrder',
                success: function (res) {
                    if (res.code == 0) {
                        var html = '';

                        res.data.forEach(function (item, index) {
                            var num = 0;
                            html += '<div class="hall-order-list">';
                                html += '<div class="hall-order-list-time">'+item.create_time+'</div>';
                                html += '<div class="menu-order-goods-list-item-content vip-order-list-item-content">';
                                    item.detail.forEach(function(g, i){
                                        num += g.number;
                                        html += '<div class="menu-order-goods-list-item">';
                                            html += '<img src="'+g.carousel+'">';
                                            html += '<div class="menu-order-goods-list-m">';
                                                html += '<p class="p1">'+g.title+'</p>';
                                                html += '<p class="p2">'+g.options.join('+')+'</p>';
                                            html += '</div>';
                                            html += '<div class="menu-order-goods-list-right">';
                                                html += '<p class="p1">¥'+(g.price * g.number / 100).toFixed(2)+'</p>';
                                                html += '<p class="p3">× '+g.number+'</p>';
                                            html += '</div>';
                                        html += '</div>';
                                    }) 
                                html += '</div>';
                                html += '<div class="menu-order-goods-list-bottom1">';
                                    html += item.table_number+' '+item.people_number+'人就餐 共'+num+'个菜';
                                html += '</div>';
                                html += '<div class="menu-order-goods-list-bottom">';
                                    html += '实付金额：¥'+(item.amount / 100).toFixed(2);
                                html += '</div>';
                                if (item.status == 'created') { 
                                    html += '<div class="menu-order-goods-list-btn repay" data-id="'+item.id+'">支付</div>';
                                }
                                html += '<div class="both"></div>';
                            html += '</div>';
                        });
                        $(".hall-order-list").remove();
                        $("#datalist").prepend(html)
                        if (html == '') {
                            $(".empty").show();
                        } else {
                            $(".empty").hide();
                        }
                    }
                    $.hideIndicator();
                }
            });

            $(document).on('click', '.repay', function(){
                var id = $(this).attr('data-id');
                pay(id, location.origin + '/index.php?m=Home&c=Menu&a=paySuccess&id='+id);
            })
        }
    });

    $(document).on("pageInit", "#page-activity-seckill", function (e, id, page) {
        new Swiper('#activity-seckill-swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
        });

        var sleep = setInterval(function(){
            var timestamp = parseInt(new Date().getTime() / 1000);
            $(".activity-list").each(function(){
                var status = $(this).attr('data-status');
                var start_time = $(this).attr('data-start_time');
                var end_time = $(this).attr('data-end_time');
                switch (status) {
                    case 'unstart':
                        //显示倒计划
                        if (timestamp < start_time) {
                            var times = getTime(parseInt(start_time));
                            $(this).find('.seckill-top-right').html('距开始：<span>' + times.hour + '</span>:<span>' + times.minute + '</span>:<span>' + times.second + '</span>')
                        } else {
                            $(this).addClass('ongoing');
                            var times = getTime(parseInt(end_time));
                            $(this).find('.seckill-top-right').html('距结束：<span>' + times.hour + '</span>:<span>' + times.minute + '</span>:<span>' + times.second + '</span>')
                            $(this).find('.status_btn').html('立即抢购')
                        }
                        break;

                    case 'ongoing':
                        //显示倒计划
                        if (parseInt(timestamp) < parseInt(end_time)) {
                            var times = getTime(parseInt(end_time));
                            $(this).find('.seckill-top-right').html('距结束：<span>' + times.hour + '</span>:<span>' + times.minute + '</span>:<span>' + times.second +'</span>')
                        } else {
                            $(this).find('.seckill-top-right').html('活动已结束')
                            $(this).find('.status_btn').html('已结束')
                            $(this).addClass('closed');
                        }

                        break;
                    
                    case 'closed':
                        $(this).find('.seckill-top-right').html('活动已结束')
                        $(this).find('.status_btn').html('已结束')
                        $(this).addClass('closed');

                        break;
                
                    default:
                        break;
                }
            });
        }, 1000);

        var activity_detail_time;
        $(".status_btn").click(function(){
            var status = $(this).parents('.seckill').eq(0).attr('data-status');
            var id = $(this).parents('.seckill').eq(0).attr('data-id');
            if ($(this).parents('.seckill').eq(0).attr('data-play-status') == 'ongoing' && $(this).parents('.seckill').eq(0).attr('data-play-order-id') > 0) {
                pay($(this).parents('.seckill').eq(0).attr('data-play-order-id'), $("[name='callback']").val());
                return;
            }
            if (status == 'ongoing') {
                $(".activity-seckill-detail, .mask").show();
            }
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: 'index.php?m=Home&c=Activity&a=findActivity',
                success: function (res) {
                    if (res.code == 0) {
                        $(".activity-seckill-detail-title").html(res.data.title);
                        $(".activity-seckill-detail-price").html(res.data.price + '<s>' + res.data.original_price+'</s>');
                        var carousel = '';
                        res.data.carousel.forEach(function(item, index){
                            carousel += '<div class="swiper-slide"><img src="/Public/Uploads/5c1f2cc95e2fe.png" width="100%" height="100%" /></div>';
                            carousel += '<div class="swiper-slide"><img src="/Public/Uploads/5c1f2cc95e2fe.png" width="100%" height="100%" /></div>';
                        });
                        $("#activity-seckill-detail-swiper-container .swiper-wrapper").html(carousel);
                        new Swiper('#activity-seckill-detail-swiper-container', {
                            loop: true,
                            pagination: {
                                el: '.swiper-pagination',
                            },
                            autoplay: {
                                delay: 3000,
                                stopOnLastSlide: false,
                                disableOnInteraction: false,
                            },
                        });
                        $(".activity-seckill-detail [name='activity_id']").val(res.data.id);
                        var percentage = ((parseInt(res.data.rule.product_sum) - parseInt(res.data.rule.product_remaind)) / parseInt(res.data.rule.product_sum) * 100).toFixed(1);
                        $('.progress .tt').html('剩余'+percentage+'%')
                        $('.progress .progress-true').css('width', percentage+'%');
                        var times = getTime(parseInt(res.data.end_time_str));
                        $(".daojishi").html('秒杀倒计划 ' + times.hour + ' : ' + times.minute + ' : ' + times.second);
                        activity_detail_time = setInterval(function () {
                            var times = getTime(parseInt(res.data.end_time_str));
                            $(".daojishi").html('秒杀倒计划 ' + times.hour +' : '+times.minute+' : '+times.second);
                        }, 1000)
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            })
        });

        $(".activity-seckill-detail-btn").click(function(){
            var id = $(".activity-seckill-detail [name='activity_id']").val();
            $.showPreloader('秒杀中');
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: 'index.php?m=Home&c=Activity&a=createSeckill',
                success: function (res) {
                    $.hidePreloader();
                    if (res.code == 0) {
                        pay(res.data.id, $("[name='callback']").val());
                    } else {
                        $.alert(res.msg, '提示');
                    }
                }
            });
        });

        $(".activity-seckill-detail .close").click(function(){
            window.clearInterval(activity_detail_time)
            $(".activity-seckill-detail, .mask").hide();
        });

        $('.activity-seckill-rule').click(function(){
            $(".activity-rule-detail, .mask").show();
        });

        $(".activity-rule-detail .close").click(function(){
            $(".activity-rule-detail, .mask").hide();
        });

    });

    $(document).on("pageInit", "#page-activity-cut", function (e, id, page) {
        new Swiper('#activity-seckill-swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
        });

        $('.activity-seckill-rule').click(function () {
            $(".activity-rule-detail, .mask").show();
        });

        $(".activity-rule-detail .close").click(function () {
            $(".activity-rule-detail, .mask").hide();
        });

    });

    $(document).on("pageInit", "#page-activity-cut-detail", function (e, id, page) {

        new Swiper('#activity-seckill-swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
        });
        
        $('.activity-seckill-rule').click(function () {
            $(".activity-rule-detail, .mask").show();
        });

        $(".activity-rule-detail .close").click(function () {
            $(".activity-rule-detail, .mask").hide();
        });

        $(".activity-cut-detail .close").click(function(){
            $(".activity-cut-detail, .mask").hide();
        });

        if ($_GET['share'] == '1') {
            $(".invite-modal").show();
        }

        $(".share").click(function(){
            $(".invite-modal").show();
        });

        $(".invite-modal__btn").click(function(){
            $(".invite-modal").hide();
        });

        $(".help").click(function(){
            var play_id = $("[name='play_id']").val();
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { play_id: play_id },
                url: 'index.php?m=Home&c=Activity&a=helpCut',
                success: function (res) {
                    if (res.code == 0) {
                        $('.activity-seckill-detail-cut span').html(res.data.cut_price / 100);
                        $(".activity-cut-detail, .mask").show();
                        window.setTimeout(function(){
                            window.location.reload();
                        }, 2000);
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });

        if ($("[name='play_id']").val()) {
            var callback = location.origin + '?m=Home&c=Activity&a=cutDetail&id=' + $("[name='activity_id']").val() + '&play_id=' + $("[name='play_id']").val()+'&openid={openid}';
            var data = {
                data: {
                    type: 'share',
                    title: $("[name='title']").val(),
                    path: '/pages/index/index?callback=' + encodeURIComponent(callback),
                    imageUrl: '',
                },
            };
            wx.miniProgram.postMessage(data);
        }

        $(".pay").click(function(){
            pay($(this).attr('data-id'), $("[name='callback']").val());
        });

        $(".join").click(function(){
            var id = $("[name='activity_id']").val();
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: {id:id},
                url: 'index.php?m=Home&c=Activity&a=joinCut',
                success: function (res) {
                    if (res.code == 0) {
                        location.replace('index.php?m=Home&c=Activity&a=cutDetail&id='+id+'&play_id='+res.data.id+'&share=1');
                    } else {
                        if (res.code == '20015') {
                            location.replace('index.php?m=Home&c=Activity&a=cutDetail&id=' + id + '&share=1');
                        }
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });

        var sleep = setInterval(function () {
            var timestamp = parseInt(new Date().getTime() / 1000);
            var end_time = parseInt($(".cut-message-djs").attr('data-time'));
            if (parseInt(timestamp) < parseInt(end_time) && $('.cut-message-djs').attr('data-status') == 'ongoing') {
                var times = getTime(end_time);
                $(".cut-message-djs").html('还剩' + times.hour + ' : ' + times.minute + ' : ' + times.second +'结束，赶紧呼唤小伙伴，一起来砍价');
            } else {
                window.clearInterval(sleep)
                if ($('.cut-message-djs').attr('data-status') == 'unstart') {
                    $(".cut-message-djs").html('活动未开始');
                } else if ($('.cut-message-djs').attr('data-status') == 'closed') {
                    $(".cut-message-djs").html('活动已结束');
                } else {
                    $(".cut-message-djs").html('');
                }
            }
        }, 1000)


    });


    $(document).on("pageInit", "#page-activity-groupon-detail", function (e, id, page) {


        if ($("[name='play_id']").val()) {
            var callback = location.origin + '?m=Home&c=Activity&a=grouponDetail&id=' + $("[name='activity_id']").val() + '&play_id=' + $("[name='play_id']").val() + '&openid={openid}';
            var data = {
                data: {
                    type: 'share',
                    title: $("[name='title']").val(),
                    path: '/pages/index/index?callback=' + encodeURIComponent(callback),
                    imageUrl: '',
                },
            };
            wx.miniProgram.postMessage(data);
        }


        new Swiper('#activity-seckill-swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
        });

        $(".openGroupon").click(function(){
            var id = $("[name='activity_id']").val();
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: 'index.php?m=Home&c=Activity&a=openGroupon',
                success: function (res) {
                    if (res.code == 0) {
                        pay(res.data.order_id);
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });

        $(".join").click(function () {
            var id = $("[name='play_id']").val();
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: 'index.php?m=Home&c=Activity&a=joinGroupon',
                success: function (res) {
                    if (res.code == 0) {
                        pay(res.data.order_id);
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            });
        });

        $(".share").click(function(){
            $(".invite-modal").show();
        });

        $(".invite-modal__btn").click(function () {
            $(".invite-modal").hide();
        });

        $('.activity-seckill-rule').click(function () {
            $(".activity-rule-detail, .mask").show();
        });

        $(".activity-rule-detail .close").click(function () {
            $(".activity-rule-detail, .mask").hide();
        });

        var sleep = setInterval(function () {
            var timestamp = parseInt(new Date().getTime() / 1000);
            var end_time = parseInt($(".groupon-detail-time").attr('data-end-time'));
            if (parseInt(timestamp) < parseInt(end_time)) {
                var times = getTime(end_time);
                $(".groupon-detail-time").html('<b class="iconfont icon-naozhong"></b>剩余<span>' + times.hour + '</span>:<span>' + times.minute + '</span>:<span>' + times.second+'</span>结束');
            }

            $(".more-groupon-right-p2").each(function(index){
                var end_time = parseInt($(this).attr('data-end-time'));
                if (parseInt(timestamp) < parseInt(end_time)) {
                    var times = getTime(end_time);
                    $(this).html('剩余 ' + times.hour + '：' + times.minute + '：' + times.second+' 结束');
                }
            });
        }, 1000)


    });
    

    $.init();
});