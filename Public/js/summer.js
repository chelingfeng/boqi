$(function () {

    //首页
    $(document).on("pageInit", "#page-agreement", function(e, id, page) {

        $(page).on('click','.check-agreement', function () {
        	var $this = $(this);
        	$this.toggleClass('checked');

        	if ( $this.hasClass('checked') ) {
        		$('.footer-agreement button').removeClass('disabled');
        	} else {
        		$('.footer-agreement button').addClass('disabled');
        	}

        });

        $(page).on('click','.footer-agreement button', function () {
        	var $this = $(this);
        	if ( $this.hasClass('disabled') ) {
        		return false;
        	}

        	$('.check-agreement').removeClass('checked');
        	$('.footer-agreement button').addClass('disabled');

            $.router.load(config.url_form);

        });

    });

    //提交申请
    $(document).on("pageInit", "#page-form", function(e, id, page) {

    	$(page).on('click', '#btn-submit', function(){
            var stuname   = $("input[name='stuname']").val();
            var starttime = $("input[name='starttime']").val();
            var endtime   = $("input[name='endtime']").val();
            var bedid     = $("input[name='bedid']").val();
            var remark    = $("textarea[name='remark']").val();
            if(starttime == ''){
                $.alert('请选择留宿开始时间', '提示', function () {
                    $("input[name='starttime']").focus();
                });
                return false;
            }
            if(endtime == ''){
                $.alert('请选择留宿结束时间', '提示', function () {
                    $("input[name='endtime']").focus();
                });
                return false;
            }
            $.showIndicator();
            $.ajax({
                type:'post',
                url:config.url_form,
                data:{stuname:stuname, starttime:starttime, endtime:endtime, bedid:bedid, remark:remark},
                success:function(data){
                    $.hideIndicator();
                    if(data.code != 0){
                        $.alert(data.msg);
                    }else{
                        $.router.load(config.url_success);
                    }
                }
            });
	    });

    });

    //绑定页
    $(document).on("pageInit", "#bind-form", function(e, id, page) {
        $.alert('请先绑定');
        $(page).on('click', '#bind-submit', function(){
            var name          = $("input[name='name']").val();
            var studentnumber = $("input[name='studentnumber']").val();
            if(name == ''){
                $.alert('请输入姓名', '提示', function () {
                    $("input[name='name']").focus();
                });
                return false;
            }
            if(studentnumber == ''){
                $.alert('请输入学号', '提示', function () {
                    $("input[name='studentnumber']").focus();
                });
                return false;
            }
            var schoolcode = $("input[name='schoolcode']").val();
            var openid     = $("input[name='openid']").val();
            $.showIndicator();
            $.ajax({
                type: 'post',
                url:config.url_bind,
                data:{schoolcode:schoolcode, openid:openid, studentnumber:studentnumber, name:name},
                success:function(data){
                    if(data.code != 0){
                        $.alert(data.msg);
                    }else{
                        $.router.load(config.url_index);
                    }
                    $.hideIndicator();
                }
            });
            
        });

    });


    //详情页
    $(document).on("pageInit", "#page-detail", function(e, id, page) {
       $(page).on('click', '#cancel', function(){
           var applyid    = $("input[name='applyid']").val();
           var schoolcode = $("input[name='schoolcode']").val();
           var openid     = $("input[name='openid']").val();
          
           $.confirm('你确定取消吗?', function () {
                $.showIndicator();
                $.ajax({
                    type: 'post',
                    url:config.url_detail,
                    data:{schoolcode:schoolcode, openid:openid, applyid:applyid},
                    success:function(data){
                        if(data.code != 0){
                            $.alert(data.msg);
                        }else{
                            window.location.reload();
                        }
                        $.hideIndicator();
                    }
                });
           });
            
       });

       $(page).on('click', '#resubmit', function(){
            $.router.load(config.url_form);
       });

    });



    //成功页
    $(document).on("pageInit", "#page-success", function(e, id, page) {
        setTimeout(function(){
            $.router.load(config.url_detail, true);
        }, 2000);
      
    });

    

    // 初始化入口
    $.init();
});
