$(function () {

    //登录
    $(document).on("pageInit", "#index-form", function(e, id, page) {
        $("#searchform").submit(function(){
          var key = $("input[name='key']").val();
          if(key == '') return;
          $.showIndicator();
          $.ajax({
            type:'post',
            url:configs.search_url,
            data:{key:key},
            success:function(data){
                $("#studentList li").remove();
                configs.pageCount = data.pageCount;
                configs.epage     = 1;
                configs.loading   = false;
                if(configs.pageCount > 1){
                  $('.infinite-scroll-preloader').show();
                }else{
                  $('.infinite-scroll-preloader').hide();
                }
                if(data.list.length == 0) $.alert('没有该学生');
                for(var i = 0; i < data.list.length; i++){
                    if(typeof(data.list[i].headImgurl) == 'undefined' || data.list[i].headImgurl == ''){
                      var icon = configs.default_pic;
                    }else{
                      var icon = data.list[i].headImgurl;
                    }
                    var html = "<li data-id='"+data.list[i].studentKey+"'><div class='item-content'><div class='item-media'><img src='"+icon+"' width='44'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+data.list[i].name+"("+data.list[i].studentNumber+")</div></div><div class='item-subtitle'>"+data.list[i].className+"</div></div></div></li>";
                    $("#studentList").append(html);
                }
                $.hideIndicator();
            }
          });
          return false;
        });


        $(document).on('infinite', '.infinite-scroll-bottom',function() {
              var nodeIds = configs.nodeIds;
              if(nodeIds.indexOf('391') < 0){
                  $.alert('您没有权限', '提醒', function () {
                      $.router.load(configs.login_url);
                      return false;
                  });
              }
              if(configs.loading) return;
              configs.loading = true;
              configs.epage   = configs.epage + 1;
              if(configs.epage >= configs.pageCount){
                  //$.detachInfiniteScroll($('.infinite-scroll-bottom')); // 加载完毕，则注销无限加载事件，以防不必要的加载
                  $('.infinite-scroll-preloader').hide(); // 删除加载提示符
                  return false;
              }
              $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, key:$("input[name='key']").val()},
                  success:function(data){
                      console.log(data);
                      for(var i = 0; i < data.length; i++){
                          if(typeof(data[i].headImgurl) == 'undefined' || data[i].headImgurl == ''){
                            var icon = configs.default_pic;
                          }else{
                            var icon = data[i].headImgurl;
                          }
                          var html = "<li data-id='"+data[i].studentKey+"'><div class='item-content'><div class='item-media'><img src='"+icon+"' width='44'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+data[i].name+"("+data[i].studentNumber+")</div></div><div class='item-subtitle'>"+data[i].className+"</div></div></div></li>";
                          $("#studentList").append(html);
                      }
                      configs.loading = false;
                      $.refreshScroller();
                  }
              });
          });

        $("#studentList li").live('click', function(){
            var id = $(this).attr('data-id');
            $.router.load(configs.detail_pic+"&studentkey="+id);
        });
        
    });

    //详情
    $(document).on("pageInit", "#detail-form", function(e, id, page) {
       $(".buttons-tab a").click(function(){
       		var index = $(".buttons-tab a").index(this);
       		$(".buttons-tab a").removeClass('active');
       		$(this).addClass('active');
       		$("#st_message, #time_axis, #evaluation_table").hide();
       		if(index == 0){
       			$("#st_message").show();
       		}else if(index == 1){
       			$("#time_axis").show();
       		}else{
       			$("#evaluation_table").show();
       		}
       });
    });

    

    // 初始化入口
    $.init();
});
