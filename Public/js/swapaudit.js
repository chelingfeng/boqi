'use strict';
 
$(function () {   
     $(document).on("pageInit", "#useraccount_login", function(e, id, page) { 

            $(page).on('click','.button-login',function(){
                var useraccount = $('#useraccount').val(); 
                if (useraccount == '') {$.alert('请输入账号');return false;}

                var password = $('#password').val();
                if (password == '') {$.alert('请输入密码');return false;}
               


                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=accountlogin", 
                {
                    useraccount:useraccount,password:password,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    { 
                        $.router.load(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=index&schoolcode="+hqb.schoolcode+"&token="+hqb.token, true);
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


         //调宿 列表
         function ChangeList()
         {  
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=ChangeList", 
                {
                    schoolcode:hqb.schoolcode,orderflag:1,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {
                        $("#changeaudit").find("li").remove();
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
                          
                            if (data[i].statusId == 4)   
                            {
                                html+='<div class="item-subtitle" style="color: red;">'+data[i].statusName+'</div>';
                            }
                            else 
                            {
                                html+='<div class="item-subtitle" style="color:#000;">'+data[i].statusName+'</div>';
                            }
                           

                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#changeaudit").append(html);
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }  
                }, 'json'); 
        }

         //退宿 列表
        function QuitList()
        {
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=QuitList", 
                {
                    schoolcode:hqb.schoolcode,orderflag:1,
                }, function(res) 
                {
                    console.log(res);
                    if(res.code == 0)
                    {  
                        $("#quitaudit").find("li").remove();
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
                            if(data[i].statusId == 4) //待审核
                            {
                                html+='<div class="item-subtitle" style="color: red;">'+data[i].statusName+'</div>';
                            }
                            else
                            {
                                html+='<div class="item-subtitle" style="color: #000;">'+data[i].statusName+'</div>';
                            }
                            

                            html+='</div>';
                            html+='</a>';
                            html+=' </li> ';
                        }
                        $("#quitaudit").append(html);
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }  
                }, 'json'); 
         }
 
     //加载index页面
     $(document).on("pageInit", "#audit-search", function(e, id, page) { 

         ChangeList();
         QuitList();

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
            $('#div_oldRoomPath').html(oldroompath);
            $('#div_newRoomPath').html(newroompath);
            $('#div_memo').html(memo); 
            $('#change_id').val(id); 


                      

            if (statusid == 4) 
            {
                $('#div_change').show();
                $('#div_changecancel').hide();
                $('#div_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_change').hide();
                $('#div_changecancel').show();
                $('#div_back').hide(); 
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
                                $('#div_recordMemo').html(res.data.recordList[i].recordMemo);
                            } 
                        }

                    }, 'json');   

                $('#div_back').show(); 
                $('#div_change').hide();
                $('#div_changecancel').hide();
            }
            else
            {
                $('#div_change').hide();
                $('#div_changecancel').hide();
                $('#div_back').hide(); 
            }

            $('#changelist').hide();
            $('#changedetail').show();
         });


 

        /*
        * 点击调宿
        */
        $(page).on('click','.mychange',function(){
            ChangeList();
            $('#changelist').show();
            $('#changedetail').hide();
        });


        /*
        * 点击退宿
        */
        $(page).on('click','.myquit',function(){
            QuitList();
            $('#quitlist').show();
            $('#quitdetail').hide();
        });
 

        /*
        * 调宿 审核
        */
        $(page).on('click','.btn_audit',function(){
            var id = $('#change_id').val();  
            var adminId = sessionStorage.adminId;       
            $.confirm('确认要审核通过这条记录吗?', function () {

                getchangeout(id,adminId,0);

            }); 
        });



            function getchangeout(id,adminId,statusid,memo)
            {
                $.post(hqb.root+"/index.php?m=Apartment&c=SwapAudit&a=chagebatchcheck", 
                {
                    schoolcode:hqb.schoolcode,changeids:id,createbyid:adminId,createrol:1,status:statusid,memo:memo,
                }, function(res) 
                {
                    if (res.code == 0) 
                    {
                        if(statusid == 0)
                        {
                            $.alert('审核成功');
                        }
                        else if(statusid == 2)
                        {
                            $.alert('取消成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        ChangeList();
                        $('#changelist').show();
                        $('#changedetail').hide(); 
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
            }

        /*
        * 调宿 取消
        */
        $(page).on('click','.btn_changecancel',function(){
            var id = $('#change_id').val();  
            var adminId = sessionStorage.adminId;       
            $.confirm('确认要取消这条记录吗?', function () {
                getchangeout(id,adminId,2);
            });  
        });


        /*
        * 调宿 驳回
        */
        $(page).on('click','.btn_overrule',function(){
            var id = $('#change_id').val();  
            var adminId = sessionStorage.adminId;   
            $.prompt('请输入驳回理由', function (value) {
                getchangeout(id,adminId,3,value);
            });    
            /*$.confirm('确认要驳回这条记录吗?', function () {
                getchangeout(id,adminId,3);
            }); */ 
        });



        /************************以下退宿*************************************/
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
                $('#div_quit').show();
                $('#div_quitcancel').hide();
                $('#divq_back').hide(); 
            }
            else if (statusid == 0)
            {
                $('#div_quit').hide();
                $('#div_quitcancel').show();
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
                $('#div_quitcancel').hide();
            }
            else
            {
                $('#div_quit').hide();
                $('#div_quitcancel').hide();
                $('#divq_back').hide(); 
            }

            $('#quitlist').hide();
            $('#quitdetail').show();
        });




        /*
        * 调宿 审核
        */
        $(page).on('click','.btn_quitaudit',function(){
            var id = $('#quit_id').val();  
            var adminId = sessionStorage.adminId;       
            $.confirm('确认要审核通过这条记录吗?', function () {
                getquitout(id,adminId,0);
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
                            $.alert('审核成功');
                        }
                        else if(statusid == 2)
                        {
                            $.alert('取消成功');
                        }
                        else if(statusid == 3)
                        {
                            $.alert('驳回成功');
                        }
                        
                        QuitList();
                        $('#quitlist').show();
                        $('#quitdetail').hide(); 
                    }
                    else
                    {
                        $.alert(res.msg);
                        return false;
                    }

                }, 'json'); 
            }

        /*
        * 调宿 取消
        */
        $(page).on('click','.btn_quitcancel',function(){
            var id = $('#quit_id').val();  
            var adminId = sessionStorage.adminId;       
            $.confirm('确认要取消这条记录吗?', function () {
                getquitout(id,adminId,2);
            });  
        });


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


    

    
    // 初始化入口
    $.init();

});
