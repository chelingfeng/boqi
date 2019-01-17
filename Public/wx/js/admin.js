$(function () {
    'use strict';

    $(document).on("pageInit", "", function (e, id, page) {
        $(".scan_tip").click(function(){
            $.alert('请手动打开扫一扫', '提示');
        });
    });

    //登录
    $(document).on("pageInit", "#page-admin-login", function (e, id, page) {
        var callback = $("[name='callback']").val();
        $("#login").click(function(){
            var username = $("[name='username']").val();
            var password = $("[name='password']").val();
            if (username == '') {
                $.alert('请输入账号', '提示');
                return false;
            }
            if (password == '') {
                $.alert('请输入密码', '提示');
                return false;
            }
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { username: username, password:password },
                url: 'index.php?m=Home&c=Admin&a=login',
                success: function (res) {
                    if (res.code == 0) {
                        location.href = callback;
                    } else {
                        $.alert(res.msg, '提示');
                    }
                    $.hideIndicator();
                }
            })
        });
    });

    //经营数据
    $(document).on("pageInit", "#page-admin-cash", function (e, id, page) {
        var page = $("[name='page']").val();
        if (page == '1') {
            loadData();
        }

        $(".more").click(function(){
            loadData();
        });

        function loadData()
        {
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { page: $("[name='page']").val() },
                url: 'index.php?m=Home&c=Admin&a=getCash',
                success: function (res) {
                    if (res.code == 0) {
                        var html = '';
                        res.data.list.forEach(function(item){
                            var fuhao = item.type == 'inflow' ? '+' : '-';
                            html += '<li class="'+item.type+'">';
                                html += '<div class="item-content">';
                                    html += '<div class="item-inner">';
                                        html += '<div class="item-title-row">';
                                            html += '<div class="item-title">'+item.title+'</div>';
                                        html += '</div>';
                                        html += '<div class="item-subtitle">'+item.create_time+'</div>';
                                    html += '</div>';
                                    html += '<div class="cash-right">'+fuhao+''+item.amount+'</div>';
                                html += '</div>';
                            html += '</li>';
                        });
                        $("#cash-list ul").append(html);
                        if (res.data.list.lenght == 0 && $("[name='page']").val() == 1) {
                            $(".empty").show();
                        } else if ($("[name='page']").val() == res.data.pageCount) {
                            $(".more").hide();
                        } else if (res.data.pageCount > $("[name='page']").val()) {
                            $("[name='page']").val(parseInt($("[name='page']").val()) + 1);
                            $(".more").show();
                        }
                    }
                    $.hideIndicator();
                }
            });
        }
    });

    //首页
    $(document).on("pageInit", "#page-admin-index", function (e, id, page) {
        var code = $_GET['code'];
        if ($_GET['action'] == 'scan') {
            $.ajax({
                type: 'GET',
                data: { code: code },
                url: 'index.php?m=Home&c=Admin&a=getToken',
                success: function (res) {
                    if (res.code == 0) {
                        if (res.data.token.type == 'cash' && res.data.token.result.length == 0) {
                            $(".vip_manage .tips").html(res.data.user.balance/100);
                            $(".vip_manage [name='id']").val(res.data.user.id);
                            $(".vip_manage, .mask").show();
                        }
                    }
                }
            });
        }

        if ($_GET['action'] == 'coupon') {
            var couponId = $_GET['couponId'];
            $.ajax({
                type: 'GET',
                data: { id: couponId },
                url: 'index.php?m=Home&c=Admin&a=getCoupon',
                success: function (res) {
                    if (res.code == 0) {
                        var html = '';
                        html += '<div class="left" style="background:' + res.data.color +';">';
                            if (res.data.rate > 0) {
                                if (res.data.type == 'discount') {
                                    if (res.data.rate % 10 == 0) {
                                        res.data.rate = res.data.rate / 10;
                                    }
                                    html += '<p class="money"><span>' + res.data.rate + '</span> 折</p>';
                                } else {
                                    html += '<p class="money">¥ <span>' + res.data.rate + '</span></p>';
                                }
                                html += '<p><span>' + res.data.typeName + '</span></p>';
                            } else {
                                html += '<p class="type">' + res.data.typeName + '</p>';
                            }
                        html += '</div>';
                        html += '<div class="middle">';
                            html += '<p class="tt">'+res.data.title+'</p>';
                            if (res.data.condition_amount > 0) {
                                html += '<p class="condition_amount">满' + res.data.condition_amount + '可用</p>';
                            } else {
                                html += '<p class="condition_amount">&nbsp;</p>';
                            }
                            html += '<p class="time">'+res.data.start_time.substring(0, 10)+' - '+res.data.end_time.substring(0, 10)+'</p>';
                        html += '</div>';
                        $(".coupon_manage .coupon-list").html(html);
                        $(".coupon_manage [name='code']").val(res.data.code);
                        $(".coupon_manage, .mask").show();
                    } else {
                        $.alert(res.msg, '提示');
                    }
                }
            });
        }

        $("#coupon").click(function () {
            var code = $(".coupon_manage [name='code']").val();
            $.confirm('确定要核销吗?', function () {
                $.showIndicator()
                $.ajax({
                    type: 'POST',
                    data: { code: code },
                    url: 'index.php?m=Home&c=Admin&a=useCoupon',
                    success: function (res) {
                        if (res.code == 0) {
                            $.alert('核销成功', '提示', function () {
                                $(".mask, .coupon_manage").hide();
                            });
                        } else {
                            $.alert(res.msg, '提示');
                        }
                        $.hideIndicator();
                    }
                });
            });
        });

        $("#bill").click(function () {
            var id = $(".vip_manage [name='id']").val();
            var amount = $(".vip_manage [name='amount']").val();
            var remark = $(".vip_manage [name='remark']").val();
            if (!isNaN(amount) != '' && amount != '' && amount > 0) {
                $.confirm('确定要扣款?', function () {
                    $.showIndicator()
                    $.ajax({
                        type: 'POST',
                        data: { code:code, id: id, amount: amount, remark: remark },
                        url: 'index.php?m=Home&c=Admin&a=outflow',
                        success: function (res) {
                            if (res.code == 0) {
                                $.alert('扣款成功', '提示', function () {
                                    $(".mask, .vip_manage").hide();
                                    $(".vip_manage [name='amount']").val('');
                                    $(".vip_manage [name='remark']").val('');
                                });
                            } else {
                                $.alert(res.msg, '提示');
                            }
                            $.hideIndicator();
                        }
                    });
                });
            } else {
                $.alert('金额必须为大小0的数字')
            }
        });

        $(".close").click(function () {
            $(".vip_manage, .coupon_manage, .mask").hide();
        });

        $.showIndicator()
        $.ajax({
            type: 'POST',
            data: { },
            url: 'index.php?m=Home&c=Admin&a=indexData',
            success: function (res) {
                if (res.code == 0) {
                    $("#thisDayRevenue").html('¥'+res.data.thisDayRevenue);
                    $("#thisDayRecharge").html(res.data.thisDayRecharge);
                    $("#lastDayRecharge").html(res.data.lastDayRecharge);
                    $("#thisDayOrderNum").html(res.data.thisDayOrderNum);
                    $("#lastDayOrderNum").html(res.data.lastDayOrderNum);
                    $("#thisDayVipNum").html(res.data.thisDayVipNum);
                    $("#lastDayVipNum").html(res.data.lastDayVipNum);
                }
                $.hideIndicator();
            }
        })
    });

    //会员管理
    $(document).on("pageInit", "#page-admin-vip", function (e, id, page) {
        $(document).on('click', '.vip-action', function(){
            var id = $(this).attr('data-id');
            var balance = $(this).attr('data-balance');
            $(".vip_manage .tips").html('¥'+balance);
            $(".vip_manage [name='id']").val(id);
            $(".mask, .vip_manage").show();
        });

        $(".vip_manage .close").click(function(){
            $(".mask, .vip_manage").hide();
        });

        $("#bill").click(function(){
            var id = $(".vip_manage [name='id']").val();
            var amount = $(".vip_manage [name='amount']").val();
            var remark = $(".vip_manage [name='remark']").val();
            if (!isNaN(amount) != '' && amount != '' && amount > 0) {
                $.confirm('确定要扣款?', function () {
                    $.showIndicator()
                    $.ajax({
                        type: 'POST',
                        data: { id: id, amount: amount, remark: remark },
                        url: 'index.php?m=Home&c=Admin&a=outflow',
                        success: function (res) {
                            if (res.code == 0) {
                                $.alert('扣款成功', '提示', function () {
                                    $(".mask, .vip_manage").hide();
                                    loadData();
                                    $(".vip_manage [name='amount']").val('');
                                    $(".vip_manage [name='remark']").val('');
                                });
                            } else {
                                $.alert(res.msg, '提示');
                            }
                            $.hideIndicator();
                        }
                    });
                });
            } else {
                $.alert('金额必须为大小0的数字')
            }
        });

        $("#recharge").click(function () {
            var id = $(".vip_manage [name='id']").val();
            var amount = $(".vip_manage [name='amount']").val();
            var remark = $(".vip_manage [name='remark']").val();
            if (!isNaN(amount) != '' && amount != '' && amount > 0) {
                $.confirm('确定要充值?', function () {
                    $.showIndicator()
                    $.ajax({
                        type: 'POST',
                        data: { id: id, amount: amount, remark: remark },
                        url: 'index.php?m=Home&c=Admin&a=recharge',
                        success: function (res) {
                            if (res.code == 0) {
                                $.alert('充值成功', '提示', function () {
                                    $(".mask, .vip_manage").hide();
                                    loadData();
                                    $(".vip_manage [name='amount']").val('');
                                    $(".vip_manage [name='remark']").val('');
                                });
                            } else {
                                $.alert(res.msg, '提示');
                            }
                            $.hideIndicator();
                        }
                    });
                });
            } else {
                $.alert('金额必须为大小0的数字')
            }
        });

        function loadData()
        {
            var keyword = $("#keyword").val();
            if (keyword == '') return;
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: { keyword: keyword },
                url: 'index.php?m=Home&c=Admin&a=getVip',
                success: function (res) {
                    if (res.code == 0) {
                        var html = '';
                        res.data.forEach(function (item) {
                            html += '<div class="content-block-title"> 用户id: ' + item.id + '</div>';
                            html += '<div class="list-block">';
                            html += '<ul>';
                            html += '<li class="item-content">';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title">姓名</div>';
                            html += '<div class="item-after">' + item.name + '</div>';
                            html += '</div>';
                            html += '</li>';
                            html += '<li class="item-content">';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title">会员等级</div>';
                            html += '<div class="item-after">' + item.level_name + '</div>';
                            html += '</div>';
                            html += '</li>';
                            html += '<li class="item-content">';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title">手机号</div>';
                            html += '<div class="item-after">' + item.mobile + '</div>';
                            html += '</div>';
                            html += '</li>';
                            html += '<li class="item-content">';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title label">联系地址</div>';
                            html += '<div class="item-input">' + item.address + '</div>';
                            html += '</div>';
                            html += '</li>';
                            html += '<li class="item-content">';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title">余额</div>';
                            html += '<div class="item-after">' + item.balance + '</div>';
                            html += '</div>';
                            html += '</li>';
                            html += '<li class="item-content">';
                            html += '<div class="vip-action" data-balance="' + item.balance + '" data-id="' + item.id + '">操作</div>';
                            html += '</li>';
                            html += '</ul>';
                            html += '</div>';
                        });
                        $("#vip-list").html(html);
                        if (html == '') {
                            $(".empty").show();
                        } else {
                            $(".empty").hide();
                        }
                    }
                    $.hideIndicator();
                }
            });
        }

        $("#keyword").blur(function(){
            loadData();
        });
    });

    //经营数据
    $(document).on("pageInit", "#page-admin-data", function (e, id, page) {
        loadData()
        function loadData()
        {   
            var startDay = $("#range .button.active").data('start');;
            var endDay = $("#range .button.active").data('end');;
            var type = $("#type .button.active").data('type');
            var data = { startDay, endDay, type }
            $.showIndicator()
            $.ajax({
                type: 'POST',
                data: data,
                url: 'index.php?m=Home&c=Admin&a=getCountData',
                success: function (res) {
                    if (res.code == 0) {
                        showChart(res.data)
                    }
                    $.hideIndicator();
                }
            });
            
        }
        $("#type .button").click(function () {
            $("#type .button").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        $("#range .button").click(function () {
            $("#range .button").removeClass('active');
            $(this).addClass('active');
            loadData();
        });

        function showChart(data)
        {
            F2.Global.setTheme({
                colors: ["#f9bf1f"]
            })
            var data = data;
            var chart = new F2.Chart({
                id: 'mountNode',
                pixelRatio: window.devicePixelRatio
            });

            chart.source(data, {
                value: {
                    tickCount: 5,
                    min: 0
                },
                date: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 3,
                }
            });
            chart.tooltip({
                custom: true,
                showXTip: true,
                showYTip: true,
                snap: true,
                crosshairsType: 'xy',
                crosshairsStyle: {
                    lineDash: [2]
                }
            });
            chart.axis('date', {
                label: function label(text, index, total) {
                    var textCfg = {};
                    if (index === 0) {
                        textCfg.textAlign = 'left';
                    } else if (index === total - 1) {
                        textCfg.textAlign = 'right';
                    }
                    return textCfg;
                }
            });
            chart.line().position('date*value');
            chart.render();
        }
    });


    $.init();
});