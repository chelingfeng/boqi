'use strict';

$(function(){

	$(document).on('pageInit','#useraccount_login',function(e,id,page){

		$(page).on('click','.button-login',function(){
			var useraccount = $('#useraccount').val();
			if(useraccount == ''){$.alert('请输入账号');return false;}
			var password = $('#password').val();
			if(password == '') {$.alert('请输入密码');return false;}

			$.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=accountlogin", 
            {
                useraccount:useraccount,password:password,
            }, function(res) 
            {
                console.log(res);
                if(res.code == 0)
                { 
                    $.router.load(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=index&schoolcode="+hqb.schoolcode+"&token="+hqb.token, true);
                    //存入 
                    sessionStorage.adminId = res.data.adminId; 
                }
                else
                {
                    $.alert(res.msg);
                    return false;
                } 
                    
            }, 'json'); 
		});
	});


			//入住列表
			function livelist()
			{
 				$.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=livelist", 
                {
                    schoolcode:hqb.schoolcode,orderflag:2,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {  
                    	$('#livenone').hide();
                        $('#livedetail').hide();
                        $('#livelist').show();
                        $("#ui_live").find("li").remove();
                        var data = res.data.list;
                        var html ='';
                        for(var i =0; i<data.length;i++)
                        {
                            html+='<li> ';                           
                            html+='<a class="item-link item-content item_livedetail" data-addTime ="'+data[i].addTime+'" data-adminName ="'+data[i].adminName+'"  data-id="'+data[i].checkinId+'" data-classPath="'+data[i].classPath+'" data-memo="'+data[i].memo+'" data-name="'+data[i].name+'" data-roomPath="'+data[i].roomPath+'" data-statusId="'+data[i].statusId+'" data-statusName="'+data[i].statusName+'" data-statusType="'+data[i].statusType+'" data-studentNumber="'+data[i].studentNumber+'">';                            
                            html+='<div class="item-inner">';
                            html+='<div class="item-title-row">';
                            html+='<div class="item-title"><b>'+data[i].name+'的调宿申请</b></div>';
                            html+='<div class="item-after" style="margin-left: 0px;font-size: 12px;">'+data[i].addTime+'</div>';                           
                            html+='</div>';
                           
                            if (data[i].statusId == 0)  //待审批
                            {
                                html+='<div class="item-subtitle" style="color:red;">'+data[i].statusName+'</div>';
                            }
                            else 
                            {
                                html+='<div class="item-subtitle" style="color: #000;">'+data[i].statusName+'</div>';
                            }
                            

                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#ui_live").append(html);
                    }
                    else
                    {
                        //$.alert(res.msg);
                        $('#livenone').show();
                        $('#livedetail').hide();
                        $('#livelist').hide();
                        return false;
                    }  
                }, 'json'); 
			}


			function changelist()
			{
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=ChangeList", 
                {
                    schoolcode:hqb.schoolcode,orderflag:2,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {  
                        $("#ui_change").find("li").remove();
                        var data = res.data.list;
                        var html ='';
                        for(var i =0; i<data.length;i++)
                        {
                            html+='<li> ';                           
                            html+='<a class="item-link item-content item_changedetail" data-addTime ="'+data[i].addTime+'" data-adminName ="'+data[i].adminName+'"  data-id="'+data[i].changeroomId+'" data-classPath="'+data[i].classPath+'" data-memo="'+data[i].memo+'" data-name="'+data[i].name+'" data-newRoomPath="'+data[i].newRoomPath+'" data-oldRoomPath="'+data[i].oldRoomPath+'" data-statusId="'+data[i].statusId+'" data-statusName="'+data[i].statusName+'" data-statusType="'+data[i].statusType+'" data-studentNumber="'+data[i].studentNumber+'">';                            
                            html+='<div class="item-inner">';
                            html+='<div class="item-title-row">';
                            html+='<div class="item-title"><b>'+data[i].name+'的调宿申请</b></div>';
                            html+='<div class="item-after" style="margin-left: 0px;font-size: 12px;">'+data[i].addTime+'</div>';                           
                            html+='</div>';
                          
                            if (data[i].statusId == 0)  //待审批
                            {
                                html+='<div class="item-subtitle" style="color: red;">'+data[i].statusName+'</div>';
                            }
                            else
                            {
                                html+='<div class="item-subtitle" style="color:#000;;">'+data[i].statusName+'</div>';
                            }
                          

                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#ui_change").append(html);
                    }
                    else
                    {
                        $('#changenone').show();
                        $('#changedetail').hide();
                        $('#changelist').hide();
                        return false;
                    }  
                }, 'json'); 
			}


			function betweenlist()
			{
               $.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=betweenlist", 
                {
                    schoolcode:hqb.schoolcode,orderflag:2,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {  
                        $("#ui_between").find("li").remove();
                        var data = res.data.list;
                        var html ='';
                        for(var i =0; i<data.length;i++)
                        {
                            html+='<li> ';                           
                            html+='<a class="item-link item-content item_betweendetail" data-Aname ="'+data[i].Aname+'" data-AroomPath ="'+data[i].AroomPath+'"  data-AstudentNumber="'+data[i].AstudentNumber+'" data-Bname="'+data[i].Bname+'" data-BroomPath="'+data[i].BroomPath+'" data-BstudentNumber="'+data[i].BstudentNumber+'" data-addTime="'+data[i].addTime+'" data-adminName="'+data[i].adminName+'" data-id="'+data[i].betweenId+'" data-memo="'+data[i].memo+'" data-statusId="'+data[i].statusId+'" data-statusName="'+data[i].statusName+'" data-statusType="'+data[i].statusType+'">';                            
                            html+='<div class="item-inner">';
                            html+='<div class="item-title-row">';
                            html+='<div class="item-title"><b>'+data[i].Aname+'和'+data[i].Bname+'的相互调宿申请</b></div>';
                            html+='<div class="item-after" style="margin-left: 0px;font-size: 12px;">'+data[i].addTime+'</div>';                           
                            html+='</div>';

                            if (data[i].statusId == 0)  //待审批
                            {
                                html+='<div class="item-subtitle" style="color: red;">'+data[i].statusName+'</div>';
                            }
                            else
                            {
                                html+='<div class="item-subtitle" style="color:#000;;">'+data[i].statusName+'</div>';
                            }                            

                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#ui_between").append(html);
                    }
                    else
                    {
                        $('#betweennone').show();
                        $('#betweendetail').hide();
                        $('#betweenlist').hide();
                        return false;
                    }  
                }, 'json'); 
			}

			function quitlist()
			{
 				$.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=QuitList", 
                {
                    schoolcode:hqb.schoolcode,orderflag:2,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {  
                        $("#ui_quit").find("li").remove();
                        var data = res.data.list;
                        var html ='';
                        for(var i =0; i<data.length;i++)
                        {
                            html+='<li> ';                           
                            html+='<a class="item-link item-content item_quitdetail" data-addTime ="'+data[i].addTime+'" data-adminName ="'+data[i].adminName+'"  data-classPath="'+data[i].classPath+'" data-memo="'+data[i].memo+'" data-name="'+data[i].name+'" data-id="'+data[i].outrommId+'" data-roomPath="'+data[i].roomPath+'" data-statusId="'+data[i].statusId+'" data-statusName="'+data[i].statusName+'" data-statusType="'+data[i].statusType+'" data-studentNumber="'+data[i].studentNumber+'">';                            
                            html+='<div class="item-inner">';
                            html+='<div class="item-title-row">';
                            html+='<div class="item-title"><b>'+data[i].name+'的退宿申请</b></div>';
                            html+='<div class="item-after" style="margin-left: 0px;font-size: 12px;">'+data[i].addTime+'</div>';                           
                            html+='</div>';
                            if (data[i].statusId == 0)  //待审批
                            {
                                html+='<div class="item-subtitle" style="color: red;">'+data[i].statusName+'</div>';
                            }
                            else
                            {
                                html+='<div class="item-subtitle" style="color:#000;;">'+data[i].statusName+'</div>';
                            }  
 
                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#ui_quit").append(html);
                    }
                    else
                    {
                        $('#quitnone').show();
                        $('#quitdetail').hide();
                        $('#quitlist').hide();
                        return false;
                    }  
                }, 'json'); 
			}



	$(document).on('pageInit','#index-approval',function(e,id,page){
		livelist();// 入住 列表
		changelist();// 调宿 列表
		betweenlist();// 相互调宿 列表
		quitlist(); // 退宿 列表

		//点击入住
		$(page).on('click','.mylive',function(){
			livelist();
			$('#livelist').show();
			$('#livedetail').hide();
			$('#livenone').hide();

		});
		//点击调宿
		$(page).on('click','.mychange',function(){
			changelist();
			$('#changelist').show();
			$('#changedetail').hide();
			$('#changenone').hide();
		});


		//点击相互调宿
		$(page).on('click','.mybetween',function(){
			betweenlist();
			$('#betweenlist').show();
			$('#betweendetail').hide();
			$('#betweennone').hide();
		});


		$(page).on('click','.myquit',function(){
			quitlist();
			$('#quitlist').show();
			$('#quitdetail').hide();
			$('#quitnone').hide();
		});



		//驳回
		$(page).on('click','.btn_liveoverrule',function(){
			var id = $('#live_id').val();  
            var adminId = sessionStorage.adminId;   
            $.prompt('请输入驳回理由', function (value) {
                getliveeout(id,adminId,3,value);
            });
		});
		//审批
		$(page).on('click','.btn_liveapproval',function(){
			var id = $('#live_id').val();  
            var adminId = sessionStorage.adminId;   
            $.confirm('确认要审批这条记录吗?', function () {
            	getliveeout(id,adminId,1);
            });
			
		});


		function getliveeout(id,adminId,statusid,value)
		{
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=livebatchcheck", 
                {
                    schoolcode:hqb.schoolcode,checkinids:id,createbyid:adminId,createrol:1,status:statusid,memo:value,
                }, function(res) 
                {
                    if (res.code == 0) 
                    {
                        if(statusid == 0)
                        {
                            $.alert('审批成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        livelist();
                        $('#livelist').show();
                        $('#livedetail').hide(); 
                        $('#livenone').hide();
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
		}

		//入住详细
		$(page).on('click','.item_livedetail',function(){ 
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-statustype');
            var status = $(this).attr('data-statusname');
            var name = $(this).attr('data-name');
            var studentNumber = $(this).attr('data-studentnumber');

            var classpath = $(this).attr('data-classpath');
            
            var arr=new Array();
            if (classpath != '') 
            {
                arr = classpath.split('-');
            }
            var roomPath = $(this).attr('data-roomPath'); 
            var memo = $(this).attr('data-memo');


            $('#item_type').html('<b>'+type+'</b>');


            var statusid = $(this).attr('data-statusid'); 

            if(statusid == 4)
            {
                $('#item_status').html('<div class="item-subtitle" style="color: #000;">'+status+'</div>');
            }
            else if (statusid == 0)
            {
                $('#item_status').html('<div class="item-subtitle" style="color: #1a9bfc;">'+status+'</div>');
            }
            else if (statusid == 1)
            {
                $('#item_status').html('<div class="item-subtitle" style="color: #50b430;">'+status+'</div>');
            }
            else if (statusid == 2)
            {
                $('#item_status').html('<div class="item-subtitle" style="color: #d7d7d7;">'+status+'</div>');
            }
            else if (statusid == 3)
            {
                $('#item_status').html('<div class="item-subtitle" style="color: #f68329;">'+status+'</div>');
            }

            $('#div_name').html(name);
            $('#div_studentNumber').html(studentNumber);
            $('#div_college').html(arr[0]);
            $('#div_class').html(arr[1]+'-'+arr[2]);
            $('#div_roomPath').html(roomPath); 
            $('#div_memo').html(memo); 
            $('#live_id').val(id);  
            if (statusid == 4) 
            {
                $('#div_live').hide();                 
                $('#div_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_live').show(); 
                $('#div_back').hide(); 

            }
            else if(statusid == 3)
            {
                    $.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=get_checkindetail_bykey", 
                    {
                        checkinid:id,              
                    }, function(res) 
                    {
                        console.log(res);
                        for(var i = 0;i<res.data.list.length;i++)
                        {
                            if (res.data.list[i].status == 3) 
                            {
                                $('#div_recordMemo').html(res.data.list[i].memo);
                            } 
                        }

                    }, 'json');   

                $('#div_back').show(); 
                $('#div_live').hide(); 
            }
            else
            {
                $('#div_live').hide(); 
                $('#div_back').hide(); 
            }

            $('#livelist').hide();
            $('#livedetail').show();
         });

		 //调宿详细
		 $(page).on('click','.item_changedetail',function(){ 
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-statustype');
            var status = $(this).attr('data-statusname');
            var name = $(this).attr('data-name');
            var studentNumber = $(this).attr('data-studentnumber');

            var classpath = $(this).attr('data-classpath');
            
            var arr=new Array();
            if (classpath != '') 
            {
                arr = classpath.split('-');
            }
            var oldroompath = $(this).attr('data-oldroompath');
            var newroompath = $(this).attr('data-newroompath');
            var memo = $(this).attr('data-memo');


            $('#itemc_type').html('<b>'+type+'</b>');


            var statusid = $(this).attr('data-statusid'); 
            if(statusid == 4)
            {
                $('#itemc_status').html('<div class="item-subtitle" style="color: #000;">'+status+'</div>');
            }
            else if (statusid == 0)
            {
                $('#itemc_status').html('<div class="item-subtitle" style="color: #1a9bfc;">'+status+'</div>');
            }
            else if (statusid == 1)
            {
                $('#itemc_status').html('<div class="item-subtitle" style="color: #50b430;">'+status+'</div>');
            }
            else if (statusid == 2)
            {
                $('#itemc_status').html('<div class="item-subtitle" style="color: #d7d7d7;">'+status+'</div>');
            }
            else if (statusid == 3)
            {
                $('#itemc_status').html('<div class="item-subtitle" style="color: #f68329;">'+status+'</div>');
            }

            $('#divc_name').html(name);
            $('#divc_studentNumber').html(studentNumber);
            $('#divc_college').html(arr[0]);
            $('#divc_class').html(arr[1]+'-'+arr[2]);
            $('#divc_oldRoomPath').html(oldroompath);
            $('#divc_newRoomPath').html(newroompath);
            $('#divc_memo').html(memo); 
            $('#change_id').val(id); 
 
            if (statusid == 4) 
            {
                $('#div_change').hide(); 
                $('#divc_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_change').show(); 
                $('#divc_back').hide(); 
            }
            else if(statusid == 3)
            {
                    $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=get_detail_bykey", 
                    {
                        changeid:id,              
                    }, function(res) 
                    {
                        console.log(res);
                        for(var i = 0;i<res.data.recordList.length;i++)
                        {
                            if (res.data.recordList[i].recordStatus == 3) 
                            {
                                $('#divc_recordMemo').html(res.data.recordList[i].recordMemo);
                            } 
                        }

                    }, 'json');   

                $('#divc_back').show(); 
                $('#div_change').hide(); 
            }
            else
            {
                $('#div_change').hide(); 
                $('#divc_back').hide(); 
            }

            $('#changelist').hide();
            $('#changedetail').show();
         });



		//驳回
		$(page).on('click','.btn_changeoverrule',function(){
			var id = $('#change_id').val();  
            var adminId = sessionStorage.adminId;   
            $.prompt('请输入驳回理由', function (value) {
                getchangeout(id,adminId,3,value);
            });
		});
		//审批
		$(page).on('click','.btn_changeapproval',function(){
			var id = $('#change_id').val();  
            var adminId = sessionStorage.adminId;   
            $.confirm('确认要审批这条记录吗?', function () {
            	getchangeout(id,adminId,1);
            });
			
		});


		function getchangeout(id,adminId,statusid,value)
		{
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=chagebatchcheck", 
                {
                    schoolcode:hqb.schoolcode,changeids:id,createbyid:adminId,createrol:1,status:statusid,memo:value,
                }, function(res) 
                {
                    if (res.code == 0) 
                    {
                        if(statusid == 0)
                        {
                            $.alert('审批成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        changelist();
                        $('#changelist').show();
                        $('#changedetail').hide(); 
                        $('#changenone').hide();
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
		}





 		//调宿详细
		 $(page).on('click','.item_betweendetail',function(){ 

            var id = $(this).attr('data-id');
            var type = $(this).attr('data-statustype');
            var status = $(this).attr('data-statusname');

            var Aname = $(this).attr('data-Aname');
            var AroomPath = $(this).attr('data-AroomPath');

            var Bname = $(this).attr('data-Bname');
            var BroomPath = $(this).attr('data-BroomPath');

            var classpath = $(this).attr('data-classpath');
            
         
            var memo = $(this).attr('data-memo');


            $('#itemb_type').html('<b>'+type+'</b>');


            var statusid = $(this).attr('data-statusid'); 
            if(statusid == 4)
            {
                $('#itemb_status').html('<div class="item-subtitle" style="color: #000;">'+status+'</div>');
            }
            else if (statusid == 0)
            {
                $('#itemb_status').html('<div class="item-subtitle" style="color: #1a9bfc;">'+status+'</div>');
            }
            else if (statusid == 1)
            {
                $('#itemb_status').html('<div class="item-subtitle" style="color: #50b430;">'+status+'</div>');
            }
            else if (statusid == 2)
            {
                $('#itemb_status').html('<div class="item-subtitle" style="color: #d7d7d7;">'+status+'</div>');
            }
            else if (statusid == 3)
            {
                $('#itemb_status').html('<div class="item-subtitle" style="color: #f68329;">'+status+'</div>');
            }

            $('#divb_Aname').html(Aname);
            $('#divb_AroomPath').html(AroomPath);

            $('#divb_Bname').html(Bname);
            $('#divb_BroomPath').html(BroomPath);
           
            $('#divb_memo').html(memo); 
            $('#between_id').val(id); 
 
            if (statusid == 4) 
            {
                $('#div_between').hide(); 
                $('#divb_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_between').show(); 
                $('#divb_back').hide(); 
            }
            else if(statusid == 3)
            {
                    $.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=get_betweendetail_bykey", 
                    {
                        betweenid:id,              
                    }, function(res) 
                    {
                        console.log(res);
                        for(var i = 0;i<res.data.recordList.length;i++)
                        {
                            if (res.data.recordList[i].recordStatus == 3) 
                            {
                                $('#divb_recordMemo').html(res.data.recordList[i].recordMemo);
                            } 
                        }

                    }, 'json');   

                $('#divb_back').show(); 
                $('#div_between').hide(); 
            }
            else
            {
                $('#div_between').hide(); 
                $('#divb_back').hide(); 
            }

            $('#betweenlist').hide();
            $('#betweendetail').show();
         });




		//驳回
		$(page).on('click','.btn_betweenoverrule',function(){
			var id = $('#between_id').val();  
            var adminId = sessionStorage.adminId;   
            $.prompt('请输入驳回理由', function (value) {
                getbetweenout(id,adminId,3,value);
            });
		});
		//审批
		$(page).on('click','.btn_betweenapproval',function(){
			var id = $('#between_id').val();  
            var adminId = sessionStorage.adminId;   
            $.confirm('确认要审批这条记录吗?', function () {
            	getbetweenout(id,adminId,1);
            });
			
		});


		function getbetweenout(id,adminId,statusid,value)
		{
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapApproval&a=betweenbatchcheck", 
                {
                    schoolcode:hqb.schoolcode,betweenids:id,createbyid:adminId,createrol:1,status:statusid,memo:value,
                }, function(res) 
                {
                    if (res.code == 0) 
                    {
                        if(statusid == 0)
                        {
                            $.alert('审批成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        betweenlist();
                        $('#betweenlist').show();
                        $('#betweendetail').hide(); 
                        $('#betweennone').hide();
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
		}

		/*
		*退宿详情
		*/
		$(page).on('click','.item_quitdetail',function(){

            var id = $(this).attr('data-id');
            var type = $(this).attr('data-statustype');
            var status = $(this).attr('data-statusname');
            var name = $(this).attr('data-name');
            var studentNumber = $(this).attr('data-studentnumber');

            var classpath = $(this).attr('data-classpath');
            
            var arr=new Array();
            if (classpath != '') 
            {
                arr = classpath.split('-');
            }
            var roompath = $(this).attr('data-roompath'); 
            var memo = $(this).attr('data-memo');


            $('#itemq_type').html('<b>'+type+'</b>');


            var statusid = $(this).attr('data-statusid'); 
            if(statusid == 4)
            {
                $('#itemq_status').html('<div class="item-subtitle" style="color: #000;">'+status+'</div>');
            }
            else if (statusid == 0)
            {
                $('#itemq_status').html('<div class="item-subtitle" style="color: #1a9bfc;">'+status+'</div>');
            }
            else if (statusid == 1)
            {
                $('#itemq_status').html('<div class="item-subtitle" style="color: #50b430;">'+status+'</div>');
            }
            else if (statusid == 2)
            {
                $('#itemq_status').html('<div class="item-subtitle" style="color: #d7d7d7;">'+status+'</div>');
            }
            else if (statusid == 3)
            {
                $('#itemq_status').html('<div class="item-subtitle" style="color: #f68329;">'+status+'</div>');
            }

            $('#divq_name').html(name);
            $('#divq_studentNumber').html(studentNumber);
            $('#divq_college').html(arr[0]);
            $('#divq_class').html(arr[1]+'-'+arr[2]);
            $('#divq_roompath').html(roompath); 
            $('#divq_memo').html(memo); 
            $('#quit_id').val(id);  

            if (statusid == 4) 
            {
                $('#div_quit').hide(); 
                $('#divq_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_quit').show(); 
                $('#divq_back').hide(); 
            }
            else if(statusid == 3)
            {
                    $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=get_outroomdetail_bykey", ////要改成退宿接口
                    {
                        outroomid:id,              
                    }, function(res) 
                    {
                        console.log(res);
                        for(var i = 0;i<res.data.recordList.length;i++)
                        {
                            if (res.data.recordList[i].recordStatus == 3) 
                            {
                                $('#divq_recordMemo').html(res.data.recordList[i].recordMemo);
                            } 
                        }

                    }, 'json');   

                $('#divq_back').show(); 
                $('#div_quit').hide(); 
            }
            else
            {
                $('#div_quit').hide(); 
                $('#divq_back').hide(); 
            }

            $('#quitlist').hide();
            $('#quitdetail').show();
        });


  		/*
        * 调宿 审批
        */
        $(page).on('click','.btn_quitapproval',function(){
            var id = $('#quit_id').val();  
            var adminId = sessionStorage.adminId;       
            $.confirm('确认要审批通过这条记录吗?', function () {
                getquitout(id,adminId,1);
            }); 
        });



            function getquitout(id,adminId,statusid,value)
            {
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=checkoutroombatchcheck", 
                {
                    schoolcode:hqb.schoolcode,outroomids:id,createbyid:adminId,createrol:1,status:statusid,memo:value,
                }, function(res) 
                {
                    if (res.code == 0) 
                    {
                        if(statusid == 0)
                        {
                            $.alert('审批成功');
                        }
                        else if(statusid == 2)
                        {
                            $.alert('取消成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        quitlist();
                        $('#quitlist').show();
                        $('#quitdetail').hide(); 
                        $('#quitnone').hide();
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
            }
  

        /*
        * 调宿 驳回
        */
        $(page).on('click','.btn_quitoverrule',function(){
            var id = $('#quit_id').val();  
            var adminId = sessionStorage.adminId;   
             $.prompt('请输入驳回理由', function (value) {
                getquitout(id,adminId,3,value); 
             });   
        });


	});
 

	//初始化
	$.init();

});
