'use strict';
 
$(function () { 

     $(document).on("pageInit","#dorm-search",function(e,id,page){

          // 搜索按钮
            $(page).on('click', '.button-search', function(){

                var username = $('#username').val(); 
                if (username == '') 
                {
                    $.alert('请输入姓名');
                    $("input[name='username']").focus();
                    return false;
                }
                var cardedid = $('#cardedid').val();
                if (cardedid == '') 
                {
                    $.alert('请输入身份证后六位');
                    $("input[name='cardedid']").focus();
                    return false;
                }
                $.post(hqb.root+"/index.php?m=Apartment&c=Dorm&a=getsearch_student_info", {
                    name: username,identitycard:cardedid,schoolcode:hqb.schoolcode,               
                }, function(res) {
                    console.log(res); 
                     if (res != null && res.code == 0) 
                     {
                        $('#d_Notstudent,#div_search').hide(); 
                        $('#div_detail').show(); 

                        $('#d_studentName').html(res.data.name);
                        $('#d_studentNumber').html(res.data.studentNumber);
                        $('#d_collegeName').html(res.data.collegeName);
                        $('#d_className').html(res.data.className);
                        $('#d_bedName').html(res.data.bedpath);   

                         //$('#div_search,#div_detail').hide();
                         //$('#d_Notstudent').show();    
                     }
                     else 
                     { 
                         $('#div_search,#div_detail').hide();
                         $('#d_Notstudent').show();                
                     } 
                    
                    
                }, 'json');

            });


            $(page).on('click','.button-sure',function(){           
                      Isdisplay();          
            });


            $(page).on('click','.button-nostudent',function(){           
                      Isdisplay();                 
            });


            function Isdisplay()
            {
                $('#div_search').show();
                $('#div_detail,#d_NotPay,#d_YesPay,#d_Notstudent').hide();
            }

     })

     $(document).on("pageInit", "#graduation-search", function(e, id, page) {
           // 搜索按钮
            $(page).on('click', '.button-search', function(){
                var strValue = $('#txt_Value').val(); 
                $.post(hqb.root+"/index.php?m=Apartment&c=Dorm&a=getstudentmsg", {
                strValue: strValue,schoolcode:hqb.schoolcode,             
                }, function(res) {
                    console.log(res); 
                     if (res != null && res.code == 0) 
                     {
                        $('#d_Notstudent,#div_search').hide(); 
                        $('#div_detail').show(); 

                        $('#d_studentName').html(res.data.name);
                        $('#d_studentNumber').html(res.data.studentNumber);
                        $('#d_collegeName').html(res.data.collegeName);
                        $('#d_className').html(res.data.className);
                        $('#d_bedName').html(res.data.bedpath);   

                         //$('#div_search,#div_detail').hide();
                         //$('#d_Notstudent').show();    
                     }
                     else 
                     { 
                         $('#div_search,#div_detail').hide();
                         $('#d_Notstudent').show();                
                     }
                     
                    
                    
                }, 'json');

            });


            $(page).on('click','.button-sure',function(){           
                      Isdisplay();          
            });


            $(page).on('click','.button-nostudent',function(){           
                      Isdisplay();                 
            });


            function Isdisplay()
            {
                $('#div_search').show();
                $('#div_detail,#d_NotPay,#d_YesPay,#d_Notstudent').hide();
            }

     });


    // 初始化入口
    $.init();

});
