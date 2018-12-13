'use strict';
 
$(function () { 

	 var studentName = '';
	 var studentNumber ='';
	 var cmbcampus ;  // =  document.getElementById('campus');
	 var cmblivearea;  // = document.getElementById('livearea');
     var cmbflat ;  //= document.getElementById('flat');
     var cmdroom ;  //= document.getElementById('room');
     var cmdbed ;  //= document.getElementById('bed');
     var campuslist = '';
     var livearealist = '';
     var flatlist = '';
     var roomlist='';
     var bedlist='';
     var studentkey='';
     //window.addEventListener("hashchange", myFunction);
     // function myFunction() {
     //   location.reload();
     // }
     var url = [];

     $(document).on("pageInit", "#graduation-search", function(e, id, page) { 
       cmbcampus =  document.getElementById('campus');
       cmblivearea = document.getElementById('livearea');
       cmbflat = document.getElementById('flat');
       cmdroom = document.getElementById('room');
       cmdbed = document.getElementById('bed');
        //初始加载
        Isbinding();

        function addback(v)
        {
            var json={time:new Date().getTime()};  
            window.history.pushState(json,"",hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=index&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"#"+v); 
        }

        //我要调宿
        $(page).on('click','.mychange',function(){                   
            addback(1);
            url.push(1);
        });

        //我要退宿
        $(page).on('click','.myquit',function(){      
            addback(2);
            url.push(2);
        });




        /*$(page).on('click','.back',function (){
            // location.href.split('#')[1] * 1 -1;
            //location.hash = location.href.split('#')[1] * 1 -1;
            //var x = "锚部分现在为: " + location.hash;
                //document.getElementById("demo").innerHTML = x;


            // $.router.back();
           // $('.buttons-tab a').eq( location.href.split('#')[1] * 1 -1 ).trigger('click');
        });*/
 


 

        $(page).on('click','.home',function(){
            $.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=index&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"#1", true); 
        });


        
        //我的申请 刷新
        $(page).on('click','.applytab',function(){

            Isbinding();
            $('#applylist').show();
            $('#ui_apply').show();
            $('#changedetail').hide();
            $('#quitdetail').hide();
            addback(3);
            url.push(3);
        });



        //调宿 取消申请
        $(page).on('click','.btn_cancel',function (){
            var id = $('#apply_id').val();

            $.confirm('确认要取调宿消申请吗?', function () { 
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=change_batchcheck", 
                {
                    schoolcode:hqb.schoolcode,changeids:id,createbyid:studentkey,createrol:0,status:2,
                }, function(res) 
                {
                    if(res.code == 0)
                    {
                            $.alert('调宿取消成功！');
                            Isbinding();
                            $('#applylist').show();
                            $('#ui_apply').show();
                            $('#changedetail').hide();
                            $('#quitdetail').hide(); 
                    }
                    
                }, 'json'); 
            });

             
           

        });
        //退宿 取消申请
        $(page).on('click','.btn_quitcancel',function(){

            var id = $('#quitapply_id').val();

             $.confirm('确认要取消退宿申请吗?', function () {
                    $.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=quit_checkoutroom", 
                    {
                        schoolcode:hqb.schoolcode,outroomids:id,createbyid:studentkey,createrol:0,status:2,
                    }, function(res) 
                    {
                        console.log(res);
                        if (res.code == 0) 
                        { 
                                $.alert('退宿取消成功'); 
                                Isbinding();
                                $('#applylist').show();
                                $('#ui_apply').show();
                                $('#changedetail').hide();
                                $('#quitdetail').hide();  
                        }
                        
                    }, 'json'); 
            });

        });


        //我的申请  调宿  详细
        function changedetail(id,type,status)
        {
            $.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=get_detail_bykey", 
                {
                    changeid:id,              
                }, function(res) 
                {
                    console.log(res);
                    var arr=new Array();
                    if (res.code == 0) 
                    {
                       arr = res.data.classPath.split('-');
                    }

                    $('#item_type').html('<b>'+type+'</b>');
                    $('#item_status').html(status);


                    $('#div_name').html(res.data.name);
                    $('#div_studentNumber').html(res.data.studentNumber);
                    $('#div_college').html(arr[0]);
                    $('#div_class').html(res.data.classPath);
                    $('#div_oldRoomPath').html(res.data.oldRoomPath);
                    $('#div_newRoomPath').html(res.data.newRoomPath);
                    $('#div_memo').html(res.data.memo);

                    if(res.data.roomsize != ''){
                        $("#div_roomsize").html(res.data.roomsize+"人间");
                    } 

                    $("#div_otherask").html(res.data.otherask);
                    
                    $('#apply_id').val(id); 
                    if(res.data.status  == 4 || res.data.status  == 0 )
                    {
                        $('#div_apply').show();
                    }  
                    else
                    {
                         for(var i =0;i<res.data.recordList.length;i++)
                         {
                            if (res.data.recordList[i].recordStatus == 3) 
                            {
                                $('#div_back').show();
                                $('#div_recordMemo').html(res.data.memo);
                            }
                         }
                         $('#div_apply').hide();
                    }

                    $('#changedetail').show();
                    $('#quitdetail').hide();
                    $('#ui_apply').hide();

                }, 'json');  
        }



        //点击列表
     	$(page).on('click','.item_detail',function(){

            var id = $(this).attr('data-id');
            var type = $(this).attr('data-type');
            var status = $(this).attr('data-status');
            //var type = $('#type_'+id).val();
            //var status = $('#status_'+id).val();

            //data-quit-id


            if (type == '调宿')
            {
                changedetail(id,type,status);
            }



            if (type =='退宿')
            {  
                 quitdetail(id,type,status);
            } 
     	});


        function quitdetail(id,type,status)
        {
            $.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=getoutrecordlist", 
                {
                    outroomid:id,              
                }, function(res) 
                {
                    console.log(res);
                    var arr=new Array();
                    if (res.code == 0) 
                    {
                       arr = res.data.classPath.split('-');
                    }
                    $('#itemq_type').html('<b>'+type+'</b>');
                    $('#itemq_status').html(status);

                    $('#q_name').html(res.data.name);
                    $('#q_studentNumber').html(res.data.studentNumber);
                    $('#q_college').html(arr[0]);
                    $('#q_class').html(arr[1]+'-'+arr[2]);
                    $('#q_roomPath').html(res.data.roomPath);
                     
                    $('#q_memo').html(res.data.memo);


                    $('#quitapply_id').val(id); 
                    if(res.data.status  == 4 || res.data.status  == 0 )
                    {
                        $('#div_quitapply').show();
                    }  
                    else
                    {
                         for(var i =0;i<res.data.recordList.length;i++)
                         {
                            if (res.data.recordList[i].recordStatus == 3) 
                            {
                                $('#div_backquit').show();
                                $('#q_recordMemo').html(res.data.memo);
                            }
                         }
                         $('#div_quitapply').hide();
                    }

                    $('#changedetail').hide();
                    $('#quitdetail').show();
                    $('#ui_apply').hide();

                }, 'json'); 
        }


     	//我要调宿 申请
     	$(page).on('click','.btn_change',function(){
     		var campusid = $('#campus').val();if (campusid == '') {$.alert('请选择校区');return false;}
     		var liveareaid = $('#livearea').val();if (liveareaid == '') {$.alert('请选择生活区');return false;}
     		var flatid = $('#flat').val(); if (flatid =='') {$.alert('请选择楼栋');return false;}
            var roomid = $('#room').val();if (roomid =='') {$.alert('请选择寝室');return false;}


            var typemessage = $('#roomsize').val();
            if(typemessage == ''){
                $.alert('请选择户型');
                return false;
            }
            var typeArr = typemessage.split('_');

            var roomsize = typeArr[1];
     		var typeid   = typeArr[0];
     		// var bedid = $('#bed').val();if(bedid ==''){$.alert('请选择床位');return false;}

     		var schoolcode = hqb.schoolcode;
            var studentnumber = $('#studentNumber').val();
     	    var otherask = $('#otherask').val();
     		var oldbedid = $('#oldbedId').val();
     		// var newbedid  = $('#bed').val();
     		var createbyid = schoolcode+'_'+studentnumber;
     		var createrol = 0;
     		var memo = $('#memo').val();

     		$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=add_change", 
	     	{
	     	    schoolcode:schoolcode,studentnumber:studentnumber,oldbedid:oldbedid,createbyid:createbyid,createrol:createrol,memo:memo,roomsize:roomsize,typeid:typeid,otherask:otherask   
	        }, function(res) 
	        {
                console.log(res);
	        	if (res.code == 0) 
	        	{
	        		$.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=Jump&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);
                    //changedetail(res.data.changeId,'调宿','待审核'); 
	        	}
                else 
                {
                    $.alert(res.msg);
                    return false;
                }
	        }, 'json');   
		});



        //我要退宿  申请
		$(page).on('click','.btn_quit',function(){ 

     		var schoolcode = hqb.schoolcode;
     		var studentnumber = $('#studentNumber_tab2').val();
     		var bedid = $('#bedId_tab2').val();

     		var createbyid = schoolcode+'_'+studentnumber;
     		var createrol = 0;
     		var memo = $('#memo_tab2').val();

     		$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=addoutroom", 
	     	{
	     	    schoolcode:schoolcode,studentnumber:studentnumber,bedid:bedid,createbyid:createbyid,createrol:createrol,memo:memo,   
	        }, function(res) 
	        {
	        	if (res.code == 0) 
	        	{
	        		$.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=Jump&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);	
	        	}
	        	else if (res.code == 300004)
	        	{
	        		$.alert(res.msg);
                    return false;
	        	}
	        }, 'json');   
		});



     	//选择校区
     	$(page).on('change','#campus',function(){

     		var campusid = $(this).val();

     		for(var i=0; i<campuslist.length; i++)
            {
                 if (campusid == campuslist[i].campusId) 
                 {
                    livearealist = campuslist[i].liveAreaList;
                 }
            }

            cmblivearea.options.length=0;
            cmbAddOption(cmblivearea,'', '请选择生活区'); 

            cmbflat.options.length=0;
            cmbAddOption(cmbflat,'', '请选择楼栋'); 

			cmdroom.options.length=0;
            cmbAddOption(cmdroom,'', '请选择寝室'); 

            cmdbed.options.length=0;
            cmbAddOption(cmdbed,'', '请选择床位'); 
            
            if (campusid == '') 
            { 
                return false;                 
            } 
 

            for (var i =0; i<livearealist.length; i++) 
            {
                cmbAddOption(cmblivearea,livearealist[i].liveAreaId,livearealist[i].title);   
            }  
     	}); 


     	//选择生活区
     	$(page).on('change','#livearea',function(){

     		var liveareaid = $(this).val();

     		for(var i=0; i<livearealist.length; i++)
            {
                 if (liveareaid == livearealist[i].liveAreaId) 
                 {
                    flatlist = livearealist[i].flatList;
                 }
            }

 
            cmbflat.options.length=0;
            cmbAddOption(cmbflat,'', '请选择楼栋'); 

            cmdroom.options.length=0;
            cmbAddOption(cmdroom,'', '请选择寝室'); 

            cmdbed.options.length=0;
            cmbAddOption(cmdbed,'', '请选择床位'); 
           
            for (var i =0; i<flatlist.length; i++) 
            {
                cmbAddOption(cmbflat,flatlist[i].flatId,flatlist[i].title);   
            } 
     	}); 


     	$(page).on('change','#flat',function(){

     		var flatid = $(this).val();
     		$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=get_empty_bedlist",  //根据楼栋ID 获取空寝室和 床位
	     	{
	     	    flatid:flatid, roomname:'',             
	        }, function(res) 
	        {
	        	console.log(res); 
	            cmdroom.options.length=0;
	            cmbAddOption(cmdroom,'', '请选择寝室'); 

	            cmdbed.options.length=0;
                cmbAddOption(cmdbed,'', '请选择床位'); 

	            roomlist = res.data;
	           
	            for (var i =0; i<res.data.length; i++) 
	            {
	                cmbAddOption(cmdroom,roomlist[i].roomId,roomlist[i].roomNum);   

	            } 


	        }, 'json');  
     	});


		$(page).on('change','#room',function(){

     		var roomid = $(this).val();

     	    cmdbed.options.length=0;
	        cmbAddOption(cmdbed,'', '请选择床位'); 


     		for(var i=0; i<roomlist.length; i++)
            {
                 if (roomid == roomlist[i].roomId) 
                 {
                    bedlist = roomlist[i].bedlist;
                 }
            }

            for (var i =0; i<bedlist.length; i++) 
	        {
	            cmbAddOption(cmdbed,bedlist[i].bedId,bedlist[i].bedNum);   
	        }  
     		 
     	});

        $('.buttons-tab a').eq( location.href.split('#')[1] * 1 -1 ).trigger('click');

     });




     //判断是否绑定
     function Isbinding()
     {
     	$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=Isbinding", 
     	{
     	    schoolcode:hqb.schoolcode,openid:hqb.openid,              
        }, function(res) 
        { 
            if(res.code == 40013)
            {            	 
            	 $.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=Studentbinding&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);
            	 $.confirm(res.msg, function () { 

			     }); 
            }
            else
            {
            	$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=getliststudentsummer",
            	{
					schoolcode:hqb.schoolcode,openid:hqb.openid,  
            	},function (res)
            	{  
                    //studentNumber
					$('#name').val(res.data.Name); //姓名
	            	$('#studentNumber').val(res.data.studentNumber);//学号
	            	$('#collegeName').val(res.data.collegeName); //学院
	            	$('#className').val(res.data.className); //班级
	            	$('#bedName').val(res.data.bedName); //原床位
	            	$('#oldbedId').val(res.data.bedId);//床位ID

					$('#name_tab2').val(res.data.Name); //姓名
	            	$('#studentNumber_tab2').val(res.data.studentNumber);//学号
	            	$('#collegeName_tab2').val(res.data.collegeName); //学院
	            	$('#className_tab2').val(res.data.className); //班级
	            	$('#bedName_tab2').val(res.data.bedName); //原床位
	            	$('#bedId_tab2').val(res.data.bedId);//床位ID 
	            	$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=getFloorList",
	            	{
						schoolcode:hqb.schoolcode,  
	            	},function (data)
	            	{
	            		 // console.log(data);
	                     // cmbcampus.options.length=0;
	                     // cmbAddOption(cmbcampus,'', '请选择校区');  

	                     // cmblivearea.options.length=0;
	                     // cmbAddOption(cmblivearea,'', '请选择生活区');  

	                     // cmbflat.options.length=0;
	                     // cmbAddOption(cmbflat,'', '请选择楼栋');  

	                     // campuslist = data.cmpusList;
                         

	                     // // console.log(campuslist);
	                     // for(var i=0; i<campuslist.length; i++)
	                     // {                          
	                     //    cmbAddOption(cmbcampus, campuslist[i].campusId, campuslist[i].title);  
	                     // }  
                        

                          studentkey =hqb.schoolcode +"_"+ res.data.studentNumber;
                           
                            $.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=get_applylist_bykey", 
                            {
                                schoolcode:hqb.schoolcode,studentkey:studentkey,              
                            }, function(res) 
                            {
                                console.log(res); 
                                $("#ui_apply").find("li").remove();
                                var data = res.data;
                                var html ='';
                                for(var i =0; i<data.length;i++)
                                {
                                    html+='<li> ';                           
                                    html+='<a class="item-link item-content item_detail" data-id ="'+data[i].ID+'" data-status ="'+data[i].status+'"  data-type="'+data[i].type+'">';                            
                                    html+='<div class="item-inner">';
                                    html+='<div class="item-title-row">';
                                    html+='<div class="item-title"><b>'+data[i].type+'</b></div>';
                                    html+='<div class="item-after" style="margin-left: 0px;font-size: 12px;">'+data[i].addTime+'</div>';                           
                                    html+='</div>';
                                    if(data[i].statusId == 4) //待审核
                                    {
                                        html+='<div class="item-subtitle" style="color: #000;">'+data[i].status+'</div>';
                                    }
                                    else if (data[i].statusId == 0)  //待审批
                                    {
                                        html+='<div class="item-subtitle" style="color: #1a9bfc;">'+data[i].status+'</div>';
                                    }
                                    else if(data[i].statusId == 1) //已审批
                                    {
                                        html+='<div class="item-subtitle" style="color:#50b430;">'+data[i].status+'</div>';
                                    }
                                    else if (data[i].statusId == 2) //已取消
                                    {
                                        html+='<div class="item-subtitle" style="color:#d7d7d7;">'+data[i].status+'</div>';
                                    }
                                    else if (data[i].statusId == 3) //已驳回
                                    {
                                        html+='<div class="item-subtitle" style="color:#f68329;">'+data[i].status+'</div>';
                                    }

                                    
                                    html+='</div>';

                                    html+='</a>';
                                    html+=' </li> ';
                                }
                                $("#ui_apply").append(html);


                            }, 'json'); 



	            	},'json');

                   

            	},'json');

            
            }        
        }, 'json'); 
     }

	   function liveareachange(liveareaid)
       {
            for(var i=0; i<livearealist.length; i++)
            {
                 if (liveareaid == livearealist[i].liveAreaId) 
                 {
                    flatlist = livearealist[i].flatList;
                 }
            }

 
            cmbflat.options.length=0;
            cmbAddOption(cmbflat,'', '请选择楼栋'); 
           
            for (var i =0; i<flatlist.length; i++) 
            {
                cmbAddOption(cmbflat,flatlist[i].flatId,flatlist[i].title);   
            }  
       }
 

        function cmbAddOption(cmb, str, obj)
        {
             var option = document.createElement("OPTION");
             cmb.options.add(option);
             option.innerHTML = obj; 
             option.value = str;
             option.obj = obj;
        } 



     $(document).on("pageInit", "#Student_binding", function(e, id, page) { 
 			//绑定学生
			$(page).on('click','.button-bind',function(){
		     		var studentName = $('#studentName').val();
		     		var studentNumber = $('#studentNumber').val();
		     		$.post(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=bindmessage", {
                	studentName: studentName,studentNumber:studentNumber,schoolcode:hqb.schoolcode,openid:hqb.openid,                
                	}, function(res) {
                    console.log(res); 
                    if (res.code == '40011') 
                    {
                    	 $.alert(res.msg);
                    	 return false;
                    }
                    else
                    {
                    	$.alert(res.msg);
                    	$.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=index&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);

                    	//Isbinding();
                    }
                    
                }, 'json');
				
			})  
     });

     //加载添加成功
    $(document).on("pageInit", "#page-success", function(e, id, page) { 
       setInterval(function(){   
           $.router.load(hqb.root+"/index.php?m=Apartment&c=SwapForeign&a=index&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"#3", true); 
       },2000); 

     });






    // 初始化入口
    $.init();

});
