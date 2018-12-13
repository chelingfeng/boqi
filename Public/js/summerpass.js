$(function () {


    // 清除文本元素内容
    $('.clear').on('click', function(){
        var $clearBtn = $(this);
        $clearBtn.closest('div').find('input').val('');
    });

    //登录
    $(document).on("pageInit", "#login-form", function(e, id, page) {

        $("#login_action").click(function(){
            var useraccount = $("input[name='useraccount']").val();
            var password    = $("input[name='password']").val();
            if(useraccount == ''){
                $.alert('请输入账号', '提醒', function () {
                    $("input[name='useraccount']").focus();
                });
            }
            if(password == ''){
                $.alert('请输入密码', '提醒', function () {
                    $("input[name='password']").focus();
                });
            }
            $.showIndicator();
            $.ajax({
                type:'POST',
                url:configs.login_url,
                data:{useraccount:useraccount, password:password},
                success:function(data){
                    if(data.code  == 0){
                        if(configs.callback == ''){
                            // $.router.load(configs.index_url, true);
                            location.href = configs.index_url;
                        }else{
                            // $.router.load(configs.callback, true);
                            location.href = configs.callback;
                        }
                        
                    }else{
                        $.alert(data.msg);
                    }
                    $.hideIndicator();
                }
            });

        });

    });

    //详情
    $(document).on("pageInit", "#detail-form", function(e, id, page) {
        $("#back").click(function(){
            var applyid = $(this).attr('data-id');
            $.prompt('请输入驳回理由(非必填)', function(value){
                $.showIndicator();
                $.ajax({
                    type:'POST',
                    url:configs.change_url,
                    data:{remark:value, applyid:applyid, status:4},
                    success:function(data){
                        if(data.code == 0){
                            window.location.reload();
                        }else{
                            $.alert(data.msg);
                        }
                        $.hideIndicator();
                    }
                });
            });
        });

        $("#pass").click(function(){
            var applyid = $(this).attr('data-id');
            $.confirm('你确定吗?', function () {
                $.showIndicator();
                $.ajax({
                    type:'POST',
                    url:configs.change_url,
                    data:{applyid:applyid, status:1},
                    success:function(data){
                        if(data.code == 0){
                            window.location.reload();
                        }else{
                            $.alert(data.msg);
                        }
                        $.hideIndicator();
                    }
                });
            });
        });

    });

    //列表页
    $(document).on("pageInit", "#index-form", function(e, id, page) {
        var nodeIds = configs.nodeIds;
        if(nodeIds.indexOf('385') < 0){
            $.alert('您没有权限', '提醒', function () {
                $.router.load(configs.login_url);
                return false;
            });
        }
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
              if(configs.loading) return;
              configs.loading = true;
              configs.epage = configs.epage + 1;
              $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, firstSummerId:configs.firstSummerId},
                  success:function(data){
                      //console.log(data);
                      for(var i = 0; i < data.length; i++){
                          var html = "<li data-id='"+data[i].applyId+"'><a class='item-link item-content'><div class='item-inner'><div class='item-title-row'><div class='item-title'><b>"+data[i].studentName+"</b></div><div class='item-after stime'>"+data[i].createTime+"</div></div><div class='item-subtitle' ";
                          if(data[i].statusId == 0)
                            html += "style='color:red'";
                          html += ">"+data[i].status+"</div></div></a></li>";
                          $("#applylist").append(html);
                      }
                      configs.loading = false;
                      if(configs.epage >= configs.pageCount){
                          $.detachInfiniteScroll($('.infinite-scroll')); // 加载完毕，则注销无限加载事件，以防不必要的加载
                          $('.infinite-scroll-preloader').remove(); // 删除加载提示符
                      }
                      $.refreshScroller();
                  }
              });
          });

          $("#applylist li").live('click', function(){
              $.router.load(configs.detail_url+"&applyid="+$(this).attr('data-id'));
          });


    });

    // 初始化入口
    $.init();
});
