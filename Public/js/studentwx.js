
 

$(function (){


    Isbinding();

 
    function Isbinding(){
      $.post(hqb.root+"/index.php?m=Apartment&c=Swap&a=Isbinding", 
      {
          schoolcode:hqb.schoolcode,openid:hqb.openid,              
        }, function(res) 
        {   
            if(res.code == 40013) //40013
            {    
               $.router.load(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=login&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);
               $.confirm(res.msg, function () { 

            }); 
            }
            else
            {  
                $.post(hqb.root+"/index.php?m=Apartment&c=Swap&a=getliststudentsummer",
                {
                    schoolcode:hqb.schoolcode,openid:hqb.openid,  
                },function (data)
                {  
                  console.log(data);
                  sessionStorage.setItem('studentNumber',data.data.studentNumber);
                  $.router.load(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+data.data.studentNumber, true);
                },'json')
                
            }        
        }, 'json'); 
     }

	//加载登陆页面
	$(document).on("pageInit","#useraccount_login",function(e , id , page) {
 
		$('.btnConfirm').click(function(){
            var studentName = $('#name').val();
            var studentNumber = $('#studentnumber').val();
            sessionStorage.setItem('studentNumber',studentNumber); // 存入studentNumber
            if (studentName =='') {
              $.alert('姓名不能为空');
              return false;
            };
            if (studentNumber == '') {
              $.alert('学号不能为空');
              return false;
            };
            $.showIndicator();
            $.post(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=bindmessage", { 
                studentName: studentName,studentNumber:studentNumber,schoolcode:hqb.schoolcode,openid:hqb.openid,                
            }, function(res) {
                console.log(res);
                 
                if (res.code == '40011') {
                   $.alert(res.msg);
                   $.hideIndicator();
                   return false;
                }
               else{             
                    $.router.load(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber, true);
                }
                $.hideIndicator();
                }, 'json');
 
		})
	})


    //加载我的请假
    $(document).on("pageInit","#useraccount_index",function( e , id , page ){
          //跳转到我要请假页面
          $('.leaveBtn').click( function() { 
            var studentNumber = sessionStorage.getItem('studentNumber');
            $.router.load(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=leave&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber, true);
          });


          $('.More').click(function(){
            var studentNumber = sessionStorage.getItem('studentNumber');
            configs.epage = configs.epage + 1;
            $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, keyword:studentNumber , schoolcode:hqb.schoolcode },
                  success:function(data){

                    if (data.list.length == 0) {
                      $('.More').hide();
                      return false;
                    };

                    console.log(data);
                      var html ='';
                      var list = data.list;
                      for(var i = 0; i < list.length; i++){                            
                           html += '<div class="leaveList clearfix">';
                           html += '<h3>'+list[i].addtime+'</h3>';
                           html += '<p><span class="leaveList-left">请假时间：</span><span class="leaveList-right"><em>'+list[i].begintime+'</em>至</br><i> '+list[i].endtime+'</i></span></p>';
                           html += '<p><span class="leaveList-left">请假内容：</span><span class="leaveList-right reason">'+list[i].memo+'</span></p>';
                           html += '<p><span class="leaveList-left">状态：</span>';
                           if (list[i].ispass == '通过') {  
                                html += '<span class="leaveList-right adopt">通过</span>';
                           }else if(list[i].ispass == '未通过'){  
                                html += '<span class="leaveList-right notThrough">未通过</span>';
                           }else{ 
                                html += '<span class="leaveList-right review">待审核</span>';
                           }  
                           html += '</p> ';
                           html += '</div> ';
                      }

                      $('#div_content').append(html);
                      
                  }
              });
          })
 

          $(document).on('infinite', '.infinite-scroll-top',function() { 

              if(configs.loading) return;
              configs.loading = true;
              
              var studentNumber = sessionStorage.getItem('studentNumber');
              $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, keyword:studentNumber , schoolcode:hqb.schoolcode },
                  success:function(data){
                       
                      for(var i = 0; i < data.list.length; i++){ 
                          var bt=baidu.template;
                          var html = bt('t:_1234-abcd-1',data);
                          document.getElementById('contentjoin').innerHTML=html;
                           
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
    }) 
 

    //加载我要请假
    $(document).on("pageInit","#useraccount_leave",function(){

            //选择时间
            var now = new Date();
            var month = now.getMonth() + 1;
            if ( month <= 9) { 
                 month = '0'+month;
            }

            var date = now.getDate();

            if ( date <= 9) {
                date = '0'+date;
            };


            var hours = now.getHours();
            if ( hours <= 9) {
                hours = '0'+hours;
            };

            var minutes = now.getMinutes();
            if (minutes <= 9) {
                minutes = '0'+minutes;
            };
 
            $("#datetime-picker").datetimePicker({ 
                value: [now.getFullYear(),month, date,hours, minutes]
            });

            var now = new Date();
            $("#datetime-picker-second").datetimePicker({
                value: [now.getFullYear(), month, date, hours, minutes]
            });



            //提交申请
            $('.btn_apply').click(function(){
                var studentNumber = sessionStorage.getItem('studentNumber');
                var begintime = $('.begintime').val()+':00';
                var endtime   = $('.endtime').val()+':00';
                var memo      = $('.memo').val();
                $.post(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=alivestudent_add", { 
                    begintime: begintime,endtime:endtime,studentnumber:studentNumber,schoolcode:hqb.schoolcode,memo:memo         
                }, function(res) {
                    console.log(res);
                    if (res.code == '0') {
                        $.alert(res.msg);
                        $.router.load(hqb.root+"/index.php?m=ExitManagement&c=StudentWX&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber, true);
                    }
                    else{                
                        $.alert(res.msg);
                        return false;   
                    }
                    $.hideIndicator();
                }, 'json');

            })
    })

 // 初始化入口
    $.init();
});



