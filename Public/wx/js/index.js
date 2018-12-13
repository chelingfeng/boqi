$(function () {
    'use strict';

    $(document).on("pageInit", "", function(e, id, page) {
        $(".qidai").die("click").live('click', function () {
    		$.alert('该功能即将开放!', '提示');
    	});
    });

    //会员首页
    $(document).on("pageInit", "#page-vip-index", function (e, id, page) {
        $(".no-vip").click(function () {
            $.alert('开通会员后查看权益', '提示');
        });
        $(".recharge").click(function(){
            $.prompt('请输入充值金额?', '提示', function (value) {
                if (!isNaN(value) != '' && value != '' && value > 0) {
                    $.showPreloader()
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
                            $.hidePreloader()
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
        $.showPreloader()
        $.ajax({
            type:'POST',
            data:{},
            url:'index.php?m=Home&c=Vip&a=getCard',
            success:function(res){
                var html = '';
                
                if (res.data.card.length > 0) {
                    res.data.card.forEach(function (item) {
                        html += '<div class="card-list" style="background:url(' + item.background + ') 0 0 no-repeat;background-size:100% 100%;">';
                        html += '<p class="quanyi">查看会员权益 ></p>';
                        html += '<p class="bottom-left">' + res.data.index_tips + '</p>';
                        html += '<img src="' + res.data.user.avatar + '" class="headimg" />';
                        html += '<span class="name">' + res.data.user.nickname + '</span>';
                        html += '<span class="vip-level">' + item.title + '</span>';
                        html += "<a class='button open' onclick='' data-data='" + JSON.stringify(item) +"'>马上开通</a>";
                        html += '</div>';
                    });
                } else {
                    html = '<div class="empty"><p>没有可以开通的会员。</p></div>';
                }
                
                $(".page").html(html);
                $.hidePreloader()
            }
        })

        $("#page-vip-card .open").die("click").live('click', function() {
            var data = JSON.parse($(this).data('data'));
            $.confirm('开通'+data.title+'需要余额大于'+(data.amount/100)+'元，确定要开通吗？', '提示', function () {
                $.showPreloader()
                $.ajax({
                    type: 'POST',
                    data: {id:data.id},
                    url: 'index.php?m=Home&c=Vip&a=openVip',
                    success: function (res) {
                        if (res.code == 0) {
                            $.alert('开通成功', '提示', function () {               
                                location.href = 'index.php?m=Home&c=Vip&a=index';
                            });
                        } else {
                            $.alert(res.msg, '提示', function(){
                                if (res.code == 20001) {
                                    location.href = 'index.php?m=Home&c=Vip&a=index';
                                } else {
                                    window.location.reload();
                                }
                            });
                        }
                        $.hidePreloader()
                    }
                });
            });
        });
    });

    //会员信息页
    $(document).on("pageInit", "#page-vip-message", function (e, id, page) {
        $.showPreloader()
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
                $.hidePreloader()
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
                $.alert('联系地址不能为空', '提示');
                return false;
            }
            $.showPreloader();
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
                    $.hidePreloader()
                }
            })
        });
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

        loadData();

        function loadData() {
            var type = $('#type .active').data('type');
            var status = $('#status .active').data('status');
            $.showPreloader()
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
                            html += '<div class="right qidai">';
                                html += '<p>立</p>';
                                html += '<p>即</p>';
                                html += '<p>使</p>';
                                html += '<p>用</p>';
                            html += '</div>';
                        html += '</div>';
                    });
                    
                    if (html == '') {
                        $(".empty").show();
                    } else {
                        $(".empty").hide();
                    }

                    if (status == 'receive') {
                        $('.datalist').css('opacity', '1');
                    } else {
                        $('.datalist').css('opacity', '0.5');
                    }

                    $(".datalist").html(html);
                    $.hidePreloader()
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
            $.showPreloader()
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
                    $.hidePreloader()
                }
            });
        }
    });

    function pay(orderId = '', callback = '')
    {   
        console.log(orderId);
        if (orderId) {
            if (callback == '') {
                callback = location.href;
            }
            wx.miniProgram.navigateTo({ url: '/pages/pay/pay?orderId=' + orderId + '&callback=' +encodeURIComponent(callback) })
        }
    }

    $.init();
});